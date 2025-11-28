import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import YedekParcaPage from "./pages/YedekParcaPage";
import AksesuarPage from "./pages/AksesuarPage";
import JantLastikPage from "./pages/JantLastikPage";
import UstamOzelPage from "./pages/UstamOzelPage";
import BakimRobotuPage from "./pages/BakimRobotuPage";
import SigortanPage from "./pages/SigortanPage";
import AnindaTeslimatPage from "./pages/AnindaTeslimatPage";
import ServisBulucuPage from "./pages/ServisBulucuPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<YedekParcaPage />} />
            <Route path="/aksesuar" element={<AksesuarPage />} />
            <Route path="/jant-lastik" element={<JantLastikPage />} />
            <Route path="/ustam-ozel" element={<UstamOzelPage />} />
            <Route path="/bakim-robotu" element={<BakimRobotuPage />} />
            <Route path="/sigortan" element={<SigortanPage />} />
            <Route path="/aninda-teslimat" element={<AnindaTeslimatPage />} />
            <Route path="/servis-bulucu" element={<ServisBulucuPage />} />
            <Route path="/kategori/:category" element={<ProductListPage />} />
            <Route path="/urun/:id" element={<ProductDetailPage />} />
            <Route path="/sepet" element={<CartPage />} />
            <Route path="/favoriler" element={<FavoritesPage />} />
            <Route path="/kampanyalar" element={<ProductListPage />} />
            <Route path="/yeni-urunler" element={<ProductListPage />} />
            <Route path="/cok-satanlar" element={<ProductListPage />} />
            <Route path="/markalar" element={<ProductListPage />} />
            <Route path="/arama" element={<ProductListPage />} />
          </Routes>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
