import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip, useTheme, Chip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Add, Edit, Delete, TrendingUp, Settings, MoreVert, Block, Restore } from '@mui/icons-material';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchForecast, addStock, discontinueProduct, reactivateProduct, forceDeleteProduct } from '../api/backend';
import { Line } from 'react-chartjs-2';
import SettingsDialog from './SettingsDialog';

export default function Products({ mode = 'light' }) {
  const theme = useTheme();
  
  // Common TextField styles that respect the theme
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
      '& fieldset': {
        borderColor: theme.palette.divider,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main
      }
    },
    '& .MuiInputLabel-root': {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
      color: theme.palette.text.secondary,
      '&.Mui-focused': {
        color: theme.palette.primary.main
      }
    },
    '& .MuiOutlinedInput-input': {
      color: theme.palette.text.primary
    }
  };
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: '', sku: '', quantityOnHand: 0, lowStockThreshold: 10, price: '', costPrice: '' });
  const [forecast, setForecast] = useState(null);
  const [forecastProduct, setForecastProduct] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    setForm(product || { name: '', sku: '', quantityOnHand: 0, lowStockThreshold: 10, price: '', costPrice: '' });
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
        lowStockThreshold: parseInt(form.lowStockThreshold) || 10,
        price: form.price ? parseFloat(form.price) : null,
        costPrice: form.costPrice ? parseFloat(form.costPrice) : null
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
  const handleDelete = async (id) => {
    try {
      console.log('Deleting product with ID:', id);
      
      // Ask for confirmation
      if (!window.confirm('Are you sure you want to delete this product?')) {
        return;
      }
      
      await deleteProduct(id);
      console.log('Product deleted successfully');
      
      // Reload the products list
      await load();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    }
  };

  const handleDiscontinue = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to discontinue this product?')) {
        return;
      }
      await discontinueProduct(id);
      await load();
    } catch (error) {
      console.error('Error discontinuing product:', error);
      alert('Error discontinuing product: ' + error.message);
    }
  };

  const handleReactivate = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to reactivate this product?')) {
        return;
      }
      await reactivateProduct(id);
      await load();
    } catch (error) {
      console.error('Error reactivating product:', error);
      alert('Error reactivating product: ' + error.message);
    }
  };

  const handleForceDelete = async (id) => {
    try {
      if (!window.confirm('⚠️ WARNING: This will permanently delete the product AND all its sales history. This action cannot be undone. Are you sure?')) {
        return;
      }
      await forceDeleteProduct(id);
      await load();
    } catch (error) {
      console.error('Error force deleting product:', error);
      alert('Error force deleting product: ' + error.message);
    }
  };

  const handleActionMenuOpen = (event, product) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedProduct(null);
  };
  
  const handleAddStock = async (product) => {
    try {
      const quantity = prompt(`How many units would you like to add to ${product.name}?`);
      if (quantity === null) return; // User cancelled
      
      const quantityNum = parseInt(quantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        alert('Please enter a valid positive number');
        return;
      }
      
      console.log('Adding stock:', quantityNum, 'to product:', product.name);
      await addStock(product.id, quantityNum);
      
      // Reload the products list
      await load();
      alert(`Successfully added ${quantityNum} units to ${product.name}`);
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Error adding stock: ' + error.message);
    }
  };
  
  const handleForecast = async (product) => {
    try {
      console.log('Getting forecast for product:', product.name);
      setForecastProduct(product);
      const forecastData = await fetchForecast(product.id, 14);
      console.log('Forecast data received:', forecastData);
      setForecast(forecastData);
    } catch (error) {
      console.error('Error getting forecast:', error);
      alert('Error getting forecast: ' + error.message);
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      bgcolor: theme.palette.background.default,
      background: mode === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700, 
          mb: 4,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          color: theme.palette.text.primary,
          letterSpacing: '-0.025em'
        }}
      >
        Products
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpen(null)} 
          sx={{ 
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
            fontWeight: 600,
          textTransform: 'none',
          boxShadow: `0 4px 6px ${theme.palette.primary.main}40`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: `0 10px 25px ${theme.palette.primary.main}50`,
            transform: 'translateY(-2px)'
          }
        }}
      >
        Add Product
      </Button>
      
      <Tooltip title="Settings">
        <IconButton
          onClick={() => setSettingsOpen(true)}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              bgcolor: theme.palette.action.hover
            }
          }}
        >
          <Settings />
        </IconButton>
      </Tooltip>
      </Box>
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: mode === 'dark' ? '#1e293b' : '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Name
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                SKU
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Stock
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Low Stock Threshold
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Price
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Cost Price
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                fontSize: '0.875rem',
                py: 2
              }}>
                Status
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
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
                  backgroundColor: p.quantityOnHand <= p.lowStockThreshold 
                    ? (mode === 'dark' ? '#7c2d12' : '#fef3c7')
                    : theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: p.quantityOnHand <= p.lowStockThreshold 
                      ? (mode === 'dark' ? '#9a3412' : '#fde68a')
                      : theme.palette.action.hover
                  }
                }}
              >
                <TableCell sx={{ 
                  color: theme.palette.text.primary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  fontWeight: 500,
                  py: 2
                }}>
                  {p.name}
                </TableCell>
                <TableCell sx={{ 
                  color: theme.palette.text.secondary,
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
                  color: theme.palette.text.secondary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  py: 2
                }}>
                  {p.lowStockThreshold}
                </TableCell>
                <TableCell sx={{ 
                  color: theme.palette.text.secondary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  py: 2
                }}>
                  {p.price ? `$${parseFloat(p.price).toFixed(2)}` : 'Not set'}
                </TableCell>
                <TableCell sx={{ 
                  color: theme.palette.text.secondary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                  py: 2
                }}>
                  {p.costPrice ? `$${parseFloat(p.costPrice).toFixed(2)}` : 'Not set'}
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    label={p.discontinued ? 'Discontinued' : 'Active'}
                    size="small"
                    color={p.discontinued ? 'error' : 'success'}
                    sx={{
                      fontWeight: 500,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Tooltip title="Edit">
                    <IconButton 
                      onClick={() => handleOpen(p)}
                      sx={{
                        color: theme.palette.primary.main,
                        mr: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '20',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More actions">
                    <IconButton 
                      onClick={(e) => handleActionMenuOpen(e, p)}
                      sx={{
                        color: theme.palette.text.secondary,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <MoreVert />
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
            boxShadow: mode === 'dark' ? '0 20px 40px rgba(0, 0, 0, 0.5)' : '0 20px 40px rgba(0, 0, 0, 0.15)',
            minWidth: 400,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
          fontWeight: 600,
          color: theme.palette.text.primary,
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
            sx={textFieldStyles}
          />
          <TextField 
            margin="dense" 
            label="SKU" 
            name="sku" 
            value={form.sku} 
            onChange={handleChange} 
            fullWidth 
            sx={textFieldStyles}
          />
          <TextField 
            margin="dense" 
            label="Stock" 
            name="quantityOnHand" 
            type="number" 
            value={form.quantityOnHand} 
            onChange={handleChange} 
            fullWidth 
            sx={textFieldStyles}
          />
          <TextField 
            margin="dense" 
            label="Price (optional)"
            name="price" 
            type="number" 
            value={form.price} 
            onChange={handleChange} 
            fullWidth 
            inputProps={{ step: "0.01", min: "0" }}
            sx={textFieldStyles}
          />
          <TextField 
            margin="dense" 
            label="Cost Price (optional)"
            name="costPrice" 
            type="number" 
            value={form.costPrice} 
            onChange={handleChange} 
            fullWidth 
            inputProps={{ step: "0.01", min: "0" }}
            sx={textFieldStyles}
          />
          <TextField 
            margin="dense" 
            label="Low Stock Threshold" 
            name="lowStockThreshold" 
            type="number" 
            value={form.lowStockThreshold} 
            onChange={handleChange} 
            fullWidth 
            sx={textFieldStyles}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              fontWeight: 500,
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: `0 4px 6px ${theme.palette.primary.main}40`,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: `0 6px 12px ${theme.palette.primary.main}50`
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
            boxShadow: mode === 'dark' ? '0 20px 40px rgba(0, 0, 0, 0.5)' : '0 20px 40px rgba(0, 0, 0, 0.15)',
            minWidth: 500,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
          fontWeight: 600,
          color: theme.palette.text.primary,
          pb: 2
        }}>
          14-Day Forecast for {forecastProduct?.name}
        </DialogTitle>
        <DialogContent>
          {forecast && (
            <Box>
              {/* Forecast Summary */}
              <Box sx={{ mb: 3, p: 2, backgroundColor: mode === 'dark' ? '#1e293b' : '#f8fafc', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}>
                  Forecast Summary
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Predicted Sales (14 days)</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#059669' }}>
                      {Math.round(forecast.forecast || 0)} units
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Daily Average</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#0ea5e9' }}>
                      {Math.round((forecast.averageDailySales || 0) * 100) / 100} units/day
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Trend</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#7c3aed' }}>
                      {forecast.trend || 'Unknown'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Confidence</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#dc2626' }}>
                      {forecast.confidence || 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
                {forecast.message && (
                  <Typography variant="body2" sx={{ 
                    mt: 2, 
                    p: 1, 
                    backgroundColor: mode === 'dark' ? '#7c2d12' : '#fef3c7', 
                    borderRadius: 1, 
                    color: mode === 'dark' ? '#fed7aa' : '#92400e' 
                  }}>
                    {forecast.message}
                  </Typography>
                )}
              </Box>

              {/* Chart */}
              {forecast.forecast > 0 && (
                <Line
                  data={{
                    labels: Array.from({length: 14}, (_, i) => `Day ${i+1}`),
                    datasets: [{
                      label: 'Forecasted Sales',
                      data: Array.from({length: 14}, (_, i) => (forecast.forecast / 14) * (i + 1)),
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
                        backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
                        titleColor: theme.palette.text.primary,
                        bodyColor: theme.palette.text.primary,
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
                        title: {
                          display: true,
                          text: 'Cumulative Sales',
                          color: '#64748b',
                          font: {
                            family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                            size: 13,
                            weight: '500'
                          }
                        },
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
                        title: {
                          display: true,
                          text: 'Days',
                          color: '#64748b',
                          font: {
                            family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
                            size: 13,
                            weight: '500'
                          }
                        },
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
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setForecast(null)}
            sx={{
              color: theme.palette.text.secondary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui',
              fontWeight: 500,
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[8]
          }
        }}
      >
        <MenuItem onClick={() => { handleAddStock(selectedProduct); handleActionMenuClose(); }}>
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Stock</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { handleForecast(selectedProduct); handleActionMenuClose(); }}>
          <ListItemIcon>
            <TrendingUp fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Forecast</ListItemText>
        </MenuItem>
        
        {selectedProduct && !selectedProduct.discontinued ? (
          <MenuItem 
            onClick={() => { handleDiscontinue(selectedProduct.id); handleActionMenuClose(); }}
            sx={{ color: theme.palette.warning.main }}
          >
            <ListItemIcon>
              <Block fontSize="small" sx={{ color: theme.palette.warning.main }} />
            </ListItemIcon>
            <ListItemText>Discontinue</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem 
            onClick={() => { handleReactivate(selectedProduct?.id); handleActionMenuClose(); }}
            sx={{ color: theme.palette.success.main }}
          >
            <ListItemIcon>
              <Restore fontSize="small" sx={{ color: theme.palette.success.main }} />
            </ListItemIcon>
            <ListItemText>Reactivate</ListItemText>
          </MenuItem>
        )}
        
        <MenuItem 
          onClick={() => { handleDelete(selectedProduct?.id); handleActionMenuClose(); }}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => { handleForceDelete(selectedProduct?.id); handleActionMenuClose(); }}
          sx={{ color: theme.palette.error.dark, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: theme.palette.error.dark }} />
          </ListItemIcon>
          <ListItemText>
            <strong>Force Delete</strong>
            <br />
            <small style={{ color: theme.palette.text.secondary }}>
              Deletes product + all sales data
            </small>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </Box>
  );
}
