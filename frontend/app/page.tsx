'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '@/components/Card';
import { getWaterQualityData, WaterQualityData } from '@/lib/api';
import { Droplets, Activity, AlertTriangle, Radio } from 'lucide-react';
import { connectSocket } from '@/lib/socket';

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

export default function Home() {
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

          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
