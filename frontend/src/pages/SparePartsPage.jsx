import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SparePartsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chassisNumber, setChassisNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'Motor Parçaları',
    'Fren Sistemi',
    'Süspansiyon',
    'Elektrik Parçaları',
    'Kaporta',
    'Egzoz Sistemi',
    'Aydınlatma',
    'İç Donanım',
    'Klima',
    'Yakıt Sistemi',
    'Soğutma Sistemi',
    'Direksiyon'
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'all' 
        ? `${API}/spare-parts`
        : `${API}/spare-parts?category=${encodeURIComponent(selectedCategory)}`;
      
      const response = await axios.get(url);
      
      if (response.data.length === 0) {
        // Mock data if empty
        setProducts(generateMockSpareParts());
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
      setProducts(generateMockSpareParts());
    } finally {
      setLoading(false);
    }
  };

  const generateMockSpareParts = () => {
    const brands = ['Bosch', 'Mann Filter', 'Castrol', 'Valeo', 'Brembo', 'Sachs', 'NGK', 'Mahle'];
    const parts = [
      { name: 'Motor Yağı 5W-30', category: 'Motor Parçaları', oem: 'MOT-5W30-001' },
      { name: 'Hava Filtresi', category: 'Motor Parçaları', oem: 'AIR-FLT-234' },
      { name: 'Yağ Filtresi', category: 'Motor Parçaları', oem: 'OIL-FLT-456' },
      { name: 'Fren Balatası Ön', category: 'Fren Sistemi', oem: 'BRK-PAD-789' },
      { name: 'Fren Diski Ön', category: 'Fren Sistemi', oem: 'BRK-DSK-012' },
      { name: 'Amortisör Ön', category: 'Süspansiyon', oem: 'SUS-AMR-345' },
      { name: 'Salıncak Burcu', category: 'Süspansiyon', oem: 'SUS-ARM-678' },
      { name: 'Buji Takımı', category: 'Elektrik Parçaları', oem: 'ELC-SPK-901' },
      { name: 'Aküdar, category: 'Elektrik Parçaları', oem: 'ELC-BAT-234' },
      { name: 'Far Lambası H7', category: 'Aydınlatma', oem: 'LGT-H7-567' },
      { name: 'Stop Lambası', category: 'Aydınlatma', oem: 'LGT-STP-890' },
      { name: 'Klima Filtresi', category: 'Klimadan', oem: 'AC-FLT-123' }
    ];

    return parts.map((part, index) => ({
      id: `spare-${index + 1}`,
      name: part.name,
      brand: brands[index % brands.length],
      oem_code: part.oem,
      category: part.category,
      price: Math.random() * 500 + 50,
      stock: Math.floor(Math.random() * 20) + 1,
      image_url: `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop&q=80`,
      compatible_vehicles: ['VF1234567890', 'WDB4567890123'],
      description: `${part.name} - Orijinal kalitede yedek parça`,
      rating: 4.5
    }));
  };

  const handleChassisSearch = () => {
    if (chassisNumber.trim()) {
      // Mock chassis search
      fetchProducts();
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" data-testid="page-title">Yedek Parça</h1>
          <p className="text-gray-600">Aracınız için orijinal ve yan sanayi yedek parçalar</p>
        </div>

        {/* Chassis Number Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4" data-testid="chassis-search-title">Şase Numarası ile Ara</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Şase numaranızı girin (VIN)"
              value={chassisNumber}
              onChange={(e) => setChassisNumber(e.target.value)}
              className="flex-1"
              data-testid="chassis-input"
            />
            <Button 
              onClick={handleChassisSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              data-testid="chassis-search-button"
            >
              <Search className="w-5 h-5 mr-2" />
              Ara
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="category-select">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ürünler yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} category="spare-parts" />
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12" data-testid="no-products">
            <p className="text-gray-600">Ürün bulunamadı</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SparePartsPage;
