package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProductController {
    @Autowired
    private ProductService productService;
    
    @Autowired
    private SaleRecordRepository saleRecordRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.getProductById(id)
                .map(existing -> {
                    product.setId(id);
                    return ResponseEntity.ok(productService.saveProduct(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    // Force delete product and all related data
    @DeleteMapping("/{id}/force")
    public ResponseEntity<Map<String, String>> forceDeleteProduct(@PathVariable Long id) {
        try {
            productService.forceDeleteProduct(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product and all related data deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    // Add stock endpoint
    @PostMapping("/{id}/add-stock")
    public ResponseEntity<Product> addStock(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        try {
            Integer quantity = request.get("quantity");
            if (quantity == null || quantity <= 0) {
                return ResponseEntity.badRequest().build();
            }
            Product updatedProduct = productService.addStock(id, quantity);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get product revenue information
    @GetMapping("/{id}/revenue")
    public ResponseEntity<Map<String, Object>> getProductRevenue(@PathVariable Long id) {
        try {
            Double totalRevenue = saleRecordRepository.getTotalRevenueByProductId(id);
            Integer totalQuantitySold = saleRecordRepository.getTotalQuantitySoldByProductId(id);
            
            Map<String, Object> revenue = new HashMap<>();
            revenue.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
            revenue.put("totalQuantitySold", totalQuantitySold != null ? totalQuantitySold : 0);
            
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get product sales history
    @GetMapping("/{id}/sales")
    public ResponseEntity<List<SaleRecord>> getProductSales(@PathVariable Long id) {
        try {
            List<SaleRecord> sales = saleRecordRepository.findByProductId(id);
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Discontinue product
    @PutMapping("/{id}/discontinue")
    public ResponseEntity<Product> discontinueProduct(@PathVariable Long id) {
        try {
            return productService.getProductById(id)
                    .map(product -> {
                        product.setDiscontinued(true);
                        return ResponseEntity.ok(productService.saveProduct(product));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Reactivate product
    @PutMapping("/{id}/reactivate")
    public ResponseEntity<Product> reactivateProduct(@PathVariable Long id) {
        try {
            return productService.getProductById(id)
                    .map(product -> {
                        product.setDiscontinued(false);
                        return ResponseEntity.ok(productService.saveProduct(product));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get total stock investment (cost of all inventory)
    @GetMapping("/stock-investment")
    public ResponseEntity<Map<String, Object>> getStockInvestment() {
        try {
            Map<String, Object> investment = productService.calculateStockInvestment();
            return ResponseEntity.ok(investment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
