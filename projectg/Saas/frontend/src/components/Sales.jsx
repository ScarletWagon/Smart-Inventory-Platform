import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, MenuItem, TextField, Snackbar, Alert } from '@mui/material';
import { fetchProducts, recordSale } from '../api/backend';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState('');
  const [qty, setQty] = useState(1);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchProducts().then(setProducts); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await recordSale(selected, qty);
      setSnack({ open: true, message: 'Sale recorded!', severity: 'success' });
      setSelected(''); setQty(1);
    } catch {
      setSnack({ open: true, message: 'Error recording sale', severity: 'error' });
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      height: '100%', 
      width: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700, 
          mb: 4,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          color: '#1e293b',
          letterSpacing: '-0.025em'
        }}
      >
        Sales
      </Typography>
      
      {/* Centered form container */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <Paper sx={{ 
          p: 4,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0',
          width: '100%',
          maxWidth: 500,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          }
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: 3,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
              color: '#1e293b',
              textAlign: 'center'
            }}
          >
            Record New Sale
          </Typography>
          <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Product"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                '&:hover fieldset': {
                  borderColor: '#3b82f6'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6'
                }
              },
              '& .MuiInputLabel-root': {
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                '&.Mui-focused': {
                  color: '#3b82f6'
                }
              }
            }}
          >
            {products.map(p => (
              <MenuItem 
                key={p.id} 
                value={p.id}
                sx={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  '&:hover': {
                    backgroundColor: '#f1f5f9'
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#dbeafe',
                    '&:hover': {
                      backgroundColor: '#bfdbfe'
                    }
                  }
                }}
              >
                {p.name} (SKU: {p.sku})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Quantity Sold"
            type="number"
            value={qty}
            onChange={e => setQty(Number(e.target.value))}
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                '&:hover fieldset': {
                  borderColor: '#3b82f6'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6'
                }
              },
              '& .MuiInputLabel-root': {
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                '&.Mui-focused': {
                  color: '#3b82f6'
                }
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ 
              mt: 3,
              py: 1.5,
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: 2,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.35)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Submit Sale
          </Button>
          </form>
        </Paper>
      </Box>
      
      <Snackbar 
        open={snack.open} 
        autoHideDuration={3000} 
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snack.severity}
          sx={{
            borderRadius: 2,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
            fontWeight: 500
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
