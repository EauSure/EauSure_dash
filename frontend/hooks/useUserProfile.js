'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useUserProfile() {
  const { data: session, status } = useSession();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      // Don't fetch if session is still loading or user is not authenticated
      if (status === 'loading' || !session?.user?.id) return;
      
      // Don't fetch if we already have the avatar from session
      if (session?.user?.avatar) {
        setAvatar(session.user.avatar);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/profile', {
          timeout: 5000, // 5 second timeout
        });
        
        if (response.data.user?.avatar) {
          setAvatar(response.data.user.avatar);
        }
      } catch (error) {
        console.error('Failed to fetch user avatar:', error.response?.data?.error || error.message);
        // Don't throw error, just use session avatar or null
        setAvatar(session?.user?.avatar || null);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [session?.user?.id, session?.user?.avatar, status]);

  return {
    ...session,
    user: session?.user ? {
      ...session.user,
      avatar: avatar || session.user.avatar,
    } : null,
    loading,
  };
}
