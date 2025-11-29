import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, ChevronDown, Star, Tag, Menu, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DeliveryModal from '@/components/DeliveryModal';
import AuthModal from '@/components/AuthModal';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import ChatSupport from '@/components/ChatSupport';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Layout = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [orderTrackingModalOpen, setOrderTrackingModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    fetchCartCount();
    
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const response = await axios.get(`${API}/cart/${userId}`);
      setCartCount(response.data.length);
      const total = response.data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setCartTotal(total);
    } catch (error) {
      console.error('Sepet sayısı alınamadı:', error);
    }
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/yedek-parca?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. EN ÜSTTE - SAYFA GEÇİŞLERİ (Migros gibi kutucuk/kolon) */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-stretch gap-0 overflow-x-auto scrollbar-hide">
            <Link
              to="/yedek-parca"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap flex-shrink-0 border-r border-gray-200 transition-all min-w-[120px] ${
                location.pathname === '/yedek-parca'
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-700 hover:bg-white hover:text-orange-600'
              }`}
              data-testid="tab-spare-parts"
            >
              <span className="text-3xl">🔧</span>
              <span>Yedek Parça</span>
            </Link>
            <Link
              to="/aksesuar"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap flex-shrink-0 border-r border-gray-200 transition-all min-w-[120px] ${
                location.pathname === '/aksesuar'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-purple-600'
              }`}
              data-testid="tab-accessories"
            >
              <span className="text-3xl">🎨</span>
              <span>Aksesuar</span>
            </Link>
            <Link
              to="/jant-lastik"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap flex-shrink-0 border-r border-gray-200 transition-all min-w-[120px] ${
                location.pathname === '/jant-lastik'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-blue-600'
              }`}
              data-testid="tab-tires"
            >
              <span className="text-3xl">⚙️</span>
              <span>Jant & Lastik</span>
            </Link>
            <Link
              to="/ustam-ozel"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap flex-shrink-0 border-r border-gray-200 transition-all min-w-[120px] ${
                location.pathname === '/ustam-ozel'
                  ? 'bg-white text-gray-700 shadow-sm'
                  : 'text-gray-700 hover:bg-white'
              }`}
              data-testid="tab-b2b"
            >
              <span className="text-3xl">👨‍🔧</span>
              <span>Ustam Özel</span>
            </Link>
            <Link
              to="/bakim-robotu"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap flex-shrink-0 border-r border-gray-200 transition-all min-w-[120px] ${
                location.pathname === '/bakim-robotu'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-cyan-600'
              }`}
              data-testid="tab-bot"
            >
              <span className="text-3xl">🤖</span>
              <span>Bakım Robotu</span>
            </Link>
            <Link
              to="/sigortan"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap flex-shrink-0 border-r border-gray-200 transition-all min-w-[120px] ${
                location.pathname === '/sigortan'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-red-600'
              }`}
              data-testid="tab-insurance"
            >
              <span className="text-3xl">🛡️</span>
              <span>Sigortan</span>
            </Link>
            <Link
              to="/aninda-teslimat"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap flex-shrink-0 border-r border-gray-200 transition-all min-w-[120px] ${
                location.pathname === '/aninda-teslimat'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-green-600'
              }`}
              data-testid="tab-quick-delivery"
            >
              <span className="text-3xl">⚡</span>
              <span>Anında Teslimat</span>
            </Link>
            <Link
              to="/servis-bulucu"
              className={`flex flex-col items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all min-w-[120px] ${
                location.pathname === '/servis-bulucu'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:text-indigo-600'
              }`}
              data-testid="tab-service-finder"
            >
              <span className="text-3xl">📍</span>
              <span>Servis Bulucu</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ORTA - Sipariş Takibi + Giriş */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-end gap-3 h-12">
            <button 
              onClick={() => setOrderTrackingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded" 
              data-testid="order-tracking"
            >
              <Package className="w-4 h-4" />
              Sipariş Takibi
            </button>
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-100 rounded" 
              data-testid="account-link"
            >
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs">👤</div>
              Üye Ol veya Giriş Yap
            </button>
          </div>
        </div>
      </div>

      {/* 3. ALT - Logo + Teslimat + Arama + Sepet */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo - Trendyol Tarzı */}
            <Link to="/" className="flex items-center flex-shrink-0" data-testid="logo-link">
              <div className="text-2xl font-bold leading-tight">
                <span className="text-gray-900">OTOMARKET</span>
                <span className="text-orange-500">go</span>
              </div>
            </Link>

            {/* Teslimat Yöntemi */}
            <button 
              onClick={() => setDeliveryModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Teslimat Yöntemini Belirle</span>
              <ChevronDown className="w-3 h-3 text-gray-600" />
            </button>

            {/* Arama */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Ürün, marka veya OEM kodu ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-4 pr-4 text-sm border-2 border-gray-300 focus:border-orange-500 rounded-l-lg"
                  data-testid="search-input"
                />
              </div>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-11 text-sm font-semibold rounded-r-lg rounded-l-none"
                data-testid="search-button"
              >
                Ara
              </Button>
            </form>

            {/* Sepet */}
            <Link to="/sepet" data-testid="cart-link">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" data-testid="cart-count">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-600 leading-tight">Sepetim</div>
                  <div className="text-xs font-bold text-gray-900 leading-tight">
                    {cartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. EN ALT - Kategoriler Menüsü */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center gap-6 py-2.5 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-orange-500 whitespace-nowrap">
              <Menu className="w-4 h-4" />
              KATEGORİLER
            </button>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-500 whitespace-nowrap">
              <Star className="w-4 h-4" />
              FAVORİLERİM
            </button>
            <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-orange-500 whitespace-nowrap">
              KAMPANYALAR
            </Link>
            <Link to="/bakim-robotu" className="text-sm font-semibold text-gray-700 hover:text-orange-500 whitespace-nowrap">
              MİGROSKOP
            </Link>
            <Link to="/aninda-teslimat" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-500 whitespace-nowrap">
              <Tag className="w-4 h-4" />
              ÇOKLU İNDİRİMLER
            </Link>
            <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-orange-500 whitespace-nowrap">
              MONEY İNDİRİMLİ
            </Link>
            <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-orange-500 whitespace-nowrap">
              NE PİŞİRSEM?
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50">{children}</main>

      {/* Modals */}
      <DeliveryModal open={deliveryModalOpen} onOpenChange={setDeliveryModalOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <OrderTrackingModal open={orderTrackingModalOpen} onOpenChange={setOrderTrackingModalOpen} />
      
      {/* Chat Support */}
      <ChatSupport />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-white">OTOMARKET</span>
                <span className="text-orange-500">GO</span>
              </h3>
              <p className="text-gray-400 text-sm">
                Otomobiliniz için ihtiyacınız olan her şey, tek tıkla kapınızda!
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kurumsal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-orange-400">İletişim</a></li>
                <li><a href="#" className="hover:text-orange-400">Kariyer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Yardım</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400">SSS</a></li>
                <li><a href="#" className="hover:text-orange-400">Kargo Takibi</a></li>
                <li><a href="#" className="hover:text-orange-400">İade & Değişim</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 444 0 867</li>
                <li>✉️ destek@otomarketgo.com</li>
                <li>📍 İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 OTOMARKETGO. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
