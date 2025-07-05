import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [data, setData] = useState({
    wallets: [],
    transactions: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [walletsRes, transactionsRes, statsRes] = await Promise.all([
        fetch('http://localhost:3001/api/wallets'),
        fetch('http://localhost:3001/api/transactions'),
        fetch('http://localhost:3001/api/stats')
      ]);

      if (!walletsRes.ok || !transactionsRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data from backend');
      }

      const wallets = await walletsRes.json();
      const transactions = await transactionsRes.json();
      const stats = await statsRes.json();

      setData({ wallets, transactions, stats });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to connect to backend. Make sure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading TokenWise Dashboard...</h2>
        <p className="text-gray-600">Connecting to Solana blockchain...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">⚠️ Connection Error</h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <button 
          onClick={fetchData} 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
        >
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">🔍 TokenWise</h1>
        <p className="text-xl opacity-90 mb-6">Real-Time Wallet Intelligence on Solana</p>
        <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full inline-block border border-white/20">
          <span className="font-mono text-sm opacity-90">Token: 9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump</span>
        </div>
      </header>
      <Dashboard data={data} />
    </div>
  );
}

export default App;
