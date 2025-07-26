package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
public class SaleRecordController {
    @Autowired
    private SaleRecordService saleRecordService;

    @PostMapping
    public ResponseEntity<SaleRecord> recordSale(@RequestParam Long productId, @RequestParam int quantitySold) {
        try {
            SaleRecord sale = saleRecordService.recordSale(productId, quantitySold);
            return ResponseEntity.ok(sale);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
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
}
