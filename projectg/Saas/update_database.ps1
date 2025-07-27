# PowerShell script to add discontinued column to PostgreSQL
# Run this script to update your database schema

Write-Host "Adding discontinued column to PostgreSQL database..." -ForegroundColor Green

# Set PostgreSQL connection details
$env:PGPASSWORD = "wagon12"

try {
    # Add the discontinued column
    $sql = @"
ALTER TABLE product ADD COLUMN IF NOT EXISTS discontinued BOOLEAN DEFAULT FALSE;
UPDATE product SET discontinued = FALSE WHERE discontinued IS NULL;
"@

    Write-Host "Executing SQL commands..." -ForegroundColor Yellow
    
    # Try to use psql if available in PATH
    if (Get-Command psql -ErrorAction SilentlyContinue) {
        echo $sql | psql -h localhost -U postgres -d inventory_db
        Write-Host "Database updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "psql not found in PATH. Please run the following SQL manually in your PostgreSQL client:" -ForegroundColor Red
        Write-Host ""
        Write-Host $sql -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Or install PostgreSQL command line tools and add them to your PATH." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the following SQL manually in your PostgreSQL client:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host $sql -ForegroundColor Cyan
} finally {
    # Clear password from environment
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "After running the SQL, restart your Spring Boot backend to test the new features!" -ForegroundColor Green
