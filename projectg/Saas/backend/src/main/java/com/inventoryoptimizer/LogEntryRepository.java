package com.inventoryoptimizer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogEntryRepository extends JpaRepository<LogEntry, Long> {
    
    // Find logs by action type
    List<LogEntry> findByActionOrderByTimestampDesc(String action);
    
    // Find logs by entity type
    List<LogEntry> findByEntityTypeOrderByTimestampDesc(String entityType);
    
    // Find logs for a specific entity
    List<LogEntry> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Long entityId);
    
    // Find logs within date range
    @Query("SELECT l FROM LogEntry l WHERE l.timestamp BETWEEN :startDate AND :endDate ORDER BY l.timestamp DESC")
    List<LogEntry> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find recent logs with pagination
    Page<LogEntry> findAllByOrderByTimestampDesc(Pageable pageable);
    
    // Find logs by user
    List<LogEntry> findByUserNameOrderByTimestampDesc(String userName);
}
