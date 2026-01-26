'use client';

import { Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { connectSocket } from '@/lib/socket';

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const socket = connectSocket();

    socket.on('alert', () => {
      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.off('alert');
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800">
          Surveillance de la Qualité de l&apos;Eau
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
