import { Router } from 'express';
import { ContractController } from '../controllers/contractController';
import { QueueService } from '../services/queueService';
import { upload } from '../middleware/upload';
import { uploadLimiter, apiLimiter } from '../middleware/rateLimiter';

export function createRouter(queueService: QueueService): Router {
  const router = Router();
  const contractController = new ContractController(queueService);

  router.post(
    '/v1/contracts/analyze',
    uploadLimiter,
    upload.single('contract'),
    contractController.analyzeContract
  );

  router.get(
    '/v1/contracts/analyze/:jobId',
    apiLimiter,
    contractController.getAnalysisStatus
  );

  router.post(
    '/v1/contracts/generate',
    apiLimiter,
    contractController.generateContract
  );

  router.get(
    '/v1/contracts/generate/:jobId',
    apiLimiter,
    contractController.getGenerationStatus
  );

  router.post(
    '/v1/contracts/:jobId/export',
    apiLimiter,
    contractController.exportToPDF
  );

  router.post(
    '/v1/contracts/:jobId/email',
    apiLimiter,
    contractController.captureEmail
  );

  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return router;
}
