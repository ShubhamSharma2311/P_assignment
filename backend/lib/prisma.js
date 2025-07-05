const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.log('⚠️  Database connection failed');
    return false;
  }
}

// Initialize database with sample data
async function initializeDatabase() {
  try {
    // Check if data already exists
    const walletCount = await prisma.wallet.count();
    if (walletCount > 0) {
      console.log('✅ Database already has data');
      return true;
    }

    // Create sample wallets
    const sampleWallets = [
      { address: '7xKXtg2CW87d97ZJ6mF6QvD6kHPRbic6RB5X44Jd6SH', balance: 5000000, tokenAmount: 25000 },
      { address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', balance: 3000000, tokenAmount: 15000 },
      { address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1', balance: 2000000, tokenAmount: 10000 },
      { address: '3xNweLHLqrxNpU9ZqB1Q2vzqKqKqKqKqKqKqKqKqK', balance: 1500000, tokenAmount: 7500 },
      { address: '2xNweLHLqrxNpU9ZqB1Q2vzqKqKqKqKqKqKqKqKqK', balance: 1200000, tokenAmount: 6000 },
    ];

    // Insert wallets
    const createdWallets = [];
    for (const wallet of sampleWallets) {
      const createdWallet = await prisma.wallet.create({
        data: wallet
      });
      createdWallets.push(createdWallet);
    }

    // Create sample transactions with proper schema fields
    const sampleTransactions = [
      { 
        txSignature: 'tx_1_signature_abc123',
        walletId: createdWallets[0].id,
        direction: 'buy',
        amount: 100,
        protocol: 'Jupiter'
      },
      { 
        txSignature: 'tx_2_signature_def456',
        walletId: createdWallets[1].id,
        direction: 'sell',
        amount: 50,
        protocol: 'Raydium'
      },
      { 
        txSignature: 'tx_3_signature_ghi789',
        walletId: createdWallets[2].id,
        direction: 'buy',
        amount: 200,
        protocol: 'Orca'
      },
      { 
        txSignature: 'tx_4_signature_jkl012',
        walletId: createdWallets[0].id,
        direction: 'sell',
        amount: 75,
        protocol: 'Jupiter'
      },
      { 
        txSignature: 'tx_5_signature_mno345',
        walletId: createdWallets[3].id,
        direction: 'buy',
        amount: 150,
        protocol: 'Raydium'
      },
    ];

    // Insert transactions
    for (const tx of sampleTransactions) {
      await prisma.transaction.create({
        data: tx
      });
    }

    console.log('✅ Sample data inserted successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Database operations
async function getWallets() {
  try {
    return await prisma.wallet.findMany({
      orderBy: { tokenAmount: 'desc' },
      take: 60
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    throw error;
  }
}

async function getTransactions() {
  try {
    return await prisma.transaction.findMany({
      include: { wallet: true },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

async function getStats() {
  try {
    const [totalStats, buyStats, sellStats] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({ where: { direction: 'buy' } }),
      prisma.transaction.count({ where: { direction: 'sell' } })
    ]);

    const volumeResult = await prisma.transaction.aggregate({
      _sum: { amount: true }
    });

    return {
      total_transactions: totalStats,
      total_buys: buyStats,
      total_sells: sellStats,
      total_volume: volumeResult._sum.amount || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

async function insertTransaction(data) {
  try {
    return await prisma.transaction.create({
      data: data
    });
  } catch (error) {
    console.error('Error inserting transaction:', error);
    throw error;
  }
}

// Get protocol usage statistics
async function getProtocolStats() {
  try {
    const protocols = await prisma.transaction.groupBy({
      by: ['protocol'],
      _count: { protocol: true }
    });

    const protocolUsage = {};
    protocols.forEach(p => {
      if (p.protocol) {
        protocolUsage[p.protocol] = p._count.protocol;
      }
    });

    return protocolUsage;
  } catch (error) {
    console.error('Error fetching protocol stats:', error);
    throw error;
  }
}

module.exports = {
  prisma,
  testConnection,
  initializeDatabase,
  getWallets,
  getTransactions,
  getStats,
  insertTransaction,
  getProtocolStats
}; 