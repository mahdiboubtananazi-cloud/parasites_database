/* eslint-disable react-refresh/only-export-components */

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { ErrorOutline, Home } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <ErrorOutline
          sx={{
            fontSize: 64,
            color: 'error.main',
            mb: 2,
          }}
        />
        <Typography variant="h4" gutterBottom color="error">
          حدث خطأ غير متوقع
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {error?.message || 'حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => {
              window.location.href = '/';
            }}
          >
            العودة للرئيسية
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              window.location.reload();
            }}
          >
            إعادة التحميل
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};