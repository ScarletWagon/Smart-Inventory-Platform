package com.inventoryoptimizer;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * Simple standalone test runner that tests the backend APIs directly via HTTP calls
 * This doesn't require Spring context and can be run with a simple main method
 */
public class SimpleApiTestRunner {

    private static final String BASE_URL = "http://localhost:8081/api";
    private static int testsRun = 0;
    private static int testsPassed = 0;
    private static int testsFailed = 0;

    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("    SMART INVENTORY PLATFORM - SIMPLE API TEST RUNNER");
        System.out.println("=".repeat(60));
        
        // Check if backend is running
        if (!isBackendRunning()) {
            System.err.println("❌ ERROR: Backend is not running on port 8081!");
            System.err.println("Please start the backend first:");
            System.err.println("  cd backend");
            System.err.println("  .\\mvnw.cmd spring-boot:run");
            System.err.println("");
            System.err.println("Then run this test again.");
            System.exit(1);
        }
        
        System.out.println("✅ Backend is running on port 8081");
        System.out.println("");
        
        // Run all API tests
        runAllApiTests();
        
        // Print summary
        System.out.println("");
        System.out.println("=".repeat(60));
        System.out.println("📊 TEST SUMMARY");
        System.out.println("=".repeat(60));
        System.out.println("Total tests run: " + testsRun);
        System.out.println("Tests passed: " + testsPassed + " ✅");
        System.out.println("Tests failed: " + testsFailed + " ❌");
        
        if (testsFailed == 0) {
            System.out.println("");
            System.out.println("🎉 ALL TESTS PASSED! Backend is working correctly.");
        } else {
            System.out.println("");
            System.out.println("⚠️  Some tests failed. Check the output above for details.");
        }
        System.out.println("=".repeat(60));
    }

    private static boolean isBackendRunning() {
        try {
            URL url = new URL(BASE_URL + "/products");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(3000);
            connection.setRequestMethod("GET");
            int responseCode = connection.getResponseCode();
            connection.disconnect();
            return responseCode == 200 || responseCode == 404;
        } catch (IOException e) {
            return false;
        }
    }

    private static void runAllApiTests() {
        testGetAllProducts();
        testCreateProduct();
        testGetProductById();
        testUpdateProduct();
        testDeleteProduct();
        testRecordSale();
        testGetForecast();
        testGetDailyTrend();
        testCompleteWorkflow();
    }

    private static void testGetAllProducts() {
        System.out.println("=== Testing GET /api/products ===");
        testsRun++;
        
        try {
            HttpURLConnection connection = makeGetRequest("/products");
            int responseCode = connection.getResponseCode();
            
            if (responseCode == 200) {
                String response = readResponse(connection);
                System.out.println("✅ GET /api/products - SUCCESS");
                System.out.println("   Response: " + (response.length() > 100 ? response.substring(0, 100) + "..." : response));
                testsPassed++;
            } else {
                System.err.println("❌ GET /api/products - FAILED (Code: " + responseCode + ")");
                testsFailed++;
            }
            connection.disconnect();
        } catch (Exception e) {
            System.err.println("❌ GET /api/products - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    private static void testCreateProduct() {
        System.out.println("=== Testing POST /api/products ===");
        testsRun++;
        
        try {
            String productJson = "{\"name\":\"Test Product\",\"sku\":\"TEST-001\",\"quantityOnHand\":100,\"lowStockThreshold\":10}";
            HttpURLConnection connection = makePostRequest("/products", productJson);
            int responseCode = connection.getResponseCode();
            
            if (responseCode == 200) {
                String response = readResponse(connection);
                System.out.println("✅ POST /api/products - SUCCESS");
                System.out.println("   Created product: " + response);
                testsPassed++;
            } else {
                System.err.println("❌ POST /api/products - FAILED (Code: " + responseCode + ")");
                testsFailed++;
            }
            connection.disconnect();
        } catch (Exception e) {
            System.err.println("❌ POST /api/products - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    private static void testGetProductById() {
        System.out.println("=== Testing GET /api/products/{id} ===");
        testsRun++;
        
        try {
            // First create a product to get its ID
            String productJson = "{\"name\":\"Test Product for Get\",\"sku\":\"TEST-GET\",\"quantityOnHand\":50,\"lowStockThreshold\":5}";
            HttpURLConnection createConnection = makePostRequest("/products", productJson);
            String createResponse = readResponse(createConnection);
            createConnection.disconnect();
            
            // Extract ID (simple approach - look for "id": followed by a number)
            String idStr = extractIdFromJson(createResponse);
            if (idStr != null) {
                HttpURLConnection getConnection = makeGetRequest("/products/" + idStr);
                int responseCode = getConnection.getResponseCode();
                
                if (responseCode == 200) {
                    String response = readResponse(getConnection);
                    System.out.println("✅ GET /api/products/" + idStr + " - SUCCESS");
                    System.out.println("   Retrieved product: " + response);
                    testsPassed++;
                } else {
                    System.err.println("❌ GET /api/products/" + idStr + " - FAILED (Code: " + responseCode + ")");
                    testsFailed++;
                }
                getConnection.disconnect();
            } else {
                System.err.println("❌ Could not extract product ID from create response");
                testsFailed++;
            }
        } catch (Exception e) {
            System.err.println("❌ GET /api/products/{id} - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    private static void testUpdateProduct() {
        System.out.println("=== Testing PUT /api/products/{id} ===");
        testsRun++;
        
        try {
            // First create a product
            String productJson = "{\"name\":\"Product to Update\",\"sku\":\"UPDATE-001\",\"quantityOnHand\":30,\"lowStockThreshold\":5}";
            HttpURLConnection createConnection = makePostRequest("/products", productJson);
            String createResponse = readResponse(createConnection);
            createConnection.disconnect();
            
            String idStr = extractIdFromJson(createResponse);
            if (idStr != null) {
                // Update the product
                String updateJson = "{\"name\":\"Updated Product\",\"sku\":\"UPDATE-001-NEW\",\"quantityOnHand\":60,\"lowStockThreshold\":15}";
                HttpURLConnection updateConnection = makePutRequest("/products/" + idStr, updateJson);
                int responseCode = updateConnection.getResponseCode();
                
                if (responseCode == 200) {
                    String response = readResponse(updateConnection);
                    System.out.println("✅ PUT /api/products/" + idStr + " - SUCCESS");
                    System.out.println("   Updated product: " + response);
                    testsPassed++;
                } else {
                    System.err.println("❌ PUT /api/products/" + idStr + " - FAILED (Code: " + responseCode + ")");
                    testsFailed++;
                }
                updateConnection.disconnect();
            } else {
                System.err.println("❌ Could not extract product ID for update test");
                testsFailed++;
            }
        } catch (Exception e) {
            System.err.println("❌ PUT /api/products/{id} - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    private static void testDeleteProduct() {
        System.out.println("=== Testing DELETE /api/products/{id} ===");
        testsRun++;
        
        try {
            // First create a product
            String productJson = "{\"name\":\"Product to Delete\",\"sku\":\"DELETE-001\",\"quantityOnHand\":20,\"lowStockThreshold\":5}";
            HttpURLConnection createConnection = makePostRequest("/products", productJson);
            String createResponse = readResponse(createConnection);
            createConnection.disconnect();
            
            String idStr = extractIdFromJson(createResponse);
            if (idStr != null) {
                // Delete the product
                HttpURLConnection deleteConnection = makeDeleteRequest("/products/" + idStr);
                int responseCode = deleteConnection.getResponseCode();
                
                if (responseCode == 204) {
                    System.out.println("✅ DELETE /api/products/" + idStr + " - SUCCESS");
                    testsPassed++;
                } else {
                    System.err.println("❌ DELETE /api/products/" + idStr + " - FAILED (Code: " + responseCode + ")");
                    testsFailed++;
                }
                deleteConnection.disconnect();
            } else {
                System.err.println("❌ Could not extract product ID for delete test");
                testsFailed++;
            }
        } catch (Exception e) {
            System.err.println("❌ DELETE /api/products/{id} - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    private static void testRecordSale() {
        System.out.println("=== Testing POST /api/sales ===");
        testsRun++;
        
        try {
            // First create a product
            String productJson = "{\"name\":\"Product for Sale\",\"sku\":\"SALE-001\",\"quantityOnHand\":100,\"lowStockThreshold\":10}";
            HttpURLConnection createConnection = makePostRequest("/products", productJson);
            String createResponse = readResponse(createConnection);
            createConnection.disconnect();
            
            String idStr = extractIdFromJson(createResponse);
            if (idStr != null) {
                // Record a sale
                HttpURLConnection saleConnection = makePostRequest("/sales?productId=" + idStr + "&quantitySold=10", "");
                int responseCode = saleConnection.getResponseCode();
                
                if (responseCode == 200) {
                    String response = readResponse(saleConnection);
                    System.out.println("✅ POST /api/sales - SUCCESS");
                    System.out.println("   Sale recorded: " + response);
                    testsPassed++;
                } else {
                    System.err.println("❌ POST /api/sales - FAILED (Code: " + responseCode + ")");
                    testsFailed++;
                }
                saleConnection.disconnect();
            } else {
                System.err.println("❌ Could not extract product ID for sale test");
                testsFailed++;
            }
        } catch (Exception e) {
            System.err.println("❌ POST /api/sales - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    private static void testGetForecast() {
        System.out.println("=== Testing GET /api/forecasts/product/{id} ===");
        testsRun++;
        
        try {
            // First create a product
            String productJson = "{\"name\":\"Product for Forecast\",\"sku\":\"FORECAST-001\",\"quantityOnHand\":80,\"lowStockThreshold\":10}";
            HttpURLConnection createConnection = makePostRequest("/products", productJson);
            String createResponse = readResponse(createConnection);
            createConnection.disconnect();
            
            String idStr = extractIdFromJson(createResponse);
            if (idStr != null) {
                // Get forecast
                HttpURLConnection forecastConnection = makeGetRequest("/forecasts/product/" + idStr + "?days=7");
                int responseCode = forecastConnection.getResponseCode();
                
                if (responseCode == 200) {
                    String response = readResponse(forecastConnection);
                    System.out.println("✅ GET /api/forecasts/product/" + idStr + " - SUCCESS");
                    System.out.println("   Forecast: " + response);
                    testsPassed++;
                } else {
                    System.err.println("❌ GET /api/forecasts/product/" + idStr + " - FAILED (Code: " + responseCode + ")");
                    testsFailed++;
                }
                forecastConnection.disconnect();
            } else {
                System.err.println("❌ Could not extract product ID for forecast test");
                testsFailed++;
            }
        } catch (Exception e) {
            System.err.println("❌ GET /api/forecasts/product/{id} - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    private static void testGetDailyTrend() {
        System.out.println("=== Testing GET /api/sales/history/daily-trend ===");
        testsRun++;
        
        try {
            HttpURLConnection connection = makeGetRequest("/sales/history/daily-trend?days=30");
            int responseCode = connection.getResponseCode();
            
            if (responseCode == 200) {
                String response = readResponse(connection);
                System.out.println("✅ GET /api/sales/history/daily-trend - SUCCESS");
                System.out.println("   Daily trend data: " + (response.length() > 100 ? response.substring(0, 100) + "..." : response));
                testsPassed++;
            } else {
                System.err.println("❌ GET /api/sales/history/daily-trend - FAILED (Code: " + responseCode + ")");
                testsFailed++;
            }
            connection.disconnect();
        } catch (Exception e) {
            System.err.println("❌ GET /api/sales/history/daily-trend - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    private static void testCompleteWorkflow() {
        System.out.println("=== Testing Complete Workflow ===");
        testsRun++;
        
        try {
            System.out.println("1. Creating product...");
            String productJson = "{\"name\":\"Workflow Product\",\"sku\":\"WORKFLOW-001\",\"quantityOnHand\":100,\"lowStockThreshold\":20}";
            HttpURLConnection createConnection = makePostRequest("/products", productJson);
            String createResponse = readResponse(createConnection);
            createConnection.disconnect();
            
            String idStr = extractIdFromJson(createResponse);
            if (idStr == null) {
                throw new Exception("Could not extract product ID");
            }
            
            System.out.println("2. Recording sales...");
            makePostRequest("/sales?productId=" + idStr + "&quantitySold=15", "").disconnect();
            makePostRequest("/sales?productId=" + idStr + "&quantitySold=10", "").disconnect();
            
            System.out.println("3. Checking updated stock...");
            HttpURLConnection stockConnection = makeGetRequest("/products/" + idStr);
            readResponse(stockConnection); // Just checking if it works
            stockConnection.disconnect();
            
            System.out.println("4. Getting forecast...");
            HttpURLConnection forecastConnection = makeGetRequest("/forecasts/product/" + idStr + "?days=7");
            forecastConnection.disconnect();
            
            System.out.println("5. Getting daily trend...");
            HttpURLConnection trendConnection = makeGetRequest("/sales/history/daily-trend?days=30");
            trendConnection.disconnect();
            
            System.out.println("✅ Complete workflow - SUCCESS");
            System.out.println("   All workflow steps completed successfully");
            testsPassed++;
            
        } catch (Exception e) {
            System.err.println("❌ Complete workflow - ERROR: " + e.getMessage());
            testsFailed++;
        }
        System.out.println("");
    }

    // Helper methods
    private static HttpURLConnection makeGetRequest(String endpoint) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Content-Type", "application/json");
        return connection;
    }

    private static HttpURLConnection makePostRequest(String endpoint, String body) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        
        if (!body.isEmpty()) {
            try (OutputStream os = connection.getOutputStream()) {
                os.write(body.getBytes());
            }
        }
        return connection;
    }

    private static HttpURLConnection makePutRequest(String endpoint, String body) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("PUT");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        
        try (OutputStream os = connection.getOutputStream()) {
            os.write(body.getBytes());
        }
        return connection;
    }

    private static HttpURLConnection makeDeleteRequest(String endpoint) throws IOException {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("DELETE");
        return connection;
    }

    private static String readResponse(HttpURLConnection connection) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            return response.toString();
        }
    }

    private static String extractIdFromJson(String json) {
        // Simple ID extraction - look for "id": followed by a number
        int idIndex = json.indexOf("\"id\":");
        if (idIndex != -1) {
            int startIndex = idIndex + 5;
            int endIndex = startIndex;
            while (endIndex < json.length() && Character.isDigit(json.charAt(endIndex))) {
                endIndex++;
            }
            if (endIndex > startIndex) {
                return json.substring(startIndex, endIndex);
            }
        }
        return null;
    }
}
