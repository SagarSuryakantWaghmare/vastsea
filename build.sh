#!/bin/bash

# Windows-friendly build script for Next.js to handle EPERM issues

# Function to safely remove directories with retries
safe_remove() {
  local dir=$1
  local max_attempts=5
  local attempt=1
  
  echo "Trying to remove directory: $dir"
  
  while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt of $max_attempts..."
    
    # Try to remove the directory
    if [ -d "$dir" ]; then
      rm -rf "$dir" 2>/dev/null || true
      
      # Check if directory was successfully removed
      if [ ! -d "$dir" ]; then
        echo "Successfully removed $dir"
        return 0
      fi
      
      echo "Failed to remove $dir, waiting before retry..."
      # Add a delay between attempts (Windows might need time to release file handles)
      sleep 2
    else
      echo "$dir does not exist, nothing to remove."
      return 0
    fi
    
    attempt=$((attempt + 1))
  done
  
  echo "WARNING: Failed to remove $dir after $max_attempts attempts."
  echo "Please try manually removing the directory or restarting your terminal."
  return 1
}

# Disable Next.js telemetry to avoid file access issues
export NEXT_TELEMETRY_DISABLED=1

# Set environment variables to prevent trace file creation
export NEXT_BUILD_TRACE_DISABLE=true
export NODE_OPTIONS="--no-warnings"

# Clean build directories first
echo "Cleaning previous build artifacts..."
safe_remove "./.next"
safe_remove "./build"

# Create a clean production build
echo "Starting Next.js production build..."
npx next build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Production build completed successfully!"
else
  echo "❌ Build failed. Check the errors above."
fi
