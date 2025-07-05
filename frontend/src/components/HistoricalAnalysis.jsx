import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

const HistoricalAnalysis = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    direction: '',
    protocol: '',
    walletAddress: ''
  });
  const [chartType, setChartType] = useState('line');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:3001/api/transactions?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transaction data');
      setLoading(false);
    }
  };

  const exportData = async (format, dataType) => {
    try {
      setExportLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const url = `http://localhost:3001/api/export/${dataType}/${format}?${queryParams}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `tokenwise_${dataType}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!transactions.length) return null;

    const groupedData = transactions.reduce((acc, tx) => {
      const date = new Date(tx.timestamp || tx.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { buy: 0, sell: 0, transfer: 0 };
      }
      acc[date][tx.direction || tx.type] += tx.amount || 0;
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const buyData = labels.map(date => groupedData[date].buy);
    const sellData = labels.map(date => groupedData[date].sell);
    const transferData = labels.map(date => groupedData[date].transfer);

    return {
      labels,
      datasets: [
        {
          label: 'Buy',
          data: buyData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1
        },
        {
          label: 'Sell',
          data: sellData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1
        },
        {
          label: 'Transfer',
          data: transferData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        }
      ]
    };
  };

  const prepareProtocolData = () => {
    if (!transactions.length) return null;

    const protocolCounts = transactions.reduce((acc, tx) => {
      const protocol = tx.protocol || 'Unknown';
      acc[protocol] = (acc[protocol] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(protocolCounts),
      datasets: [{
        label: 'Transaction Count',
        data: Object.values(protocolCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction Volume Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const protocolOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Protocol Usage Distribution'
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">📈 Historical Analysis</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">📈 Historical Analysis</h3>
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

  const chartData = prepareChartData();
  const protocolData = prepareProtocolData();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">📈 Historical Analysis</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({...filters, toDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
          <select
            value={filters.direction}
            onChange={(e) => setFilters({...filters, direction: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
          <select
            value={filters.protocol}
            onChange={(e) => setFilters({...filters, protocol: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="Jupiter">Jupiter</option>
            <option value="Raydium">Raydium</option>
            <option value="Orca">Orca</option>
            <option value="Serum">Serum</option>
            <option value="Meteora">Meteora</option>
            <option value="Lifinity">Lifinity</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
          <input
            type="text"
            placeholder="Enter wallet address"
            value={filters.walletAddress}
            onChange={(e) => setFilters({...filters, walletAddress: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📈 Line Chart
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Bar Chart
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="h-80">
          {chartData && (
            chartType === 'line' ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )
          )}
        </div>
        <div className="h-80">
          {protocolData && <Bar data={protocolData} options={protocolOptions} />}
        </div>
      </div>

      {/* Export Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📤 Export Data</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Transactions</h5>
            <div className="flex space-x-2">
              <button
                onClick={() => exportData('csv', 'transactions')}
                disabled={exportLoading}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
              >
                {exportLoading ? 'Exporting...' : 'CSV'}
              </button>
              <button
                onClick={() => exportData('json', 'transactions')}
                disabled={exportLoading}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {exportLoading ? 'Exporting...' : 'JSON'}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Wallets</h5>
            <div className="flex space-x-2">
              <button
                onClick={() => exportData('csv', 'wallets')}
                disabled={exportLoading}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
              >
                {exportLoading ? 'Exporting...' : 'CSV'}
              </button>
              <button
                onClick={() => exportData('json', 'wallets')}
                disabled={exportLoading}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {exportLoading ? 'Exporting...' : 'JSON'}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Protocol Stats</h5>
            <div className="flex space-x-2">
              <button
                onClick={() => exportData('csv', 'protocols')}
                disabled={exportLoading}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
              >
                {exportLoading ? 'Exporting...' : 'CSV'}
              </button>
              <button
                onClick={() => exportData('json', 'protocols')}
                disabled={exportLoading}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {exportLoading ? 'Exporting...' : 'JSON'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{transactions.length}</div>
            <div className="text-gray-600">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter(tx => tx.direction === 'buy').length}
            </div>
            <div className="text-gray-600">Buy Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {transactions.filter(tx => tx.direction === 'sell').length}
            </div>
            <div className="text-gray-600">Sell Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(transactions.map(tx => tx.protocol)).size}
            </div>
            <div className="text-gray-600">Active Protocols</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalAnalysis; 