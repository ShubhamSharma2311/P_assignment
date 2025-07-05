import React from 'react';

const StatsCards = ({ stats }) => {
  const { total_transactions = 0, total_buys = 0, total_sells = 0 } = stats;
  const netDirection = total_buys > total_sells ? 'Buy-Heavy' : 'Sell-Heavy';
  const netDirectionColor = total_buys > total_sells ? 'text-green-500' : 'text-red-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          📊
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Transactions</h4>
          <p className="text-3xl font-bold text-gray-900">{total_transactions}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          📈
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Buys</h4>
          <p className="text-3xl font-bold text-green-500">{total_buys}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          📉
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Sells</h4>
          <p className="text-3xl font-bold text-red-500">{total_sells}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          🎯
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Net Direction</h4>
          <p className={`text-3xl font-bold ${netDirectionColor}`}>
            {netDirection}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards; 