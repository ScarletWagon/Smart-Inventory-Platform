
// Main App component for the frontend
// Uses Material-UI for layout and styling
import React, { useState } from 'react';
import { CssBaseline, Box, Paper, ThemeProvider, createTheme } from '@mui/material';
// Import top navigation/header
import Header from './components/Header.jsx';
// Import page components
import Dashboard from './components/Dashboard.jsx';
import Products from './components/Products.jsx';
import Sales from './components/Sales.jsx';
import Logs from './components/Logs.jsx';

function App() {
  // State to track which page is active (dashboard, products, or sales)
  const [page, setPage] = useState('dashboard');
  // State to track theme mode (light/dark)
  const [mode, setMode] = useState('light');

  // Create Material-UI theme based on mode
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#3b82f6',
      },
      secondary: {
        main: '#10b981',
      },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: mode === 'dark' ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
        secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? '#0f172a' : '#f8fafc',
          },
        },
      },
    },
  });

  // Determine which component to render based on the current page
  let content;
  if (page === 'dashboard') content = <Dashboard mode={mode} setMode={setMode} />;
  else if (page === 'products') content = <Products mode={mode} />;
  else if (page === 'sales') content = <Sales mode={mode} />;
  else if (page === 'logs') content = <Logs mode={mode} />;

  // Main layout
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline provides a consistent baseline for styles across browsers */}
      <CssBaseline />
      {/* Header contains the app title and navigation buttons */}
      <Header onNav={setPage} current={page} />
      {/* Main content area, fills the viewport and provides background color */}
      <Box sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        m: 0,
        p: 0,
      }}>
        {/* Main content area grows to fill available space */}
        <Box sx={{ flex: 1, width: '100vw', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minHeight: 0, m: 0, p: 0 }}>
          {/* Paper fills the available space and is fully responsive */}
          <Paper elevation={3} sx={{
            flex: 1,
            width: '100vw',
            height: '100%',
            minHeight: 0,
            p: { xs: 1, md: 3 },
            bgcolor: 'background.paper',
            borderRadius: 0,
            boxShadow: mode === 'dark' ? '0 4px 24px 0 rgba(0,0,0,0.3)' : '0 4px 24px 0 rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            m: 0,
          }}>
            {/* Render the selected page's content here */}
            {content}
          </Paper>
        </Box>
        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary', fontSize: 14, width: '100vw', m: 0, p: 0 }}>
          &copy; {new Date().getFullYear()} Smart Inventory & Demand Forecasting Tool
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
