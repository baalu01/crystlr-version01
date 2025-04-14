import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UseSessionReturn {
  checkSessionExists: (sessionId: string) => Promise<boolean>;
  getViewerCount: (sessionId: string) => Promise<number>;
  isChecking: boolean;
  error: Error | null;
}

export function useSession(): UseSessionReturn {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const checkSessionExists = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      setIsChecking(true);
      setError(null);
      
      const res = await apiRequest('GET', `/api/sessions/${sessionId}`);
      const data = await res.json();
      
      return data.exists && data.active;
    } catch (err) {
      console.error('Error checking session:', err);
      setError(err instanceof Error ? err : new Error('Failed to check session status'));
      toast({
        title: "Error",
        description: "Could not verify the session. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [toast]);

  const getViewerCount = useCallback(async (sessionId: string): Promise<number> => {
    try {
      const res = await apiRequest('GET', `/api/sessions/${sessionId}/viewers`);
      const data = await res.json();
      return data.count || 0;
    } catch (err) {
      console.error('Error getting viewer count:', err);
      return 0;
    }
  }, []);

  return {
    checkSessionExists,
    getViewerCount,
    isChecking,
    error
  };
}
