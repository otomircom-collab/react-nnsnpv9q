import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AccessoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'İç Aksesuar',
    'Dış Aksesuar',
    'Elektronik',
    'Güvenlik',
    'Bakım Ürünleri',
    'Kılıf & Örtü'
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'all'
        ? `${API}/accessories`
        : `${API}/accessories?category=${encodeURIComponent(selectedCategory)}`;
      
      const response = await axios.get(url);
      
      if (response.data.length === 0) {
        setProducts(generateMockAccessories());
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
      setProducts(generateMockAccessories());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAccessories = () => {
    const brands = ['Carface', 'Baseus', 'Automix', 'Tvet', 'Yorex', 'Ankaro'];
    const accessories = [
      { name: 'Araç Koltuk Kılıfı Premium', category: 'İç Aksesuar' },
      { name: 'Direksiyon Kılıfı Deri', category: 'İç Aksesuar' },
      { name: 'Oto Paspas Takımı', category: 'İç Aksesuar' },
      { name: 'Araç Kokusu Seti', category: 'İç Aksesuar' },
      { name: 'Rüzgarlık Seti 4 Parça', category: 'Dış Aksesuar' },
      { name: 'Çamurluk Seti', category: 'Dış Aksesuar' },
      { name: 'Krom Sis Farı', category: 'Dış Aksesuar' },
      { name: 'Araç Kamera Sistemi 360°', category: 'Elektronik' },
      { name: 'Bluetooth FM Transmitter', category: 'Elektronik' },
      { name: 'Araç Şarj Cihazı Hızlı', category: 'Elektronik' },
      { name: 'Çocuk Oto Koltuğu', category: 'Güvenlik' },
      { name: 'Araç Yangın Söndürme', category: 'Güvenlik' }
    ];

    return accessories.map((acc, index) => ({
      id: `acc-${index + 1}`,
      name: acc.name,
      brand: brands[index % brands.length],
      category: acc.category,
      price: Math.random() * 800 + 100,
      stock: Math.floor(Math.random() * 30) + 1,
      image_url: `https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=300&fit=crop&q=80`,
      compatible_vehicles: ['Tüm Araçlar'],
      description: `${acc.name} - Yüksek kalite aksesuar`,
      rating: 4.7
    }));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" data-testid="page-title">Aksesuar</h1>
          <p className="text-gray-600">Aracınızı özelleştirin ve konforunuzu artırın</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex gap-4 items-center">
            <div className="flex-1 max-w-xs">
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

        {loading ? (
          <div className="text-center py-12" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} category="accessories" />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AccessoriesPage;
