import { useState, useEffect, useCallback } from 'react';
import { parasitesApi, type Parasite, type CreateParasiteDto, type UpdateParasiteDto } from '../api/parasites';
import { handleApiError } from '../api/client';

interface UseParasitesOptions {
  autoFetch?: boolean;
  initialFilters?: {
    search?: string;
    host?: string;
    year?: number;
  };
}

export const useParasites = (options: UseParasitesOptions = {}) => {
  const { autoFetch = true, initialFilters } = options;
  
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState(initialFilters || {});

  const fetchParasites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await parasitesApi.getAll({
        ...filters,
        limit: 100, // Get all for now
      });
      setParasites(response.data);
      setTotal(response.total);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      setParasites([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchParasites();
    }
  }, [autoFetch, fetchParasites]);

  const getParasite = useCallback(async (id: number): Promise<Parasite | null> => {
    try {
      setLoading(true);
      setError(null);
      const parasite = await parasitesApi.getById(id);
      return parasite;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createParasite = useCallback(async (data: CreateParasiteDto): Promise<Parasite | null> => {
    try {
      setLoading(true);
      setError(null);
      const newParasite = await parasitesApi.create(data);
      setParasites(prev => [newParasite, ...prev]);
      setTotal(prev => prev + 1);
      return newParasite;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateParasite = useCallback(async (id: number, data: UpdateParasiteDto): Promise<Parasite | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedParasite = await parasitesApi.update(id, data);
      setParasites(prev => prev.map(p => p.id === id ? updatedParasite : p));
      return updatedParasite;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteParasite = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await parasitesApi.delete(id);
      setParasites(prev => prev.filter(p => p.id !== id));
      setTotal(prev => prev - 1);
      return true;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    parasites,
    loading,
    error,
    total,
    filters,
    setFilters,
    fetchParasites,
    getParasite,
    createParasite,
    updateParasite,
    deleteParasite,
    refetch: fetchParasites,
  };
};

