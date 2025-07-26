
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { fetchProducts, fetchForecast, fetchProducts as fetchAllProducts, fetchSalesHistory } from '../api/backend';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);


export default function Dashboard() {
  // State for products, low stock, and sales data
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [salesData, setSalesData] = useState([]);

  // Fetch product data and real sales data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const productData = await fetchAllProducts();
        setProducts(productData);
        setLowStock(productData.filter(p => p.quantityOnHand <= p.lowStockThreshold));
        
        // Try to fetch real sales data from backend
        try {
          const salesHistory = await fetchSalesHistory(30);
          if (salesHistory && salesHistory.length > 0) {
            // Transform backend data to chart format
            const chartData = salesHistory.map(item => ({
              day: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              sales: item.sales
            }));
            setSalesData(chartData);
          } else {
            // Fallback to mock data if no sales history available
            const mockSalesData = Array.from({length: 30}, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (29 - i));
              return { 
                day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                sales: Math.floor(Math.random() * 15 + 5)
              };
            });
            setSalesData(mockSalesData);
          }
        } catch (salesError) {
          console.log('Sales history endpoint not available, using mock data:', salesError);
          // Fallback to mock data if sales history endpoint doesn't exist yet
          const mockSalesData = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return { 
              day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
              sales: Math.floor(Math.random() * 15 + 5)
            };
          });
          setSalesData(mockSalesData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadData();
  }, []);

  // Calculate total stock
  const totalStock = products.reduce((sum, p) => sum + p.quantityOnHand, 0);

  // Modern, consistent color scheme dashboard layout
  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      height: '100%', 
      width: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Dashboard title with consistent typography */}
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
        Dashboard
      </Typography>
      
      {/* Modern responsive grid with consistent design */}
      <Grid container spacing={3} sx={{ height: 'calc(100% - 120px)' }}>
        {/* Summary Cards Row */}
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Grid container spacing={3} sx={{ height: { xs: 'auto', md: '200px' } }}>
            {/* Total Products card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 60px rgba(59, 130, 246, 0.25)',
                  borderRadius: 5,
                }
              }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui', opacity: 0.9, mb: 3 }}>
                    Total Products
                  </Typography>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800, 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1
                  }}>
                    {products.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Total Stock card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 60px rgba(16, 185, 129, 0.25)',
                  borderRadius: 5,
                }
              }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui', opacity: 0.9, mb: 2 }}>
                    Total Stock
                  </Typography>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800, 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1
                  }}>
                    {totalStock}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Low Stock Alerts card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%',
                background: lowStock.length > 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                boxShadow: lowStock.length > 0 ? '0 8px 32px rgba(245, 158, 11, 0.15)' : '0 8px 32px rgba(107, 114, 128, 0.15)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: lowStock.length > 0 ? '0 20px 60px rgba(245, 158, 11, 0.25)' : '0 20px 60px rgba(107, 114, 128, 0.25)',
                  borderRadius: 5,
                }
              }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui', opacity: 0.9, mb: 2 }}>
                    Low Stock Alerts
                  </Typography>
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {lowStock.length === 0 ? 
                      <Typography sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui', opacity: 0.8, fontSize: '1.1rem' }}>
                        All Stock Levels Good ✅
                      </Typography> : 
                      <>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 800, 
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
                          mb: 1
                        }}>
                          {lowStock.length}
                        </Typography>
                        <Typography sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui', opacity: 0.8 }}>
                          Items need restocking
                        </Typography>
                      </>
                    }
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Sales Trend chart - Full width, fills remaining space */}
        <Grid item xs={12} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ 
            flex: 1,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-2px)',
              borderRadius: 5,
            }
          }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui',
                color: '#1e293b'
              }}>
                Sales Trend (Last 30 Days)
              </Typography>
              {/* Chart container with fixed height */}
              <Box sx={{ flex: 1, minHeight: { xs: 300, md: 400 }, position: 'relative' }}>
                <Line
                  data={{
                    labels: salesData.map(d => d.day),
                    datasets: [{
                      label: 'Sales',
                      data: salesData.map(d => d.sales),
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      tension: 0.4,
                      fill: true,
                      borderWidth: 3,
                      pointBackgroundColor: '#3b82f6',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
