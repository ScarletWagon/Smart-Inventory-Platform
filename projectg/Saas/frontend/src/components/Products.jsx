import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip } from '@mui/material';
import { Add, Edit, Delete, TrendingUp } from '@mui/icons-material';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchForecast } from '../api/backend';
import { Line } from 'react-chartjs-2';
import ConnectionTest from './ConnectionTest';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: '', sku: '', quantityOnHand: 0, lowStockThreshold: 10 });
  const [forecast, setForecast] = useState(null);
  const [forecastProduct, setForecastProduct] = useState(null);

  const load = async () => {
    try {
      console.log('Loading products...');
      const products = await fetchProducts();
      console.log('Products loaded:', products);
      setProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Error loading products: ' + error.message);
    }
  };
  useEffect(() => { load(); }, []);

  const handleOpen = (product) => {
    setEdit(product);
    setForm(product || { name: '', sku: '', quantityOnHand: 0, lowStockThreshold: 10 });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEdit(null); };
  const handleChange = e => {
    const { name, value } = e.target;
    console.log('Form field changed:', name, '=', value);
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSave = async () => {
    try {
      console.log('Saving product:', form);
      console.log('Edit mode:', !!edit);
      
      // Validate form data
      if (!form.name || !form.sku) {
        alert('Please fill in all required fields (Name and SKU)');
        return;
      }
      
      // Ensure numeric values are properly converted
      const productData = {
        ...form,
        quantityOnHand: parseInt(form.quantityOnHand) || 0,
        lowStockThreshold: parseInt(form.lowStockThreshold) || 10
      };
      
      console.log('Processed product data:', productData);
      
      if (edit) {
        console.log('Updating product with ID:', edit.id);
        await updateProduct(edit.id, productData);
      } else {
        console.log('Creating new product');
        const result = await createProduct(productData);
        console.log('Product created:', result);
      }
      
      handleClose(); 
      console.log('Reloading products list...');
      await load();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + error.message);
    }
  };
  const handleDelete = async id => { await deleteProduct(id); load(); };
  const handleForecast = async product => {
    setForecastProduct(product);
    setForecast(await fetchForecast(product.id, 14));
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
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
        Products
      </Typography>
      
      <ConnectionTest />
      
      <Button 
        variant="contained" 
        startIcon={<Add />} 
        onClick={() => handleOpen(null)} 
        sx={{ 
          mb: 3,
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: 2,
          px: 3,
          py: 1.5,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#2563eb',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.35)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        Add Product
      </Button>
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: '#ffffff',
          borderRadius: 3,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Name
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                SKU
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Stock
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Low Stock Threshold
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow 
                key={p.id} 
                sx={{
                  backgroundColor: p.quantityOnHand <= p.lowStockThreshold ? '#fef3c7' : '#ffffff',
                  borderBottom: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: p.quantityOnHand <= p.lowStockThreshold ? '#fde68a' : '#f8fafc'
                  }
                }}
              >
                <TableCell sx={{ 
                  color: '#1e293b',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  fontWeight: 500,
                  py: 2
                }}>
                  {p.name}
                </TableCell>
                <TableCell sx={{ 
                  color: '#64748b',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  py: 2
                }}>
                  {p.sku}
                </TableCell>
                <TableCell sx={{ 
                  color: p.quantityOnHand <= p.lowStockThreshold ? '#d97706' : '#059669',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  fontWeight: 600,
                  py: 2
                }}>
                  {p.quantityOnHand}
                </TableCell>
                <TableCell sx={{ 
                  color: '#64748b',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  py: 2
                }}>
                  {p.lowStockThreshold}
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Tooltip title="Edit">
                    <IconButton 
                      onClick={() => handleOpen(p)}
                      sx={{
                        color: '#3b82f6',
                        mr: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#dbeafe',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      onClick={() => handleDelete(p.id)}
                      sx={{
                        color: '#ef4444',
                        mr: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#fee2e2',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Forecast">
                    <IconButton 
                      onClick={() => handleForecast(p)}
                      sx={{
                        color: '#10b981',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#d1fae5',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <TrendingUp />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
          fontWeight: 600,
          color: '#1e293b',
          pb: 2
        }}>
          {edit ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <TextField 
            margin="dense" 
            label="Name" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            fullWidth 
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
          <TextField 
            margin="dense" 
            label="SKU" 
            name="sku" 
            value={form.sku} 
            onChange={handleChange} 
            fullWidth 
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
          <TextField 
            margin="dense" 
            label="Stock" 
            name="quantityOnHand" 
            type="number" 
            value={form.quantityOnHand} 
            onChange={handleChange} 
            fullWidth 
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
          <TextField 
            margin="dense" 
            label="Low Stock Threshold" 
            name="lowStockThreshold" 
            type="number" 
            value={form.lowStockThreshold} 
            onChange={handleChange} 
            fullWidth 
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
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{
              color: '#64748b',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              fontWeight: 500,
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f1f5f9'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              color: 'white',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 6px 12px rgba(59, 130, 246, 0.35)'
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog 
        open={!!forecast} 
        onClose={() => setForecast(null)} 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            minWidth: 500
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
          fontWeight: 600,
          color: '#1e293b',
          pb: 2
        }}>
          14-Day Forecast for {forecastProduct?.name}
        </DialogTitle>
        <DialogContent>
          {forecast && (
            <Line
              data={{
                labels: Array.from({length: 14}, (_, i) => `Day ${i+1}`),
                datasets: [{
                  label: 'Forecasted Sales',
                  data: Array.isArray(forecast) ? forecast : [forecast],
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 3,
                  pointBackgroundColor: '#10b981',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                }],
              }}
              options={{ 
                responsive: true, 
                plugins: { 
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    titleFont: {
                      family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                      size: 14,
                      weight: '600'
                    },
                    bodyFont: {
                      family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                      size: 13
                    }
                  }
                },
                scales: { 
                  y: { 
                    beginAtZero: true,
                    grid: {
                      color: '#f1f5f9',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#64748b',
                      font: {
                        family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                        size: 12
                      }
                    }
                  },
                  x: {
                    grid: {
                      color: '#f1f5f9',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#64748b',
                      font: {
                        family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                        size: 12
                      }
                    }
                  }
                },
                animation: {
                  duration: 1500,
                  easing: 'easeInOutCubic'
                }
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setForecast(null)}
            sx={{
              color: '#64748b',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              fontWeight: 500,
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f1f5f9'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
