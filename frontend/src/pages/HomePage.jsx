import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  Wrench, Star, Circle, Briefcase, Bot, Shield, Zap, MapPin, 
  TrendingUp, Award, Truck, HeadphonesIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      wrench: Wrench,
      star: Star,
      circle: Circle,
      briefcase: Briefcase,
      bot: Bot,
      shield: Shield,
      zap: Zap,
      'map-pin': MapPin
    };
    return icons[iconName] || Wrench;
  };

  const getCategoryLink = (categoryId) => {
    const links = {
      'spare-parts': '/yedek-parca',
      'accessories': '/aksesuar',
      'tires-wheels': '/jant-lastik',
      'b2b': '/ustam-ozel',
      'maintenance-bot': '/bakim-robotu',
      'insurance': '/sigortan',
      'quick-delivery': '/aninda-teslimat',
      'service-finder': '/servis-bulucu'
    };
    return links[categoryId] || '/';
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6" data-testid="hero-title">
                Otomobiliniz için<br />
                <span className="text-yellow-300">Her Şey Bir Tıkta!</span>
              </h1>
              <p className="text-xl mb-8 text-white/90" data-testid="hero-subtitle">
                Yedek parça, aksesuar, lastik ve daha fazlası. Aynı gün teslimat ile hızlı ve güvenilir alışveriş.
              </p>
              <div className="flex gap-4">
                <Button 
                  className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold"
                  data-testid="hero-cta-button"
                >
                  <Link to="/yedek-parca">Alışverişe Başla</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-6 text-lg rounded-full font-semibold"
                  data-testid="hero-bot-button"
                >
                  <Link to="/bakim-robotu">Bakım Robotu</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop"
                alt="Otomotiv"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - Migros Style */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10" data-testid="categories-title">
            Kategoriler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <Link
                  key={category.id}
                  to={getCategoryLink(category.id)}
                  className="category-card group"
                  data-testid={`home-category-${category.id}`}
                >
                  <div 
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-orange-500 transition-all"
                    style={{ borderColor: category.color + '20' }}
                  >
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: category.color + '15' }}
                    >
                      <IconComponent 
                        className="w-8 h-8" 
                        style={{ color: category.color }}
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="feature-delivery">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600 text-sm">Aynı gün teslimat seçenekleri</p>
            </div>
            <div className="text-center" data-testid="feature-quality">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Orijinal Ürünler</h3>
              <p className="text-gray-600 text-sm">%100 orijinal ve garantili</p>
            </div>
            <div className="text-center" data-testid="feature-support">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <HeadphonesIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">7/24 Destek</h3>
              <p className="text-gray-600 text-sm">Uzman ekibimiz her zaman yanınızda</p>
            </div>
            <div className="text-center" data-testid="feature-price">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">En İyi Fiyat</h3>
              <p className="text-gray-600 text-sm">Rekabetçi fiyat garantisi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Banners */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/aninda-teslimat" className="block" data-testid="banner-quick-delivery">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-8 hover:shadow-xl transition-all">
                <Zap className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Anında Teslimat</h3>
                <p className="text-white/90">20-60 dakika içinde kapınızda</p>
              </div>
            </Link>
            <Link to="/bakim-robotu" className="block" data-testid="banner-maintenance-bot">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-8 hover:shadow-xl transition-all">
                <Bot className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Bakım Robotu</h3>
                <p className="text-white/90">AI destekli bakım önerileri</p>
              </div>
            </Link>
            <Link to="/sigortan" className="block" data-testid="banner-insurance">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-2xl p-8 hover:shadow-xl transition-all">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Sigorta Karşılaştır</h3>
                <p className="text-white/90">30+ şirketten en iyi teklif</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="cta-title">
            Profesyonel misiniz?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Ustam Özel ile kurumsal avantajlardan yararlanın
          </p>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-6 text-lg rounded-full font-semibold"
            data-testid="cta-b2b-button"
          >
            <Link to="/ustam-ozel">B2B Kayıt Ol</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
