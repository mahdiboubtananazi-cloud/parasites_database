import { useState } from 'react';
import { parasitesApi } from '../api/parasites';

export const useParasiteReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewParasite = async (id: string, status: 'approved' | 'rejected', comments?: string) => {
    setLoading(true);
    setError(null);
    try {
      // ?????? ???? ??????? ???????? ?? API ??????
      await parasitesApi.update(id, { 
        validation_status: status,
        validation_comments: comments 
      });
      return true;
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reviewParasite, loading, error };
};
