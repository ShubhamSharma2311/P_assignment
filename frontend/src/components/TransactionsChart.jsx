import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TransactionsChart = ({ transactions }) => {
  // Process transactions data for the chart
  const processData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const buyData = new Array(7).fill(0);
    const sellData = new Array(7).fill(0);

    transactions.forEach(tx => {
      const txDate = new Date(tx.timestamp).toISOString().split('T')[0];
      const dayIndex = last7Days.indexOf(txDate);
      
      if (dayIndex !== -1) {
        if (tx.type === 'buy') {
          buyData[dayIndex] += parseFloat(tx.amount);
        } else if (tx.type === 'sell') {
          sellData[dayIndex] += parseFloat(tx.amount);
        }
      }
    });

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Buys',
          data: buyData,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Sells',
          data: sellData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction Activity (Last 7 Days)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount'
        }
      }
    }
  };

  return (
    <div className="chart">
      <Line data={processData()} options={options} />
    </div>
  );
};

export default TransactionsChart; 