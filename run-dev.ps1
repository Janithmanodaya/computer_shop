# WD Computer - Dev Runner (PowerShell)
# Runs backend (NestJS) and frontend (Next.js) locally.
# - Automatically checks Node/npm
# - Automatically installs dependencies (backend + frontend) if missing
# - Starts backend in a separate window and frontend in this window

# Always run from the directory of this script
Set-Location -LiteralPath $PSScriptRoot

Write-Host "=== WD Computer Dev Runner ===" -ForegroundColor Cyan
Write-Host ""

# 1) Check Node.js and npm
Write-Host "Checking Node.js and npm..."
$nodeVersion = node -v 2>$null
$npmVersion = npm -v 2>$null

if (-not $nodeVersion) {
  Write-Host "ERROR: Node.js not found in PATH. Install from https://nodejs.org" -ForegroundColor Red
  Read-Host "Press Enter to close"
  exit 1
}
if (-not $npmVersion) {
  Write-Host "ERROR: npm not found in PATH. Reinstall Node.js from https://nodejs.org" -ForegroundColor Red
  Read-Host "Press Enter to close"
  exit 1
}

Write-Host "Node: $nodeVersion"
Write-Host "npm: $npmVersion"

# 2) Warn about very new Node versions (native builds can be slow on Windows)
try {
  $major = [int]($nodeVersion.TrimStart('v').Split('.')[0])
  if ($major -ge 22) {
    Write-Warning "Detected Node $nodeVersion. For best compatibility, Node 20.x LTS is recommended."
    Write-Host ""
  }
} catch { }

# 3) Prepare environment for backend (Prisma)
if (-not (Test-Path "backend/.env")) {
  if (Test-Path "backend/.env.example") {
    Write-Host "backend/.env not found. Copying from .env.example..."
    Copy-Item "backend/.env.example" "backend/.env"
  } else {
    Write-Warning "backend/.env not found and no .env.example present. Please create backend/.env manually."
  }
}

# 4) Install backend dependencies if missing
Write-Host ""
Write-Host "Checking backend dependencies..."
Set-Location -LiteralPath "$PSScriptRoot\backend"

if (-not (Test-Path "node_modules")) {
  Write-Host "backend/node_modules not found. Installing backend dependencies..."
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install (backend) failed (exit code $LASTEXITCODE)" -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit $LASTEXITCODE
  }
} else {
  Write-Host "Backend dependencies already installed."
}

# 5) Generate Prisma client and run migrations (if Prisma is present)
if (Test-Path ".\prisma\schema.prisma") {
  Write-Host ""
  Write-Host "Generating Prisma client..."
  npx prisma generate
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Prisma generate failed (exit code $LASTEXITCODE). Check your DATABASE_URL in backend/.env."
  }

  Write-Host "Running Prisma migrations (dev)..."
  npx prisma migrate dev --name init  # safe to re-run; Prisma will handle applied migrations
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Prisma migrate dev failed (exit code $LASTEXITCODE). The backend may not start correctly until this is fixed."
  }
}

# 6) Start backend server in a separate window
Write-Host ""
Write-Host "Starting backend server at http://localhost:4000 ..."
# Use cmd.exe to reliably start npm on Windows even if file associations are customized
$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run start:dev" -WorkingDirectory "$PSScriptRoot\backend" -WindowStyle Normal -PassThru

if (-not $backendProcess) {
  Write-Warning "Failed to start backend process."
}

# 7) Prepare frontend
Write-Host ""
Write-Host "Checking frontend dependencies..."
Set-Location -LiteralPath "$PSScriptRoot\frontend"

if (-not (Test-Path "node_modules")) {
  Write-Host "frontend/node_modules not found. Installing frontend dependencies..."
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install (frontend) failed (exit code $LASTEXITCODE)" -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit $LASTEXITCODE
  }
} else {
  Write-Host "Frontend dependencies already installed."
}

Write-Host ""
Write-Host "Starting Next.js dev server at http://localhost:3000 ..."
Write-Host "Press Ctrl+C in this window to stop the frontend server."
Write-Host ""

# 8) Run frontend dev server via npx (avoids relying on a global or broken local 'next' binary)
npx next dev
Write-Host ""
Write-Host "Frontend dev server exited with code: $LASTEXITCODE"
Write-Host "Backend window (if still open) can be closed separately."
Read-Host "Press Enter to close"