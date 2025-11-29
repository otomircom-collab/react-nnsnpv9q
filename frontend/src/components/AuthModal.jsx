import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AuthModal = ({ open, onOpenChange }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '', 
    accountType: 'bireysel',
    companyName: '',
    taxNumber: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      localStorage.setItem('user', JSON.stringify({ email: loginData.email, name: 'Kullanıcı' }));
      toast.success('Giriş başarılı!');
      onOpenChange(false);
    } else {
      toast.error('Lütfen tüm alanları doldurun');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerData.name && registerData.email && registerData.password) {
      localStorage.setItem('user', JSON.stringify({ email: registerData.email, name: registerData.name }));
      toast.success('Kayıt başarılı!');
      onOpenChange(false);
    } else {
      toast.error('Lütfen tüm alanları doldurun');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Üye Girişi / Kayıt</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Giriş Yap</TabsTrigger>
            <TabsTrigger value="register">Üye Ol</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">E-posta</label>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Şifre</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-semibold"
              >
                Giriş Yap
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              {/* Hesap Tipi */}
              <div>
                <label className="block text-sm font-medium mb-2">Hesap Tipi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterData({ ...registerData, accountType: 'bireysel' })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      registerData.accountType === 'bireysel'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    👤 Bireysel
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterData({ ...registerData, accountType: 'kurumsal' })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      registerData.accountType === 'kurumsal'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    🏢 Kurumsal
                  </button>
                </div>
              </div>

              {registerData.accountType === 'kurumsal' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Şirket Adı *</label>
                    <Input
                      placeholder="Şirket adınız"
                      value={registerData.companyName}
                      onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Vergi Numarası *</label>
                    <Input
                      placeholder="Vergi numaranız"
                      value={registerData.taxNumber}
                      onChange={(e) => setRegisterData({ ...registerData, taxNumber: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{registerData.accountType === 'kurumsal' ? 'Yetkili Kişi' : 'Ad Soyad'}</label>
                <Input
                  placeholder="Adınız Soyadınız"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-posta</label>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Telefon</label>
                <Input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Şifre</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-semibold"
              >
                {registerData.accountType === 'kurumsal' ? 'Kurumsal Üyelik Oluştur' : 'Üye Ol'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
