/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, Snackbar } from '@mui/material';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addMessage = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
      const id = Date.now().toString();
      setMessages((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }, 4000);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string) => addMessage(message, 'success'),
    [addMessage]
  );
  const showError = useCallback(
    (message: string) => addMessage(message, 'error'),
    [addMessage]
  );
  const showWarning = useCallback(
    (message: string) => addMessage(message, 'warning'),
    [addMessage]
  );
  const showInfo = useCallback(
    (message: string) => addMessage(message, 'info'),
    [addMessage]
  );

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      {messages.map((msg) => (
        <Snackbar
          key={msg.id}
          open={true}
          autoHideDuration={4000}
          onClose={() => setMessages((prev) => prev.filter((m) => m.id !== msg.id))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={msg.type} variant="filled" sx={{ width: '100%' }}>
            {msg.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};