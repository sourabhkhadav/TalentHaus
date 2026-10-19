interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Checks whether an IP or identifier has exceeded the limit.
 * @param key unique identifier (e.g. client IP + action)
 * @param limit maximum requests allowed in the window
 * @param windowMs window duration in milliseconds (default: 10 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  // Periodic cleanup of expired records (prevent memory leaks)
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) {
        rateLimitMap.delete(k);
      }
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetInMs: Math.max(0, record.resetTime - now) };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetInMs: Math.max(0, record.resetTime - now) };
}
