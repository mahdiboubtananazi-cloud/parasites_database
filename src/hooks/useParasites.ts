import { useState, useEffect } from 'react';
import { parasitesApi, Parasite } from '@/api/parasites';

interface UseParasitesOptions {
  autoFetch?: boolean;
}

export const useParasites = (options: UseParasitesOptions = { autoFetch: true }) => {
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(options.autoFetch !== false);
  const [error, setError] = useState<string | null>(null);

  // جلب جميع الطفيليات
  const fetchParasites = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching all parasites...');
      
      const response = await parasitesApi.getAll();
      
      // التعامل مع الاستجابة بشكل آمن
      let data = response?.data;
      
      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ Invalid response format:', response);
        setParasites([]);
        setLoading(false);
        return;
      }
      
      console.log('✅ Parasites fetched:', data.length);
      setParasites(data);
    } catch (err: unknown) {
      console.error('❌ Error fetching parasites:', err);
      setError(err instanceof Error ? err.message : 'خطأ في تحميل البيانات');
      setParasites([]);
    } finally {
      setLoading(false);
    }
  };

  // جلب طفيلي بواسطة ID
  const getParasiteById = async (id: number | string): Promise<Parasite | null> => {
    try {
      console.log('🔄 Fetching parasite with ID:', id);
      const parasite = await parasitesApi.getById(id);
      console.log('✅ Parasite fetched:', parasite);
      return parasite || null;
    } catch (err: unknown) {
      console.error('❌ Error fetching parasite:', err);
      return null;
    }
  };

  // إنشاء طفيلي جديد
  const createParasite = async (data: any) => {
    try {
      setLoading(true);
      const newParasite = await parasitesApi.create(data);
      setParasites((prev) => [...prev, newParasite]);
      setError(null);
      return newParasite;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطأ في الإنشاء';
      console.error('❌ Error creating parasite:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث طفيلي
  const updateParasite = async (id: number | string, data: any) => {
    try {
      setLoading(true);
      const updatedParasite = await parasitesApi.update(id, data);
      setParasites((prev) => prev.map((p) => (p.id === id ? updatedParasite : p)));
      setError(null);
      return updatedParasite;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطأ في التحديث';
      console.error('❌ Error updating parasite:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف طفيلي
  const deleteParasite = async (id: number | string) => {
    try {
      setLoading(true);
      await parasitesApi.delete(id);
      setParasites((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطأ في الحذف';
      console.error('❌ Error deleting parasite:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند التثبيت
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchParasites();
    }
  }, [options.autoFetch]);

  return {
    parasites,
    loading,
    error,
    refetch: fetchParasites,
    getParasiteById,
    createParasite,
    updateParasite,
    deleteParasite,
  };
};

export default useParasites;