/* eslint-disable react-refresh/only-export-components */

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
  const [loading, setLoading] = useState(true); // تحميل عام للتطبيق
  const [isLoading, setIsLoading] = useState(false); // تحميل عمليات (login/register)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // 👇 التعديل هنا: قللنا الوقت من 10000 إلى 2000 (ثانيتين فقط)
        // إذا لم يرد السيرفر خلال ثانيتين، سيفتح الموقع كزائر
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Auth initialization timeout'));
          }, 2000); 
        });

        let sessionResult;
        try {
          sessionResult = await Promise.race([sessionPromise, timeoutPromise]);
        } catch {
          console.warn('Auth session fetch timed out, proceeding without session');
          sessionResult = { data: { session: null } };
        }

        if (timeoutId) clearTimeout(timeoutId);

        const { data: { session } } = sessionResult;

        if (!isMounted) return;

        if (session?.user) {
          try {
            const profilePromise = supabase
              .from('profiles')
              .select('role, name')
              .eq('id', session.user.id)
              .single();

            let profileTimeoutId: NodeJS.Timeout;
            const profileTimeoutPromise = new Promise<never>((_, reject) => {
              // 👇 التعديل هنا أيضاً: قللنا وقت انتظار البروفايل
              profileTimeoutId = setTimeout(
                () => reject(new Error('Profile fetch timeout')),
                2000
              );
            });

            let profileResult;
            try {
              profileResult = await Promise.race([profilePromise, profileTimeoutPromise]);
            } catch {
              profileResult = { data: null };
            } finally {
              if (profileTimeoutId) clearTimeout(profileTimeoutId);
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
            if (!isMounted) return;
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
        }
      } finally {
        if (isMounted) {
          setLoading(false); // 👈 هذا أهم سطر: يخبر التطبيق أن التحميل انتهى
        }
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      // منطق تحديث المستخدم عند تغيير الحالة
      try {
         // اختصار بسيط هنا لتسريع التحديثات اللاحقة
         setUser({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'student',
          name: session.user.user_metadata?.name,
        });
      } catch (e) { console.error(e) }
    });

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, []);

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

  const register = async (data: { email: string; password: string; name?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { name: data.name || '', role: 'student' } },
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
      value={{ user, loading, isLoading, isAuthenticated, error, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};