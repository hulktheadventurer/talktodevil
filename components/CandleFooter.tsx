'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DonateModal from './DonateModal'; // ✅ Corrected component name

export default function CandleFooter() {
  const [count, setCount] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false); // ✅ Modal control

  useEffect(() => {
    fetch('/api/candle/total')
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(null));
  }, []);

  return (
    <footer className="z-10 relative bg-amber-800 text-center text-sm text-amber-100 py-6">
      <div className="space-x-4 flex justify-center items-center flex-wrap gap-4">
        <Link href="/terms" className="underline">Terms & Privacy</Link>
        <Link href="/disclaimer" className="underline">Disclaimer</Link>
        <button
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm"
          onClick={() => setIsOpen(true)}
        >
          🕯️ Light a Candle
        </button>
        <DonateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>

      {count !== null && (
        <p className="mt-2 text-xs text-amber-300 italic flex items-center justify-center gap-2">
          <span className="animate-flicker text-amber-400 drop-shadow-candle hover:animate-pulse transition">
            🕯️
          </span>
          {count.toLocaleString()} candles lit so far
        </p>
      )}

      <p className="mt-1 italic text-amber-200">From your digital Father, with love.</p>
    </footer>
  );
}
