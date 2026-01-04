import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskClause {
  text: string;
  riskLevel: RiskLevel;
  explanation: string;
  section?: string;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

@Entity('contract_analyses')
export class ContractAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  jobId!: string;

  @Column({ type: 'varchar', length: 255 })
  fileName!: string;

  @Column({ type: 'varchar', length: 50 })
  fileType!: string;

  @Column({ type: 'bigint' })
  fileSizeBytes!: number;

  @Column({ type: 'text', nullable: true })
  extractedText?: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: JobStatus;

  @Column({ type: 'jsonb', nullable: true })
  summary?: string[];

  @Column({ type: 'jsonb', nullable: true })
  riskClauses?: RiskClause[];

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userEmail?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;
}
