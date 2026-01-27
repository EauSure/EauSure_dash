'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function Layout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' 
    || pathname === '/register' 
    || pathname === '/profile/setup'
    || pathname === '/forgot-password'
    || pathname === '/reset-password'
    || pathname === '/verify-email';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
