export type RiskLevel = 'low' | 'medium' | 'high';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface RiskClause {
  text: string;
  riskLevel: RiskLevel;
  explanation: string;
  section?: string;
}

export interface AnalysisResult {
  jobId: string;
  status: JobStatus;
  fileName?: string;
  summary?: string[];
  riskClauses?: RiskClause[];
  errorMessage?: string;
  completedAt?: string;
}

export interface UploadResponse {
  jobId: string;
  status: string;
  message: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
