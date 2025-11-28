import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Parasite {
  id: string;
  name: string;
  scientificName: string;
  type: string;
  description: string;
  imageUrl?: string;
  stage?: string;
}

const API_URL = 'http://localhost:8000';

interface UseParasitesOptions {
  autoFetch?: boolean;
}

export const useParasites = (options: UseParasitesOptions = { autoFetch: true }) => {
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(options.autoFetch !== false);
  const [error, setError] = useState(null);

  const fetchParasites = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/parasites`);
      setParasites(response.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createParasite = async (data: Omit<Parasite, 'id'>) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/parasites`, data);
      setParasites(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      console.error(err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
    createParasite 
  };
};