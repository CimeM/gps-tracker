import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Route, formatDistance } from '../../utils/gpxParser';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RouteMetricsChartProps {
  route: Route;
}

const RouteMetricsChart: React.FC<RouteMetricsChartProps> = ({ route }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Prepare data for chart
  const chartData = useMemo(() => {
    const allPoints = route.segments.flatMap(segment => segment.points);
    
    // Reduce data points for better performance
    const sampleFactor = Math.max(1, Math.floor(allPoints.length / 100));
    const sampledPoints = allPoints.filter((_, i) => i % sampleFactor === 0);
    
    // Calculate distances for each sampled point
    let cumulativeDistance = 0;
    const distances: number[] = [];
    const speeds: number[] = [];
    const heartRates: number[] = [];

    sampledPoints.forEach((point, index) => {
      if (index > 0) {
        const prevPoint = sampledPoints[index - 1];
        const lat1 = prevPoint.position.lat;
        const lon1 = prevPoint.position.lon;
        const lat2 = point.position.lat;
        const lon2 = point.position.lon;
        
        // Calculate distance between points
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;
        
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c; // Distance in meters
        
        cumulativeDistance += d;
      }
      
      distances.push(cumulativeDistance);
      
      // Add speed data (convert to km/h for better visualization)
      speeds.push(point.speed ? point.speed * 3.6 : 0); 
      
      // Add heart rate data if available
      heartRates.push(point.heartRate || 0);
    });

    return {
      labels: distances.map(d => formatDistance(d)),
      datasets: [
        {
          label: 'Speed (km/h)',
          data: speeds,
          borderColor: '#0F7BFF',
          backgroundColor: '#0F7BFF',
          borderWidth: 2,
          yAxisID: 'y',
          tension: 0.3,
          pointRadius: 0,
        },
        {
          label: 'Heart Rate (bpm)',
          data: heartRates.some(hr => hr > 0) ? heartRates : [],
          borderColor: '#F97316',
          backgroundColor: '#F97316',
          borderWidth: 2,
          yAxisID: 'y1',
          tension: 0.3,
          pointRadius: 0,
          hidden: !heartRates.some(hr => hr > 0),
        }
      ]
    };
  }, [route]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Distance',
          color: isDark ? '#9CA3AF' : '#6B7280',
        },
        ticks: {
          maxTicksLimit: 8,
          color: isDark ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          display: false,
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Speed (km/h)',
          color: '#0F7BFF',
        },
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        }
      },
      y1: {
        type: 'linear',
        display: chartData.datasets[1].data.some(hr => hr > 0),
        position: 'right',
        title: {
          display: true,
          text: 'Heart Rate (bpm)',
          color: '#F97316',
        },
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#F9FAFB' : '#1A1A1A',
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        titleColor: isDark ? '#F9FAFB' : '#1A1A1A',
        bodyColor: isDark ? '#F9FAFB' : '#1A1A1A',
        borderColor: isDark ? '#334155' : '#E5E7EB',
        borderWidth: 1,
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default RouteMetricsChart;