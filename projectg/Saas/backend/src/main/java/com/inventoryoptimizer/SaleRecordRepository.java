package com.inventoryoptimizer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRecordRepository extends JpaRepository<SaleRecord, Long> {
    // Additional query methods if needed
}
