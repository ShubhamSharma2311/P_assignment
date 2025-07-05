const express = require('express');
const { 
  getUpdateStatusController, 
  triggerUpdateController, 
  getTokenHolderStatsController 
} = require('../controllers/tokenHolderController');

const router = express.Router();

// GET /api/token-holders/status - Get update status
router.get('/status', getUpdateStatusController);

// POST /api/token-holders/update - Manually trigger update
router.post('/update', triggerUpdateController);

// GET /api/token-holders/stats - Get token holder statistics
router.get('/stats', getTokenHolderStatsController);

module.exports = { router }; 