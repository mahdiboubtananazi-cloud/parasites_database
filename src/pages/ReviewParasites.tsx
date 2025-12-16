import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
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
} from '@mui/material';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext.tsx';
import { supabase } from '../lib/supabase';

interface Parasite {
  id: string;
  name: string;
  scientificname: string;
  type: string;
  description: string;
  stage: string;
  sampletype: string;
  imageurl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_by: string;
  review_notes: string | null;
  reviewed_at: string | null;
  createdat: string;
}

const ReviewParasites = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [parasitesLoading, setParasitesLoading] = useState(true);
  const [selectedParasite, setSelectedParasite] = useState<Parasite | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'view'>('view');
  const [submitting, setSubmitting] = useState(false);

  // ✅ احصل على الصور عند تحميل الـ user
  useEffect(() => {
    if (user) {
      fetchPendingParasites(user.role || 'student', user.id);
    }
  }, [user]);

  const fetchPendingParasites = async (role: string, userId: string) => {
    try {
      console.log('📸 Fetching parasites for role:', role);
      setParasitesLoading(true);

      let query = supabase
        .from('parasites')
        .select('*')
        .eq('status', 'pending')
        .order('createdat', { ascending: false });

      // ✅ الطالب يشوف صوره هو فقط
      if (role === 'student') {
        query = query.eq('uploaded_by', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('🔴 Error fetching parasites:', error);
        return;
      }

      console.log('✅ Parasites loaded:', data?.length || 0);
      setParasites(data || []);
    } catch (error) {
      console.error('🔴 Error in fetchPendingParasites:', error);
    } finally {
      setParasitesLoading(false);
    }
  };

  // ✅ الموافقة على الصورة
  const handleApprove = async () => {
    if (!selectedParasite || !user) return;

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('parasites')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || null,
        })
        .eq('id', selectedParasite.id);

      if (error) throw error;

      // ✅ حدّث القائمة
      setParasites(
        parasites.filter((p) => p.id !== selectedParasite.id)
      );

      setDialogOpen(false);
      setReviewNotes('');
      setSelectedParasite(null);
    } catch (error) {
      console.error('Error approving parasite:', error);
      alert('حدث خطأ أثناء الموافقة');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ رفض الصورة
  const handleReject = async () => {
    if (!selectedParasite || !reviewNotes.trim() || !user) {
      alert('الرجاء إضافة ملاحظة عند الرفض');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('parasites')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes,
        })
        .eq('id', selectedParasite.id);

      if (error) throw error;

      // ✅ حدّث القائمة
      setParasites(
        parasites.filter((p) => p.id !== selectedParasite.id)
      );

      setDialogOpen(false);
      setReviewNotes('');
      setSelectedParasite(null);
    } catch (error) {
      console.error('Error rejecting parasite:', error);
      alert('حدث خطأ أثناء الرفض');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ الحالة: مشرف/أستاذ أم طالب
  const isSupervisor = user?.role === 'professor' || user?.role === 'admin';

  // ✅ جاري التحميل
  if (authLoading || parasitesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // ✅ إذا ما في user - اعرض رسالة
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" icon={<AlertCircle size={24} />}>
          يجب تسجيل الدخول أولاً للدخول إلى صفحة المراجعة 🔐
        </Alert>
      </Container>
    );
  }

  // ✅ لا توجد صور قيد المراجعة
  if (parasites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" icon={<AlertCircle size={24} />}>
          {isSupervisor
            ? 'لا توجد صور قيد المراجعة حالياً. جميع الصور معتمدة! ✅'
            : 'جميع صورك معتمدة! ✅ شكراً على المساهمة'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ===== HEADER ===== */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#FFD700' }}>
          {isSupervisor ? '📋 المراجعة' : '📋 حالة صوري'}
        </Typography>
        <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
          {isSupervisor
            ? `إجمالي ${parasites.length} صورة قيد المراجعة`
            : `لديك ${parasites.length} صورة قيد المراجعة`}
        </Typography>
      </Box>

      {/* ===== GRID ===== */}
      <Grid container spacing={3}>
        {parasites.map((parasite) => (
          <Grid
            key={parasite.id}
            sx={{
              display: 'grid',
              gridColumn: { xs: '1 / -1', sm: 'span 6', md: 'span 4' },
            }}
          >
            <Card
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
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 24px ${alpha('#FFD700', 0.15)}`,
                  borderColor: alpha('#FFD700', 0.4),
                },
              }}
            >
              {/* ===== IMAGE ===== */}
              <Badge
                badgeContent={<Clock size={16} />}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#FFD700',
                    color: '#2d4a3f',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={parasite.imageurl}
                  alt={parasite.scientificname}
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                  }}
                />
              </Badge>

              {/* ===== CONTENT ===== */}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#FFD700' }}>
                  {parasite.scientificname}
                </Typography>

                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 2 }}>
                  {parasite.name}
                </Typography>

                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={`النوع: ${parasite.type}`}
                    size="small"
                    sx={{
                      backgroundColor: alpha('#FFD700', 0.1),
                      color: '#FFD700',
                    }}
                  />
                  <Chip
                    label={`المرحلة: ${parasite.stage || 'غير محدد'}`}
                    size="small"
                    sx={{
                      backgroundColor: alpha('#FFD700', 0.1),
                      color: '#FFD700',
                    }}
                  />
                </Stack>

                {/* ===== ACTIONS ===== */}
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
                        backgroundColor: alpha('#FFD700', 0.1),
                      },
                    }}
                  >
                    عرض التفاصيل
                  </Button>

                  {isSupervisor && (
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
                          background: alpha('#10b981', 0.8),
                          '&:hover': { background: '#10b981' },
                        }}
                      >
                        موافقة
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
                          background: alpha('#ef4444', 0.8),
                          '&:hover': { background: '#ef4444' },
                        }}
                      >
                        رفض
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
          {action === 'view' && 'تفاصيل العينة'}
          {action === 'approve' && '✅ موافقة على الصورة'}
          {action === 'reject' && '❌ رفض الصورة'}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedParasite && (
            <Stack spacing={2}>
              {/* الصورة */}
              <Box
                component="img"
                src={selectedParasite.imageurl}
                alt={selectedParasite.scientificname}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  border: `1px solid ${alpha('#FFD700', 0.2)}`,
                }}
              />

              {/* التفاصيل */}
              <Box>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                  <strong>الاسم العلمي:</strong> {selectedParasite.scientificname}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                  <strong>الاسم الشائع:</strong> {selectedParasite.name}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7), mb: 1 }}>
                  <strong>الوصف:</strong> {selectedParasite.description}
                </Typography>
              </Box>

              {/* ملاحظات المراجعة (للمشرف فقط) */}
              {isSupervisor && (action === 'approve' || action === 'reject') && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="أضف ملاحظات المراجعة..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      '& fieldset': {
                        borderColor: alpha('#FFD700', 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha('#FFD700', 0.5),
                      },
                    },
                  }}
                />
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ color: alpha('#ffffff', 0.7) }}
          >
            إغلاق
          </Button>

          {isSupervisor && action === 'approve' && (
            <Button
              variant="contained"
              onClick={handleApprove}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : <CheckCircle size={16} />}
              sx={{
                background: alpha('#10b981', 0.8),
                '&:hover': { background: '#10b981' },
              }}
            >
              {submitting ? 'جاري...' : 'موافقة'}
            </Button>
          )}

          {isSupervisor && action === 'reject' && (
            <Button
              variant="contained"
              onClick={handleReject}
              disabled={submitting || !reviewNotes.trim()}
              startIcon={submitting ? <CircularProgress size={16} /> : <XCircle size={16} />}
              sx={{
                background: alpha('#ef4444', 0.8),
                '&:hover': { background: '#ef4444' },
              }}
            >
              {submitting ? 'جاري...' : 'رفض'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewParasites;