import React from 'react';
import StatsCards from './StatsCards';
import WalletsTable from './WalletsTable';
import TransactionsChart from './TransactionsChart';
import ProtocolChart from './ProtocolChart';

const Dashboard = ({ data }) => {
  const { wallets, transactions, stats } = data;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-3">📊 TokenWise Analytics Dashboard</h2>
        <p className="text-lg opacity-90">Real-time monitoring for token: 9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">📈 Transaction Activity</h3>
          <TransactionsChart transactions={transactions} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">🔄 Protocol Usage</h3>
          <ProtocolChart transactions={transactions} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">👛 Top 60 Token Holders</h3>
        <WalletsTable wallets={wallets} />
      </div>
    </div>
  );
};

export default Dashboard; 