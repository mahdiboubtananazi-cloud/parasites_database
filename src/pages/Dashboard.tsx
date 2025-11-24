import React, { useState } from 'react';
import { 
  Box, Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Chip, Stack, IconButton, Avatar
} from '@mui/material';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { useParasites } from '../hooks/useParasites';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// رابط السيرفر (ملاحظة: استبدله بـ IP إذا كنت تستخدم الهاتف)
const API_URL = 'http://localhost:8000';

export default function Dashboard() {
  const { parasites, loading, refetch } = useParasites();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const [processing, setProcessing] = useState<string | null>(null);

  // تصفية العناصر المعلقة فقط
  const pendingItems = parasites.filter(p => (p.status || 'approved') === 'pending');

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    setProcessing(id);
    try {
      await axios.put(`${API_URL}/parasites/${id}/status`, { status: newStatus });
      showSuccess(newStatus === 'approved' ? "تم قبول العينة ونشرها" : "تم رفض العينة");
      refetch(); // تحديث القائمة
    } catch (error) {
      showError("فشل تحديث الحالة");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#F8F9FC' }}>
      <Box sx={{ bgcolor: 'white', py: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={800} color="primary.main">لوحة تحكم المختبر</Typography>
          <Typography color="text.secondary">إدارة طلبات النشر ومراجعة العينات الجديدة</Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {pendingItems.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
            <Check size={48} color="#10b981" style={{ marginBottom: 16 }} />
            <Typography variant="h6">كل شيء نظيف!</Typography>
            <Typography color="text.secondary">لا توجد طلبات معلقة حالياً.</Typography>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Box sx={{ p: 2, bgcolor: '#FFF4E5', color: '#B76E00', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlertCircle size={20} />
              <Typography fontWeight={600}>يوجد {pendingItems.length} عينات بانتظار المراجعة</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell>العينة</TableCell>
                    <TableCell>الاسم العلمي</TableCell>
                    <TableCell>التصنيف</TableCell>
                    <TableCell>تاريخ الرفع</TableCell>
                    <TableCell align="center">الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={item.imageUrl} variant="rounded" sx={{ width: 50, height: 50 }} />
                          <Typography fontWeight={600}>{item.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontStyle: 'italic', fontFamily: 'serif' }}>{item.scientificName}</TableCell>
                      <TableCell><Chip label={item.type} size="small" /></TableCell>
                      <TableCell>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button 
                            variant="contained" color="success" size="small" 
                            startIcon={<Check size={16} />}
                            disabled={processing === item.id}
                            onClick={() => handleStatusChange(item.id, 'approved')}
                          >
                            قبول
                          </Button>
                          <Button 
                            variant="outlined" color="error" size="small"
                            startIcon={<X size={16} />}
                            disabled={processing === item.id}
                            onClick={() => handleStatusChange(item.id, 'rejected')}
                          >
                            رفض
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
