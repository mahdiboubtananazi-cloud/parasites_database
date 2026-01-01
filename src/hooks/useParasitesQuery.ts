import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  parasitesApi,
  PaginationParams,
  PaginatedResponse,
} from '../api/parasites';
import { Parasite, CreateParasiteInput, UpdateParasiteInput } from '../types/parasite';

// ==============================================
// Query Keys
// ==============================================

export const parasiteKeys = {
  all: ['parasites'] as const,
  lists: () => [...parasiteKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...parasiteKeys.lists(), params] as const,
  details: () => [...parasiteKeys.all, 'detail'] as const,
  detail: (id: string) => [...parasiteKeys.details(), id] as const,
  filters: () => [...parasiteKeys.all, 'filters'] as const,
};

// ==============================================
// Queries
// ==============================================

/**
 * جلب جميع الطفيليات (بدون pagination)
 */
export const useParasitesQuery = () => {
  return useQuery({
    queryKey: parasiteKeys.all,
    queryFn: parasitesApi.getAll,
  });
};

/**
 * جلب الطفيليات مع Pagination
 */
export const useParasitesPaginated = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: parasiteKeys.list(params),
    queryFn: () => parasitesApi.getPaginated(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * جلب طفيلي واحد
 */
export const useParasiteQuery = (id: string) => {
  return useQuery({
    queryKey: parasiteKeys.detail(id),
    queryFn: () => parasitesApi.getById(id),
    enabled: !!id,
  });
};

/**
 * جلب خيارات الفلاتر
 */
export const useFilterOptions = () => {
  return useQuery({
    queryKey: parasiteKeys.filters(),
    queryFn: parasitesApi.getFilterOptions,
    staleTime: 10 * 60 * 1000, // 10 دقائق
  });
};

// ==============================================
// Mutations
// ==============================================

/**
 * إنشاء طفيلي جديد
 */
export const useCreateParasite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParasiteInput) => parasitesApi.create(data),
    onSuccess: () => {
      // إبطال الكاش لإعادة الجلب
      queryClient.invalidateQueries({ queryKey: parasiteKeys.all });
    },
  });
};

/**
 * تحديث طفيلي
 */
export const useUpdateParasite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParasiteInput }) =>
      parasitesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: parasiteKeys.all });
      queryClient.invalidateQueries({ queryKey: parasiteKeys.detail(id) });
    },
  });
};

/**
 * حذف طفيلي
 */
export const useDeleteParasite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => parasitesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parasiteKeys.all });
    },
  });
};

// ==============================================
// Helper Hook للتوافق مع الكود القديم
// ==============================================

export const useParasites = () => {
  const query = useParasitesQuery();

  return {
    parasites: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};