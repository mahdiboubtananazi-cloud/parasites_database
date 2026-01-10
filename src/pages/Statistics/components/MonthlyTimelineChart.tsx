import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { colors } from '../../../theme/colors';

interface MonthlyData {
  month: string;
  parasites: number;
  images: number;
}

interface MonthlyTimelineChartProps {
  data: MonthlyData[];
  isMobile: boolean;
  isRtl: boolean;
}

const MonthlyTimelineChart: React.FC<MonthlyTimelineChartProps> = ({ data, isRtl }) => {
  const { t } = useTranslation();
  const hasData = data.some((m) => m.parasites > 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: '#fff',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        gridColumn: { xs: '1', md: '1 / -1' },
        mt: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: '1px solid #f5f5f5', pb: 2 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${colors.primary.main}15`, color: colors.primary.main }}>
          <TrendingUp size={20} />
        </Box>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#264653' }}>
          {t('stats_monthly_trends', { defaultValue: 'النشاط الشهري (Monthly Trends)' })}
        </Typography>
      </Box>

      {hasData ? (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorParasites" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary.main} stopOpacity={0.2} />
                <stop offset="95%" stopColor={colors.primary.main} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorImages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.secondary.main} stopOpacity={0.2} />
                <stop offset="95%" stopColor={colors.secondary.main} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#666' }} />
            <YAxis tick={{ fontSize: 12, fill: '#666' }} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <Tooltip 
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: isRtl ? 'right' : 'left' }}
            />
            <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
            
            <Area
              type="monotone"
              dataKey="parasites"
              name={t('stats_total_parasites', { defaultValue: 'الطفيليات' })}
              stroke={colors.primary.main}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorParasites)"
            />
            <Area
              type="monotone"
              dataKey="images"
              name={t('stats_total_images', { defaultValue: 'الصور' })}
              stroke={colors.secondary.main}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorImages)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
          <Typography color="text.secondary">
            {t('no_data_available', { defaultValue: 'لا تتوفر بيانات' })}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MonthlyTimelineChart;