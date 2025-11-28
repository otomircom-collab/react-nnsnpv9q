import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Send, Bot, User, Sparkles, Car, Wrench } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const BakimRobotuPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Merhaba! Ben Bakım Robotunuz. Aracınızın şase numarasını veya model bilgilerini vererek bakım önerisi alabilirsiniz. Size nasıl yardımcı olabilirim?'
    }
  ]);
  const [input, setInput] = useState('');
  const [saseNo, setSaseNo] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    
    setTimeout(() => {
      const response = generateBotResponse(input);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    }, 1000);

    setInput('');
  };

  const generateBotResponse = (userInput) => {
    const lower = userInput.toLowerCase();
    
    if (lower.includes('filtre') || lower.includes('bakım')) {
      return '🔧 **Bakım Önerisi:** Aracınız için:\n\n• Hava Filtresi değişimi (245 TL)\n• Yağ Filtresi değişimi (165 TL)\n• Polen Filtresi değişimi (125 TL)\n\nToplamı sepete eklemek ister misiniz?';
    }
    
    if (lower.includes('fren')) {
      return '🛑 **Fren Sistemi:** Fren balatası ve disk kontrolü öneriyorum:\n\n• ATE Fren Balatası Ön (580 TL)\n• Fren Diski Takımı (750 TL)\n\nMontaj için anlaşmalı servislerimizi kullanabilirsiniz.';
    }
    
    return 'Anladım! Size uygun parçaları buluyorum. Şase numaranızı paylaşırsanız daha kesin önerilerde bulunabilirim.';
  };

  const quickActions = [
    { icon: '🔍', text: 'Filtre Bakımı', query: 'Filtre bakımı gerekiyor' },
    { icon: '🛑', text: 'Fren Kontrolü', query: 'Fren kontrolü yaptırmak istiyorum' },
    { icon: '⚙️', text: 'Motor Bakımı', query: 'Motor bakımı ne zaman gerekli?' },
    { icon: '🔧', text: 'Genel Bakım', query: 'Genel bakım önerisi istiyorum' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center text-white mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Bot className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-black mb-2">Bakım Robotu</h1>
            <p className="text-xl opacity-90">Yapay Zeka Destekli Araç Bakım Asistanı</p>
          </div>

          {/* Şase Input */}
          <Card className="mb-6 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Car className="w-8 h-8 text-purple-600" />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Şase Numarası (Opsiyonel - Daha Kesin Öneriler)
                  </label>
                  <Input
                    type="text"
                    placeholder="WBADT43452G123456"
                    value={saseNo}
                    onChange={(e) => setSaseNo(e.target.value.toUpperCase())}
                    className="h-12"
                    maxLength={17}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Box */}
          <Card className="mb-6 bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6">
              <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'bot'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {msg.role === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                    </div>
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl ${
                        msg.role === 'bot'
                          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(action.query);
                      handleSend();
                    }}
                    className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all text-sm font-medium"
                  >
                    <div className="text-2xl mb-1">{action.icon}</div>
                    {action.text}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Mesajınızı yazın..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 h-12"
                />
                <Button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-semibold">Yapay Zeka</div>
                <div className="text-xs text-gray-600">Akıllı öneriler</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Wrench className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-semibold">Otomatik Bulma</div>
                <div className="text-xs text-gray-600">Doğru parçalar</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Car className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-semibold">Şase Uyumlu</div>
                <div className="text-xs text-gray-600">Kesin sonuçlar</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BakimRobotuPage;
