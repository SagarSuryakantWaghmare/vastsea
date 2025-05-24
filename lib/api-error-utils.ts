import { NextResponse } from 'next/server';

/**
 * Global error handler for API routes (server-side)
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  // Format the error message
  let errorMessage = 'An unexpected error occurred';
  let statusCode = 500;
  
  if (error instanceof Error) {
    errorMessage = error.message;
    
    // Handle common MongoDB errors
    if (error.name === 'MongoServerError') {
      if ((error as any).code === 11000) {
        statusCode = 409; // Conflict - duplicate key
        errorMessage = 'Duplicate entry found';
      }
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      statusCode = 400;
    }
    
    // Handle authentication errors
    if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
      statusCode = 401;
    }
    
    // Handle not found errors
    if (error.message.includes('not found')) {
      statusCode = 404;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  // Return a proper JSON response with error details
  return NextResponse.json(
    { 
      error: errorMessage, 
      timestamp: new Date().toISOString() 
    },
    { 
      status: statusCode,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  );
}
