import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, Shield, Truck, RotateCcw } from 'lucide-react';
import { products } from '../mockData';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from '../hooks/use-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Ürün bulunamadı</h2>
        <Link to="/" className="text-orange-500 hover:underline mt-4 inline-block">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  const relatedProducts = products.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Ürün Sepete Eklendi",
      description: `${quantity} adet ${product.name} sepetinize eklendi.`,
    });
  };

  const handleToggleFavorite = () => {
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
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-gray-500 hover:text-orange-500">Ana Sayfa</Link>
          <span className="text-gray-400">/</span>
          <Link to={`/kategori/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-orange-500">
            {product.category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div>
            <div className="relative bg-white rounded-lg p-8 shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-contain"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold">
                  -%{product.discount}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-orange-500 font-semibold">{product.brand}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} değerlendirme)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-orange-500">
                {product.price.toFixed(2)} TL
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {product.oldPrice.toFixed(2)} TL
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {product.stock > 10 ? 'Stokta Var' : `Son ${product.stock} adet`}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Özellikler:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold">Adet:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-500 hover:bg-orange-600 h-14 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Sepete Ekle
              </Button>
              <Button
                onClick={handleToggleFavorite}
                variant="outline"
                className="h-14 px-6"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <Truck className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="font-semibold text-sm">Hızlı Teslimat</div>
                  <div className="text-xs text-gray-600">2-3 iş günü</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <RotateCcw className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="font-semibold text-sm">Kolay İade</div>
                  <div className="text-xs text-gray-600">14 gün içinde</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <Shield className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="font-semibold text-sm">Orijinal Ürün</div>
                  <div className="text-xs text-gray-600">Garantili</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <Tabs defaultValue="description">
              <TabsList className="mb-6">
                <TabsTrigger value="description">Ürün Açıklaması</TabsTrigger>
                <TabsTrigger value="specs">Teknik Özellikler</TabsTrigger>
                <TabsTrigger value="reviews">Yorumlar ({product.reviews})</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <h3>Özellikler</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="specs">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 font-semibold">Marka</td>
                      <td className="py-3">{product.brand}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-semibold">Kategori</td>
                      <td className="py-3">{product.category}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-semibold">Alt Kategori</td>
                      <td className="py-3">{product.subcategory}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-semibold">Stok Durumu</td>
                      <td className="py-3">{product.stock} adet</td>
                    </tr>
                  </tbody>
                </table>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="text-center py-8 text-gray-500">
                  Henüz yorum yapılmamış. İlk yorumu siz yapın!
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} to={`/urun/${relProduct.id}`}>
                  <Card className="group hover:shadow-xl transition-all">
                    <CardContent className="p-4">
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
                      />
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-orange-500">
                        {relProduct.name}
                      </h3>
                      <div className="text-xl font-bold text-orange-500">
                        {relProduct.price.toFixed(2)} TL
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
