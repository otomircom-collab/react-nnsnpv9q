import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-bold text-xl inline-block mb-4">
              OtoDepon
            </div>
            <p className="text-sm mb-4">
              Türkiye'nin en güvenilir otomotiv mağazası. Kaliteli parça, hızlı teslimat, güvenli alışveriş.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hakkimizda" className="hover:text-orange-500 transition-colors">Hakkımızda</Link></li>
              <li><Link to="/magazalar" className="hover:text-orange-500 transition-colors">Mağazalarımız</Link></li>
              <li><Link to="/kariyer" className="hover:text-orange-500 transition-colors">Kariyer</Link></li>
              <li><Link to="/basin" className="hover:text-orange-500 transition-colors">Basın</Link></li>
              <li><Link to="/surdurulebilirlik" className="hover:text-orange-500 transition-colors">Sürdürülebilirlik</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Müşteri Hizmetleri</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/yardim" className="hover:text-orange-500 transition-colors">Yardım Merkezi</Link></li>
              <li><Link to="/siparis-takip" className="hover:text-orange-500 transition-colors">Sipariş Takibi</Link></li>
              <li><Link to="/iade" className="hover:text-orange-500 transition-colors">İade & Değişim</Link></li>
              <li><Link to="/garanti" className="hover:text-orange-500 transition-colors">Garanti Koşulları</Link></li>
              <li><Link to="/sss" className="hover:text-orange-500 transition-colors">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-orange-500" />
                <div>
                  <div className="font-semibold text-white">444 0 850</div>
                  <div className="text-xs">7/24 Müşteri Hizmetleri</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 text-orange-500" />
                <div>
                  <div>info@otodepon.com.tr</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-orange-500" />
                <div>
                  <div>İstanbul, Türkiye</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>
              © 2024 OtoDepon. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-6">
              <Link to="/kullanim-kosullari" className="hover:text-orange-500 transition-colors">Kullanım Koşulları</Link>
              <Link to="/gizlilik" className="hover:text-orange-500 transition-colors">Gizlilik Politikası</Link>
              <Link to="/cerez" className="hover:text-orange-500 transition-colors">Çerez Politikası</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
