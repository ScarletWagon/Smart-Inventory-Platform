package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SaleRecordController {
    @Autowired
    private SaleRecordService saleRecordService;

    // Record a sale with full details
    @PostMapping
    public ResponseEntity<SaleRecord> recordSale(@RequestBody Map<String, Object> saleData) {
        try {
            Long productId = Long.valueOf(saleData.get("productId").toString());
            int quantitySold = Integer.parseInt(saleData.get("quantitySold").toString());
            
            BigDecimal unitPrice = null;
            if (saleData.get("unitPrice") != null) {
                unitPrice = new BigDecimal(saleData.get("unitPrice").toString());
            }
            
            String customerName = (String) saleData.get("customerName");
            String notes = (String) saleData.get("notes");
            
            SaleRecord sale = saleRecordService.recordSale(productId, quantitySold, unitPrice, customerName, notes);
            return ResponseEntity.ok(sale);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Quick sale endpoint (backward compatibility)
    @PostMapping("/quick")
    public ResponseEntity<SaleRecord> recordQuickSale(@RequestParam Long productId, @RequestParam int quantitySold) {
        try {
            SaleRecord sale = saleRecordService.recordSale(productId, quantitySold);
            return ResponseEntity.ok(sale);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get all sales
    @GetMapping
    public ResponseEntity<List<SaleRecord>> getAllSales() {
        List<SaleRecord> sales = saleRecordService.getAllSales();
        return ResponseEntity.ok(sales);
    }
    
    // Get recent sales
    @GetMapping("/recent")
    public ResponseEntity<List<SaleRecord>> getRecentSales() {
        List<SaleRecord> recentSales = saleRecordService.getRecentSales();
        return ResponseEntity.ok(recentSales);
    }
    
    // Get sales for a specific product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SaleRecord>> getSalesForProduct(@PathVariable Long productId) {
        List<SaleRecord> sales = saleRecordService.getSalesForProduct(productId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/history/daily-trend")
    public ResponseEntity<List<Map<String, Object>>> getDailyTrend(@RequestParam(defaultValue = "30") int days) {
        try {
            List<Map<String, Object>> dailyTrend = saleRecordService.getDailyTrend(days);
            return ResponseEntity.ok(dailyTrend);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Get total revenue
    @GetMapping("/revenue/total")
    public ResponseEntity<Map<String, Object>> getTotalRevenue() {
        Map<String, Object> revenue = saleRecordService.getTotalRevenue();
        return ResponseEntity.ok(revenue);
    }
    
    // Get revenue for a specific period
    @GetMapping("/revenue/period")
    public ResponseEntity<Map<String, Object>> getRevenueForPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, Object> revenue = saleRecordService.getRevenueForPeriod(startDate, endDate);
        return ResponseEntity.ok(revenue);
    }
}
