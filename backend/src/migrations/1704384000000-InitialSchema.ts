import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1704384000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE contract_analyses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id VARCHAR(255) NOT NULL UNIQUE,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size_bytes BIGINT NOT NULL,
        extracted_text TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        summary JSONB,
        risk_clauses JSONB,
        error_message TEXT,
        ip_address VARCHAR(45),
        user_email VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP
      );

      CREATE INDEX idx_contract_analyses_job_id ON contract_analyses(job_id);
      CREATE INDEX idx_contract_analyses_status ON contract_analyses(status);
      CREATE INDEX idx_contract_analyses_created_at ON contract_analyses(created_at);
    `);

    await queryRunner.query(`
      CREATE TABLE generated_contracts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id VARCHAR(255) NOT NULL UNIQUE,
        template_type VARCHAR(255) NOT NULL,
        input_data JSONB NOT NULL,
        generated_text TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        error_message TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP
      );

      CREATE INDEX idx_generated_contracts_job_id ON generated_contracts(job_id);
      CREATE INDEX idx_generated_contracts_status ON generated_contracts(status);
    `);

    await queryRunner.query(`
      CREATE TABLE usage_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(50) NOT NULL,
        job_id VARCHAR(255),
        ip_address VARCHAR(45),
        user_email VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE INDEX idx_usage_events_event_type ON usage_events(event_type);
      CREATE INDEX idx_usage_events_created_at ON usage_events(created_at);
      CREATE INDEX idx_usage_events_job_id ON usage_events(job_id);
    `);

    await queryRunner.query(`
      CREATE TABLE audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action VARCHAR(50) NOT NULL,
        resource_type VARCHAR(255),
        resource_id VARCHAR(255),
        ip_address VARCHAR(45),
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE INDEX idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS audit_logs`);
    await queryRunner.query(`DROP TABLE IF EXISTS usage_events`);
    await queryRunner.query(`DROP TABLE IF EXISTS generated_contracts`);
    await queryRunner.query(`DROP TABLE IF EXISTS contract_analyses`);
  }
}
