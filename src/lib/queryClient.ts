import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // البيانات تبقى صالحة لمدة 5 دقائق
      staleTime: 5 * 60 * 1000,
      // البيانات تبقى في الذاكرة 30 دقيقة
      gcTime: 30 * 60 * 1000,
      // إعادة المحاولة مرة واحدة عند الفشل
      retry: 1,
      // لا تعيد الجلب عند تغيير النافذة
      refetchOnWindowFocus: false,
    },
  },
});