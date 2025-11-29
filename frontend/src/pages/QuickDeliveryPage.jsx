import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, MapPin, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuickDeliveryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postalCode, setPostalCode] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/quick-delivery`);
      
      if (response.data.length === 0) {
        setProducts(generateMockQuickDelivery());
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
      setProducts(generateMockQuickDelivery());
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuickDelivery = () => {
    const quickItems = [
      { name: 'Motor Yağı 5W-30 1L', category: 'Yakıt & Yağ', time: '20-30 dk' },
      { name: 'Cam Suyu 5L', category: 'Bakım Ürünleri', time: '20-30 dk' },
      { name: 'Hava Koku Jeli', category: 'Aksesuar', time: '20-30 dk' },
      { name: 'Oto Temizlik Seti', category: 'Bakım Ürünleri', time: '30-40 dk' },
      { name: 'Ampul H7 Takım', category: 'Elektrik', time: '30-40 dk' },
      { name: 'Araç Şarj Cihazı', category: 'Elektronik', time: '40-60 dk' },
      { name: 'Buji 4lü Takım', category: 'Motor', time: '40-60 dk' },
      { name: 'Sigorta Seti 120 Parça', category: 'Elektrik', time: '40-60 dk' },
      { name: 'Araç Ilk Yardım Çantası', category: 'Güvenlik', time: '40-60 dk' },
      { name: 'Reflektör Ül Takım', category: 'Güvenlik', time: '40-60 dk' },
      { name: 'Çeki Halatı 5 Ton', category: 'Güvenlik', time: '40-60 dk' },
      { name: 'Araç Şampuanı 500ml', category: 'Bakım Ürünleri', time: '20-30 dk' }
    ];

    return quickItems.map((item, index) => ({
      id: `quick-${index + 1}`,
      name: item.name,
      category: item.category,
      price: Math.random() * 300 + 50,
      image_url: `https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=300&h=300&fit=crop&q=80`,
      delivery_time: item.time,
      stock: Math.floor(Math.random() * 15) + 5,
      available_zones: ['34', '35', '06', '41']
    }));
  };

  const handleCheckZone = async () => {
    if (!postalCode.trim()) {
      toast.error('Lütfen posta kodunuzu girin');
      return;
    }

    try {
      const response = await axios.post(`${API}/quick-delivery/check-zone`, null, {
        params: { postal_code: postalCode }
      });
      
      setDeliveryAvailable(response.data.available);
      setEstimatedTime(response.data.estimated_time);
      
      if (response.data.available) {
        toast.success('İyi haber! Bölgenize anlık teslimat yapıyoruz!');
      } else {
        toast.error('Üzgünüz, henüz bölgenize anlık teslimat yapmıyoruz.');
      }
    } catch (error) {
      console.error('Bölge kontrolü yapılamadı:', error);
      toast.error('Bölge kontrolü yapılamadı');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-12 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4" data-testid="page-title">
              <Zap className="inline w-12 h-12 mr-3" />
              Anında Teslimat
            </h1>
            <p className="text-xl mb-6">
              Acil ihtiyaçlarınız 20-60 dakika içinde kapınızda!
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                <span>20-60 dk teslimat</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4" />
                <span>Seçili bölgeler</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>7/24 hizmet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Checker */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4" data-testid="zone-checker-title">Bölgenizi Kontrol Edin</h2>
          <div className="flex gap-4">
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Posta kodunuzu girin (34, 06, vb.)"
              className="flex-1"
              data-testid="postal-code-input"
            />
            <Button
              onClick={handleCheckZone}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              data-testid="check-zone-button"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Kontrol Et
            </Button>
          </div>
          {deliveryAvailable !== null && (
            <div className={`mt-4 p-4 rounded-lg ${
              deliveryAvailable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`} data-testid="delivery-status">
              <p className={`font-semibold ${
                deliveryAvailable ? 'text-green-700' : 'text-red-700'
              }`}>
                {deliveryAvailable 
                  ? `✅ Harika! Bölgenize ${estimatedTime} içinde teslimat yapıyoruz.`
                  : '❌ Üzgünüz, henüz bölgenize anlık teslimat yapmıyoruz.'
                }
              </p>
            </div>
          )}
        </Card>

        {/* Products Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4" data-testid="products-title">Anlık Teslimat Ürünleri</h2>
        </div>

        {loading ? (
          <div className="text-center py-12" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {product.delivery_time}
                </div>
                <ProductCard product={product} category="quick-delivery" />
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">🚀 Nasıl Çalışır?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                1
              </div>
              <h4 className="font-bold mb-2">Sipariş Verin</h4>
              <p className="text-sm text-gray-700">Ürünü sepete ekleyin ve siparişinizi tamamlayın</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                2
              </div>
              <h4 className="font-bold mb-2">Hazırlanıyor</h4>
              <p className="text-sm text-gray-700">Size en yakın depodan siparişiniz hazırlanır</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                3
              </div>
              <h4 className="font-bold mb-2">Teslim!</h4>
              <p className="text-sm text-gray-700">Kurye siparişinizi 20-60 dk içinde adresinize teslim eder</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuickDeliveryPage;
