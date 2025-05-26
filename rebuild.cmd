@echo off
echo Clearing Next.js cache...
rd /s /q .next 2>nul

echo Checking for package updates...
call npm install

echo Resetting environment...
set NEXT_TELEMETRY_DISABLED=1
set NEXT_BUILD_TRACE_DISABLE=true
set NODE_OPTIONS=--no-warnings --max-old-space-size=4096
set VERCEL_BUILD_STRICT=false

echo Building project...
call npm run build

echo Done! Run 'npm run dev' to start the development server or deploy the build.
