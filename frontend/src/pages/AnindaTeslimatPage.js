import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Clock, Package, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';

const AnindaTeslimatPage = () => {
  const [location, setLocation] = useState('');
  const [isServiceAvailable, setIsServiceAvailable] = useState(false);
  const { addToCart } = useCart();

  const checkLocation = () => {
    setIsServiceAvailable(true);
    toast({
      title: "Teslimat Bölgesi Uygun",
      description: "Bu bölgeye anında teslimat yapıyoruz! ⚡",
    });
  };

  const anindaUrunler = [
    { id: 501, name: 'Lastik Onarım Kiti Acil', price: 89.90, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', rating: 4.7, deliveryTime: '30 dk', inStock: true },
    { id: 502, name: 'Motor Yağı 5W-30 4L', price: 285.00, image: 'https://images.unsplash.com/photo-1632823469883-75c0da32a3d8?w=400', rating: 4.9, deliveryTime: '45 dk', inStock: true },
    { id: 503, name: 'Akü Takviye Kablosu', price: 125.00, image: 'https://images.unsplash.com/photo-1449130015084-2dc0185e9fbc?w=400', rating: 4.6, deliveryTime: '30 dk', inStock: true },
    { id: 504, name: 'Far Ampulü H7 Acil', price: 45.00, image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', rating: 4.5, deliveryTime: '20 dk', inStock: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Package className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-black mb-4">Anında Teslimat ⚡</h1>
            <p className="text-xl opacity-90">Acil ihtiyaçlarınız için hızlı teslimat</p>
          </div>

          <Card className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-gray-900 font-bold text-2xl mb-6">Konumunuzu Kontrol Edin</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Mahalle veya Posta Kodu"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-14 text-lg"
                  />
                </div>
                <Button 
                  onClick={checkLocation}
                  className="bg-orange-600 hover:bg-orange-700 h-14 px-8 text-lg font-bold"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Kontrol Et
                </Button>
              </div>
              {isServiceAvailable && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <Clock className="w-5 h-5" />
                    <span>Bu bölgeye 20-60 dakikada teslimat yapıyoruz!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Anında Teslimat Ürünleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {anindaUrunler.map((product) => (
            <Card key={product.id} className="hover:shadow-xl transition-all">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {product.inStock ? (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {product.deliveryTime}
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Stokta Yok
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{product.rating}</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-3">
                  {product.price.toFixed(2)} TL
                </div>
                <Button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Hemen Al' : 'Stokta Yok'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-3 text-orange-600" />
              <h3 className="font-bold mb-2">20-60 Dakika</h3>
              <p className="text-sm text-gray-600">Hızlı teslimat garantisi</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-red-600" />
              <h3 className="font-bold mb-2">Belirli Bölgeler</h3>
              <p className="text-sm text-gray-600">İstanbul, Ankara, İzmir</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <h3 className="font-bold mb-2">Acil Ürünler</h3>
              <p className="text-sm text-gray-600">Yol yardım ürünleri</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnindaTeslimatPage;