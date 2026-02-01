import React from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
// import ReactMarkdown from 'react-markdown'; 

interface ResourceViewerProps {
  title: string;
  type: 'article' | 'tool' | 'template' | 'external';
  content?: string | React.ReactNode;
  onClose: () => void;
  externalUrl?: string;
}

export default function ResourceViewer({ title, type, content, onClose, externalUrl }: ResourceViewerProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof content === 'string') {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-[#13141f] w-full max-w-4xl h-[85vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            {externalUrl && (
              <a 
                href={externalUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                title="Open Original Source"
              >
                <ExternalLink size={20} />
              </a>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          
          {type === 'tool' && (
            <div className="max-w-2xl mx-auto">
              {content}
            </div>
          )}

          {type === 'template' && (
            <div className="relative">
              <div className="absolute top-0 right-0">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs font-medium transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Template'}
                </button>
              </div>
              <div className="bg-black/30 p-6 rounded-xl border border-white/10 font-mono text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            </div>
          )}

          {type === 'article' && (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-white/80 leading-relaxed space-y-4">
                {typeof content === 'string' ? content : content}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
