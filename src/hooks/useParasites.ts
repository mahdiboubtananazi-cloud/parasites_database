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

//  العودة إلى localhost (الأكثر استقراراً)
const API_URL = 'http://localhost:8000'; 

export const useParasites = () => {
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchParasites();
  }, []);

  return { parasites, loading, error, refetch: fetchParasites };
};
