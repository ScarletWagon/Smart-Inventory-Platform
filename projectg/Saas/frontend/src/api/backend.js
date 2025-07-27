// API utility for backend calls
const API_BASE = 'http://localhost:8081/api';

export async function testConnection() {
  console.log('Testing connection to backend...');
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) {
    throw new Error(`Backend connection failed: ${res.status} ${res.statusText}`);
  }
  console.log('Backend connection successful');
  return true;
}

export async function fetchProducts() {
  console.log('Fetching products from:', `${API_BASE}/products`);
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Fetched products:', data);
  return data;
}

export async function createProduct(product) {
  console.log('Creating product:', product);
  console.log('Sending to:', `${API_BASE}/products`);
  
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create product: ${res.status} ${res.statusText} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('Product created:', data);
  return data;
}

export async function updateProduct(id, product) {
  console.log('Updating product:', id, product);
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update product: ${res.status} ${res.statusText} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('Product updated:', data);
  return data;
}

export async function deleteProduct(id) {
  console.log('Deleting product:', id);
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  
  if (!res.ok) {
    let errorMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || `${res.status} ${res.statusText}`;
    } catch {
      errorMessage = `${res.status} ${res.statusText}`;
    }
    throw new Error(`Failed to delete product: ${errorMessage}`);
  }
  
  console.log('Product deleted successfully');
}

// Discontinue a product
export async function discontinueProduct(id) {
  console.log('Discontinuing product:', id);
  const res = await fetch(`${API_BASE}/products/${id}/discontinue`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!res.ok) {
    throw new Error(`Failed to discontinue product: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  console.log('Product discontinued:', data);
  return data;
}

// Reactivate a product
export async function reactivateProduct(id) {
  console.log('Reactivating product:', id);
  const res = await fetch(`${API_BASE}/products/${id}/reactivate`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!res.ok) {
    throw new Error(`Failed to reactivate product: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  console.log('Product reactivated:', data);
  return data;
}

// Force delete a product and all related data
export async function forceDeleteProduct(id) {
  console.log('Force deleting product:', id);
  const res = await fetch(`${API_BASE}/products/${id}/force`, { method: 'DELETE' });
  
  if (!res.ok) {
    let errorMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || `${res.status} ${res.statusText}`;
    } catch {
      errorMessage = `${res.status} ${res.statusText}`;
    }
    throw new Error(`Failed to force delete product: ${errorMessage}`);
  }
  
  console.log('Product force deleted successfully');
}

// Get stock investment information
export async function fetchStockInvestment() {
  console.log('Fetching stock investment data');
  const res = await fetch(`${API_BASE}/products/stock-investment`);
  if (!res.ok) {
    throw new Error(`Failed to fetch stock investment: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Stock investment data:', data);
  return data;
}

// Add stock to a product
export async function addStock(productId, quantity) {
  console.log('Adding stock:', productId, quantity);
  const res = await fetch(`${API_BASE}/products/${productId}/add-stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to add stock: ${res.status} ${res.statusText} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('Stock added:', data);
  return data;
}

// Get product revenue information
export async function fetchProductRevenue(productId) {
  console.log('Fetching product revenue:', productId);
  const res = await fetch(`${API_BASE}/products/${productId}/revenue`);
  if (!res.ok) {
    throw new Error(`Failed to fetch product revenue: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Product revenue:', data);
  return data;
}

// Record a sale with full details
export async function recordSale(saleData) {
  console.log('Recording sale:', saleData);
  const res = await fetch(`${API_BASE}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saleData),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to record sale: ${res.status} ${res.statusText} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('Sale recorded:', data);
  return data;
}

// Quick sale (backward compatibility)
export async function recordQuickSale(productId, quantitySold) {
  const params = new URLSearchParams({ productId, quantitySold });
  const res = await fetch(`${API_BASE}/sales/quick?${params.toString()}`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Failed to record sale: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Get all sales
export async function fetchAllSales() {
  console.log('Fetching all sales');
  const res = await fetch(`${API_BASE}/sales`);
  if (!res.ok) {
    throw new Error(`Failed to fetch sales: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('All sales:', data);
  return data;
}

// Get recent sales
export async function fetchRecentSales() {
  console.log('Fetching recent sales');
  const res = await fetch(`${API_BASE}/sales/recent`);
  if (!res.ok) {
    throw new Error(`Failed to fetch recent sales: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Recent sales:', data);
  return data;
}

// Get total revenue
export async function fetchTotalRevenue() {
  console.log('Fetching total revenue');
  const res = await fetch(`${API_BASE}/sales/revenue/total`);
  if (!res.ok) {
    throw new Error(`Failed to fetch total revenue: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Total revenue:', data);
  return data;
}

export async function fetchForecast(productId, days = 7) {
  const res = await fetch(`${API_BASE}/forecasts/product/${productId}?days=${days}`);
  return res.json();
}

// Get predicted revenue for multiple products
export async function fetchPredictedRevenue(days = 30) {
  console.log('Fetching predicted revenue for', days, 'days');
  const res = await fetch(`${API_BASE}/forecasts/revenue?days=${days}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch predicted revenue: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Predicted revenue data:', data);
  return data;
}

export async function fetchSalesHistory(days = 30) {
  console.log('Fetching sales history for', days, 'days');
  const res = await fetch(`${API_BASE}/sales/history/daily-trend?days=${days}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch sales history: ${res.status} ${res.statusText} - ${errorText}`);
  }
  const data = await res.json();
  console.log('Sales history data:', data);
  return data;
}

// Log-related API calls
export async function fetchLogs(page = 0, size = 50) {
  console.log('Fetching logs, page:', page, 'size:', size);
  const res = await fetch(`${API_BASE}/logs?page=${page}&size=${size}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch logs: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Logs data:', data);
  return data;
}

export async function fetchLogsByAction(action) {
  console.log('Fetching logs by action:', action);
  const res = await fetch(`${API_BASE}/logs/action/${action}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch logs: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Logs by action:', data);
  return data;
}

export async function fetchLogsByEntityType(entityType) {
  console.log('Fetching logs by entity type:', entityType);
  const res = await fetch(`${API_BASE}/logs/entity/${entityType}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch logs: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Logs by entity type:', data);
  return data;
}
