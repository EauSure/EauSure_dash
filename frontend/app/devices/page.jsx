'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import { getDevices, Device } from '@/lib/api';
import { Radio, Battery, MapPin } from 'lucide-react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const result = await getDevices();
      setDevices(result);
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Dispositifs IoT">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{device.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {device.location}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    device.status === 'online'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {device.status === 'online' ? 'En ligne' : 'Hors ligne'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Radio className="w-4 h-4 mr-2" />
                  ID: {device.id}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Battery className="w-4 h-4 mr-2" />
                  Batterie: {device.battery}%
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Dernière activité: {new Date(device.lastSeen).toLocaleString('fr-FR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
