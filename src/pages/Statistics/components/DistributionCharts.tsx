import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Activity, Beaker, TrendingUp, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const COLORS = ['#2A9D8F', '#264653', '#E9C46A', '#F4A261', '#E76F51', '#8AB17D'];

interface DistributionItem {
  name: string;
  value: number;
}

interface DistributionChartsProps {
  distributions: {
    hostDistribution: DistributionItem[];
    sampleTypeDistribution: DistributionItem[];
    parasiteTypes: DistributionItem[];
    stageDistribution: DistributionItem[];
  };
  // نستقبل isMobile من الأعلى لكن لا نستخدمه فعليًا هنا الآن
  isMobile: boolean;
  isRtl: boolean;
}

type ChartType = 'pie' | 'bar';

interface ChartConfig {
  title: string;
  data: DistributionItem[];
  icon: React.ComponentType<{ size?: number }>;
  type: ChartType;
}

interface LegendPayloadItem {
  value: string;
  color: string;
}

interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

// مكون المفتاح المخصص (Custom Legend)
const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  if (!payload || payload.length === 0) return null;

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        marginTop: 20,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 11,
            color: '#555',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: entry.color,
              borderRadius: '50%',
              marginRight: 6,
              marginLeft: 6,
              display: 'inline-block',
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

// نضيف index signature حتى يتوافق مع نوع Recharts (ChartDataInput)
type ChartWithFill = {
  name: string;
  value: number;
  fill: string;
  [key: string]: string | number;
};

const DistributionCharts: React.FC<DistributionChartsProps> = ({
  distributions,
  isMobile,
  isRtl,
}) => {
  const { t } = useTranslation();
  // isMobile غير مستخدم حاليًا، نعلم ESLint أننا ندرك ذلك
  void isMobile;

  const charts: ChartConfig[] = [
    {
      title: t('stats_host_distribution', { defaultValue: 'توزيع العوائل' }),
      data: distributions.hostDistribution,
      icon: Activity,
      type: 'pie',
    },
    {
      title: t('stats_sample_distribution', { defaultValue: 'أنواع العينات' }),
      data: distributions.sampleTypeDistribution,
      icon: Beaker,
      type: 'pie',
    },
    {
      title: t('stats_stage_distribution', { defaultValue: 'مراحل التطور' }),
      data: distributions.stageDistribution,
      icon: TrendingUp,
      type: 'bar',
    },
    {
      title: t('stats_type_classification', {
        defaultValue: 'تصنيف الطفيليات',
      }),
      data: distributions.parasiteTypes,
      icon: Database,
      type: 'bar',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 4,
      }}
    >
      {charts.map((chart) => (
        <DistributionChart key={chart.title} chart={chart} isRtl={isRtl} />
      ))}
    </Box>
  );
};

const DistributionChart: React.FC<{ chart: ChartConfig; isRtl: boolean }> = ({
  chart,
  isRtl,
}) => {
  const { t } = useTranslation();
  const hasData =
    chart.data && chart.data.some((d: DistributionItem) => d.value > 0);

  if (!hasData) {
    return (
      <Paper
        sx={{
          p: 3,
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fff',
          borderRadius: 4,
        }}
      >
        <Typography color="text.secondary">
          {t('no_data_available', { defaultValue: 'لا تتوفر بيانات' })}
        </Typography>
      </Paper>
    );
  }

  // إعداد بيانات الألوان لكل عنصر لضمان تطابق الألوان في الـ Legend
  const coloredData: ChartWithFill[] = chart.data.map(
    (item: DistributionItem, index: number) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    })
  );

  const renderContent = () => {
    if (chart.type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={coloredData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {coloredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              }}
            />
            <Legend content={<CustomLegend />} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // Bar chart مع Legend يدوي
    return (
      <Box
        sx={{
          height: 320,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={coloredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap={20}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis dataKey="name" tick={false} axisLine={false} height={0} />
            <YAxis
              tick={{ fontSize: 12, fill: '#888' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                textAlign: isRtl ? 'right' : 'left',
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} name="القيمة">
              {coloredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend يدوي للـ BarChart */}
        <CustomLegend
          payload={coloredData.map((item) => ({
            value: item.name,
            color: item.fill,
          }))}
        />
      </Box>
    );
  };

  const Icon = chart.icon;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: '#fff',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.06)',
        height: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 3,
          borderBottom: '1px solid #f5f5f5',
          pb: 2,
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: 'rgba(42, 157, 143, 0.1)',
            color: '#2A9D8F',
          }}
        >
          <Icon size={20} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontSize: '1rem', fontWeight: 700, color: '#264653' }}
        >
          {chart.title}
        </Typography>
      </Box>
      {renderContent()}
    </Paper>
  );
};

export default DistributionCharts;