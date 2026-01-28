'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function Layout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' 
    || pathname === '/register' 
    || pathname === '/profile/setup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="layout-bg flex h-screen">
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
