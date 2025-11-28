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

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
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
