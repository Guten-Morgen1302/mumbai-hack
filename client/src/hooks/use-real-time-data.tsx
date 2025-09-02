import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useRealTimeData() {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Simulate real-time data updates every 30 seconds
    intervalRef.current = setInterval(() => {
      // Invalidate and refetch dashboard stats
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      
      // Invalidate hospitals data
      queryClient.invalidateQueries({ queryKey: ['/api/hospitals'] });
      
      // Invalidate health advisories
      queryClient.invalidateQueries({ queryKey: ['/api/health-advisories'] });
      
      // Add visual feedback for data updates
      const updateElements = document.querySelectorAll('[data-testid*="current-patients"], [data-testid*="preparedness-score"]');
      updateElements.forEach(element => {
        element.classList.add('animate-pulse-glow');
        setTimeout(() => element.classList.remove('animate-pulse-glow'), 1000);
      });
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [queryClient]);

  return {
    startRealTimeUpdates: () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
        }, 30000);
      }
    },
    
    stopRealTimeUpdates: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }
  };
}
