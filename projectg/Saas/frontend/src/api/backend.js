// API utility for backend calls
const API_BASE = 'http://localhost:8080/api';

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function deleteProduct(id) {
  await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
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
  const res = await fetch(`${API_BASE}/sales-history/daily-trend?days=${days}`);
  if (!res.ok) {
    throw new Error('Failed to fetch sales history');
  }
  return res.json();
}
