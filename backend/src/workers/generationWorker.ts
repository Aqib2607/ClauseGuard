import { Job } from 'bull';
import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { GeneratedContract } from '../models/GeneratedContract';
import { GenerationJobData } from '../services/queueService';
import { LLMService } from '../services/llmService';

const llmService = new LLMService();

export async function processGenerationJob(job: Job<GenerationJobData>): Promise<void> {
  const { jobId, templateType, inputData } = job.data;

  logger.info('Processing generation job', { jobId, templateType });

  const repository = AppDataSource.getRepository(GeneratedContract);

  try {
    await repository.update({ jobId }, { status: 'processing' });

    const generatedText = await llmService.generateContract(inputData);

    await repository.update(
      { jobId },
      {
        status: 'completed',
        generatedText,
        completedAt: new Date(),
      }
    );

    logger.info('Generation job completed successfully', { jobId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Generation job failed', { jobId, error: errorMessage });

    await repository.update(
      { jobId },
      {
        status: 'failed',
        errorMessage,
      }
    );

    throw error;
  }
}
