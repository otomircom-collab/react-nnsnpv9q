import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const response = await axios.get(`${API}/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Sepet yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await axios.delete(`${API}/cart/${userId}/${productId}`);
      toast.success('Ürün sepetten kaldırıldı');
      fetchCart();
    } catch (error) {
      console.error('Ürün kaldırılamadı:', error);
      toast.error('Ürün kaldırılamadı');
    }
  };

  const handleClearCart = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      await axios.delete(`${API}/cart/${userId}`);
      toast.success('Sepet temizlendi');
      setCartItems([]);
    } catch (error) {
      console.error('Sepet temizlenemedi:', error);
      toast.error('Sepet temizlenemedi');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-12 text-center" data-testid="empty-cart">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-6">Ürün ekleyerek alışverişe başlayın</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
              data-testid="continue-shopping-button"
            >
              Alışverişe Başla
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" data-testid="page-title">Sepetim ({cartItems.length})</h1>
          <Button
            onClick={handleClearCart}
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            data-testid="clear-cart-button"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Sepeti Temizle
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-6" data-testid={`cart-item-${item.product_id}`}>
                <div className="flex gap-6">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-24 h-24 object-contain bg-gray-100 rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Ürün';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1" data-testid="item-name">{item.product_name}</h3>
                    <p className="text-sm text-gray-600 mb-3">Kategori: {item.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          disabled
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold" data-testid="item-quantity">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          disabled
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600" data-testid="item-total">
                          {(item.price * item.quantity).toLocaleString('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} ₺
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ x {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="text-red-600 hover:bg-red-50"
                    data-testid={`remove-item-${item.product_id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6" data-testid="summary-title">Sipariş Özeti</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam:</span>
                  <span data-testid="subtotal">
                    {calculateTotal().toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo:</span>
                  <span className="text-green-600 font-semibold">BEDAVA</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Toplam:</span>
                    <span className="text-orange-600" data-testid="total">
                      {calculateTotal().toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold"
                  data-testid="checkout-button"
                  onClick={() => toast.success('Sipariş tamamlandı! (Demo)')}
                >
                  Siparişi Tamamla
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                  data-testid="continue-shopping-footer-button"
                >
                  Alışverişe Devam Et
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
