import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import '@/App.css';

import HomePage from '@/pages/HomePage';
import SparePartsPage from '@/pages/SparePartsPage';
import AccessoriesPage from '@/pages/AccessoriesPage';
import TiresWheelsPage from '@/pages/TiresWheelsPage';
import B2BPage from '@/pages/B2BPage';
import MaintenanceBotPage from '@/pages/MaintenanceBotPage';
import InsurancePage from '@/pages/InsurancePage';
import QuickDeliveryPage from '@/pages/QuickDeliveryPage';
import ServiceFinderPage from '@/pages/ServiceFinderPage';
import CartPage from '@/pages/CartPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/yedek-parca" element={<SparePartsPage />} />
          <Route path="/aksesuar" element={<AccessoriesPage />} />
          <Route path="/jant-lastik" element={<TiresWheelsPage />} />
          <Route path="/ustam-ozel" element={<B2BPage />} />
          <Route path="/bakim-robotu" element={<MaintenanceBotPage />} />
          <Route path="/sigortan" element={<InsurancePage />} />
          <Route path="/aninda-teslimat" element={<QuickDeliveryPage />} />
          <Route path="/servis-bulucu" element={<ServiceFinderPage />} />
          <Route path="/sepet" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
