import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, useTheme } from '@mui/material';

export default function Header({ onNav, current }) {
  const theme = useTheme();
  
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
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
            color: theme.palette.text.primary,
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
              color: current==='dashboard' ? theme.palette.primary.main : theme.palette.text.secondary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              px: 3,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main
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
              color: current==='products' ? theme.palette.primary.main : theme.palette.text.secondary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              px: 3,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main
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
              color: current==='sales' ? theme.palette.primary.main : theme.palette.text.secondary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              px: 3,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main
              }
            }}
          >
            Sales
          </Button>
          <Button 
            color="inherit" 
            onClick={() => onNav('logs')} 
            sx={{ 
              fontWeight: current==='logs'?700:500,
              color: current==='logs' ? theme.palette.primary.main : theme.palette.text.secondary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              px: 3,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main
              }
            }}
          >
            Logs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
