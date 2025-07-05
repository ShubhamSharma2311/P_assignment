const express = require('express');
const { 
  exportTransactionsCSVController,
  exportWalletsCSVController,
  exportProtocolStatsCSVController,
  exportJSONController,
  getExportOptionsController
} = require('../controllers/exportController');

const router = express.Router();

// GET /api/export/options - Get available export options
router.get('/options', getExportOptionsController);

// GET /api/export/transactions/csv - Export transactions to CSV
router.get('/transactions/csv', exportTransactionsCSVController);

// GET /api/export/wallets/csv - Export wallets to CSV
router.get('/wallets/csv', exportWalletsCSVController);

// GET /api/export/protocols/csv - Export protocol stats to CSV
router.get('/protocols/csv', exportProtocolStatsCSVController);

// GET /api/export/:dataType/json - Export data to JSON
router.get('/:dataType/json', exportJSONController);

module.exports = { router }; 