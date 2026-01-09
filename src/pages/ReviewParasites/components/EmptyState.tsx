import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { FolderOpen } from 'lucide-react';

export const EmptyState = () => (
  <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
    <FolderOpen size={64} color="#ccc" style={{ marginBottom: 16 }} />
    <Typography variant="h6" color="text.secondary">لا توجد عينات لعرضها</Typography>
  </Paper>
);