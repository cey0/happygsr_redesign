import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function MemberTab() {
  const { user, token, login, register, logout, refreshUser } = useAuth();
  const { formatRupiah } = useCart();

  const [activeSubTab, setActiveSubTab] = useState('login'); // login | register
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWa, setRegWa] = useState('');
  const [regPass, setRegPass] = useState('');

  // Dashboard Stats
  const [commissions, setCommissions] = useState([]);
  const [commSummary, setCommSummary] = useState({ totalPaid: 0, totalPending: 0, totalEarned: 0 });
  const [commLoading, setCommLoading] = useState(false);

  // Fetch commissions when user is logged in
  useEffect(() => {
    const fetchCommissions = async () => {
      if (!token) return;
      setCommLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/commissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCommissions(data.commissions);
          setCommSummary(data.summary);
        }
      } catch (err) {
        console.error('Error fetching commissions:', err);
      } finally {
        setCommLoading(false);
      }
    };

    if (user) {
      fetchCommissions();
      refreshUser();
    }
  }, [user, token]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login(loginEmail, loginPass);
      setSuccessMsg('Masuk Berhasil! Selamat datang kembali.');
    } catch (err) {
      setErrorMsg(err.message || 'Login gagal, mohon periksa email & password Anda.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await register(regName, regEmail, regWa, regPass);
      setSuccessMsg('Pendaftaran Berhasil! Akun kemitraan Anda telah aktif.');
    } catch (err) {
      setErrorMsg(err.message || 'Pendaftaran gagal, email mungkin sudah digunakan.');
    }
  };

  // If user is logged in, show Dashboard
  if (user) {
    return (
      <section className="tab-pane active container" style={{ display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #E2E8F0', paddingBottom: '15px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Dashboard Kemitraan GSR</h2>
            <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>Selamat datang, <strong>{user.name}</strong>. Kelola bonus referral dan token belanja Anda.</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> Keluar
          </button>
        </div>

        {/* Stats Row */}
        <div className="milestones" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="milestone-item" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted-text)', fontWeight: '600' }}>Loyalty Token</span>
            <span className="m-num" style={{ display: 'block', margin: '10px 0', fontSize: '28px', color: 'var(--primary)' }}>{user.token_balance} GSR</span>
            <span style={{ fontSize: '12px', color: 'var(--success)' }}><i className="fa-solid fa-circle-info"></i> Nilai: {formatRupiah(user.token_balance * 1000)}</span>
          </div>
          <div className="milestone-item" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted-text)', fontWeight: '600' }}>Komisi Dibayar</span>
            <span className="m-num" style={{ display: 'block', margin: '10px 0', fontSize: '28px', color: 'var(--success)' }}>{formatRupiah(commSummary.totalPaid)}</span>
            <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>Transfer Selesai</span>
          </div>
          <div className="milestone-item" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted-text)', fontWeight: '600' }}>Komisi Tertunda</span>
            <span className="m-num" style={{ display: 'block', margin: '10px 0', fontSize: '28px', color: 'var(--accent)' }}>{formatRupiah(commSummary.totalPending)}</span>
            <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>Sedang Diverifikasi</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* Profile Details Sidebar */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h4 style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '15px', fontWeight: '700' }}>Profil Mitra</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Nama Lengkap</label>
              <strong style={{ fontSize: '15px' }}>{user.name}</strong>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Alamat Email</label>
              <strong style={{ fontSize: '15px' }}>{user.email}</strong>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Nomor Whatsapp</label>
              <strong style={{ fontSize: '15px' }}>{user.phone}</strong>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Status Kemitraan</label>
              <span className="badge" style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>Active Reseller</span>
            </div>

            <div style={{ backgroundColor: 'var(--primary-soft)', padding: '15px', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Kode Referral Anda</span>
              <strong style={{ fontSize: '16px', letterSpacing: '1px' }}>{user.referral_code}</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted-text)', marginTop: '6px', lineHeight: '1.3' }}>Bagikan kode ini untuk mendapatkan komisi 10% dari transaksi teman Anda.</p>
            </div>
          </div>

          {/* Commissions & Activity logs */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '15px', fontWeight: '700' }}>Riwayat Komisi Afiliasi</h4>
            
            {commLoading ? (
              <p>Memuat data komisi...</p>
            ) : commissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <i className="fa-solid fa-receipt" style={{ fontSize: '40px', color: 'var(--muted-text)', marginBottom: '10px', display: 'block' }}></i>
                <p>Belum ada aktivitas komisi. Bagikan referral Anda untuk memulai!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {commissions.map((comm) => (
                  <div key={comm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '15px', display: 'block' }}>{comm.description}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>{new Date(comm.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '16px', color: comm.status === 'paid' ? 'var(--success)' : 'var(--accent)', display: 'block' }}>
                        +{formatRupiah(comm.amount)}
                      </strong>
                      <span className={`badge ${comm.status === 'paid' ? 'badge-success' : 'badge-outline'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {comm.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
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

  // Not logged in: show signup / login forms
  return (
    <section className="tab-pane active container" style={{ display: 'block' }}>
      <div className="auth-wrapper">
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${activeSubTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('login'); setErrorMsg(''); }}
          >
            Masuk Akun
          </button>
          <button
            className={`auth-tab-btn ${activeSubTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('register'); setErrorMsg(''); }}
          >
            Daftar Gratis
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: 'var(--orange-soft)', color: 'var(--orange)', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', border: '1px solid var(--orange)' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', border: '1px solid var(--success)' }}>
            <i className="fa-solid fa-circle-check"></i> {successMsg}
          </div>
        )}

        {/* Login Form */}
        {activeSubTab === 'login' && (
          <div className="auth-card" id="authLoginCard">
            <h3>Selamat Datang Kembali!</h3>
            <p className="auth-subtitle">Kelola komisi kemitraan, lacak pesanan, dan dapatkan diskon member.</p>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email atau Nomor Whatsapp</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: 0822xxxxxxxx / member@happygsr.com"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Masukkan password Anda"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />
              </div>
              <div className="form-actions-row">
                <label className="checkbox-label">
                  <input type="checkbox" /> Ingat Saya
                </label>
                <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>Lupa Password?</a>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Masuk ke Dashboard</button>
            </form>
          </div>
        )}

        {/* Register Form */}
        {activeSubTab === 'register' && (
          <div className="auth-card" id="authRegisterCard">
            <h3>Daftar Member GSR Gratis</h3>
            <p className="auth-subtitle">Mulai bangun usaha mandiri Anda hari ini &amp; dapatkan komisi s.d 10%.</p>
            
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Nomor Whatsapp Aktif</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Contoh: 082240299789"
                  required
                  value={regWa}
                  onChange={(e) => setRegWa(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Alamat Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Contoh: nama@email.com"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password Baru</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Minimal 6 karakter"
                  required
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" required /> Saya menyetujui Syarat &amp; Ketentuan Kemitraan GSR
                </label>
              </div>
              <button type="submit" className="btn btn-accent btn-block">Daftar Sekarang (Gratis Selamanya)</button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
