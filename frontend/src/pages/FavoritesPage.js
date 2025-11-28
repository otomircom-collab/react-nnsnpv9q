import React from 'react';
import { Link } from 'react-router-dom';
import { Heart as HeartIcon, Star, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from '../hooks/use-toast';

const FavoritesPage = () => {
  const { favorites, toggleFavorite, addToCart } = useCart();

  const handleRemoveFavorite = (product) => {
    toggleFavorite(product);
    toast({
      title: "Favorilerden Çıkarıldı",
      description: `${product.name} favorilerden çıkarıldı.`,
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Ürün Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-16 text-center">
              <HeartIcon className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold mb-4">Favori Listeniz Boş</h2>
              <p className="text-gray-600 mb-8">Beğendiğiniz ürünleri favorilerinize ekleyerek daha sonra kolayca ulaşabilirsiniz.</p>
              <Link to="/">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Ürünleri Keşfet
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Favorilerim ({favorites.length} ürün)</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
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
                    onClick={() => handleRemoveFavorite(product)}
                    className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
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
  );
};

export default FavoritesPage;
