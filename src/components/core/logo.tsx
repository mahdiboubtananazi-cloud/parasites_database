import * as React from 'react';
import Box from '@mui/material/Box';

export interface LogoProps {
  color?: 'dark' | 'light';
  emblem?: boolean;
  height?: number | string;
  width?: number | string;
}

export function Logo({ height = 32, width = 32 }: LogoProps): React.JSX.Element {
  return (
    <Box alt="logo" component="img" height={height} src="/images/logo.png" width={width} />
  );
}