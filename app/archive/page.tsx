'use client';

import { useEffect, useState } from 'react';
import ShareButton from '@/components/ShareButton';
import DonateModal from '@/components/DonateModal';
import toast from 'react-hot-toast';

export default function ArchivePage() {
  const [blessings, setBlessings] = useState<any[]>([]);
  const [availableDonationCandles, setAvailableDonationCandles] = useState(0);
  const [selectedBlessingId, setSelectedBlessingId] = useState('');
  const [isDonateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    fetch('/api/blessing/all')
      .then(res => res.json())
      .then(data => setBlessings(data.blessings || []));

    fetch('/api/user-candles')
      .then(res => res.json())
      .then(data => setAvailableDonationCandles(data.donationCandles || 0));
  }, []);

  return (
    <main className="min-h-screen bg-yellow-50 text-gray-800 flex flex-col items-center px-6 py-20">
      <section className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-800 mb-2">📜 Archive of Blessings</h1>
        <button
          onClick={() => { setSelectedBlessingId(''); setDonateOpen(true); }}
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        >
          Light a Donation Candle
        </button>
        {availableDonationCandles > 0 && (
          <p className="mt-2 text-sm text-amber-700">
            You have {availableDonationCandles} donation candle{availableDonationCandles > 1 ? 's' : ''} to apply ✨
          </p>
        )}
      </section>

      <section className="w-full max-w-3xl mt-4">
        <h2 className="text-3xl font-bold text-center text-amber-700 mb-6">Past Blessings</h2>
        <ul className="space-y-6">
          {blessings.map((b: any, i: number) => (
            <li key={b._id || i} className="bg-white p-4 rounded-lg shadow border border-amber-200 space-y-2">
              <p className="italic text-gray-800 text-lg text-center">“{b.text}”</p>
              <p className="text-sm text-gray-500 text-right">Posted on {new Date(b.date).toLocaleDateString()}</p>
              <div className="flex justify-end gap-4 text-amber-700 text-sm">
                <ShareButton
                  label="Share"
                  icon={<span className="ml-1">↪</span>}
                  link={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://confessly.life'}/archive#blessing-${i}`}
                />
                <button onClick={() => { setSelectedBlessingId(b._id?.toString() || ''); setDonateOpen(true); }} className="hover:underline">
                  Donate ❤️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setDonateOpen(false)}
        confessionId={selectedBlessingId}
        allowCustom
      />
    </main>
  );
}
