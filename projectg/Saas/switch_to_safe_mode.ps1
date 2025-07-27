# Switch back to safe database mode
Write-Host "🛡️  Switching to SAFE database mode..." -ForegroundColor Green

$propsFile = "backend/src/main/resources/application.properties"

if (Test-Path $propsFile) {
    $content = Get-Content $propsFile -Raw
    $newContent = $content -replace "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.hibernate.ddl-auto=update"
    Set-Content $propsFile $newContent
    
    Write-Host "✅ Changed to safe mode: spring.jpa.hibernate.ddl-auto=update" -ForegroundColor Green
    Write-Host "🔄 Please restart your backend for changes to take effect" -ForegroundColor Yellow
} else {
    Write-Host "❌ Could not find application.properties file" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Current setting: update (SAFE - preserves data on restart)" -ForegroundColor Cyan
