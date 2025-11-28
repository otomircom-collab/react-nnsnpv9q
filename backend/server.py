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


async def scrape_hangifiltre(url: str, task_id: str):
    """Scrape products from hangifiltre.com with pagination support"""
    try:
        scraping_tasks[task_id] = {
            "status": "processing",
            "progress": 0,
            "total_products": 0,
            "products": [],
            "error": None
        }
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            )
            page = await browser.new_page()
            
            all_products = []
            current_page = 1
            max_pages = 100  # Limit to 100 pages to avoid timeout (100 pages = ~1,600 products)
            
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
                    await page.goto(page_url, wait_until="networkidle", timeout=60000)
                    
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
        products = []
        
        # Find all product items
        product_items = soup.select('.product-grid-item, .product-item, .product, li.product')
        
        scraping_tasks[task_id]["total_products"] = len(product_items)
        
        for idx, item in enumerate(product_items):
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
                    # Remove 'Orijinal fiyat' and 'Şu andaki fiyat' text
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
                    sku="N/A",  # SKU typically needs detail page visit
                    price=price,
                    old_price=old_price,
                    stock_status="Stokta",
                    image_url=image_url,
                    product_url=product_url
                )
                
                products.append(product)
                scraping_tasks[task_id]["progress"] = int((idx + 1) / len(product_items) * 100)
                scraping_tasks[task_id]["products"] = products
                
            except Exception as e:
                logging.error(f"Error extracting product: {str(e)}")
                continue
        
        scraping_tasks[task_id]["status"] = "completed"
        scraping_tasks[task_id]["progress"] = 100
        
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


@api_router.post("/scrape", response_model=ScrapeResponse)
async def scrape_website(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """Start scraping a website"""
    task_id = str(uuid.uuid4())
    
    # Start scraping in background
    background_tasks.add_task(scrape_hangifiltre, request.url, task_id)
    
    return ScrapeResponse(
        task_id=task_id,
        status="started",
        message="Scraping başlatıldı"
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