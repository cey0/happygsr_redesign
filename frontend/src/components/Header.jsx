import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header({ currentTab, onSwitchTab, onSearch }) {
  const { user, logout } = useAuth();
  const { cart, calculateTotals, formatRupiah } = useCart();
  
  const [searchVal, setSearchVal] = useState('');
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);

  const cartRef = useRef();
  const memberRef = useRef();

  const { total, totalItems } = calculateTotals();

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartDropdownOpen(false);
      }
      if (memberRef.current && !memberRef.current.contains(e.target)) {
        setMemberDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchVal);
    onSwitchTab('catalog');
  };

  // Announcement bar tickers
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerMessages = [
    'PROMO SPESIAL HARI INI! Gunakan Kode "GSRWEB" untuk Diskon Tambahan!',
    '🚀 GRATIS Ongkir se-Indonesia untuk pembelian laptop di atas Rp 3 Juta!',
    '🎁 Beli 2 Laptop Diskon 5% — Paket Spesial Instansi & Sekolah!',
    '💻 NEW! PC All-in-One HappyGSR — Mulai Rp 3.999.045!',
    '🏠 GSR Property — Investasi Properti di Bawah Harga Developer!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <div className="announcement-news">
            <span className="badge">PROMO HARI INI</span>
            <div className="news-ticker">
              <span className="ticker-item">
                <i className="fa-solid fa-fire"></i> {tickerMessages[tickerIndex]}
              </span>
            </div>
          </div>
          <div className="top-contacts">
            <a href="tel:02123095662"><i class="fa-solid fa-phone"></i> 021-23095662</a>
            <a href="https://wa.me/6282240299789" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-whatsapp text-success"></i> 0822-4029-9789
            </a>
            <a href="mailto:admin@happygsr.com"><i className="fa-solid fa-envelope"></i> admin@happygsr.com</a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="main-header">
        <div className="container header-container">
          {/* Brand Logo */}
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); onSwitchTab('home'); }}>
            <span className="logo-accent">Happy</span>GSR
            <span className="logo-tagline">Business Indonesia</span>
          </a>

          {/* Search Bar */}
          <div className="header-search">
            <form onSubmit={handleSearchSubmit}>
              <div className="search-input-group">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input
                  type="text"
                  placeholder="Cari laptop, paket CCTV, website, atau properti..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
                <button type="submit" className="search-btn">Cari</button>
              </div>
            </form>
          </div>

          {/* Action Buttons (Cart, Member Area) */}
          <div className="header-actions">
            {/* Cart Widget */}
            <div className="cart-widget" ref={cartRef}>
              <div className="cart-icon-wrapper" onClick={() => setCartDropdownOpen(!cartDropdownOpen)}>
                <i className="fa-solid fa-shopping-cart"></i>
                <span className="cart-count">{totalItems}</span>
              </div>
              <div className="cart-info" onClick={() => setCartDropdownOpen(!cartDropdownOpen)}>
                <span className="cart-label">Keranjang</span>
                <span className="cart-total">{formatRupiah(total)}</span>
              </div>
              
              {/* Cart Dropdown */}
              {cartDropdownOpen && (
                <div className="cart-dropdown active" style={{ display: 'block' }}>
                  <div className="cart-dropdown-header">
                    <h4>Keranjang Belanja</h4>
                    <span className="close-dropdown" onClick={() => setCartDropdownOpen(false)}>
                      <i className="fa-solid fa-xmark"></i>
                    </span>
                  </div>
                  <div className="cart-dropdown-items">
                    {cart.length === 0 ? (
                      <div className="empty-cart-message">
                        <i className="fa-solid fa-basket-shopping"></i>
                        <p>Keranjang Anda kosong</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="cart-dropdown-item" style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '12px', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                          <img src={item.image} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt={item.title} />
                          <div style={{ flex: 1 }}>
                            <h5 style={{ marginBottom: '2px', fontWeight: 600, lineHeight: 1.2 }}>{item.title.substring(0, 30)}...</h5>
                            <span>{item.quantity} x {formatRupiah(item.price)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="cart-dropdown-footer">
                    <div className="cart-subtotal">
                      <span>Subtotal:</span>
                      <strong>{formatRupiah(total)}</strong>
                    </div>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => {
                        setCartDropdownOpen(false);
                        onSwitchTab('cart');
                      }}
                    >
                      Lihat Keranjang &amp; Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Member Profile */}
            <div className="member-profile-btn" ref={memberRef} onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}>
              <div className="avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="member-info">
                <span className="member-greet">Halo, {user ? user.name.split(' ')[0] : 'Tamu'}!</span>
                <span className="member-action-text">
                  Akun GSR <i className="fa-solid fa-chevron-down"></i>
                </span>
              </div>

              {/* Member Dropdown */}
              {memberDropdownOpen && (
                <div className="member-dropdown active" style={{ display: 'block' }}>
                  <div className="member-dropdown-header">
                    <div className="avatar-large"><i className="fa-solid fa-user"></i></div>
                    <p className="user-name">{user ? user.name : 'Guest Member'}</p>
                    <span className="badge badge-outline">
                      {user ? `${user.role.toUpperCase()} (Mitra)` : 'Non-Mitra'}
                    </span>
                  </div>
                  <ul className="member-dropdown-menu">
                    {user ? (
                      <>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('member'); }}><i className="fa-solid fa-gauge"></i> Dashboard Anda</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('token'); }}><i className="fa-solid fa-coins"></i> Token: {user.token_balance} GSR</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); logout(); }}><i className="fa-solid fa-right-from-bracket"></i> Keluar</a></li>
                      </>
                    ) : (
                      <>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('member'); }}><i className="fa-solid fa-right-to-bracket"></i> Masuk Akun</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('member'); }}><i className="fa-solid fa-user-plus"></i> Daftar Gratis</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('member'); }}><i className="fa-solid fa-users"></i> Join Reseller</a></li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <nav className="navigation-bar">
        <div className="container nav-container">
          <ul className="nav-links" style={{ display: 'flex' }}>
            <li className={currentTab === 'home' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('home'); }}>
                <i className="fa-solid fa-house"></i> Beranda
              </a>
            </li>
            <li className={currentTab === 'catalog' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('catalog'); }}>
                <i className="fa-solid fa-laptop"></i> Katalog Layanan
              </a>
            </li>
            <li className={currentTab === 'member' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('member'); }}>
                <i className="fa-solid fa-users-gear"></i> Kemitraan GSR
              </a>
            </li>
            <li className={currentTab === 'orders' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('orders'); }}>
                <i className="fa-solid fa-receipt"></i> Pesanan
              </a>
            </li>
            <li className={currentTab === 'token' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('token'); }}>
                <i className="fa-solid fa-coins"></i> HappyGSR Token
              </a>
            </li>
            <li className={currentTab === 'about' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('about'); }}>
                <i className="fa-solid fa-circle-info"></i> Tentang Kami
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
