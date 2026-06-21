const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'happygsr.db');

let db = null;

async function getDB() {
  if (db) return db;
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  return db;
}

async function initDB() {
  const database = await getDB();

  // Create tables
  await database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER,
      discount INTEGER DEFAULT 0,
      image TEXT,
      badge TEXT,
      stock TEXT DEFAULT 'available'
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      token_balance INTEGER DEFAULT 0,
      referral_code TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      courier TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      total_amount INTEGER NOT NULL,
      discount_amount INTEGER DEFAULT 0,
      payment_status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    CREATE TABLE IF NOT EXISTS payment_confirmations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id)
    );

    CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // Seed standard products if none exist
  const productsCount = await database.get('SELECT COUNT(*) as count FROM products');
  if (productsCount.count === 0) {
    const productsData = [
      {
        id: "H32",
        title: "Laptop HP H32 Intel Core 4GB/SSD Layar 12″ Chrome OS Playstore",
        category: "laptop-grosir",
        price: 1799045,
        original_price: 2158854,
        discount: 17,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300",
        badge: "Paling Laris",
        stock: "available"
      },
      {
        id: "D24",
        title: "Laptop DELL D24 4GB/SSD Layar 12″ Chrome OS Playstore",
        category: "laptop-grosir",
        price: 1799045,
        original_price: 2158854,
        discount: 17,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=300",
        badge: "Edisi Terbatas",
        stock: "available"
      },
      {
        id: "D25",
        title: "Laptop DELL Latitude D25 Flip 2in1 TouchScreen Intel 4GB/SSD",
        category: "laptop-grosir",
        price: 1699045,
        original_price: 2038854,
        discount: 17,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=300",
        badge: "Paling Laris",
        stock: "available"
      },
      {
        id: "L23",
        title: "Laptop Lenovo ThinkPad L23 Intel Core i5 Gen 7 RAM 8GB SSD 256GB 14″",
        category: "laptop-grosir",
        price: 4249045,
        original_price: 6586020,
        discount: 35,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=300",
        badge: "Edisi Terbatas",
        stock: "available"
      },
      {
        id: "D20",
        title: "Laptop Dell Latitude D20 Intel Core i5 Gen 6 RAM 8GB SSD 256GB 14″",
        category: "laptop-grosir",
        price: 4049045,
        original_price: 6276020,
        discount: 35,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=300",
        badge: "Edisi Terbatas",
        stock: "available"
      },
      {
        id: "DST-A14",
        title: "Laptop DST A14 Intel Celeron N4020 RAM 6GB SSD 128GB 14″ Windows 11",
        category: "laptop-new",
        price: 3949045,
        original_price: 3949045,
        discount: 0,
        image: "https://images.unsplash.com/photo-1496181130204-7552cc1574e9?q=80&w=300",
        badge: "Baru",
        stock: "available"
      },
      {
        id: "CCTV-4CH",
        title: "Paket CCTV Hikvision 4 Channel HD 2MP Lengkap Pemasangan",
        category: "cctv",
        price: 2850000,
        original_price: 3500000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=300",
        badge: "Promo",
        stock: "available"
      },
      {
        id: "WEB-SHOP",
        title: "Jasa Pembuatan Website Online Shop Terintegrasi POS & Payment Gateway",
        category: "website",
        price: 4500000,
        original_price: 6000000,
        discount: 25,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300",
        badge: "Terlaris",
        stock: "available"
      },
      {
        id: "PROP-APT",
        title: "GSR Property Investment - Apartemen Daan Mogot Jakarta Barat Under Developer",
        category: "property",
        price: 450000000,
        original_price: 520000000,
        discount: 13,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=300",
        badge: "Investasi Cerdas",
        stock: "available"
      }
    ];

    const stmt = await database.prepare(`
      INSERT INTO products (id, title, category, price, original_price, discount, image, badge, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const prod of productsData) {
      await stmt.run(
        prod.id,
        prod.title,
        prod.category,
        prod.price,
        prod.original_price,
        prod.discount,
        prod.image,
        prod.badge,
        prod.stock
      );
    }
    await stmt.finalize();
    console.log('Database seeded with standard products.');
  }

  // Seed default test user if users table is empty
  const usersCount = await database.get('SELECT COUNT(*) as count FROM users');
  if (usersCount.count === 0) {
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    // Seed standard test member
    await database.run(`
      INSERT INTO users (name, email, phone, password, role, token_balance, referral_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, 
      'Budi Prasetyo', 
      'member@happygsr.com', 
      '082240299789', 
      hashedPassword, 
      'member', 
      150, 
      'GSR-BUDI-88'
    );

    // Seed mock commissions for this test user
    const user = await database.get('SELECT id FROM users WHERE email = ?', 'member@happygsr.com');
    if (user) {
      await database.run(`
        INSERT INTO commissions (user_id, amount, description, status)
        VALUES (?, ?, ?, ?)
      `, user.id, 350000, 'Komisi Penjualan Laptop Lenovo L23 (Mitra)', 'paid');
      
      await database.run(`
        INSERT INTO commissions (user_id, amount, description, status)
        VALUES (?, ?, ?, ?)
      `, user.id, 175000, 'Komisi Penjualan Laptop HP H32 (Referral)', 'pending');
    }

    console.log('Database seeded with test user: member@happygsr.com / password123');
  }
}

module.exports = {
  getDB,
  initDB
};
