import Bull, { Queue, Job } from 'bull';
import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../config/logger';

export interface AnalysisJobData {
  jobId: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  ipAddress?: string;
}

export interface GenerationJobData {
  jobId: string;
  templateType: string;
  inputData: Record<string, any>;
  ipAddress?: string;
}

export class QueueService {
  private analysisQueue: Queue<AnalysisJobData>;
  private generationQueue: Queue<GenerationJobData>;
  private redisClient: Redis;

  constructor() {
    const redisOptions = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };

    this.redisClient = new Redis(redisOptions);

    this.analysisQueue = new Bull<AnalysisJobData>('contract-analysis', {
      redis: redisOptions,
      defaultJobOptions: {
        attempts: config.queue.maxRetries,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        timeout: config.queue.jobTimeoutMs,
        removeOnComplete: false,
        removeOnFail: false,
      },
    });

    this.generationQueue = new Bull<GenerationJobData>('contract-generation', {
      redis: redisOptions,
      defaultJobOptions: {
        attempts: config.queue.maxRetries,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        timeout: config.queue.jobTimeoutMs,
        removeOnComplete: false,
        removeOnFail: false,
      },
    });

    this.setupEventListeners();
  }

  async addAnalysisJob(data: AnalysisJobData): Promise<Job<AnalysisJobData>> {
    logger.info('Adding analysis job to queue', { jobId: data.jobId });
    return await this.analysisQueue.add(data, {
      jobId: data.jobId,
    });
  }

  async addGenerationJob(data: GenerationJobData): Promise<Job<GenerationJobData>> {
    logger.info('Adding generation job to queue', { jobId: data.jobId });
    return await this.generationQueue.add(data, {
      jobId: data.jobId,
    });
  }

  async getAnalysisJob(jobId: string): Promise<Job<AnalysisJobData> | null> {
    return await this.analysisQueue.getJob(jobId);
  }

  async getGenerationJob(jobId: string): Promise<Job<GenerationJobData> | null> {
    return await this.generationQueue.getJob(jobId);
  }

  getAnalysisQueue(): Queue<AnalysisJobData> {
    return this.analysisQueue;
  }

  getGenerationQueue(): Queue<GenerationJobData> {
    return this.generationQueue;
  }

  private setupEventListeners(): void {
    this.analysisQueue.on('completed', (job) => {
      logger.info('Analysis job completed', { jobId: job.id });
    });

    this.analysisQueue.on('failed', (job, err) => {
      logger.error('Analysis job failed', { jobId: job?.id, error: err.message });
    });

    this.generationQueue.on('completed', (job) => {
      logger.info('Generation job completed', { jobId: job.id });
    });

    this.generationQueue.on('failed', (job, err) => {
      logger.error('Generation job failed', { jobId: job?.id, error: err.message });
    });
  }

  async close(): Promise<void> {
    await this.analysisQueue.close();
    await this.generationQueue.close();
    await this.redisClient.quit();
  }
}
