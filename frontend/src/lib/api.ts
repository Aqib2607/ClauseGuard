import axios, { AxiosError } from 'axios';
import { AnalysisResult, UploadResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiClient {
  static async uploadContract(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('contract', file);

    try {
      const response = await apiClient.post<UploadResponse>(
        '/v1/contracts/analyze',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getAnalysisStatus(jobId: string): Promise<AnalysisResult> {
    try {
      const response = await apiClient.get<AnalysisResult>(
        `/v1/contracts/analyze/${jobId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async exportToPDF(jobId: string): Promise<Blob> {
    try {
      const response = await apiClient.post(
        `/v1/contracts/${jobId}/export`,
        {},
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async captureEmail(jobId: string, email: string): Promise<void> {
    try {
      await apiClient.post(`/v1/contracts/${jobId}/email`, { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response?.data?.message) {
        return new Error(axiosError.response.data.message);
      }
      if (axiosError.message) {
        return new Error(axiosError.message);
      }
    }
    return new Error('An unexpected error occurred');
  }
}
