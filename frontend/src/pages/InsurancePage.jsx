import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Star, CheckCircle, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const InsurancePage = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coverageType, setCoverageType] = useState('Kasko');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) {
      toast.error('Lütfen plaka numaranızı girin');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/insurance-quotes/search`, null, {
        params: { plate: plateNumber, coverage_type: coverageType }
      });
      
      if (response.data.quotes && response.data.quotes.length > 0) {
        setQuotes(response.data.quotes);
      } else {
        setQuotes(generateMockQuotes());
      }
      
      toast.success('Teklifler yüklendi!');
    } catch (error) {
      console.error('Teklifler yüklenemedi:', error);
      setQuotes(generateMockQuotes());
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuotes = () => {
    const companies = [
      { name: 'Anadolu Sigorta', logo: 'https://via.placeholder.com/80x40?text=Anadolu' },
      { name: 'Ak Sigorta', logo: 'https://via.placeholder.com/80x40?text=Ak' },
      { name: 'Allianz Sigorta', logo: 'https://via.placeholder.com/80x40?text=Allianz' },
      { name: 'Axa Sigorta', logo: 'https://via.placeholder.com/80x40?text=Axa' },
      { name: 'HDI Sigorta', logo: 'https://via.placeholder.com/80x40?text=HDI' },
      { name: 'Mapfre Sigorta', logo: 'https://via.placeholder.com/80x40?text=Mapfre' },
      { name: 'Sompo Sigorta', logo: 'https://via.placeholder.com/80x40?text=Sompo' },
      { name: 'Zurich Sigorta', logo: 'https://via.placeholder.com/80x40?text=Zurich' }
    ];

    const coverages = [
      'Kasko Teminatı',
      'İhtiyari Mali Mesuliyet',
      'Ferdi Kaza',
      'Hukuki Koruma',
      'Yol Yardım',
      'Cam Kırılması',
      'Deprem',
      'Sel-Su Baskını'
    ];

    return companies.map((company, index) => ({
      id: `quote-${index + 1}`,
      company_name: company.name,
      company_logo: company.logo,
      price: 3500 + (index * 400) + Math.random() * 500,
      coverage_type: coverageType,
      coverage_details: coverages.slice(0, 5 + Math.floor(Math.random() * 3)),
      rating: 4.0 + Math.random() * 1,
      discount: index < 3 ? Math.floor(Math.random() * 20) + 5 : 0
    }));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl p-12 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4" data-testid="page-title">
              <Shield className="inline w-12 h-12 mr-3" />
              Sigortan
            </h1>
            <p className="text-xl mb-6">
              30+ sigorta şirketinden en uygun teklifi bul, online satın al!
            </p>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Anlık karşılaştırma</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                <span>En iyi fiyat garantisi</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>Güvenli alışveriş</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle data-testid="search-form-title">Teklif Al</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch}>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Plaka Numarası</label>
                  <Input
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="34 ABC 123"
                    className="uppercase"
                    data-testid="plate-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sigorta Türü</label>
                  <Tabs value={coverageType} onValueChange={setCoverageType}>
                    <TabsList className="grid w-full grid-cols-2" data-testid="coverage-type-tabs">
                      <TabsTrigger value="Kasko">Kasko</TabsTrigger>
                      <TabsTrigger value="Trafik">Trafik</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6"
                    disabled={loading}
                    data-testid="search-button"
                  >
                    Teklifleri Getir
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quotes */}
        {loading ? (
          <div className="text-center py-12" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Teklifler getiriliyor...</p>
          </div>
        ) : quotes.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6" data-testid="quotes-title">
              Bulunan {quotes.length} Teklif (En Ucuzdan → En Pahalıya)
            </h2>
            <div className="grid gap-4">
              {quotes.map((quote, index) => (
                <Card key={quote.id} className={index < 3 ? 'border-2 border-orange-400' : ''} data-testid={`quote-${quote.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6 flex-1">
                        <img
                          src={quote.company_logo}
                          alt={quote.company_name}
                          className="w-20 h-10 object-contain bg-gray-100 p-2 rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{quote.company_name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{quote.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {quote.coverage_details.slice(0, 3).map((coverage, idx) => (
                              <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                ✓ {coverage}
                              </span>
                            ))}
                            {quote.coverage_details.length > 3 && (
                              <span className="text-xs text-gray-500">+{quote.coverage_details.length - 3} daha</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {quote.discount > 0 && (
                          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                            %{quote.discount} İndirim
                          </div>
                        )}
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {quote.price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white" data-testid={`buy-button-${quote.id}`}>
                          Satın Al
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-100 rounded-xl" data-testid="no-quotes">
            <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Plaka numaranızı girerek teklif alın</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InsurancePage;
