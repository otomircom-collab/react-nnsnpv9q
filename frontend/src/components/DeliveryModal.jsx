import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

const DeliveryModal = ({ open, onOpenChange }) => {
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');

  const handleSave = () => {
    if (postalCode && address) {
      localStorage.setItem('deliveryAddress', JSON.stringify({ postalCode, address }));
      toast.success('Teslimat adresi kaydedildi!');
      onOpenChange(false);
    } else {
      toast.error('Lütfen tüm alanları doldurun');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="w-6 h-6 text-orange-500" />
            Teslimat Adresini Belirle
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Harita */}
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Google Maps Entegrasyonu</p>
              <p className="text-sm text-gray-500">Konum seçmek için haritaya tıklayın</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Posta Kodu</label>
              <Input
                placeholder="Örn: 34000"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Adres</label>
              <Input
                placeholder="Mahalle, sokak, bina no"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-11 font-semibold"
            >
              Kaydet
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 h-11"
            >
              İptal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryModal;
