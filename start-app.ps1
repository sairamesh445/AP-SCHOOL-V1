# Start AP Civic Education app (backend + frontend)
$root = $PSScriptRoot

Write-Host "Starting backend on http://localhost:5000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting frontend on http://localhost:3000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host ""
Write-Host "Open in browser: http://localhost:3000" -ForegroundColor Green
Write-Host "Platform admin login: username=admin  password=admin123" -ForegroundColor Yellow
Write-Host "Student UI: Know AP | Admin: Admin Dashboard -> Know AP (Civic Knowledge) tabs" -ForegroundColor Gray
