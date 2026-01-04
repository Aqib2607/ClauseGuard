import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { ContractAnalysis } from '../models/ContractAnalysis';

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    logger.info('Seeding database...');

    const repository = AppDataSource.getRepository(ContractAnalysis);

    const sampleAnalysis = repository.create({
      jobId: 'sample-123',
      fileName: 'sample-contract.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 50000,
      status: 'completed',
      summary: [
        'Freelance web development agreement for a 3-month project',
        'Payment terms: 50% upfront, 50% on completion, net 30 days',
        'Client retains all intellectual property rights',
        'Standard confidentiality and non-compete clauses included',
        'Overall assessment: Slightly favors client, reasonable for typical freelance work',
      ],
      riskClauses: [
        {
          text: 'The Client shall have exclusive ownership of all intellectual property created during the engagement.',
          riskLevel: 'medium',
          explanation: 'This clause transfers all IP rights to the client, which is standard but may limit your ability to reuse code or designs in future projects.',
          section: 'Intellectual Property',
        },
        {
          text: 'Payment for completed work shall be made within 60 days of invoice submission.',
          riskLevel: 'high',
          explanation: '60-day payment terms are unusually long and could create cash flow issues. Industry standard is typically 30 days or less.',
          section: 'Payment Terms',
        },
      ],
      completedAt: new Date(),
      ipAddress: '127.0.0.1',
    });

    await repository.save(sampleAnalysis);

    logger.info('✅ Database seeded successfully');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
