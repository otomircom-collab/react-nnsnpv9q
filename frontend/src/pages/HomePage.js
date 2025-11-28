import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react';
import { categories, products, sliderItems } from '../mockData';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from '../hooks/use-toast';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const featuredProducts = products.filter(p => p.isFeatured);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Ürün Sepete Eklendi",
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
      {/* Hero Slider - Migros Style */}
      <div className="relative h-[600px] overflow-hidden bg-gray-100">
        {sliderItems.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              background: `linear-gradient(135deg, ${slide.backgroundColor} 0%, ${slide.backgroundColor}ee 100%)`
            }}
          >
            <div className="container mx-auto px-4 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center">
                <div className="text-white space-y-8 z-10">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    {slide.title}
                  </div>
                  <h2 className="text-7xl font-black leading-tight drop-shadow-lg">
                    {slide.subtitle}
                  </h2>
                  <p className="text-2xl font-medium opacity-90 max-w-lg">
                    {slide.description}
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-white text-orange-600 hover:bg-gray-50 text-xl font-bold px-12 py-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
                  >
                    {slide.buttonText}
                  </Button>
                </div>
                <div className="hidden lg:flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl rounded-3xl"></div>
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="relative max-h-[500px] object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-20"
        >
          <ChevronLeft className="w-7 h-7 text-orange-500" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-20"
        >
          <ChevronRight className="w-7 h-7 text-orange-500" />
        </button>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {sliderItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-12' : 'bg-white/50 w-3 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
        {/* Slide Counter */}
        <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-gray-800 z-20">
          {currentSlide + 1} / {sliderItems.length}
        </div>
      </div>

      {/* Product Categories */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Kategoriler</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/kategori/${category.slug}`}>
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-orange-500">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.subcategories.length} alt kategori</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Fırsat Ürünleri</h2>
            <Link to="/kampanyalar" className="text-orange-500 font-semibold hover:text-orange-600">
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Link to={`/urun/${product.id}`}>
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
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">{product.brand}</span>
                  </div>
                  <Link to={`/urun/${product.id}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-orange-500">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-orange-500">
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
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="font-semibold mb-2">Esneklik Ödeme İmkanları</h3>
              <p className="text-sm text-gray-600">Kredi kartına taksit seçenekleri</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">İstediğin Saatte Teslimat</h3>
              <p className="text-sm text-gray-600">Hızlı ve güvenli teslimat</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-semibold mb-2">Uzman Montaj Hizmeti</h3>
              <p className="text-sm text-gray-600">Profesyonel teknik destek</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">OtoPuan Kazanırın</h3>
              <p className="text-sm text-gray-600">Her alışverişte puan kazan</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
