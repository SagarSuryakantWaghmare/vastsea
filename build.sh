#!/bin/bash

# Clean previous build directories
echo "Cleaning previous build directories..."
rm -rf ./build

# Running Next.js build with standalone output
echo "Starting Next.js build..."
npx next build

echo "Build process completed."
