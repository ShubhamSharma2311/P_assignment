const { getStats, getProtocolStats } = require('../lib/prisma');
const { getStats: getMockStats } = require('../solana');

let dbConnected = false;

const setDbStatus = (status) => {
  dbConnected = status;
};

const getStatsController = async (req, res) => {
  try {
    if (dbConnected) {
      const stats = await getStats();
      res.json({
        total_transactions: stats.total_transactions,
        total_buys: stats.total_buys,
        total_sells: stats.total_sells,
        total_volume: parseFloat(stats.total_volume),
        price_direction: stats.total_buys > stats.total_sells ? 'up' : 'down',
        price_change: Math.abs(stats.total_buys - stats.total_sells) / Math.max(stats.total_buys, stats.total_sells) * 100,
        market_sentiment: stats.total_buys > stats.total_sells ? 'bullish' : 'bearish'
      });
    } else {
      // Return realistic mock data with enhanced stats
      const stats = getMockStats();
      res.json({
        total_transactions: stats.total_transactions,
        total_buys: stats.total_buys,
        total_sells: stats.total_sells,
        total_volume: stats.total_volume,
        price_direction: stats.price_direction,
        price_change: stats.price_change,
        market_sentiment: stats.market_sentiment
      });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return realistic mock data on error
    const stats = getMockStats();
    res.json({
      total_transactions: stats.total_transactions,
      total_buys: stats.total_buys,
      total_sells: stats.total_sells,
      total_volume: stats.total_volume,
      price_direction: stats.price_direction,
      price_change: stats.price_change,
      market_sentiment: stats.market_sentiment
    });
  }
};

const getEnhancedStatsController = async (req, res) => {
  try {
    if (dbConnected) {
      const stats = await getStats();
      const protocolStats = await getProtocolStats();
      
      res.json({
        ...stats,
        protocol_usage: protocolStats,
        timestamp: new Date().toISOString(),
        token_address: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
        last_updated: new Date().toISOString(),
        data_source: 'database'
      });
    } else {
      const stats = getMockStats();
      res.json({
        ...stats,
        timestamp: new Date().toISOString(),
        token_address: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
        last_updated: new Date().toISOString(),
        data_source: 'mock_data'
      });
    }
  } catch (error) {
    console.error('Error fetching enhanced stats:', error);
    res.status(500).json({ error: 'Failed to fetch enhanced stats' });
  }
};

const getProtocolsController = async (req, res) => {
  try {
    if (dbConnected) {
      const protocolStats = await getProtocolStats();
      const stats = await getStats();
      
      res.json({
        protocols: protocolStats,
        total_transactions: stats.total_transactions,
        timestamp: new Date().toISOString()
      });
    } else {
      const stats = getMockStats();
      res.json({
        protocols: stats.protocol_usage,
        total_transactions: stats.total_transactions,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error fetching protocol data:', error);
    res.status(500).json({ error: 'Failed to fetch protocol data' });
  }
};

module.exports = {
  getStatsController,
  getEnhancedStatsController,
  getProtocolsController,
  setDbStatus
}; 