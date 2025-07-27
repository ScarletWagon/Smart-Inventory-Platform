# Database Reset Script for Smart Inventory Platform
# This script helps you reset your database tables and switch back to safe mode

Write-Host "🔄 Smart Inventory Platform - Database Reset Utility" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Step 1: Confirm reset
Write-Host "⚠️  WARNING: This will DELETE ALL DATA and recreate tables" -ForegroundColor Red
Write-Host "   - All products will be deleted" -ForegroundColor Yellow
Write-Host "   - All sales records will be deleted" -ForegroundColor Yellow
Write-Host "   - All log entries will be deleted" -ForegroundColor Yellow
Write-Host "   - Fresh tables with new features will be created" -ForegroundColor Green
Write-Host ""

$confirm = Read-Host "Are you sure you want to proceed? Type 'YES' to continue"

if ($confirm -ne "YES") {
    Write-Host "❌ Operation cancelled. No changes made." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🚀 Starting database reset process..." -ForegroundColor Green
Write-Host ""

# Step 2: Start backend to reset tables
Write-Host "📋 STEP 1: Start your backend to reset tables" -ForegroundColor Cyan
Write-Host "   Run this command in a new terminal:" -ForegroundColor White
Write-Host "   cd backend; .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Wait for the backend to start completely, then press Enter to continue..."
$null = Read-Host

# Step 3: Switch back to safe mode
Write-Host "🛡️  STEP 2: Switching back to safe mode..." -ForegroundColor Cyan

# Read current application.properties
$propsFile = "backend/src/main/resources/application.properties"
if (Test-Path $propsFile) {
    $content = Get-Content $propsFile -Raw
    $newContent = $content -replace "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.hibernate.ddl-auto=update"
    Set-Content $propsFile $newContent
    Write-Host "   ✅ Changed ddl-auto from 'create-drop' to 'update'" -ForegroundColor Green
} else {
    Write-Host "   ❌ Could not find application.properties file" -ForegroundColor Red
    Write-Host "   📝 Please manually change:" -ForegroundColor Yellow
    Write-Host "      spring.jpa.hibernate.ddl-auto=create-drop" -ForegroundColor White
    Write-Host "   📝 To:" -ForegroundColor Yellow
    Write-Host "      spring.jpa.hibernate.ddl-auto=update" -ForegroundColor White
}

Write-Host ""
Write-Host "🔄 STEP 3: Restart your backend" -ForegroundColor Cyan
Write-Host "   Stop the current backend (Ctrl+C) and restart it"
Write-Host "   This ensures it uses the safe 'update' mode going forward"
Write-Host ""

Write-Host "✅ Database reset complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 What was created:" -ForegroundColor Cyan
Write-Host "   ✅ Fresh 'product' table with 'discontinued' column" -ForegroundColor Green
Write-Host "   ✅ Fresh 'sale_record' table with all pricing fields" -ForegroundColor Green
Write-Host "   ✅ Fresh 'log_entry' table for audit trail" -ForegroundColor Green
Write-Host "   ✅ All foreign key relationships properly set up" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Your system is now ready with all new features!" -ForegroundColor Green
Write-Host "   - Product discontinuation system" -ForegroundColor White
Write-Host "   - Force delete capabilities" -ForegroundColor White
Write-Host "   - Enhanced dashboard charts" -ForegroundColor White
Write-Host "   - Settings dialog" -ForegroundColor White
Write-Host ""
Write-Host "📖 Next: Add some test products and try the new features!" -ForegroundColor Cyan
