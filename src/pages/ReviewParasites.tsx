import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Badge,
  alpha,
  Paper,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  Lock,
  Edit,
  Shield,
  Users,
  Image as ImageIcon,
  Filter,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useParasites } from '../hooks/useParasites';
import { Parasite } from '../types/parasite';
import { parasitesApi } from '../api/parasites';

// الكود السري للأساتذة (يمكن نقله لـ environment variables)
const PROFESSOR_SECRET_CODE = 'PROF2024';

// دالة لإصلاح رابط الصورة
const getImageUrl = (parasite: Parasite): string => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const DEFAULT_IMAGE = 'https://placehold.co/400x300?text=No+Image';

  const imageValue = parasite.imageUrl;

  if (!imageValue) return DEFAULT_IMAGE;
  if (imageValue.startsWith('http')) return imageValue;
  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/parasites/${imageValue}`;
  }
  return DEFAULT_IMAGE;
};

const ReviewParasites = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { parasites: allParasites, loading: parasitesLoading, refetch } = useParasites();

  // حالة التحقق من الكود السري
  const [isVerified, setIsVerified] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [codeError, setCodeError] = useState('');

  // حالة الفلترة
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  // حالة المراجعة
  const [selectedParasite, setSelectedParasite] = useState<Parasite | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'view' | 'edit'>('view');
  const [submitting, setSubmitting] = useState(false);

  // حالة التعديل
  const [editData, setEditData] = useState<Partial<Parasite>>({});

  // التحقق من الكود السري
  const handleVerifyCode = () => {
    if (secretCode === PROFESSOR_SECRET_CODE) {
      setIsVerified(true);
      setCodeError('');
      localStorage.setItem('professor_verified', 'true');
    } else {
      setCodeError(t('error_invalid_code', { defaultValue: 'الكود غير صحيح' }));
    }
  };

  // تحقق من التخزين المحلي عند التحميل
  useEffect(() => {
    const verified = localStorage.getItem('professor_verified');
    if (verified === 'true') {
      setIsVerified(true);
    }
  }, []);

  // فلترة العينات
  const filteredParasites = React.useMemo(() => {
    if (!allParasites) return [];

    let filtered = allParasites;

    // فلترة حسب الحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // الطالب يرى صوره فقط
    if (user?.role === 'student') {
      filtered = filtered.filter((p) => p.uploadedBy === user.id);
    }

    return filtered;
  }, [allParasites, statusFilter, user]);

  // إحصائيات
  const stats = React.useMemo(() => {
    if (!allParasites) return { pending: 0, approved: 0, rejected: 0, total: 0 };

    const userParasites = user?.role === 'student'
      ? allParasites.filter((p) => p.uploadedBy === user.id)
      : allParasites;

    return {
      pending: userParasites.filter((p) => p.status === 'pending').length,
      approved: userParasites.filter((p) => p.status === 'approved').length,
      rejected: userParasites.filter((p) => p.status === 'rejected').length,
      total: userParasites.length,
    };
  }, [allParasites, user]);

  // الموافقة على الصورة
  const handleApprove = async () => {
    if (!selectedParasite || !user) return;

    try {
      setSubmitting(true);

      await parasitesApi.update(selectedParasite.id, {
        status: 'approved',
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
        reviewNotes: reviewNotes || undefined,
      });

      await refetch();
      setDialogOpen(false);
      setReviewNotes('');
      setSelectedParasite(null);
    } catch (error) {
      console.error('Error approving parasite:', error);
      alert(t('error_approve', { defaultValue: 'حدث خطأ أثناء الموافقة' }));
    } finally {
      setSubmitting(false);
    }
  };

  // رفض الصورة
  const handleReject = async () => {
    if (!selectedParasite || !reviewNotes.trim() || !user) {
      alert(t('error_reject_notes', { defaultValue: 'الرجاء إضافة ملاحظة عند الرفض' }));
      return;
    }

    try {
      setSubmitting(true);

      await parasitesApi.update(selectedParasite.id, {
        status: 'rejected',
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
        reviewNotes: reviewNotes,
      });

      await refetch();
      setDialogOpen(false);
      setReviewNotes('');
      setSelectedParasite(null);
    } catch (error) {
      console.error('Error rejecting parasite:', error);
      alert(t('error_reject', { defaultValue: 'حدث خطأ أثناء الرفض' }));
    } finally {
      setSubmitting(false);
    }
  };

  // حفظ التعديلات
  const handleSaveEdit = async () => {
    if (!selectedParasite) return;

    try {
      setSubmitting(true);

      await parasitesApi.update(selectedParasite.id, editData);

      await refetch();
      setDialogOpen(false);
      setEditData({});
      setSelectedParasite(null);
    } catch (error) {
      console.error('Error updating parasite:', error);
      alert(t('error_update', { defaultValue: 'حدث خطأ أثناء التحديث' }));
    } finally {
      setSubmitting(false);
    }
  };

  // فتح نافذة التعديل
  const openEditDialog = (parasite: Parasite) => {
    setSelectedParasite(parasite);
    setEditData({
      name: parasite.name,
      scientificName: parasite.scientificName,
      type: parasite.type,
      stage: parasite.stage,
      description: parasite.description,
    });
    setAction('edit');
    setDialogOpen(true);
  };

  const isSupervisor = user?.role === 'professor' || user?.role === 'admin';

  // جاري التحميل
  if (authLoading || parasitesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress sx={{ color: '#FFD700' }} />
            <Typography sx={{ color: alpha('#ffffff', 0.7) }}>
              {t('loading', { defaultValue: 'جاري التحميل...' })}
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  // إذا ما في user
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" icon={<AlertCircle size={24} />}>
          {t('error_login_required', { defaultValue: 'يجب تسجيل الدخول أولاً للدخول إلى صفحة المراجعة' })}
        </Alert>
      </Container>
    );
  }

  // التحقق من الكود السري للأساتذة
  if (isSupervisor && !isVerified) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: alpha('#2d4a3f', 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#FFD700', 0.3)}`,
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Shield size={64} color="#FFD700" />
          </Box>

          <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 700, mb: 2 }}>
            {t('verify_title', { defaultValue: '🔐 التحقق من الهوية' })}
          </Typography>

          <Typography sx={{ color: alpha('#ffffff', 0.7), mb: 4 }}>
            {t('verify_subtitle', { defaultValue: 'أدخل الكود السري للدخول لصفحة المراجعة' })}
          </Typography>

          <TextField
            fullWidth
            type="password"
            placeholder={t('verify_placeholder', { defaultValue: 'الكود السري' })}
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
            error={!!codeError}
            helperText={codeError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} color="#FFD700" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: alpha('#FFD700', 0.3) },
                '&:hover fieldset': { borderColor: alpha('#FFD700', 0.5) },
                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleVerifyCode}
            startIcon={<Shield size={20} />}
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#2d4a3f',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
              },
            }}
          >
            {t('verify_button', { defaultValue: 'تحقق' })}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ===== HEADER ===== */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {isSupervisor ? (
            <Shield size={32} color="#FFD700" />
          ) : (
            <ImageIcon size={32} color="#FFD700" />
          )}
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFD700' }}>
            {isSupervisor
              ? t('review_title_professor', { defaultValue: '📋 لوحة المراجعة' })
              : t('review_title_student', { defaultValue: '📋 حالة صوري' })}
          </Typography>
        </Stack>

        {/* الإحصائيات */}
        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
          <Chip
            icon={<Clock size={16} />}
            label={`${t('status_pending', { defaultValue: 'قيد المراجعة' })}: ${stats.pending}`}
            sx={{
              bgcolor: alpha('#FFD700', 0.2),
              color: '#FFD700',
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<CheckCircle size={16} />}
            label={`${t('status_approved', { defaultValue: 'مقبولة' })}: ${stats.approved}`}
            sx={{
              bgcolor: alpha('#10b981', 0.2),
              color: '#10b981',
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<XCircle size={16} />}
            label={`${t('status_rejected', { defaultValue: 'مرفوضة' })}: ${stats.rejected}`}
            sx={{
              bgcolor: alpha('#ef4444', 0.2),
              color: '#ef4444',
              fontWeight: 600,
            }}
          />
        </Stack>

        {/* فلاتر الحالة */}
        <Tabs
          value={statusFilter}
          onChange={(_, value) => setStatusFilter(value)}
          sx={{
            '& .MuiTab-root': {
              color: alpha('#ffffff', 0.6),
              '&.Mui-selected': { color: '#FFD700' },
            },
            '& .MuiTabs-indicator': { bgcolor: '#FFD700' },
          }}
        >
          <Tab value="pending" label={t('filter_pending', { defaultValue: 'قيد المراجعة' })} />
          <Tab value="approved" label={t('filter_approved', { defaultValue: 'مقبولة' })} />
          <Tab value="rejected" label={t('filter_rejected', { defaultValue: 'مرفوضة' })} />
          <Tab value="all" label={t('filter_all', { defaultValue: 'الكل' })} />
        </Tabs>
      </Box>

      {/* ===== لا توجد صور ===== */}
      {filteredParasites.length === 0 ? (
        <Alert
          severity="info"
          icon={<AlertCircle size={24} />}
          sx={{
            bgcolor: alpha('#2d4a3f', 0.6),
            color: '#ffffff',
            border: `1px solid ${alpha('#FFD700', 0.2)}`,
          }}
        >
          {statusFilter === 'pending'
            ? t('no_pending', { defaultValue: 'لا توجد صور قيد المراجعة حالياً ✅' })
            : t('no_results', { defaultValue: 'لا توجد نتائج' })}
        </Alert>
      ) : (
        /* ===== GRID ===== */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredParasites.map((parasite) => (
            <Card
              key={parasite.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: alpha('#2d4a3f', 0.6),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#FFD700', 0.2)}`,
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 24px ${alpha('#FFD700', 0.15)}`,
                  borderColor: alpha('#FFD700', 0.4),
                },
              }}
            >
              {/* الصورة مع Badge الحالة */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(parasite)}
                  alt={parasite.scientificName || parasite.name}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/400x300?text=No+Image';
                  }}
                />

                {/* Badge الحالة */}
                <Chip
                  size="small"
                  icon={
                    parasite.status === 'pending' ? <Clock size={14} /> :
                    parasite.status === 'approved' ? <CheckCircle size={14} /> :
                    <XCircle size={14} />
                  }
                  label={
                    parasite.status === 'pending' ? t('status_pending', { defaultValue: 'قيد المراجعة' }) :
                    parasite.status === 'approved' ? t('status_approved', { defaultValue: 'مقبولة' }) :
                    t('status_rejected', { defaultValue: 'مرفوضة' })
                  }
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor:
                      parasite.status === 'pending' ? alpha('#FFD700', 0.9) :
                      parasite.status === 'approved' ? alpha('#10b981', 0.9) :
                      alpha('#ef4444', 0.9),
                    color: parasite.status === 'pending' ? '#2d4a3f' : '#ffffff',
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* المحتوى */}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#FFD700' }}>
                  {parasite.scientificName || parasite.name}
                </Typography>

                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 2 }}>
                  {parasite.name}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
                  {parasite.type && (
                    <Chip
                      label={parasite.type}
                      size="small"
                      sx={{
                        bgcolor: alpha('#FFD700', 0.1),
                        color: '#FFD700',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                  {parasite.stage && (
                    <Chip
                      label={parasite.stage}
                      size="small"
                      sx={{
                        bgcolor: alpha('#10b981', 0.1),
                        color: '#10b981',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                </Stack>

                {/* ملاحظات المراجعة للمرفوضة */}
                {parasite.status === 'rejected' && parasite.reviewNotes && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      py: 0.5,
                      fontSize: '0.75rem',
                      bgcolor: alpha('#ef4444', 0.1),
                      color: '#ef4444',
                    }}
                  >
                    {parasite.reviewNotes}
                  </Alert>
                )}

                {/* الأزرار */}
                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Eye size={16} />}
                    onClick={() => {
                      setSelectedParasite(parasite);
                      setAction('view');
                      setDialogOpen(true);
                    }}
                    fullWidth
                    sx={{
                      color: '#FFD700',
                      borderColor: alpha('#FFD700', 0.4),
                      '&:hover': {
                        borderColor: '#FFD700',
                        bgcolor: alpha('#FFD700', 0.1),
                      },
                    }}
                  >
                    {t('btn_view', { defaultValue: 'عرض التفاصيل' })}
                  </Button>

                  {isSupervisor && parasite.status === 'pending' && (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit size={16} />}
                        onClick={() => openEditDialog(parasite)}
                        fullWidth
                        sx={{
                          color: '#60a5fa',
                          borderColor: alpha('#60a5fa', 0.4),
                          '&:hover': {
                            borderColor: '#60a5fa',
                            bgcolor: alpha('#60a5fa', 0.1),
                          },
                        }}
                      >
                        {t('btn_edit', { defaultValue: 'تعديل' })}
                      </Button>

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircle size={16} />}
                          onClick={() => {
                            setSelectedParasite(parasite);
                            setAction('approve');
                            setReviewNotes('');
                            setDialogOpen(true);
                          }}
                          fullWidth
                          sx={{
                            bgcolor: alpha('#10b981', 0.8),
                            '&:hover': { bgcolor: '#10b981' },
                          }}
                        >
                          {t('btn_approve', { defaultValue: 'قبول' })}
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<XCircle size={16} />}
                          onClick={() => {
                            setSelectedParasite(parasite);
                            setAction('reject');
                            setReviewNotes('');
                            setDialogOpen(true);
                          }}
                          fullWidth
                          sx={{
                            bgcolor: alpha('#ef4444', 0.8),
                            '&:hover': { bgcolor: '#ef4444' },
                          }}
                        >
                          {t('btn_reject', { defaultValue: 'رفض' })}
                        </Button>
                      </Stack>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* ===== DIALOG ===== */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: alpha('#2d4a3f', 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#FFD700', 0.2)}`,
          },
        }}
      >
        <DialogTitle sx={{ color: '#FFD700', fontWeight: 700 }}>
          {action === 'view' && t('dialog_view', { defaultValue: '📋 تفاصيل العينة' })}
          {action === 'approve' && t('dialog_approve', { defaultValue: '✅ موافقة على الصورة' })}
          {action === 'reject' && t('dialog_reject', { defaultValue: '❌ رفض الصورة' })}
          {action === 'edit' && t('dialog_edit', { defaultValue: '✏️ تعديل العينة' })}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedParasite && (
            <Stack spacing={2}>
              {/* الصورة (للعرض فقط) */}
              {action !== 'edit' && (
                <Box
                  component="img"
                  src={getImageUrl(selectedParasite)}
                  alt={selectedParasite.scientificName || selectedParasite.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 300,
                    objectFit: 'contain',
                    borderRadius: 2,
                    border: `1px solid ${alpha('#FFD700', 0.2)}`,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/400x300?text=No+Image';
                  }}
                />
              )}

              {/* نموذج التعديل */}
              {action === 'edit' ? (
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label={t('label_scientific_name', { defaultValue: 'الاسم العلمي' })}
                    value={editData.scientificName || ''}
                    onChange={(e) => setEditData({ ...editData, scientificName: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: alpha('#FFD700', 0.3) },
                      },
                      '& .MuiInputLabel-root': { color: alpha('#ffffff', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t('label_common_name', { defaultValue: 'الاسم الشائع' })}
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: alpha('#FFD700', 0.3) },
                      },
                      '& .MuiInputLabel-root': { color: alpha('#ffffff', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t('label_type', { defaultValue: 'النوع' })}
                    value={editData.type || ''}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: alpha('#FFD700', 0.3) },
                      },
                      '& .MuiInputLabel-root': { color: alpha('#ffffff', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t('label_stage', { defaultValue: 'المرحلة' })}
                    value={editData.stage || ''}
                    onChange={(e) => setEditData({ ...editData, stage: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: alpha('#FFD700', 0.3) },
                      },
                      '& .MuiInputLabel-root': { color: alpha('#ffffff', 0.7) },
                    }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label={t('label_description', { defaultValue: 'الوصف' })}
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: alpha('#FFD700', 0.3) },
                      },
                      '& .MuiInputLabel-root': { color: alpha('#ffffff', 0.7) },
                    }}
                  />
                </Stack>
              ) : (
                /* التفاصيل */
                <Box>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                    <strong>{t('label_scientific_name', { defaultValue: 'الاسم العلمي' })}:</strong>{' '}
                    {selectedParasite.scientificName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                    <strong>{t('label_common_name', { defaultValue: 'الاسم الشائع' })}:</strong>{' '}
                    {selectedParasite.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                    <strong>{t('label_type', { defaultValue: 'النوع' })}:</strong>{' '}
                    {selectedParasite.type}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                    <strong>{t('label_stage', { defaultValue: 'المرحلة' })}:</strong>{' '}
                    {selectedParasite.stage}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                    <strong>{t('label_description', { defaultValue: 'الوصف' })}:</strong>{' '}
                    {selectedParasite.description}
                  </Typography>
                  {selectedParasite.studentName && (
                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                      <strong>{t('label_student', { defaultValue: 'الطالب' })}:</strong>{' '}
                      {selectedParasite.studentName}
                    </Typography>
                  )}
                </Box>
              )}

              {/* ملاحظات المراجعة */}
              {isSupervisor && (action === 'approve' || action === 'reject') && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={
                    action === 'reject'
                      ? t('placeholder_reject_notes', { defaultValue: 'سبب الرفض (مطلوب)...' })
                      : t('placeholder_approve_notes', { defaultValue: 'ملاحظات إضافية (اختياري)...' })
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  required={action === 'reject'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      '& fieldset': { borderColor: alpha('#FFD700', 0.3) },
                      '&:hover fieldset': { borderColor: alpha('#FFD700', 0.5) },
                    },
                  }}
                />
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: alpha('#ffffff', 0.7) }}>
            {t('btn_close', { defaultValue: 'إغلاق' })}
          </Button>

          {action === 'edit' && (
            <Button
              variant="contained"
              onClick={handleSaveEdit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : <CheckCircle size={16} />}
              sx={{
                bgcolor: '#60a5fa',
                '&:hover': { bgcolor: '#3b82f6' },
              }}
            >
              {submitting ? t('saving', { defaultValue: 'جاري الحفظ...' }) : t('btn_save', { defaultValue: 'حفظ' })}
            </Button>
          )}

          {action === 'approve' && (
            <Button
              variant="contained"
              onClick={handleApprove}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : <CheckCircle size={16} />}
              sx={{
                bgcolor: alpha('#10b981', 0.8),
                '&:hover': { bgcolor: '#10b981' },
              }}
            >
              {submitting ? t('approving', { defaultValue: 'جاري...' }) : t('btn_approve', { defaultValue: 'موافقة' })}
            </Button>
          )}

          {action === 'reject' && (
            <Button
              variant="contained"
              onClick={handleReject}
              disabled={submitting || !reviewNotes.trim()}
              startIcon={submitting ? <CircularProgress size={16} /> : <XCircle size={16} />}
              sx={{
                bgcolor: alpha('#ef4444', 0.8),
                '&:hover': { bgcolor: '#ef4444' },
              }}
            >
              {submitting ? t('rejecting', { defaultValue: 'جاري...' }) : t('btn_reject', { defaultValue: 'رفض' })}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewParasites;