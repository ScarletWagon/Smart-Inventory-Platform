import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  useTheme
} from '@mui/material';
import {
  Wifi as WifiIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { testConnection, createProduct } from '../api/backend';

export default function SettingsDialog({ open, onClose }) {
  const theme = useTheme();
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [testProductLoading, setTestProductLoading] = useState(false);
  const [testProductStatus, setTestProductStatus] = useState(null);

  const handleTestConnection = async () => {
    setConnectionLoading(true);
    setConnectionStatus(null);
    try {
      await testConnection();
      setConnectionStatus({ type: 'success', message: 'Backend connection successful!' });
    } catch (error) {
      setConnectionStatus({ type: 'error', message: `Connection failed: ${error.message}` });
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleCreateTestProduct = async () => {
    setTestProductLoading(true);
    setTestProductStatus(null);
    try {
      const testProduct = {
        name: `Test Product ${Date.now()}`,
        sku: `TEST-${Date.now()}`,
        quantityOnHand: 100,
        lowStockThreshold: 10,
        price: 29.99,
        costPrice: 15.00
      };
      
      const result = await createProduct(testProduct);
      setTestProductStatus({ 
        type: 'success', 
        message: `Test product created successfully! ID: ${result.id}` 
      });
    } catch (error) {
      setTestProductStatus({ type: 'error', message: `Failed to create test product: ${error.message}` });
    } finally {
      setTestProductLoading(false);
    }
  };

  const handleClose = () => {
    setConnectionStatus(null);
    setTestProductStatus(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        Settings
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        {/* Connection Test Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WifiIcon color="primary" />
            Backend Connection Test
          </Typography>
          
          <Button
            variant="outlined"
            onClick={handleTestConnection}
            disabled={connectionLoading}
            startIcon={connectionLoading ? <CircularProgress size={16} /> : <WifiIcon />}
            sx={{ mb: 2 }}
          >
            {connectionLoading ? 'Testing...' : 'Test Connection'}
          </Button>
          
          {connectionStatus && (
            <Alert 
              severity={connectionStatus.type} 
              icon={connectionStatus.type === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
            >
              {connectionStatus.message}
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Test Product Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" />
            Create Test Product
          </Typography>
          
          <Button
            variant="outlined"
            onClick={handleCreateTestProduct}
            disabled={testProductLoading}
            startIcon={testProductLoading ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{ mb: 2 }}
          >
            {testProductLoading ? 'Creating...' : 'Create Test Product'}
          </Button>
          
          {testProductStatus && (
            <Alert 
              severity={testProductStatus.type} 
              icon={testProductStatus.type === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
            >
              {testProductStatus.message}
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
