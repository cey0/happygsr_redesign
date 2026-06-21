import React from 'react';

export default function Footer({ onSwitchTab }) {
  return (
    <footer className="main-footer" style={{ marginTop: '50px' }}>
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); onSwitchTab('home'); }}>
            <span className="logo-accent">Happy</span>GSR
          </a>
          <p className="mt-3">PT GSR Bisnis Indonesia adalah distributor terpercaya laptop berkualitas Grade A, instalasi CCTV profesional, pembuatan website &amp; aplikasi POS, serta investasi properti pilihan.</p>
          <div className="social-links mt-3" style={{ display: 'flex', gap: '10px' }}>
            <a href="#"><i className="fa-brands fa-facebook"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
            <a href="#"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Katalog Layanan</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('catalog'); }}>Laptop Grosir</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('catalog'); }}>Paket CCTV</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('catalog'); }}>Jasa Web POS</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('catalog'); }}>GSR Property</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Layanan Pelanggan</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('orders'); }}>Lacak Status Resi</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('orders'); }}>Konfirmasi Transfer</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('orders'); }}>Kebijakan Garansi</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onSwitchTab('orders'); }}>Simulasi Ongkir</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Alamat Kantor Pusat</h4>
          <p><i className="fa-solid fa-location-dot"></i> Ruko GSR Business, Jl. Daan Mogot Raya, Jakarta Barat, DKI Jakarta, Indonesia</p>
          <p className="mt-2"><i className="fa-solid fa-phone"></i> 021-23095662</p>
          <p className="mt-1"><i className="fa-solid fa-envelope"></i> support@happygsr.com</p>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <p>&copy; 2026 PT GSR BISNIS INDONESIA. Hak Cipta Dilindungi. Dibuat dengan cinta untuk Indonesia Maju.</p>
      </div>
    </footer>
  );
}
