'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '@/components/Card';
import { getWaterQualityData } from '@/lib/api';
import { Droplets, Activity, AlertTriangle, Radio } from 'lucide-react';

function MetricCard({ title, value, unit, icon, status }) {
  const statusStyles = {
    good: 'from-emerald-50 to-teal-50 border-emerald-200 shadow-emerald-100',
    warning: 'from-amber-50 to-yellow-50 border-amber-200 shadow-amber-100',
    danger: 'from-rose-50 to-red-50 border-rose-200 shadow-rose-100',
  };

  const iconStyles = {
    good: 'text-emerald-600 bg-emerald-100',
    warning: 'text-amber-600 bg-amber-100',
    danger: 'text-rose-600 bg-rose-100',
  };

  const textStyles = {
    good: 'text-blue-900',
    warning: 'text-amber-900',
    danger: 'text-rose-900',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 p-6 bg-gradient-to-br ${statusStyles[status]} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-black font-semibold uppercase tracking-wide mb-2">{title}</p>
          <p className={`text-4xl font-bold ${textStyles[status]}`}>
            {value} <span className="text-xl font-medium opacity-75">{unit}</span>
          </p>
        </div>
        <div className={`p-4 rounded-xl ${iconStyles[status]} shadow-md`}>{icon}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState('online');

  useEffect(() => {
    loadData();
    // Poll for new data every 30 seconds (Vercel compatible)
    const interval = setInterval(loadData, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadData = async () => {
    try {
      const result = await getWaterQualityData({ limit: 50 });
      // Ensure result is always an array
      const dataArray = Array.isArray(result) ? result : [];
      setData(dataArray);
      if (dataArray.length > 0) {
        setLatestData(dataArray[0]);
        // Check if device is online (data received in last 5 minutes)
        const lastUpdate = new Date(dataArray[0].timestamp);
        const now = new Date();
        const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
        setDeviceStatus(diffMinutes < 5 ? 'online' : 'offline');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setData([]);
      setDeviceStatus('offline');
    }
  };

  const getPhStatus = (ph) => {
    if (ph >= 6.5 && ph <= 8.5) return 'good';
    if (ph >= 6 && ph <= 9) return 'warning';
    return 'danger';
  };

  const getTdsStatus = (tds) => {
    if (tds < 300) return 'good';
    if (tds < 600) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 rounded-2xl p-8 shadow-2xl text-white">
        <h1 className="text-4xl font-bold mb-2">Surveillance de la Qualité de l'Eau</h1>
        <p className="text-blue-100 text-lg">Système IoT pour puits et réservoirs profonds</p>
      </div>

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

      <Card title="📊 Historique de la qualité de l'eau">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString('fr-FR')}
              stroke="#64748b"
            />
            <YAxis yAxisId="left" label={{ value: 'pH', angle: -90, position: 'insideLeft' }} stroke="#3b82f6" />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'TDS (ppm)', angle: 90, position: 'insideRight' }}
              stroke="#10b981"
            />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString('fr-FR')}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ph"
              stroke="#3b82f6"
              strokeWidth={3}
              name="pH"
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tds"
              stroke="#10b981"
              strokeWidth={3}
              name="TDS (ppm)"
              dot={false}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
