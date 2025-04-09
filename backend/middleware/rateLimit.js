// Very basic in-memory rate limiter (for testing or light traffic)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

const ipRequestMap = new Map();

export default function rateLimit(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const now = Date.now();
  const entry = ipRequestMap.get(ip) || { count: 0, start: now };

  if (now - entry.start > RATE_LIMIT_WINDOW) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }

  ipRequestMap.set(ip, entry);

  if (entry.count > MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests. Please slow down.' });
    return false;
  }

  return true;
}
