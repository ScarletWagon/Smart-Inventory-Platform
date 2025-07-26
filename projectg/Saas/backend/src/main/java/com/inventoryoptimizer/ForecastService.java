package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ForecastService {
    @Autowired
    private SaleRecordRepository saleRecordRepository;

    public double forecastLinearRegression(Long productId, int numDays) {
        List<SaleRecord> sales = saleRecordRepository.findAll().stream()
                .filter(s -> s.getProduct().getId().equals(productId))
                .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
                .collect(Collectors.toList());
        if (sales.size() < 2) return 0;
        // Simple linear regression: x = day index, y = quantitySold
        int n = sales.size();
        double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (int i = 0; i < n; i++) {
            sumX += i;
            sumY += sales.get(i).getQuantitySold();
            sumXY += i * sales.get(i).getQuantitySold();
            sumXX += i * i;
        }
        double slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX + 1e-8);
        double intercept = (sumY - slope * sumX) / n;
        // Forecast for next numDays
        double forecast = 0;
        for (int i = n; i < n + numDays; i++) {
            forecast += slope * i + intercept;
        }
        return Math.max(0, forecast);
    }
}
