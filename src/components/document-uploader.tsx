'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Resume } from '@/types';

interface DocumentUploaderProps {
  onContentExtracted: (content: Resume) => void;
}

const SUPPORTED_MIME_TYPES = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCX',
  'application/pdf': 'PDF',
};

const ACCEPT_STRING =
  '.docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function DocumentUploader({
  onContentExtracted,
}: DocumentUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!Object.keys(SUPPORTED_MIME_TYPES).includes(file.type)) {
      setError('Please upload a DOCX or PDF file');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Send file to API
      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse document');
      }

      onContentExtracted(data.result);
    } catch (err) {
      console.error('Document extraction error:', err);
      setError(
        err instanceof Error
          ? err.message
          : `Failed to extract content from ${SUPPORTED_MIME_TYPES[file.type as keyof typeof SUPPORTED_MIME_TYPES]} file`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label
        htmlFor="file-upload"
        className={`
          relative flex flex-col items-center justify-center w-full h-32 sm:h-36
          border-2 border-dashed rounded-lg
          cursor-pointer
          transition-colors
          overflow-hidden
          touch-manipulation
          ${
            isProcessing
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 active:border-gray-500 dark:active:border-gray-500'
          }
        `}
      >
        {isProcessing && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-loading-pulse w-1/2 h-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
          </div>
        )}
        <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10 px-4">
          <Upload
            className={`w-8 h-8 mb-2 ${isProcessing ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            {isProcessing
              ? 'Processing document...'
              : 'Tap to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            DOCX, PDF
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={ACCEPT_STRING}
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
