'use client';

import { useState } from 'react';
import { DocumentUploader } from '@/components/document-uploader';
import { ResumePreview } from '@/components/resume-preview';
import { ChatInterface } from '@/components/chat-interface';
import { Resume } from '@/types';

export default function Home() {
  const [extractedContent, setExtractedContent] = useState<Resume>();
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContentExtracted = (content: Resume) => {
    console.log(content);
    setExtractedContent(content);
  };

  const handleSendMessage = async (message: string, jobUrl: string) => {
    if (!extractedContent) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    // Set processing state
    setIsProcessing(true);

    try {
      // Call the revamp API
      const response = await fetch('/api/revamp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: extractedContent,
          message: message,
          jobUrl: jobUrl || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to revamp resume');
      }

      const data = await response.json();

      // Update the resume with the revamped version
      setExtractedContent(data.result);

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error('Error revamping resume:', error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an error while trying to update your resume. Please try again.',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 w-full">
      {!extractedContent ? (
        <div className="flex items-center justify-center dark:bg-gray-800 rounded-lg dark:border-gray-700 flex-col min-h-[80vh] w-full">
          <div className="text-center max-w-md mx-auto">
            <p className="text-xl font-semibold my-4">
              Upload your resume to craft your Next Job Resume
            </p>
            <DocumentUploader onContentExtracted={handleContentExtracted} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 ">
          <div className="lg:col-span-1">
            <ChatInterface
              onSendMessage={handleSendMessage}
              messages={messages}
              isProcessing={isProcessing}
            />
          </div>

          <div className="lg:col-span-2 max-h-svh">
            <ResumePreview resume={extractedContent} />
          </div>
        </div>
      )}
    </main>
  );
}
