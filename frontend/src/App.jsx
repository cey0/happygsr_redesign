import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeTab from './components/HomeTab';
import CatalogTab from './components/CatalogTab';
import MemberTab from './components/MemberTab';
import CartTab from './components/CartTab';
import OrdersTab from './components/OrdersTab';
import ToolsTab from './components/ToolsTab';
import AboutTab from './components/AboutTab';
import TokenTab from './components/TokenTab';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingId, setTrackingId] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSwitchTab = (tabId) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'home':
        return <HomeTab onSwitchTab={handleSwitchTab} />;
      case 'catalog':
        return (
          <CatalogTab
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onSwitchTab={handleSwitchTab}
          />
        );
      case 'member':
        return <MemberTab />;
      case 'cart':
        return (
          <CartTab
            onSwitchTab={handleSwitchTab}
            onSetTrackingId={setTrackingId}
          />
        );
      case 'orders':
        return (
          <OrdersTab
            trackingId={trackingId}
            onSetTrackingId={setTrackingId}
          />
        );
      case 'tools':
        return <ToolsTab />;
      case 'about':
        return <AboutTab />;
      case 'token':
        return <TokenTab />;
      default:
        return <HomeTab onSwitchTab={handleSwitchTab} />;
    }
  };

  return (
    <div className="app-container">
      <Header
        currentTab={currentTab}
        onSwitchTab={handleSwitchTab}
        onSearch={handleSearch}
      />
      <main className="content-wrapper" style={{ minHeight: '60vh', paddingBottom: '40px' }}>
        {renderCurrentTab()}
      </main>
      <Footer onSwitchTab={handleSwitchTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
