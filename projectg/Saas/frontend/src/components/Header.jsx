import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

export default function Header({ onNav, current }) {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        backdropFilter: 'blur(20px)',
        height: '80px',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Toolbar sx={{ height: '100%' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            color: '#1e293b',
            letterSpacing: '-0.025em'
          }}
        >
          Smart Inventory & Demand Forecasting
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            onClick={() => onNav('dashboard')} 
            sx={{ 
              fontWeight: current==='dashboard'?700:500,
              color: current==='dashboard' ? '#3b82f6' : '#64748b',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              px: 3,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                color: '#3b82f6'
              }
            }}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            onClick={() => onNav('products')} 
            sx={{ 
              fontWeight: current==='products'?700:500,
              color: current==='products' ? '#3b82f6' : '#64748b',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              px: 3,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                color: '#3b82f6'
              }
            }}
          >
            Products
          </Button>
          <Button 
            color="inherit" 
            onClick={() => onNav('sales')} 
            sx={{ 
              fontWeight: current==='sales'?700:500,
              color: current==='sales' ? '#3b82f6' : '#64748b',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              px: 3,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                color: '#3b82f6'
              }
            }}
          >
            Sales
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
