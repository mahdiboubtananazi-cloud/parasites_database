// src/hooks/useParasites.ts
// للتوافق مع الكود القديم - يستخدم React Query داخلياً

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parasitesApi } from '@/api/parasites';
import { Parasite, CreateParasiteInput, UpdateParasiteInput } from '@/types/parasite';

interface UseParasitesOptions {
  autoFetch?: boolean;
}

// Query Keys
const PARASITES_KEY = ['parasites'];

export const useParasites = (options: UseParasitesOptions = { autoFetch: true }) => {
  const queryClient = useQueryClient();

  // جلب جميع الطفيليات
  const {
    data: parasites = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: PARASITES_KEY,
    queryFn: parasitesApi.getAll,
    enabled: options.autoFetch !== false,
  });

  const error = queryError ? (queryError as Error).message : null;

  // جلب طفيلي بواسطة ID
  const getParasiteById = async (id: number | string): Promise<Parasite | null> => {
    try {
      const parasite = await parasitesApi.getById(id.toString());
      return parasite || null;
    } catch (err) {
      console.error('❌ Error fetching parasite:', err);
      return null;
    }
  };

  // إنشاء طفيلي جديد
  const createMutation = useMutation({
    mutationFn: (data: CreateParasiteInput) => parasitesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARASITES_KEY });
    },
  });

  const createParasite = async (data: CreateParasiteInput) => {
    return createMutation.mutateAsync(data);
  };

  // تحديث طفيلي
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParasiteInput }) =>
      parasitesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARASITES_KEY });
    },
  });

  const updateParasite = async (id: number | string, data: UpdateParasiteInput) => {
    return updateMutation.mutateAsync({ id: id.toString(), data });
  };

  // حذف طفيلي
  const deleteMutation = useMutation({
    mutationFn: (id: string) => parasitesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARASITES_KEY });
    },
  });

  const deleteParasite = async (id: number | string) => {
    return deleteMutation.mutateAsync(id.toString());
  };

  return {
    parasites,
    loading: loading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error,
    refetch,
    getParasiteById,
    createParasite,
    updateParasite,
    deleteParasite,
  };
};

export default useParasites;