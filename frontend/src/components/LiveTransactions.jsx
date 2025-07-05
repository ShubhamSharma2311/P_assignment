import React, { useState, useEffect } from 'react';

const LiveTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveTransactions();
    const interval = setInterval(fetchLiveTransactions, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLiveTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/live-transactions');
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching live transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'buy' ? '🟢' : '🔴';
  };

  const getProtocolColor = (protocol) => {
    const colors = {
      'Jupiter': 'bg-blue-100 text-blue-800',
      'Raydium': 'bg-green-100 text-green-800',
      'Orca': 'bg-purple-100 text-purple-800',
      'Serum': 'bg-orange-100 text-orange-800',
      'Meteora': 'bg-pink-100 text-pink-800'
    };
    return colors[protocol] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">⚡ Live Transactions</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">⚡ Live Transactions</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((tx, index) => (
          <div key={tx.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">{getTransactionIcon(tx.type)}</span>
              <div>
                <p className="font-medium text-gray-900">
                  {tx.wallet_address.substring(0, 8)}...{tx.wallet_address.substring(tx.wallet_address.length - 6)}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-bold ${tx.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                ${parseFloat(tx.amount).toLocaleString()}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${getProtocolColor(tx.protocol)}`}>
                {tx.protocol}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default LiveTransactions; 