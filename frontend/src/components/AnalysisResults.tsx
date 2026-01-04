'use client';

import { AnalysisResult, RiskLevel } from '@/types';
import { AlertTriangle, CheckCircle, Info, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onExport: () => void;
  isExporting?: boolean;
}

export default function AnalysisResults({ result, onExport, isExporting }: AnalysisResultsProps) {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low':
        return 'text-green-700 bg-green-100 border-green-300';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Info className="w-5 h-5" />;
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <button
            onClick={onExport}
            disabled={isExporting}
            className={cn(
              'flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors',
              isExporting && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Summary</h3>
          <ul className="space-y-2">
            {result.summary?.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary-600 font-bold mt-1">•</span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Analysis</h3>
          
          {!result.riskClauses || result.riskClauses.length === 0 ? (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">No significant risks identified in this contract.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {result.riskClauses.map((clause, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 border rounded-lg',
                    getRiskColor(clause.riskLevel)
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getRiskIcon(clause.riskLevel)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold uppercase text-sm">
                          {clause.riskLevel} Risk
                        </span>
                        {clause.section && (
                          <span className="text-sm opacity-75">• {clause.section}</span>
                        )}
                      </div>
                      <p className="text-sm mb-2 italic">&ldquo;{clause.text}&rdquo;</p>
                      <p className="text-sm font-medium">{clause.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
