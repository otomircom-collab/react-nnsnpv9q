import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = () => {
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Yedek Parça', path: '/', icon: '🔧' },
    { name: 'Aksesuar', path: '/aksesuar', icon: '🎨' },
    { name: 'Jant & Lastik', path: '/jant-lastik', icon: '⚙️' },
    { name: 'Ustam Özel', path: '/ustam-ozel', icon: '👨‍🔧' },
    { name: 'Bakım Robotu', path: '/bakim-robotu', icon: '🤖' },
    { name: 'Sigortan', path: '/sigortan', icon: '🛡️' },
    { name: 'Anında Teslimat', path: '/aninda-teslimat', icon: '⚡' },
    { name: 'Servis Bulucu', path: '/servis-bulucu', icon: '📍' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/arama?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Category Tabs - Just like Migros */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className={`flex-shrink-0 px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                  isActive(category.path)
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600'
                    : 'text-gray-700 hover:bg-orange-50 border-transparent hover:border-orange-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header - Logo, Search, Cart */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-1 px-4 py-2 hover:opacity-90 transition-opacity">
              <span className="text-3xl font-black text-gray-900 tracking-tight">OtoMarket</span>
              <span className="text-3xl font-black text-orange-500 tracking-tight">Go</span>
            </div>
          </Link>

          {/* Location Selector */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 border rounded-lg hover:border-orange-500 cursor-pointer transition-all group">
            <MapPin className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
            <div className="text-sm">
              <div className="text-gray-500 text-xs">Teslimat Yöntemi</div>
              <div className="font-semibold flex items-center gap-1">
                Belirle <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Coca-Cola, Fanta ve Sprite 6×250 ML Çeşitleri 145 TL!"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 h-12 text-base"
              />
              <Button 
                type="submit" 
                className="absolute right-0 top-0 h-12 bg-orange-500 hover:bg-orange-600 px-6 rounded-l-none"
              >
                Ara
              </Button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <Link to="/hesap">
              <Button variant="ghost" className="flex flex-col items-center h-auto py-2 px-4 hover:bg-orange-50">
                <User className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">Üye Ol veya Giriş Yap</span>
              </Button>
            </Link>
            <Link to="/sepet" className="relative">
              <Button className="bg-orange-500 hover:bg-orange-600 flex items-center gap-3 h-auto py-3 px-6">
                <ShoppingCart className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs opacity-90">Sepetim</div>
                  <div className="font-bold text-base">{cartTotal.toFixed(2)} TL</div>
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sub Navigation - Just like Migros */}
      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 py-2 overflow-x-auto">
            <Link to="/goklu-indirimler" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-white rounded transition-all whitespace-nowrap">
              🔥 GÖKLU İNDİRİMLER
            </Link>
            <Link to="/money-indirimli" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-white rounded transition-all whitespace-nowrap">
              💰 MONEY İNDİRİMLİ
            </Link>
            <Link to="/ne-pisirsem" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-white rounded transition-all whitespace-nowrap">
              🍳 NE PİŞİRSEM
            </Link>
            <Link to="/firsat-urunleri" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-white rounded transition-all whitespace-nowrap">
              ⚡ Fırsat Ürünleri
            </Link>
            <Link to="/yeni-gelenler" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-white rounded transition-all whitespace-nowrap">
              ✨ Yeni Gelenler
            </Link>
            <Link to="/cok-satanlar" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-white rounded transition-all whitespace-nowrap">
              🏆 Çok Satanlar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
