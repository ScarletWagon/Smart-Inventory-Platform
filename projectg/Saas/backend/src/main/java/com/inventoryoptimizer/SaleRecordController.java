package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
