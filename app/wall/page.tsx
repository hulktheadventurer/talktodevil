'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ConfessionCard from '@/components/ConfessionCard';
import DonateModal from '@/components/DonateModal';

interface Confession {
  _id: string;
  message: string;
  reply?: string;
  createdAt: string;
  candleCount?: number;
  donationCandleCount?: number;
}

export default function WallPage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [donateOpen, setDonateOpen] = useState(false);
  const [availableDonationCandles, setAvailableDonationCandles] = useState(0);
  const searchParams = useSearchParams();

  const fetchConfessions = async () => {
    try {
      const res = await fetch('/api/confess/list');
      const data = await res.json();
      setConfessions(data);
    } catch (err) {
      console.error('Failed to fetch confessions');
    }
  };

  const fetchDonationCandles = async () => {
    try {
      const res = await fetch('/api/user-candles');
      const data = await res.json();
      setAvailableDonationCandles(data.donationCandles || 0);
    } catch (err) {
      console.error('Failed to fetch donation candles');
    }
  };

  useEffect(() => {
    fetchConfessions();
    fetchDonationCandles();
  }, []);

  // Refresh candles if Stripe success
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === '1') {
      fetchDonationCandles();
    }
  }, [searchParams]);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
      <div className="text-center mb-4">
        <button
          onClick={() => setDonateOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2 rounded"
        >
          Light a Donation Candle
        </button>
        {availableDonationCandles > 0 && (
          <p className="text-sm text-amber-700 mt-2">
            You have {availableDonationCandles} donation candle{availableDonationCandles > 1 ? 's' : ''} to apply ✨
          </p>
        )}
      </div>

      {confessions.length > 0 ? (
        confessions.map((confession) => (
          <ConfessionCard
            key={confession._id}
            confession={confession}
            onDonateClick={() => setDonateOpen(true)}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-6">No confessions found.</p>
      )}

      <DonateModal
        isOpen={donateOpen}
        onClose={() => setDonateOpen(false)}
      />
    </div>
  );
}
