import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
}

//  1. إضافة isLoading للواجهة (Interface)
interface AuthContextType {
  user: User | null;
  isLoading: boolean; // هذا هو السطر المفقود الذي سبب الخطأ
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // ✅ 2. حالة التحميل
  const navigate = useNavigate();

  // عند تشغيل التطبيق، نحاول استرجاع المستخدم من LocalStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('parasites_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('فشل استرجاع بيانات المستخدم', error);
      } finally {
        setIsLoading(false); //  إيقاف التحميل سواء وجدنا مستخدم أم لا
      }
    };
    initAuth();
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    // محاكاة تأخير الشبكة لتسجيل الدخول
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const fakeUser: User = { 
      id: '1', 
      name: 'طالب جامعي', 
      email: 'student@univ.edu', 
      role: 'student' 
    };
    
    setUser(fakeUser);
    localStorage.setItem('parasites_user', JSON.stringify(fakeUser)); // حفظ المستخدم
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
    localStorage.removeItem('parasites_user'); // حذف المستخدم
    navigate('/login');
  };

  //  3. تمرير isLoading في القيمة المصدرة
  const value = {
    user,
    isLoading,
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
