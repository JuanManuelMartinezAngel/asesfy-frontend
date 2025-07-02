'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Actividad del Asesor',
    },
  },
};

const data = {
  labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  datasets: [
    {
      label: 'Reuniones',
      data: [3, 2, 2, 1, 5],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Documentos',
      data: [2, 3, 1, 4, 2],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

export function StatisticsChart() {
  return <Bar options={options} data={data} />;
}

export default StatisticsChart; 