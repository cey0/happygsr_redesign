import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function HomeTab({ onSwitchTab }) {
  const { addToCart, formatRupiah } = useCart();
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [calcUnits, setCalcUnits] = useState(5);
  const [calcPrice, setCalcPrice] = useState(3500000);
  const [calcCommission, setCalcCommission] = useState(0);

  // Fetch products on mount
  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching homepage products:', err);
      }
    };
    fetchHomeProducts();
  }, []);

  // Update commission simulation
  useEffect(() => {
    // 10% commission model
    const totalCom = calcUnits * calcPrice * 0.10;
    setCalcCommission(totalCom);
  }, [calcUnits, calcPrice]);

  // Dynamic filter for featured products
  const getFilteredProducts = () => {
    let filtered = products;
    if (activeFilter === 'best') {
      filtered = products.filter(p => p.badge === 'Paling Laris' || p.badge === 'Terlaris');
    } else if (activeFilter === 'promo') {
      filtered = products.filter(p => p.discount > 15);
    } else if (activeFilter === 'property') {
      filtered = products.filter(p => p.category === 'property');
    }
    return filtered.slice(0, 4);
  };

  const handleAddToCartClick = (e, prod, stay) => {
    e.preventDefault();
    addToCart(prod, 1);
    if (stay) {
      alert(`${prod.title} ditambahkan ke keranjang!`);
    } else {
      onSwitchTab('cart');
    }
  };

  return (
    <section className="tab-pane active" style={{ display: 'block' }}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-slider">
          <div className="slide active" style={{ backgroundImage: `linear-gradient(135deg, rgba(0, 85, 170, 0.95), rgba(30, 115, 190, 0.85)), url('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200')` }}>
            <div className="slide-content">
              <span className="slide-tag">PT GSR BISNIS INDONESIA</span>
              <h2>Laptop Grade A &amp; Solusi Properti Terbaik</h2>
              <p>Distributor laptop baru dan ex-kantor berkualitas grosir, pembuatan website profesional, CCTV, serta peluang investasi properti cerdas di satu platform terpercaya.</p>
              <div className="slide-actions">
                <a href="#" className="btn btn-primary btn-large" onClick={(e) => { e.preventDefault(); onSwitchTab('catalog'); }}>
                  <i className="fa-solid fa-basket-shopping"></i> Jelajahi Produk
                </a>
                <a href="#" className="btn btn-secondary btn-large" onClick={(e) => { e.preventDefault(); onSwitchTab('member'); }}>
                  Join Kemitraan <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="section-welcome container">
        <div className="welcome-grid">
          <div className="welcome-text">
            <div className="section-header">
              <span className="subtitle">MITRA PERTUMBUHAN DIGITAL &amp; ASET ANDA</span>
              <h3>Solusi Bisnis Terintegrasi untuk Indonesia Maju</h3>
            </div>
            <p><strong>PT GSR BISNIS INDONESIA</strong> hadir sebagai mitra terpercaya Anda dalam mengembangkan bisnis di era modern. Berlokasi strategis di Jakarta Barat, kami berkomitmen untuk menyediakan solusi teknologi terjangkau serta investasi properti inovatif untuk mendukung kesuksesan finansial Anda secara berkelanjutan.</p>
            <p>Kami percaya teknologi berkualitas tinggi tidak harus mahal, dan investasi masa depan harus dimulai dengan langkah yang cerdas dan transparan.</p>
            
            <div className="welcome-features">
              <div className="feature-item-mini">
                <div className="icon-wrap"><i className="fa-solid fa-laptop-code"></i></div>
                <div>
                  <h4>Teknologi Terjangkau</h4>
                  <p>Laptop Grade A, Web Dev, POS, &amp; CCTV</p>
                </div>
              </div>
              <div className="feature-item-mini">
                <div className="icon-wrap"><i className="fa-solid fa-building-circle-check"></i></div>
                <div>
                  <h4>Investasi Properti</h4>
                  <p>Beli-Sewa-Jual properti di bawah harga pasar</p>
                </div>
              </div>
            </div>
          </div>
          <div className="welcome-visual">
            <div className="experience-card">
              <span className="number">100%</span>
              <span className="label">Produk Teruji &amp; Bergaransi</span>
            </div>
            <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600" alt="Bisnis Modern" className="img-responsive rounded shadow" />
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="section-gray">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">MENGAPA KAMI?</span>
            <h3>4 Keunggulan Utama HappyGSR</h3>
            <p className="header-description">Kami tidak hanya sekadar menjual produk, melainkan membangun kemitraan jangka panjang yang menguntungkan.</p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon-wrap bg-primary-soft">
                <i className="fa-solid fa-cubes"></i>
              </div>
              <h4>One-Stop Business Solution</h4>
              <p>Semua kebutuhan operasional bisnis Anda tersedia di satu tempat: laptop kerja, sistem kasir (POS), website promosi, CCTV keamanan, hingga investasi aset.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-wrap bg-orange-soft">
                <i className="fa-solid fa-tags"></i>
              </div>
              <h4>Pasti Harga Grosir Terbaik</h4>
              <p>Kami memotong rantai distribusi untuk menghadirkan laptop Grade A dan properti pilihan di bawah harga developer. Solusi cerdas maksimalkan budget Anda.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-wrap bg-success-soft">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4>Bergaransi &amp; Terpercaya</h4>
              <p>Didukung oleh tim profesional dengan layanan purna jual yang andal di Jakarta. Setiap produk melewati uji kualitas ketat (QC 21 poin) sebelum dikirim.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-wrap bg-purple-soft">
                <i className="fa-solid fa-arrow-up-right-dots"></i>
              </div>
              <h4>Investasi Masa Depan</h4>
              <p>Mulai bangun aset Anda dengan cepat. Dapatkan program referral, reseller, bonus komisi, hingga GSR Token yang memperluas nilai aset digital Anda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Calculator */}
      <div className="section-calculator">
        <div className="container">
          <div className="calc-grid">
            <div className="calc-text">
              <span className="badge badge-accent">PROGRAM KEMITRAAN</span>
              <h3>Simulasi Penghasilan Tambahan bersama GSR</h3>
              <p>Bergabunglah dengan ribuan Reseller &amp; Affiliate HappyGSR. Bagikan tautan produk atau rekomendasikan laptop ke komunitas Anda, dapatkan komisi langsung hingga 10% per penjualan.</p>
              
              <ul className="benefit-list">
                <li><i className="fa-solid fa-circle-check"></i> Tanpa modal stok barang (Sistem Dropship)</li>
                <li><i className="fa-solid fa-circle-check"></i> Dukungan materi promosi &amp; panduan gratis</li>
                <li><i className="fa-solid fa-circle-check"></i> Pembayaran komisi cepat setiap bulan</li>
              </ul>
            </div>
            <div className="calc-box">
              <h4>Kalkulator Komisi Mitra</h4>
              
              <div className="form-group">
                <label>Jumlah Penjualan Laptop per Bulan:</label>
                <div className="range-slider-wrapper">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={calcUnits}
                    className="slider-input"
                    onChange={(e) => setCalcUnits(parseInt(e.target.value))}
                  />
                  <span className="range-value">{calcUnits} Unit</span>
                </div>
              </div>

              <div className="form-group">
                <label>Estimasi Harga Rata-rata per Laptop:</label>
                <select
                  value={calcPrice}
                  className="form-control"
                  onChange={(e) => setCalcPrice(parseInt(e.target.value))}
                >
                  <option value={2000000}>Rp2.000.000 (Laptop Pelajar / Desain)</option>
                  <option value={3500000}>Rp3.500.000 (Laptop Gaming / Mid-range)</option>
                  <option value={5000000}>Rp5.000.000 (Laptop Bisnis / SultanGSR)</option>
                </select>
              </div>

              <div className="calc-result-box">
                <span className="calc-result-label">Potensi Komisi Bulanan Anda:</span>
                <h3 className="calc-result-price">{formatRupiah(calcCommission)}</h3>
                <p className="calc-result-note">*Estimasi berdasarkan rata-rata komisi 10% bagi Mitra Aktif.</p>
              </div>

              <button className="btn btn-accent btn-block" onClick={() => onSwitchTab('member')}>
                Daftar Kemitraan Sekarang (GRATIS)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="section-products container">
        <div className="section-header-flex">
          <div>
            <span className="subtitle">TERLARIS &amp; TERBARU</span>
            <h3>Produk Pilihan Terbaik</h3>
          </div>
          <div className="filter-tabs">
            <button className={`tab-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Semua</button>
            <button className={`tab-btn ${activeFilter === 'best' ? 'active' : ''}`} onClick={() => setActiveFilter('best')}>Paling Laris</button>
            <button className={`tab-btn ${activeFilter === 'promo' ? 'active' : ''}`} onClick={() => setActiveFilter('promo')}>Promo Hemat</button>
            <button className={`tab-btn ${activeFilter === 'property' ? 'active' : ''}`} onClick={() => setActiveFilter('property')}>Aset &amp; Properti</button>
          </div>
        </div>

        <div className="products-grid">
          {getFilteredProducts().map((prod) => (
            <div className="product-card" key={prod.id}>
              {prod.badge && <span className="product-badge">{prod.badge}</span>}
              {prod.discount > 0 && <div className="product-discount-tag">-{prod.discount}%</div>}
              <div className="product-img-wrapper">
                <img src={prod.image} alt={prod.title} />
              </div>
              <div className="product-body">
                <span className="product-category">{prod.category.replace('-', ' ')}</span>
                <h4 className="product-title" title={prod.title}>{prod.title}</h4>
                <div className="stock-status">
                  <span className="stock-available"><i className="fa-solid fa-circle-check"></i> Ready Stock</span>
                </div>
                <div className="price-box">
                  <span className="price-original">{formatRupiah(prod.price)}</span>
                  {prod.discount > 0 && <span className="price-discounted">{formatRupiah(prod.original_price)}</span>}
                </div>
                <div className="product-actions">
                  <button className="btn btn-primary btn-sm" onClick={(e) => handleAddToCartClick(e, prod, false)}>Beli Sekarang</button>
                  <button className="btn-icon-cart" title="Tambah ke Keranjang" onClick={(e) => handleAddToCartClick(e, prod, true)}>
                    <i className="fa-solid fa-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-outline" onClick={() => onSwitchTab('catalog')}>
            Lihat Semua Produk &amp; Layanan <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Testimonials */}
      <div className="section-gray">
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">TESTIMONI PELANGGAN</span>
            <h3>Apa Kata Mereka Tentang HappyGSR</h3>
          </div>

          <div className="testimonials-slider" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div className="testimonial-card" style={{ flex: '1 1 350px' }}>
              <div className="rating">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="quote">"Sangat puas beli laptop ex-kantor di HappyGSR. Kondisi Grade A mulus seperti baru, baterai awet, dan harganya jauh lebih murah dibanding toko lain. Pelayanan purna jualnya sangat responsif."</p>
              <div className="client-info">
                <div className="client-avatar"><i className="fa-solid fa-user-tie"></i></div>
                <div>
                  <h5>Budi Prasetyo</h5>
                  <span>Pemilik UKM Kopi, Jakarta</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card" style={{ flex: '1 1 350px' }}>
              <div className="rating">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="quote">"Membuat website e-commerce di HappyGSR sangat cepat dan harganya terjangkau. Dapat bonus domain, hosting, dan diajarkan cara pakai sistem kasir POS-nya sampai bisa."</p>
              <div className="client-info">
                <div className="client-avatar"><i className="fa-solid fa-user-ninja"></i></div>
                <div>
                  <h5>Siti Aminah</h5>
                  <span>Online Shop Owner, Bandung</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
