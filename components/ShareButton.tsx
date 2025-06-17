'use client';

import { useState, ReactNode } from 'react';

export default function ShareButton({
  link,
  label = 'Share',
  icon,
  className = '',
}: {
  link: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button onClick={handleShare} className={`flex items-center gap-1 ${className}`}>
      {copied ? 'Copied!' : (
        <>
          {label}
          {icon}
        </>
      )}
    </button>
  );
}
