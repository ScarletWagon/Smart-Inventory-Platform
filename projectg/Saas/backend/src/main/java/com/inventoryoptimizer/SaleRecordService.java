package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleRecordService {
    @Autowired
    private SaleRecordRepository saleRecordRepository;
    @Autowired
    private ProductRepository productRepository;

    public SaleRecord recordSale(Long productId, int quantitySold) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (product.getQuantityOnHand() < quantitySold) {
            throw new RuntimeException("Not enough stock");
        }
        product.setQuantityOnHand(product.getQuantityOnHand() - quantitySold);
        productRepository.save(product);

        SaleRecord sale = new SaleRecord();
        sale.setProduct(product);
        sale.setQuantitySold(quantitySold);
        sale.setTimestamp(LocalDateTime.now());
        return saleRecordRepository.save(sale);
    }

    public List<SaleRecord> getSalesForProduct(Long productId) {
        return saleRecordRepository.findAll().stream()
                .filter(s -> s.getProduct().getId().equals(productId))
                .toList();
    }
}
