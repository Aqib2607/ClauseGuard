export interface AnalysisResult {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary?: string[];
  riskClauses?: RiskClause[];
  errorMessage?: string;
  completedAt?: Date;
}

export interface RiskClause {
  text: string;
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
  section?: string;
}

export interface GenerationResult {
  jobId: string;
  status: string;
  generatedText?: string;
  errorMessage?: string;
  completedAt?: Date;
}

export interface LLMResponse {
  summary: string[];
  riskClauses: RiskClause[];
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
