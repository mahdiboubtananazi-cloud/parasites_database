import { useState, useEffect } from 'react';
import { parasitesApi, Parasite, CreateParasiteDto } from '@/api/parasites';
import { handleApiError, ApiError } from '@/api/client';

interface UseParasitesOptions {
  autoFetch?: boolean;
}

export const useParasites = (options: UseParasitesOptions = { autoFetch: true }) => {
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(options.autoFetch !== false);
  const [error, setError] = useState<ApiError | null>(null);

  // جلب جميع الطفيليات
  const fetchParasites = async () => {
    try {
      setLoading(true);
      const response = await parasitesApi.getAll();
      setParasites(response.data);
      setError(null);
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      console.error('Error fetching parasites:', apiError);
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  // إنشاء طفيلي جديد
  const createParasite = async (data: CreateParasiteDto) => {
    try {
      setLoading(true);
      const newParasite = await parasitesApi.create(data);
      setParasites(prev => [...prev, newParasite]);
      setError(null);
      return newParasite;
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      console.error('Error creating parasite:', apiError);
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  // تحديث طفيلي
  const updateParasite = async (id: number | string, data: Partial<CreateParasiteDto>) => {
    try {
      setLoading(true);
      const updatedParasite = await parasitesApi.update(id, data);
      setParasites(prev => prev.map(p => p.id === id ? updatedParasite : p));
      setError(null);
      return updatedParasite;
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      console.error('Error updating parasite:', apiError);
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  // حذف طفيلي
  const deleteParasite = async (id: number | string) => {
    try {
      setLoading(true);
      await parasitesApi.delete(id);
      setParasites(prev => prev.filter(p => p.id !== id));
      setError(null);
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      console.error('Error deleting parasite:', apiError);
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  // جلب طفيلي بواسطة ID
  const getParasiteById = async (id: number | string): Promise<Parasite | null> => {
    try {
      setLoading(true);
      const parasite = await parasitesApi.getById(id);
      setError(null);
      return parasite;
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      console.error('Error fetching parasite:', apiError);
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند التثبيت
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchParasites();
    }
  }, []);

  return {
    parasites,
    loading,
    error,
    refetch: fetchParasites,
    createParasite,
    updateParasite,
    deleteParasite,
    getParasiteById,
  };
};
