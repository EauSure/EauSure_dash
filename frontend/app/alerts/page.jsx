'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import { getAlerts, Alert } from '@/lib/api';
import { AlertTriangle, Droplet } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    loadAlerts();
    // Poll for new alerts every 30 seconds (Vercel compatible)
    const interval = setInterval(loadAlerts, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const result = await getAlerts();
      setAlerts(result);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fall_detection':
        return <AlertTriangle className="w-5 h-5" />;
      case 'water_quality':
        return <Droplet className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Alertes système">
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune alerte active</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start">
                  <div className="shrink-0 mr-3">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{alert.message}</h4>
                      <span className="text-xs">
                        {new Date(alert.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm mt-1">Dispositif: {alert.deviceId}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
