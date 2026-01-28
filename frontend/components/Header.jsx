'use client';

import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAppearance } from '@/contexts/AppearanceContext';

export default function Header() {
  const { user } = useUserProfile();
  const { t } = useAppearance();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/') return t('nav_dashboard');
    if (pathname === '/devices') return t('nav_devices');
    if (pathname === '/alerts') return t('nav_alerts');
    if (pathname === '/settings') return t('nav_settings');
    if (pathname.startsWith('/settings/appearance')) return t('appearance_title');
    if (pathname.startsWith('/settings/notifications')) return t('settings_notifications');
    if (pathname.startsWith('/settings/security')) return t('settings_security');
    if (pathname.startsWith('/settings/data')) return t('settings_data');
    if (pathname.startsWith('/settings/language')) return t('settings_language');
    if (pathname.startsWith('/profile/edit')) return t('settings_profile');
    if (pathname.startsWith('/profile/setup')) return t('settings_profile');
    if (pathname.startsWith('/profile')) return t('settings_profile');
    return t('nav_dashboard');
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 shadow-sm relative z-50">
      <div className="flex-1">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {getPageTitle()}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        {/* User Dropdown */}
        <div className="relative z-50">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
          >
            {user?.avatar ? (
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all">
                <img 
                  src={user.avatar} 
                  alt={user.name || 'User'} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold shadow-md">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'user'}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-2xl animate-fade-in z-[100]">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700">
                  {user?.role || 'user'}
                </span>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowDropdown(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 border-b border-gray-100"
              >
                <Settings size={18} />
                <span className="font-medium">{t('nav_settings')}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors duration-200 rounded-b-xl"
              >
                <LogOut size={18} />
                <span className="font-medium">{t('nav_logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}
