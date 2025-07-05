import React, { useState, useEffect } from 'react';
import StatsCards from './components/StatsCards';
import WalletsTable from './components/WalletsTable';
import TransactionsTable from './components/TransactionsTable';
import ProtocolUsage from './components/ProtocolUsage';
import HistoricalAnalysis from './components/HistoricalAnalysis';
import TokenHolderStatus from './components/TokenHolderStatus';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: '📊 Dashboard', icon: '📊' },
    { id: 'transactions', name: '💸 Transactions', icon: '💸' },
    { id: 'wallets', name: '👛 Wallets', icon: '👛' },
    { id: 'protocols', name: '🔗 Protocols', icon: '🔗' },
    { id: 'analysis', name: '📈 Analysis', icon: '📈' },
    { id: 'status', name: '🔄 Status', icon: '🔄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TokenWise</h1>
                <p className="text-sm text-gray-600">Real-time Solana Wallet Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WalletsTable />
              <TransactionsTable />
            </div>
            <ProtocolUsage />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">💸 Transaction Monitoring</h2>
              <p className="text-gray-600 mb-6">
                Monitor real-time transactions across the Solana blockchain with detailed protocol analysis and wallet tracking.
              </p>
            </div>
            <TransactionsTable />
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">👛 Top Token Holders</h2>
              <p className="text-gray-600 mb-6">
                Track the top 60 token holders with real-time balance updates and transaction history.
              </p>
            </div>
            <WalletsTable />
          </div>
        )}

        {activeTab === 'protocols' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔗 Protocol Analytics</h2>
              <p className="text-gray-600 mb-6">
                Analyze protocol usage patterns and market trends across different DEX platforms.
              </p>
            </div>
            <ProtocolUsage />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Historical Analysis</h2>
              <p className="text-gray-600 mb-6">
                Deep dive into historical transaction data with custom filters and export capabilities.
              </p>
            </div>
            <HistoricalAnalysis />
          </div>
        )}

        {activeTab === 'status' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🔄 System Status</h2>
              <p className="text-gray-600 mb-6">
                Monitor token holder update status and blockchain connection health.
              </p>
            </div>
            <TokenHolderStatus />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              TokenWise - Real-time Solana Blockchain Intelligence Platform
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Powered by Solana RPC • Built with React & Node.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
