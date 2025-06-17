'use client';

import { useEffect, useState } from 'react';
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

  const fetchConfessions = async () => {
    try {
      const res = await fetch('/api/confess/list');
      const data = await res.json();
      setConfessions(data);
    } catch (err) {
      console.error('Failed to fetch confessions');
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
      <div className="text-center mb-4">
        <button
          onClick={() => setDonateOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2 rounded"
        >
          Light a Donation Candle
        </button>
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
