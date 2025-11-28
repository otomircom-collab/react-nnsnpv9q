import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ShoppingCart, Gauge, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useCart } from '../context/CartContext';
import { lastikProducts, jantProducts, vehicleBrands } from '../mockData';
import { toast } from '../hooks/use-toast';

const JantLastikPage = () => {
  const [productType, setProductType] = useState('lastik');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [lastikEbat, setLastikEbat] = useState('');
  const [mevsim, setMevsim] = useState('');
  const { addToCart } = useCart();

  const currentProducts = productType === 'lastik' ? lastikProducts : jantProducts;

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepetinize eklendi. Montaj için anlaşmalı servislerimizi kullanabilirsiniz.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black mb-4">Lastik & Jant</h1>
            <p className="text-xl opacity-90">1000+ Montaj Noktası | Ücretsiz Kargo | ETİD Onaylı</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-5xl mx-auto">
            <Tabs value={productType} onValueChange={setProductType} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lastik" className="text-lg font-bold">
                  <Gauge className="w-5 h-5 mr-2" />
                  Lastik Ara
                </TabsTrigger>
                <TabsTrigger value="jant" className="text-lg font-bold">
                  <Award className="w-5 h-5 mr-2" />
                  Jant Ara
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lastik">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Genişlik</label>
                    <select className="w-full h-12 px-4 border-2 rounded-lg text-gray-700">
                      <option>205</option>
                      <option>215</option>
                      <option>225</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yükseklik</label>
                    <select className="w-full h-12 px-4 border-2 rounded-lg text-gray-700">
                      <option>55</option>
                      <option>60</option>
                      <option>65</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jant Çapı</label>
                    <select className="w-full h-12 px-4 border-2 rounded-lg text-gray-700">
                      <option>16</option>
                      <option>17</option>
                      <option>18</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mevsim</label>
                    <select 
                      value={mevsim}
                      onChange={(e) => setMevsim(e.target.value)}
                      className="w-full h-12 px-4 border-2 rounded-lg text-gray-700"
                    >
                      <option value="">Tümü</option>
                      <option value="yaz">Yaz</option>
                      <option value="kis">Kış</option>
                      <option value="dort-mevsim">4 Mevsim</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 h-14 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Lastik Ara
                </Button>
              </TabsContent>

              <TabsContent value="jant">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jant Çapı</label>
                    <select className="w-full h-12 px-4 border-2 rounded-lg text-gray-700">
                      <option>15"</option>
                      <option>16"</option>
                      <option>17"</option>
                      <option>18"</option>
                      <option>19"</option>
                      <option>20"</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PCD (Bijon Ölçüsü)</label>
                    <select className="w-full h-12 px-4 border-2 rounded-lg text-gray-700">
                      <option>4x100</option>
                      <option>5x112</option>
                      <option>5x120</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Marka</label>
                    <select className="w-full h-12 px-4 border-2 rounded-lg text-gray-700">
                      <option>OZ Racing</option>
                      <option>BBS</option>
                      <option>Enkei</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 h-14 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Jant Ara
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>En yakın montaj noktası: <strong className="text-blue-600">İstanbul Kadıköy (2.3 km)</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Season Selection */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button 
            onClick={() => setMevsim('yaz')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              mevsim === 'yaz' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-white border-2 hover:border-yellow-500'
            }`}
          >
            ☀️ Yaz Lastikleri
          </button>
          <button 
            onClick={() => setMevsim('kis')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              mevsim === 'kis' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white border-2 hover:border-blue-500'
            }`}
          >
            ❄️ Kış Lastikleri
          </button>
          <button 
            onClick={() => setMevsim('dort-mevsim')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              mevsim === 'dort-mevsim' ? 'bg-green-500 text-white shadow-lg' : 'bg-white border-2 hover:border-green-500'
            }`}
          >
            🍃 4 Mevsim Lastikleri
          </button>
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {productType === 'lastik' ? 'Lastikler' : 'Jantlar'} ({currentProducts.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain rounded-lg bg-gray-50 group-hover:scale-110 transition-transform"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                        -%{product.discount}
                      </div>
                    )}
                    {product.label && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        {product.label}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-blue-600 font-semibold">{product.brand}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.size && (
                    <div className="text-xs text-gray-600 mb-2">
                      Ebat: <span className="font-semibold">{product.size}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-blue-600">
                      {product.price.toFixed(2)} TL
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.oldPrice.toFixed(2)} TL
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-green-600 font-semibold mb-2">
                    + Ücretsiz Montaj
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sepete Ekle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-semibold mb-2">ETİD Onaylı</h3>
              <p className="text-sm text-gray-600">Güvenilir platform</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-semibold mb-2">1000+ Montaj Noktası</h3>
              <p className="text-sm text-gray-600">Türkiye geneli</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-semibold mb-2">Ücretsiz Kargo</h3>
              <p className="text-sm text-gray-600">Hızlı teslimat</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="font-semibold mb-2">Orijinal Ürün</h3>
              <p className="text-sm text-gray-600">Garantili lastikler</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JantLastikPage;
