import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SparePartsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chassisNumber, setChassisNumber] = useState('');
  const [activeTab, setActiveTab] = useState('chassis');

  const categories = [
    { emoji: '🛑', name: 'Fren Sistemi', count: '250+', color: 'bg-red-50 hover:bg-red-100' },
    { emoji: '⚙️', name: 'Motor Parçaları', count: '450+', color: 'bg-blue-50 hover:bg-blue-100' },
    { emoji: '🔍', name: 'Filtreler', count: '180+', color: 'bg-green-50 hover:bg-green-100' },
    { emoji: '🔩', name: 'Süspansiyon', count: '320+', color: 'bg-purple-50 hover:bg-purple-100' },
    { emoji: '💡', name: 'Aydınlatma', count: '150+', color: 'bg-yellow-50 hover:bg-yellow-100' },
    { emoji: '🔌', name: 'Elektrik', count: '280+', color: 'bg-indigo-50 hover:bg-indigo-100' },
    { emoji: '💨', name: 'Egzoz', count: '95+', color: 'bg-gray-50 hover:bg-gray-100' },
    { emoji: '❄️', name: 'Soğutma', count: '120+', color: 'bg-cyan-50 hover:bg-cyan-100' },
    { emoji: '⛽', name: 'Yakıt Sistemi', count: '170+', color: 'bg-orange-50 hover:bg-orange-100' },
    { emoji: '🎯', name: 'Debriyaj', count: '110+', color: 'bg-pink-50 hover:bg-pink-100' },
    { emoji: '⚡', name: 'Şanzıman', count: '85+', color: 'bg-lime-50 hover:bg-lime-100' },
    { emoji: '🎮', name: 'Direksiyon', count: '130+', color: 'bg-teal-50 hover:bg-teal-100' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/spare-parts`);
      if (response.data.length === 0) {
        setProducts(generateMockProducts());
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      setProducts(generateMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const generateMockProducts = () => {
    const brands = ['Bosch', 'Mann Filter', 'Castrol', 'ATE', 'NGK', 'Sachs', 'Osram', 'Valeo'];
    const products = [
      { name: 'Bosch Hava Filtresi - Ford Focus 1.6 TDCi', brand: 'Bosch', price: 245.50, oldPrice: 289, discount: 15, oem: true },
      { name: 'ATE Fren Balatası Ön Takım - VW Golf 7', brand: 'ATE', price: 580, oldPrice: 650, discount: 11, oem: true },
      { name: 'Mann Yağ Filtresi - Mercedes C-Class', brand: 'Mann', price: 165, oldPrice: null, discount: 0, oem: true },
      { name: 'NGK Buji Takımı (4 Adet) - Renault Megane', brand: 'NGK', price: 420, oldPrice: 480, discount: 13, oem: false },
      { name: 'Sachs Amortisör Ön Takım - BMW 3 Serisi', brand: 'Sachs', price: 1850, oldPrice: 2100, discount: 12, oem: true },
      { name: 'Osram Far Ampulü H7 +130% Ultra Life', brand: 'Osram', price: 95, oldPrice: null, discount: 0, oem: false },
      { name: 'Castrol Edge 5W-30 Motor Yağı 4L + Filtre Hediye', brand: 'Castrol', price: 685, oldPrice: 750, discount: 9, oem: false },
      { name: 'Bosch Silecek Takımı Aerotwin - Audi A4', brand: 'Bosch', price: 385, oldPrice: 420, discount: 8, oem: true }
    ];

    return products.map((p, i) => ({
      id: `spare-${i + 1}`,
      name: p.name,
      brand: p.brand,
      price: p.price,
      oldPrice: p.oldPrice,
      discount: p.discount,
      oem: p.oem,
      stock: Math.floor(Math.random() * 100) + 20,
      image_url: `https://images.unsplash.com/photo-${['1486262715619-67b85e0b08d3', '1449130015084-2dc0185e9fbc', '1625047509168-a7026f36de04', '1619642751034-765dfdf7c58e', '1492144534655-ae79c964c9d7', '1621939514649-280e2ee25f60', '1632823469883-75c0da32a3d8', '1619405399517-d7fce0f13302'][i]}?w=400&h=400&fit=crop`,
      rating: 4.5 + Math.random() * 0.4,
      reviewCount: Math.floor(Math.random() * 400) + 50
    }));
  };

  const handleChassisSearch = () => {
    if (chassisNumber.trim()) {
      fetchProducts();
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-12 text-white mb-8">
            <h1 className="text-4xl font-bold mb-3" data-testid="page-title">Orijinal Yedek Parça</h1>
            <p className="text-xl text-white/90">Şase numarası veya araç bilgileriyle hızlıca bulun</p>
          </div>

          {/* Arama Tabs */}
          <Card className="mb-8 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                <TabsTrigger value="chassis">Şase Numarası ile Ara</TabsTrigger>
                <TabsTrigger value="vehicle">Araç Bilgileri ile Ara</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chassis">
                <div>
                  <label className="block text-sm font-medium mb-2">Şase Numarası (VIN)</label>
                  <p className="text-xs text-gray-600 mb-3">Şase numarası 17 karakterden oluşur ve aracınızın ruhsatında bulunur.</p>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Şase numaranızı girin"
                      value={chassisNumber}
                      onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                      className="flex-1 h-12 text-base uppercase"
                      maxLength={17}
                      data-testid="chassis-input"
                    />
                    <Button 
                      onClick={handleChassisSearch}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 font-semibold"
                      data-testid="chassis-search-button"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Uygun Parçaları Bul
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vehicle">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Marka</label>
                    <select className="w-full h-12 px-3 border border-gray-300 rounded-lg">
                      <option>Marka Seçin</option>
                      <option>Ford</option>
                      <option>Volkswagen</option>
                      <option>Mercedes</option>
                      <option>Renault</option>
                      <option>BMW</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <select className="w-full h-12 px-3 border border-gray-300 rounded-lg">
                      <option>Model Seçin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Yıl</label>
                    <select className="w-full h-12 px-3 border border-gray-300 rounded-lg">
                      <option>Yıl Seçin</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Parça Kategorileri */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Parça Kategorileri</h2>
              <Link to="#" className="text-orange-600 hover:text-orange-700 font-medium">Tümünü Gör</Link>
            </div>
            <p className="text-gray-600 mb-6">İhtiyacınız olan parçayı kategoriye göre bulun</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  className={`${cat.color} rounded-xl p-6 text-center transition-all border border-gray-200`}
                >
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-600">{cat.count} ürün</p>
                </button>
              ))}
            </div>
          </div>

          {/* Öne Çıkan Ürünler */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Öne Çıkan Ürünler</h2>
              <Link to="#" className="text-orange-600 hover:text-orange-700 font-medium">Tümünü Gör →</Link>
            </div>
            {loading ? (
              <div className="text-center py-12" data-testid="loading-spinner">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative">
                      <img src={product.image_url} alt={product.name} className="w-full h-48 object-contain p-4" />
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-%{product.discount}</div>
                      )}
                      {product.oem && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">OEM</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 font-medium mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-medium">{product.rating?.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">Stok: {product.stock} adet</p>
                      <div className="mb-3">
                        {product.oldPrice && (
                          <p className="text-xs text-gray-400 line-through">{product.oldPrice.toFixed(2)} TL</p>
                        )}
                        <p className="text-xl font-bold text-gray-900">{product.price.toFixed(2)} TL</p>
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">Sepete Ekle</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alt Bilgi */}
          <div className="grid md:grid-cols-4 gap-6 mt-12 pt-8 border-t">
            <div className="text-center">
              <div className="text-3xl mb-2">✓</div>
              <h3 className="font-bold mb-1">Orijinal Parça Garantisi</h3>
              <p className="text-sm text-gray-600">OEM kalitesinde ürünler</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-bold mb-1">Hızlı Kargo</h3>
              <p className="text-sm text-gray-600">Aynı gün kargo imkanı</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-bold mb-1">Montaj Desteği</h3>
              <p className="text-sm text-gray-600">Anlaşmalı servisler</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💯</div>
              <h3 className="font-bold mb-1">Güvenli Alışveriş</h3>
              <p className="text-sm text-gray-600">256-bit SSL güvenlik</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SparePartsPage;
