// components/CopyButton.tsx
'use client';

import { useState } from 'react';
import { copyFromElementId } from '@/utils/copyToClipboard';

interface CopyButtonProps {
  targetId: string;           // Element ID to copy from
  label?: string;             // Button label
  successLabel?: string;      // Label after copying
  className?: string;
}

export default function CopyButton({ 
  targetId,
  label = 'Copy',
  successLabel = 'Copied!',
  className = '' 
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyFromElementId(targetId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 rounded transition-colors ${className} ${
        copied 
          ? 'bg-green-500 text-white' 
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {copied ? successLabel : label}
    </button>
  );
}
