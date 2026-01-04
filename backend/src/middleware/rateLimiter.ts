import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too Many Requests',
    message: `You have exceeded the ${config.rateLimit.maxRequests} requests in ${config.rateLimit.windowMs / 1000} seconds limit. Please try again later.`,
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: Math.max(3, Math.floor(config.rateLimit.maxRequests / 2)),
  message: {
    error: 'Too Many Requests',
    message: 'Too many upload attempts. Please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
