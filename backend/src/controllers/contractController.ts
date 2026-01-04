import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { AppDataSource } from '../config/database';
import { ContractAnalysis } from '../models/ContractAnalysis';
import { GeneratedContract } from '../models/GeneratedContract';
import { UsageEvent } from '../models/UsageEvent';
import { QueueService } from '../services/queueService';
import { PDFService } from '../services/pdfService';
import { FileValidator } from '../utils/fileValidator';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../config/logger';

export class ContractController {
  constructor(private queueService: QueueService) {}

  analyzeContract = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    FileValidator.validateFile(req.file);

    const isClean = await FileValidator.mockVirusScan(req.file.path);
    if (!isClean) {
      throw new AppError('File failed security scan', 400);
    }

    const jobId = path.basename(path.dirname(req.file.path));
    const ipAddress = req.ip || req.connection.remoteAddress;

    const repository = AppDataSource.getRepository(ContractAnalysis);
    const analysis = repository.create({
      jobId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSizeBytes: req.file.size,
      status: 'pending',
      ipAddress,
    });

    await repository.save(analysis);

    await this.queueService.addAnalysisJob({
      jobId,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSizeBytes: req.file.size,
      ipAddress,
    });

    const eventRepo = AppDataSource.getRepository(UsageEvent);
    await eventRepo.save({
      eventType: 'contract_upload',
      jobId,
      ipAddress,
      metadata: { fileName: req.file.originalname, fileSize: req.file.size },
    });

    logger.info('Contract analysis job created', { jobId, fileName: req.file.originalname });

    res.status(202).json({
      jobId,
      status: 'pending',
      message: 'Contract uploaded successfully and is being analyzed',
    });
  });

  getAnalysisStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.params;

    const repository = AppDataSource.getRepository(ContractAnalysis);
    const analysis = await repository.findOne({ where: { jobId } });

    if (!analysis) {
      throw new AppError('Job not found', 404);
    }

    const response: any = {
      jobId: analysis.jobId,
      status: analysis.status,
      fileName: analysis.fileName,
    };

    if (analysis.status === 'completed') {
      response.summary = analysis.summary;
      response.riskClauses = analysis.riskClauses;
      response.completedAt = analysis.completedAt;
    } else if (analysis.status === 'failed') {
      response.errorMessage = analysis.errorMessage;
    }

    res.json(response);
  });

  generateContract = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { templateType, ...inputData } = req.body;

    if (!templateType) {
      throw new AppError('Template type is required', 400);
    }

    const jobId = uuidv4();
    const ipAddress = req.ip || req.connection.remoteAddress;

    const repository = AppDataSource.getRepository(GeneratedContract);
    const contract = repository.create({
      jobId,
      templateType,
      inputData,
      status: 'pending',
      ipAddress,
    });

    await repository.save(contract);

    await this.queueService.addGenerationJob({
      jobId,
      templateType,
      inputData,
      ipAddress,
    });

    const eventRepo = AppDataSource.getRepository(UsageEvent);
    await eventRepo.save({
      eventType: 'contract_generation',
      jobId,
      ipAddress,
      metadata: { templateType },
    });

    logger.info('Contract generation job created', { jobId, templateType });

    res.status(202).json({
      jobId,
      status: 'pending',
      message: 'Contract generation started',
    });
  });

  getGenerationStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.params;

    const repository = AppDataSource.getRepository(GeneratedContract);
    const contract = await repository.findOne({ where: { jobId } });

    if (!contract) {
      throw new AppError('Job not found', 404);
    }

    const response: any = {
      jobId: contract.jobId,
      status: contract.status,
      templateType: contract.templateType,
    };

    if (contract.status === 'completed') {
      response.generatedText = contract.generatedText;
      response.completedAt = contract.completedAt;
    } else if (contract.status === 'failed') {
      response.errorMessage = contract.errorMessage;
    }

    res.json(response);
  });

  exportToPDF = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.params;

    const repository = AppDataSource.getRepository(ContractAnalysis);
    const analysis = await repository.findOne({ where: { jobId } });

    if (!analysis) {
      throw new AppError('Job not found', 404);
    }

    if (analysis.status !== 'completed') {
      throw new AppError('Analysis not completed yet', 400);
    }

    if (!analysis.summary || !analysis.riskClauses) {
      throw new AppError('Analysis results not available', 400);
    }

    const pdfBuffer = await PDFService.generateAnalysisReport(
      analysis.fileName,
      analysis.summary,
      analysis.riskClauses
    );

    const eventRepo = AppDataSource.getRepository(UsageEvent);
    await eventRepo.save({
      eventType: 'pdf_export',
      jobId,
      ipAddress: req.ip,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="analysis-${jobId}.pdf"`);
    res.send(pdfBuffer);
  });

  captureEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.params;
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError('Valid email is required', 400);
    }

    const repository = AppDataSource.getRepository(ContractAnalysis);
    const analysis = await repository.findOne({ where: { jobId } });

    if (!analysis) {
      throw new AppError('Job not found', 404);
    }

    await repository.update({ jobId }, { userEmail: email });

    const eventRepo = AppDataSource.getRepository(UsageEvent);
    await eventRepo.save({
      eventType: 'email_capture',
      jobId,
      userEmail: email,
      ipAddress: req.ip,
    });

    logger.info('Email captured', { jobId, email });

    res.json({ message: 'Email captured successfully' });
  });
}
