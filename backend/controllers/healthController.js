let dbConnected = false;

const setDbStatus = (status) => {
  dbConnected = status;
};

const getHealthController = (req, res) => {
  res.json({ 
    status: 'ok', 
    database: dbConnected ? 'connected' : 'mock data',
    timestamp: new Date().toISOString(),
    data_source: dbConnected ? 'postgresql' : 'realistic mock data',
    features: [
      'Real-time transaction simulation',
      'Realistic wallet addresses',
      'Market sentiment analysis',
      'Protocol usage tracking',
      'Price movement simulation',
      dbConnected ? 'Database persistence' : 'In-memory data'
    ]
  });
};

module.exports = {
  getHealthController,
  setDbStatus
}; 