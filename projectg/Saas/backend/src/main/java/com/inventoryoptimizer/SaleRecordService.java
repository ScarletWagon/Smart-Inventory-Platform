package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class SaleRecordService {
    @Autowired
    private SaleRecordRepository saleRecordRepository;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private LogService logService;

    @Transactional
    public SaleRecord recordSale(Long productId, int quantitySold, BigDecimal unitPrice, String customerName, String notes) {
        // Reduce stock using the ProductService
        Product product = productService.reduceStock(productId, quantitySold);
        
        // Calculate total amount
        BigDecimal totalAmount = unitPrice != null ? unitPrice.multiply(BigDecimal.valueOf(quantitySold)) : BigDecimal.ZERO;

        SaleRecord sale = new SaleRecord();
        sale.setProduct(product);
        sale.setQuantitySold(quantitySold);
        sale.setUnitPrice(unitPrice);
        sale.setTotalAmount(totalAmount);
        sale.setCustomerName(customerName);
        sale.setNotes(notes);
        sale.setTimestamp(LocalDateTime.now());
        
        SaleRecord savedSale = saleRecordRepository.save(sale);
        
        // Log the sale
        logService.logSale(savedSale.getId(), productId, product.getName(), quantitySold, "system");
        
        return savedSale;
    }
    
    // Overloaded method for backward compatibility
    public SaleRecord recordSale(Long productId, int quantitySold) {
        return recordSale(productId, quantitySold, null, null, null);
    }

    public List<SaleRecord> getSalesForProduct(Long productId) {
        return saleRecordRepository.findByProductId(productId);
    }
    
    public List<SaleRecord> getAllSales() {
        return saleRecordRepository.findAll();
    }
    
    public List<SaleRecord> getRecentSales() {
        return saleRecordRepository.findTop10ByOrderByTimestampDesc();
    }

    public List<Map<String, Object>> getDailyTrend(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<SaleRecord> recentSales = saleRecordRepository.findByTimestampBetween(startDate, LocalDateTime.now());

        return recentSales.stream()
                .collect(Collectors.groupingBy(
                    sale -> sale.getTimestamp().toLocalDate(),
                    Collectors.summingDouble(sale -> sale.getTotalAmount() != null ? sale.getTotalAmount().doubleValue() : 0.0)
                ))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> dayData = new HashMap<>();
                    dayData.put("date", entry.getKey().toString());
                    dayData.put("totalSales", entry.getValue());
                    return dayData;
                })
                .sorted((a, b) -> ((String)a.get("date")).compareTo((String)b.get("date")))
                .collect(Collectors.toList());
    }
    
    // Get total revenue
    public Map<String, Object> getTotalRevenue() {
        List<SaleRecord> allSales = saleRecordRepository.findAll();
        
        double totalRevenue = allSales.stream()
                .mapToDouble(sale -> sale.getTotalAmount() != null ? sale.getTotalAmount().doubleValue() : 0.0)
                .sum();
        
        int totalQuantitySold = allSales.stream()
                .mapToInt(SaleRecord::getQuantitySold)
                .sum();
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("totalQuantitySold", totalQuantitySold);
        result.put("totalSales", allSales.size());
        
        return result;
    }
    
    // Get revenue for a specific time period
    public Map<String, Object> getRevenueForPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        List<SaleRecord> periodSales = saleRecordRepository.findByTimestampBetween(startDate, endDate);
        
        double totalRevenue = periodSales.stream()
                .mapToDouble(sale -> sale.getTotalAmount() != null ? sale.getTotalAmount().doubleValue() : 0.0)
                .sum();
        
        int totalQuantitySold = periodSales.stream()
                .mapToInt(SaleRecord::getQuantitySold)
                .sum();
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("totalQuantitySold", totalQuantitySold);
        result.put("totalSales", periodSales.size());
        result.put("startDate", startDate);
        result.put("endDate", endDate);
        
        return result;
    }
}
