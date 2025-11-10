/**
 * نظام الألوان الجامعي
 * الهوية البصرية لجامعة العربي بن مهيدي
 */

export const universityColors = {
  // الألوان الأساسية
  primary: {
    main: '#1e3a8a', // أزرق الجامعة الداكن
    light: '#3b82f6', // أزرق فاتح
    dark: '#1e40af', // أزرق داكن
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#dc2626', // أحمر علمي
    light: '#ef4444', // أحمر فاتح
    dark: '#b91c1c', // أحمر داكن
    contrastText: '#ffffff',
  },
  // ألوان إضافية
  accent: {
    gold: '#f59e0b', // ذهبي للتمييز
    green: '#10b981', // أخضر للنجاح
    purple: '#8b5cf6', // بنفسجي للعلم
  },
  // ألوان الخلفية
  background: {
    default: '#f8fafc', // رمادي فاتح جداً
    paper: '#ffffff',
    light: '#f1f5f9',
    dark: '#e2e8f0',
  },
  // ألوان النص
  text: {
    primary: '#1e293b', // رمادي داكن
    secondary: '#64748b', // رمادي متوسط
    disabled: '#94a3b8', // رمادي فاتح
  },
  // ألوان الحالة
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
  },
};

// تدرجات الألوان
export const gradients = {
  primary: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  secondary: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
  hero: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
  card: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
};

// الظلال
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  primary: '0 4px 14px 0 rgba(30, 58, 138, 0.39)',
  secondary: '0 4px 14px 0 rgba(220, 38, 38, 0.39)',
};

