const express = require('express');
const { 
  getStatsController, 
  getEnhancedStatsController, 
  getProtocolsController,
  setDbStatus 
} = require('../controllers/statsController');

const router = express.Router();

// Set database status for this route group
const setStatsDbStatus = (status) => {
  setDbStatus(status);
};

// GET /api/stats - Get basic stats
router.get('/', getStatsController);

// GET /api/stats/enhanced - Get enhanced stats with protocol data
router.get('/enhanced', getEnhancedStatsController);

// GET /api/stats/protocols - Get protocol usage statistics
router.get('/protocols', getProtocolsController);

module.exports = { router, setStatsDbStatus }; 