import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';

const B2BPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    taxNumber: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Başvurunuz alındı!', {
      description: 'En kısa sürede sizinle iletişime geçeceğiz.'
    });
    setFormData({
      companyName: '',
      taxNumber: '',
      contactName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-12 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4" data-testid="page-title">
              <Briefcase className="inline w-12 h-12 mr-3" />
              Ustam Özel
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Profesyonel oto servisler ve kurumsal müşteriler için özel avantajlar
            </p>
            <ul className="space-y-3 text-lg">
              <li>✅ Özel indirimli fiyatlandırma</li>
              <li>✅ Toplu alımlarda ekstra avantajlar</li>
              <li>✅ Öncelikli teslimat</li>
              <li>✅ Özel müşteri temsilcisi</li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card data-testid="feature-pricing">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-orange-500 mb-2" />
              <CardTitle>Avantajlı Fiyatlar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Toplu alımlarda %30'a varan indirimler
              </CardDescription>
            </CardContent>
          </Card>

          <Card data-testid="feature-delivery">
            <CardHeader>
              <Award className="w-10 h-10 text-orange-500 mb-2" />
              <CardTitle>Hızlı Teslimat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Öncelikli kargo ve aynı gün teslimat seçeneği
              </CardDescription>
            </CardContent>
          </Card>

          <Card data-testid="feature-support">
            <CardHeader>
              <Users className="w-10 h-10 text-orange-500 mb-2" />
              <CardTitle>Özel Destek</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Size özel müşteri temsilciniz
              </CardDescription>
            </CardContent>
          </Card>

          <Card data-testid="feature-credit">
            <CardHeader>
              <Briefcase className="w-10 h-10 text-orange-500 mb-2" />
              <CardTitle>Cari Hesap</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Esnek ödeme seçenekleri ve vade imkanları
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-6" data-testid="form-title">Kurumsal Üyelik Başvurusu</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Şirket Adı *</label>
                <Input
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Şirket adınız"
                  data-testid="company-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Vergi Numarası *</label>
                <Input
                  required
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  placeholder="Vergi numarası"
                  data-testid="tax-number-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Yetkili Kişi Adı *</label>
                <Input
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Adınız Soyadınız"
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">E-posta *</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ornek@sirket.com"
                  data-testid="email-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefon *</label>
                <Input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05XX XXX XX XX"
                  data-testid="phone-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mesajınız</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="İhtiyaçlarınız hakkında bize bilgi verin"
                  rows={4}
                  data-testid="message-input"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold"
                data-testid="submit-button"
              >
                Başvuru Gönder
              </Button>
            </form>
          </div>

          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Sıkça Sorulan Sorular</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-2">Üyelik ücretsiz mi?</h4>
                <p className="text-gray-600 text-sm">
                  Evet, kurumsal üyelik tamamen ücretsizdir. Sadece siparişleriniz için ödeme yaparsınız.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Ne kadar sürede onaylandı?</h4>
                <p className="text-gray-600 text-sm">
                  Başvurunuz 1-2 iş günü içinde değerlendirilir ve sonucu e-posta ile bildirilir.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Minimum sipariş tutarlar var mı?</h4>
                <p className="text-gray-600 text-sm">
                  Hayır, dilediğiniz tutarda sipariş verebilirsiniz. Ancak büyük siparişlerde daha fazla indirim kazanırsınız.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default B2BPage;
