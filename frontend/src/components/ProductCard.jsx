import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductCard = ({ product, category = 'product' }) => {
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      if (userId === 'guest') {
        localStorage.setItem('userId', 'guest-' + Date.now());
      }

      await axios.post(`${API}/cart`, {
        user_id: userId,
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        quantity: 1,
        price: product.price,
        category: category
      });

      toast.success('Ürün sepete eklendi!', {
        description: product.name
      });
      
      // Trigger cart count update
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Sepete eklenirken hata:', error);
      toast.error('Ürün sepete eklenemedi');
    }
  };

  return (
    <div className="product-card bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all" data-testid={`product-${product.id}`}>
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain p-4"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Ürün+Görseli';
          }}
        />
        {product.stock < 5 && product.stock > 0 && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white" data-testid="low-stock-badge">
            Son {product.stock} Adet
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white" data-testid="out-of-stock-badge">
            Stokta Yok
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 font-medium mb-1" data-testid="product-brand">{product.brand}</p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]" data-testid="product-name">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2" data-testid="product-rating">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xl font-bold text-gray-900" data-testid="product-price">
              {product.price.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} ₺
            </p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            data-testid="add-to-cart-button"
          >
            <ShoppingCart className="w-4 h-4" />
            Sepete Ekle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
