"use client";

/**
 * Client-side error handlers and utilities
 */

/**
 * Safely parse a response as JSON, handling HTML error pages
 */
export async function safeJsonParse(response: Response): Promise<any> {
  const responseText = await response.text();
  
  // Check if the response looks like HTML
  if (responseText.trim().startsWith('<!DOCTYPE') || 
      responseText.trim().startsWith('<html')) {
    console.error('Received HTML instead of JSON:', responseText.substring(0, 100) + '...');
    throw new Error('Server returned HTML instead of JSON. The API might be experiencing issues.');
  }
  
  try {
    // Parse JSON manually after checking
    return JSON.parse(responseText);
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError);
    throw new Error(`Failed to parse response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
  }
}

/**
 * Enhanced fetch utility with retry logic and better error handling
 */
export async function enhancedFetch(url: string, options?: RequestInit) {
  // Create controller for better error handling with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.warn('Request timed out after 15 seconds');
  }, 15000);
  
  // Add retry mechanism for resilience
  let retries = 0;
  let response;
  
  try {
    while (retries < 3) {
      try {
        response = await fetch(url, {
          ...options,
          // Disable caching completely
          cache: 'no-store',
          next: { revalidate: 0 },
          // Use our abort controller
          signal: controller.signal,
          // Set headers to explicitly request JSON
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Requested-With': 'XMLHttpRequest',
            ...(options?.headers || {})
          }
        });
        
        if (response.ok) break;
        
        // If we get a 5xx error, retry
        if (response.status >= 500) {
          retries++;
          await new Promise(r => setTimeout(r, 1000 * retries));
          console.log(`Retrying request (${retries}/3)...`);
          continue;
        }
        
        // For non-5xx errors, don't retry
        break;
      } catch (fetchError) {
        if (retries >= 2) throw fetchError;
        retries++;
        await new Promise(r => setTimeout(r, 1000 * retries));
        console.log(`Retrying after fetch error (${retries}/3)...`, fetchError);
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
  
  if (!response || !response.ok) {
    throw new Error(`Failed to fetch: ${response?.status || 'Unknown'} ${response?.statusText || 'Unknown Error'}`);
  }
  
  return response;
}
