'use client';

import { Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAlerts } from '@/lib/api';

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Poll for new alerts instead of WebSocket (Vercel compatible)
    const checkAlerts = async () => {
      try {
        const alerts = await getAlerts({ acknowledged: false });
        setNotificationCount(alerts.length);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex-1">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Tableau de Bord
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">{notificationCount}</span>
          )}
        </button>
        <button className="flex items-center gap-2 p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
