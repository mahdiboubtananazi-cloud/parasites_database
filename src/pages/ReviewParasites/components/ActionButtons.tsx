import React from 'react';
import { Stack, Button, IconButton, Tooltip } from '@mui/material';
import { CheckCircle, XCircle, Edit, Trash2, Eye } from 'lucide-react';
import { Parasite } from '../../../types/parasite';

type ReviewAction = 'view' | 'approve' | 'reject' | 'edit' | 'delete';

interface Props {
  parasite: Parasite;
  isSupervisor: boolean;
  onAction: (p: Parasite, type: ReviewAction) => void;
}

export const ActionButtons: React.FC<Props> = ({
  parasite,
  isSupervisor,
  onAction,
}) => {
  return (
    <Stack spacing={1} mt={2}>
      <Button
        fullWidth
        variant="outlined"
        size="small"
        onClick={() => onAction(parasite, 'view')}
        startIcon={<Eye size={16} />}
      >
        التفاصيل
      </Button>

      {isSupervisor && (
        <>
          {parasite.status === 'pending' && (
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="small"
                onClick={() => onAction(parasite, 'approve')}
                startIcon={<CheckCircle size={16} />}
              >
                قبول
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                size="small"
                onClick={() => onAction(parasite, 'reject')}
                startIcon={<XCircle size={16} />}
              >
                رفض
              </Button>
            </Stack>
          )}

          <Stack direction="row" justifyContent="space-between" mt={1}>
            <Tooltip title="تعديل">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onAction(parasite, 'edit')}
              >
                <Edit size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="حذف">
              <IconButton
                size="small"
                color="error"
                onClick={() => onAction(parasite, 'delete')}
              >
                <Trash2 size={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        </>
      )}
    </Stack>
  );
};