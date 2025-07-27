package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/forecasts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ForecastController {
    @Autowired
    private ForecastService forecastService;

    @GetMapping("/product/{productId}")
    public Map<String, Object> getForecast(@PathVariable Long productId, @RequestParam(defaultValue = "7") int days) {
        return forecastService.forecastLinearRegression(productId, days);
    }
    
    @GetMapping("/revenue")
    public Map<String, Object> getPredictedRevenue(@RequestParam(defaultValue = "30") int days) {
        return forecastService.forecastTotalRevenue(days);
    }
}
