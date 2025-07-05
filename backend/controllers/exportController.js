const ExportService = require('../services/exportService');

let exportService = null;

const initializeExportService = (prisma) => {
  exportService = new ExportService(prisma);
};

// Export transactions to CSV
const exportTransactionsCSVController = async (req, res) => {
  try {
    if (!exportService) {
      return res.status(500).json({ error: 'Export service not initialized' });
    }

    const filters = {
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      direction: req.query.direction,
      protocol: req.query.protocol,
      walletAddress: req.query.walletAddress
    };

    const csvData = await exportService.exportTransactionsToCSV(filters);
    const filename = exportService.generateFilename('transactions', 'csv', filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);

  } catch (error) {
    console.error('Error exporting transactions to CSV:', error);
    res.status(500).json({ error: 'Failed to export transactions' });
  }
};

// Export wallets to CSV
const exportWalletsCSVController = async (req, res) => {
  try {
    if (!exportService) {
      return res.status(500).json({ error: 'Export service not initialized' });
    }

    const csvData = await exportService.exportWalletsToCSV();
    const filename = exportService.generateFilename('wallets', 'csv');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);

  } catch (error) {
    console.error('Error exporting wallets to CSV:', error);
    res.status(500).json({ error: 'Failed to export wallets' });
  }
};

// Export protocol stats to CSV
const exportProtocolStatsCSVController = async (req, res) => {
  try {
    if (!exportService) {
      return res.status(500).json({ error: 'Export service not initialized' });
    }

    const filters = {
      fromDate: req.query.fromDate,
      toDate: req.query.toDate
    };

    const csvData = await exportService.exportProtocolStatsToCSV(filters);
    const filename = exportService.generateFilename('protocols', 'csv', filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);

  } catch (error) {
    console.error('Error exporting protocol stats to CSV:', error);
    res.status(500).json({ error: 'Failed to export protocol stats' });
  }
};

// Export data to JSON
const exportJSONController = async (req, res) => {
  try {
    if (!exportService) {
      return res.status(500).json({ error: 'Export service not initialized' });
    }

    const { dataType } = req.params;
    const filters = {
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      direction: req.query.direction,
      protocol: req.query.protocol,
      walletAddress: req.query.walletAddress
    };

    const jsonData = await exportService.exportToJSON(dataType, filters);
    const filename = exportService.generateFilename(dataType, 'json', filters);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(jsonData);

  } catch (error) {
    console.error('Error exporting to JSON:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
};

// Get available export options
const getExportOptionsController = async (req, res) => {
  try {
    res.json({
      availableFormats: ['csv', 'json'],
      availableDataTypes: ['transactions', 'wallets', 'protocols'],
      filters: {
        transactions: ['fromDate', 'toDate', 'direction', 'protocol', 'walletAddress'],
        wallets: [],
        protocols: ['fromDate', 'toDate']
      },
      directions: ['buy', 'sell', 'transfer'],
      protocols: ['Jupiter', 'Raydium', 'Orca', 'Serum', 'Meteora', 'Lifinity', 'Aldrin', 'Saber', 'Unknown']
    });
  } catch (error) {
    console.error('Error getting export options:', error);
    res.status(500).json({ error: 'Failed to get export options' });
  }
};

module.exports = {
  initializeExportService,
  exportTransactionsCSVController,
  exportWalletsCSVController,
  exportProtocolStatsCSVController,
  exportJSONController,
  getExportOptionsController
}; 