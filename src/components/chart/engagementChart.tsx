import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement);

interface AggregatedLineChartProps {
  data: number[];
  data2: number[]; // Second data set
  totalVideoLength: number; // Total video length in seconds
  interval?: number; // Time interval for aggregation (default is 1 second)
}

const EngagementChart: React.FC<AggregatedLineChartProps> = ({
  data,
  data2,
  totalVideoLength,
  interval = 1, // Aggregate per 1 second by default
}) => {
  // Function to aggregate data by averaging over the given time interval
  const aggregateData = (data: number[], interval: number) => {
    const aggregated: number[] = [];
    const chunkSize = Math.floor((data.length / totalVideoLength) * interval);

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const average = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
      aggregated.push(average);
    }

    return aggregated;
  };

  // Calculate aggregated data for both datasets
  const aggregatedData = aggregateData(data, interval);
  const aggregatedData2 = aggregateData(data2, interval);

  // Generate time labels based on the aggregation interval
  const labels = aggregatedData.map((_, index) => (index * interval).toFixed(2) + 's');

  // Chart data including both datasets
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Voice clarity',
        data: aggregatedData,
        fill: false,
        borderColor: '#4A90E2',
        backgroundColor: '#4A90E2',
        tension: 0.4, // Makes the line smooth
      },
      {
        label: 'Body language',
        data: aggregatedData2,
        fill: false,
        borderColor: '#E24A4A',
        backgroundColor: '#E24A4A',
        tension: 0.4, // Makes the line smooth
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (s)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const, // Must be a specific string literal
      },
    },
  };

  return (
    <div className="relative w-full aspect-w-1 aspect-h-1">
      <Line data={chartData} options={options} className="w-full h-full" />
    </div>
  );
};

export default EngagementChart;
