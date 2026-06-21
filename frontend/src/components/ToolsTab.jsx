import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ToolsTab() {
  const { formatRupiah } = useCart();
  const [destination, setDestination] = useState('15000');
  const [weight, setWeight] = useState(3000);
  const [ongkirResult, setOngkirResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const destinationPrice = parseFloat(destination);
    const weightGrams = parseFloat(weight) || 3000;
    
    // Weight formatted in KG (rounded up)
    const weightKg = Math.ceil(weightGrams / 1000);
    const totalOngkir = destinationPrice * weightKg;

    setOngkirResult({
      total: totalOngkir,
      kg: weightKg
    });
  };

  return (
    <section className="tab-pane active container" style={{ display: 'block' }}>
      <div className="tool-card max-width-600 margin-auto">
        <div className="tool-card-header">
          <i className="fa-solid fa-calculator"></i>
          <h3>Cek Estimasi Ongkos Kirim</h3>
        </div>
        <p>Gunakan simulasi pengiriman cepat dari Jakarta Barat ke seluruh kota di Indonesia.</p>

        <form onSubmit={handleCalculate}>
          <div className="form-group mt-3">
            <label>Kota Tujuan Pengiriman:</label>
            <select
              className="form-control"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="15000">Bandung - Jawa Barat (Estimasi 1-2 hari)</option>
              <option value="20000">Semarang - Jawa Tengah (Estimasi 2-3 hari)</option>
              <option value="25000">Surabaya - Jawa Timur (Estimasi 2-3 hari)</option>
              <option value="35000">Medan - Sumatera Utara (Estimasi 3-4 hari)</option>
              <option value="45000">Makassar - Sulawesi Selatan (Estimasi 3-5 hari)</option>
              <option value="0">Jakarta Barat - COD (Gratis Ongkir!)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Berat Paket (Gram):</label>
            <input
              type="number"
              className="form-control"
              placeholder="Berat dalam gram (rata-rata laptop 3000g)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Hitung Estimasi Ongkir</button>
        </form>

        {ongkirResult && (
          <div className="ongkir-result-box mt-3" style={{ display: 'block' }}>
            <div style={{ backgroundColor: 'var(--accent-light)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--accent)' }}>
              <p style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>Estimasi Ongkir Ditemukan:</p>
              <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>
                {formatRupiah(ongkirResult.total)} ({ongkirResult.kg} Kg)
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--muted-text)' }}>*Sudah termasuk asuransi &amp; packing kayu standar HappyGSR.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
