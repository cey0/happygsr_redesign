import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function OrdersTab({ trackingId, onSetTrackingId }) {
  const { formatRupiah } = useCart();
  
  // Tracking States
  const [trackInput, setTrackInput] = useState(trackingId || '');
  const [trackingData, setTrackingData] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);

  // Sync tracking input with prop
  useEffect(() => {
    if (trackingId) {
      setTrackInput(trackingId);
      handleTrackSubmit(null, trackingId);
    }
  }, [trackingId]);

  // Payment Confirmation States
  const [confirmOrderId, setConfirmOrderId] = useState('');
  const [confirmSender, setConfirmSender] = useState('');
  const [confirmAmount, setConfirmAmount] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmErr, setConfirmErr] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Accordion FAQ states
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleTrackSubmit = async (e, idOverride = null) => {
    if (e) e.preventDefault();
    const queryId = idOverride || trackInput.trim().toUpperCase();
    if (!queryId) {
      alert('Mohon masukkan ID Pesanan!');
      return;
    }

    setTrackLoading(true);
    setTrackingError('');
    setTrackingData(null);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/track/${queryId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'ID Pesanan tidak ditemukan');
      }
      setTrackingData(data);
    } catch (err) {
      setTrackingError(err.message || 'Terjadi kesalahan saat melacak pesanan');
    } finally {
      setTrackLoading(false);
    }
  };

  const handleConfirmPaymentSubmit = async (e) => {
    e.preventDefault();
    setConfirmMsg('');
    setConfirmErr('');
    if (!confirmOrderId || !confirmSender || !confirmAmount) {
      alert('Mohon lengkapi data konfirmasi pembayaran!');
      return;
    }

    setConfirmLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: confirmOrderId.trim().toUpperCase(),
          senderName: confirmSender,
          amount: parseInt(confirmAmount, 10)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim konfirmasi');
      }

      setConfirmMsg(data.message);
      setConfirmOrderId('');
      setConfirmSender('');
      setConfirmAmount('');
    } catch (err) {
      setConfirmErr(err.message || 'Terjadi kesalahan saat memproses konfirmasi pembayaran.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(index);
    }
  };

  return (
    <section className="tab-pane active container" style={{ display: 'block' }}>
      <div className="order-tools-grid">
        {/* Order Tracking / Cek Resi Widget */}
        <div className="tool-card">
          <div className="tool-card-header">
            <i className="fa-solid fa-truck-fast"></i>
            <h3>Cek Status &amp; Resi Pengiriman</h3>
          </div>
          <p>Lacak pengiriman laptop atau produk Anda secara real-time dari kurir kami.</p>
          
          <form onSubmit={(e) => handleTrackSubmit(e)} className="form-group mt-3">
            <label>Nomor Resi / ID Pesanan:</label>
            <div className="input-group-row" style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan nomor resi, contoh: GSR-123456"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={trackLoading}>
                {trackLoading ? 'Melacak...' : 'Lacak'}
              </button>
            </div>
          </form>

          {trackingError && (
            <div style={{ backgroundColor: 'var(--orange-soft)', color: 'var(--orange)', padding: '12px', borderRadius: '6px', marginTop: '15px', border: '1px solid var(--orange)', fontSize: '14px' }}>
              <i className="fa-solid fa-circle-exclamation"></i> {trackingError}
            </div>
          )}

          {trackingData && (
            <div className="tracking-result-box" style={{ display: 'block', marginTop: '20px' }}>
              <div style={{ padding: '12px', borderBottom: '1px solid #E2E8F0', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>ID: <strong>{trackingData.orderId}</strong></span>
                <span>Kurir: <strong>{trackingData.courier}</strong></span>
                <span>Status: <strong style={{ color: 'var(--primary)' }}>{trackingData.status.toUpperCase()}</strong></span>
              </div>
              {trackingData.trackingSteps.map((step, idx) => (
                <div className={`tracking-step ${step.completed ? 'completed' : ''}`} key={idx}>
                  <div className="step-bullet"></div>
                  <div>
                    <strong>[{step.time}] - {step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Confirmation Widget */}
        <div className="tool-card">
          <div className="tool-card-header">
            <i className="fa-solid fa-file-invoice-dollar"></i>
            <h3>Konfirmasi Pembayaran</h3>
          </div>
          <p>Unggah bukti transfer bank Anda untuk mempercepat proses verifikasi pesanan.</p>

          {confirmMsg && (
            <div style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)', padding: '12px', borderRadius: '6px', margin: '15px 0', border: '1px solid var(--success)', fontSize: '14px' }}>
              <i className="fa-solid fa-circle-check"></i> {confirmMsg}
            </div>
          )}

          {confirmErr && (
            <div style={{ backgroundColor: 'var(--orange-soft)', color: 'var(--orange)', padding: '12px', borderRadius: '6px', margin: '15px 0', border: '1px solid var(--orange)', fontSize: '14px' }}>
              <i className="fa-solid fa-circle-exclamation"></i> {confirmErr}
            </div>
          )}

          <form onSubmit={handleConfirmPaymentSubmit} className="mt-3">
            <div className="form-group">
              <label>ID Pesanan:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: GSR-123456"
                required
                value={confirmOrderId}
                onChange={(e) => setConfirmOrderId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Nama Pemilik Rekening Pengirim:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Budi Prasetyo"
                required
                value={confirmSender}
                onChange={(e) => setConfirmSender(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Jumlah Transfer (Rp):</label>
              <input
                type="number"
                className="form-control"
                placeholder="Contoh: 1799045"
                required
                value={confirmAmount}
                onChange={(e) => setConfirmAmount(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-accent btn-block" disabled={confirmLoading}>
              {confirmLoading ? 'Mengirim...' : 'Kirim Bukti Konfirmasi'}
            </button>
          </form>
        </div>
      </div>

      {/* Refund Guidelines & Policies Accordions */}
      <div className="refund-guidelines mt-5">
        <div className="section-header">
          <h3>Kebijakan Pengembalian Dana &amp; Barang</h3>
        </div>
        <div className="accordion">
          <div className={`accordion-item ${openAccordion === 0 ? 'active' : ''}`}>
            <div className="accordion-header" onClick={() => toggleAccordion(0)}>
              <h4>Apakah ada garansi jika laptop diterima dalam keadaan rusak?</h4>
              <i className={`fa-solid ${openAccordion === 0 ? 'fa-minus' : 'fa-plus'}`}></i>
            </div>
            <div className="accordion-content">
              <p>Ya! PT GSR Bisnis Indonesia memberikan garansi penuh untuk setiap unit laptop baru maupun second Grade A. Jika barang diterima rusak fisik atau mati akibat pengiriman, kami akan mengganti unit dengan yang baru / setara, atau mengembalikan dana 100% dengan syarat mengirimkan video unboxing paket dalam 1x24 jam.</p>
            </div>
          </div>
          
          <div className={`accordion-item ${openAccordion === 1 ? 'active' : ''}`}>
            <div className="accordion-header" onClick={() => toggleAccordion(1)}>
              <h4>Berapa lama masa garansi laptop di HappyGSR?</h4>
              <i className={`fa-solid ${openAccordion === 1 ? 'fa-minus' : 'fa-plus'}`}></i>
            </div>
            <div className="accordion-content">
              <p>Masa garansi bervariasi bergantung pada kategori produk:</p>
              <ul>
                <li>Laptop Second Grade A: Garansi Toko 1 Bulan (Hardware &amp; Service)</li>
                <li>Laptop Brand New (DST, HP, Dell): Garansi Resmi Distributor 1 Tahun</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
