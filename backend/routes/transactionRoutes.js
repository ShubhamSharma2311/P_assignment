const express = require('express');
const { 
  getTransactionsController, 
  getLiveTransactionsController, 
  getHistoricalTransactionsController,
  addTransactionController,
  setDbStatus 
} = require('../controllers/transactionController');

const router = express.Router();

// Set database status for this route group
const setTransactionDbStatus = (status) => {
  setDbStatus(status);
};

// GET /api/transactions - Get all transactions
router.get('/', getTransactionsController);

// GET /api/transactions/live - Get live transactions
router.get('/live', getLiveTransactionsController);

// GET /api/transactions/historical - Get historical transactions with filters
router.get('/historical', getHistoricalTransactionsController);

// POST /api/transactions - Add new transaction
router.post('/', addTransactionController);

module.exports = { router, setTransactionDbStatus }; 