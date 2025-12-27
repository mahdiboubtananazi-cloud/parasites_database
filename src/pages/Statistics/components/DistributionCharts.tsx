import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Beaker, TrendingUp, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DistributionChartsProps {
  distributions: {
    hostDistribution: { name: string; value: number }[];
    sampleTypeDistribution: { name: string; value: number }[];
    parasiteTypes: { name: string; value: number }[];
    stageDistribution: { name: string; value: number }[];
  };
  isMobile: boolean;
  isRtl: boolean;
}

const COLORS = ['#3a5a40', '#32b8c6', '#ff6b6b', '#ffa94d', '#748dc8'];

const DistributionCharts: React.FC<DistributionChartsProps> = ({
  distributions,
  isMobile,
}) => {
  const { t } = useTranslation();

  const charts = [
    {
      title: t('chart_host_distribution'),
      data: distributions.hostDistribution,
      icon: Activity,
      type: 'pie' as const,
      tooltipSuffix: t('parasite'),
    },
    {
      title: t('chart_sample_type'),
      data: distributions.sampleTypeDistribution,
      icon: Beaker,
      type: 'pie' as const,
      tooltipSuffix: t('sample'),
    },
    {
      title: t('chart_development_stage'),
      data: distributions.stageDistribution,
      icon: TrendingUp,
      type: 'bar' as const,
    },
    {
      title: t('chart_parasite_types'),
      data: distributions.parasiteTypes,
      icon: Database,
      type: 'bar' as const,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: { xs: 2, md: 3 },
        mb: { xs: 3, md: 4 },
      }}
    >
      {charts.map((chart, index) => (
        <DistributionChart
          key={index}
          chart={chart}
          isMobile={isMobile}
        />
      ))}
    </Box>
  );
};

interface ChartConfig {
  title: string;
  data: { name: string; value: number }[];
  icon: React.ElementType;
  type: 'pie' | 'bar';
  tooltipSuffix?: string;
}

interface DistributionChartProps {
  chart: ChartConfig;
  isMobile: boolean;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  chart,
  isMobile,
}) => {
  const { t } = useTranslation();

  const hasData = chart.data && chart.data.some((d) => d.value > 0);

  const renderContent = () => {
    if (!hasData) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {t('no_data_available')}
          </Typography>
        </Box>
      );
    }

    if (chart.type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chart.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={isMobile ? 80 : 100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chart.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) =>
                chart.tooltipSuffix
                  ? `${value} ${chart.tooltipSuffix}`
                  : value
              }
              contentStyle={{
                backgroundColor: '#f8f7f5',
                border: '1px solid #3a5a4030',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a5a4020" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#748dc8' }}
            interval={0}
          />
          <YAxis tick={{ fontSize: 11, fill: '#748dc8' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f8f7f5',
              border: '1px solid #3a5a4030',
              borderRadius: '8px',
            }}
          />
          <Bar
            dataKey="value"
            fill="#32b8c6"
            radius={[8, 8, 0, 0]}
            barSize={isMobile ? 24 : 32}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const Icon = chart.icon;

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        background: 'white',
        borderRadius: { xs: 1.5, md: 2 },
        border: '1px solid #3a5a4015',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <Icon size={20} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#3a5a40',
            fontSize: { xs: '0.95rem', md: '1.1rem' },
          }}
        >
          {chart.title}
        </Typography>
      </Box>
      {renderContent()}
    </Paper>
  );
};

export default DistributionCharts;
