from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
import requests
from io import BytesIO
from universal_scraper import UniversalScraper


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# In-memory storage for scraping tasks
scraping_tasks = {}


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ScrapeRequest(BaseModel):
    url: str
    scrape_all_categories: bool = False
    fetch_sku: bool = False
    only_in_stock: bool = True


class Product(BaseModel):
    name: str
    brand: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[str] = None
    old_price: Optional[str] = None
    stock_status: Optional[str] = None
    image_url: Optional[str] = None
    product_url: Optional[str] = None


class ScrapeResponse(BaseModel):
    task_id: str
    status: str
    message: str


class ScrapeStatus(BaseModel):
    task_id: str
    status: str
    progress: int
    total_products: int
    products: List[Product]
    error: Optional[str] = None


async def fetch_product_sku(page, product_url: str) -> str:
    """Fetch SKU from product detail page"""
    try:
        await page.goto(product_url, wait_until="networkidle", timeout=30000)
        await asyncio.sleep(0.5)
        
        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        # Look for SKU in product page
        sku_elem = soup.select_one('.sku, .product_meta .sku')
        if sku_elem:
            sku_text = sku_elem.get_text(strip=True)
            # Extract SKU value
            if ':' in sku_text:
                return sku_text.split(':')[1].strip()
            return sku_text
        
        return "N/A"
    except Exception as e:
        logging.error(f"Error fetching SKU from {product_url}: {str(e)}")
        return "N/A"


async def scrape_single_category(page, category_url: str, category_name: str, task_id: str) -> list:
    """Scrape all products from a single category"""
    all_products = []
    current_page = 1
    max_pages = 2000
    consecutive_empty_pages = 0
    
    base_url = category_url.rstrip('/')
    
    while current_page <= max_pages:
        try:
            if current_page == 1:
                page_url = category_url
            else:
                page_url = f"{base_url}/page/{current_page}/"
            
            # Try to load page
            retry_count = 0
            max_retries = 2
            page_loaded = False
            
            while retry_count < max_retries and not page_loaded:
                try:
                    await page.goto(page_url, wait_until="networkidle", timeout=60000)
                    page_loaded = True
                except Exception as e:
                    retry_count += 1
                    if retry_count >= max_retries:
                        raise
                    await asyncio.sleep(1)
            
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(0.5)
            
            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            page_products = []
            product_items = soup.select('.product-grid-item, .product-item, .product, li.product')
            
            for item in product_items:
                try:
                    name_elem = item.select_one('.woocommerce-loop-product__title, .product-title, h2, h3')
                    name = name_elem.get_text(strip=True) if name_elem else None
                    
                    if not name:
                        continue
                    
                    link_elem = item.select_one('a')
                    product_url = link_elem.get('href', '') if link_elem else ''
                    
                    price_elem = item.select_one('.price ins .amount, .price .amount, .price')
                    price = "N/A"
                    if price_elem:
                        price_text = price_elem.get_text(strip=True)
                        price = price_text.split(':')[-1].strip() if ':' in price_text else price_text
                    
                    old_price_elem = item.select_one('.price del .amount')
                    old_price = "N/A"
                    if old_price_elem:
                        old_price_text = old_price_elem.get_text(strip=True)
                        old_price = old_price_text.split(':')[-1].strip() if ':' in old_price_text else old_price_text
                    
                    img_elem = item.select_one('img')
                    image_url = img_elem.get('src', img_elem.get('data-src', 'N/A')) if img_elem else "N/A"
                    
                    product = Product(
                        name=name,
                        brand=category_name,
                        sku="N/A",
                        price=price,
                        old_price=old_price,
                        stock_status="Stokta",
                        image_url=image_url,
                        product_url=product_url
                    )
                    
                    page_products.append(product)
                    
                except Exception as e:
                    logging.error(f"Error extracting product: {str(e)}")
                    continue
            
            if len(page_products) == 0:
                consecutive_empty_pages += 1
                if consecutive_empty_pages >= 2:
                    break
            else:
                consecutive_empty_pages = 0
                all_products.extend(page_products)
            
            # Check for next page
            has_next = soup.select_one('a.next.page-numbers, a[rel="next"]')
            if not has_next and current_page > 1:
                break
            
            current_page += 1
            await asyncio.sleep(0.3)
            
        except Exception as e:
            logging.error(f"Error on page {current_page}: {str(e)}")
            consecutive_empty_pages += 1
            if consecutive_empty_pages >= 3:
                break
            current_page += 1
            continue
    
    return all_products


async def get_all_categories(page, base_url: str) -> list:
    """Get all sub-categories from a category page"""
    try:
        await page.goto(base_url, wait_until="networkidle", timeout=30000)
        await asyncio.sleep(1)
        
        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        categories = []
        category_items = soup.select('.product-category')
        
        for item in category_items:
            link_elem = item.select_one('a')
            name_elem = item.select_one('h2, h3, .woocommerce-loop-category__title')
            
            if link_elem and name_elem:
                url = link_elem.get('href', '')
                name = name_elem.get_text(strip=True)
                
                if url and name:
                    categories.append({'name': name, 'url': url})
        
        return categories
    except Exception as e:
        logging.error(f"Error getting categories from {base_url}: {str(e)}")
        return []


async def scrape_hangifiltre(url: str, task_id: str, scrape_all_categories: bool = False, 
                             fetch_sku: bool = False, only_in_stock: bool = True):
    """Scrape products from hangifiltre.com with pagination support"""
    try:
        scraping_tasks[task_id] = {
            "status": "processing",
            "progress": 0,
            "total_products": 0,
            "products": [],
            "error": None,
            "message": "Başlatılıyor..."
        }
        
        # If scrape_all_categories is True, discover and scrape all categories
        if scrape_all_categories:
            scraping_tasks[task_id]["status"] = "discovering_categories"
            scraping_tasks[task_id]["message"] = "Kategoriler keşfediliyor..."
            
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                )
                page = await browser.new_page()
                
                # Get all main categories
                await page.goto(url, wait_until="networkidle", timeout=60000)
                await asyncio.sleep(1)
                
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                categories = []
                category_items = soup.select('.product-category')
                
                for item in category_items:
                    link_elem = item.select_one('a')
                    name_elem = item.select_one('h2, h3')
                    
                    if link_elem and name_elem:
                        cat_url = link_elem.get('href', '')
                        cat_name = name_elem.get_text(strip=True)
                        
                        if cat_url and cat_name:
                            categories.append({'name': cat_name, 'url': cat_url})
                
                logging.info(f"Found {len(categories)} categories to scrape")
                scraping_tasks[task_id]["message"] = f"{len(categories)} kategori bulundu"
                
                # Scrape each category
                all_category_products = []
                
                for idx, category in enumerate(categories, 1):
                    try:
                        scraping_tasks[task_id]["status"] = f"category_{idx}"
                        scraping_tasks[task_id]["message"] = f"Kategori {idx}/{len(categories)}: {category['name']}"
                        scraping_tasks[task_id]["progress"] = int((idx / len(categories)) * 100)
                        
                        # Scrape this category
                        cat_products = await scrape_single_category(
                            page, category['url'], category['name'], task_id
                        )
                        
                        all_category_products.extend(cat_products)
                        scraping_tasks[task_id]["products"] = all_category_products
                        scraping_tasks[task_id]["total_products"] = len(all_category_products)
                        
                        logging.info(f"Category {category['name']}: {len(cat_products)} products. Total: {len(all_category_products)}")
                        
                    except Exception as e:
                        logging.error(f"Error scraping category {category['name']}: {str(e)}")
                        continue
                
                await browser.close()
                
                scraping_tasks[task_id]["status"] = "completed"
                scraping_tasks[task_id]["progress"] = 100
                scraping_tasks[task_id]["message"] = f"Tamamlandı: {len(all_category_products)} ürün"
                
            return
        
        # Original single category scraping logic
        scraping_tasks[task_id] = {
            "status": "processing",
            "progress": 0,
            "total_products": 0,
            "products": [],
            "error": None,
            "message": "Başlatılıyor..."
        }
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            )
            page = await browser.new_page()
            
            all_products = []
            current_page = 1
            max_pages = 2000  # Increased limit (2000 pages = ~32,000 products max)
            consecutive_empty_pages = 0  # Track empty pages
            
            scraping_tasks[task_id]["status"] = "loading_page"
            base_url = url if not url.endswith('/') else url[:-1]
            
            while current_page <= max_pages:
                try:
                    # Construct page URL
                    if current_page == 1:
                        page_url = url
                    else:
                        page_url = f"{base_url}/page/{current_page}/"
                    
                    scraping_tasks[task_id]["status"] = f"page_{current_page}"
                    
                    # Try to load page with retry logic
                    retry_count = 0
                    max_retries = 3
                    page_loaded = False
                    
                    while retry_count < max_retries and not page_loaded:
                        try:
                            await page.goto(page_url, wait_until="networkidle", timeout=90000)
                            page_loaded = True
                        except Exception as e:
                            retry_count += 1
                            logging.warning(f"Page {current_page} load attempt {retry_count} failed: {str(e)}")
                            if retry_count >= max_retries:
                                raise
                            await asyncio.sleep(2)
                    
                    # Wait for products to load
                    try:
                        await page.wait_for_selector(".products, .product-grid-item, .product", timeout=10000)
                    except:
                        pass
                    
                    # Quick scroll to load any lazy content
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    await asyncio.sleep(1)
                    
                    scraping_tasks[task_id]["status"] = f"extracting_page_{current_page}"
                    content = await page.content()
                    
                    # Parse HTML
                    soup = BeautifulSoup(content, 'html.parser')
                    page_products = []
                    
                    # Find all product items on this page
                    product_items = soup.select('.product-grid-item, .product-item, .product, li.product')
                    
                    for item in product_items:
                        try:
                            # Extract product name
                            name_elem = item.select_one('.woocommerce-loop-product__title, .product-title, h2, h3')
                            name = name_elem.get_text(strip=True) if name_elem else "N/A"
                            
                            # Extract brand
                            brand_elem = item.select_one('.product-brand, .brand')
                            brand = brand_elem.get_text(strip=True) if brand_elem else "N/A"
                            
                            # Extract price
                            price_elem = item.select_one('.price ins .amount, .price .amount, .price')
                            if price_elem:
                                price_text = price_elem.get_text(strip=True)
                                price = price_text.split(':')[-1].strip() if ':' in price_text else price_text
                            else:
                                price = "N/A"
                            
                            # Extract old price
                            old_price_elem = item.select_one('.price del .amount')
                            if old_price_elem:
                                old_price_text = old_price_elem.get_text(strip=True)
                                old_price = old_price_text.split(':')[-1].strip() if ':' in old_price_text else old_price_text
                            else:
                                old_price = "N/A"
                            
                            # Extract image
                            img_elem = item.select_one('img')
                            image_url = img_elem.get('src', img_elem.get('data-src', 'N/A')) if img_elem else "N/A"
                            
                            # Extract product URL
                            link_elem = item.select_one('a')
                            product_url = link_elem.get('href', 'N/A') if link_elem else "N/A"
                            
                            product = Product(
                                name=name,
                                brand=brand,
                                sku="N/A",
                                price=price,
                                old_price=old_price,
                                stock_status="Stokta",
                                image_url=image_url,
                                product_url=product_url
                            )
                            
                            page_products.append(product)
                            
                        except Exception as e:
                            logging.error(f"Error extracting product: {str(e)}")
                            continue
                    
                    # Add page products to all products
                    all_products.extend(page_products)
                    scraping_tasks[task_id]["products"] = all_products
                    scraping_tasks[task_id]["total_products"] = len(all_products)
                    
                    # Update progress (dynamic based on actual pages found)
                    if current_page <= 10:
                        progress = min(int((current_page / 10) * 50), 50)
                    else:
                        progress = min(50 + int((current_page - 10) / 100 * 49), 99)
                    scraping_tasks[task_id]["progress"] = progress
                    
                    logging.info(f"Page {current_page}: {len(page_products)} products extracted. Total: {len(all_products)}")
                    
                    # Check if there are more pages
                    if len(page_products) == 0:
                        consecutive_empty_pages += 1
                        if consecutive_empty_pages >= 2:
                            logging.info(f"2 consecutive empty pages found. Stopping at page {current_page}.")
                            break
                    else:
                        consecutive_empty_pages = 0  # Reset counter
                    
                    # Check for next page link - IMPORTANT: Always check in HTML
                    has_next = soup.select_one('a.next.page-numbers, a[rel="next"], .next.page-numbers')
                    
                    # Also check if we're on the last page by looking at page numbers
                    page_numbers = soup.select('.page-numbers')
                    last_page_num = 1
                    for pn in page_numbers:
                        try:
                            num = int(pn.get_text(strip=True))
                            if num > last_page_num:
                                last_page_num = num
                        except:
                            pass
                    
                    # Stop if no next button AND we're past detected last page
                    if not has_next and current_page >= last_page_num:
                        logging.info(f"Reached last page ({last_page_num}). Total products: {len(all_products)}")
                        break
                    
                    # Safety check: if we have products but reached max_pages, still continue
                    if current_page >= max_pages:
                        logging.info(f"Reached max_pages limit ({max_pages}). Total products: {len(all_products)}")
                        break
                    
                    current_page += 1
                    
                    # Small delay between pages to avoid rate limiting
                    await asyncio.sleep(0.5)
                    
                except Exception as page_error:
                    logging.error(f"Error on page {current_page}: {str(page_error)}")
                    # Don't break immediately, try next page
                    consecutive_empty_pages += 1
                    if consecutive_empty_pages >= 3:
                        logging.error(f"3 consecutive errors/empty pages. Stopping.")
                        break
                    current_page += 1
                    await asyncio.sleep(1)
                    continue
            
            await browser.close()
            
            scraping_tasks[task_id]["status"] = "completed"
            scraping_tasks[task_id]["progress"] = 100
            scraping_tasks[task_id]["total_products"] = len(all_products)
        
    except Exception as e:
        logging.error(f"Scraping error: {str(e)}")
        scraping_tasks[task_id]["status"] = "failed"
        scraping_tasks[task_id]["error"] = str(e)


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "E-Ticaret Scraper API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


async def scrape_with_universal_scraper(url: str, task_id: str):
    """Use universal scraper for ANY website"""
    try:
        scraper = UniversalScraper(task_id, scraping_tasks)
        products = await scraper.scrape_entire_website(url)
        
        # Convert to Product models
        product_models = []
        for p in products:
            product_models.append(Product(
                name=p.get('name', 'N/A'),
                brand=p.get('brand', 'N/A'),
                sku=p.get('sku', 'N/A'),
                price=p.get('price', 'N/A'),
                old_price=p.get('old_price', 'N/A'),
                stock_status=p.get('stock_status', 'Stokta'),
                image_url=p.get('image_url', 'N/A'),
                product_url=p.get('product_url', 'N/A')
            ))
        
        scraping_tasks[task_id]["products"] = product_models
        scraping_tasks[task_id]["total_products"] = len(product_models)
        scraping_tasks[task_id]["status"] = "completed"
        scraping_tasks[task_id]["progress"] = 100
        
    except Exception as e:
        logging.error(f\"Universal scraper error: {str(e)}\")
        scraping_tasks[task_id][\"status\"] = \"failed\"
        scraping_tasks[task_id][\"error\"] = str(e)


@api_router.post(\"/scrape\", response_model=ScrapeResponse)
async def scrape_website(request: ScrapeRequest, background_tasks: BackgroundTasks):
    \"\"\"Start scraping a website - UNIVERSAL SCRAPER\"\"\"
    task_id = str(uuid.uuid4())
    
    # Use universal scraper by default
    background_tasks.add_task(scrape_with_universal_scraper, request.url, task_id)
    
    return ScrapeResponse(
        task_id=task_id,
        status=\"started\",
        message=\"T\u00fcm site taranmaya ba\u015flat\u0131ld\u0131...\"
    )


@api_router.get("/scrape/status/{task_id}", response_model=ScrapeStatus)
async def get_scrape_status(task_id: str):
    """Get scraping task status"""
    if task_id not in scraping_tasks:
        raise HTTPException(status_code=404, detail="Task bulunamadı")
    
    task = scraping_tasks[task_id]
    
    return ScrapeStatus(
        task_id=task_id,
        status=task["status"],
        progress=task["progress"],
        total_products=task["total_products"],
        products=task["products"],
        error=task.get("error")
    )


@api_router.get("/export/excel/{task_id}")
async def export_to_excel(task_id: str):
    """Export scraped data to Excel"""
    if task_id not in scraping_tasks:
        raise HTTPException(status_code=404, detail="Task bulunamadı")
    
    task = scraping_tasks[task_id]
    
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Scraping henüz tamamlanmadı")
    
    products = task["products"]
    
    if not products:
        raise HTTPException(status_code=400, detail="Ürün verisi bulunamadı")
    
    # Create DataFrame
    df = pd.DataFrame([p.dict() for p in products])
    
    # Rename columns to Turkish
    df.columns = ['Ürün Adı', 'Marka', 'Stok Kodu', 'Fiyat', 'Eski Fiyat', 'Stok Durumu', 'Görsel URL', 'Ürün URL']
    
    # Create Excel file
    output_path = f"/tmp/urunler_{task_id}.xlsx"
    
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Ürünler', index=False)
        
        # Style the worksheet
        workbook = writer.book
        worksheet = writer.sheets['Ürünler']
        
        # Header styling
        header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
        header_font = Font(bold=True, color="FFFFFF", size=12)
        
        for cell in worksheet[1]:
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
        
        # Auto-adjust column widths
        for idx, column in enumerate(df.columns, 1):
            column_letter = get_column_letter(idx)
            max_length = max(
                df[column].astype(str).map(len).max(),
                len(column)
            )
            adjusted_width = min(max_length + 2, 50)
            worksheet.column_dimensions[column_letter].width = adjusted_width
    
    return FileResponse(
        output_path,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename=f'hangifiltre_urunler_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()