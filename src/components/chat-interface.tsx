import { useState, useRef, useEffect } from 'react';
import {
  FilePenLineIcon,
  Loader2,
  Send,
  UserIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string, jobUrl: string) => void;
  messages?: Message[];
  isProcessing?: boolean;
}

export function ChatInterface({
  onSendMessage,
  messages: externalMessages,
  isProcessing = false,
}: ChatInterfaceProps) {
  const [localMessages, setLocalMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'What changes would you like to make to your resume?',
    },
  ]);
  const [input, setInput] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayMessages = externalMessages || localMessages;

  const handleSendMessage = () => {
    if (!input.trim() || isProcessing) return;

    if (!externalMessages) {
      const userMessage: Message = { role: 'user', content: input };
      setLocalMessages((prev) => [...prev, userMessage]);
    }

    onSendMessage(input, jobUrl);

    setInput('');

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  return (
    <div className="flex flex-col h-full border overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {displayMessages.map((message, index) => (
          <div key={index} className="flex items-start gap-2">
            {message.role == 'assistant' ? (
              <FilePenLineIcon className="size-4 mt-1" />
            ) : (
              <UserIcon className="size-4 mt-1" />
            )}
            <div className={`max-w-[85%] sm:max-w-[90%] font-normal text-sm leading-6`}>
              {message.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating resume...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 sm:p-3 mt-auto border-t space-y-2 sm:space-y-3">
        <div className="relative flex items-center">
          <div className="flex items-center w-full gap-2 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2">
            <LinkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <Input
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="Job URL (optional)"
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm"
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="relative flex items-center">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow up..."
            className="min-h-[60px] sm:min-h-[80px] max-h-[120px] pr-12 resize-none py-2.5 rounded-md text-sm"
            disabled={isProcessing}
          />

          <div className="absolute right-3 flex items-center">
            {isProcessing ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 sm:w-8 sm:h-8 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
                onClick={handleSendMessage}
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
