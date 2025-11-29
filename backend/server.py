from fastapi import FastAPI, APIRouter, HTTPException
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


# ============= MODELS =============

# Yedek Parça Model
class SparePart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    oem_code: str
    category: str  # Motor, Fren, Elektrik, vb.
    price: float
    stock: int
    image_url: str
    compatible_vehicles: List[str]  # Şase numaraları
    description: str

class SparePartCreate(BaseModel):
    name: str
    brand: str
    oem_code: str
    category: str
    price: float
    stock: int
    image_url: str
    compatible_vehicles: List[str]
    description: str

# Aksesuar Model
class Accessory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    category: str  # İç Aksesuar, Dış Aksesuar, Elektronik, vb.
    price: float
    stock: int
    image_url: str
    compatible_vehicles: List[str]  # Marka/Model
    description: str
    rating: float = 4.5

class AccessoryCreate(BaseModel):
    name: str
    brand: str
    category: str
    price: float
    stock: int
    image_url: str
    compatible_vehicles: List[str]
    description: str
    rating: Optional[float] = 4.5

# Jant & Lastik Model
class TireWheel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    type: str  # Jant veya Lastik
    size: str  # 205/55R16, 17", vb.
    season: str  # Yaz, Kış, 4 Mevsim
    price: float
    stock: int
    image_url: str
    description: str
    rating: float = 4.5

class TireWheelCreate(BaseModel):
    name: str
    brand: str
    type: str
    size: str
    season: str
    price: float
    stock: int
    image_url: str
    description: str
    rating: Optional[float] = 4.5

# Montaj Noktası Model
class ServicePoint(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    city: str
    phone: str
    latitude: float
    longitude: float
    rating: float
    services: List[str]  # Lastik Montaj, Balans, Hasar Onarım, vb.
    working_hours: str

class ServicePointCreate(BaseModel):
    name: str
    address: str
    city: str
    phone: str
    latitude: float
    longitude: float
    rating: float
    services: List[str]
    working_hours: str

# Sigorta Teklif Model
class InsuranceQuote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    company_logo: str
    price: float
    coverage_type: str  # Kasko, Trafik
    coverage_details: List[str]
    rating: float
    discount: Optional[float] = 0

class InsuranceQuoteCreate(BaseModel):
    company_name: str
    company_logo: str
    price: float
    coverage_type: str
    coverage_details: List[str]
    rating: float
    discount: Optional[float] = 0

# Anında Teslimat Ürün Model
class QuickDeliveryProduct(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    price: float
    image_url: str
    delivery_time: str  # "20-30 dk", "40-60 dk"
    stock: int
    available_zones: List[str]  # Bölge kodları

class QuickDeliveryProductCreate(BaseModel):
    name: str
    category: str
    price: float
    image_url: str
    delivery_time: str
    stock: int
    available_zones: List[str]

# Sepet Model
class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    product_name: str
    product_image: str
    quantity: int
    price: float
    category: str  # Hangi kategoriden
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItemCreate(BaseModel):
    user_id: str
    product_id: str
    product_name: str
    product_image: str
    quantity: int
    price: float
    category: str

# AI Chat History Model
class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    message: str
    response: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessageCreate(BaseModel):
    user_id: str
    message: str


# ============= ENDPOINTS =============

@api_router.get("/")
async def root():
    return {"message": "OTOMARKETGO API v1.0"}

# Yedek Parça Endpoints
@api_router.get("/spare-parts", response_model=List[SparePart])
async def get_spare_parts(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"oem_code": {"$regex": search, "$options": "i"}}
        ]
    
    parts = await db.spare_parts.find(query, {"_id": 0}).to_list(1000)
    return parts

@api_router.post("/spare-parts", response_model=SparePart)
async def create_spare_part(part: SparePartCreate):
    part_obj = SparePart(**part.model_dump())
    await db.spare_parts.insert_one(part_obj.model_dump())
    return part_obj

# Aksesuar Endpoints
@api_router.get("/accessories", response_model=List[Accessory])
async def get_accessories(category: Optional[str] = None, vehicle: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if vehicle:
        query["compatible_vehicles"] = {"$regex": vehicle, "$options": "i"}
    
    accessories = await db.accessories.find(query, {"_id": 0}).to_list(1000)
    return accessories

@api_router.post("/accessories", response_model=Accessory)
async def create_accessory(accessory: AccessoryCreate):
    acc_obj = Accessory(**accessory.model_dump())
    await db.accessories.insert_one(acc_obj.model_dump())
    return acc_obj

# Jant & Lastik Endpoints
@api_router.get("/tires-wheels", response_model=List[TireWheel])
async def get_tires_wheels(type: Optional[str] = None, season: Optional[str] = None, size: Optional[str] = None):
    query = {}
    if type:
        query["type"] = type
    if season:
        query["season"] = season
    if size:
        query["size"] = {"$regex": size, "$options": "i"}
    
    items = await db.tires_wheels.find(query, {"_id": 0}).to_list(1000)
    return items

@api_router.post("/tires-wheels", response_model=TireWheel)
async def create_tire_wheel(item: TireWheelCreate):
    item_obj = TireWheel(**item.model_dump())
    await db.tires_wheels.insert_one(item_obj.model_dump())
    return item_obj

# Servis Noktaları Endpoints
@api_router.get("/service-points", response_model=List[ServicePoint])
async def get_service_points(city: Optional[str] = None):
    query = {}
    if city:
        query["city"] = city
    
    points = await db.service_points.find(query, {"_id": 0}).to_list(1000)
    return points

@api_router.post("/service-points", response_model=ServicePoint)
async def create_service_point(point: ServicePointCreate):
    point_obj = ServicePoint(**point.model_dump())
    await db.service_points.insert_one(point_obj.model_dump())
    return point_obj

# Sigorta Endpoints
@api_router.get("/insurance-quotes", response_model=List[InsuranceQuote])
async def get_insurance_quotes(coverage_type: Optional[str] = None):
    query = {}
    if coverage_type:
        query["coverage_type"] = coverage_type
    
    quotes = await db.insurance_quotes.find(query, {"_id": 0}).to_list(1000)
    return sorted(quotes, key=lambda x: x.get('price', 0))

@api_router.post("/insurance-quotes", response_model=InsuranceQuote)
async def create_insurance_quote(quote: InsuranceQuoteCreate):
    quote_obj = InsuranceQuote(**quote.model_dump())
    await db.insurance_quotes.insert_one(quote_obj.model_dump())
    return quote_obj

@api_router.post("/insurance-quotes/search")
async def search_insurance_by_plate(plate: str, coverage_type: str = "Kasko"):
    # Mock response - gerçekte plaka sorgusu yapılacak
    quotes = await db.insurance_quotes.find({"coverage_type": coverage_type}, {"_id": 0}).to_list(30)
    return {"plate": plate, "quotes": quotes[:10]}

# Anında Teslimat Endpoints
@api_router.get("/quick-delivery", response_model=List[QuickDeliveryProduct])
async def get_quick_delivery_products(zone: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if zone:
        query["available_zones"] = zone
    if category:
        query["category"] = category
    
    products = await db.quick_delivery.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.post("/quick-delivery", response_model=QuickDeliveryProduct)
async def create_quick_delivery_product(product: QuickDeliveryProductCreate):
    product_obj = QuickDeliveryProduct(**product.model_dump())
    await db.quick_delivery.insert_one(product_obj.model_dump())
    return product_obj

@api_router.post("/quick-delivery/check-zone")
async def check_delivery_zone(postal_code: str):
    # Mock response - gerçekte konum kontrolü yapılacak
    available_zones = ["34", "35", "06", "41"]
    zone = postal_code[:2]
    return {
        "available": zone in available_zones,
        "zone": zone,
        "estimated_time": "20-40 dk" if zone in available_zones else None
    }

# Sepet Endpoints
@api_router.get("/cart/{user_id}", response_model=List[CartItem])
async def get_cart(user_id: str):
    items = await db.cart.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    for item in items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return items

@api_router.post("/cart", response_model=CartItem)
async def add_to_cart(item: CartItemCreate):
    # Aynı ürün varsa miktarı artır
    existing = await db.cart.find_one({
        "user_id": item.user_id,
        "product_id": item.product_id
    })
    
    if existing:
        new_quantity = existing.get("quantity", 0) + item.quantity
        await db.cart.update_one(
            {"user_id": item.user_id, "product_id": item.product_id},
            {"$set": {"quantity": new_quantity}}
        )
        existing["quantity"] = new_quantity
        if isinstance(existing.get('created_at'), str):
            existing['created_at'] = datetime.fromisoformat(existing['created_at'])
        return CartItem(**existing)
    
    cart_obj = CartItem(**item.model_dump())
    doc = cart_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.cart.insert_one(doc)
    return cart_obj

@api_router.delete("/cart/{user_id}/{product_id}")
async def remove_from_cart(user_id: str, product_id: str):
    result = await db.cart.delete_one({"user_id": user_id, "product_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ürün sepette bulunamadı")
    return {"message": "Ürün sepetten kaldırıldı"}

@api_router.delete("/cart/{user_id}")
async def clear_cart(user_id: str):
    await db.cart.delete_many({"user_id": user_id})
    return {"message": "Sepet temizlendi"}

# AI Bakım Robotu Endpoints
@api_router.post("/maintenance-bot/chat")
async def chat_with_bot(message: ChatMessageCreate):
    # Mock AI response - gerçekte AI API'ye gönderilecek
    responses = {
        "yağ": "Aracınız için önerilen motor yağları: Castrol Edge 5W-30, Mobil 1 ESP 5W-30. Km'nize göre yağ değişim zamanı gelmiş olabilir.",
        "fren": "Fren balatası kontrolü öneriyorum. Bosch ve TRW marka balata setlerimiz mevcut. Sepete eklememi ister misiniz?",
        "lastik": "Mevsime uygun lastik seçimi için Jant & Lastik kategorimizi inceleyebilirsiniz. Hangi ebat arıyorsunuz?",
        "bakım": "Periyodik bakım zamanı! Önerilen ürünler: Motor yağı, hava filtresi, kabin filtresi, yağ filtresi. Tümünü sepete ekleyeyim mi?"
    }
    
    response_text = "Size nasıl yardımcı olabilirim? Aracınızın bakım ihtiyaçları hakkında sorularınızı yanıtlayabilirim."
    
    for key in responses:
        if key in message.message.lower():
            response_text = responses[key]
            break
    
    chat_obj = ChatMessage(
        user_id=message.user_id,
        message=message.message,
        response=response_text
    )
    
    doc = chat_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.chat_history.insert_one(doc)
    
    return {"response": response_text}

@api_router.get("/maintenance-bot/history/{user_id}")
async def get_chat_history(user_id: str):
    history = await db.chat_history.find({"user_id": user_id}, {"_id": 0}).sort("timestamp", -1).limit(50).to_list(50)
    for msg in history:
        if isinstance(msg.get('timestamp'), str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    return history

# Kategoriler
@api_router.get("/categories")
async def get_categories():
    return [
        {"id": "spare-parts", "name": "Yedek Parça", "icon": "wrench", "color": "#FF6B35"},
        {"id": "accessories", "name": "Aksesuar", "icon": "star", "color": "#004E89"},
        {"id": "tires-wheels", "name": "Jant & Lastik", "icon": "circle", "color": "#1A535C"},
        {"id": "b2b", "name": "Ustam Özel", "icon": "briefcase", "color": "#6C757D"},
        {"id": "maintenance-bot", "name": "Bakım Robotu", "icon": "bot", "color": "#00B4D8"},
        {"id": "insurance", "name": "Sigortan", "icon": "shield", "color": "#E63946"},
        {"id": "quick-delivery", "name": "Anında Teslimat", "icon": "zap", "color": "#06D6A0"},
        {"id": "service-finder", "name": "Servis Bulucu", "icon": "map-pin", "color": "#8338EC"}
    ]


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