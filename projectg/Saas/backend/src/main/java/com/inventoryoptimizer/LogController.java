package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class LogController {
    
    @Autowired
    private LogService logService;
    
    // Get all logs with pagination
    @GetMapping
    public ResponseEntity<Page<LogEntry>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<LogEntry> logs = logService.getAllLogs(page, size);
        return ResponseEntity.ok(logs);
    }
    
    // Get logs by action type
    @GetMapping("/action/{action}")
    public ResponseEntity<List<LogEntry>> getLogsByAction(@PathVariable String action) {
        List<LogEntry> logs = logService.getLogsByAction(action.toUpperCase());
        return ResponseEntity.ok(logs);
    }
    
    // Get logs by entity type
    @GetMapping("/entity/{entityType}")
    public ResponseEntity<List<LogEntry>> getLogsByEntityType(@PathVariable String entityType) {
        List<LogEntry> logs = logService.getLogsByEntityType(entityType.toUpperCase());
        return ResponseEntity.ok(logs);
    }
    
    // Get logs for a specific entity
    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<LogEntry>> getLogsForEntity(
            @PathVariable String entityType, 
            @PathVariable Long entityId) {
        List<LogEntry> logs = logService.getLogsForEntity(entityType.toUpperCase(), entityId);
        return ResponseEntity.ok(logs);
    }
    
    // Get logs by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<LogEntry>> getLogsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);
        List<LogEntry> logs = logService.getLogsByDateRange(start, end);
        return ResponseEntity.ok(logs);
    }
    
    // Get logs by user
    @GetMapping("/user/{userName}")
    public ResponseEntity<List<LogEntry>> getLogsByUser(@PathVariable String userName) {
        List<LogEntry> logs = logService.getLogsByUser(userName);
        return ResponseEntity.ok(logs);
    }
}
