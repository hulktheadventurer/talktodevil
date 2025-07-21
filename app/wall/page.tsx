'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ConfessionCard from '@/components/ConfessionCard';
import DonateModal from '@/components/DonateModal';

interface Confession {
  _id: string;
  thread: { role: string; message: string; timestamp?: string }[];
  createdAt: string;
  candleCount?: number;
  donationCandleCount?: number;
}

function SuccessWatcher({ onSuccess }: { onSuccess: () => void }) {
  const searchParams = useSearchParams();
  const success = searchParams?.get('success');

  useEffect(() => {
    if (success === '1') {
      onSuccess();
    }
  }, [success, onSuccess]);

  return null;
}

export default function WallPage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [donateOpen, setDonateOpen] = useState(false);
  const [availableDonationCandles, setAvailableDonationCandles] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchConfessions = async () => {
    try {
      const res = await fetch('/api/confess/list');
      const data = await res.json();

      if (Array.isArray(data.confessions)) {
        setConfessions(
          data.confessions.map((conf: any) => ({
            ...conf,
            thread: conf.thread || [
              { role: 'user', message: conf.message },
              ...(conf.reply ? [{ role: 'devil', message: conf.reply }] : []),
            ],
          }))
        );
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 100);
      }
    } catch (err) {
      console.error('🔥 Failed to summon confessions', err);
    }
  };

  const fetchDonationCandles = async () => {
    try {
      const res = await fetch('/api/user-candles');
      const data = await res.json();
      setAvailableDonationCandles(data.donationCandles || 0);
    } catch (err) {
      console.error('🔥 Failed to fetch your infernal flames');
    }
  };

  useEffect(() => {
    fetchConfessions();
    fetchDonationCandles();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-12 relative">
      <div className="text-center mb-4">
        <button
          onClick={() => setDonateOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded"
        >
          Offer Flames
        </button>
      </div>

      <Suspense fallback={null}>
        <SuccessWatcher onSuccess={fetchDonationCandles} />
      </Suspense>

      {confessions.length > 0 ? (
        confessions.map((confession) => (
          <ConfessionCard
            key={confession._id}
            confession={confession}
            onDonateClick={() => setDonateOpen(true)}
            isWallView={true}
          />
        ))
      ) : (
        <p className="text-center text-red-400 mt-6 italic">
          The abyss is silent... for now.
        </p>
      )}

      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-full shadow-lg z-50"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}
