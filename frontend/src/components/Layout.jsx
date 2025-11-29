import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, ChevronDown, Star, Tag, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Layout = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
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
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAND - Logo + Alt Markalar + Giriş */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center bg-orange-500 px-6 py-4 -ml-4" data-testid="logo-link">
              <div className="text-white">
                <div className="text-2xl font-bold leading-tight">OTOMARKET</div>
                <div className="text-xl font-bold leading-tight">GO</div>
              </div>
            </Link>

            {/* Alt Markalar - Migros Tarzı */}
            <div className="hidden lg:flex items-center gap-6 flex-1 ml-8">
              <Link to="/aninda-teslimat" className="text-sm font-medium text-gray-700 hover:text-orange-500 whitespace-nowrap">
                Anında Teslimat
              </Link>
              <Link to="/aksesuar" className="text-sm font-medium text-gray-700 hover:text-orange-500 whitespace-nowrap">
                Aksesuar
              </Link>
              <Link to="/jant-lastik" className="text-sm font-medium text-gray-700 hover:text-orange-500 whitespace-nowrap">
                Jant & Lastik
              </Link>
              <Link to="/ustam-ozel" className="text-sm font-medium text-gray-700 hover:text-orange-500 whitespace-nowrap">
                Ustam Özel
              </Link>
            </div>

            {/* Sağ Taraf - Sipariş Takibi + Giriş */}
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-700 hover:text-orange-500" data-testid="order-tracking">
                Sipariş Takibi
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-orange-500" data-testid="account-link">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
                Üye Ol veya Giriş Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE BAND - Teslimat + Arama */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Teslimat Yöntemi */}
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Teslimat Yöntemini Belirle</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {/* Arama */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Ürün, marka veya OEM kodu ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-300 focus:border-orange-500 rounded-lg"
                  data-testid="search-input"
                />
              </div>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 text-base font-medium rounded-lg"
                data-testid="search-button"
              >
                Ara
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* BOTTOM BAND - Kategoriler + Sepet */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Sol - Kategoriler */}
            <div className="flex items-center gap-6">
              <Link
                to="/yedek-parca"
                className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-orange-500"
                data-testid="categories-menu"
              >
                <Menu className="w-4 h-4" />
                KATEGORİLER
              </Link>
              <Link to="/" className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-orange-500">
                <Star className="w-4 h-4" />
                FAVORİLERİM
              </Link>
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-500">
                KAMPANYALAR
              </Link>
              <Link to="/bakim-robotu" className="text-sm font-medium text-gray-700 hover:text-orange-500">
                BAKIM ROBOTU
              </Link>
              <Link to="/aninda-teslimat" className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-orange-500">
                <Tag className="w-4 h-4" />
                HIZLI TESLİMAT
              </Link>
              <Link to="/sigortan" className="text-sm font-medium text-gray-700 hover:text-orange-500">
                SİGORTAN
              </Link>
            </div>

            {/* Sağ - Sepet */}
            <Link to="/sepet" data-testid="cart-link">
              <div className="flex items-center gap-3 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold" data-testid="cart-count">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs text-gray-600">Sepetim</div>
                  <div className="text-sm font-bold text-gray-900">
                    {cartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

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
