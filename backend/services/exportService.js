const { Parser } = require('json2csv');

class ExportService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Export transactions to CSV
  async exportTransactionsToCSV(filters = {}) {
    try {
      const whereClause = this.buildWhereClause(filters);
      
      const transactions = await this.prisma.transaction.findMany({
        where: whereClause,
        include: {
          wallet: {
            select: {
              address: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      const csvData = transactions.map(tx => ({
        Transaction_Signature: tx.txSignature,
        Wallet_Address: tx.wallet.address,
        Amount: tx.amount,
        Direction: tx.direction,
        Protocol: tx.protocol,
        Timestamp: tx.timestamp.toISOString(),
        Created_At: tx.createdAt.toISOString()
      }));

      const parser = new Parser({
        fields: [
          'Transaction_Signature',
          'Wallet_Address', 
          'Amount',
          'Direction',
          'Protocol',
          'Timestamp',
          'Created_At'
        ]
      });

      return parser.parse(csvData);
    } catch (error) {
      console.error('Error exporting transactions to CSV:', error);
      throw error;
    }
  }

  // Export wallets to CSV
  async exportWalletsToCSV() {
    try {
      const wallets = await this.prisma.wallet.findMany({
        orderBy: {
          tokenAmount: 'desc'
        }
      });

      const csvData = wallets.map(wallet => ({
        Rank: wallet.rank || 0,
        Wallet_Address: wallet.address,
        Token_Amount: wallet.tokenAmount,
        SOL_Balance: wallet.balance,
        Last_Updated: wallet.lastUpdated.toISOString(),
        Created_At: wallet.createdAt.toISOString()
      }));

      const parser = new Parser({
        fields: [
          'Rank',
          'Wallet_Address',
          'Token_Amount', 
          'SOL_Balance',
          'Last_Updated',
          'Created_At'
        ]
      });

      return parser.parse(csvData);
    } catch (error) {
      console.error('Error exporting wallets to CSV:', error);
      throw error;
    }
  }

  // Export protocol statistics to CSV
  async exportProtocolStatsToCSV(filters = {}) {
    try {
      const whereClause = this.buildWhereClause(filters);
      
      const protocolStats = await this.prisma.transaction.groupBy({
        by: ['protocol'],
        where: whereClause,
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      });

      const csvData = protocolStats.map(stat => ({
        Protocol: stat.protocol,
        Transaction_Count: stat._count.id,
        Total_Volume: stat._sum.amount || 0
      }));

      const parser = new Parser({
        fields: [
          'Protocol',
          'Transaction_Count',
          'Total_Volume'
        ]
      });

      return parser.parse(csvData);
    } catch (error) {
      console.error('Error exporting protocol stats to CSV:', error);
      throw error;
    }
  }

  // Export data to JSON
  async exportToJSON(dataType, filters = {}) {
    try {
      switch (dataType) {
        case 'transactions':
          return await this.exportTransactionsToJSON(filters);
        case 'wallets':
          return await this.exportWalletsToJSON();
        case 'protocols':
          return await this.exportProtocolStatsToJSON(filters);
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw error;
    }
  }

  // Export transactions to JSON
  async exportTransactionsToJSON(filters = {}) {
    const whereClause = this.buildWhereClause(filters);
    
    const transactions = await this.prisma.transaction.findMany({
      where: whereClause,
      include: {
        wallet: {
          select: {
            address: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    return transactions.map(tx => ({
      txSignature: tx.txSignature,
      walletAddress: tx.wallet.address,
      amount: tx.amount,
      direction: tx.direction,
      protocol: tx.protocol,
      timestamp: tx.timestamp.toISOString(),
      createdAt: tx.createdAt.toISOString()
    }));
  }

  // Export wallets to JSON
  async exportWalletsToJSON() {
    const wallets = await this.prisma.wallet.findMany({
      orderBy: {
        tokenAmount: 'desc'
      }
    });

    return wallets.map(wallet => ({
      rank: wallet.rank,
      address: wallet.address,
      tokenAmount: wallet.tokenAmount,
      balance: wallet.balance,
      lastUpdated: wallet.lastUpdated.toISOString(),
      createdAt: wallet.createdAt.toISOString()
    }));
  }

  // Export protocol stats to JSON
  async exportProtocolStatsToJSON(filters = {}) {
    const whereClause = this.buildWhereClause(filters);
    
    const protocolStats = await this.prisma.transaction.groupBy({
      by: ['protocol'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    });

    return protocolStats.map(stat => ({
      protocol: stat.protocol,
      transactionCount: stat._count.id,
      totalVolume: stat._sum.amount || 0
    }));
  }

  // Build where clause for filters
  buildWhereClause(filters) {
    const whereClause = {};

    if (filters.fromDate) {
      whereClause.timestamp = {
        ...whereClause.timestamp,
        gte: new Date(filters.fromDate)
      };
    }

    if (filters.toDate) {
      whereClause.timestamp = {
        ...whereClause.timestamp,
        lte: new Date(filters.toDate)
      };
    }

    if (filters.direction) {
      whereClause.direction = filters.direction;
    }

    if (filters.protocol) {
      whereClause.protocol = filters.protocol;
    }

    if (filters.walletAddress) {
      whereClause.wallet = {
        address: filters.walletAddress
      };
    }

    return whereClause;
  }

  // Generate export filename
  generateFilename(dataType, format, filters = {}) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filterSuffix = filters.fromDate ? `_${filters.fromDate}_to_${filters.toDate}` : '';
    
    return `tokenwise_${dataType}_${timestamp}${filterSuffix}.${format}`;
  }
}

module.exports = ExportService; 