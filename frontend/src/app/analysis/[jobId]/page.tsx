'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api';
import { downloadBlob } from '@/lib/utils';
import AnalysisResults from '@/components/AnalysisResults';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import EmailCapture from '@/components/EmailCapture';
import LegalDisclaimer from '@/components/LegalDisclaimer';

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.jobId as string;

  const [isExporting, setIsExporting] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['analysis', jobId],
    queryFn: () => ApiClient.getAnalysisStatus(jobId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      if (data.status === 'pending' || data.status === 'processing') {
        return 2000;
      }
      return false;
    },
    enabled: !!jobId,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await ApiClient.exportToPDF(jobId);
      downloadBlob(blob, `contract-analysis-${jobId}.pdf`);
    } catch (err) {
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    setIsSubmittingEmail(true);
    try {
      await ApiClient.captureEmail(jobId, email);
    } catch (err) {
      alert('Failed to submit email. Please try again.');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleRetry = () => {
    router.push('/');
  };

  if (!jobId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorDisplay message="Invalid job ID" onRetry={handleRetry} />
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Loading analysis..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorDisplay
          message={error instanceof Error ? error.message : 'Failed to load analysis'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (data?.status === 'pending' || data?.status === 'processing') {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Analyzing your contract..." />
      </div>
    );
  }

  if (data?.status === 'failed') {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorDisplay
          message={data.errorMessage || 'Analysis failed. Please try again.'}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (data?.status === 'completed') {
    return (
      <div className="container mx-auto px-4 py-12">
        <AnalysisResults
          result={data}
          onExport={handleExport}
          isExporting={isExporting}
        />

        <div className="mt-8">
          <EmailCapture onSubmit={handleEmailSubmit} isSubmitting={isSubmittingEmail} />
        </div>

        <LegalDisclaimer />

        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Analyze Another Contract
          </button>
        </div>
      </div>
    );
  }

  return null;
}
