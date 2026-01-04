import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('generated_contracts')
export class GeneratedContract {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  jobId!: string;

  @Column({ type: 'varchar', length: 255 })
  templateType!: string;

  @Column({ type: 'jsonb' })
  inputData!: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  generatedText?: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;
}
