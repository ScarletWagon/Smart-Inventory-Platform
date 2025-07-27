import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import { Add, ShoppingCart, TrendingUp } from '@mui/icons-material';
import { fetchProducts, recordSale, fetchAllSales, fetchTotalRevenue } from '../api/backend';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revenue, setRevenue] = useState(null);
  const [alert, setAlert] = useState(null);
  
  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantitySold: 1,
    unitPrice: '',
    customerName: '',
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, productsData, revenueData] = await Promise.all([
        fetchAllSales(),
        fetchProducts(),
        fetchTotalRevenue()
      ]);
      
      setSales(salesData || []);
      setProducts(productsData || []);
      setRevenue(revenueData || {});
    } catch (error) {
      console.error('Error loading data:', error);
      setAlert({ type: 'error', message: 'Failed to load data: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpen = () => {
    setSaleForm({
      productId: '',
      quantitySold: 1,
      unitPrice: '',
      customerName: '',
      notes: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAlert(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!saleForm.productId || saleForm.quantitySold <= 0) {
        setAlert({ type: 'error', message: 'Please select a product and enter a valid quantity.' });
        return;
      }

      const saleData = {
        productId: saleForm.productId,
        quantitySold: parseInt(saleForm.quantitySold),
        unitPrice: saleForm.unitPrice ? parseFloat(saleForm.unitPrice) : null,
        customerName: saleForm.customerName || null,
        notes: saleForm.notes || null
      };

      await recordSale(saleData);
      setAlert({ type: 'success', message: 'Sale recorded successfully!' });
      handleClose();
      loadData(); // Refresh the data
    } catch (error) {
      console.error('Error recording sale:', error);
      setAlert({ type: 'error', message: 'Failed to record sale: ' + error.message });
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const formatCurrency = (amount) => {
    return amount ? `$${amount.toFixed(2)}` : '$0.00';
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Sales Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{ borderRadius: 3 }}
        >
          Record New Sale
        </Button>
      </Box>

      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 3 }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      {/* Revenue Summary */}
      {revenue && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Revenue</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(revenue.totalRevenue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingCart sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Sales</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {revenue.totalSales || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Units Sold</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {revenue.totalQuantitySold || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Sales Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Sales</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" color="textSecondary">
                        No sales recorded yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.slice().reverse().map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(sale.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getProductName(sale.product?.id)} 
                          variant="outlined" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{sale.quantitySold}</TableCell>
                      <TableCell>{formatCurrency(sale.unitPrice)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(sale.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {sale.customerName || <em>Not specified</em>}
                      </TableCell>
                      <TableCell>
                        {sale.notes || <em>No notes</em>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Sale Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Record New Sale</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Product</InputLabel>
              <Select
                name="productId"
                value={saleForm.productId}
                label="Product"
                onChange={handleInputChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} (Stock: {product.quantityOnHand})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="quantitySold"
              label="Quantity Sold"
              type="number"
              value={saleForm.quantitySold}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 1 }}
              sx={{ mb: 3 }}
            />

            <TextField
              name="unitPrice"
              label="Unit Price (optional)"
              type="number"
              value={saleForm.unitPrice}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 2 }} />

            <TextField
              name="customerName"
              label="Customer Name (optional)"
              value={saleForm.customerName}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 3 }}
            />

            <TextField
              name="notes"
              label="Notes (optional)"
              value={saleForm.notes}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!saleForm.productId || saleForm.quantitySold <= 0}
          >
            Record Sale
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
