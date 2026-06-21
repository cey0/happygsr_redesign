import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function CatalogTab({ searchQuery, onClearSearch, onSwitchTab }) {
  const { addToCart, formatRupiah } = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(false);

  // Fetch products from API when filters, search query, or sorting changes
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category && category !== 'all') queryParams.append('category', category);
        if (searchQuery) queryParams.append('search', searchQuery);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (sortBy && sortBy !== 'default') queryParams.append('sortBy', sortBy);

        const response = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [category, searchQuery, minPrice, maxPrice, sortBy]);

  const handleCategoryClick = (e, cat) => {
    e.preventDefault();
    setCategory(cat);
  };

  const handleAddToCart = (e, prod, stay) => {
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
      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="catalog-sidebar">
          <div className="sidebar-widget">
            <h4>Kategori Produk</h4>
            <ul className="filter-list">
              <li>
                <a href="#" className={category === 'all' ? 'active' : ''} onClick={(e) => handleCategoryClick(e, 'all')}>
                  <i className="fa-solid fa-tags"></i> Semua Layanan
                </a>
              </li>
              <li>
                <a href="#" className={category === 'laptop-grosir' ? 'active' : ''} onClick={(e) => handleCategoryClick(e, 'laptop-grosir')}>
                  <i className="fa-solid fa-laptop"></i> Laptop Harga Grosir
                </a>
              </li>
              <li>
                <a href="#" className={category === 'laptop-new' ? 'active' : ''} onClick={(e) => handleCategoryClick(e, 'laptop-new')}>
                  <i className="fa-solid fa-laptop-code"></i> Laptop / AIO New (Baru)
                </a>
              </li>
              <li>
                <a href="#" className={category === 'cctv' ? 'active' : ''} onClick={(e) => handleCategoryClick(e, 'cctv')}>
                  <i className="fa-solid fa-video"></i> Paket CCTV
                </a>
              </li>
              <li>
                <a href="#" className={category === 'website' ? 'active' : ''} onClick={(e) => handleCategoryClick(e, 'website')}>
                  <i className="fa-solid fa-globe"></i> Jasa Pembuatan Website
                </a>
              </li>
              <li>
                <a href="#" className={category === 'property' ? 'active' : ''} onClick={(e) => handleCategoryClick(e, 'property')}>
                  <i className="fa-solid fa-house-chimney-window"></i> GSR Property
                </a>
              </li>
            </ul>
          </div>

          <div className="sidebar-widget">
            <h4>Filter Harga</h4>
            <div className="price-filter-inputs">
              <input
                type="number"
                placeholder="Min (Rp)"
                className="form-control"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max (Rp)"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            {(minPrice || maxPrice || searchQuery || category !== 'all') && (
              <button
                className="btn btn-outline btn-block btn-sm mt-3"
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  setCategory('all');
                  onClearSearch();
                }}
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="sidebar-widget bg-primary-soft promo-box-sidebar">
            <h4>Butuh Konsultasi?</h4>
            <p>Hubungi CS kami untuk mendapatkan penawaran grosir khusus perusahaan atau instansi.</p>
            <a href="https://wa.me/6282240299789" target="_blank" rel="noreferrer" className="btn btn-primary btn-block">
              <i className="fa-brands fa-whatsapp"></i> Chat WhatsApp
            </a>
          </div>
        </aside>

        {/* Product Catalog Listing */}
        <div className="catalog-main">
          <div className="catalog-bar">
            <span className="catalog-count-text">
              {searchQuery ? `Hasil pencarian untuk "${searchQuery}": ` : ''}
              Menampilkan {products.length} produk &amp; layanan
            </span>
            <div className="catalog-sort">
              <label>Urutkan:</label>
              <select
                className="form-control-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="discount">Diskon Terbesar</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center mt-5">
              <p>Memuat produk...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center mt-5" style={{ gridColumn: '1/-1' }}>
              <i className="fa-solid fa-magnifying-glass-blur" style={{ fontSize: '40px', color: 'var(--muted-text)', marginBottom: '10px', display: 'block' }}></i>
              <p>Tidak ada produk yang cocok dengan pencarian Anda.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((prod) => (
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
                      <button className="btn btn-primary btn-sm" onClick={(e) => handleAddToCart(e, prod, false)}>Beli Sekarang</button>
                      <button className="btn-icon-cart" title="Tambah ke Keranjang" onClick={(e) => handleAddToCart(e, prod, true)}>
                        <i className="fa-solid fa-cart-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
