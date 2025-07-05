import React, { useState, useEffect } from 'react';

const StatsCards = ({ stats: propStats }) => {
  const [stats, setStats] = useState({
    total_transactions: 0,
    total_buys: 0,
    total_sells: 0,
    total_volume: 0,
    price_direction: 'up',
    price_change: '0.00',
    market_sentiment: 'bullish'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propStats) {
      setStats(propStats);
      setLoading(false);
    } else {
      fetchStats();
      const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [propStats]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load stats');
      setLoading(false);
    }
  };

  const { 
    total_transactions = 0, 
    total_buys = 0, 
    total_sells = 0,
    total_volume = 0,
    price_direction = 'up',
    price_change = '0.00',
    market_sentiment = 'bullish'
  } = stats;

  const netDirection = total_buys > total_sells ? 'Buy-Heavy' : 'Sell-Heavy';
  const netDirectionColor = total_buys > total_sells ? 'text-green-500' : 'text-red-500';
  const sentimentColor = market_sentiment === 'bullish' ? 'text-green-500' : 'text-red-500';
  const priceColor = price_direction === 'up' ? 'text-green-500' : 'text-red-500';

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchStats}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          📊
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Transactions</h4>
          <p className="text-3xl font-bold text-gray-900">{total_transactions.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
          💰
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Volume</h4>
          <p className="text-2xl font-bold text-gray-900">${total_volume.toLocaleString()}</p>
          <p className={`text-sm font-semibold ${priceColor}`}>
            {price_direction === 'up' ? '↗' : '↘'} {price_change}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white">
          📈
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Market Sentiment</h4>
          <p className={`text-2xl font-bold ${sentimentColor}`}>
            {market_sentiment === 'bullish' ? '🐂 Bullish' : '🐻 Bearish'}
          </p>
          <p className="text-sm text-gray-600">
            {total_buys} buys vs {total_sells} sells
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white">
          🎯
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Net Direction</h4>
          <p className={`text-2xl font-bold ${netDirectionColor}`}>
            {netDirection}
          </p>
          <p className="text-sm text-gray-600">
            {total_buys + total_sells > 0 ? ((total_buys / (total_buys + total_sells)) * 100).toFixed(1) : '0'}% buy ratio
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards; 