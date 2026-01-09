import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Box, Stack, IconButton, Tooltip, Divider } from '@mui/material';
import { CheckCircle, XCircle, Edit, Trash2, Eye, User } from 'lucide-react';
import { Parasite } from '../../../types/parasite';
import { getImageUrl } from '../utils';

interface Props {
  parasite: Parasite;
  isSupervisor: boolean;
  onAction: (p: Parasite, type: any) => void;
}

export const ParasiteCard: React.FC<Props> = ({ parasite, isSupervisor, onAction }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      }}
    >
      {/* حالة العينة */}
      <Chip 
        label={parasite.status === 'pending' ? '⏳ قيد المراجعة' : parasite.status === 'rejected' ? '❌ مرفوضة' : '✅ مقبولة'} 
        color={parasite.status === 'approved' ? 'success' : parasite.status === 'rejected' ? 'error' : 'warning'}
        size="small"
        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, fontWeight: 'bold' }}
      />

      {/* الصورة */}
      <CardMedia 
        component="img" 
        height="200" 
        image={getImageUrl(parasite)} 
        alt={parasite.name}
        sx={{ bgcolor: '#f5f5f5', cursor: 'pointer' }}
        onClick={() => onAction(parasite, 'view')}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* التفاصيل الأساسية */}
        <Typography variant="h6" fontWeight="bold" noWrap title={parasite.scientificName}>
          {parasite.scientificName || 'بدون اسم علمي'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {parasite.name || 'بدون اسم شائع'}
        </Typography>

        {/* معلومات الطالب */}
        {isSupervisor && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 2, bgcolor: '#f0f7f4', p: 0.8, borderRadius: 1 }}>
            <User size={14} color="#555" />
            <Typography variant="caption" color="text.secondary">
              الطالب: {parasite.studentName || 'غير معروف'}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        {/* أزرار التحكم - تظهر فقط للمشرف والعينات قيد المراجعة */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
          {/* زر التفاصيل للجميع */}
          <Tooltip title="عرض التفاصيل">
            <IconButton size="small" onClick={() => onAction(parasite, 'view')}>
              <Eye size={20} color="#555" />
            </IconButton>
          </Tooltip>

          {isSupervisor && (
            <Stack direction="row" spacing={1}>
              {parasite.status === 'pending' && (
                <>
                  <Tooltip title="قبول (لِلأرشيف)">
                    <IconButton size="small" sx={{ color: '#2e7d32', bgcolor: '#e8f5e9' }} onClick={() => onAction(parasite, 'approve')}>
                      <CheckCircle size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="رفض">
                    <IconButton size="small" sx={{ color: '#d32f2f', bgcolor: '#ffebee' }} onClick={() => onAction(parasite, 'reject')}>
                      <XCircle size={20} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              <Tooltip title="تعديل">
                <IconButton size="small" sx={{ color: '#1976d2', bgcolor: '#e3f2fd' }} onClick={() => onAction(parasite, 'edit')}>
                  <Edit size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="حذف نهائي">
                <IconButton size="small" sx={{ color: '#c62828', bgcolor: '#ffebee' }} onClick={() => onAction(parasite, 'delete')}>
                  <Trash2 size={20} />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};