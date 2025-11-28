import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ShoppingCart, Heart, Filter, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { useCart } from '../context/CartContext';
import { aksesuarCategories, aksesuarProducts, vehicleBrands } from '../mockData';
import { toast } from '../hooks/use-toast';

const AksesuarPage = () => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const filteredProducts = selectedCategory === 'all' 
    ? aksesuarProducts 
    : aksesuarProducts.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite(product);
    toast({
      title: isFavorite(product.id) ? "Favorilerden Çıkarıldı" : "Favorilere Eklendi",
      description: `${product.name} ${isFavorite(product.id) ? 'favorilerden çıkarıldı' : 'favorilere eklendi'}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with Vehicle Selector */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-5xl font-black mb-4">Araç Aksesuarları</h1>
            <p className="text-xl opacity-90">Aracınıza özel tasarlanmış aksesuarlar</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-gray-900 font-bold text-xl mb-6">Aracınıza Özel Ürünler</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Marka</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-12 px-4 border-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Marka Seçin</option>
                  {vehicleBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full h-12 px-4 border-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500"
                  disabled={!selectedBrand}
                >
                  <option value="">Model Seçin</option>
                  <option value="Focus">Focus</option>
                  <option value="Golf">Golf</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12">
                  <Search className="w-5 h-5 mr-2" />
                  Ürünleri Göster
                </Button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Popüler:</span>
              <button className="text-sm text-purple-600 font-semibold hover:underline">Ford Focus</button>
              <button className="text-sm text-purple-600 font-semibold hover:underline">VW Golf</button>
              <button className="text-sm text-purple-600 font-semibold hover:underline">Renault Clio</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Aksesuar Kategorileri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {aksesuarCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedCategory === cat.slug 
                    ? 'bg-purple-50 border-purple-500 shadow-lg' 
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-sm">{cat.name}</div>
                <div className="text-xs text-gray-500">{cat.count}+ ürün</div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'Tüm Ürünler' : aksesuarCategories.find(c => c.slug === selectedCategory)?.name}
              <span className="text-gray-500 text-lg ml-2">({filteredProducts.length})</span>
            </h2>
            <select className="border rounded-lg px-4 py-2">
              <option>Önerilen</option>
              <option>Fiyat: Düşük-Yüksek</option>
              <option>Fiyat: Yüksek-Düşük</option>
              <option>En Çok Satan</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-110 transition-transform"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                        -%{product.discount}
                      </div>
                    )}
                    <button
                      onClick={() => handleToggleFavorite(product)}
                      className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                    {product.isNew && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        YENİ
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-purple-600 font-semibold">{product.brand}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-purple-600">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-purple-600">
                      {product.price.toFixed(2)} TL
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.oldPrice.toFixed(2)} TL
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sepete Ekle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="font-semibold mb-2">Araca Özel Üretim</h3>
              <p className="text-sm text-gray-600">3D ölçümle tam uyum</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold mb-2">Premium Kalite</h3>
              <p className="text-sm text-gray-600">Orijinal yapıya uygun</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-semibold mb-2">Ücretsiz Kargo</h3>
              <p className="text-sm text-gray-600">Aynı gün kargo imkanı</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AksesuarPage;
