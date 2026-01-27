'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useUserProfile() {
  const { data: session } = useSession();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!session?.user?.token) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        
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
  }, [session?.user?.token]);

  return {
    ...session,
    user: session?.user ? {
      ...session.user,
      avatar,
    } : null,
    loading,
  };
}
