import React from 'react';

const WalletsTable = ({ wallets }) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Wallet Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Balance (SOL)</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Token Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {wallets.map((wallet, index) => (
              <tr key={wallet.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm font-semibold text-gray-500">#{index + 1}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                    {wallet.address.length > 20 
                      ? `${wallet.address.substring(0, 10)}...${wallet.address.substring(wallet.address.length - 8)}`
                      : wallet.address
                    }
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                  {parseFloat(wallet.balance).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                  {parseFloat(wallet.token_amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletsTable; 