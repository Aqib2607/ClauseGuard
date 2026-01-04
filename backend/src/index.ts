import express from 'express';
import cors from 'cors';
import { config } from './config';
import { initDatabase } from './config/database';
import { logger } from './config/logger';
import { QueueService } from './services/queueService';
import { createRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { startWorkers } from './workers';
import { FileCleanup } from './utils/fileCleanup';

async function bootstrap() {
  try {
    await initDatabase();

    const queueService = new QueueService();
    startWorkers(queueService);

    const app = express();

    app.use(cors({
      origin: config.cors.origin,
      credentials: true,
    }));

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    app.use(requestLogger);

    app.use('/api', createRouter(queueService));

    app.use(errorHandler);

    FileCleanup.startCleanupSchedule();

    app.listen(config.app.port, () => {
      logger.info(`🚀 ClauseGuard API running on port ${config.app.port}`);
      logger.info(`📝 Environment: ${config.app.nodeEnv}`);
      logger.info(`🔗 Frontend URL: ${config.app.frontendUrl}`);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await queueService.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await queueService.close();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

bootstrap();
