import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

interface ReviewParams {
  parasiteId: string;
  reviewedBy: string;
  reviewNotes?: string;
  action?: 'approve' | 'reject' | 'edit';
}

interface UseParasiteReviewReturn {
  isLoading: boolean;
  error: string | null;
  approve: (params: ReviewParams) => Promise<any>;
  reject: (params: ReviewParams & { reviewNotes: string }) => Promise<any>;
  requestEdit: (params: ReviewParams & { reviewNotes: string }) => Promise<any>;
  clearError: () => void;
}

export const useParasiteReview = (): UseParasiteReviewReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * 🟢 الموافقة على الصورة
   */
  const approve = useCallback(
    async (params: ReviewParams): Promise<any> => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = {
          status: 'approved',
          reviewed_by: params.reviewedBy,
          review_notes: params.reviewNotes || 'موافقة على الصورة',
          reviewed_at: new Date().toISOString(),
        };

        const response = await axios.put(
          `${API_URL}/parasites/${params.parasiteId}/status`,
          payload,
          { timeout: API_TIMEOUT }
        );

        return response.data?.item || response.data?.data || null;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'خطأ في الموافقة';
        setError(errorMsg);
        console.error('❌ Approval Error:', errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * 🔴 رفض الصورة
   */
  const reject = useCallback(
    async (params: ReviewParams & { reviewNotes: string }): Promise<any> => {
      if (!params.reviewNotes.trim()) {
        setError('ملاحظات الرفض إجبارية');
        return null;
      }

      setIsLoading(true);
      setError(null);
      try {
        const payload = {
          status: 'rejected',
          reviewed_by: params.reviewedBy,
          review_notes: params.reviewNotes,
          reviewed_at: new Date().toISOString(),
        };

        const response = await axios.put(
          `${API_URL}/parasites/${params.parasiteId}/status`,
          payload,
          { timeout: API_TIMEOUT }
        );

        return response.data?.item || response.data?.data || null;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'خطأ في الرفض';
        setError(errorMsg);
        console.error('❌ Rejection Error:', errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * ✏️ طلب تعديل الصورة
   */
  const requestEdit = useCallback(
    async (params: ReviewParams & { reviewNotes: string }): Promise<any> => {
      if (!params.reviewNotes.trim()) {
        setError('تفاصيل التعديل المطلوب إجبارية');
        return null;
      }

      setIsLoading(true);
      setError(null);
      try {
        const payload = {
          status: 'pending',
          reviewed_by: params.reviewedBy,
          review_notes: `[تعديل مطلوب] ${params.reviewNotes}`,
          reviewed_at: new Date().toISOString(),
        };

        const response = await axios.put(
          `${API_URL}/parasites/${params.parasiteId}/status`,
          payload,
          { timeout: API_TIMEOUT }
        );

        return response.data?.item || response.data?.data || null;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'خطأ في طلب التعديل';
        setError(errorMsg);
        console.error('❌ Edit Request Error:', errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    approve,
    reject,
    requestEdit,
    clearError,
  };
};