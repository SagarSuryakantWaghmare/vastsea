#!/bin/bash

# Clean build script for Next.js projects
echo "Cleaning up previous build artifacts..."

# Delete the .next directory if it exists
if [ -d "./.next" ]; then
  rm -rf ./.next
  echo "Deleted .next directory"
fi

# Delete the build directory if it exists
if [ -d "./build" ]; then
  rm -rf ./build
  echo "Deleted build directory"
fi

# Run the build process
echo "Starting fresh build process..."
next build

if [ $? -eq 0 ]; then
  echo "Build completed successfully!"
else
  echo "Build failed. Check the errors above."
fi
