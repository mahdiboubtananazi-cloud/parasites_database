import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthUser {
  id: string;
  email?: string;
  role?: 'student' | 'professor' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ تحميل الـ session عند البداية
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing Auth Provider...');

        // ✅ Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        console.log('✅ Session check:', !!session?.user);

        if (session?.user) {
          // ✅ Load user data with role
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email,
              role: profile?.role || session.user.user_metadata?.role || 'student',
            });

            console.log('👤 User loaded:', session.user.email);
          } catch (err) {
            console.warn('⚠️ Profile load error, using metadata');
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'student',
            });
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('🔴 Auth init error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    initializeAuth();

    // ✅ Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email,
              role: profile?.role || session.user.user_metadata?.role || 'student',
            });
          } catch (err) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'student',
            });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // ✅ دالة تسجيل الدخول
  const login = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔐 Attempting login for:', data.email);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.error('❌ Login error:', authError.message);
        setError(authError.message);
        throw authError;
      }

      console.log('✅ Login successful');

      if (authData.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single();

          setUser({
            id: authData.user.id,
            email: authData.user.email,
            role: profile?.role || authData.user.user_metadata?.role || 'student',
          });

          console.log('👤 User set:', authData.user.email);
        } catch (err) {
          console.warn('⚠️ Profile load error, using metadata');
          setUser({
            id: authData.user.id,
            email: authData.user.email,
            role: authData.user.user_metadata?.role || 'student',
          });
        }
      }
    } catch (err) {
      console.error('🔴 Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ دالة تسجيل الخروج
  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('🚪 Logging out...');

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Logout error:', error);
        throw error;
      }

      setUser(null);
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('🔴 Logout error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};