@echo off
setlocal

REM WD Computer - Dev Runner (CMD wrapper)
REM This script invokes the PowerShell dev script (run-dev.ps1)
REM so you can start the app by double-clicking run-dev.cmd on Windows.

REM Determine script directory
set "SCRIPT_DIR=%~dp0"

REM Check PowerShell availability
where powershell >nul 2>&1
if errorlevel 1 (
  echo ERROR: PowerShell not found in PATH.
  echo This script requires Windows PowerShell or PowerShell 7.
  pause
  exit /b 1
)

echo Starting WD Computer dev environment via PowerShell...
echo.

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%run-dev.ps1"

echo.
echo WD Computer dev environment script has finished.
pause

endlocal