import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

export interface ChartProps {
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar';
  series: any;
  options: ApexOptions;
  width?: string | number;
  height?: string | number;
}

export function Chart({ type = 'line', series, options, width = '100%', height = '350' }: ChartProps) {
  return (
    <ReactApexChart
      type={type}
      series={series}
      options={options}
      width={width}
      height={height}
    />
  );
}