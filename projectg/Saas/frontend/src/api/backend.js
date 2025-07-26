// API utility for backend calls
const API_BASE = 'http://localhost:8081/api';

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
    const errorText = await res.text();
    throw new Error(`Failed to delete product: ${res.status} ${res.statusText} - ${errorText}`);
  }
  
  console.log('Product deleted successfully');
}

export async function recordSale(productId, quantitySold) {
  const params = new URLSearchParams({ productId, quantitySold });
  const res = await fetch(`${API_BASE}/sales?${params.toString()}`, { method: 'POST' });
  return res.json();
}

export async function fetchForecast(productId, days = 7) {
  const res = await fetch(`${API_BASE}/forecasts/product/${productId}?days=${days}`);
  return res.json();
}

export async function fetchSalesHistory(days = 30) {
  const res = await fetch(`${API_BASE}/sales/history/daily-trend?days=${days}`);
  if (!res.ok) {
    throw new Error('Failed to fetch sales history');
  }
  return res.json();
}
