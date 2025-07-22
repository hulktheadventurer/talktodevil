'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DonateModal from './DonateModal';

export default function CandleFooter() {
  const [count, setCount] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/candle/total')
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(null));
  }, []);

  return (
    <footer className="z-10 relative bg-red-950 text-center text-sm text-red-100 py-6">
      <div className="space-x-4 flex justify-center items-center flex-wrap gap-4">
        <Link href="/terms" className="underline">Terms & Privacy</Link>
        <Link href="/disclaimer" className="underline">Disclaimer</Link>
        <button
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-sm"
          onClick={() => setIsOpen(true)}
        >
          ❤️ Offer Flames
        </button>
        <DonateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>

      {count !== null && (
        <p className="mt-2 text-xs text-red-300 italic flex items-center justify-center gap-2">
          <span className="animate-flicker text-red-400 drop-shadow-candle hover:animate-pulse transition">
            🔥
          </span>
          {count.toLocaleString()} flames offered so far
        </p>
      )}

      <p className="mt-1 italic text-red-200">From your digital Devil, with temptation.</p>
    </footer>
  );
}
