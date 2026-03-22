
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { updateLastActive } from '@/lib/server-actions/users';

const ACTIVITY_UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

export function ActivityTracker() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const lastUpdateKey = `lastActiveUpdate_${user.uid}`;
    
    const trackActivity = async () => {
      const now = Date.now();
      const lastUpdate = localStorage.getItem(lastUpdateKey);
      
      if (!lastUpdate || (now - parseInt(lastUpdate)) > ACTIVITY_UPDATE_INTERVAL) {
        try {
          await updateLastActive(user.uid);
          localStorage.setItem(lastUpdateKey, now.toString());
        } catch (error) {
          console.error('Failed to update activity status:', error);
        }
      }
    };

    // Track activity on mountain and then periodically or on interaction if needed
    trackActivity();

    // Optionally listen for interactions to be more reactive (but still throttled by interval)
    const handleInteraction = () => {
        trackActivity();
    };

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [user]);

  return null; // This component doesn't render anything
}
