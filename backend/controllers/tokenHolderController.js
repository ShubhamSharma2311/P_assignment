const TokenHolderService = require('../services/tokenHolderService');

let tokenHolderService = null;

const initializeTokenHolderService = (prisma) => {
  tokenHolderService = new TokenHolderService(prisma);
};

// Get token holder update status
const getUpdateStatusController = async (req, res) => {
  try {
    if (!tokenHolderService) {
      return res.status(500).json({ error: 'Token holder service not initialized' });
    }

    const status = await tokenHolderService.getUpdateStatus();
    res.json({
      ...status,
      tokenAddress: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
      updateInterval: '30 minutes'
    });
  } catch (error) {
    console.error('Error getting update status:', error);
    res.status(500).json({ error: 'Failed to get update status' });
  }
};

// Manually trigger token holder update
const triggerUpdateController = async (req, res) => {
  try {
    if (!tokenHolderService) {
      return res.status(500).json({ error: 'Token holder service not initialized' });
    }

    console.log('🔄 Manual token holder update triggered');
    
    // Start update in background
    tokenHolderService.updateTokenHolders().then(() => {
      console.log('✅ Manual update completed');
    }).catch(error => {
      console.error('❌ Manual update failed:', error);
    });

    res.json({ 
      message: 'Token holder update triggered',
      status: 'updating'
    });
  } catch (error) {
    console.error('Error triggering update:', error);
    res.status(500).json({ error: 'Failed to trigger update' });
  }
};

// Get token holder statistics
const getTokenHolderStatsController = async (req, res) => {
  try {
    if (!tokenHolderService) {
      return res.status(500).json({ error: 'Token holder service not initialized' });
    }

    const status = await tokenHolderService.getUpdateStatus();
    
    // Calculate additional statistics
    const totalTokens = status.totalHolders > 0 ? '50,000,000' : '0'; // Example total supply
    const top10Percentage = '85%'; // Example: top 10 holders own 85%
    const whaleThreshold = '1,000,000'; // Tokens needed to be considered a whale
    
    res.json({
      totalHolders: status.totalHolders,
      lastUpdated: status.lastUpdated,
      isUpdating: status.isUpdating,
      totalTokens,
      top10Percentage,
      whaleThreshold,
      tokenAddress: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
      updateInterval: '30 minutes'
    });
  } catch (error) {
    console.error('Error getting token holder stats:', error);
    res.status(500).json({ error: 'Failed to get token holder stats' });
  }
};

module.exports = {
  initializeTokenHolderService,
  getUpdateStatusController,
  triggerUpdateController,
  getTokenHolderStatsController
}; 