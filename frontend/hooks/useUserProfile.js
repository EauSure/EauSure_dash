'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useUserProfile() {
  const { data: session } = useSession();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/profile');
        
        if (response.data.user?.avatar) {
          setAvatar(response.data.user.avatar);
        }
      } catch (error) {
        console.error('Failed to fetch user avatar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [session?.user?.id]);

  return {
    ...session,
    user: session?.user ? {
      ...session.user,
      avatar,
    } : null,
    loading,
  };
}
