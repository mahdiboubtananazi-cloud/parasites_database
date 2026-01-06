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
  Paper,
  InputAdornment,
  Tabs,
  Tab,
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
  Image as ImageIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useParasites } from '../hooks/useParasites';
import { Parasite } from '../types/parasite';
import { parasitesApi } from '../api/parasites';

const PROFESSOR_SECRET_CODE = 'PROF2024';

const getImageUrl = (parasite: Parasite): string => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const DEFAULT_IMAGE = 'https://placehold.co/400x300?text=No+Image';
  const imageValue = parasite.imageUrl;

  if (!imageValue) return DEFAULT_IMAGE;
  if (imageValue.startsWith('http')) return imageValue;
  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/parasite-images/${imageValue}`;
  }
  return DEFAULT_IMAGE;
};

const ReviewParasites = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { parasites: allParasites, loading: parasitesLoading, refetch } = useParasites();

  const [isVerified, setIsVerified] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedParasite, setSelectedParasite] = useState<Parasite | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'view' | 'edit'>('view');
  const [submitting, setSubmitting] = useState(false);
  const [editData, setEditData] = useState<Partial<Parasite>>({});

  const handleVerifyCode = () => {
    if (secretCode === PROFESSOR_SECRET_CODE) {
      setIsVerified(true);
      setCodeError('');
      localStorage.setItem('professor_verified', 'true');
    } else {
      setCodeError(t('error_invalid_code', { defaultValue: 'الكود غير صحيح' }));
    }
  };

  useEffect(() => {
    const verified = localStorage.getItem('professor_verified');
    if (verified === 'true') setIsVerified(true);
  }, []);

  const filteredParasites = React.useMemo(() => {
    if (!allParasites) return [];
    let filtered = allParasites;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    
    // ✅ إظهار الصور للجميع مؤقتاً للتأكد
    // if (user?.role === 'student') {
    //   filtered = filtered.filter((p) => p.uploadedBy === user.id);
    // }

    return filtered;
  }, [allParasites, statusFilter, user]);

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

  const isSupervisor = user?.role === 'professor' || user?.role === 'admin';

  if (authLoading || parasitesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" icon={<AlertCircle size={24} />}>
          {t('error_login_required', { defaultValue: 'يجب تسجيل الدخول أولاً' })}
        </Alert>
      </Container>
    );
  }

  if (isSupervisor && !isVerified) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center', border: '1px solid #FFD700' }}>
          <Shield size={64} color="#FFD700" style={{ marginBottom: 20 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>{t('verify_title', { defaultValue: '🔐 التحقق من الهوية' })}</Typography>
          <TextField
            fullWidth
            type="password"
            placeholder={t('verify_placeholder', { defaultValue: 'الكود السري' })}
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            error={!!codeError}
            helperText={codeError}
            InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={20} /></InputAdornment> }}
            sx={{ mb: 3 }}
          />
          <Button fullWidth variant="contained" onClick={handleVerifyCode}>
            {t('verify_button', { defaultValue: 'تحقق' })}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {isSupervisor ? <Shield size={32} color="#FFD700" /> : <ImageIcon size={32} color="#FFD700" />}
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFD700' }}>
            {isSupervisor ? t('review_title_professor', { defaultValue: '📋 لوحة المراجعة' }) : t('review_title_student', { defaultValue: '📋 حالة صوري' })}
          </Typography>
        </Stack>
        <Tabs value={statusFilter} onChange={(_, v) => setStatusFilter(v)} sx={{ '& .MuiTab-root': { color: '#fff' }, '& .Mui-selected': { color: '#FFD700' } }}>
          <Tab value="pending" label={t('filter_pending', { defaultValue: 'قيد المراجعة' })} />
          <Tab value="approved" label={t('filter_approved', { defaultValue: 'مقبولة' })} />
          <Tab value="rejected" label={t('filter_rejected', { defaultValue: 'مرفوضة' })} />
          <Tab value="all" label={t('filter_all', { defaultValue: 'الكل' })} />
        </Tabs>
      </Box>

      {filteredParasites.length === 0 ? (
        <Alert severity="info">{t('no_results', { defaultValue: 'لا توجد نتائج' })}</Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredParasites.map((parasite) => (
            <Card key={parasite.id} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              <CardMedia component="img" height="200" image={getImageUrl(parasite)} alt={parasite.name} />
              <CardContent>
                <Typography variant="h6">{parasite.name}</Typography>
                <Chip label={parasite.status} size="small" sx={{ mt: 1, bgcolor: parasite.status === 'approved' ? 'green' : parasite.status === 'rejected' ? 'red' : 'orange' }} />
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" onClick={() => { setSelectedParasite(parasite); setAction('view'); setDialogOpen(true); }}>
                    {t('btn_view', { defaultValue: 'عرض' })}
                  </Button>
                  {isSupervisor && parasite.status === 'pending' && (
                    <>
                      <Button variant="contained" color="success" size="small" onClick={() => { setSelectedParasite(parasite); setAction('approve'); setDialogOpen(true); }}>
                        قبول
                      </Button>
                      <Button variant="contained" color="error" size="small" onClick={() => { setSelectedParasite(parasite); setAction('reject'); setDialogOpen(true); }}>
                        رفض
                      </Button>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{action === 'approve' ? '✅ قبول' : action === 'reject' ? '❌ رفض' : '📋 تفاصيل'}</DialogTitle>
        <DialogContent>
          {selectedParasite && (
            <Box sx={{ pt: 2 }}>
              <img src={getImageUrl(selectedParasite)} alt={selectedParasite.name} style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
              <Typography><strong>الاسم:</strong> {selectedParasite.name}</Typography>
              <Typography><strong>النوع:</strong> {selectedParasite.type}</Typography>
              {(action === 'approve' || action === 'reject') && (
                <TextField
                  fullWidth multiline rows={3}
                  placeholder="ملاحظات..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>إغلاق</Button>
          {action === 'approve' && <Button variant="contained" color="success" onClick={handleApprove} disabled={submitting}>تأكيد القبول</Button>}
          {action === 'reject' && <Button variant="contained" color="error" onClick={handleReject} disabled={submitting}>تأكيد الرفض</Button>}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewParasites;