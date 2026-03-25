$ErrorActionPreference = "Stop"

Set-Location -Path $PSScriptRoot

function Test-Command {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

if (-not (Test-Command "node") -or -not (Test-Command "npm")) {
  Write-Host "Node.js/npm not found. Install Node.js LTS first: https://nodejs.org" -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}

if (-not (Test-Path -Path (Join-Path $PSScriptRoot "node_modules"))) {
  Write-Host "Installing dependencies..." -ForegroundColor Cyan
  npm install
}

Write-Host "Starting backend server..." -ForegroundColor Cyan
$server = Start-Process -FilePath "powershell" -ArgumentList @("-NoExit", "-Command", "Set-Location -Path '$PSScriptRoot'; npm run backend") -PassThru

$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  Start-Sleep -Milliseconds 500
  try {
    Invoke-WebRequest -Uri "http://localhost:8787/api/health" -UseBasicParsing | Out-Null
    $ready = $true
    break
  } catch {
  }
}

if ($ready) {
  Write-Host "Opening app at http://localhost:8787" -ForegroundColor Green
  Start-Process "http://localhost:8787"
  Write-Host "Backend is running in a separate terminal window." -ForegroundColor Green
  Write-Host "Close that backend terminal when you are done." -ForegroundColor Yellow
} else {
  Write-Host "Backend did not become ready on http://localhost:8787" -ForegroundColor Red
  Write-Host "Check the backend terminal window for errors." -ForegroundColor Yellow
}
