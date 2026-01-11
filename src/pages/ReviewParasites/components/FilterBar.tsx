// src/pages/ReviewParasites/components/FilterBar.tsx

import React from 'react';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Paper,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Search, RotateCcw, Grid as GridIcon, List } from 'lucide-react';
import colors from '../colors';
import { FilterState, ViewMode } from '../types';

interface FilterBarProps {
  filters: FilterState;
  viewMode: ViewMode;
  students: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  viewMode,
  students,
  onFilterChange,
  onViewModeChange,
  onReset,
}) => {
  // نستخدم students بشكل صوري حتى لا يعتبره ESLint غير مستخدم
  void students;

  const selectStyles = {
    bgcolor: colors.bgCard,
    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.borderLight },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.borderMedium,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: colors.bgCard,
        border: `1px solid ${colors.borderLight}`,
        boxShadow: colors.shadowLight,
        mb: 3,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* البحث */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="البحث عن عينة..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: colors.bgSecondary,
                '& fieldset': { borderColor: colors.borderLight },
                '&:hover fieldset': { borderColor: colors.borderMedium },
                '&.Mui-focused fieldset': { borderColor: colors.primary },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color={colors.textMuted} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* فلتر الحالة */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <FormControl fullWidth size="small">
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              sx={selectStyles}
            >
              <MenuItem value="all">🔍 الكل</MenuItem>
              <MenuItem value="pending">⏳ قيد المراجعة</MenuItem>
              <MenuItem value="approved">✅ مقبولة</MenuItem>
              <MenuItem value="rejected">❌ مرفوضة</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* فلتر الجودة */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <FormControl fullWidth size="small">
            <Select
              value={filters.quality}
              onChange={(e) => onFilterChange('quality', e.target.value)}
              sx={selectStyles}
            >
              <MenuItem value="all">⭐ كل الجودات</MenuItem>
              <MenuItem value="excellent">🌟 ممتاز</MenuItem>
              <MenuItem value="good">👍 جيد</MenuItem>
              <MenuItem value="poor">⚠️ يحتاج تحسين</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* الترتيب */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <FormControl fullWidth size="small">
            <Select
              value={filters.sort}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              sx={selectStyles}
            >
              <MenuItem value="date">📅 الأحدث</MenuItem>
              <MenuItem value="quality">⭐ الجودة</MenuItem>
              <MenuItem value="name">🔤 الاسم</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* أزرار العرض وإعادة التعيين */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, val) => val && onViewModeChange(val)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: colors.textMuted,
                  borderColor: colors.borderLight,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.primary, 0.15),
                    color: colors.primary,
                    borderColor: colors.primary,
                  },
                  '&:hover': {
                    bgcolor: alpha(colors.primary, 0.1),
                  },
                },
              }}
            >
              <ToggleButton value="grid">
                <GridIcon size={18} />
              </ToggleButton>
              <ToggleButton value="list">
                <List size={18} />
              </ToggleButton>
            </ToggleButtonGroup>

            <Tooltip title="إعادة تعيين الفلاتر">
              <IconButton
                onClick={onReset}
                sx={{
                  color: colors.textMuted,
                  bgcolor: alpha(colors.primary, 0.1),
                  '&:hover': { bgcolor: alpha(colors.primary, 0.2) },
                }}
              >
                <RotateCcw size={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterBar;