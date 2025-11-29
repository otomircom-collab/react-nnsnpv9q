import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AccessoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const categories = [
    { emoji: '🪑', name: 'Koltuk Kılıfı', count: '180+', color: 'bg-blue-50 hover:bg-blue-100' },
    { emoji: '🧹', name: 'Paspas', count: '250+', color: 'bg-green-50 hover:bg-green-100' },
    { emoji: '✨', name: 'Temizlik Ürünleri', count: '120+', color: 'bg-purple-50 hover:bg-purple-100' },
    { emoji: '🎵', name: 'Ses Sistemi', count: '95+', color: 'bg-pink-50 hover:bg-pink-100' },
    { emoji: '📱', name: 'Telefon Tutucu', count: '80+', color: 'bg-cyan-50 hover:bg-cyan-100' },
    { emoji: '🔆', name: 'Aydınlatma', count: '110+', color: 'bg-yellow-50 hover:bg-yellow-100' },
    { emoji: '🛡️', name: 'Koruma Ürünleri', count: '150+', color: 'bg-red-50 hover:bg-red-100' },
    { emoji: '❄️', name: 'Araç Örtüsü', count: '70+', color: 'bg-indigo-50 hover:bg-indigo-100' },
    { emoji: '🧰', name: 'Bagaj Ürünleri', count: '90+', color: 'bg-orange-50 hover:bg-orange-100' },
    { emoji: '🚗', name: 'Dış Aksesuar', count: '200+', color: 'bg-teal-50 hover:bg-teal-100' },
    { emoji: '🎨', name: 'Krom Aksesuar', count: '160+', color: 'bg-lime-50 hover:bg-lime-100' },
    { emoji: '⚡', name: 'Elektronik', count: '140+', color: 'bg-gray-50 hover:bg-gray-100' }
  ];

  const popularBrands = [
    { name: 'Volkswagen', logo: 'VW' },
    { name: 'BMW', logo: 'BMW' },
    { name: 'Fiat', logo: 'Fiat' },
    { name: 'Opel', logo: 'Opel' },
    { name: 'Peugeot', logo: 'Peugeot' },
    { name: 'Renault', logo: 'Renault' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/accessories`);
      if (response.data.length === 0) {
        setProducts(generateMockAccessories());
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      setProducts(generateMockAccessories());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAccessories = () => {
    const brands = ['Omsa', 'SunPlex', 'Carface', 'Automix', 'Würth', 'Tvet'];
    const accessories = [
      { name: 'OMSA Ford Puma Krom Cam Alt Çıta 8 Parça 2020+', price: 2080, oldPrice: 2400, discount: 13 },
      { name: 'SunPlex Dacia Duster Cam Rüzgarlığı 4 Parça', price: 936, oldPrice: 1040, discount: 10 },
      { name: 'OMSA VW T6.1 Krom Ön Tampon Izgara 4 Parça', price: 1480, oldPrice: null, discount: 0 },
      { name: 'Araç İçi Mıknatıslı Telefon Tutucu Mafsallı', price: 399, oldPrice: 624, discount: 36 },
      { name: 'Würth Oto Yıkama Süngeri 17.5x12x6 cm', price: 119, oldPrice: null, discount: 0 },
      { name: 'OMSA Toyota Proace Nevada Yan Basamak', price: 5616, oldPrice: 6240, discount: 10 },
      { name: 'OMSA Seat İbiza Siyah Kol Dayama 2009-2016', price: 2359, oldPrice: 2880, discount: 18 },
      { name: 'OMSA Nissan Qashqai Krom Sis Far Çıtası', price: 960, oldPrice: null, discount: 0 }
    ];

    return accessories.map((acc, i) => ({
      id: `acc-${i + 1}`,
      name: acc.name,
      brand: brands[i % brands.length],
      price: acc.price,
      oldPrice: acc.oldPrice,
      discount: acc.discount,
      stock: Math.floor(Math.random() * 50) + 10,
      image_url: `https://images.unsplash.com/photo-${['1449965408869-eaa3f722e40d', '1625047509168-a7026f36de04', '1492144534655-ae79c964c9d7', '1621939514649-280e2ee25f60', '1619405399517-d7fce0f13302', '1632823469883-75c0da32a3d8', '1614933768928-1ef1e47e46fa', '1614933768928-1ef1e47e46fa'][i]}?w=400&h=400&fit=crop`,
      rating: 4.5 + Math.random() * 0.4,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      sepetteIndirim: i % 3 === 0
    }));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-12 text-white mb-8">
            <h1 className="text-4xl font-bold mb-3">Araca Özel Aksesuar</h1>
            <p className="text-xl text-white/90">Aracınıza özel tasarlanmış aksesuarlar - Ücretsiz kargo</p>
          </div>

          {/* Araç Filtresi */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-bold">Aracımı Bul</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <select className="h-12 px-3 border-2 border-gray-300 rounded-lg focus:border-orange-500">
                <option>Marka</option>
                <option>Ford</option>
                <option>Volkswagen</option>
                <option>Fiat</option>
                <option>Renault</option>
                <option>Peugeot</option>
              </select>
              <select className="h-12 px-3 border-2 border-gray-300 rounded-lg focus:border-orange-500">
                <option>Model</option>
              </select>
              <select className="h-12 px-3 border-2 border-gray-300 rounded-lg focus:border-orange-500">
                <option>Kategori</option>
              </select>
              <Button className="bg-orange-500 hover:bg-orange-600 h-12 font-semibold">Filtrele</Button>
            </div>
          </Card>

          {/* Kampanya Bannerları */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Krom Aksesuar</h3>
              <p>Özel indirim fırsatı</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Yan Basamak</h3>
              <p>%20'ye varan indirim</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Pick-Up Aksesuar</h3>
              <p>Kampanyalı fiyatlar</p>
            </div>
          </div>

          {/* Kategoriler */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Aksesuar Kategorileri</h2>
              <Link to="#" className="text-orange-600 hover:text-orange-700 font-medium">Tümünü Gör</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat, index) => (
                <button key={index} className={`${cat.color} rounded-xl p-6 text-center transition-all border border-gray-200`}>
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-600">{cat.count} ürün</p>
                </button>
              ))}
            </div>
          </div>

          {/* Çok Satan Ürünler */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Çok Satan Ürünler</h2>
              <Link to="#" className="text-orange-600 hover:text-orange-700 font-medium">Tümünü Gör →</Link>
            </div>
            {loading ? (
              <div className="text-center py-12">
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
                      {product.sepetteIndirim && (
                        <div className="absolute bottom-2 left-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded text-center">
                          💰 1000₺ üzeri %10 indirim
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 font-medium mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]">{product.name}</h3>
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

          {/* Popüler Araçlar */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Popüler Araçlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularBrands.map((brand, i) => (
                <button key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700">
                    {brand.logo}
                  </div>
                  <h3 className="font-bold text-sm text-center">{brand.name}</h3>
                  <p className="text-xs text-gray-600 text-center mt-1">Aksesuarlar →</p>
                </button>
              ))}
            </div>
          </div>

          {/* Özellikler */}
          <div className="grid md:grid-cols-4 gap-6 mt-12 pt-8 border-t">
            <div className="text-center">
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-bold mb-1">Ücretsiz Kargo</h3>
              <p className="text-sm text-gray-600">Tüm ürünlerde</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-bold mb-1">Araca Özel</h3>
              <p className="text-sm text-gray-600">Lazerle alınan kalıplar</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏭</div>
              <h3 className="font-bold mb-1">Üretici Garantisi</h3>
              <p className="text-sm text-gray-600">2 yıl garanti</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold mb-1">Sepette İndirim</h3>
              <p className="text-sm text-gray-600">1000₺ üzeri %10</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccessoriesPage;
