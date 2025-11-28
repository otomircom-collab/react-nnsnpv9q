import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from '../hooks/use-toast';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const shippingCost = cartTotal > 500 ? 0 : 49.90;
  const totalWithShipping = cartTotal + shippingCost;

  const handleRemoveFromCart = (productId, productName) => {
    removeFromCart(productId);
    toast({
      title: "Ürün Sepetten Çıkarıldı",
      description: `${productName} sepetinizden çıkarıldı.`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Sepet Temizlendi",
      description: "Tüm ürünler sepetinizden çıkarıldı.",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-16 text-center">
              <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold mb-4">Sepetiniz Boş</h2>
              <p className="text-gray-600 mb-8">Hemen alışverişe başlayın ve ihtiyacınız olan ürünleri sepetinize ekleyin.</p>
              <Link to="/">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Alışverişe Başla
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
        <h1 className="text-3xl font-bold mb-8">Sepetim ({cart.length} ürün)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Link to={`/urun/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link to={`/urun/${item.id}`}>
                            <h3 className="font-semibold text-lg hover:text-orange-500 mb-1">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                          <div className="text-2xl font-bold text-orange-500">
                            {item.price.toFixed(2)} TL
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.id, item.name)}
                          className="text-red-500 hover:text-red-700 h-fit"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-6 py-2 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-lg font-semibold">
                          Toplam: {(item.price * item.quantity).toFixed(2)} TL
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={handleClearCart}
              variant="outline"
              className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Sepeti Temizle
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Sipariş Özeti</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-semibold">{cartTotal.toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kargo</span>
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-green-500' : ''}`}>
                      {shippingCost === 0 ? 'ÜCRETSİZ' : `${shippingCost.toFixed(2)} TL`}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
                      {(500 - cartTotal).toFixed(2)} TL daha alışveriş yaparak ücretsiz kargo kazanın!
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Toplam</span>
                      <span className="text-orange-500">{totalWithShipping.toFixed(2)} TL</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg mb-3">
                  Alışverişi Tamamla
                </Button>

                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Alışverişe Devam Et
                  </Button>
                </Link>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>✓</span>
                    <span>Güvenli Ödeme</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>✓</span>
                    <span>Hızlı Teslimat</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>✓</span>
                    <span>14 Gün İade Garantisi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
