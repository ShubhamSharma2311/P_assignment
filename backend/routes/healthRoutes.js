const express = require('express');
const { getHealthController, setDbStatus } = require('../controllers/healthController');

const router = express.Router();

// Set database status for this route group
const setHealthDbStatus = (status) => {
  setDbStatus(status);
};

// GET /api/health - Get system health status
router.get('/', getHealthController);

module.exports = { router, setHealthDbStatus }; 