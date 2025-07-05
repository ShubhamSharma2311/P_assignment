import React, { useState, useEffect } from 'react';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions');
      setLoading(false);
    }
  };

  const getTransactionIcon = (direction) => {
    switch (direction) {
      case 'buy':
        return '🟢';
      case 'sell':
        return '🔴';
      case 'transfer':
        return '🔄';
      default:
        return '📊';
    }
  };

  const getProtocolColor = (protocol) => {
    switch (protocol) {
      case 'Raydium':
        return 'bg-blue-100 text-blue-800';
      case 'Jupiter':
        return 'bg-purple-100 text-purple-800';
      case 'Orca':
        return 'bg-green-100 text-green-800';
      case 'Serum':
        return 'bg-orange-100 text-orange-800';
      case 'Meteora':
        return 'bg-yellow-100 text-yellow-800';
      case 'Lifinity':
        return 'bg-pink-100 text-pink-800';
      case 'Aldrin':
        return 'bg-indigo-100 text-indigo-800';
      case 'Saber':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat().format(amount || 0);
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">💸 Recent Transactions</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">💸 Recent Transactions</h3>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchTransactions}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">💸 Recent Transactions</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Protocol</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Wallet</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((transaction, index) => (
              <tr 
                key={transaction.id || transaction.txSignature || index} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTransactionIcon(transaction.direction || transaction.type)}</span>
                    <span className={`font-medium capitalize ${
                      (transaction.direction || transaction.type) === 'buy' ? 'text-green-600' : 
                      (transaction.direction || transaction.type) === 'sell' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {transaction.direction || transaction.type || 'unknown'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-gray-900">
                    {formatAmount(transaction.amount)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProtocolColor(transaction.protocol)}`}>
                    {transaction.protocol || 'Unknown'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-sm text-gray-600">
                    {formatAddress(transaction.walletAddress || transaction.wallet?.address)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(transaction.timestamp || transaction.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions found</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {Math.min(transactions.length, 10)} of {transactions.length} transactions</span>
          <span className="text-green-600 font-medium">Live updates every 10s</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable; 