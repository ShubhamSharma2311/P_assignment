import React, { useState, useEffect } from 'react';

const WalletsTable = ({ wallets: propWallets }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propWallets) {
      setWallets(propWallets);
      setLoading(false);
    } else {
      fetchWallets();
      const interval = setInterval(fetchWallets, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [propWallets]);

  const fetchWallets = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/wallets');
      if (!response.ok) {
        throw new Error('Failed to fetch wallets');
      }
      const data = await response.json();
      setWallets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setError('Failed to load wallets');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">👛 Top 60 Token Holders</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Wallet Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Token Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">SOL Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(10)].map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-500">#{index + 1}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">👛 Top 60 Token Holders</h3>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchWallets}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
        <h3 className="text-xl font-semibold text-gray-800">👛 Top 60 Token Holders</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Wallet Address</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Token Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">SOL Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wallets.slice(0, 10).map((wallet, index) => (
                <tr key={wallet.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-500">
                    #{wallet.rank || (index + 1)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                      {wallet.address && wallet.address.length > 20 
                        ? `${wallet.address.substring(0, 10)}...${wallet.address.substring(wallet.address.length - 8)}`
                        : wallet.address || 'N/A'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    {parseFloat(wallet.tokenAmount || wallet.token_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    {parseFloat(wallet.balance || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {wallets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No wallets found</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing top 10 of {wallets.length} holders</span>
          <span className="text-green-600 font-medium">Live updates every minute</span>
        </div>
      </div>
    </div>
  );
};

export default WalletsTable; 