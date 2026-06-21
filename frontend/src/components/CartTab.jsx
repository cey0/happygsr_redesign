import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartTab({ onSwitchTab, onSetTrackingId }) {
  const { token } = useAuth();
  const { cart, formatRupiah, updateCartQty, removeCartItem, applyVoucher, voucherCode, clearCart, calculateTotals } = useCart();
  
  const [voucherInput, setVoucherInput] = useState('');
  
  // Checkout Form States
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCourier, setCustCourier] = useState('JNE');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { subtotal, discountAmount, total } = calculateTotals();

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (!voucherInput) return;
    const res = applyVoucher(voucherInput);
    alert(res.message);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Keranjang belanja Anda kosong!');
      return;
    }
    if (!custName || !custPhone || !custAddress) {
      alert('Mohon lengkapi data pemesanan terlebih dahulu!');
      return;
    }

    setCheckoutLoading(true);
    try {
      // Map items for API format
      const itemsPayload = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: custName,
          phone: custPhone,
          address: custAddress,
          courier: custCourier,
          items: itemsPayload,
          voucherCode: voucherCode
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal memproses checkout');
      }

      alert(`Pesanan Berhasil Dibuat!\nID Pesanan Anda: ${data.orderId}\n\nAnda akan dialihkan ke WhatsApp untuk menyelesaikan pembayaran.`);
      
      // Save order ID to parent tracking input state so user can track it easily
      if (onSetTrackingId) {
        onSetTrackingId(data.orderId);
      }

      // Clear Cart
      clearCart();

      // Redirect to WhatsApp
      window.open(data.whatsappUrl, '_blank');

      // Go to orders tab
      onSwitchTab('orders');

    } catch (err) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan saat memproses checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section className="tab-pane active container" style={{ display: 'block' }}>
      <div className="cart-page-layout">
        {/* Cart Items List */}
        <div className="cart-main">
          <h3>Keranjang Belanja</h3>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Harga</th>
                  <th>Kuantitas</th>
                  <th>Total</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ padding: '40px' }}>
                      <i className="fa-solid fa-basket-shopping" style={{ fontSize: '40px', color: 'var(--muted-text)', marginBottom: '12px', display: 'block' }}></i>
                      Keranjang belanja Anda kosong.
                    </td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="cart-item-info">
                          <div className="cart-item-thumb"><img src={item.image} alt={item.title} /></div>
                          <div>
                            <h4 className="cart-item-title">{item.title}</h4>
                            <span className="badge badge-outline">{item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{formatRupiah(item.price)}</td>
                      <td>
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>-</button>
                          <span className="qty-val">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                        </div>
                      </td>
                      <td><strong>{formatRupiah(item.price * item.quantity)}</strong></td>
                      <td>
                        <button className="btn-remove-item" onClick={() => removeCartItem(item.id)}>
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Checkout Summary & Checkout Form */}
        <aside className="cart-summary">
          <div className="summary-card">
            <h3>Ringkasan Belanja</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <strong>{formatRupiah(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Voucher Potongan:</span>
              <span className="text-success">-{formatRupiah(discountAmount)}</span>
            </div>
            
            <form onSubmit={handleApplyVoucher} className="summary-row promo-input-row" style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Kode Voucher"
                className="form-control-sm"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm">Gunakan</button>
            </form>
            <hr />
            <div className="summary-row total-row">
              <span>Total Pembayaran:</span>
              <strong>{formatRupiah(total)}</strong>
            </div>

            {/* Checkout Billing & Shipping Form */}
            <div className="checkout-form mt-4">
              <h4>Form Pemesanan Cepat</h4>
              <form onSubmit={handleCheckoutSubmit}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-control-sm form-control"
                    placeholder="Nama Anda"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Nomor WhatsApp</label>
                  <input
                    type="tel"
                    className="form-control-sm form-control"
                    placeholder="Contoh: 0822xxxxxxxx"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Alamat Pengiriman Lengkap</label>
                  <textarea
                    className="form-control-sm form-control"
                    rows="2"
                    placeholder="Nama Jalan, RT/RW, Kecamatan, Kota, Kode Pos"
                    required
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Metode Pengiriman</label>
                  <select
                    className="form-control-sm form-control"
                    value={custCourier}
                    onChange={(e) => setCustCourier(e.target.value)}
                  >
                    <option value="JNE">JNE Reguler (Asuransi Laptop)</option>
                    <option value="JNT">J&amp;T Express</option>
                    <option value="COD">COD Khusus Area Jakarta Barat</option>
                  </select>
                </div>
                
                <button type="submit" className="btn btn-accent btn-block mt-3" disabled={checkoutLoading}>
                  <i className="fa-brands fa-whatsapp"></i> {checkoutLoading ? 'Memproses...' : 'Selesaikan Pemesanan via WhatsApp'}
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
