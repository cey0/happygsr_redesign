const express = require('express');
const router = express.Router();
const { getDB } = require('../database');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy } = req.query;
    const db = await getDB();

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Category Filter
    if (category && category !== 'all') {
      // Map some category synonyms if needed
      query += ' AND category = ?';
      params.push(category);
    }

    // Search Query Filter
    if (search) {
      query += ' AND (title LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Price Filters
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseInt(minPrice, 10));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseInt(maxPrice, 10));
    }

    // Sorting Logic
    if (sortBy) {
      if (sortBy === 'price-asc') {
        query += ' ORDER BY price ASC';
      } else if (sortBy === 'price-desc') {
        query += ' ORDER BY price DESC';
      } else if (sortBy === 'discount') {
        query += ' ORDER BY discount DESC';
      }
    } else {
      query += ' ORDER BY id ASC'; // Default sorting
    }

    const products = await db.all(query, params);
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil katalog produk' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const db = await getDB();
    const product = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json(product);
  } catch (error) {
    console.error('Fetch product by ID error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil detail produk' });
  }
});

module.exports = router;
