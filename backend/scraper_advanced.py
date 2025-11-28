"""Advanced scraper with category discovery, SKU fetching, and detailed Excel export"""
import asyncio
from playwright.async_api import async_playwright, Page
from bs4 import BeautifulSoup
import logging
from typing import List, Dict, Optional
import re


class HangiFiltreAdvancedScraper:
    def __init__(self, task_id: str, scraping_tasks: dict):
        self.task_id = task_id
        self.scraping_tasks = scraping_tasks
        self.browser = None
        self.page = None
        
    async def initialize(self):
        """Initialize browser"""
        p = await async_playwright().start()
        self.browser = await p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        )
        self.page = await self.browser.new_page()
        
    async def close(self):
        """Close browser"""
        if self.browser:
            await self.browser.close()
    
    def update_status(self, status: str, progress: int = None, message: str = None):
        """Update scraping task status"""
        self.scraping_tasks[self.task_id]["status"] = status
        if progress is not None:
            self.scraping_tasks[self.task_id]["progress"] = progress
        if message:
            self.scraping_tasks[self.task_id]["message"] = message
            
    async def get_all_categories(self, base_url: str) -> List[Dict]:
        """Discover all categories and sub-categories"""
        try:
            self.update_status("discovering_categories", 0, "Kategoriler bulunuyor...")
            
            await self.page.goto(base_url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(1)
            
            content = await self.page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            categories = []
            category_items = soup.select('.product-category')
            
            logging.info(f"Found {len(category_items)} main categories")
            
            for item in category_items:
                link_elem = item.select_one('a')
                name_elem = item.select_one('h2, h3, .woocommerce-loop-category__title')
                
                if link_elem and name_elem:
                    url = link_elem.get('href', '')
                    name = name_elem.get_text(strip=True)
                    
                    if url and name and 'kategori' in url:
                        categories.append({
                            'name': name,
                            'url': url,
                            'type': 'main'
                        })
            
            logging.info(f"Discovered {len(categories)} categories")
            return categories
            
        except Exception as e:
            logging.error(f"Error discovering categories: {str(e)}")
            return []
    
    async def fetch_product_details(self, product_url: str) -> Dict:
        """Fetch detailed product information including SKU"""
        try:
            await self.page.goto(product_url, wait_until="networkidle", timeout=30000)
            await asyncio.sleep(0.5)
            
            content = await self.page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            details = {}
            
            # Get SKU/Stock Code
            sku_elem = soup.select_one('.sku, .product_meta .sku')
            if sku_elem:
                sku_text = sku_elem.get_text(strip=True)
                if 'Stok kodu:' in sku_text:
                    details['sku'] = sku_text.replace('Stok kodu:', '').strip()
                else:
                    details['sku'] = sku_text
            
            # Get stock status
            stock_elem = soup.select_one('.stock, .availability')
            if stock_elem:
                stock_text = stock_elem.get_text(strip=True).lower()
                details['in_stock'] = 'stokta' in stock_text or 'var' in stock_text
            else:
                details['in_stock'] = True  # Default to in stock
            
            # Get detailed description
            desc_elem = soup.select_one('.woocommerce-product-details__short-description, .product-description')
            if desc_elem:
                details['description'] = desc_elem.get_text(strip=True)
            
            # Get additional images
            images = []
            img_elems = soup.select('.woocommerce-product-gallery__image img')
            for img in img_elems[:4]:  # Max 4 images
                img_url = img.get('src') or img.get('data-src')
                if img_url and img_url.startswith('http'):
                    images.append(img_url)
            details['images'] = images
            
            return details
            
        except Exception as e:
            logging.error(f"Error fetching product details from {product_url}: {str(e)}")
            return {}
    
    async def scrape_category_page(self, url: str, page_num: int) -> List[Dict]:
        """Scrape products from a single category page"""
        try:
            if page_num == 1:
                page_url = url
            else:
                base_url = url.rstrip('/')
                page_url = f"{base_url}/page/{page_num}/"
            
            await self.page.goto(page_url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(1)
            
            # Quick scroll to load lazy images
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(0.5)
            
            content = await self.page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            products = []
            product_items = soup.select('.product-grid-item, .product-item, .product, li.product')
            
            for item in product_items:
                try:
                    # Extract basic product info
                    name_elem = item.select_one('.woocommerce-loop-product__title, .product-title, h2, h3')
                    name = name_elem.get_text(strip=True) if name_elem else None
                    
                    if not name:
                        continue
                    
                    # Get product URL
                    link_elem = item.select_one('a')
                    product_url = link_elem.get('href', '') if link_elem else ''
                    
                    # Get price
                    price_elem = item.select_one('.price ins .amount, .price .amount, .price')
                    price = None
                    if price_elem:
                        price_text = price_elem.get_text(strip=True)
                        # Extract numeric value
                        price_match = re.search(r'([\d.,]+)', price_text.replace('₺', '').replace('.', '').replace(',', '.'))
                        if price_match:
                            price = float(price_match.group(1))
                    
                    # Get old price
                    old_price_elem = item.select_one('.price del .amount')
                    old_price = None
                    if old_price_elem:
                        old_price_text = old_price_elem.get_text(strip=True)
                        old_price_match = re.search(r'([\d.,]+)', old_price_text.replace('₺', '').replace('.', '').replace(',', '.'))
                        if old_price_match:
                            old_price = float(old_price_match.group(1))
                    
                    # Get image
                    img_elem = item.select_one('img')
                    image_url = ''
                    if img_elem:
                        image_url = img_elem.get('src') or img_elem.get('data-src') or ''
                    
                    product = {
                        'name': name,
                        'price': price,
                        'old_price': old_price,
                        'image_url': image_url,
                        'product_url': product_url,
                        'sku': None,
                        'in_stock': True,
                        'description': '',
                        'images': [image_url] if image_url else []
                    }
                    
                    products.append(product)
                    
                except Exception as e:
                    logging.error(f"Error extracting product: {str(e)}")
                    continue
            
            return products
            
        except Exception as e:
            logging.error(f"Error scraping page {page_num}: {str(e)}")
            return []
    
    async def scrape_category_all_pages(self, category_url: str, category_name: str, 
                                       fetch_sku: bool = True, only_in_stock: bool = True,
                                       max_pages: int = 500) -> List[Dict]:
        """Scrape all pages of a category"""
        all_products = []
        current_page = 1
        
        while current_page <= max_pages:
            try:
                self.update_status(
                    f"scraping_page",
                    None,
                    f"{category_name} - Sayfa {current_page}"
                )
                
                products = await self.scrape_category_page(category_url, current_page)
                
                if not products:
                    logging.info(f"No products found on page {current_page}, stopping.")
                    break
                
                # Fetch detailed info if requested
                if fetch_sku:
                    for i, product in enumerate(products):
                        if product['product_url']:
                            try:
                                details = await self.fetch_product_details(product['product_url'])
                                product['sku'] = details.get('sku')
                                product['in_stock'] = details.get('in_stock', True)
                                product['description'] = details.get('description', '')
                                if details.get('images'):
                                    product['images'] = details['images']
                                
                                # Update progress
                                self.update_status(
                                    f"fetching_details",
                                    None,
                                    f"{category_name} - Sayfa {current_page} - Detay {i+1}/{len(products)}"
                                )
                                
                            except Exception as e:
                                logging.error(f"Error fetching details: {str(e)}")
                
                # Filter by stock if requested
                if only_in_stock:
                    products = [p for p in products if p['in_stock']]
                
                all_products.extend(products)
                
                # Update main task
                self.scraping_tasks[self.task_id]["products"] = all_products
                self.scraping_tasks[self.task_id]["total_products"] = len(all_products)
                
                logging.info(f"Category {category_name} - Page {current_page}: {len(products)} products. Total: {len(all_products)}")
                
                current_page += 1
                
            except Exception as e:
                logging.error(f"Error on page {current_page}: {str(e)}")
                break
        
        return all_products
