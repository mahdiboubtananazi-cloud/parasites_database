import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('parasites_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('??? ??????? ?????? ????????', error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const fakeUser: User = {
      id: '1',
      name: '???? ?????',
      email: 'student@univ.edu',
      role: 'student'
    };
    setUser(fakeUser);
    localStorage.setItem('parasites_user', JSON.stringify(fakeUser));
    setIsLoading(false);
    navigate('/');
  };

  const register = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    navigate('/login');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('parasites_user');
    navigate('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};