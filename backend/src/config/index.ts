import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://clauseguard:clauseguard@localhost:5432/clauseguard',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  llm: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  },
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    retentionHours: parseInt(process.env.FILE_RETENTION_HOURS || '1', 10),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },
  queue: {
    maxRetries: parseInt(process.env.QUEUE_MAX_RETRIES || '3', 10),
    jobTimeoutMs: parseInt(process.env.JOB_TIMEOUT_MS || '30000', 10),
    workerConcurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
};
