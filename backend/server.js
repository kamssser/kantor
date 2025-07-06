const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection dengan kredensial hosting Anda
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'karnssset_hfmedia',
  password: process.env.DB_PASSWORD || 'i=#6[T57v)4]RgRk',
  database: process.env.DB_NAME || 'karnssset_hfmedia',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully to:', dbConfig.database);
    console.log('✅ Host:', dbConfig.host);
    console.log('✅ User:', dbConfig.user);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('❌ Config:', { host: dbConfig.host, user: dbConfig.user, database: dbConfig.database });
  }
}

// Routes

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [userStats] = await pool.execute('SELECT COUNT(*) as totalUsers FROM users');
    const [activeUserStats] = await pool.execute('SELECT COUNT(*) as activeUsers FROM users WHERE status = "active"');
    const [revenueStats] = await pool.execute('SELECT SUM(amount) as totalRevenue FROM orders WHERE status = "completed"');
    
    res.json({
      totalUsers: userStats[0].totalUsers,
      activeUsers: activeUserStats[0].activeUsers,
      totalRevenue: revenueStats[0].totalRevenue || 0,
      monthlyGrowth: 12.5 // This would be calculated based on actual data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users CRUD
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, role, status, created_at as createdAt, last_login as lastLogin FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, role, status, created_at as createdAt, last_login as lastLogin FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, role, status, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, role || 'user', status || 'active', '$2b$10$defaulthash']
    );
    
    const [newUser] = await pool.execute('SELECT id, name, email, role, status, created_at as createdAt FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(newUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    await pool.execute(
      'UPDATE users SET name = ?, email = ?, role = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, role, status, req.params.id]
    );
    
    const [updatedUser] = await pool.execute('SELECT id, name, email, role, status, created_at as createdAt, last_login as lastLogin FROM users WHERE id = ?', [req.params.id]);
    res.json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products CRUD
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, stock, status, description } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO products (name, category, price, stock, status, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, price, stock || 0, status || 'active', description]
    );
    
    const [newProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(newProduct[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, category, price, stock, status, description } = req.body;
    await pool.execute(
      'UPDATE products SET name = ?, category = ?, price = ?, stock = ?, status = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, category, price, stock, status, description, req.params.id]
    );
    
    const [updatedProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(updatedProduct[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders CRUD
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, customer_name as customer, customer_email, amount, status, items_count as items, created_at as date FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, customer_name as customer, customer_email, amount, status, items_count as items, created_at as date FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer, customer_email, amount, status, items } = req.body;
    const orderId = `ORD-${Date.now()}`;
    
    await pool.execute(
      'INSERT INTO orders (id, customer_name, customer_email, amount, status, items_count) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, customer, customer_email, amount, status || 'pending', items || 1]
    );
    
    const [newOrder] = await pool.execute('SELECT id, customer_name as customer, customer_email, amount, status, items_count as items, created_at as date FROM orders WHERE id = ?', [orderId]);
    res.status(201).json(newOrder[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { customer, customer_email, amount, status, items } = req.body;
    await pool.execute(
      'UPDATE orders SET customer_name = ?, customer_email = ?, amount = ?, status = ?, items_count = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [customer, customer_email, amount, status, items, req.params.id]
    );
    
    const [updatedOrder] = await pool.execute('SELECT id, customer_name as customer, customer_email, amount, status, items_count as items, created_at as date FROM orders WHERE id = ?', [req.params.id]);
    res.json(updatedOrder[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbConfig.database,
    host: dbConfig.host
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  testConnection();
});