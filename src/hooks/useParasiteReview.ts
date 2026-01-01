import { useState } from 'react';
import { parasitesApi } from '../api/parasites';

export const useParasiteReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewParasite = async (
    id: string,
    status: 'approved' | 'rejected',
    reviewNotes?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await parasitesApi.update(id, {
        status: status,
        reviewNotes: reviewNotes,
        reviewedAt: new Date().toISOString(),
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