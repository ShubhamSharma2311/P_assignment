import React, { useState, useEffect } from 'react';

const TokenHolderStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/token-holders/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching token holder status:', error);
    }
  };

  const triggerUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch('http://localhost:3001/api/token-holders/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 'updating') {
        // Poll for status updates
        const pollInterval = setInterval(async () => {
          const statusResponse = await fetch('http://localhost:3001/api/token-holders/status');
          const statusData = await statusResponse.json();
          
          if (!statusData.isUpdating) {
            clearInterval(pollInterval);
            setUpdating(false);
            fetchStatus();
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error triggering update:', error);
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'in_progress':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'in_progress':
        return '🔄';
      default:
        return '❓';
    }
  };

  if (!status) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">🔄 Token Holder Updates</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">🔄 Token Holder Updates</h3>
        <button
          onClick={triggerUpdate}
          disabled={updating}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            updating
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
          }`}
        >
          {updating ? '🔄 Updating...' : '🔄 Update Now'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Total Holders</span>
              <span className="text-2xl font-bold text-blue-900">{status.totalHolders}</span>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Update Interval</span>
              <span className="text-lg font-semibold text-green-900">{status.updateInterval}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Last Updated</span>
            <span className={`text-sm font-semibold ${getStatusColor(status.lastStatus)}`}>
              {getStatusIcon(status.lastStatus)} {status.lastStatus || 'unknown'}
            </span>
          </div>
          <p className="text-sm text-gray-600">{formatDate(status.lastUpdated)}</p>
          {status.lastError && (
            <p className="text-sm text-red-600 mt-2">Error: {status.lastError}</p>
          )}
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-700">Token Address</span>
            <span className="text-xs font-mono text-purple-900 bg-purple-100 px-2 py-1 rounded">
              {status.tokenAddress?.substring(0, 8)}...{status.tokenAddress?.substring(status.tokenAddress.length - 8)}
            </span>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-700">Update Status</span>
            <span className={`text-sm font-semibold ${getStatusColor(status.isUpdating ? 'in_progress' : status.lastStatus)}`}>
              {status.isUpdating ? '🔄 In Progress' : getStatusIcon(status.lastStatus) + ' ' + (status.lastStatus || 'Unknown')}
            </span>
          </div>
        </div>
      </div>

      {status.isUpdating && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-orange-700">Token holder data is being updated from blockchain...</span>
          </div>
        </div>
      )}

      {status.lastStatus === 'failed' && status.lastError && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-red-700">❌ Last update failed: {status.lastError}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenHolderStatus; 