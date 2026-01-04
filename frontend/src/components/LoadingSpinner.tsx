'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Analyzing your contract...' }: LoadingSpinnerProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
          <p className="text-sm text-gray-600">
            This usually takes 5-10 seconds
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
}
