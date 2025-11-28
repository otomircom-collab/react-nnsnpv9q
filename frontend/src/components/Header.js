import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, Menu, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = () => {
  const { cartCount, favorites, cartTotal } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/arama?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                <span>⚡</span>
                Anında Teslimat
              </span>
              <span className="flex items-center gap-1">
                <span>📦</span>
                Ücretsiz Kargo 500 TL Üzeri
              </span>
              <span className="flex items-center gap-1">
                <span>🎁</span>
                Güvenli Alışveriş
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/yardim" className="hover:underline">Yardım</Link>
              <Link to="/iletisim" className="hover:underline">İletişim</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold text-2xl">
              OtoDepon
            </div>
          </Link>

          {/* Location Selector */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 border rounded-lg hover:border-orange-500 cursor-pointer transition-colors">
            <MapPin className="w-5 h-5 text-orange-500" />
            <div className="text-sm">
              <div className="text-gray-500 text-xs">Teslimat Yöntemi</div>
              <div className="font-semibold">Seç</div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ürün, marka veya kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 px-8">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Link to="/favoriler" className="relative hover:text-orange-500 transition-colors">
              <Heart className="w-6 h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/hesap" className="hover:text-orange-500 transition-colors">
              <User className="w-6 h-6" />
            </Link>
            <Link to="/sepet" className="relative">
              <Button className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Sepetim</div>
                  <div className="font-bold">{cartTotal.toFixed(2)} TL</div>
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 py-3">
            <Button variant="ghost" className="flex items-center gap-2 font-semibold">
              <Menu className="w-5 h-5" />
              Kategoriler
            </Button>
            <Link to="/kampanyalar" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Kampanyalar
            </Link>
            <Link to="/yeni-urunler" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Yeni Ürünler
            </Link>
            <Link to="/cok-satanlar" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Çok Satanlar
            </Link>
            <Link to="/markalar" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Markalar
            </Link>
            <Link to="/magaza" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Mağazalar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
