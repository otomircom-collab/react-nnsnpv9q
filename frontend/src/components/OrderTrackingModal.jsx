import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, Search } from 'lucide-react';
import { toast } from 'sonner';

const OrderTrackingModal = ({ open, onOpenChange }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);

  const handleTrack = () => {
    if (orderNumber.trim()) {
      // Mock order info
      setOrderInfo({
        orderNumber: orderNumber,
        status: 'Kargoya Verildi',
        date: new Date().toLocaleDateString('tr-TR'),
        items: 2,
        total: 1250.50
      });
      toast.success('Sipariş bulundu!');
    } else {
      toast.error('Lütfen sipariş numaranızı girin');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="w-6 h-6 text-orange-500" />
            Sipariş Takibi
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Sipariş Numarası</label>
            <div className="flex gap-3">
              <Input
                placeholder="Örn: OMG123456789"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1 h-11 uppercase"
              />
              <Button
                onClick={handleTrack}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-11"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {orderInfo && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sipariş No:</span>
                <span className="font-semibold">{orderInfo.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Durum:</span>
                <span className="font-semibold text-orange-600">{orderInfo.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tarih:</span>
                <span className="font-semibold">{orderInfo.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ürün Sayısı:</span>
                <span className="font-semibold">{orderInfo.items}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-sm text-gray-600">Toplam:</span>
                <span className="font-bold text-lg">{orderInfo.total.toFixed(2)} TL</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingModal;
