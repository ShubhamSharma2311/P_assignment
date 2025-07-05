const express = require('express');
const { getWalletsController, setDbStatus } = require('../controllers/walletController');

const router = express.Router();

// Set database status for this route group
const setWalletDbStatus = (status) => {
  setDbStatus(status);
};

// GET /api/wallets - Get all wallets
router.get('/', getWalletsController);

module.exports = { router, setWalletDbStatus }; 