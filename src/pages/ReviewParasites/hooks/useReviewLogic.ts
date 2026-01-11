import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useParasites } from '../../../hooks/useParasites';
import { Parasite } from '../../../types/parasite';
import { parasitesApi } from '../../../api/parasites';
import { PROFESSOR_SECRET_CODE } from '../utils';

export const useReviewLogic = () => {
  const { user } = useAuth();
  const { parasites: allParasites, loading, refetch } = useParasites();

  // 🔍 تشخيص المشكلة في الكونسول
  useEffect(() => {
    if (!loading) {
      console.log('🔍 [Debug] User ID:', user?.id);
      console.log('🔍 [Debug] Total Parasites:', allParasites?.length);
      if (allParasites?.length > 0) {
        console.log('🔍 [Debug] Sample 1 UploadedBy:', allParasites[0].uploadedBy);
        console.log('🔍 [Debug] Status:', allParasites[0].status);
      }
    }
  }, [loading, user, allParasites]);

  const [isVerified, setIsVerified] = useState(false);
  const [secretCode, setSecretCode] = useState('');

  // الفلتر الافتراضي
  const [statusFilter, setStatusFilter] = useState<
    'pending' | 'approved' | 'rejected' | 'all'
  >('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParasite, setSelectedParasite] = useState<Parasite | null>(null);
  const [actionType, setActionType] = useState<
    'approve' | 'reject' | 'edit' | 'delete' | 'view'
  >('view');
  const [reviewNotes, setReviewNotes] = useState('');
  const [editData, setEditData] = useState<Partial<Parasite>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSupervisor = true; // TODO: اربطه بدور المستخدم لاحقًا

  // Verify Supervisor
  useEffect(() => {
    const verified = localStorage.getItem('professor_verified');
    if (verified === 'true') setIsVerified(true);
  }, []);

  const verifyCode = () => {
    if (secretCode === PROFESSOR_SECRET_CODE) {
      setIsVerified(true);
      localStorage.setItem('professor_verified', 'true');
      return true;
    }
    return false;
  };

  // منطق الفلترة
  const filteredParasites = useMemo(() => {
    if (!allParasites || allParasites.length === 0) return [];

    let list = [...allParasites];

    // 1. تصفية حسب الحالة
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter);
    }

    // فلترة حسب المستخدم (معلّقة الآن):
    // if (!isSupervisor && user) {
    //   list = list.filter((p) => p.uploadedBy === user.id);
    // }

    // 2. البحث
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.scientificName &&
            p.scientificName.toLowerCase().includes(q))
      );
    }

    // 3. الترتيب: الأحدث أولاً
    return list.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [allParasites, statusFilter, searchQuery]);

  // Actions
  const openDialog = (parasite: Parasite, type: typeof actionType) => {
    setSelectedParasite(parasite);
    setActionType(type);
    if (type === 'edit') setEditData({ ...parasite });
    setReviewNotes(parasite.reviewNotes || '');
    setDialogOpen(true);
  };

  const handleAction = async () => {
    if (!selectedParasite) return;
    setIsSubmitting(true);

    try {
      if (actionType === 'approve') {
        await parasitesApi.update(selectedParasite.id, {
          status: 'approved',
          reviewedBy: user?.id,
          reviewedAt: new Date().toISOString(),
          reviewNotes: reviewNotes || undefined,
        });
      } else if (actionType === 'reject') {
        await parasitesApi.update(selectedParasite.id, {
          status: 'rejected',
          reviewedBy: user?.id,
          reviewedAt: new Date().toISOString(),
          reviewNotes: reviewNotes,
        });
      } else if (actionType === 'edit') {
        await parasitesApi.update(selectedParasite.id, editData);
      } else if (actionType === 'delete') {
        await parasitesApi.delete(selectedParasite.id);
      }

      await refetch();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء العملية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    parasites: filteredParasites,
    loading,
    isSupervisor,
    isVerified,
    secretCode,
    setSecretCode,
    verifyCode,
    filters: { statusFilter, setStatusFilter, searchQuery, setSearchQuery },
    dialog: {
      open: dialogOpen,
      setOpen: setDialogOpen,
      type: actionType,
      data: selectedParasite,
      openDialog,
      handleAction,
      isSubmitting,
      notes: reviewNotes,
      setNotes: setReviewNotes,
      editData,
      setEditData,
    },
  };
};