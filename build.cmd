@echo off
setlocal EnableDelayedExpansion

echo Windows-friendly build script for Next.js

:: Set environment variables to prevent telemetry and trace issues
set NEXT_TELEMETRY_DISABLED=1
set NEXT_BUILD_TRACE_DISABLE=true
set NODE_OPTIONS=--no-warnings

:: Function to safely remove directories
call :CleanDir .\.next
call :CleanDir .\build

:: Run the Next.js build
echo Starting Next.js production build...
npx next build

if %ERRORLEVEL% EQU 0 (
  echo ✅ Production build completed successfully!
) else (
  echo ❌ Build failed. Check the errors above.
)

goto :EOF

:CleanDir
echo Cleaning directory: %~1
if exist "%~1" (
  echo Directory exists, removing...
  rmdir /s /q "%~1" 2>NUL
  if exist "%~1" (
    echo ⚠️ Failed to remove %~1. Directory might be in use.
    echo Trying alternative cleanup...
    :: Alternative approach - sometimes this works better on Windows
    rd /s /q "%~1" 2>NUL
  )
) else (
  echo Directory %~1 does not exist, nothing to clean.
)
goto :EOF
