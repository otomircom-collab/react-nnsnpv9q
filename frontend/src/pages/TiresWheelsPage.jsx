import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TiresWheelsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('ebat');

  const tireBrands = [
    { name: 'Michelin', logo: 'https://cdn.lastikcim.com.tr/images/media/desenler/67c9b00fcb273/michelin-366x80_20250306052415.png' },
    { name: 'Goodyear', logo: 'GY' },
    { name: 'Continental', logo: 'CT' },
    { name: 'Pirelli', logo: 'PR' },
    { name: 'Bridgestone', logo: 'BS' },
    { name: 'Lassa', logo: 'LS' },
    { name: 'Petlas', logo: 'PT' },
    { name: 'Hankook', logo: 'HK' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/tires-wheels`);
      if (response.data.length === 0) {
        setProducts(generateMockTires());
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      setProducts(generateMockTires());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTires = () => {
    const brands = ['Michelin', 'Goodyear', 'Continental', 'Lassa', 'Bridgestone', 'Petlas', 'Hankook', 'Pirelli'];
    const tires = [
      { name: 'Michelin Alpin 7 205/55R16 91T', price: 4740, oldPrice: 6004, discount: 21, season: '❄️', oem: false },
      { name: 'Goodyear Eagle Sport 4S 225/45R17 94W', price: 3696, oldPrice: null, discount: 0, season: '🌦️', oem: false },
      { name: 'Lassa Snoways 4 205/55R16 91H', price: 3355, oldPrice: null, discount: 0, season: '❄️', oem: false },
      { name: 'Continental AllSeason 215/50R17 95V', price: 6708, oldPrice: null, discount: 0, season: '🌦️', oem: false },
      { name: 'Bridgestone Blizzak LM001 RFT 205/55R16', price: 4000, oldPrice: 5054, discount: 20, season: '❄️', oem: true },
      { name: 'Hankook Kinergy 4S2 205/55R16 94H', price: 3602, oldPrice: null, discount: 0, season: '🌦️', oem: false },
      { name: 'Petlas Snowmaster 2 205/55R16 91H', price: 2540, oldPrice: null, discount: 0, season: '❄️', oem: false },
      { name: 'Continental WinterContact 195/60R18 96H', price: 7799, oldPrice: null, discount: 0, season: '❄️', oem: false }
    ];

    return tires.map((tire, i) => ({
      id: `tire-${i + 1}`,
      name: tire.name,
      brand: tire.name.split(' ')[0],
      price: tire.price,
      oldPrice: tire.oldPrice,
      discount: tire.discount,
      season: tire.season,
      oem: tire.oem,
      stock: Math.floor(Math.random() * 100) + 20,
      image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=400&fit=crop',
      rating: 4.5 + Math.random() * 0.4,
      reviewCount: Math.floor(Math.random() * 200) + 10,
      fuel: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      wet: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      noise: 69 + Math.floor(Math.random() * 6)
    }));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-12 text-white mb-8">
            <h1 className="text-4xl font-bold mb-3">Jant & Lastik</h1>
            <p className="text-xl text-white/90">81 ilde 1000+ montaj noktası - Ücretsiz kargo - Peşin fiyatına taksit</p>
          </div>

          {/* Arama Tabs */}
          <Card className="p-6 mb-8">
            <Tabs value={searchType} onValueChange={setSearchType}>
              <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-6">
                <TabsTrigger value="ebat">Ebata Göre</TabsTrigger>
                <TabsTrigger value="arac">Araca Göre</TabsTrigger>
                <TabsTrigger value="jant">Jant Ara</TabsTrigger>
                <TabsTrigger value="yag">Motor Yağı</TabsTrigger>
                <TabsTrigger value="zincir">Kar Zinciri</TabsTrigger>
              </TabsList>

              <TabsContent value="ebat">
                <div className="grid md:grid-cols-5 gap-4">
                  <select className="h-12 px-3 border-2 border-gray-300 rounded-lg"><option>Taban</option></select>
                  <select className="h-12 px-3 border-2 border-gray-300 rounded-lg"><option>Yanak</option></select>
                  <select className="h-12 px-3 border-2 border-gray-300 rounded-lg"><option>Jant</option></select>
                  <select className="h-12 px-3 border-2 border-gray-300 rounded-lg"><option>Mevsim</option></select>
                  <Button className="bg-orange-500 hover:bg-orange-600 h-12 font-semibold">Arama Yap</Button>
                </div>
              </TabsContent>
              <TabsContent value="arac">
                <div className="grid md:grid-cols-4 gap-4">
                  <select className="h-12 px-3 border-2 border-gray-300 rounded-lg"><option>Marka</option></select>
                  <select className="h-12 px-3 border-2 border-gray-300 rounded-lg"><option>Model</option></select>
                  <select className="h-12 px-3 border-2 border-gray-300 rounded-lg"><option>Yıl</option></select>
                  <Button className="bg-orange-500 hover:bg-orange-600 h-12 font-semibold">Arama Yap</Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Lastik Markaları */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Lastik Markaları</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {tireBrands.map((brand, i) => (
                <button key={i} className="flex-shrink-0 bg-white border border-gray-200 rounded-lg px-6 py-3 hover:shadow-md transition-all">
                  <div className="w-24 h-12 flex items-center justify-center font-bold text-gray-700">{brand.logo.length < 5 ? brand.logo : brand.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Özellikler Banner */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-bold text-sm">Kolay İade</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-bold text-sm">Ücretsiz Kargo</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💳</div>
              <h3 className="font-bold text-sm">Peşin Fiyatına Taksit</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="font-bold text-sm">1000+ Montaj Noktası</h3>
            </div>
          </div>

          {/* Otomobil Lastikleri */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Otomobil Lastikleri</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative">
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="text-xl">{product.season}</span>
                        <span className="text-xl">🚗</span>
                      </div>
                      <img src={product.image_url} alt={product.name} className="w-full h-48 object-contain p-4" />
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-%{product.discount}</div>
                      )}
                      {product.oem && (
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Orijinal Ekipman</div>
                      )}
                    </div>
                    <div className="p-4">
                      <img src="https://via.placeholder.com/80x20?text=Michelin" alt={product.brand} className="h-5 mb-2" />
                      <div className="flex gap-2 mb-2 text-xs">
                        <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{product.fuel}</div>
                        <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{product.wet}</div>
                        <div className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">{product.noise}dB</div>
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">Üretim: 2024 - Ücretsiz Kargo</p>
                      <div className="mb-3">
                        {product.oldPrice && (
                          <p className="text-xs text-gray-400 line-through">{product.oldPrice.toFixed(2)} TL</p>
                        )}
                        <p className="text-xl font-bold text-gray-900">{product.price.toFixed(2)} TL</p>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-medium">{product.rating?.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">Sepete Ekle</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Montaj Noktaları Banner */}
          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-3">
                  <MapPin className="inline w-8 h-8 mr-2" />
                  1000+ Montaj Noktası
                </h2>
                <p className="text-lg">Türkiye'nin 81 ilinde anlaşmalı montaj servisleri</p>
              </div>
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold">
                Montaj Noktalarını Gör
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TiresWheelsPage;
