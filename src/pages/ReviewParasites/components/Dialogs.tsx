import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, Alert, Box
} from '@mui/material';
// ✅ استخدام Grid من MUI للتنظيم
import Grid from '@mui/material/Grid';
import { Parasite } from '../../../types/parasite';
import { getImageUrl } from '../utils';

interface Props {
  open: boolean;
  onClose: () => void;
  type: string;
  parasite: Parasite | null;
  onConfirm: () => void;
  isSubmitting: boolean;
  notes: string;
  setNotes: (s: string) => void;
  editData: Partial<Parasite>;
  setEditData: (d: Partial<Parasite>) => void;
}

export const ReviewDialog: React.FC<Props> = ({
  open, onClose, type, parasite, onConfirm, isSubmitting,
  notes, setNotes, editData, setEditData
}) => {
  if (!parasite) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {type === 'approve' && '✅ تأكيد القبول'}
        {type === 'reject' && '❌ تأكيد الرفض'}
        {type === 'delete' && '🗑️ حذف العينة'}
        {type === 'edit' && '✏️ تعديل جميع البيانات'}
        {type === 'view' && '📋 تفاصيل العينة'}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {/* صورة للمعاينة (تظهر في كل الحالات ما عدا التعديل لتوفير المساحة) */}
          {type !== 'edit' && (
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src={getImageUrl(parasite)} 
                alt="" 
                style={{ maxHeight: 300, borderRadius: 8, maxWidth: '100%', objectFit: 'contain' }} 
              />
            </Box>
          )}

          {/* 📝 نموذج التعديل الشامل */}
          {type === 'edit' ? (
            <Grid container spacing={2}>
              {/* الصف 1: الأسماء */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="الاسم العلمي (Scientific Name)" value={editData.scientificName || ''} onChange={(e) => setEditData({...editData, scientificName: e.target.value})} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="الاسم الشائع (Common Name)" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} fullWidth />
              </Grid>

              {/* الصف 2: التصنيف */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="النوع/المجموعة (Type)" value={editData.type || ''} onChange={(e) => setEditData({...editData, type: e.target.value})} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="المرحلة (Stage)" value={editData.stage || ''} onChange={(e) => setEditData({...editData, stage: e.target.value})} fullWidth />
              </Grid>

              {/* الصف 3: تفاصيل العينة */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="نوع العينة (Sample Type)" value={editData.sampleType || ''} onChange={(e) => setEditData({...editData, sampleType: e.target.value})} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="الصبغة (Stain Color)" value={editData.stainColor || ''} onChange={(e) => setEditData({...editData, stainColor: e.target.value})} fullWidth />
              </Grid>

              {/* الصف 4: الموقع والعائل */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="العائل (Host)" value={editData.host || ''} onChange={(e) => setEditData({...editData, host: e.target.value})} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="الموقع (Location)" value={editData.location || ''} onChange={(e) => setEditData({...editData, location: e.target.value})} fullWidth />
              </Grid>

              {/* الصف 5: الوصف */}
              <Grid size={{ xs: 12 }}>
                <TextField 
                  label="الوصف (Description)" 
                  multiline rows={4} 
                  value={editData.description || ''} 
                  onChange={(e) => setEditData({...editData, description: e.target.value})} 
                  fullWidth 
                />
              </Grid>
            </Grid>
          ) : type === 'view' ? (
            // عرض التفاصيل (للقراءة فقط)
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>الاسم العلمي:</strong> {parasite.scientificName}</Typography></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>الاسم الشائع:</strong> {parasite.name}</Typography></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>النوع:</strong> {parasite.type}</Typography></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>المرحلة:</strong> {parasite.stage}</Typography></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>نوع العينة:</strong> {parasite.sampleType}</Typography></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>الصبغة:</strong> {parasite.stainColor}</Typography></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>العائل:</strong> {parasite.host}</Typography></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Typography><strong>الموقع:</strong> {parasite.location}</Typography></Grid>
              <Grid size={{ xs: 12 }}><Typography><strong>الوصف:</strong> {parasite.description}</Typography></Grid>
              <Grid size={{ xs: 12 }}><Typography><strong>الطالب:</strong> {parasite.studentName}</Typography></Grid>
              {parasite.reviewNotes && <Grid size={{ xs: 12 }}><Alert severity="info">ملاحظات المراجعة: {parasite.reviewNotes}</Alert></Grid>}
            </Grid>
          ) : type === 'delete' ? (
            <Alert severity="error">هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.</Alert>
          ) : (
            // لحالتي القبول والرفض
            <TextField
              label={type === 'reject' ? "سبب الرفض (مطلوب)" : "ملاحظات إضافية (اختياري)"}
              multiline rows={3} fullWidth
              value={notes} onChange={(e) => setNotes(e.target.value)}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">إلغاء</Button>
        {type !== 'view' && (
          <Button 
            variant="contained" 
            color={type === 'delete' || type === 'reject' ? 'error' : 'primary'}
            onClick={onConfirm}
            disabled={isSubmitting || (type === 'reject' && !notes)}
          >
            {isSubmitting ? 'جاري...' : type === 'edit' ? 'حفظ التعديلات' : 'تأكيد'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};