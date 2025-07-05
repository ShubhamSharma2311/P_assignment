const { getTransactions, insertTransaction } = require('../lib/prisma');
const { getTransactions: getMockTransactions } = require('../solana');
const { prisma } = require('../lib/prisma');

let dbConnected = false;

const setDbStatus = (status) => {
  dbConnected = status;
};

const getTransactionsController = async (req, res) => {
  try {
    if (dbConnected) {
      const transactions = await getTransactions();
      res.json(transactions);
    } else {
      // Return realistic mock data
      res.json(getMockTransactions());
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    // Return realistic mock data on error
    res.json(getMockTransactions());
  }
};

const getLiveTransactionsController = async (req, res) => {
  try {
    if (dbConnected) {
      const transactions = await getTransactions();
      const recentTransactions = transactions.slice(0, 10);
      
      res.json({
        transactions: recentTransactions,
        count: recentTransactions.length,
        timestamp: new Date().toISOString()
      });
    } else {
      const transactions = getMockTransactions();
      const recentTransactions = transactions.slice(0, 10);
      
      res.json({
        transactions: recentTransactions,
        count: recentTransactions.length,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error fetching live transactions:', error);
    res.status(500).json({ error: 'Failed to fetch live transactions' });
  }
};

const getHistoricalTransactionsController = async (req, res) => {
  try {
    const { startDate, endDate, type, protocol, minAmount, maxAmount } = req.query;
    
    if (dbConnected) {
      // Build filter conditions
      const whereConditions = {};
      
      if (startDate && endDate) {
        whereConditions.timestamp = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }
      
      if (type) {
        whereConditions.direction = type; // Use 'direction' instead of 'type'
      }
      
      if (protocol) {
        whereConditions.protocol = protocol;
      }
      
      if (minAmount || maxAmount) {
        whereConditions.amount = {};
        if (minAmount) whereConditions.amount.gte = parseFloat(minAmount);
        if (maxAmount) whereConditions.amount.lte = parseFloat(maxAmount);
      }
      
      const transactions = await prisma.transaction.findMany({
        where: whereConditions,
        include: { wallet: true },
        orderBy: { timestamp: 'desc' }
      });
      
      res.json({
        transactions,
        filters: { startDate, endDate, type, protocol, minAmount, maxAmount },
        count: transactions.length,
        timestamp: new Date().toISOString()
      });
    } else {
      // Filter mock data based on parameters
      let transactions = getMockTransactions();
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        transactions = transactions.filter(tx => {
          const txDate = new Date(tx.timestamp);
          return txDate >= start && txDate <= end;
        });
      }
      
      if (type) {
        transactions = transactions.filter(tx => tx.type === type);
      }
      
      if (protocol) {
        transactions = transactions.filter(tx => tx.protocol === protocol);
      }
      
      if (minAmount) {
        transactions = transactions.filter(tx => parseFloat(tx.amount) >= parseFloat(minAmount));
      }
      
      if (maxAmount) {
        transactions = transactions.filter(tx => parseFloat(tx.amount) <= parseFloat(maxAmount));
      }
      
      res.json({
        transactions,
        filters: { startDate, endDate, type, protocol, minAmount, maxAmount },
        count: transactions.length,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error fetching historical transactions:', error);
    res.status(500).json({ error: 'Failed to fetch historical transactions' });
  }
};

const addTransactionController = async (req, res) => {
  try {
    if (dbConnected) {
      const { transactionId, walletAddress, type, amount, protocol } = req.body;
      
      // Get wallet ID from address
      const wallet = await prisma.wallet.findFirst({
        where: { address: walletAddress }
      });
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet not found' });
      }
      
      const newTransaction = await insertTransaction({
        txSignature: transactionId, // Use txSignature instead of transactionId
        walletId: wallet.id, // Use walletId instead of walletAddress
        direction: type, // Use direction instead of type
        amount: parseFloat(amount),
        protocol
      });
      
      res.json(newTransaction);
    } else {
      res.status(400).json({ error: 'Database not connected' });
    }
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

module.exports = {
  getTransactionsController,
  getLiveTransactionsController,
  getHistoricalTransactionsController,
  addTransactionController,
  setDbStatus
}; 