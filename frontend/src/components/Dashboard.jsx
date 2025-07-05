import React from 'react';
import StatsCards from './StatsCards';
import WalletsTable from './WalletsTable';
import TransactionsChart from './TransactionsChart';
import ProtocolChart from './ProtocolChart';
import LiveTransactions from './LiveTransactions';
import HistoricalAnalysis from './HistoricalAnalysis';

const Dashboard = ({ data }) => {
  const { wallets, transactions, stats } = data;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-3">📊 TokenWise Analytics Dashboard</h2>
        <p className="text-lg opacity-90">Real-time monitoring for token: 9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Data</span>
          </div>
          <span className="text-sm opacity-75">•</span>
          <span className="text-sm opacity-75">Updated every 30 seconds</span>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">📈 Transaction Activity (Last 7 Days)</h3>
          <TransactionsChart transactions={transactions} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">🔄 Protocol Usage</h3>
          <ProtocolChart transactions={transactions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <LiveTransactions />
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">📊 Market Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Volume</span>
              <span className="font-bold text-gray-900">${stats.total_volume?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Price Direction</span>
              <span className={`font-bold ${stats.price_direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stats.price_direction === 'up' ? '↗ Up' : '↘ Down'} {stats.price_change}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Market Sentiment</span>
              <span className={`font-bold ${stats.market_sentiment === 'bullish' ? 'text-green-600' : 'text-red-600'}`}>
                {stats.market_sentiment === 'bullish' ? '🐂 Bullish' : '🐻 Bearish'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Buy/Sell Ratio</span>
              <span className="font-bold text-gray-900">
                {stats.total_buys}:{stats.total_sells}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Analysis Section */}
      <div className="mb-10">
        <HistoricalAnalysis />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">👛 Top 60 Token Holders</h3>
        <WalletsTable wallets={wallets} />
      </div>
    </div>
  );
};

export default Dashboard; 