'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Zap, Lock, CheckCircle } from 'lucide-react';
import ContractUpload from '@/components/ContractUpload';
import LegalDisclaimer from '@/components/LegalDisclaimer';
import { ApiClient } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await ApiClient.uploadContract(file);
      router.push(`/analysis/${response.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload contract');
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Shield className="w-20 h-20 text-primary-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Protect Your Freelance Business
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Get instant AI-powered analysis of your contracts. Identify risky clauses before you sign.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <Zap className="w-10 h-10 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Instant Analysis</h3>
            <p className="text-sm text-gray-600">
              Get results in under 10 seconds with AI-powered contract review
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <Lock className="w-10 h-10 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Risk Identification</h3>
            <p className="text-sm text-gray-600">
              Spot unfair payment terms, IP issues, and liability clauses
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <CheckCircle className="w-10 h-10 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Plain English</h3>
            <p className="text-sm text-gray-600">
              Understand complex legal language with simple explanations
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Upload Your Contract
        </h2>
        <ContractUpload onUpload={handleUpload} isUploading={isUploading} error={error} />
      </section>

      <section id="how-it-works" className="mb-12 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How It Works
        </h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Upload Your Contract</h3>
              <p className="text-gray-600">
                Drag and drop or select your PDF, DOCX, or TXT file
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI reads through the contract and identifies risky clauses
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Review Results</h3>
              <p className="text-gray-600">
                Get a summary, risk-flagged clauses, and plain-English explanations
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Export & Share</h3>
              <p className="text-gray-600">
                Download a PDF report to discuss with clients or your lawyer
              </p>
            </div>
          </div>
        </div>
      </section>

      <LegalDisclaimer />
    </div>
  );
}
