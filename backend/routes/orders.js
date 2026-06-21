const express = require('express');
const router = express.Router();
const { getDB } = require('../database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_happygsr_key_2026';

// Helper to extract user ID if token is provided (optional auth)
function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      req.user = decoded;
    }
    next();
  });
}

// POST /api/orders (Create checkout)
router.post('/', optionalAuthenticate, async (req, res) => {
  try {
    const { name, phone, address, courier, items, voucherCode } = req.body;
    if (!name || !phone || !address || !courier || !items || !items.length) {
      return res.status(400).json({ message: 'Mohon lengkapi data pemesanan dan isi keranjang!' });
    }

    const db = await getDB();
    const orderId = `GSR-${Math.floor(100000 + Math.random() * 900000)}`;

    // Fetch product details securely from DB
    let subtotal = 0;
    const orderItemsToSave = [];

    for (const item of items) {
      const product = await db.get('SELECT * FROM products WHERE id = ?', item.id);
      if (!product) {
        return res.status(400).json({ message: `Produk dengan ID ${item.id} tidak ditemukan!` });
      }

      const price = product.price;
      subtotal += price * item.quantity;
      orderItemsToSave.push({
        productId: product.id,
        title: product.title,
        quantity: item.quantity,
        price: price
      });
    }

    // Apply Voucher code discount if applicable
    let discountAmount = 0;
    if (voucherCode && voucherCode.toUpperCase() === 'GSRWEB') {
      discountAmount = Math.round(subtotal * 0.10); // 10% discount
    }

    const totalAmount = subtotal - discountAmount;
    const userId = req.user ? req.user.id : null;

    // Save order inside SQLite
    await db.run(`
      INSERT INTO orders (id, user_id, name, phone, address, courier, total_amount, discount_amount, status, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, orderId, userId, name, phone, address, courier, totalAmount, discountAmount, 'pending', 'pending');

    // Save order items
    const itemStmt = await db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `);
    for (const item of orderItemsToSave) {
      await itemStmt.run(orderId, item.productId, item.quantity, item.price);
    }
    await itemStmt.finalize();

    // If user is authenticated, award GSR loyalty tokens (1 Token per Rp100,000 spent)
    if (userId) {
      const tokensEarned = Math.floor(totalAmount / 100000);
      if (tokensEarned > 0) {
        await db.run(
          'UPDATE users SET token_balance = token_balance + ? WHERE id = ?',
          tokensEarned, userId
        );
        // Also simulate an affiliate commission if they were referred (mock referral commission)
        const userDetails = await db.get('SELECT referral_code FROM users WHERE id = ?', userId);
        // award commission to the owner of referral code (if mock referral system is stimulated)
        // For simplicity, we just award a commission to user 1 (Budi) if user is not Budi
        if (userId !== 1) {
          const commAmount = Math.round(totalAmount * 0.05); // 5% referral commission
          await db.run(`
            INSERT INTO commissions (user_id, amount, description, status)
            VALUES (?, ?, ?, ?)
          `, 1, commAmount, `Komisi referral dari pembelian ${name} (${orderId})`, 'pending');
        }
      }
    }

    // Construct text for WhatsApp
    let orderText = `*Pemesanan Baru HappyGSR*\n\n`;
    orderText += `*ID Pesanan:* ${orderId}\n`;
    orderText += `*Detail Pelanggan:*\n`;
    orderText += `- Nama: ${name}\n`;
    orderText += `- WhatsApp: ${phone}\n`;
    orderText += `- Alamat: ${address}\n`;
    orderText += `- Pengiriman: ${courier}\n\n`;
    
    orderText += `*Daftar Produk:*\n`;
    orderItemsToSave.forEach(item => {
      orderText += `- ${item.title} (x${item.quantity}) - Rp${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    });

    if (discountAmount > 0) {
      orderText += `\n*Subtotal:* Rp${subtotal.toLocaleString('id-ID')}\n`;
      orderText += `*Diskon (Voucher):* -Rp${discountAmount.toLocaleString('id-ID')}\n`;
    }
    orderText += `*Total Tagihan:* Rp${totalAmount.toLocaleString('id-ID')}`;

    res.status(201).json({
      message: 'Pesanan berhasil dibuat',
      orderId,
      totalAmount,
      whatsappText: orderText,
      whatsappUrl: `https://api.whatsapp.com/send?phone=6282240299789&text=${encodeURIComponent(orderText)}`
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memproses pesanan' });
  }
});

// GET /api/orders/track/:id
router.get('/track/:id', async (req, res) => {
  try {
    const db = await getDB();
    const order = await db.get('SELECT * FROM orders WHERE id = ?', req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Nomor Resi / ID Pesanan tidak ditemukan' });
    }

    // Generate tracking steps based on status
    const steps = [];
    const createdDate = new Date(order.created_at);
    
    const formatDate = (dateOffsetHours) => {
      const d = new Date(createdDate.getTime() + dateOffsetHours * 60 * 60 * 1000);
      return d.toISOString().replace('T', ' ').substring(0, 19);
    };

    // All orders start with received step
    steps.push({
      time: formatDate(0),
      title: 'Pesanan Diterima',
      description: `Menunggu verifikasi pembayaran oleh PT GSR Bisnis Indonesia.`,
      completed: true
    });

    // Check payment status or order status to add QC step
    if (order.payment_status === 'verifying' || order.payment_status === 'paid' || order.status !== 'pending') {
      steps.push({
        time: formatDate(2),
        title: 'Verifikasi & Quality Control Passed',
        description: 'Uji fungsionalitas hardware, baterai, layar, dan kelengkapan unit selesai dengan status Lolos QC.',
        completed: order.status !== 'pending'
      });
    } else {
      steps.push({
        time: '--:--',
        title: 'Verifikasi & Quality Control',
        description: 'Uji fungsionalitas hardware (QC 21 tahapan) akan dijalankan setelah pembayaran diverifikasi.',
        completed: false
      });
    }

    // Shipped step
    if (order.status === 'shipped' || order.status === 'completed') {
      steps.push({
        time: formatDate(4),
        title: `Paket Dikirim via ${order.courier}`,
        description: `Kurir telah mengambil paket. Resi pengiriman aktif.`,
        completed: true
      });
    } else {
      steps.push({
        time: '--:--',
        title: 'Pengiriman Paket',
        description: `Unit akan diserahkan ke kurir ${order.courier} area Jakarta Barat.`,
        completed: false
      });
    }

    // Completed step
    if (order.status === 'completed') {
      steps.push({
        time: formatDate(24),
        title: 'Paket Diterima',
        description: 'Pesanan telah sampai di alamat tujuan dan diterima oleh pelanggan.',
        completed: true
      });
    }

    // Reverse steps to show latest first
    res.json({
      orderId: order.id,
      name: order.name,
      status: order.status,
      paymentStatus: order.payment_status,
      courier: order.courier,
      totalAmount: order.total_amount,
      trackingSteps: steps.reverse()
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat melacak pesanan' });
  }
});

// POST /api/orders/confirm-payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { orderId, senderName, amount } = req.body;
    if (!orderId || !senderName || !amount) {
      return res.status(400).json({ message: 'Mohon isi semua data konfirmasi pembayaran!' });
    }

    const db = await getDB();
    
    // Check if order exists
    const order = await db.get('SELECT * FROM orders WHERE id = ?', orderId);
    if (!order) {
      return res.status(404).json({ message: 'ID Pesanan tidak ditemukan!' });
    }

    // Save payment confirmation
    await db.run(`
      INSERT INTO payment_confirmations (order_id, sender_name, amount, status)
      VALUES (?, ?, ?, ?)
    `, orderId, senderName, amount, 'pending');

    // Update order status to verifying
    await db.run(`
      UPDATE orders 
      SET payment_status = 'verifying' 
      WHERE id = ?
    `, orderId);

    // Mock automatic completion for UX testing (e.g. mark it as verified & processing after 5 seconds)
    // In real app it would wait for admin approval, but let's simulate checking
    setTimeout(async () => {
      try {
        const updateDb = await getDB();
        await updateDb.run(`
          UPDATE orders 
          SET payment_status = 'paid', status = 'processing' 
          WHERE id = ? AND payment_status = 'verifying'
        `, orderId);
        console.log(`Mock auto-approval triggered for Order ${orderId}`);
      } catch (err) {
        console.error(err);
      }
    }, 15000); // 15 seconds delay for mock approval

    res.json({
      message: 'Bukti transfer berhasil dikirim. Pembayaran Anda sedang diverifikasi oleh Tim Keuangan kami.'
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memproses konfirmasi pembayaran' });
  }
});

module.exports = router;
