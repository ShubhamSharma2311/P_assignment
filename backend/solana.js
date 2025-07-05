const { Connection, PublicKey } = require('@solana/web3.js');

// Solana connection
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Target token address
const TOKEN_ADDRESS = '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump';

// Generate realistic wallet addresses
function generateWalletAddress() {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate realistic wallet data for top 60 token holders
function generateWallets() {
  const wallets = [];
  
  // Realistic token holder distribution (top 60 holders)
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
    
    // Calculate SOL balance based on token amount (assuming 1 SOL = 1000 tokens)
    const solBalance = Math.floor(tokenAmount * 0.001 * (0.8 + Math.random() * 0.4)); // 0.8-1.2x multiplier
    
    wallets.push({
      id: i + 1,
      address: generateWalletAddress(),
      balance: solBalance,
      token_amount: tokenAmount,
      rank: i + 1,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return wallets.sort((a, b) => b.token_amount - a.token_amount); // Sort by token amount
}

// Generate realistic transaction data
function generateTransactions() {
  const transactions = [];
  const protocols = ['Jupiter', 'Raydium', 'Orca', 'Serum', 'Meteora'];
  const types = ['buy', 'sell'];
  const wallets = generateWallets();
  
  // Generate transactions for the last 7 days
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (let day = 6; day >= 0; day--) {
    const dayStart = new Date(now.getTime() - day * oneDay);
    const transactionsPerDay = Math.floor(Math.random() * 20) + 10; // 10-30 transactions per day
    
    for (let i = 0; i < transactionsPerDay; i++) {
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const transactionTime = new Date(dayStart.getTime() + randomHour * 60 * 60 * 1000 + randomMinute * 60 * 1000);
      
      const wallet = wallets[Math.floor(Math.random() * wallets.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const amount = Math.floor(Math.random() * 1000) + 10; // $10 to $1010
      
      transactions.push({
        id: transactions.length + 1,
        transaction_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        wallet_address: wallet.address,
        type: type,
        amount: amount,
        protocol: protocol,
        timestamp: transactionTime.toISOString(),
        created_at: transactionTime.toISOString()
      });
    }
  }
  
  return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Generate real-time transaction updates
function generateRealTimeTransactions() {
  const transactions = [];
  const protocols = ['Jupiter', 'Raydium', 'Orca', 'Serum', 'Meteora'];
  const types = ['buy', 'sell'];
  const wallets = generateWallets();
  
  // Generate 5-15 new transactions
  const numTransactions = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < numTransactions; i++) {
    const wallet = wallets[Math.floor(Math.random() * wallets.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const amount = Math.floor(Math.random() * 500) + 5; // $5 to $505
    const timeOffset = Math.floor(Math.random() * 60 * 60 * 1000); // Random time in last hour
    
    transactions.push({
      id: Date.now() + i,
      transaction_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wallet_address: wallet.address,
      type: type,
      amount: amount,
      protocol: protocol,
      timestamp: new Date(Date.now() - timeOffset).toISOString(),
      created_at: new Date().toISOString()
    });
  }
  
  return transactions;
}

// Get market statistics
function getMarketStats(transactions) {
  const totalTransactions = transactions.length;
  const totalBuys = transactions.filter(tx => tx.type === 'buy').length;
  const totalSells = transactions.filter(tx => tx.type === 'sell').length;
  const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  
  // Calculate protocol usage
  const protocolUsage = {};
  transactions.forEach(tx => {
    protocolUsage[tx.protocol] = (protocolUsage[tx.protocol] || 0) + 1;
  });
  
  // Calculate price movement (simulated)
  const buyVolume = transactions
    .filter(tx => tx.type === 'buy')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  const sellVolume = transactions
    .filter(tx => tx.type === 'sell')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  
  const priceDirection = buyVolume > sellVolume ? 'up' : 'down';
  const priceChange = Math.abs(buyVolume - sellVolume) / Math.max(buyVolume, sellVolume) * 100;
  
  return {
    total_transactions: totalTransactions,
    total_buys: totalBuys,
    total_sells: totalSells,
    total_volume: totalVolume,
    protocol_usage: protocolUsage,
    price_direction: priceDirection,
    price_change: priceChange.toFixed(2),
    market_sentiment: buyVolume > sellVolume ? 'bullish' : 'bearish'
  };
}

// Simulate real-time data updates
let currentWallets = generateWallets();
let currentTransactions = generateTransactions();

// Update data every 30 seconds to simulate real-time activity
setInterval(() => {
  const newTransactions = generateRealTimeTransactions();
  currentTransactions = [...newTransactions, ...currentTransactions.slice(0, 95)]; // Keep latest 100
}, 30000);

module.exports = {
  getWallets: () => currentWallets,
  getTransactions: () => currentTransactions,
  getStats: () => getMarketStats(currentTransactions),
  generateWallets,
  generateTransactions,
  generateRealTimeTransactions,
  getMarketStats
}; 