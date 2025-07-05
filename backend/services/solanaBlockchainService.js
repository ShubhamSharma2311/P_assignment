const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

class SolanaBlockchainService {
  constructor() {
    // Use mainnet-beta for production, or devnet for testing
    this.connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    this.tokenMint = new PublicKey('9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump');
    
    // Known protocol program IDs
    this.protocolPrograms = {
      'Jupiter': 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB',
      'Raydium': '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
      'Orca': 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
      'Serum': '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
      'Meteora': 'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
      'Lifinity': 'EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S',
      'Aldrin': 'AMM55ShdkoGRB5jVYPxWJMUxHp3z3qKjqKjqKjqKjqKjqK',
      'Saber': 'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz'
    };
  }

  // Fetch top 60 token holders from Solana blockchain
  async fetchTopTokenHolders() {
    try {
      console.log('🔍 Fetching top 60 token holders from Solana blockchain...');
      
      // Get the largest token accounts for this mint
      const largestAccounts = await this.connection.getTokenLargestAccounts(this.tokenMint);
      
      if (!largestAccounts.value || largestAccounts.value.length === 0) {
        throw new Error('No token accounts found for this mint');
      }

      const holders = [];
      const accounts = largestAccounts.value.slice(0, 60); // Get top 60

      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        
        try {
          // Get detailed account info
          const accountInfo = await this.connection.getParsedAccountInfo(account.address);
          
          if (accountInfo.value && accountInfo.value.data) {
            const parsedData = accountInfo.value.data.parsed;
            
            if (parsedData && parsedData.info) {
              const owner = parsedData.info.owner;
              const amount = account.uiAmount || 0;
              
              // Get SOL balance for this wallet
              const solBalance = await this.getSolBalance(owner);
              
              holders.push({
                address: owner,
                tokenAmount: amount,
                balance: solBalance,
                rank: i + 1,
                lastUpdated: new Date()
              });
            }
          }
        } catch (error) {
          console.warn(`Error fetching account ${account.address}:`, error.message);
          continue;
        }
      }

      console.log(`✅ Fetched ${holders.length} token holders from blockchain`);
      return holders.sort((a, b) => b.tokenAmount - a.tokenAmount);
      
    } catch (error) {
      console.error('❌ Error fetching token holders from blockchain:', error);
      throw error;
    }
  }

  // Get SOL balance for a wallet address
  async getSolBalance(walletAddress) {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.warn(`Error fetching SOL balance for ${walletAddress}:`, error.message);
      return 0;
    }
  }

  // Monitor transactions for a specific wallet
  async monitorWalletTransactions(walletAddress, limit = 10) {
    try {
      const publicKey = new PublicKey(walletAddress);
      const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit });
      
      const transactions = [];
      
      for (const sig of signatures) {
        try {
          const transaction = await this.connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          });
          
          if (transaction && transaction.meta) {
            const txData = this.parseTransaction(transaction, sig.signature);
            if (txData) {
              transactions.push(txData);
            }
          }
        } catch (error) {
          console.warn(`Error parsing transaction ${sig.signature}:`, error.message);
          continue;
        }
      }
      
      return transactions;
    } catch (error) {
      console.error(`Error monitoring wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  // Parse transaction to extract relevant data
  parseTransaction(transaction, signature) {
    try {
      const { meta, transaction: tx } = transaction;
      
      if (!meta || !tx) return null;

      // Check if this transaction involves our target token
      let involvesTargetToken = false;
      let amount = 0;
      let direction = 'transfer';
      let protocol = 'Unknown';

      // Check pre and post token balances
      if (meta.preTokenBalances && meta.postTokenBalances) {
        for (const preBalance of meta.preTokenBalances) {
          if (preBalance.mint === this.tokenMint.toString()) {
            involvesTargetToken = true;
            break;
          }
        }
      }

      if (!involvesTargetToken) return null;

      // Determine transaction direction and amount
      if (meta.preTokenBalances && meta.postTokenBalances) {
        const preBalance = meta.preTokenBalances.find(b => b.mint === this.tokenMint.toString());
        const postBalance = meta.postTokenBalances.find(b => b.mint === this.tokenMint.toString());
        
        if (preBalance && postBalance) {
          const preAmount = parseFloat(preBalance.uiTokenAmount?.uiAmount || 0);
          const postAmount = parseFloat(postBalance.uiTokenAmount?.uiAmount || 0);
          amount = Math.abs(postAmount - preAmount);
          
          if (postAmount > preAmount) {
            direction = 'buy';
          } else if (postAmount < preAmount) {
            direction = 'sell';
          }
        }
      }

      // Detect protocol used
      protocol = this.detectProtocol(tx.message.accountKeys);

      return {
        txSignature: signature,
        amount: amount,
        direction: direction,
        protocol: protocol,
        timestamp: new Date(transaction.blockTime * 1000),
        success: !meta.err
      };
      
    } catch (error) {
      console.warn('Error parsing transaction:', error);
      return null;
    }
  }

  // Detect which protocol was used based on program IDs
  detectProtocol(accountKeys) {
    const programIds = accountKeys.map(key => key.toString());
    
    for (const [protocol, programId] of Object.entries(this.protocolPrograms)) {
      if (programIds.includes(programId)) {
        return protocol;
      }
    }
    
    return 'Unknown';
  }

  // Get recent transactions for all monitored wallets
  async getRecentTransactions(walletAddresses, limit = 5) {
    const allTransactions = [];
    
    for (const address of walletAddresses.slice(0, 10)) { // Limit to top 10 wallets
      try {
        const transactions = await this.monitorWalletTransactions(address, limit);
        allTransactions.push(...transactions);
      } catch (error) {
        console.warn(`Error getting transactions for ${address}:`, error.message);
        continue;
      }
    }
    
    return allTransactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get token price (placeholder - would need price API)
  async getTokenPrice() {
    // In a real implementation, you'd fetch from a price API
    // For now, return a mock price
    return 0.001; // Mock price
  }

  // Get token metadata
  async getTokenMetadata() {
    try {
      const mintInfo = await this.connection.getParsedAccountInfo(this.tokenMint);
      return {
        mint: this.tokenMint.toString(),
        decimals: mintInfo.value?.data?.parsed?.info?.decimals || 9,
        supply: mintInfo.value?.data?.parsed?.info?.supply || 0
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return null;
    }
  }
}

module.exports = SolanaBlockchainService; 