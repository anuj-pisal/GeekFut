import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '20', 10);
const WINDOW_MS = 60 * 1000;

// Note: In a serverless/edge environment (like Vercel), this Map will be scoped per isolate.
// For strict global rate limiting, a distributed store like Vercel KV or Upstash Redis is needed.
// This in-memory implementation provides basic abuse protection for v1.
const ipRequests = new Map<string, { count: number; windowStart: number }>();

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/profile/')) {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    
    const now = Date.now();
    const record = ipRequests.get(ip);

    if (!record) {
      ipRequests.set(ip, { count: 1, windowStart: now });
    } else {
      if (now - record.windowStart > WINDOW_MS) {
        // Reset window
        ipRequests.set(ip, { count: 1, windowStart: now });
      } else {
        record.count++;
        if (record.count > RATE_LIMIT_PER_MINUTE) {
          const retryAfterSeconds = Math.ceil((record.windowStart + WINDOW_MS - now) / 1000);
          return NextResponse.json(
            { 
              error: 'rate_limited', 
              message: 'Too many requests. Please try again later.',
              retryAfterSeconds 
            },
            { 
              status: 429,
              headers: {
                'Retry-After': retryAfterSeconds.toString(),
              }
            }
          );
        }
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/profile/:path*',
};
