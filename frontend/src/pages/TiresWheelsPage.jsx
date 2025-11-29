import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TiresWheelsPage = () => {
  const [products, setProducts] = useState([]);
  const [servicePoints, setServicePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState('Lastik');
  const [season, setSeason] = useState('all');

  useEffect(() => {
    fetchProducts();
    fetchServicePoints();
  }, [productType, season]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API}/tires-wheels?type=${productType}`;
      if (season !== 'all') {
        url += `&season=${season}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data.length === 0) {
        setProducts(generateMockTiresWheels());
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
      setProducts(generateMockTiresWheels());
    } finally {
      setLoading(false);
    }
  };

  const fetchServicePoints = async () => {
    try {
      const response = await axios.get(`${API}/service-points`);
      if (response.data.length === 0) {
        setServicePoints(generateMockServicePoints());
      } else {
        setServicePoints(response.data);
      }
    } catch (error) {
      setServicePoints(generateMockServicePoints());
    }
  };

  const generateMockTiresWheels = () => {
    const brands = ['Michelin', 'Bridgestone', 'Continental', 'Pirelli', 'Goodyear', 'Lassa'];
    const sizes = ['195/65R15', '205/55R16', '225/45R17', '235/40R18'];
    const seasons = ['Yaz', 'Kış', '4 Mevsim'];
    
    return Array.from({ length: 12 }, (_, index) => ({
      id: `tire-${index + 1}`,
      name: `${brands[index % brands.length]} ${productType} ${sizes[index % sizes.length]}`,
      brand: brands[index % brands.length],
      type: productType,
      size: sizes[index % sizes.length],
      season: seasons[index % seasons.length],
      price: Math.random() * 2000 + 500,
      stock: Math.floor(Math.random() * 40) + 4,
      image_url: productType === 'Lastik'
        ? `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=300&fit=crop&q=80`
        : `https://images.unsplash.com/photo-1617886322168-72b886573c35?w=300&h=300&fit=crop&q=80`,
      description: `${brands[index % brands.length]} ${seasons[index % seasons.length]} lasik`,
      rating: 4.6
    }));
  };

  const generateMockServicePoints = () => {
    const points = [
      { name: 'Lastik Merkezi Kadıköy', city: 'İstanbul', lat: 40.9905, lon: 29.0267 },
      { name: 'Express Lastik Beşiktaş', city: 'İstanbul', lat: 41.0422, lon: 29.0076 },
      { name: 'Pro Lastik Ankara', city: 'Ankara', lat: 39.9334, lon: 32.8597 },
      { name: 'Hızlı Montaj İzmir', city: 'İzmir', lat: 38.4237, lon: 27.1428 }
    ];

    return points.map((point, index) => ({
      id: `service-${index + 1}`,
      name: point.name,
      address: `${point.city} Merkez`,
      city: point.city,
      phone: '0850 123 45 67',
      latitude: point.lat,
      longitude: point.lon,
      rating: 4.5 + Math.random() * 0.5,
      services: ['Lastik Montaj', 'Balans', 'Rot Balans', 'Lastik Onarım'],
      working_hours: '09:00 - 19:00'
    }));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" data-testid="page-title">Jant & Lastik</h1>
          <p className="text-gray-600">1000+ montaj noktası ile güvenli alışveriş</p>
        </div>

        <Tabs value={productType} onValueChange={setProductType} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2" data-testid="product-type-tabs">
            <TabsTrigger value="Lastik">Lastik</TabsTrigger>
            <TabsTrigger value="Jant">Jant</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mevsim</label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger data-testid="season-select">
                  <SelectValue placeholder="Mevsim seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Mevsimler</SelectItem>
                  <SelectItem value="Yaz">Yaz</SelectItem>
                  <SelectItem value="Kış">Kış</SelectItem>
                  <SelectItem value="4 Mevsim">4 Mevsim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} category="tires-wheels" />
            ))}
          </div>
        )}

        {/* Service Points */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-6" data-testid="service-points-title">
            <MapPin className="inline w-8 h-8 mr-2" />
            Montaj Noktaları
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicePoints.slice(0, 4).map((point) => (
              <div key={point.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4" data-testid={`service-point-${point.id}`}>
                <h3 className="font-bold mb-2">{point.name}</h3>
                <p className="text-sm text-white/80 mb-1">{point.address}</p>
                <p className="text-sm text-white/80 mb-1">📞 {point.phone}</p>
                <p className="text-sm text-yellow-300">⭐ {point.rating.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TiresWheelsPage;
