const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { getWallets, getTransactions, getStats, getProtocolStats } = require('./lib/prisma');
const { getWallets: getMockWallets, getTransactions: getMockTransactions, getStats: getMockStats } = require('./solana');

// Import routes
const { router: walletRoutes, setWalletDbStatus } = require('./routes/walletRoutes');
const { router: transactionRoutes, setTransactionDbStatus } = require('./routes/transactionRoutes');
const { router: statsRoutes, setStatsDbStatus } = require('./routes/statsRoutes');
const { router: healthRoutes, setHealthDbStatus } = require('./routes/healthRoutes');
const { router: tokenHolderRoutes } = require('./routes/tokenHolderRoutes');
const { router: exportRoutes } = require('./routes/exportRoutes');

// Import controllers
const { initializeTokenHolderService } = require('./controllers/tokenHolderController');
const { initializeExportService } = require('./controllers/exportController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const prisma = new PrismaClient();
let dbConnected = false;

// Initialize services
let tokenHolderService = null;

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    dbConnected = true;
    
    // Set database status for all route groups
    setWalletDbStatus(true);
    setTransactionDbStatus(true);
    setStatsDbStatus(true);
    setHealthDbStatus(true);
    
    // Initialize services
    initializeTokenHolderService(prisma);
    initializeExportService(prisma);
    
    // Initialize database with sample data if needed
    await initializeDatabase();
    
    // Start periodic token holder updates (every 30 minutes)
    if (tokenHolderService) {
      tokenHolderService.startPeriodicUpdates(30);
    }
    
  } catch (error) {
    console.log('⚠️  Database connection failed, using mock data');
    console.log('   To use real database, ensure PostgreSQL is running and DATABASE_URL is set');
    dbConnected = false;
    
    // Set database status for all route groups
    setWalletDbStatus(false);
    setTransactionDbStatus(false);
    setStatsDbStatus(false);
    setHealthDbStatus(false);
  }
}

// Initialize database with sample data
async function initializeDatabase() {
  try {
    // Check if we have any data
    const walletCount = await prisma.wallet.count();
    const transactionCount = await prisma.transaction.count();
    
    if (walletCount === 0) {
      console.log('📊 Initializing database with sample data...');
      
      // Generate 60 realistic token holders
      const sampleWallets = [];
      const tokenAmounts = [
        5000000, 4500000, 4000000, 3500000, 3200000,  // Top 5
        3000000, 2800000, 2600000, 2400000, 2200000,  // 6-10
        2000000, 1800000, 1600000, 1500000, 1400000,  // 11-15
        1300000, 1200000, 1100000, 1000000, 950000,   // 16-20
        900000, 850000, 800000, 750000, 700000,       // 21-25
        650000, 600000, 550000, 500000, 480000,       // 26-30
        460000, 440000, 420000, 400000, 380000,       // 31-35
        360000, 340000, 320000, 300000, 280000,       // 36-40
        260000, 240000, 220000, 200000, 180000,       // 41-45
        160000, 140000, 120000, 100000, 90000,        // 46-50
        80000, 70000, 60000, 50000, 40000,            // 51-55
        30000, 25000, 20000, 15000, 10000             // 56-60
      ];
      
      for (let i = 0; i < 60; i++) {
        const baseTokenAmount = tokenAmounts[i];
        const variance = (Math.random() - 0.5) * 0.2; // ±10% variance
        const tokenAmount = Math.floor(baseTokenAmount * (1 + variance));
        const solBalance = Math.floor(tokenAmount * 0.001 * (0.8 + Math.random() * 0.4));
        
        // Generate realistic Solana address
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let address = '';
        for (let j = 0; j < 44; j++) {
          address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        sampleWallets.push({
          address: address,
          balance: solBalance,
          tokenAmount: tokenAmount,
          rank: i + 1
        });
      }
      
      await prisma.wallet.createMany({
        data: sampleWallets
      });
      
      console.log('✅ Sample wallets inserted');
    }
    
    if (transactionCount === 0) {
      // Get existing wallets for transaction creation
      const existingWallets = await prisma.wallet.findMany({ take: 20 });
      
      if (existingWallets.length > 0) {
        // Insert sample transactions with proper walletId and txSignature
        const sampleTransactions = [
          { 
            txSignature: 'tx_001_signature_abc123',
            walletId: existingWallets[0]?.id || 1,
            amount: 50000,
            direction: 'buy',
            protocol: 'Raydium'
          },
          { 
            txSignature: 'tx_002_signature_def456',
            walletId: existingWallets[1]?.id || 2,
            amount: 30000,
            direction: 'sell',
            protocol: 'Jupiter'
          },
          { 
            txSignature: 'tx_003_signature_ghi789',
            walletId: existingWallets[2]?.id || 3,
            amount: 75000,
            direction: 'buy',
            protocol: 'Orca'
          },
          { 
            txSignature: 'tx_004_signature_jkl012',
            walletId: existingWallets[3]?.id || 4,
            amount: 25000,
            direction: 'sell',
            protocol: 'Raydium'
          },
          { 
            txSignature: 'tx_005_signature_mno345',
            walletId: existingWallets[4]?.id || 5,
            amount: 40000,
            direction: 'buy',
            protocol: 'Jupiter'
          }
        ];
        
        await prisma.transaction.createMany({
          data: sampleTransactions
        });
        
        console.log('✅ Sample transactions inserted');
      }
    }
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Routes
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/token-holders', tokenHolderRoutes);
app.use('/api/export', exportRoutes);

// Real-time transaction simulation
let transactionInterval;

function startTransactionSimulation() {
  transactionInterval = setInterval(async () => {
    if (dbConnected) {
      try {
        // Get existing wallets for transaction simulation
        const wallets = await prisma.wallet.findMany({ take: 10 });
        if (wallets.length === 0) {
          console.log('No wallets available for transaction simulation');
          return;
        }
        
        // Simulate new transaction with valid walletId and txSignature
        const mockTransactions = getMockTransactions();
        const randomTransaction = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
        const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
        
        await prisma.transaction.create({
          data: {
            txSignature: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            walletId: randomWallet.id,
            amount: randomTransaction.amount,
            direction: randomTransaction.type, // Convert 'type' to 'direction'
            protocol: randomTransaction.protocol
          }
        });
        
        console.log(`📊 New transaction simulated: ${randomTransaction.type} ${randomTransaction.amount} via ${randomTransaction.protocol}`);
      } catch (error) {
        console.error('Error simulating transaction:', error);
      }
    }
  }, 5000); // Every 5 seconds
}

function stopTransactionSimulation() {
  if (transactionInterval) {
    clearInterval(transactionInterval);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  stopTransactionSimulation();
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 TokenWise API server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🔄 Token Holder Updates: http://localhost:${PORT}/api/token-holders/status`);
  console.log(`📤 Export Endpoints: http://localhost:${PORT}/api/export/options`);
  console.log(`🎯 Target Token: 9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump`);
  
  await testDatabaseConnection();
  startTransactionSimulation();
}); 