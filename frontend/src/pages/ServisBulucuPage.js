import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Phone, Star, Navigation, Clock, Wrench } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ServisBulucuPage = () => {
  const [location, setLocation] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
    toast({
      title: "Servisler Bulundu",
      description: "Size en yakın anlaşmalı servisler listeleniyor...",
    });
  };

  const servisler = [
    {
      id: 1,
      name: 'ABC Oto Servis',
      address: 'Kadıköy, İstanbul',
      distance: '2.3 km',
      rating: 4.8,
      reviews: 342,
      phone: '0216 123 4567',
      services: ['Bakım', 'Onarım', 'Lastik', 'Fren'],
      isOpen: true
    },
    {
      id: 2,
      name: 'Oto Eksper Servis',
      address: 'Beşiktaş, İstanbul',
      distance: '4.1 km',
      rating: 4.9,
      reviews: 567,
      phone: '0212 987 6543',
      services: ['Motor', 'Elektrik', 'Klima', 'Bakım'],
      isOpen: true
    },
    {
      id: 3,
      name: 'Güven Oto Bakım',
      address: 'Üsküdar, İstanbul',
      distance: '5.8 km',
      rating: 4.7,
      reviews: 234,
      phone: '0216 555 8899',
      services: ['Bakım', 'Yağ Değişimi', 'Fren'],
      isOpen: false
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Wrench className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-black mb-4">Servis Bulucu 🗺️</h1>
            <p className="text-xl opacity-90">En yakın anlaşmalı servisleri bulun</p>
          </div>

          <Card className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-gray-900 font-bold text-2xl mb-6">Konumunuza Göre Servis Bulun</h3>
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="İlçe veya Mahalle"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 h-14 text-lg"
                />
                <Button 
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Ara
                </Button>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full h-12">
                  <MapPin className="w-5 h-5 mr-2" />
                  Konumumu Kullan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {showResults ? (
          <>
            <h2 className="text-3xl font-bold mb-2">Size En Yakın Servisler</h2>
            <p className="text-gray-600 mb-8">{servisler.length} servis bulundu</p>

            <div className="space-y-4">
              {servisler.map((servis) => (
                <Card key={servis.id} className="hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{servis.name}</h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{servis.address}</span>
                              <span className="text-blue-600 font-semibold">• {servis.distance}</span>
                            </div>
                          </div>
                          {servis.isOpen ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              <Clock className="w-4 h-4" />
                              Açık
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                              Kapalı
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{servis.rating}</span>
                          </div>
                          <span className="text-gray-500">({servis.reviews} değerlendirme)</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {servis.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${servis.phone}`} className="font-semibold hover:text-blue-600">
                            {servis.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Navigation className="w-4 h-4 mr-2" />
                          Yol Tarifi
                        </Button>
                        <Button variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Ara
                        </Button>
                        <Button variant="outline">
                          Randevu Al
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">1000+ Servis</h3>
                <p className="text-gray-600">Türkiye genelinde</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Onaylı Servisler</h3>
                <p className="text-gray-600">Anlaşmalı ve güvenilir</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <Navigation className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Kolay Erişim</h3>
                <p className="text-gray-600">Yol tarifi ve randevu</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Servisinizi Ekleyin</h3>
            <p className="text-gray-600 mb-6">
              Oto servisiniz mi var? Platformumuza katılın ve binlerce müşteriye ulaşın.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Başvuru Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServisBulucuPage;