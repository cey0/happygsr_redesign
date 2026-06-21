import React from 'react';

export default function AboutTab() {
  return (
    <section className="tab-pane active container" style={{ display: 'block' }}>
      <div className="about-grid">
        <div className="about-text">
          <h2>Tentang PT GSR Bisnis Indonesia</h2>
          <p>Didirikan atas visi mulia untuk menjadi mercusuar kejujuran di industri laptop e-commerce Indonesia, HappyGSR lahir dari keprihatinan pendiri kami terhadap maraknya penipuan produk laptop palsu/rusak ex-import ilegal di pasaran.</p>
          <p>Kami memiliki komitmen penuh untuk memberikan hanya unit laptop pilihan yang telah melalui proses <strong>QC (Quality Control) 21 Tahapan</strong> yang ketat. Dengan operasional terpusat di Jakarta, kami terus berkembang memperluas layanan hingga pemasangan CCTV profesional, sistem POS, pembuatan website custom, serta investasi properti strategis.</p>
          
          <div className="milestones mt-4" style={{ display: 'flex', gap: '20px' }}>
            <div className="milestone-item">
              <span className="m-num">10k+</span>
              <span className="m-label">Laptop Terjual</span>
            </div>
            <div className="milestone-item">
              <span className="m-num">500+</span>
              <span className="m-label">Mitra Reseller</span>
            </div>
            <div className="milestone-item">
              <span className="m-num">98%</span>
              <span className="m-label">Rating Kepuasan</span>
            </div>
          </div>
        </div>
        <div className="about-visual">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600" alt="GSR Office" className="img-responsive rounded shadow" />
          <div className="office-address mt-3">
            <h4>Lokasi Pusat &amp; Showroom:</h4>
            <p><i className="fa-solid fa-location-dot"></i> Ruko GSR Business, Jalan Daan Mogot, Jakarta Barat, Indonesia</p>
          </div>
        </div>
      </div>
    </section>
  );
}
