import { useAuth } from '@/contexts/AuthContext';

export function useUser() {
  const { user, isLoading } = useAuth();

  return {
    user: user || null,
    checkSession: async () => {},
    isLoading: isLoading || false
  };
}
