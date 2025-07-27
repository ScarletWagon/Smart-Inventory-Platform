package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogService {
    
    @Autowired
    private LogEntryRepository logEntryRepository;
    
    // Create a new log entry
    public LogEntry createLog(String action, String entityType, Long entityId, String description, String userName) {
        LogEntry logEntry = new LogEntry(action, entityType, entityId, description, userName);
        return logEntryRepository.save(logEntry);
    }
    
    // Get all logs with pagination
    public Page<LogEntry> getAllLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return logEntryRepository.findAllByOrderByTimestampDesc(pageable);
    }
    
    // Get logs by action type
    public List<LogEntry> getLogsByAction(String action) {
        return logEntryRepository.findByActionOrderByTimestampDesc(action);
    }
    
    // Get logs by entity type
    public List<LogEntry> getLogsByEntityType(String entityType) {
        return logEntryRepository.findByEntityTypeOrderByTimestampDesc(entityType);
    }
    
    // Get logs for a specific entity
    public List<LogEntry> getLogsForEntity(String entityType, Long entityId) {
        return logEntryRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId);
    }
    
    // Get logs within date range
    public List<LogEntry> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return logEntryRepository.findByDateRange(startDate, endDate);
    }
    
    // Get logs by user
    public List<LogEntry> getLogsByUser(String userName) {
        return logEntryRepository.findByUserNameOrderByTimestampDesc(userName);
    }
    
    // Convenience methods for common actions
    public void logProductCreated(Long productId, String productName, String userName) {
        createLog("CREATE", "PRODUCT", productId, "Created product: " + productName, userName);
    }
    
    public void logProductUpdated(Long productId, String productName, String userName) {
        createLog("UPDATE", "PRODUCT", productId, "Updated product: " + productName, userName);
    }
    
    public void logProductDeleted(Long productId, String productName, String userName) {
        createLog("DELETE", "PRODUCT", productId, "Deleted product: " + productName, userName);
    }
    
    public void logStockAdjustment(Long productId, String productName, int oldQuantity, int newQuantity, String userName) {
        createLog("STOCK_ADJUSTMENT", "PRODUCT", productId, 
                String.format("Stock adjusted for %s: %d → %d", productName, oldQuantity, newQuantity), userName);
    }
    
    public void logSale(Long saleId, Long productId, String productName, int quantity, String userName) {
        createLog("SALE", "SALE_RECORD", saleId, 
                String.format("Sale recorded: %d units of %s", quantity, productName), userName);
    }
}
