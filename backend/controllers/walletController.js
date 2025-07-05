const { getWallets } = require('../lib/prisma');
const { getWallets: getMockWallets } = require('../solana');

let dbConnected = false;

const setDbStatus = (status) => {
  dbConnected = status;
};

const getWalletsController = async (req, res) => {
  try {
    if (dbConnected) {
      const wallets = await getWallets();
      res.json(wallets);
    } else {
      // Return realistic mock data
      res.json(getMockWallets());
    }
  } catch (error) {
    console.error('Error fetching wallets:', error);
    // Return realistic mock data on error
    res.json(getMockWallets());
  }
};

module.exports = {
  getWalletsController,
  setDbStatus
}; 