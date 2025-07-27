package com.inventoryoptimizer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SaleRecordRepository extends JpaRepository<SaleRecord, Long> {
    
    // Find sales records by product ID
    @Query("SELECT s FROM SaleRecord s WHERE s.product.id = :productId")
    List<SaleRecord> findByProductId(@Param("productId") Long productId);
    
    // Find sales records by product
    List<SaleRecord> findByProduct(Product product);
    
    // Find sales records within date range
    List<SaleRecord> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find recent sales records
    List<SaleRecord> findTop10ByOrderByTimestampDesc();
    
    // Calculate total revenue for a product
    @Query("SELECT COALESCE(SUM(s.totalAmount), 0) FROM SaleRecord s WHERE s.product.id = :productId")
    Double getTotalRevenueByProductId(@Param("productId") Long productId);
    
    // Calculate total sales quantity for a product
    @Query("SELECT COALESCE(SUM(s.quantitySold), 0) FROM SaleRecord s WHERE s.product.id = :productId")
    Integer getTotalQuantitySoldByProductId(@Param("productId") Long productId);
}
