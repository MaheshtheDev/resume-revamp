'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import mammoth from 'mammoth';

interface DocumentUploaderProps {
  onContentExtracted: (content: string) => void;
}

export function DocumentUploader({
  onContentExtracted,
}: DocumentUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractDocxContent = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (
      file.type !==
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setError('Please upload a DOCX file');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const content = await extractDocxContent(file);
      onContentExtracted(content);
    } catch (err) {
      console.error('Document extraction error:', err);
      setError('Failed to extract content from DOCX file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label
        htmlFor="file-upload"
        className={`
          flex flex-col items-center justify-center w-full h-32
          border-2 border-dashed rounded-lg
          cursor-pointer
          transition-colors
          ${isProcessing ? 'bg-gray-100 border-gray-300' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            {isProcessing
              ? 'Processing...'
              : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">DOCX files only</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </label>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
