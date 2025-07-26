package com.inventoryoptimizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forecasts")
public class ForecastController {
    @Autowired
    private ForecastService forecastService;

    @GetMapping("/product/{productId}")
    public double getForecast(@PathVariable Long productId, @RequestParam(defaultValue = "7") int days) {
        return forecastService.forecastLinearRegression(productId, days);
    }
}
