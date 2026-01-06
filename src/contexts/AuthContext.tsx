import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthUser {
  id: string;
  email?: string;
  role?: 'student' | 'professor' | 'admin';
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);     // تحميل عام للتطبيق
  const [isLoading, setIsLoading] = useState(false); // تحميل عمليات (login/register)
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // تحميل الجلسة عند بداية التطبيق
  // ==========================================
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // إضافة timeout لمنع التعليق الأبدي
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Auth initialization timeout'));
          }, 10000); // 10 seconds timeout
        });

        let sessionResult;
        try {
          sessionResult = await Promise.race([sessionPromise, timeoutPromise]);
        } catch (timeoutError) {
          // إذا انتهت المهلة الزمنية، استخدم null كجلسة
          console.warn('Auth session fetch timed out, proceeding without session');
          sessionResult = { data: { session: null } };
        }
        
        // تنظيف timeout إذا نجحت العملية
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        const {
          data: { session },
        } = sessionResult;

        if (!isMounted) return;

        if (session?.user) {
          // نحاول جلب profile، لكن لا نسمح له بتعليق التطبيق
          try {
            const profilePromise = supabase
              .from('profiles')
              .select('role, name')
              .eq('id', session.user.id)
              .single();
            
            let profileTimeoutId: NodeJS.Timeout;
            const profileTimeoutPromise = new Promise<never>((_, reject) => {
              profileTimeoutId = setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
            });

            let profileResult;
            try {
              profileResult = await Promise.race([
                profilePromise,
                profileTimeoutPromise,
              ]);
            } catch (profileTimeoutError) {
              // إذا انتهت المهلة الزمنية، استخدم null كـ profile
              console.warn('Profile fetch timed out, using fallback');
              profileResult = { data: null };
            } finally {
              if (profileTimeoutId) {
                clearTimeout(profileTimeoutId);
              }
            }

            const { data: profile } = profileResult;

            if (!isMounted) return;

            setUser({
              id: session.user.id,
              email: session.user.email,
              role: profile?.role || session.user.user_metadata?.role || 'student',
              name: profile?.name || session.user.user_metadata?.name,
            });
          } catch (profileErr) {
            // fallback بدون profile
            if (!isMounted) return;
            console.warn('Profile fetch failed, using fallback:', profileErr);
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'student',
              name: session.user.user_metadata?.name,
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        if (isMounted) {
          setUser(null);
          setError(err instanceof Error ? err.message : 'Failed to initialize authentication');
        }
      } finally {
        if (isMounted) {
          // 🔴 هذا هو السطر الأهم - يضمن عدم التعليق الأبدي
          setLoading(false);
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    // ==========================================
    // الاستماع لتغييرات حالة المصادقة
    // ==========================================
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, name')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email,
          role: profile?.role || session.user.user_metadata?.role || 'student',
          name: profile?.name || session.user.user_metadata?.name,
        });
      } catch {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'student',
          name: session.user.user_metadata?.name,
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // ==========================================
  // تسجيل الدخول
  // ==========================================
  const login = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.user) {
        setUser({
          id: authData.user.id,
          email: authData.user.email,
          role: authData.user.user_metadata?.role || 'student',
          name: authData.user.user_metadata?.name,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // التسجيل
  // ==========================================
  const register = async (data: { email: string; password: string; name?: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name || '',
            role: 'student',
          },
        },
      });

      if (error) throw error;

      if (authData.user) {
        setUser({
          id: authData.user.id,
          email: authData.user.email,
          role: 'student',
          name: data.name || '',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // تسجيل الخروج
  // ==========================================
  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoading,
        isAuthenticated,
        error,
        login,
        logout,
        register,
      }}
    >
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
