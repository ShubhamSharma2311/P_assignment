import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ProtocolUsage = () => {
  const [protocolData, setProtocolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('pie');

  useEffect(() => {
    fetchProtocolData();
    const interval = setInterval(fetchProtocolData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchProtocolData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats/protocols');
      if (!response.ok) {
        throw new Error('Failed to fetch protocol data');
      }
      const data = await response.json();
      setProtocolData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching protocol data:', error);
      setError('Failed to load protocol data');
      setLoading(false);
    }
  };

  const getProtocolColor = (protocol) => {
    const colors = {
      'Raydium': '#60A5FA',
      'Jupiter': '#A78BFA',
      'Orca': '#34D399',
      'Serum': '#FB923C',
      'Meteora': '#F59E0B',
      'Lifinity': '#EC4899',
      'Aldrin': '#8B5CF6',
      'Saber': '#06B6D4',
      'Unknown': '#6B7280'
    };
    return colors[protocol] || '#6B7280';
  };

  const prepareChartData = () => {
    if (!protocolData || !protocolData.protocols) return null;

    const protocols = Object.keys(protocolData.protocols);
    const usageCounts = Object.values(protocolData.protocols);
    const colors = protocols.map(protocol => getProtocolColor(protocol));

    return {
      labels: protocols,
      datasets: [
        {
          data: usageCounts,
          backgroundColor: colors,
          borderColor: colors.map(color => color + '80'),
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareBarData = () => {
    if (!protocolData || !protocolData.protocols) return null;

    const protocols = Object.keys(protocolData.protocols);
    const usageCounts = Object.values(protocolData.protocols);

    return {
      labels: protocols,
      datasets: [
        {
          label: 'Transaction Count',
          data: usageCounts,
          backgroundColor: protocols.map(protocol => getProtocolColor(protocol)),
          borderColor: protocols.map(protocol => getProtocolColor(protocol) + '80'),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Protocol Usage by Transaction Count',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">🔗 Protocol Usage Analytics</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">🔗 Protocol Usage Analytics</h3>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchProtocolData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();
  const barData = prepareBarData();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">🔗 Protocol Usage Analytics</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveChart('pie')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'pie'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Pie Chart
          </button>
          <button
            onClick={() => setActiveChart('bar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'bar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📈 Bar Chart
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80">
        {activeChart === 'pie' && chartData && (
          <Pie data={chartData} options={chartOptions} />
        )}
        {activeChart === 'bar' && barData && (
          <Bar data={barData} options={barOptions} />
        )}
      </div>

      {/* Protocol Stats */}
      {protocolData && protocolData.protocols && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(protocolData.protocols).map(([protocol, count]) => (
            <div key={protocol} className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{protocol}</span>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(count / Math.max(...Object.values(protocolData.protocols))) * 100}%`,
                      backgroundColor: getProtocolColor(protocol),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {protocolData && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {protocolData.totalTransactions || 0}
              </div>
              <div className="text-gray-600">Total Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {protocolData.uniqueProtocols || Object.keys(protocolData.protocols || {}).length}
              </div>
              <div className="text-gray-600">Active Protocols</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {protocolData.topProtocol || 'N/A'}
              </div>
              <div className="text-gray-600">Most Popular</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolUsage; 