import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Building2, User, Lock, Mail, Phone, FileText, Shield } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const UstamOzelPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('kurumsal'); // 'kurumsal' or 'bireysel'
  const [loginTab, setLoginTab] = useState('login');

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login
    setIsLoggedIn(true);
    toast({
      title: "Giriş Başarılı",
      description: `${userType === 'kurumsal' ? 'Kurumsal' : 'Bireysel'} hesabınıza giriş yaptınız.`,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    toast({
      title: "Kayıt Başarılı",
      description: "Hesabınız oluşturuldu. Onay için lütfen bekleyin.",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                <Building2 className="w-10 h-10 text-orange-600" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Ustam Özel</h1>
              <p className="text-gray-600 text-lg">
                Profesyonel servisler ve kurumsal müşteriler için özel platform
              </p>
            </div>

            <Tabs value={loginTab} onValueChange={setLoginTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="flex gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setUserType('kurumsal')}
                      className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                        userType === 'kurumsal'
                          ? 'bg-orange-50 border-orange-500'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="font-bold">Kurumsal</div>
                      <div className="text-xs text-gray-600">Servisler & Firmalar</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('bireysel')}
                      className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                        userType === 'bireysel'
                          ? 'bg-blue-50 border-blue-500'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-bold">Bireysel</div>
                      <div className="text-xs text-gray-600">Kişisel Hesap</div>
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-posta veya Telefon
                    </label>
                    <Input type="text" placeholder="ornek@mail.com" className="h-12" required />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Şifre
                    </label>
                    <Input type="password" placeholder="••••••••" className="h-12" required />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Beni Hatırla</span>
                    </label>
                    <a href="#" className="text-orange-600 font-semibold hover:underline">
                      Şifremi Unuttum
                    </a>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-lg font-bold"
                  >
                    Giriş Yap
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setUserType('kurumsal')}
                      className={`flex-1 p-3 border-2 rounded-xl transition-all ${
                        userType === 'kurumsal'
                          ? 'bg-orange-50 border-orange-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <Building2 className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                      <div className="font-bold text-sm">Kurumsal</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('bireysel')}
                      className={`flex-1 p-3 border-2 rounded-xl transition-all ${
                        userType === 'bireysel'
                          ? 'bg-blue-50 border-blue-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <div className="font-bold text-sm">Bireysel</div>
                    </button>
                  </div>

                  {userType === 'kurumsal' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Firma Adı
                        </label>
                        <Input type="text" placeholder="ABC Oto Servis Ltd." className="h-12" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Vergi No / TCKN
                        </label>
                        <Input type="text" placeholder="1234567890" className="h-12" required />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ad Soyad
                      </label>
                      <Input type="text" placeholder="Ahmet Yılmaz" className="h-12" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefon
                      </label>
                      <Input type="tel" placeholder="0555 123 4567" className="h-12" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-posta
                    </label>
                    <Input type="email" placeholder="ornek@mail.com" className="h-12" required />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Şifre
                    </label>
                    <Input type="password" placeholder="En az 8 karakter" className="h-12" required />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-lg font-bold"
                  >
                    Kayıt Ol
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-600">
              <div>
                <Shield className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                <div>Güvenli Platform</div>
              </div>
              <div>
                <FileText className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                <div>Özel Fiyatlar</div>
              </div>
              <div>
                <Lock className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                <div>Gizlilik Garantisi</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logged in view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Hoş Geldiniz!</h1>
          <p className="text-lg opacity-90">
            {userType === 'kurumsal' ? 'Kurumsal' : 'Bireysel'} Hesabınız
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold text-2xl mb-2">0</h3>
              <p className="text-gray-600">Aktif Sipariş</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-2xl mb-2">0,00 TL</h3>
              <p className="text-gray-600">Toplam Harcama</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-bold text-2xl mb-2">Bronz</h3>
              <p className="text-gray-600">Üyelik Seviyesi</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Özel Fiyatlar İçin Onay Bekleniyor</h2>
            <p className="text-gray-600 mb-6">
              Hesabınız inceleniyor. Onaylandıktan sonra özel fiyatlara erişebileceksiniz.
            </p>
            <Button onClick={() => setIsLoggedIn(false)} variant="outline">
              Çıkış Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UstamOzelPage;
