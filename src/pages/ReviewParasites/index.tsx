import React from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Tabs,
  Tab,
  Stack,
  Paper,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Search, Shield } from 'lucide-react';
import { useReviewLogic } from './hooks/useReviewLogic';
import { ParasiteCard } from './components/ParasiteCard';
import { ReviewDialog } from './components/Dialogs';
import { EmptyState } from './components/EmptyState';
import { useAuth } from '../../contexts/AuthContext';

const ReviewParasitesPage = () => {
  const { user } = useAuth();
  const {
    parasites,
    loading,
    isSupervisor,
    isVerified,
    secretCode,
    setSecretCode,
    verifyCode,
    filters,
    dialog,
  } = useReviewLogic();

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '50vh',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!user)
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="warning">يجب تسجيل الدخول</Alert>
      </Container>
    );

  // شاشة القفل للمشرفين
  if (isSupervisor && !isVerified) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Shield
            size={64}
            style={{ margin: '0 auto 20px', color: '#1976d2' }}
          />
          <Typography variant="h5" gutterBottom>
            منطقة المشرفين
          </Typography>
          <TextField
            fullWidth
            type="password"
            placeholder="أدخل الكود السري"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              if (!verifyCode()) alert('الكود خطأ');
            }}
          >
            دخول
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header & Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {isSupervisor ? 'لوحة المراجعة' : 'عيناتي'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {parasites.length} عينة
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            <TextField
              size="small"
              placeholder="بحث..."
              value={filters.searchQuery}
              onChange={(e) => filters.setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search size={18} style={{ marginRight: 8 }} />
                ),
              }}
            />
            <Tabs
              value={filters.statusFilter}
              onChange={(_, v) => filters.setStatusFilter(v)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="قيد المراجعة" value="pending" />
              <Tab label="مقبولة" value="approved" />
              <Tab label="مرفوضة" value="rejected" />
              <Tab label="الكل" value="all" />
            </Tabs>
          </Stack>
        </Stack>
      </Paper>

      {/* Grid Content */}
      {parasites.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={3}>
          {parasites.map((parasite) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={parasite.id}>
              <ParasiteCard
                parasite={parasite}
                isSupervisor={isSupervisor}
                onAction={dialog.openDialog}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog */}
      <ReviewDialog
        open={dialog.open}
        onClose={() => dialog.setOpen(false)}
        type={dialog.type}
        parasite={dialog.data}
        onConfirm={dialog.handleAction}
        isSubmitting={dialog.isSubmitting}
        notes={dialog.notes}
        setNotes={dialog.setNotes}
        editData={dialog.editData}
        setEditData={dialog.setEditData}
      />
    </Container>
  );
};

export default ReviewParasitesPage;