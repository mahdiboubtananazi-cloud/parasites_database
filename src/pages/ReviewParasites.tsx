import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton,
  Tooltip,
  Grid,
  Divider,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
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
  Search,
  Filter,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
  Calendar,
  User,
  FileText,
  Download,
  Share2,
  Trash2,
  MoreVertical,
  ZoomIn,
  Image as ImagePlus,
  ArrowLeftRight,
  SlidersHorizontal,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Send,
  Lightbulb,
  ChevronDown,
  Grid3x3,
  List as ListIcon,
  SortAsc,
  Award,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useParasites } from '../hooks/useParasites';
import { Parasite } from '../types/parasite';
import { parasitesApi } from '../api/parasites';

const PROFESSOR_SECRET_CODE = 'PROF2024';

// ==================== Types ====================
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  timestamp: string;
  type: 'comment' | 'suggestion' | 'issue';
}

interface QualityCheck {
  imageQuality: number;
  dataCompleteness: number;
  scientificAccuracy: number;
  overallScore: number;
}

// ==================== Helper Functions ====================
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

const calculateQualityScore = (parasite: Parasite): QualityCheck => {
  let imageQuality = 0;
  let dataCompleteness = 0;
  let scientificAccuracy = 0;

  // Image quality check
  if (parasite.imageUrl) imageQuality += 50;
  
  // Data completeness check
  if (parasite.scientificName) dataCompleteness += 20;
  if (parasite.name) dataCompleteness += 15;
  if (parasite.type) dataCompleteness += 15;
  if (parasite.stage) dataCompleteness += 15;
  if (parasite.description && parasite.description.length > 50) dataCompleteness += 15;
  if (parasite.host) dataCompleteness += 10;
  if (parasite.location) dataCompleteness += 10;

  // Scientific accuracy check
  if (parasite.scientificName && parasite.scientificName.length > 5) scientificAccuracy += 30;
  if (parasite.type) scientificAccuracy += 30;
  if (parasite.stage) scientificAccuracy += 20;
  if (parasite.description && parasite.description.length > 100) scientificAccuracy += 20;

  const overallScore = Math.round((imageQuality + dataCompleteness + scientificAccuracy) / 3);

  return { imageQuality, dataCompleteness, scientificAccuracy, overallScore };
};

const getQualityColor = (score: number): string => {
  if (score >= 80) return '#4caf50';
  if (score >= 60) return '#ff9800';
  if (score >= 40) return '#ff5722';
  return '#f44336';
};

const getQualityLabel = (score: number): string => {
  if (score >= 80) return 'ممتاز';
  if (score >= 60) return 'جيد';
  if (score >= 40) return 'مقبول';
  return 'يحتاج تحسين';
};

// ==================== Main Component ====================
const ReviewParasites = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { parasites: allParasites, loading: parasitesLoading, refetch } = useParasites();

  // State Management
  const [isVerified, setIsVerified] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedParasite, setSelectedParasite] = useState<Parasite | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'view' | 'edit' | 'compare'>('view');
  const [submitting, setSubmitting] = useState(false);
  const [editData, setEditData] = useState<Partial<Parasite>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'quality' | 'student'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [qualityFilter, setQualityFilter] = useState<'all' | 'excellent' | 'good' | 'needsWork'>('all');
  
  // Comments & Suggestions
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'suggestion' | 'issue'>('comment');
  
  // Rating & Quality
  const [imageQualityRating, setImageQualityRating] = useState(0);
  const [scientificAccuracyRating, setScientificAccuracyRating] = useState(0);
  
  // Image comparison
  const [showImageComparison, setShowImageComparison] = useState(false);
  const [comparisonImage, setComparisonImage] = useState<File | null>(null);
  
  // Bulk actions
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);
  
  // Advanced filters
  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuParasiteId, setMenuParasiteId] = useState<string | null>(null);

  const isSupervisor = user?.role === 'professor' || user?.role === 'admin';

  // ==================== Effects ====================
  useEffect(() => {
    const verified = localStorage.getItem('professor_verified');
    if (verified === 'true') setIsVerified(true);
  }, []);

  useEffect(() => {
    // Load comments from localStorage (in production, fetch from API)
    if (selectedParasite) {
      const storedComments = localStorage.getItem(`comments_${selectedParasite.id}`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        setComments([]);
      }
    }
  }, [selectedParasite]);

  // ==================== Handlers ====================
  const handleVerifyCode = () => {
    if (secretCode === PROFESSOR_SECRET_CODE) {
      setIsVerified(true);
      setCodeError('');
      localStorage.setItem('professor_verified', 'true');
    } else {
      setCodeError(t('error_invalid_code', { defaultValue: 'الكود غير صحيح' }));
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user || !selectedParasite) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id || '',
      userName: user.name || 'مستخدم',
      userRole: user.role || 'student',
      message: newComment,
      timestamp: new Date().toISOString(),
      type: commentType,
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${selectedParasite.id}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

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

  const handleBulkApprove = async () => {
    if (selectedItems.size === 0) return;
    
    try {
      setSubmitting(true);
      const promises = Array.from(selectedItems).map(id =>
        parasitesApi.update(id, {
          status: 'approved',
          reviewedBy: user?.id,
          reviewedAt: new Date().toISOString(),
        })
      );
      await Promise.all(promises);
      await refetch();
      setSelectedItems(new Set());
      setBulkActionMode(false);
    } catch (error) {
      console.error('Error bulk approving:', error);
      alert('حدث خطأ أثناء الموافقة الجماعية');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedItems.size === 0) return;
    
    const reason = prompt('الرجاء إدخال سبب الرفض:');
    if (!reason) return;
    
    try {
      setSubmitting(true);
      const promises = Array.from(selectedItems).map(id =>
        parasitesApi.update(id, {
          status: 'rejected',
          reviewedBy: user?.id,
          reviewedAt: new Date().toISOString(),
          reviewNotes: reason,
        })
      );
      await Promise.all(promises);
      await refetch();
      setSelectedItems(new Set());
      setBulkActionMode(false);
    } catch (error) {
      console.error('Error bulk rejecting:', error);
      alert('حدث خطأ أثناء الرفض الجماعي');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const openEditDialog = (parasite: Parasite) => {
    setSelectedParasite(parasite);
    setEditData({
      name: parasite.name,
      scientificName: parasite.scientificName,
      type: parasite.type,
      stage: parasite.stage,
      description: parasite.description,
      host: parasite.host,
      location: parasite.location,
      sampleType: parasite.sampleType,
      stainColor: parasite.stainColor,
    });
    setAction('edit');
    setDialogOpen(true);
  };

  const openViewDialog = (parasite: Parasite) => {
    setSelectedParasite(parasite);
    setAction('view');
    setDialogOpen(true);
  };

  const openActionMenu = (event: React.MouseEvent<HTMLElement>, parasiteId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuParasiteId(parasiteId);
  };

  const closeActionMenu = () => {
    setAnchorEl(null);
    setMenuParasiteId(null);
  };

  // ==================== Computed Values ====================
  const filteredParasites = useMemo(() => {
    if (!allParasites) return [];
    let filtered = allParasites;
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    
    // User filter
    if (!isSupervisor && user) {
      filtered = filtered.filter((p) => p.studentName === user.name || p.uploadedBy === user.id);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(query) ||
        p.scientificName?.toLowerCase().includes(query) ||
        p.studentName?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }
    
    // Student filter
    if (studentFilter !== 'all') {
      filtered = filtered.filter((p) => p.studentName === studentFilter);
    }
    
    // Date filter
    if (dateFilter !== 'all' && isSupervisor) {
      const now = new Date();
      filtered = filtered.filter((p) => {
        if (!p.createdAt) return false;
        const created = new Date(p.createdAt);
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'today') return diffDays <= 1;
        if (dateFilter === 'week') return diffDays <= 7;
        if (dateFilter === 'month') return diffDays <= 30;
        return true;
      });
    }
    
    // Quality filter
    if (qualityFilter !== 'all') {
      filtered = filtered.filter((p) => {
        const quality = calculateQualityScore(p);
        if (qualityFilter === 'excellent') return quality.overallScore >= 80;
        if (qualityFilter === 'good') return quality.overallScore >= 60 && quality.overallScore < 80;
        if (qualityFilter === 'needsWork') return quality.overallScore < 60;
        return true;
      });
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
      if (sortBy === 'quality') {
        return calculateQualityScore(b).overallScore - calculateQualityScore(a).overallScore;
      }
      if (sortBy === 'student') {
        return (a.studentName || '').localeCompare(b.studentName || '');
      }
      return 0;
    });

    return filtered;
  }, [allParasites, statusFilter, user, isSupervisor, searchQuery, studentFilter, dateFilter, qualityFilter, sortBy]);

  const stats = useMemo(() => {
    if (!allParasites) return { pending: 0, approved: 0, rejected: 0, totalQuality: 0 };
    
    const pending = allParasites.filter((p) => p.status === 'pending').length;
    const approved = allParasites.filter((p) => p.status === 'approved').length;
    const rejected = allParasites.filter((p) => p.status === 'rejected').length;
    
    const totalQuality = allParasites.reduce((acc, p) => {
      return acc + calculateQualityScore(p).overallScore;
    }, 0) / (allParasites.length || 1);
    
    return { pending, approved, rejected, totalQuality: Math.round(totalQuality) };
  }, [allParasites]);

  const uniqueStudents = useMemo(() => {
    if (!allParasites) return [];
    return [...new Set(allParasites.map(p => p.studentName).filter(Boolean))];
  }, [allParasites]);

  // ==================== Render Loading ====================
  if (authLoading || parasitesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      </Container>
    );
  }

  // ==================== Render Auth Check ====================
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" icon={<AlertCircle size={24} />}>
          {t('error_login_required', { defaultValue: 'يجب تسجيل الدخول أولاً' })}
        </Alert>
      </Container>
    );
  }

  // ==================== Render Verification ====================
  if (isSupervisor && !isVerified) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center', border: '1px solid #FFD700', bgcolor: '#0d1f15' }}>
          <Shield size={64} color="#FFD700" style={{ marginBottom: 20 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#fff' }}>
            {t('verify_title', { defaultValue: '🔐 التحقق من الهوية' })}
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
              startAdornment: <InputAdornment position="start"><Lock size={20} color="#FFD700" /></InputAdornment>,
              sx: { color: '#fff' }
            }}
            sx={{ mb: 3, '& .MuiOutlinedInput-root fieldset': { borderColor: '#FFD700' } }}
          />
          <Button fullWidth variant="contained" onClick={handleVerifyCode} sx={{ bgcolor: '#FFD700', color: '#000', fontWeight: 'bold' }}>
            {t('verify_button', { defaultValue: 'تحقق' })}
          </Button>
        </Paper>
      </Container>
    );
  }

  // ==================== Main Render ====================
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {isSupervisor ? <Shield size={40} color="#FFD700" /> : <ImageIcon size={40} color="#FFD700" />}
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFD700' }}>
                {isSupervisor ? '📋 لوحة المراجعة المتقدمة' : '📋 حالة العينات الخاصة بي'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {isSupervisor ? 'إدارة ومراجعة العينات المرسلة من الطلاب' : 'تابع حالة العينات التي قمت برفعها'}
              </Typography>
            </Box>
          </Stack>
          
          {isSupervisor && (
            <Stack direction="row" spacing={2}>
              <IconButton onClick={() => refetch()} sx={{ color: '#FFD700' }}>
                <RefreshCw size={20} />
              </IconButton>
              <Button
                variant={bulkActionMode ? 'contained' : 'outlined'}
                startIcon={<CheckCircle size={20} />}
                onClick={() => setBulkActionMode(!bulkActionMode)}
                sx={{ 
                  color: bulkActionMode ? '#000' : '#FFD700',
                  bgcolor: bulkActionMode ? '#FFD700' : 'transparent',
                  borderColor: '#FFD700'
                }}
              >
                {bulkActionMode ? `إلغاء التحديد (${selectedItems.size})` : 'تحديد متعدد'}
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Statistics Cards */}
        {isSupervisor && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', border: '1px solid #ff9800' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      قيد المراجعة
                    </Typography>
                  </Box>
                  <Clock size={40} color="#ff9800" />
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                      {stats.approved}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      تم القبول
                    </Typography>
                  </Box>
                  <CheckCircle size={40} color="#4caf50" />
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', border: '1px solid #f44336' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                      {stats.rejected}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      مرفوضة
                    </Typography>
                  </Box>
                  <XCircle size={40} color="#f44336" />
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(255, 215, 0, 0.1)', border: '1px solid #FFD700' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                      {stats.totalQuality}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      متوسط الجودة
                    </Typography>
                  </Box>
                  <Award size={40} color="#FFD700" />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Bulk Actions Bar */}
        {bulkActionMode && selectedItems.size > 0 && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(255, 215, 0, 0.1)', border: '1px solid #FFD700' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                تم تحديد {selectedItems.size} عينة
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle size={20} />}
                  onClick={handleBulkApprove}
                  disabled={submitting}
                >
                  قبول الكل
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<XCircle size={20} />}
                  onClick={handleBulkReject}
                  disabled={submitting}
                >
                  رفض الكل
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedItems(new Set())}
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  إلغاء التحديد
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Advanced Filters */}
        <Accordion 
          sx={{ 
            bgcolor: '#1a2e25', 
            border: '1px solid rgba(255, 215, 0, 0.2)',
            mb: 3
          }}
        >
          <AccordionSummary expandIcon={<ChevronDown color="#FFD700" />}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <SlidersHorizontal size={24} color="#FFD700" />
              <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                فلاتر متقدمة وبحث
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="ابحث عن عينة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color="#FFD700" />
                      </InputAdornment>
                    ),
                    sx: { color: '#fff' }
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 215, 0, 0.5)' },
                    }
                  }}
                />
              </Grid>

              {/* Status Filter */}
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>الحالة</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    sx={{ color: '#fff' }}
                  >
                    <MenuItem value="pending">⏳ قيد المراجعة</MenuItem>
                    <MenuItem value="approved">✅ مقبولة</MenuItem>
                    <MenuItem value="rejected">❌ مرفوضة</MenuItem>
                    <MenuItem value="all">📁 الكل</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Quality Filter */}
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>الجودة</InputLabel>
                  <Select
                    value={qualityFilter}
                    onChange={(e) => setQualityFilter(e.target.value as any)}
                    sx={{ color: '#fff' }}
                  >
                    <MenuItem value="all">الكل</MenuItem>
                    <MenuItem value="excellent">⭐ ممتاز (80%+)</MenuItem>
                    <MenuItem value="good">👍 جيد (60-79%)</MenuItem>
                    <MenuItem value="needsWork">⚠️ يحتاج تحسين (&lt;60%)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Student Filter */}
              {isSupervisor && (
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>الطالب</InputLabel>
                    <Select
                      value={studentFilter}
                      onChange={(e) => setStudentFilter(e.target.value)}
                      sx={{ color: '#fff' }}
                    >
                      <MenuItem value="all">الكل</MenuItem>
                      {uniqueStudents.map((student) => (
                        <MenuItem key={student} value={student}>
                          {student}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Date Filter */}
              {isSupervisor && (
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>التاريخ</InputLabel>
                    <Select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as any)}
                      sx={{ color: '#fff' }}
                    >
                      <MenuItem value="all">الكل</MenuItem>
                      <MenuItem value="today">اليوم</MenuItem>
                      <MenuItem value="week">هذا الأسبوع</MenuItem>
                      <MenuItem value="month">هذا الشهر</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshCw size={16} />}
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('pending');
                  setQualityFilter('all');
                  setStudentFilter('all');
                  setDateFilter('all');
                }}
                sx={{ color: '#FFD700', borderColor: '#FFD700' }}
              >
                إعادة تعيين الفلاتر
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* View Controls */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, val) => val && setViewMode(val)}
              sx={{ 
                '& .MuiToggleButton-root': { 
                  color: '#fff',
                  borderColor: 'rgba(255, 215, 0, 0.3)',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                  }
                }
              }}
            >
              <ToggleButton value="grid">
                <Grid3x3 size={20} />
              </ToggleButton>
              <ToggleButton value="list">
                <ListIcon size={20} />
              </ToggleButton>
            </ToggleButtonGroup>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>ترتيب حسب</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                sx={{ color: '#fff' }}
              >
                <MenuItem value="date">📅 التاريخ</MenuItem>
                <MenuItem value="quality">⭐ الجودة</MenuItem>
                <MenuItem value="student">👤 الطالب</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            عرض {filteredParasites.length} عينة
          </Typography>
        </Stack>
      </Box>

      {/* Empty State */}
      {filteredParasites.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.05)' }}>
          <BookOpen size={64} color="#FFD700" style={{ marginBottom: 16 }} />
          <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
            لا توجد عينات لعرضها
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {searchQuery ? 'جرب تغيير معايير البحث أو الفلاتر' : 'لا توجد عينات مطابقة للفلاتر المحددة'}
          </Typography>
        </Paper>
      ) : (
        /* Grid/List View */
        viewMode === 'grid' ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {filteredParasites.map((parasite) => {
              const quality = calculateQualityScore(parasite);
              const isSelected = selectedItems.has(parasite.id);
              
              return (
                <Card 
                  key={parasite.id} 
                  sx={{ 
                    bgcolor: '#1a2e25', 
                    color: '#fff', 
                    border: isSelected ? '2px solid #FFD700' : '1px solid rgba(255, 215, 0, 0.2)',
                    transition: 'all 0.3s',
                    position: 'relative',
                    '&:hover': { 
                      transform: 'translateY(-5px)', 
                      borderColor: '#FFD700',
                      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.2)'
                    }
                  }}
                >
                  {bulkActionMode && (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleItemSelection(parasite.id)}
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8, 
                        zIndex: 2,
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFD700' }
                      }}
                    />
                  )}
                  
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia 
                      component="img" 
                      height="200" 
                      image={getImageUrl(parasite)} 
                      alt={parasite.name}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => openViewDialog(parasite)}
                    />
                    
                    {/* Status Badge */}
                    <Chip 
                      label={
                        parasite.status === 'approved' ? 'مقبول' :
                        parasite.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'
                      }
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        bgcolor: 
                          parasite.status === 'approved' ? '#4caf50' : 
                          parasite.status === 'rejected' ? '#f44336' : '#ff9800',
                        color: '#fff',
                        fontWeight: 'bold'
                      }} 
                    />
                    
                    {/* Quality Badge */}
                    <Chip 
                      icon={<Award size={14} />}
                      label={`${quality.overallScore}%`}
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 10, 
                        right: 10, 
                        bgcolor: getQualityColor(quality.overallScore),
                        color: '#fff',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#FFD700', mb: 1 }}>
                      {parasite.scientificName || parasite.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                      {parasite.name}
                    </Typography>
                    
                    {/* Quality Progress Bars */}
                    <Box sx={{ mb: 2 }}>
                      <Stack spacing={1}>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>جودة الصورة</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>{quality.imageQuality}%</Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={quality.imageQuality} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getQualityColor(quality.imageQuality)
                              }
                            }} 
                          />
                        </Box>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>اكتمال البيانات</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>{quality.dataCompleteness}%</Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={quality.dataCompleteness} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getQualityColor(quality.dataCompleteness)
                              }
                            }} 
                          />
                        </Box>
                      </Stack>
                    </Box>
                    
                    {isSupervisor && (
                      <Typography variant="caption" display="block" sx={{ mb: 2, opacity: 0.7 }}>
                        👤 الطالب: {parasite.studentName || 'غير معروف'}
                      </Typography>
                    )}
                    
                    {parasite.createdAt && (
                      <Typography variant="caption" display="block" sx={{ mb: 2, opacity: 0.7 }}>
                        📅 {new Date(parasite.createdAt).toLocaleDateString('ar-EG')}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={1}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        fullWidth 
                        startIcon={<Eye size={16} />}
                        onClick={() => openViewDialog(parasite)}
                        sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                      >
                        عرض
                      </Button>
                      
                      {isSupervisor && parasite.status === 'pending' && (
                        <>
                          <Tooltip title="قبول">
                            <IconButton 
                              size="small" 
                              onClick={() => { 
                                setSelectedParasite(parasite); 
                                setAction('approve'); 
                                setDialogOpen(true); 
                              }} 
                              sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: '#4caf50' }}
                            >
                              <CheckCircle size={20} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="رفض">
                            <IconButton 
                              size="small" 
                              onClick={() => { 
                                setSelectedParasite(parasite); 
                                setAction('reject'); 
                                setDialogOpen(true); 
                              }} 
                              sx={{ bgcolor: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}
                            >
                              <XCircle size={20} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="تعديل">
                            <IconButton 
                              size="small" 
                              onClick={() => openEditDialog(parasite)} 
                              sx={{ bgcolor: 'rgba(33, 150, 243, 0.2)', color: '#2196f3' }}
                            >
                              <Edit size={20} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      
                      {isSupervisor && (
                        <Tooltip title="المزيد">
                          <IconButton 
                            size="small" 
                            onClick={(e) => openActionMenu(e, parasite.id)}
                            sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}
                          >
                            <MoreVertical size={20} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        ) : (
          /* List View */
          <Stack spacing={2}>
            {filteredParasites.map((parasite) => {
              const quality = calculateQualityScore(parasite);
              const isSelected = selectedItems.has(parasite.id);
              
              return (
                <Paper 
                  key={parasite.id}
                  sx={{ 
                    p: 2, 
                    bgcolor: '#1a2e25', 
                    border: isSelected ? '2px solid #FFD700' : '1px solid rgba(255, 215, 0, 0.2)',
                    transition: 'all 0.3s',
                    '&:hover': { 
                      borderColor: '#FFD700',
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)'
                    }
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {bulkActionMode && (
                      <Grid item>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleItemSelection(parasite.id)}
                          sx={{ 
                            color: '#FFD700',
                            '&.Mui-checked': { color: '#FFD700' }
                          }}
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12} sm={2}>
                      <Box 
                        component="img"
                        src={getImageUrl(parasite)}
                        alt={parasite.name}
                        sx={{ 
                          width: '100%', 
                          height: 100, 
                          objectFit: 'cover', 
                          borderRadius: 2,
                          cursor: 'pointer'
                        }}
                        onClick={() => openViewDialog(parasite)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 0.5 }}>
                        {parasite.scientificName || parasite.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
                        {parasite.name}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip 
                          label={
                            parasite.status === 'approved' ? 'مقبول' :
                            parasite.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'
                          }
                          size="small" 
                          sx={{ 
                            bgcolor: 
                              parasite.status === 'approved' ? '#4caf50' : 
                              parasite.status === 'rejected' ? '#f44336' : '#ff9800',
                            color: '#fff'
                          }} 
                        />
                        <Chip 
                          icon={<Award size={14} />}
                          label={`جودة: ${quality.overallScore}%`}
                          size="small" 
                          sx={{ 
                            bgcolor: getQualityColor(quality.overallScore),
                            color: '#fff'
                          }} 
                        />
                      </Stack>
                      
                      {isSupervisor && (
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          👤 {parasite.studentName} • 📅 {parasite.createdAt ? new Date(parasite.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          fullWidth 
                          startIcon={<Eye size={16} />}
                          onClick={() => openViewDialog(parasite)}
                          sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                        >
                          عرض التفاصيل
                        </Button>
                        
                        {isSupervisor && parasite.status === 'pending' && (
                          <Stack direction="row" spacing={1}>
                            <Button 
                              variant="contained" 
                              size="small" 
                              fullWidth
                              color="success"
                              startIcon={<CheckCircle size={16} />}
                              onClick={() => { 
                                setSelectedParasite(parasite); 
                                setAction('approve'); 
                                setDialogOpen(true); 
                              }}
                            >
                              قبول
                            </Button>
                            <Button 
                              variant="contained" 
                              size="small" 
                              fullWidth
                              color="error"
                              startIcon={<XCircle size={16} />}
                              onClick={() => { 
                                setSelectedParasite(parasite); 
                                setAction('reject'); 
                                setDialogOpen(true); 
                              }}
                            >
                              رفض
                            </Button>
                          </Stack>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Stack>
        )
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeActionMenu}
        PaperProps={{
          sx: { bgcolor: '#1a2e25', color: '#fff', border: '1px solid rgba(255, 215, 0, 0.2)' }
        }}
      >
        <MenuItem onClick={() => {
          const parasite = allParasites?.find(p => p.id === menuParasiteId);
          if (parasite) openEditDialog(parasite);
          closeActionMenu();
        }}>
          <Edit size={16} style={{ marginRight: 8 }} />
          تعديل البيانات
        </MenuItem>
        <MenuItem onClick={() => {
          closeActionMenu();
        }}>
          <Download size={16} style={{ marginRight: 8 }} />
          تصدير البيانات
        </MenuItem>
        <MenuItem onClick={() => {
          closeActionMenu();
        }}>
          <Share2 size={16} style={{ marginRight: 8 }} />
          مشاركة
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <MenuItem onClick={() => {
          if (menuParasiteId && confirm('هل أنت متأكد من حذف هذه العينة؟')) {
            parasitesApi.delete(menuParasiteId).then(() => {
              refetch();
              closeActionMenu();
            });
          }
        }} sx={{ color: '#f44336' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          حذف العينة
        </MenuItem>
      </Menu>

      {/* Main Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ 
          sx: { 
            bgcolor: '#1a2e25', 
            color: '#fff', 
            border: '1px solid #FFD700',
            maxHeight: '90vh'
          } 
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {action === 'approve' ? '✅ تأكيد القبول' : 
               action === 'reject' ? '❌ تأكيد الرفض' : 
               action === 'edit' ? '✏️ تعديل البيانات' : 
               '📋 تفاصيل العينة'}
            </Typography>
            {selectedParasite && action === 'view' && (
              <Chip 
                label={`جودة: ${calculateQualityScore(selectedParasite).overallScore}%`}
                sx={{ 
                  bgcolor: getQualityColor(calculateQualityScore(selectedParasite).overallScore),
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              />
            )}
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {selectedParasite && (
            <Stack spacing={3}>
              {/* Image Preview */}
              {action !== 'edit' && (
                <Box>
                  <img 
                    src={getImageUrl(selectedParasite)} 
                    alt={selectedParasite.name} 
                    style={{ 
                      width: '100%', 
                      borderRadius: 8, 
                      maxHeight: 400, 
                      objectFit: 'contain',
                      border: '2px solid rgba(255, 215, 0, 0.2)'
                    }} 
                  />
                </Box>
              )}

              {/* Quality Assessment (View Mode) */}
              {action === 'view' && isSupervisor && (
                <Paper sx={{ p: 2, bgcolor: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#FFD700', fontWeight: 'bold' }}>
                    📊 تقييم الجودة
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: getQualityColor(calculateQualityScore(selectedParasite).imageQuality), fontWeight: 'bold' }}>
                          {calculateQualityScore(selectedParasite).imageQuality}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          جودة الصورة
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: getQualityColor(calculateQualityScore(selectedParasite).dataCompleteness), fontWeight: 'bold' }}>
                          {calculateQualityScore(selectedParasite).dataCompleteness}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          اكتمال البيانات
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: getQualityColor(calculateQualityScore(selectedParasite).scientificAccuracy), fontWeight: 'bold' }}>
                          {calculateQualityScore(selectedParasite).scientificAccuracy}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          الدقة العلمية
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Edit Mode */}
              {action === 'edit' ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="الاسم العلمي"
                      value={editData.scientificName || ''}
                      onChange={(e) => setEditData({ ...editData, scientificName: e.target.value })}
                      fullWidth
                      InputProps={{ sx: { color: '#fff' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="الاسم الشائع"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      fullWidth
                      InputProps={{ sx: { color: '#fff' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="النوع"
                      value={editData.type || ''}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                      fullWidth
                      InputProps={{ sx: { color: '#fff' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="المرحلة"
                      value={editData.stage || ''}
                      onChange={(e) => setEditData({ ...editData, stage: e.target.value })}
                      fullWidth
                      InputProps={{ sx: { color: '#fff' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="العائل"
                      value={editData.host || ''}
                      onChange={(e) => setEditData({ ...editData, host: e.target.value })}
                      fullWidth
                      InputProps={{ sx: { color: '#fff' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="الموقع"
                      value={editData.location || ''}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      fullWidth
                      InputProps={{ sx: { color: '#fff' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="الوصف"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      multiline
                      rows={4}
                      fullWidth
                      InputProps={{ sx: { color: '#fff' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </Grid>
                </Grid>
              ) : (
                /* View Mode - Sample Details */
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>الاسم العلمي:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                        {selectedParasite.scientificName || 'غير محدد'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>الاسم الشائع:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedParasite.name || 'غير محدد'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>النوع:</Typography>
                      <Typography variant="body1">
                        {selectedParasite.type || 'غير محدد'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>المرحلة:</Typography>
                      <Typography variant="body1">
                        {selectedParasite.stage || 'غير محدد'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>العائل:</Typography>
                      <Typography variant="body1">
                        {selectedParasite.host || 'غير محدد'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>الموقع:</Typography>
                      <Typography variant="body1">
                        {selectedParasite.location || 'غير محدد'}
                      </Typography>
                    </Grid>
                    {selectedParasite.description && (
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>الوصف:</Typography>
                        <Typography variant="body1">
                          {selectedParasite.description}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Comments & Suggestions (View Mode) */}
              {action === 'view' && isSupervisor && (
                <Paper sx={{ p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#2196f3', fontWeight: 'bold' }}>
                    💬 التعليقات والاقتراحات
                  </Typography>
                  
                  {comments.length > 0 ? (
                    <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                      {comments.map((comment) => (
                        <ListItem key={comment.id} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1, borderRadius: 1 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: comment.userRole === 'professor' ? '#FFD700' : '#2196f3' }}>
                              {comment.userName.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {comment.userName}
                                </Typography>
                                <Chip 
                                  label={
                                    comment.type === 'suggestion' ? 'اقتراح' :
                                    comment.type === 'issue' ? 'مشكلة' : 'تعليق'
                                  }
                                  size="small"
                                  sx={{ 
                                    height: 20,
                                    bgcolor: 
                                      comment.type === 'suggestion' ? 'rgba(76, 175, 80, 0.2)' :
                                      comment.type === 'issue' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                                    color: '#fff'
                                  }}
                                />
                              </Stack>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" sx={{ color: '#fff', mt: 0.5 }}>
                                  {comment.message}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.5, mt: 0.5, display: 'block' }}>
                                  {new Date(comment.timestamp).toLocaleString('ar-EG')}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center', py: 2 }}>
                      لا توجد تعليقات حتى الآن
                    </Typography>
                  )}
                  
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={commentType}
                        onChange={(e) => setCommentType(e.target.value as any)}
                        sx={{ color: '#fff' }}
                      >
                        <MenuItem value="comment">💬 تعليق</MenuItem>
                        <MenuItem value="suggestion">💡 اقتراح</MenuItem>
                        <MenuItem value="issue">⚠️ مشكلة</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="أضف تعليق أو اقتراح..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      InputProps={{ sx: { color: '#fff' } }}
                    />
                    <IconButton 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      sx={{ bgcolor: '#2196f3', color: '#fff', '&:hover': { bgcolor: '#1976d2' } }}
                    >
                      <Send size={20} />
                    </IconButton>
                  </Stack>
                </Paper>
              )}

              {/* Review Notes */}
              {(action === 'approve' || action === 'reject') && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={action === 'reject' ? "سبب الرفض (مطلوب)..." : "ملاحظات (اختياري)..."}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.05)', 
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff'
                    }
                  }}
                />
              )}
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#fff' }}>
            إلغاء
          </Button>
          {action === 'approve' && (
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleApprove} 
              disabled={submitting}
              startIcon={<CheckCircle size={20} />}
            >
              {submitting ? 'جاري القبول...' : 'تأكيد القبول'}
            </Button>
          )}
          {action === 'reject' && (
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleReject} 
              disabled={submitting}
              startIcon={<XCircle size={20} />}
            >
              {submitting ? 'جاري الرفض...' : 'تأكيد الرفض'}
            </Button>
          )}
          {action === 'edit' && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveEdit} 
              disabled={submitting}
              startIcon={<Edit size={20} />}
            >
              {submitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewParasites;
