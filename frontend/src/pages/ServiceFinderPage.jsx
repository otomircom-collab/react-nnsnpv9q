import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Star, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ServiceFinderPage = () => {
  const [servicePoints, setServicePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchServicePoints();
    getUserLocation();
  }, []);

  const fetchServicePoints = async (city = null) => {
    setLoading(true);
    try {
      const url = city ? `${API}/service-points?city=${encodeURIComponent(city)}` : `${API}/service-points`;
      const response = await axios.get(url);
      
      if (response.data.length === 0) {
        setServicePoints(generateMockServicePoints());
      } else {
        setServicePoints(response.data);
      }
    } catch (error) {
      console.error('Servis noktaları yüklenemedi:', error);
      setServicePoints(generateMockServicePoints());
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Konum alınamadı:', error);
        }
      );
    }
  };

  const generateMockServicePoints = () => {
    const services = [
      { name: 'Oto Eksper Kadıköy', city: 'İstanbul', district: 'Kadıköy', lat: 40.9905, lon: 29.0267 },
      { name: 'Pro Servis Beşiktaş', city: 'İstanbul', district: 'Beşiktaş', lat: 41.0422, lon: 29.0076 },
      { name: 'Master Oto Sarıyer', city: 'İstanbul', district: 'Sarıyer', lat: 41.1583, lon: 29.0533 },
      { name: 'Hızlı Bakım Ankara', city: 'Ankara', district: 'Çankaya', lat: 39.9334, lon: 32.8597 },
      { name: 'Güven Oto Servis İzmir', city: 'İzmir', district: 'Bornova', lat: 38.4237, lon: 27.1428 },
      { name: 'Yıldız Oto Bursa', city: 'Bursa', district: 'Nilüfer', lat: 40.1826, lon: 29.0661 },
      { name: 'Anadolu Oto Servis Adana', city: 'Adana', district: 'Seyhan', lat: 37.0000, lon: 35.3213 },
      { name: 'Marmara Oto Antalya', city: 'Antalya', district: 'Muratpaşa', lat: 36.8969, lon: 30.7133 }
    ];

    const allServices = [
      'Periyodik Bakım',
      'Motor Onarım',
      'Fren Sistemi',
      'Klima Bakım',
      'Elektrik Arıza',
      'Lastik Montaj',
      'Rot Balans',
      'Kaporta Boya',
      'Cam Filmi',
      'Araç Boyama'
    ];

    return services.map((service, index) => ({
      id: `service-${index + 1}`,
      name: service.name,
      address: `${service.district}, ${service.city}`,
      city: service.city,
      phone: '0850 ' + Math.floor(Math.random() * 900 + 100) + ' ' + Math.floor(Math.random() * 90 + 10) + ' ' + Math.floor(Math.random() * 90 + 10),
      latitude: service.lat,
      longitude: service.lon,
      rating: 4.0 + Math.random() * 1,
      services: allServices.slice(0, 5 + Math.floor(Math.random() * 5)),
      working_hours: '08:00 - 19:00'
    }));
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchServicePoints(searchCity);
    } else {
      fetchServicePoints();
    }
  };

  const handleGetDirections = (point) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;
    window.open(url, '_blank');
    toast.success('Yol tarifi açılıyor...');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-12 mb-8">
          <h1 className="text-5xl font-bold mb-4" data-testid="page-title">
            <MapPin className="inline w-12 h-12 mr-3" />
            Servis Bulucu
          </h1>
          <p className="text-xl mb-6">
            Size en yakın anlaşmalı servisleri keşfedin ve randevu alın
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <Input
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Şehir ara (İstanbul, Ankara, İzmir...)"
              className="flex-1"
              data-testid="city-search-input"
            />
            <Button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              data-testid="search-button"
            >
              Ara
            </Button>
          </div>
        </div>

        {/* Mock Map */}
        <div className="bg-gray-200 rounded-xl h-96 mb-8 flex items-center justify-center relative overflow-hidden" data-testid="map-placeholder">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>
          <div className="relative z-10 text-center">
            <MapPin className="w-20 h-20 text-purple-600 mx-auto mb-4" />
            <p className="text-2xl font-bold text-gray-700">Google Maps Entegrasyonu</p>
            <p className="text-gray-600 mt-2">{servicePoints.length} servis noktası haritada gösterilecek</p>
          </div>
        </div>

        {/* Service Points List */}
        <div>
          <h2 className="text-2xl font-bold mb-6" data-testid="service-list-title">
            Anlaşmalı Servisler ({servicePoints.length})
          </h2>
          {loading ? (
            <div className="text-center py-12" data-testid="loading-spinner">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {servicePoints.map((point) => {
                const distance = userLocation 
                  ? calculateDistance(userLocation.lat, userLocation.lon, point.latitude, point.longitude)
                  : null;

                return (
                  <Card key={point.id} className="hover:shadow-lg transition-shadow" data-testid={`service-${point.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{point.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{point.address}</span>
                          </div>
                          {distance && (
                            <Badge variant="secondary" className="text-xs">
                              {distance.toFixed(1)} km uzaklıkta
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm">{point.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${point.phone}`} className="hover:text-orange-600">{point.phone}</a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{point.working_hours}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {point.services.slice(0, 4).map((service, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {point.services.length > 4 && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              +{point.services.length - 4} daha
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => handleGetDirections(point)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                            data-testid={`directions-button-${point.id}`}
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Yol Tarifi
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            data-testid={`appointment-button-${point.id}`}
                          >
                            Randevu Al
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ServiceFinderPage;
