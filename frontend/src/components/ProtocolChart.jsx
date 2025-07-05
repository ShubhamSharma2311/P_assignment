import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProtocolChart = ({ transactions }) => {
  const processData = () => {
    const protocolCounts = {};
    
    transactions.forEach(tx => {
      if (tx.protocol) {
        protocolCounts[tx.protocol] = (protocolCounts[tx.protocol] || 0) + 1;
      }
    });

    const labels = Object.keys(protocolCounts);
    const data = Object.values(protocolCounts);
    
    const colors = [
      '#3b82f6', // Blue
      '#ef4444', // Red
      '#22c55e', // Green
      '#f59e0b', // Yellow
      '#8b5cf6', // Purple
      '#06b6d4', // Cyan
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color + '80'),
          borderWidth: 2,
        },
      ],
    };
  };

  const options = {
    responsive: true,
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

  return (
    <div className="chart">
      <Doughnut data={processData()} options={options} />
    </div>
  );
};

export default ProtocolChart; 