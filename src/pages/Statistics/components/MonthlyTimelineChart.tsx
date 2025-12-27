// src/pages/Statistics/MonthlyTimelineChart.tsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

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

const MonthlyTimelineChart: React.FC<MonthlyTimelineChartProps> = ({ data }) => {
  const { t } = useTranslation();

  const hasData = data.some((m) => m.parasites > 0);

  const renderTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType> & {
    payload?: Array<{
      name?: string;
      value?: number | string;
      color?: string;
    }>;
    label?: string | number;
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <Box
        sx={{
          backgroundColor: '#f8f7f5',
          border: '1px solid #3a5a4030',
          borderRadius: '8px',
          p: 1.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((item, idx) => (
          <Typography
            key={idx}
            variant="caption"
            sx={{ display: 'block', color: item.color || '#3a5a40' }}
          >
            {item.name}: {item.value}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        background: 'white',
        borderRadius: { xs: 1.5, md: 2 },
        border: '1px solid #3a5a4015',
        gridColumn: { xs: '1', md: '1 / -1' },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: '#3a5a40',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: { xs: '0.95rem', md: '1.1rem' },
        }}
      >
        <BarChart3 size={20} />
        {t('chart_monthly_trends')}
      </Typography>

      {hasData ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a5a4020" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#748dc8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#748dc8' }} />
            <Tooltip content={(props) => renderTooltip({ ...props, payload: props.payload ? [...props.payload] : [] })} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
            <Line
              type="monotone"
              dataKey="parasites"
              stroke="#3a5a40"
              strokeWidth={3}
              dot={{ fill: '#3a5a40', r: 5 }}
              activeDot={{ r: 7 }}
              name={t('parasites')}
            />
            <Line
              type="monotone"
              dataKey="images"
              stroke="#32b8c6"
              strokeWidth={3}
              dot={{ fill: '#32b8c6', r: 5 }}
              activeDot={{ r: 7 }}
              name={t('images')}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary">{t('no_monthly_data')}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MonthlyTimelineChart;
