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
    <div className={`sidebar flex flex-col bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="relative flex items-center h-16 px-4 border-b border-gray-200">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 flex-1">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} className="flex-shrink-0" />
              <h1 className="sidebar-title text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent whitespace-nowrap">
                EauSûre
              </h1>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronLeft className="sidebar-icon text-gray-600" size={20} />
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
                className={`sidebar-link flex items-center text-sm font-medium rounded-xl transition-all ${
                  isCollapsed ? 'w-12 h-12 justify-center p-0' : 'w-full justify-start px-4 py-3'
                } ${
                  isActive
                    ? 'sidebar-link-active text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
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
