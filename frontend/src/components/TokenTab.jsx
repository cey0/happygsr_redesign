import React from 'react';

export default function TokenTab() {
  return (
    <section className="tab-pane active container" style={{ display: 'block' }}>
      <div className="token-hero">
        <div className="token-hero-content">
          <span className="badge badge-accent">LOYALTY TOKEN</span>
          <h2>HappyGSR Token (GSR Token)</h2>
          <p>Aset loyalitas digital inovatif untuk pelanggan setia kami. Dapatkan token GSR secara gratis pada setiap transaksi laptop, jasa pembuatan website, atau CCTV, dan gunakan untuk potongan belanja langsung atau tukar hadiah eksklusif.</p>
          <div className="token-stats mt-4" style={{ display: 'flex', gap: '20px' }}>
            <div className="stat-box">
              <span>Nilai Tukar Saat Ini:</span>
              <strong>1 GSR = Rp1.000</strong>
            </div>
            <div className="stat-box">
              <span>Akumulasi Token Beredar:</span>
              <strong>142.500 GSR</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="token-info-grid mt-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        <div className="info-card">
          <i className="fa-solid fa-gift text-accent" style={{ fontSize: '32px', marginBottom: '15px' }}></i>
          <h3>Cara Mendapatkan Token</h3>
          <p>Setiap belanja Rp100.000 di HappyGSR secara otomatis menghasilkan 1 Token GSR untuk Anda. Mitra Reseller dan Affiliasi juga menerima token bonus tambahan atas kontribusi penjualan mereka.</p>
        </div>
        <div className="info-card">
          <i className="fa-solid fa-percent text-success" style={{ fontSize: '32px', marginBottom: '15px' }}></i>
          <h3>Potongan Belanja Langsung</h3>
          <p>Gunakan token GSR Anda saat checkout untuk memotong total tagihan belanja Anda. Tidak ada batas minimum penggunaan token — hemat lebih banyak untuk setiap pembelian.</p>
        </div>
        <div className="info-card">
          <i className="fa-solid fa-circle-nodes text-primary" style={{ fontSize: '32px', marginBottom: '15px' }}></i>
          <h3>Ekosistem Aset Digital</h3>
          <p>Token GSR dirancang untuk meningkatkan retensi dan loyalitas pelanggan. Nilai token didukung secara riil oleh ekosistem layanan teknologi dan investasi properti dari PT GSR Bisnis Indonesia.</p>
        </div>
      </div>
    </section>
  );
}
