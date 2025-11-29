import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bot, Send, Sparkles } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MaintenanceBotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Welcome message
    setMessages([{
      type: 'bot',
      text: 'Merhaba! Ben OTOMARKETGO Bakım Robotu. Aracınızın bakım ihtiyaçları hakkında size yardımcı olabilirim. Şase numaranızı veya ihtiyacınızı belirtebilirsiniz.'
    }]);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const response = await axios.post(`${API}/maintenance-bot/chat`, {
        user_id: userId,
        message: userMessage
      });

      setMessages(prev => [...prev, { type: 'bot', text: response.data.response }]);
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Motor yağı öneri', query: 'Motor yağı öner' },
    { label: 'Fren kontrolü', query: 'Fren sistemi kontrolü' },
    { label: 'Lastik tavsiyesi', query: 'Lastik tavsiyesi ver' },
    { label: 'Periyodik bakım', query: 'Periyodik bakım neler gerekli' }
  ];

  const handleQuickAction = (query) => {
    setInputMessage(query);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Bot className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold" data-testid="page-title">Bakım Robotu</h1>
              <p className="text-cyan-100 text-lg">AI destekli otomatik bakım önerileri</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-cyan-100">
            <Sparkles className="w-4 h-4" />
            <span>Şase numaranızı yazarak aracınıza özel öneriler alabilirsiniz</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Hızlı Sorular:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.query)}
                className="border-orange-300 hover:bg-orange-50 hover:border-orange-500"
                data-testid={`quick-action-${index}`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <Card className="mb-6">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4" data-testid="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${message.type}-${index}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.type === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-5 h-5 text-cyan-600" />
                      <span className="font-semibold text-sm text-cyan-600">Bakım Robotu</span>
                    </div>
                  )}
                  <p className="text-base leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start" data-testid="loading-indicator">
                <div className="bg-gray-100 rounded-2xl px-6 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Aracınızın ihtiyacını veya şase numaranızı yazın..."
            className="flex-1 py-6 text-base"
            disabled={loading}
            data-testid="message-input"
          />
          <Button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6"
            data-testid="send-button"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">🤖 Bakım Robotu Nasıl Çalışır?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Şase numaranızı girin ve aracınıza özel öneriler alın</li>
            <li>• Bakım ihtiyaçlarınızı sorun, otomatik ürün önerileri alaleın</li>
            <li>• Önerilen ürünleri doğrudan sepete ekleyin</li>
            <li>• Periyodik bakım planları oluşturun</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default MaintenanceBotPage;
