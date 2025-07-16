'use client';

import { useEffect, useState } from 'react';
import DonateModal from './DonateModal';

export default function DynamicFooter() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donationCount, setDonationCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/candle/total')
      .then(res => res.json())
      .then(data => setDonationCount(data.totalDonations))
      .catch(() => setDonationCount(null));
  }, []);

  return (
    <footer className="bg-amber-800 text-center text-sm text-amber-100 py-6 z-10 relative">
      <div className="space-x-4 flex justify-center items-center flex-wrap gap-4">
        <a href="/terms" className="underline">Terms & Privacy</a>
        <a href="/disclaimer" className="underline">Disclaimer</a>
        <button
          onClick={() => setIsDonateOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm"
        >
          ❤️ Donate Candles
        </button>
      </div>

<p className="mt-2 text-xs text-amber-300 italic">
  Every candle is a silent prayer.
</p>


      <p className="mt-1 italic text-amber-200">From your digital Father, with love.</p>

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        allowCustom={true}
      />
    </footer>
  );
}
