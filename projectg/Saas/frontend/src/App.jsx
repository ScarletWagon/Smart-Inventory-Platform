
// Main App component for the frontend
// Uses Material-UI for layout and styling
import React, { useState } from 'react';
import { CssBaseline, Box, Paper } from '@mui/material';
// Import top navigation/header
import Header from './components/Header.jsx';
// Import page components
import Dashboard from './components/Dashboard.jsx';
import Products from './components/Products.jsx';
import Sales from './components/Sales.jsx';

function App() {
  // State to track which page is active (dashboard, products, or sales)
  const [page, setPage] = useState('dashboard');

  // Determine which component to render based on the current page
  let content;
  if (page === 'dashboard') content = <Dashboard />;
  else if (page === 'products') content = <Products />;
  else if (page === 'sales') content = <Sales />;

  // Main layout
  return (
    <>
      {/* CssBaseline provides a consistent baseline for styles across browsers */}
      <CssBaseline />
      {/* Header contains the app title and navigation buttons */}
      <Header onNav={setPage} current={page} />
      {/* Main content area, fills the viewport and provides background color */}
      <Box sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        bgcolor: '#f4f6fa',
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
            bgcolor: '#fff',
            borderRadius: 0,
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
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
        <Box sx={{ textAlign: 'center', py: 2, color: 'grey.600', fontSize: 14, width: '100vw', m: 0, p: 0 }}>
          &copy; {new Date().getFullYear()} Smart Inventory & Demand Forecasting Tool
        </Box>
      </Box>
    </>
  );
}

export default App;
