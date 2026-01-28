'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function SecurityPage() {
  useEffect(() => {
    redirect('/settings/security/options');
  }, []);

  return null;
}
