// Mock data for automotive parts e-commerce

export const mainCategories = [
  { name: 'Yedek Parça', path: '/', icon: '🔧' },
  { name: 'Aksesuar', path: '/aksesuar', icon: '🎨' },
  { name: 'Jant & Lastik', path: '/jant-lastik', icon: '⚙️' },
  { name: 'Ustam Özel', path: '/ustam-ozel', icon: '👨‍🔧' },
  { name: 'Bakım Robotu', path: '/bakim-robotu', icon: '🤖' },
  { name: 'Sigortan', path: '/sigortan', icon: '🛡️' },
  { name: 'Anında Teslimat', path: '/aninda-teslimat', icon: '⚡' },
  { name: 'Servis Bulucu', path: '/servis-bulucu', icon: '📍' }
];

export const categories = [
  {
    id: 1,
    name: 'Fren Sistemi',
    slug: 'fren-sistemi',
    icon: '🛑',
    parent: 'Yedek Parça',
    subcategories: ['Fren Balatası', 'Fren Diski', 'Fren Hortumu', 'Fren Kaliperi', 'Fren Merkezi']
  },
  {
    id: 2,
    name: 'Motor Parçaları',
    slug: 'motor-parcalari',
    icon: '⚙️',
    parent: 'Yedek Parça',
    subcategories: ['Buji', 'Triger Seti', 'Krank Mili', 'Silindir Kapağı', 'Supap']
  },
  {
    id: 3,
    name: 'Filtreler',
    slug: 'filtreler',
    icon: '🔍',
    parent: 'Yedek Parça',
    subcategories: ['Hava Filtresi', 'Yağ Filtresi', 'Yakıt Filtresi', 'Polen Filtresi', 'Hidrolik Filtre']
  },
  {
    id: 4,
    name: 'Süspansiyon',
    slug: 'suspansiyon',
    icon: '🔩',
    parent: 'Yedek Parça',
    subcategories: ['Amortisör', 'Rotil', 'Salıncak', 'Bijon', 'Rotbaşı']
  },
  {
    id: 5,
    name: 'İç Aksesuar',
    slug: 'ic-aksesuar',
    icon: '🎨',
    parent: 'Aksesuar',
    subcategories: ['Direksiyon Kılıfı', 'Oto Koltuk Kılıfı', 'Paspas', 'Oto Kokusu', 'Telefon Tutucu']
  },
  {
    id: 6,
    name: 'Dış Aksesuar',
    slug: 'dis-aksesuar',
    icon: '✨',
    parent: 'Aksesuar',
    subcategories: ['Cam Rüzgarlığı', 'Bagaj Taşıyıcı', 'Çamurluk', 'Ayna Kapağı', 'Anten']
  }
];

export const products = [
  {
    id: 1,
    name: 'Bosch Hava Filtresi',
    category: 'Otomobil',
    subcategory: 'Filtreler',
    price: 245.50,
    oldPrice: 289.00,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    brand: 'Bosch',
    stock: 45,
    rating: 4.8,
    reviews: 124,
    description: 'Yüksek kaliteli hava filtresi, motor performansını artırır',
    features: ['OEM Kalite', 'Kolay Montaj', '2 Yıl Garanti'],
    isFeatured: true
  },
  {
    id: 2,
    name: 'ATE Fren Balatası Ön Takım',
    category: 'Otomobil',
    subcategory: 'Fren Sistemi',
    price: 580.00,
    oldPrice: 650.00,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1449130015084-2dc0185e9fbc?w=400&h=400&fit=crop',
    brand: 'ATE',
    stock: 28,
    rating: 4.9,
    reviews: 89,
    description: 'Premium kalitede fren balatası, sessiz ve güvenli frenleme',
    features: ['Asbest İçermez', 'Uzun Ömürlü', 'TÜV Onaylı'],
    isFeatured: true
  },
  {
    id: 3,
    name: 'Mann Yağ Filtresi',
    category: 'Otomobil',
    subcategory: 'Filtreler',
    price: 165.00,
    oldPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=400&fit=crop',
    brand: 'Mann',
    stock: 120,
    rating: 4.7,
    reviews: 256,
    description: 'Orijinal kalite yağ filtresi, motor koruması',
    features: ['OEM Eşdeğeri', 'Yüksek Filtrasyon', 'Garanti Belgeli'],
    isFeatured: true
  },
  {
    id: 4,
    name: 'NGK Buji Takımı (4 Adet)',
    category: 'Otomobil',
    subcategory: 'Motor Parçaları',
    price: 420.00,
    oldPrice: 480.00,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop',
    brand: 'NGK',
    stock: 67,
    rating: 4.9,
    reviews: 178,
    description: 'Orijinal NGK bujileri, mükemmel ateşleme performansı',
    features: ['Japonya Üretimi', 'Uzun Ömürlü', 'Yakıt Tasarrufu'],
    isFeatured: true
  },
  {
    id: 5,
    name: 'Sachs Amortisör Ön Takım',
    category: 'Otomobil',
    subcategory: 'Süspansiyon',
    price: 1850.00,
    oldPrice: 2100.00,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop',
    brand: 'Sachs',
    stock: 15,
    rating: 4.8,
    reviews: 92,
    description: 'Premium amortisör takımı, konforlu sürüş',
    features: ['Alman Teknolojisi', 'Hidrolik Test Edilmiş', '3 Yıl Garanti'],
    isFeatured: false
  },
  {
    id: 6,
    name: 'Osram Far Ampulü H7',
    category: 'Otomobil',
    subcategory: 'Aydınlatma',
    price: 95.00,
    oldPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
    brand: 'Osram',
    stock: 200,
    rating: 4.6,
    reviews: 445,
    description: 'Yüksek performanslı far ampulü, parlak ışık',
    features: ['%30 Daha Parlak', 'Uzun Ömür', 'E-Mark Onaylı'],
    isFeatured: false
  },
  {
    id: 7,
    name: 'Castrol Edge 5W-30 Motor Yağı 4L',
    category: 'Otomobil',
    subcategory: 'Motor Parçaları',
    price: 685.00,
    oldPrice: 750.00,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1632823469883-75c0da32a3d8?w=400&h=400&fit=crop',
    brand: 'Castrol',
    stock: 85,
    rating: 4.9,
    reviews: 512,
    description: 'Premium sentetik motor yağı, üstün motor koruması',
    features: ['Tam Sentetik', 'Avrupa Standartları', 'Yakıt Ekonomisi'],
    isFeatured: true
  },
  {
    id: 8,
    name: 'Bosch Silecek Takımı Aerotwin',
    category: 'Otomobil',
    subcategory: 'Aksesuar',
    price: 385.00,
    oldPrice: 420.00,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=400&fit=crop',
    brand: 'Bosch',
    stock: 94,
    rating: 4.7,
    reviews: 287,
    description: 'Aerodynamik silecek, sessiz ve etkili temizlik',
    features: ['Aerodinamik Tasarım', 'Kolay Montaj', 'Her Mevsim Kullanım'],
    isFeatured: false
  }
];

export const sliderItems = [
  {
    id: 1,
    title: 'İlk Siparişe Özel',
    subtitle: '500 TL İndirim',
    description: 'İlk verileceğiniz özel sipariş için 1500 TL ve üzeri sepette geçerlidir',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop',
    buttonText: 'Hemen Al',
    backgroundColor: '#FF6200'
  },
  {
    id: 2,
    title: 'Fren Sistemlerinde',
    subtitle: 'Büyük Fırsatlar',
    description: 'Tüm fren balatası ve disklerinde %20\'ye varan indirim',
    image: 'https://images.unsplash.com/photo-1449130015084-2dc0185e9fbc?w=1200&h=400&fit=crop',
    buttonText: 'Kampanyayı İncele',
    backgroundColor: '#FF3C00'
  },
  {
    id: 3,
    title: 'Motor Yağlarında',
    subtitle: 'Özel Kampanya',
    description: '2 Al 1 Öde fırsatı kaçmaz',
    image: 'https://images.unsplash.com/photo-1632823469883-75c0da32a3d8?w=1200&h=400&fit=crop',
    buttonText: 'İncele',
    backgroundColor: '#FF5500'
  }
];

export const brands = [
  'Bosch', 'ATE', 'Mann', 'NGK', 'Sachs', 'Osram', 'Castrol', 'Shell',
  'Brembo', 'Continental', 'Mahle', 'Valeo', 'Denso', 'Hella', 'Bilstein'
];

export const vehicleBrands = [
  'Toyota', 'Ford', 'Volkswagen', 'Renault', 'Fiat', 'Opel', 'BMW',
  'Mercedes', 'Audi', 'Honda', 'Hyundai', 'Peugeot', 'Citroën', 'Nissan'
];
