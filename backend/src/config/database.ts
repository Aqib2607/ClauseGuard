import { DataSource } from 'typeorm';
import { config } from './index';
import { ContractAnalysis } from '../models/ContractAnalysis';
import { GeneratedContract } from '../models/GeneratedContract';
import { UsageEvent } from '../models/UsageEvent';
import { AuditLog } from '../models/AuditLog';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url,
  synchronize: false,
  logging: config.app.nodeEnv === 'development',
  entities: [ContractAnalysis, GeneratedContract, UsageEvent, AuditLog],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});

export const initDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};
