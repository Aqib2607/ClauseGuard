import { Job } from 'bull';
import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { ContractAnalysis } from '../models/ContractAnalysis';
import { AnalysisJobData } from '../services/queueService';
import { LLMService } from '../services/llmService';
import { FileExtractor } from '../utils/fileExtractor';

const llmService = new LLMService();

export async function processAnalysisJob(job: Job<AnalysisJobData>): Promise<void> {
  const { jobId, filePath, fileName, fileType } = job.data;

  logger.info('Processing analysis job', { jobId, fileName });

  const repository = AppDataSource.getRepository(ContractAnalysis);

  try {
    await repository.update({ jobId }, { status: 'processing' });

    const extractedText = await FileExtractor.extractText(filePath, fileType);

    if (!extractedText || extractedText.trim().length < 50) {
      throw new Error('Insufficient text extracted from file');
    }

    await repository.update({ jobId }, { extractedText });

    const analysisResult = await llmService.analyzeContract(extractedText);

    await repository.update(
      { jobId },
      {
        status: 'completed',
        summary: analysisResult.summary,
        riskClauses: analysisResult.riskClauses as any,
        completedAt: new Date(),
      }
    );

    logger.info('Analysis job completed successfully', { jobId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Analysis job failed', { jobId, error: errorMessage });

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
