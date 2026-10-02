/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { Product, Order } from './types/index.ts';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';

import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { CollectionsPage } from './pages/CollectionsPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AccountOrdersPage } from './pages/AccountOrdersPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';

import { apiService } from './services/api.ts';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [initialShopCategory, setInitialShopCategory] = useState<string>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products from backend or static fallback
  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNavigate = (tab: string, param?: any) => {
    if (tab === 'shop' && param?.category) {
      setInitialShopCategory(param.category);
    } else {
      setInitialShopCategory('all');
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCurrentTab('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOrder = (order: Order) => {
    setConfirmedOrder(order);
    setCurrentTab('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7] text-[#081d1a]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {loadingProducts ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#8c7355]">Curating LUNA Salon...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'shop' && (
              <ShopPage
                products={products}
                onSelectProduct={handleSelectProduct}
                initialCategory={initialShopCategory}
              />
            )}

            {currentTab === 'collections' && (
              <CollectionsPage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigateShopWithCollection={(collectionName) => {
                  setCurrentTab('shop');
                }}
              />
            )}

            {currentTab === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                onNavigate={handleNavigate}
                onCheckoutInstant={() => handleNavigate('checkout')}
              />
            )}

            {currentTab === 'checkout' && (
              <CheckoutPage
                onOrderSuccess={handleOrderSuccess}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'order-confirmation' && confirmedOrder && (
              <OrderConfirmationPage
                order={confirmedOrder}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'about' && (
              <AboutPage onNavigate={handleNavigate} />
            )}

            {currentTab === 'contact' && (
              <ContactPage />
            )}

            {currentTab === 'account-orders' && (
              <AccountOrdersPage
                onNavigate={handleNavigate}
                onSelectOrder={handleSelectOrder}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                onNavigateHome={() => handleNavigate('home')}
                onRefreshData={fetchProducts}
              />
            )}
          </>
        )}
      </main>

      {/* Luxury Footer (Hidden on dedicated admin tab for full console space) */}
      {currentTab !== 'admin' && <Footer onNavigate={handleNavigate} />}

      {/* Global Modals & Slide-overs */}
      <CartDrawer
        onCheckout={() => handleNavigate('checkout')}
        onNavigateShop={() => handleNavigate('shop')}
      />

      <AuthModal />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
