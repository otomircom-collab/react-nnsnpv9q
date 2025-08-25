import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, User, MapPin, Phone, Menu, X, ChevronDown, Star, Truck, Shield, Clock, MessageCircle, Navigation, Package, CreditCard, FileText, Settings, Bell, Home } from 'lucide-react';

const OtoPartsWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [cartItems, setCartItems] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [userLocation, setUserLocation] = useState('İstanbul, Türkiye');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [orderTracking, setOrderTracking] = useState('');
  const [isB2BUser, setIsB2BUser] = useState(false);

  // Sample data with real automotive products
  const categories = [
    'Tümü', 'Motor Yağı', 'Fren Parçaları', 'Amortisör', 'Lastik', 'Akü', 'Aksesuar', 'Jant', 'Sigorta'
  ];

  const products = [
    {
      id: 1,
      name: 'Castrol GTX 15W-40 Motor Yağı 4L',
      price: 299,
      oldPrice: 349,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 324,
      category: 'Motor Yağı',
      brand: 'Castrol',
      inStock: true,
      sameDay: true,
      discount: 15,
      b2bPrice: 259
    },
    {
      id: 2,
      name: 'Bosch Fren Disk Takımı Ön',
      price: 850,
      oldPrice: 950,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 156,
      category: 'Fren Parçaları',
      brand: 'Bosch',
      inStock: true,
      sameDay: true,
      discount: 11,
      b2bPrice: 750
    },
    {
      id: 3,
      name: 'Bridgestone 195/65R15 Turanza T001',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1558489580-faa75691fdc5?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      category: 'Lastik',
      brand: 'Bridgestone',
      inStock: true,
      sameDay: false,
      b2bPrice: 1150
    },
    {
      id: 4,
      name: 'Varta Blue Dynamic Akü 60Ah',
      price: 1890,
      oldPrice: 2100,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 203,
      category: 'Akü',
      brand: 'Varta',
      inStock: true,
      sameDay: true,
      discount: 10,
      b2bPrice: 1690
    },
    {
      id: 5,
      name: 'Monroe Amortisör Ön Takım',
      price: 750,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 127,
      category: 'Amortisör',
      brand: 'Monroe',
      inStock: true,
      sameDay: true,
      b2bPrice: 650
    },
    {
      id: 6,
      name: 'OZ Racing Jant 17" Alloy',
      price: 2400,
      oldPrice: 2800,
      image: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 76,
      category: 'Jant',
      brand: 'OZ Racing',
      inStock: true,
      sameDay: false,
      discount: 14,
      b2bPrice: 2200
    },
    {
      id: 7,
      name: 'Mobil 1 5W-30 Tam Sentetik Motor Yağı',
      price: 450,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 245,
      category: 'Motor Yağı',
      brand: 'Mobil',
      inStock: true,
      sameDay: true,
      b2bPrice: 399
    },
    {
      id: 8,
      name: 'Ferodo Fren Balata Takımı',
      price: 380,
      oldPrice: 420,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 189,
      category: 'Fren Parçaları',
      brand: 'Ferodo',
      inStock: true,
      sameDay: true,
      discount: 10,
      b2bPrice: 335
    }
  ];

  const vehicleModels = [
    'BMW 3 Series (E90)',
    'Mercedes C-Class (W204)',
    'Audi A4 (B8)',
    'Volkswagen Golf 7',
    'Ford Focus MK3',
    'Renault Megane 3',
    'Peugeot 308',
    'Toyota Corolla',
    'Honda Civic'
  ];

  const nearbyServices = [
    { name: 'Oto Eksper Servis', distance: '0.8 km', rating: 4.5, address: 'Şişli/İstanbul' },
    { name: 'Master Garage', distance: '1.2 km', rating: 4.7, address: 'Beşiktaş/İstanbul' },
    { name: 'ProTech Oto', distance: '1.5 km', rating: 4.3, address: 'Kadıköy/İstanbul' },
    { name: 'AutoCare Plus', distance: '2.1 km', rating: 4.6, address: 'Bakırköy/İstanbul' }
  ];

  const addToCart = (product) => {
    setCartItems([...cartItems, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const renderHeader = () => (
    <>
      {/* Top Info Bar */}
      <div className="bg-gray-800 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              444 10 44
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {userLocation}
            </span>
            <button className="text-xs hover:text-gray-300">Konum Değiştir</button>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span>Ücretsiz Kargo 500₺ ve Üzeri</span>
            <span>Aynı Gün Teslimat</span>
            <span className="bg-red-600 px-2 py-1 rounded text-xs">B2B Özel Fiyat</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => setCurrentPage('home')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xl mr-8 hover:bg-red-700"
              >
                OtoParts
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative flex">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-100 border-r px-4 py-3 rounded-l-lg focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Şase numarası, ürün adı, marka ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 border-t border-b focus:outline-none"
                />
                <button className="bg-red-600 text-white px-6 py-3 rounded-r-lg hover:bg-red-700">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              <button className="flex flex-col items-center text-gray-600 hover:text-red-600">
                <Heart className="w-6 h-6" />
                <span className="text-xs hidden md:block">Favoriler</span>
              </button>
              <button 
                onClick={() => setCurrentPage('cart')}
                className="flex flex-col items-center text-gray-600 hover:text-red-600 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs hidden md:block">Sepetim</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsB2BUser(!isB2BUser)}
                className="flex flex-col items-center text-gray-600 hover:text-red-600"
              >
                <User className="w-6 h-6" />
                <span className="text-xs hidden md:block">{isB2BUser ? 'B2B Panel' : 'Giriş Yap'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Categories */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 overflow-x-auto">
              {[
                { name: 'YEDEK PARÇA', page: 'home', active: currentPage === 'home' },
                { name: 'OTO AKSESUAR', page: 'aksesuar' },
                { name: 'JANT & LASTİK', page: 'jantlastik' },
                { name: 'YAĞ BAKIM', page: 'yagbakim' },
                { name: 'SİGORTA', page: 'sigorta' },
                { name: 'B2B PANEL', page: 'b2b' },
                { name: 'TESLİMAT', page: 'teslimat' },
                { name: 'SERVİS', page: 'servis' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCurrentPage(item.page)}
                  className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    item.active || currentPage === item.page
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );

  const renderHomePage = () => (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner with Vehicle Selection */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">OtoParts'ı Keşfet</h1>
            <p className="text-xl mb-8">Aracın için ihtiyaç duyduğun her şey, kapına kadar</p>
            
            {/* Vehicle Selection & Chassis Search */}
            <div className="bg-white text-gray-800 p-6 rounded-xl max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">🚗 Aracını Seç</h3>
                  <select 
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Araç modelini seçin</option>
                    {vehicleModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">🔍 Şase Numarası</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Şase numaranızı girin..."
                      value={chassisNumber}
                      onChange={(e) => setChassisNumber(e.target.value)}
                      className="flex-1 p-3 border rounded-lg"
                    />
                    <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
                      Sorgula
                    </button>
                  </div>
                </div>
              </div>
              {selectedVehicle && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                  ✅ {selectedVehicle} modeli seçildi. Size uygun parçalar gösteriliyor.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Delivery Options */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Normal Teslimat</h3>
              <p className="text-gray-600 text-sm">Esnek ödeme imkanları ile 2-3 iş günü</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow border-2 border-red-500">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Aynı Gün Teslimat</h3>
              <p className="text-gray-600 text-sm">İstediğin saatte aynı gün teslimat</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Acil Teslimat</h3>
              <p className="text-gray-600 text-sm">2 saatte kapında, acil durumlar için</p>
            </div>
          </div>
        </section>

        {/* Campaign Banners */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl cursor-pointer hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-2">%20 İndirim</h3>
              <p className="mb-4">Tüm motor yağlarında geçerli</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">
                Keşfet
              </button>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl cursor-pointer hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-2">Ücretsiz Montaj</h3>
              <p className="mb-4">Fren paketi alışverişlerinde</p>
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold">
                İncele
              </button>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-xl cursor-pointer hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-2">B2B Özel</h3>
              <p className="mb-4">Ustalar için %15 ekstra indirim</p>
              <button 
                onClick={() => setCurrentPage('b2b')}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold"
              >
                Üye Ol
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Yedek Parça', icon: '🔧', page: 'home' },
              { name: 'Aksesuar', icon: '🚗', page: 'aksesuar' },
              { name: 'Jant & Lastik', icon: '🛞', page: 'jantlastik' },
              { name: 'Yağ & Bakım', icon: '🛢', page: 'yagbakim' },
              { name: 'Sigorta', icon: '🛡', page: 'sigorta' },
              { name: 'Ustam B2B', icon: '👨‍🔧', page: 'b2b' },
              { name: 'Aynı Gün', icon: '🚚', page: 'teslimat' },
              { name: 'Servis Bul', icon: '📍', page: 'servis' }
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => setCurrentPage(category.page)}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="font-medium text-gray-800 text-sm">{category.name}</h3>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {isB2BUser ? 'B2B Özel Fiyatlı Ürünler' : 'Öne Çıkan Ürünler'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="relative mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      %{product.discount} İndirim
                    </div>
                  )}
                  {product.sameDay && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      Aynı Gün
                    </div>
                  )}
                  {isB2BUser && (
                    <div className="absolute bottom-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs">
                      B2B Fiyat
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                <div className="text-xs text-gray-500 mb-2">{product.brand}</div>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{product.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">
                      {isB2BUser && product.b2bPrice ? ${product.b2bPrice}₺ : ${product.price}₺}
                    </div>
                    {product.oldPrice && (
                      <div className="text-sm text-gray-500 line-through">{product.oldPrice}₺</div>
                    )}
                    {isB2BUser && product.b2bPrice && (
                      <div className="text-xs text-purple-600 font-medium">
                        Normal: {product.price}₺
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hizmetlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => setCurrentPage('home')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibold mb-2">Sanal Market</h3>
              <p className="text-sm opacity-90">Binlerce yedek parça tek tıkla</p>
            </button>
            <button 
              onClick={() => setCurrentPage('teslimat')}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Hemen Teslimat</h3>
              <p className="text-sm opacity-90">Acil aksesuar ihtiyaçları</p>
            </button>
            <button 
              onClick={() => setCurrentPage('b2b')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-3">👨‍🔧</div>
              <h3 className="font-semibold mb-2">Ustam B2B</h3>
              <p className="text-sm opacity-90">Vergi levhası ile özel fiyat</p>
            </button>
            <button 
              onClick={() => setCurrentPage('sigorta')}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-3">🛡</div>
              <h3 className="font-semibold mb-2">Sigorta</h3>
              <p className="text-sm opacity-90">Trafik & kasko teklifleri</p>
            </button>
          </div>
        </section>
      </div>
    </main>
  );

  const renderB2BPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">👨‍🔧 Ustam B2B Panel</h1>
          <p className="text-gray-600">Profesyoneller için özel fiyatlar ve avantajlar</p>
        </div>

        {!isB2BUser ? (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-6">B2B Üyelik</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Firma Adı"
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Vergi Numarası"
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                className="w-full p-3 border rounded-lg"
              />
              <p className="text-sm text-gray-600">Vergi levhası yükleyiniz</p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="membership" className="mr-2" />
                  <span>Normal Üyelik - %10 indirim</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="membership" className="mr-2" />
                  