"""Universal E-commerce Website Scraper - Works with ANY site"""
import asyncio
from playwright.async_api import async_playwright, Page
from bs4 import BeautifulSoup
import logging
from typing import List, Dict, Set
import re
from urllib.parse import urlparse, urljoin


class UniversalScraper:
    def __init__(self, task_id: str, scraping_tasks: dict):
        self.task_id = task_id
        self.scraping_tasks = scraping_tasks
        self.browser = None
        self.page = None
        self.base_domain = None
        self.visited_urls = set()
        self.all_products = []
        
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
        self.scraping_tasks[self.task_id]["products"] = self.all_products
        self.scraping_tasks[self.task_id]["total_products"] = len(self.all_products)
    
    def is_same_domain(self, url: str) -> bool:
        """Check if URL belongs to same domain"""
        try:
            parsed = urlparse(url)
            return self.base_domain in parsed.netloc
        except:
            return False
    
    async def discover_all_categories(self, base_url: str) -> List[str]:
        """Discover ALL category URLs from the website"""
        try:
            self.update_status("discovering", 5, "Kategoriler keşfediliyor...")
            
            # Parse base domain
            parsed = urlparse(base_url)
            self.base_domain = parsed.netloc.replace('www.', '')
            
            # Start from homepage if only domain provided
            if not parsed.path or parsed.path == '/':
                start_url = f"{parsed.scheme}://{parsed.netloc}"
            else:
                start_url = base_url
            
            await self.page.goto(start_url, wait_until="networkidle", timeout=90000)
            await asyncio.sleep(2)
            
            # Scroll to load menu
            for _ in range(3):
                await self.page.evaluate("window.scrollBy(0, 500)")
                await asyncio.sleep(0.5)
            
            content = await self.page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            category_urls = set()
            
            # Find category links - multiple strategies
            category_selectors = [
                'a[href*="kategori"]',
                'a[href*="category"]',
                'a[href*="catalog"]',
                '.category a',
                '.categories a',
                'nav a',
                '.menu a',
                '.product-category a'
            ]
            
            for selector in category_selectors:
                links = soup.select(selector)
                for link in links:
                    href = link.get('href', '')
                    if href:
                        full_url = urljoin(start_url, href)
                        if self.is_same_domain(full_url):
                            category_urls.add(full_url)
            
            # Also check footer and sitemap
            footer_links = soup.select('footer a')
            for link in footer_links:
                href = link.get('href', '')
                if href and ('kategori' in href or 'category' in href):
                    full_url = urljoin(start_url, href)
                    if self.is_same_domain(full_url):
                        category_urls.add(full_url)
            
            category_list = list(category_urls)
            logging.info(f"Discovered {len(category_list)} category URLs")
            
            self.update_status("discovered", 10, f"{len(category_list)} kategori bulundu")
            
            return category_list
            
        except Exception as e:
            logging.error(f"Error discovering categories: {str(e)}")
            return []
    
    async def scrape_page(self, url: str, page_num: int = 1) -> List[Dict]:
        """Scrape products from a single page"""
        try:
            # Construct page URL
            if page_num > 1:
                if '?' in url:
                    page_url = f"{url}&page={page_num}"
                else:
                    page_url = f"{url}/page/{page_num}/" if not url.endswith('/') else f"{url}page/{page_num}/"
            else:
                page_url = url
            
            # Skip if already visited
            if page_url in self.visited_urls:
                return []
            
            self.visited_urls.add(page_url)
            
            await self.page.goto(page_url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(1)
            
            # Scroll to load images
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(0.5)
            
            content = await self.page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            products = []
            
            # Try multiple product selectors (universal)
            product_selectors = [
                '.product',
                'li.product',
                '.product-item',
                '.product-grid-item',
                '[class*="product"]',
                'article[class*="product"]'
            ]
            
            product_items = []
            for selector in product_selectors:
                items = soup.select(selector)
                if len(items) > len(product_items):
                    product_items = items
            
            for item in product_items:
                try:
                    # Extract name
                    name_elem = item.select_one('h2, h3, h4, .product-title, [class*="title"]')
                    name = name_elem.get_text(strip=True) if name_elem else None
                    
                    if not name or len(name) < 3:
                        continue
                    
                    # Extract URL
                    link_elem = item.select_one('a')
                    product_url = ''
                    if link_elem:
                        href = link_elem.get('href', '')
                        product_url = urljoin(page_url, href)
                    
                    # Extract price
                    price_selectors = ['.price', '[class*="price"]', '.amount']
                    price = "N/A"
                    for selector in price_selectors:
                        price_elem = item.select_one(selector)
                        if price_elem:
                            price_text = price_elem.get_text(strip=True)
                            # Clean price
                            price_match = re.search(r'([\d.,]+)', price_text)
                            if price_match:
                                price = price_match.group(1)
                                break
                    
                    # Extract image
                    img_elem = item.select_one('img')
                    image_url = ''
                    if img_elem:
                        image_url = img_elem.get('src') or img_elem.get('data-src') or img_elem.get('data-lazy-src') or ''
                        if image_url and not image_url.startswith('http'):
                            image_url = urljoin(page_url, image_url)
                    
                    product = {
                        'name': name,
                        'price': price,
                        'image_url': image_url,
                        'product_url': product_url,
                        'category': url,
                        'sku': 'N/A',
                        'stock_status': 'Stokta'
                    }
                    
                    products.append(product)
                    
                except Exception as e:
                    logging.error(f"Error extracting product: {str(e)}")
                    continue
            
            return products
            
        except Exception as e:
            logging.error(f"Error scraping page {page_url}: {str(e)}")
            return []
    
    async def scrape_category_fully(self, category_url: str, category_name: str, max_pages: int = 200) -> List[Dict]:
        """Scrape ALL pages of a category"""
        category_products = []
        current_page = 1
        consecutive_empty = 0
        
        while current_page <= max_pages and consecutive_empty < 2:
            try:
                page_products = await self.scrape_page(category_url, current_page)
                
                if not page_products:
                    consecutive_empty += 1
                else:
                    consecutive_empty = 0
                    category_products.extend(page_products)
                    self.all_products.extend(page_products)
                
                logging.info(f"{category_name} - Page {current_page}: {len(page_products)} products. Total: {len(self.all_products)}")
                
                current_page += 1
                await asyncio.sleep(0.3)
                
            except Exception as e:
                logging.error(f"Error on page {current_page}: {str(e)}")
                consecutive_empty += 1
                current_page += 1
                continue
        
        return category_products
    
    async def scrape_entire_website(self, base_url: str) -> List[Dict]:
        """Main function: Scrape ENTIRE website automatically"""
        try:
            await self.initialize()
            
            # Step 1: Discover all categories
            self.update_status("discovering", 5, "Site yapısı analiz ediliyor...")
            categories = await self.discover_all_categories(base_url)
            
            if not categories:
                # If no categories found, try scraping homepage directly
                logging.info("No categories found, scraping homepage...")
                categories = [base_url]
            
            logging.info(f"Starting to scrape {len(categories)} categories")
            
            # Step 2: Scrape each category
            for idx, category_url in enumerate(categories, 1):
                try:
                    category_name = category_url.split('/')[-2] if category_url.endswith('/') else category_url.split('/')[-1]
                    
                    progress = int((idx / len(categories)) * 85) + 10
                    self.update_status(
                        "scraping",
                        progress,
                        f"Kategori {idx}/{len(categories)}: {category_name[:30]}... ({len(self.all_products)} ürün)"
                    )
                    
                    await self.scrape_category_fully(category_url, category_name)
                    
                except Exception as e:
                    logging.error(f"Error scraping category {category_url}: {str(e)}")
                    continue
            
            await self.close()
            
            self.update_status("completed", 100, f"Tamamlandı: {len(self.all_products)} ürün")
            
            return self.all_products
            
        except Exception as e:
            logging.error(f"Fatal error in scrape_entire_website: {str(e)}")
            self.update_status("failed", 0, f"Hata: {str(e)}")
            await self.close()
            return []
