# Run AFTER: gh auth login
# Creates public repo sairamesh445/AP-SCHOOL-V1 and pushes main branch

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Checking GitHub login..."
gh auth status
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Not logged in. Run this first:" -ForegroundColor Yellow
  Write-Host "  gh auth login" -ForegroundColor Cyan
  Write-Host "Choose: GitHub.com -> HTTPS -> Login with browser"
  exit 1
}

$repo = "sairamesh445/AP-SCHOOL-V1"
Write-Host "Creating repo (if missing) and pushing to $repo ..."

gh repo view $repo 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create $repo --public --source=. --remote=origin --push
} else {
  git push -u origin main
}

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Done! Open: https://github.com/$repo" -ForegroundColor Green
}
