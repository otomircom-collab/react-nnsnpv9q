import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useCart } from '../context/CartContext';
import { yedekParcaCategories, yedekParcaProducts, vehicleBrands } from '../mockData';
import { toast } from '../hooks/use-toast';

const YedekParcaPage = () => {
  const [searchType, setSearchType] = useState('sase'); // 'sase' or 'kategori'
  const [saseNo, setSaseNo] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const handleSaseSearch = () => {
    if (saseNo.length < 10) {
      toast({
        title: "Hata",
        description: "Şase numarası en az 10 karakter olmalıdır.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Arama Yapılıyor",
      description: `Şase No: ${saseNo} için uygun parçalar bulunuyor...`,
    });
  };

  const handleVehicleSearch = () => {
    if (!selectedBrand || !selectedModel || !selectedYear) {
      toast({
        title: "Hata",
        description: "Lütfen araç bilgilerini eksiksiz doldurun.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Arama Yapılıyor",
      description: `${selectedBrand} ${selectedModel} ${selectedYear} için uygun parçalar bulunuyor...`,
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite(product);
    const isFav = isFavorite(product.id);
    toast({
      title: isFav ? "Favorilerden Çıkarıldı" : "Favorilere Eklendi",
      description: `${product.name} ${isFav ? 'favorilerden çıkarıldı' : 'favorilere eklendi'}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Orijinal Yedek Parça</h1>
          <p className="text-lg mb-8 opacity-90">Şase numarası veya araç bilgileriyle hızlıca bulun</p>

          <Tabs value={searchType} onValueChange={setSearchType} className="bg-white rounded-xl p-6 shadow-2xl">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="sase" className="text-base font-semibold">
                <Car className="w-5 h-5 mr-2" />
                Şase Numarası ile Ara
              </TabsTrigger>
              <TabsTrigger value="kategori" className="text-base font-semibold">
                <Search className="w-5 h-5 mr-2" />
                Araç Bilgileri ile Ara
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sase">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Şase Numarası (VIN)
                  </label>
                  <Input
                    type="text"
                    placeholder="Örn: WBADT43452G123456"
                    value={saseNo}
                    onChange={(e) => setSaseNo(e.target.value.toUpperCase())}
                    className="h-14 text-lg"
                    maxLength={17}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Şase numarası 17 karakterden oluşur ve aracınızın ruhsatında bulunur.
                  </p>
                </div>
                <Button 
                  onClick={handleSaseSearch}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg font-semibold"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Uygun Parçaları Bul
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="kategori">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Marka</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full h-12 px-4 border rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500"
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
                    className="w-full h-12 px-4 border rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500"
                    disabled={!selectedBrand}
                  >
                    <option value="">Model Seçin</option>
                    <option value="Focus">Focus</option>
                    <option value="Fiesta">Fiesta</option>
                    <option value="Transit">Transit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Yıl</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full h-12 px-4 border rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500"
                    disabled={!selectedModel}
                  >
                    <option value="">Yıl Seçin</option>
                    {Array.from({ length: 15 }, (_, i) => 2025 - i).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button 
                onClick={handleVehicleSearch}
                className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg font-semibold mt-4"
              >
                <Search className="w-5 h-5 mr-2" />
                Uygun Parçaları Bul
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Parça Kategorileri</h2>
            <p className="text-gray-600 mt-2">İhtiyacınız olan parçayı kategoriye göre bulun</p>
          </div>
          <Link to="/tum-kategoriler" className="text-orange-500 font-semibold hover:text-orange-600 flex items-center">
            Tümünü Gör <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {yedekParcaCategories.map((category) => (
            <Link key={category.id} to={`/yedek-parca/${category.slug}`}>
              <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 hover:border-orange-500 group">
                <CardContent className="p-4 text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count}+ ürün</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
            <Link to="/kampanyalar" className="text-orange-500 font-semibold hover:text-orange-600">
              Tümünü Gör →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {yedekParcaProducts.slice(0, 8).map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Link to={`/yedek-parca/urun/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                    </Link>
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                        -%{product.discount}
                      </div>
                    )}
                    <button
                      onClick={() => handleToggleFavorite(product)}
                      className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                    {product.oem && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        OEM
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-orange-600 font-semibold">{product.brand}</span>
                  </div>
                  <Link to={`/yedek-parca/urun/${product.id}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-orange-500">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="mb-1 text-xs text-gray-600">
                    Stok: <span className="font-semibold text-green-600">{product.stock} adet</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-orange-500">
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
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sepete Ekle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="font-semibold mb-2">Orijinal Parça Garantisi</h3>
              <p className="text-sm text-gray-600">OEM kalitesinde ürünler</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-semibold mb-2">Hızlı Kargo</h3>
              <p className="text-sm text-gray-600">Aynı gün kargo imkanı</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-semibold mb-2">Montaj Desteği</h3>
              <p className="text-sm text-gray-600">Anlaşmalı servisler</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">💯</div>
              <h3 className="font-semibold mb-2">Güvenli Alışveriş</h3>
              <p className="text-sm text-gray-600">256-bit SSL güvenlik</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YedekParcaPage;
