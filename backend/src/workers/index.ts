import { config } from '../config';
import { logger } from '../config/logger';
import { QueueService } from '../services/queueService';
import { processAnalysisJob } from './analysisWorker';
import { processGenerationJob } from './generationWorker';

export function startWorkers(queueService: QueueService): void {
  const analysisQueue = queueService.getAnalysisQueue();
  const generationQueue = queueService.getGenerationQueue();

  analysisQueue.process(config.queue.workerConcurrency, processAnalysisJob);
  generationQueue.process(config.queue.workerConcurrency, processGenerationJob);

  logger.info('Workers started', { concurrency: config.queue.workerConcurrency });
}
