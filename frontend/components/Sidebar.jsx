'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Radio, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useAppearance } from '@/contexts/AppearanceContext';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useAppearance();

  const navigation = [
    { name: t('nav_dashboard'), href: '/', icon: Home },
    { name: t('nav_devices'), href: '/devices', icon: Radio },
    { name: t('nav_alerts'), href: '/alerts', icon: Bell },
  ];

  return (
    <div className={`flex flex-col bg-gradient-to-b from-slate-900 via-blue-900 to-cyan-900 border-r border-blue-800 shadow-2xl transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="relative flex items-center h-16 px-4 border-b border-blue-800 bg-black/20">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 flex-1">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} className="flex-shrink-0" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                Water Quality
              </h1>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronLeft className="text-cyan-400" size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-full flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <div
              key={item.name}
              className={`${isCollapsed ? 'flex justify-center' : ''}`}
            >
              <Link
                href={item.href}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center text-sm font-medium rounded-xl ${
                  isCollapsed ? 'w-12 h-12 justify-center p-0' : 'w-full justify-start px-4 py-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white hover:scale-102'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap ml-3">{item.name}</span>}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
