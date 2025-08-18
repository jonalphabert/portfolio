import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  request: NextRequest,
  limit: number = 5, // max requests
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { success: boolean; remaining: number; resetTime: number } {
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
    request.headers.get('x-real-ip') || 
    'unknown';
  const now = Date.now();
  
  // Clean up expired entries
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });

  if (!store[ip]) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs
    };
    return { success: true, remaining: limit - 1, resetTime: store[ip].resetTime };
  }

  if (store[ip].resetTime < now) {
    // Reset window
    store[ip] = {
      count: 1,
      resetTime: now + windowMs
    };
    return { success: true, remaining: limit - 1, resetTime: store[ip].resetTime };
  }

  if (store[ip].count >= limit) {
    return { success: false, remaining: 0, resetTime: store[ip].resetTime };
  }

  store[ip].count++;
  return { 
    success: true, 
    remaining: limit - store[ip].count, 
    resetTime: store[ip].resetTime 
  };
}