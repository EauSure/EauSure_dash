import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '@/components/Card';
import { getWaterQualityData } from '@/services/api';
import { Droplets, Activity, AlertTriangle, Radio } from 'lucide-react';
import { connectSocket } from '@/services/socket';

interface WaterQualityData {
  timestamp: string;
  tds: number;
  ph: number;
  deviceId: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'danger';
}

function MetricCard({ title, value, unit, icon, status }: MetricCardProps) {
  const statusColors = {
    good: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${statusColors[status]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">
            {value} <span className="text-lg font-normal">{unit}</span>
          </p>
        </div>
        <div className="opacity-60">{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<WaterQualityData[]>([]);
  const [latestData, setLatestData] = useState<WaterQualityData | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<string>('online');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s

    const socket = connectSocket();
    socket.on('waterQuality', (newData: WaterQualityData) => {
      setLatestData(newData);
      setData((prev) => [...prev.slice(-49), newData]);
    });

    socket.on('deviceStatus', (status: { deviceId: string; status: string }) => {
      setDeviceStatus(status.status);
    });

    return () => {
      clearInterval(interval);
      socket.off('waterQuality');
      socket.off('deviceStatus');
    };
  }, []);

  const loadData = async () => {
    try {
      const result = await getWaterQualityData({ limit: 50 });
      setData(result);
      if (result.length > 0) {
        setLatestData(result[result.length - 1]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const getPhStatus = (ph: number): 'good' | 'warning' | 'danger' => {
    if (ph >= 6.5 && ph <= 8.5) return 'good';
    if (ph >= 6 && ph <= 9) return 'warning';
    return 'danger';
  };

  const getTdsStatus = (tds: number): 'good' | 'warning' | 'danger' => {
    if (tds < 300) return 'good';
    if (tds < 600) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="pH"
          value={latestData?.ph.toFixed(2) || '--'}
          unit=""
          icon={<Droplets size={40} />}
          status={latestData ? getPhStatus(latestData.ph) : 'good'}
        />
        <MetricCard
          title="TDS"
          value={latestData?.tds.toFixed(0) || '--'}
          unit="ppm"
          icon={<Activity size={40} />}
          status={latestData ? getTdsStatus(latestData.tds) : 'good'}
        />
        <MetricCard
          title="État du dispositif"
          value={deviceStatus === 'online' ? 'En ligne' : 'Hors ligne'}
          unit=""
          icon={<Radio size={40} />}
          status={deviceStatus === 'online' ? 'good' : 'danger'}
        />
        <MetricCard
          title="Alertes actives"
          value="0"
          unit=""
          icon={<AlertTriangle size={40} />}
          status="good"
        />
      </div>

      <Card title="Historique de la qualité de l'eau">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString('fr-FR')}
            />
            <YAxis yAxisId="left" label={{ value: 'pH', angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'TDS (ppm)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString('fr-FR')}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ph"
              stroke="#3b82f6"
              name="pH"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tds"
              stroke="#10b981"
              name="TDS (ppm)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
