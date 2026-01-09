// src/pages/ReviewParasites/components/StatCard.tsx

import React from 'react';
import { Paper, Box, Stack, Typography, alpha } from '@mui/material';
import colors from '../colors';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: colors.bgCard,
        border: `1px solid ${colors.borderLight}`,
        boxShadow: colors.shadowLight,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: colors.shadowMedium,
          borderColor: color,
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: color,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.textMuted,
              mt: 0.5,
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          {trend !== undefined && (
            <Typography
              variant="caption"
              sx={{
                color: trend > 0 ? colors.success : colors.error,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                fontWeight: 600,
              }}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% هذا الأسبوع
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: alpha(color, 0.1),
            border: `1px solid ${alpha(color, 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
};

export default StatCard;