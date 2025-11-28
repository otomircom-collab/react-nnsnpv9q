import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Filter, ChevronDown } from 'lucide-react';
import { products, categories } from '../mockData';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from '../hooks/use-toast';

const ProductListPage = () => {
  const { category } = useParams();
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');

  const currentCategory = categories.find(c => c.slug === category);
  const filteredProducts = products.filter(p => 
    p.category === currentCategory?.name || !category
  );

  const brands = [...new Set(filteredProducts.map(p => p.brand))];

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Ürün Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite(product);
    toast({
      title: isFavorite(product.id) ? "Favorilerden Çıkarıldı" : "Favorilere Eklendi",
      description: `${product.name} ${isFavorite(product.id) ? 'favorilerden çıkarıldı' : 'favorilere eklendi'}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-orange-500">Ana Sayfa</Link>
          <span className="text-gray-400">/</span>
          {currentCategory && (
            <span className="font-semibold">{currentCategory.name}</span>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Filtreler</h3>
                </div>

                {/* Categories */}
                {currentCategory && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Alt Kategoriler</h4>
                    <div className="space-y-2">
                      {currentCategory.subcategories.map((sub, index) => (
                        <label key={index} className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
                          <Checkbox />
                          <span className="text-sm">{sub}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brands */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Markalar</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
                        <Checkbox 
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Fiyat Aralığı</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
                      <Checkbox />
                      <span className="text-sm">0 - 100 TL</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
                      <Checkbox />
                      <span className="text-sm">100 - 500 TL</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
                      <Checkbox />
                      <span className="text-sm">500 - 1000 TL</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
                      <Checkbox />
                      <span className="text-sm">1000 TL üzeri</span>
                    </label>
                  </div>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Filtreleri Uygula
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {currentCategory ? currentCategory.name : 'Tüm Ürünler'}
                <span className="text-gray-500 text-lg ml-2">({filteredProducts.length} ürün)</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sırala:</span>
                <select 
                  className="border rounded-lg px-4 py-2 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Öne Çıkanlar</option>
                  <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="rating">En Yüksek Puan</option>
                  <option value="newest">En Yeniler</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <Link to={`/urun/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                          -%{product.discount}
                        </div>
                      )}
                      <button
                        onClick={() => handleToggleFavorite(product)}
                        className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">{product.brand}</span>
                    </div>
                    <Link to={`/urun/${product.id}`}>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-orange-500">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-orange-500">
                        {product.price.toFixed(2)} TL
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {product.oldPrice.toFixed(2)} TL
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Sepete Ekle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
