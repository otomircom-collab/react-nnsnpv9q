import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Shield, Car, Check, Star, ArrowRight } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const SigortanPage = () => {
  const [plaka, setPlaka] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (plaka.length < 5) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir plaka giriniz.",
        variant: "destructive"
      });
      return;
    }
    setShowResults(true);
    toast({
      title: "Teklifler Hazırlanıyor",
      description: "30 sigorta şirketinden teklifler getiriliyor...",
    });
  };

  const sigortaFirmalari = [
    { name: 'Anadolu Sigorta', price: 2450, rating: 4.8, logo: '🏛️' },
    { name: 'Allianz', price: 2580, rating: 4.9, logo: '🔵' },
    { name: 'Ak Sigorta', price: 2320, rating: 4.7, logo: '🟢' },
    { name: 'HDI Sigorta', price: 2670, rating: 4.6, logo: '🔴' },
    { name: 'Sompo Sigorta', price: 2410, rating: 4.8, logo: '🟡' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-6xl font-black mb-4">Sigortan</h1>
          <p className="text-2xl mb-8 opacity-90">30 Şirketi 2 Dakikada Karşılaştır</p>
          
          <Card className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-gray-900 font-bold text-2xl mb-6">Kasko & Trafik Sigortası</h3>
              <form onSubmit={handleSearch}>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Plaka Numarası (Örn: 34ABC123)"
                      value={plaka}
                      onChange={(e) => setPlaka(e.target.value.toUpperCase())}
                      className="h-16 text-lg text-center font-bold"
                      maxLength={10}
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 h-16 px-12 text-lg font-bold"
                  >
                    Teklifleri Gör
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              </form>
              <div className="flex gap-8 justify-center mt-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Ücretsiz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Hızlı</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Güvenli</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {showResults ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Trafik Sigortası Teklifleri</h2>
              <p className="text-gray-600">Plaka: <strong>{plaka}</strong> | 5 teklif bulundu</p>
            </div>

            <div className="space-y-4 mb-12">
              {sigortaFirmalari.map((firma, idx) => (
                <Card key={idx} className="hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{firma.logo}</div>
                        <div>
                          <h3 className="text-xl font-bold">{firma.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{firma.rating}</span>
                            <span className="text-sm text-gray-500">(2.4k değerlendirme)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-green-600">
                          {firma.price.toFixed(2)} TL
                        </div>
                        <div className="text-sm text-gray-600">/ yıllık</div>
                        <Button className="mt-2 bg-green-600 hover:bg-green-700">
                          Satın Al
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
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">2 Dakikada Teklif</h3>
                <p className="text-gray-600">Hızlı ve kolay karşılaştırma</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2">30 Şirket</h3>
                <p className="text-gray-600">En iyi fiyatı bulun</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">💯</div>
                <h3 className="text-xl font-bold mb-2">10M+ Müşteri</h3>
                <p className="text-gray-600">Güvenilir platform</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Neden Sigortan?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold mb-2">Güvenli</h4>
              <p className="text-sm text-gray-600">SSL şifrelemeli güvenlik</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold mb-2">Hızlı</h4>
              <p className="text-sm text-gray-600">Anında online poliçe</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold mb-2">Kolay</h4>
              <p className="text-sm text-gray-600">3 adımda poliçe</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold mb-2">Ekonomik</h4>
              <p className="text-sm text-gray-600">En uygun fiyat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigortanPage;
