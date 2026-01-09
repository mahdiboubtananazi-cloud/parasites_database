import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography, Alert, Box
} from '@mui/material';
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {type === 'approve' && '✅ تأكيد القبول'}
        {type === 'reject' && '❌ تأكيد الرفض'}
        {type === 'delete' && '🗑️ حذف العينة'}
        {type === 'edit' && '✏️ تعديل البيانات'}
        {type === 'view' && '📋 تفاصيل العينة'}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {type !== 'edit' && (
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src={getImageUrl(parasite)} 
                alt="" 
                style={{ maxHeight: 200, borderRadius: 8, maxWidth: '100%' }} 
              />
            </Box>
          )}

          {type === 'edit' ? (
            <>
              <TextField label="الاسم العلمي" value={editData.scientificName || ''} onChange={(e) => setEditData({...editData, scientificName: e.target.value})} fullWidth />
              <TextField label="الاسم الشائع" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} fullWidth />
              <TextField label="النوع" value={editData.type || ''} onChange={(e) => setEditData({...editData, type: e.target.value})} fullWidth />
              <TextField label="الوصف" multiline rows={3} value={editData.description || ''} onChange={(e) => setEditData({...editData, description: e.target.value})} fullWidth />
            </>
          ) : type === 'view' ? (
            <Box>
              <Typography><strong>الاسم العلمي:</strong> {parasite.scientificName}</Typography>
              <Typography><strong>الوصف:</strong> {parasite.description}</Typography>
              <Typography><strong>الطالب:</strong> {parasite.studentName}</Typography>
              {parasite.reviewNotes && <Alert severity="info" sx={{ mt: 2 }}>ملاحظات: {parasite.reviewNotes}</Alert>}
            </Box>
          ) : type === 'delete' ? (
            <Alert severity="error">هل أنت متأكد من الحذف؟ لا يمكن التراجع.</Alert>
          ) : (
            <TextField
              label={type === 'reject' ? "سبب الرفض (مطلوب)" : "ملاحظات إضافية"}
              multiline rows={3} fullWidth
              value={notes} onChange={(e) => setNotes(e.target.value)}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        {type !== 'view' && (
          <Button 
            variant="contained" 
            color={type === 'delete' || type === 'reject' ? 'error' : 'primary'}
            onClick={onConfirm}
            disabled={isSubmitting || (type === 'reject' && !notes)}
          >
            {isSubmitting ? 'جاري...' : 'تأكيد'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};