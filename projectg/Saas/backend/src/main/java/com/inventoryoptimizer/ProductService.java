package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private SaleRecordRepository saleRecordRepository;
    
    @Autowired
    private LogService logService;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        boolean isNew = product.getId() == null;
        Product savedProduct = productRepository.save(product);
        
        // Log the action
        if (isNew) {
            logService.logProductCreated(savedProduct.getId(), savedProduct.getName(), "system");
        } else {
            logService.logProductUpdated(savedProduct.getId(), savedProduct.getName(), "system");
        }
        
        return savedProduct;
    }

    @Transactional
    public void deleteProduct(Long id) throws DataIntegrityViolationException {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        
        Product product = productOpt.get();
        
        // Check if product has sales records
        List<SaleRecord> salesRecords = saleRecordRepository.findByProductId(id);
        if (!salesRecords.isEmpty()) {
            throw new DataIntegrityViolationException(
                "Cannot delete product '" + product.getName() + "' because it has " + 
                salesRecords.size() + " associated sales records. " +
                "Consider marking it as discontinued instead."
            );
        }
        
        // Log before deletion
        logService.logProductDeleted(id, product.getName(), "system");
        
        productRepository.deleteById(id);
    }
    
    // New method to add stock
    public Product addStock(Long productId, int quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        int oldQuantity = product.getQuantityOnHand();
        product.setQuantityOnHand(oldQuantity + quantity);
        Product savedProduct = productRepository.save(product);
        
        // Log the stock adjustment
        logService.logStockAdjustment(productId, product.getName(), oldQuantity, 
                                    oldQuantity + quantity, "system");
        
        return savedProduct;
    }
    
    // Method to reduce stock (for sales)
    public Product reduceStock(Long productId, int quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        int oldQuantity = product.getQuantityOnHand();
        
        if (oldQuantity < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + oldQuantity + ", Requested: " + quantity);
        }
        
        product.setQuantityOnHand(oldQuantity - quantity);
        Product savedProduct = productRepository.save(product);
        
        // Log the stock adjustment
        logService.logStockAdjustment(productId, product.getName(), oldQuantity, 
                                    oldQuantity - quantity, "system");
        
        return savedProduct;
    }
    
    // Force delete product and all related data
    @Transactional
    public void forceDeleteProduct(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        
        Product product = productOpt.get();
        String productName = product.getName();
        
        // Delete all sales records for this product first
        List<SaleRecord> salesRecords = saleRecordRepository.findByProductId(id);
        if (!salesRecords.isEmpty()) {
            saleRecordRepository.deleteAll(salesRecords);
            logService.createLog("DELETE_SALES", "SaleRecord", null, 
                               "Deleted " + salesRecords.size() + " sales records for product: " + productName, "system");
        }
        
        // Now delete the product
        productRepository.deleteById(id);
        
        // Log the deletion
        logService.logProductDeleted(id, productName, "system");
    }
    
    // Calculate total stock investment
    public Map<String, Object> calculateStockInvestment() {
        List<Product> products = productRepository.findAll();
        List<SaleRecord> allSales = saleRecordRepository.findAll();
        
        Map<String, Object> result = new HashMap<>();
        
        // Calculate current stock investment (cost price * current quantity)
        double currentStockInvestment = products.stream()
            .filter(p -> p.getCostPrice() != null && p.getQuantityOnHand() > 0)
            .mapToDouble(p -> p.getCostPrice().doubleValue() * p.getQuantityOnHand())
            .sum();
        
        // Calculate sold stock investment (cost price * quantity sold)
        double soldStockInvestment = 0.0;
        for (SaleRecord sale : allSales) {
            if (sale.getProduct() != null && sale.getProduct().getCostPrice() != null) {
                soldStockInvestment += sale.getProduct().getCostPrice().doubleValue() * sale.getQuantitySold();
            }
        }
        
        // Total investment = current stock + sold stock
        double totalInvestment = currentStockInvestment + soldStockInvestment;
        
        // Calculate total units (current + sold)
        int currentUnits = products.stream().mapToInt(Product::getQuantityOnHand).sum();
        int soldUnits = allSales.stream().mapToInt(SaleRecord::getQuantitySold).sum();
        int totalUnits = currentUnits + soldUnits;
        
        result.put("currentStockInvestment", currentStockInvestment);
        result.put("soldStockInvestment", soldStockInvestment);
        result.put("totalInvestment", totalInvestment);
        result.put("currentUnits", currentUnits);
        result.put("soldUnits", soldUnits);
        result.put("totalUnits", totalUnits);
        result.put("averageCostPerUnit", totalUnits > 0 ? totalInvestment / totalUnits : 0.0);
        
        return result;
    }
}
