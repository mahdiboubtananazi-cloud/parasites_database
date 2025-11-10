import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  fullScreen = false,
  size = 40,
}) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={fullScreen ? { minHeight: '100vh' } : { py: 4 }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  return content;
};

