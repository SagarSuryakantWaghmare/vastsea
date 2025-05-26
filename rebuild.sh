#!/bin/bash

# Clear any cached build files
echo "Cleaning build cache..."
rm -rf .next

# Install dependencies if needed
echo "Checking dependencies..."
npm install

# Set environment variables for production build
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
echo "Building application..."
npm run build

echo "Done! Ready for deployment."
