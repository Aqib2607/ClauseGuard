'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContractUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  error?: string | null;
}

export default function ContractUpload({ onUpload, isUploading, error }: ContractUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback((file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOCX, DOC, or TXT file');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    onUpload(file);
  }, [onUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="relative"
      >
        <input
          type="file"
          id="contract-upload"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleChange}
          disabled={isUploading}
          className="hidden"
        />

        <label
          htmlFor="contract-upload"
          className={cn(
            'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all',
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100',
            isUploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">Uploading and analyzing...</span>
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, DOC, or TXT (max 10MB)</p>
              </>
            )}
          </div>
        </label>

        {selectedFile && !isUploading && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-800">{selectedFile.name}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
