import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';

const API_BASE = 'http://localhost:8081/api';

export default function ConnectionTest() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing...');
    
    try {
      console.log('Testing connection to:', API_BASE);
      
      // Test basic connectivity
      const response = await fetch(`${API_BASE}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setStatus(`✅ Connection successful! Got ${data.length} products.`);
      } else {
        const errorText = await response.text();
        setStatus(`❌ Connection failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setStatus(`❌ Connection error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateProduct = async () => {
    setLoading(true);
    setStatus('Testing product creation...');
    
    try {
      const testProduct = {
        name: 'Test Product ' + Date.now(),
        sku: 'TEST-' + Date.now(),
        quantityOnHand: 50,
        lowStockThreshold: 10
      };
      
      console.log('Creating test product:', testProduct);
      
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testProduct),
      });
      
      console.log('Create response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Created product:', data);
        setStatus(`✅ Product created successfully! ID: ${data.id}`);
      } else {
        const errorText = await response.text();
        console.error('Create failed:', errorText);
        setStatus(`❌ Failed to create product: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error('Create error:', error);
      setStatus(`❌ Create error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Connection Test</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={testConnection} 
          disabled={loading}
        >
          Test Connection
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={testCreateProduct} 
          disabled={loading}
        >
          Test Create Product
        </Button>
      </Box>
      
      {status && (
        <Alert severity={status.includes('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>
          {status}
        </Alert>
      )}
      
      <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
        Check the browser console (F12) for detailed logs.
      </Typography>
    </Box>
  );
}
