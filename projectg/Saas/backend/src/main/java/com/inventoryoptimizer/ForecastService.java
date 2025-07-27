package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class ForecastService {
    @Autowired
    private SaleRecordRepository saleRecordRepository;
    
    @Autowired
    private ProductRepository productRepository;

    public Map<String, Object> forecastLinearRegression(Long productId, int numDays) {
        List<SaleRecord> sales = saleRecordRepository.findAll().stream()
                .filter(s -> s.getProduct().getId().equals(productId))
                .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
                .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("forecastDays", numDays);
        result.put("historicalSales", sales.size());
        
        if (sales.size() < 2) {
            result.put("forecast", 0.0);
            result.put("averageDailySales", 0.0);
            result.put("confidence", "Low - Not enough historical data");
            result.put("message", "Need at least 2 sales records for forecasting");
            return result;
        }
        
        // Calculate average daily sales
        double totalSales = sales.stream().mapToInt(SaleRecord::getQuantitySold).sum();
        double averageDailySales = totalSales / sales.size();
        
        // Simple linear regression: x = day index, y = quantitySold
        int n = sales.size();
        double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (int i = 0; i < n; i++) {
            sumX += i;
            sumY += sales.get(i).getQuantitySold();
            sumXY += i * sales.get(i).getQuantitySold();
            sumXX += i * i;
        }
        
        double denominator = n * sumXX - sumX * sumX;
        if (Math.abs(denominator) < 1e-8) {
            // Fallback to average when linear regression is not possible
            result.put("forecast", averageDailySales * numDays);
            result.put("averageDailySales", averageDailySales);
            result.put("confidence", "Medium - Using average sales");
            result.put("method", "Average-based forecast");
            return result;
        }
        
        double slope = (n * sumXY - sumX * sumY) / denominator;
        double intercept = (sumY - slope * sumX) / n;
        
        // Forecast for next numDays
        double forecast = 0;
        for (int i = n; i < n + numDays; i++) {
            forecast += Math.max(0, slope * i + intercept);
        }
        
        result.put("forecast", Math.max(0, forecast));
        result.put("averageDailySales", averageDailySales);
        result.put("trend", slope > 0.1 ? "Increasing" : slope < -0.1 ? "Decreasing" : "Stable");
        result.put("confidence", n > 10 ? "High" : n > 5 ? "Medium" : "Low");
        result.put("method", "Linear regression");
        
        return result;
    }
    
    public Map<String, Object> forecastTotalRevenue(int numDays) {
        // Get all products
        List<Product> products = productRepository.findAll();
        Map<String, Object> result = new HashMap<>();
        
        double totalPredictedRevenue = 0.0;
        int productsWithForecasts = 0;
        
        for (Product product : products) {
            if (product.getPrice() != null) {
                Map<String, Object> forecast = forecastLinearRegression(product.getId(), numDays);
                double predictedQuantity = (Double) forecast.get("forecast");
                double predictedRevenue = predictedQuantity * product.getPrice().doubleValue();
                
                if (predictedQuantity > 0) {
                    totalPredictedRevenue += predictedRevenue;
                    productsWithForecasts++;
                }
            }
        }
        
        result.put("predictedRevenue", totalPredictedRevenue);
        result.put("forecastDays", numDays);
        result.put("productsAnalyzed", products.size());
        result.put("productsWithForecasts", productsWithForecasts);
        result.put("method", "Sum of individual product forecasts");
        
        return result;
    }
}
