import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=300&fit=crop',
      title: 'Yedek Parça Kampanyası',
      desc: '%30 İndirim'
    },
    {
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=300&fit=crop',
      title: 'Lastik Sezonunda',
      desc: 'Kış Lastiğinde Fırsat'
    }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const spare = await axios.get(`${API}/spare-parts`);
      const acc = await axios.get(`${API}/accessories`);
      
      if (spare.data.length === 0 && acc.data.length === 0) {
        setFeaturedProducts(generateMockProducts());
      } else {
        setFeaturedProducts([...spare.data.slice(0, 4), ...acc.data.slice(0, 4)]);
      }
    } catch (error) {
      setFeaturedProducts(generateMockProducts());
    }
  };

  const generateMockProducts = () => {
    const brands = ['Bosch', 'Mann Filter', 'Castrol', 'Michelin', 'Brembo', 'NGK', 'Valeo', 'Sachs'];
    const products = [
      { name: 'Motor Yağı 5W-30 4L', cat: 'spare-parts' },
      { name: 'Hava Filtresi', cat: 'spare-parts' },
      { name: 'Fren Balatası Ön Set', cat: 'spare-parts' },
      { name: 'Yağ Filtresi', cat: 'spare-parts' },
      { name: 'Araç Koltuk Kılıfı Premium', cat: 'accessories' },
      { name: 'Oto Paspas Takımı', cat: 'accessories' },
      { name: 'Araç Kamera Sistemi', cat: 'accessories' },
      { name: 'Direksiyon Kılıfı Deri', cat: 'accessories' }
    ];

    return products.map((p, i) => ({
      id: `featured-${i}`,
      name: p.name,
      brand: brands[i % brands.length],
      price: Math.random() * 500 + 100,
      stock: Math.floor(Math.random() * 20) + 5,
      image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
      rating: 4.5,
      category: p.cat
    }));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Küçük Slider - Aloparca Tarzı */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Ana Slider */}
          <div className="md:col-span-2 relative overflow-hidden rounded-lg h-64 bg-gray-200">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
                  <h2 className="text-white text-3xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-white/90 text-xl">{slide.desc}</p>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Yan Bannerlar */}
          <div className="hidden md:flex flex-col gap-4">
            <Link to="/aninda-teslimat" className="h-[122px] bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white hover:shadow-lg transition-all">
              <p className="text-sm font-semibold mb-1">Anında Teslimat</p>
              <p className="text-xl font-bold">20-60 Dakika</p>
            </Link>
            <Link to="/bakim-robotu" className="h-[122px] bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-4 text-white hover:shadow-lg transition-all">
              <p className="text-sm font-semibold mb-1">Bakım Robotu</p>
              <p className="text-xl font-bold">AI Öneriler</p>
            </Link>
          </div>
        </div>

        {/* Öne Çıkan Ürünler */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} category={product.category || 'spare-parts'} />
            ))}
          </div>
        </div>

        {/* Popüler Kategoriler */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Popüler Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Filtreler', link: '/yedek-parca', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop' },
              { name: 'Fren Sistemi', link: '/yedek-parca', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop' },
              { name: 'Süspansiyon', link: '/yedek-parca', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop' },
              { name: 'Aydınlatma', link: '/yedek-parca', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop' }
            ].map((cat, i) => (
              <Link
                key={i}
                to={cat.link}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-32 object-cover rounded mb-3" />
                <h3 className="font-semibold text-center">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* İnfo Kartları */}
        <div className="grid md:grid-cols-4 gap-4 py-8 border-t">
          <div className="text-center">
            <div className="text-orange-500 font-bold text-2xl mb-2">1.000.000+</div>
            <p className="text-gray-600 text-sm">Ürün Çeşidi</p>
          </div>
          <div className="text-center">
            <div className="text-orange-500 font-bold text-2xl mb-2">%100</div>
            <p className="text-gray-600 text-sm">Orijinal Ürün</p>
          </div>
          <div className="text-center">
            <div className="text-orange-500 font-bold text-2xl mb-2">7/24</div>
            <p className="text-gray-600 text-sm">Müşteri Desteği</p>
          </div>
          <div className="text-center">
            <div className="text-orange-500 font-bold text-2xl mb-2">Aynı Gün</div>
            <p className="text-gray-600 text-sm">Hızlı Teslimat</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
