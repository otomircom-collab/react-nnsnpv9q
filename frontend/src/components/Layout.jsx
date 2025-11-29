import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Layout = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    fetchCartCount();
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
      {/* Top Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>📞 444 0 867</span>
            <span>|</span>
            <span>✉️ destek@otomarketgo.com</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-orange-400 transition-colors" data-testid="account-link">
              <User className="inline w-4 h-4 mr-1" />
              Hesabım
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center" data-testid="logo-link">
              <div className="text-3xl font-bold">
                <span className="text-gray-900">OTOMARKET</span>
                <span className="text-orange-500">GO</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ürün, marka veya OEM kodu ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-6 text-base border-2 border-gray-200 focus:border-orange-500 rounded-lg"
                  data-testid="search-input"
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600 text-white px-6 h-10 rounded-md"
                  data-testid="search-button"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </form>

            {/* Cart */}
            <Link to="/sepet" data-testid="cart-link">
              <Button variant="outline" className="relative border-2 hover:border-orange-500 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold" data-testid="cart-count">
                    {cartCount}
                  </span>
                )}
                <span className="ml-2 hidden md:inline">Sepetim</span>
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Navigation - Migros Style */}
        <nav className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className={`lg:flex lg:items-center lg:justify-between py-3 gap-2 ${mobileMenuOpen ? 'block' : 'hidden lg:flex'}`}>
              {categories.map((category) => {
                const isActive = location.pathname === getCategoryLink(category.id);
                return (
                  <Link
                    key={category.id}
                    to={getCategoryLink(category.id)}
                    className={`block lg:inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                    data-testid={`category-${category.id}`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

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
