const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { Connection, PublicKey } = require('@solana/web3.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection with error handling
let pool;
try {
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tokenwise',
    password: 'password', // Change this to your PostgreSQL password
    port: 5432,
  });
} catch (error) {
  console.error('Database connection error:', error.message);
}

// Solana connection
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Mock data for demonstration (when database is not available)
const mockWallets = [
  { id: 1, address: 'wallet_1', balance: 1000000, token_amount: 5000 },
  { id: 2, address: 'wallet_2', balance: 950000, token_amount: 4800 },
  { id: 3, address: 'wallet_3', balance: 900000, token_amount: 4500 },
  { id: 4, address: 'wallet_4', balance: 850000, token_amount: 4200 },
  { id: 5, address: 'wallet_5', balance: 800000, token_amount: 4000 },
];

const mockTransactions = [
  { id: 1, transaction_id: 'tx_1', wallet_address: 'wallet_1', type: 'buy', amount: 100, protocol: 'Jupiter', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, transaction_id: 'tx_2', wallet_address: 'wallet_2', type: 'sell', amount: 50, protocol: 'Raydium', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, transaction_id: 'tx_3', wallet_address: 'wallet_3', type: 'buy', amount: 200, protocol: 'Orca', timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: 4, transaction_id: 'tx_4', wallet_address: 'wallet_1', type: 'sell', amount: 75, protocol: 'Jupiter', timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: 5, transaction_id: 'tx_5', wallet_address: 'wallet_4', type: 'buy', amount: 150, protocol: 'Raydium', timestamp: new Date(Date.now() - 18000000).toISOString() },
];

const mockStats = {
  total_transactions: 5,
  total_buys: 3,
  total_sells: 2
};

// Routes
app.get('/api/wallets', async (req, res) => {
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM wallets ORDER BY balance DESC LIMIT 60');
      res.json(result.rows);
    } else {
      // Return mock data if database is not available
      res.json(mockWallets);
    }
  } catch (error) {
    console.error('Error fetching wallets:', error);
    // Return mock data on error
    res.json(mockWallets);
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 100');
      res.json(result.rows);
    } else {
      // Return mock data if database is not available
      res.json(mockTransactions);
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    // Return mock data on error
    res.json(mockTransactions);
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    if (pool) {
      const stats = await pool.query(`
        SELECT 
          COUNT(*) as total_transactions,
          COUNT(CASE WHEN type = 'buy' THEN 1 END) as total_buys,
          COUNT(CASE WHEN type = 'sell' THEN 1 END) as total_sells
        FROM transactions
      `);
      res.json(stats.rows[0]);
    } else {
      // Return mock data if database is not available
      res.json(mockStats);
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return mock data on error
    res.json(mockStats);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: pool ? 'connected' : 'mock data',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard available at: http://localhost:5173`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
  if (!pool) {
    console.log(`⚠️  Using mock data - Database not connected`);
    console.log(`💡 To use real database, create 'tokenwise' database and run schema.sql`);
  }
}); 