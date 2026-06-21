require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./database');

const { router: authRouter } = require('./routes/auth');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const commissionsRouter = require('./routes/commissions');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Bind routing modules
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/commissions', commissionsRouter);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Start server and initialize DB
async function startServer() {
  try {
    // Connect and initialize SQLite
    await initDB();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

startServer();
