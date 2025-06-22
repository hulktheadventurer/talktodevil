'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

function ConfessionCardInner({ confession, onDonateClick }: any) {
  const [lighted, setLighted] = useState(false);
  const [applying, setApplying] = useState(false);
  const [candleCount, setCandleCount] = useState(confession.candleCount || 0);
  const [donationCount, setDonationCount] = useState(confession.donationCandleCount || 0);
  const [availableDonationCandles, setAvailableDonationCandles] = useState(0);

  const searchParams = useSearchParams();
  const success = searchParams?.get('success');

  // ✅ Load lighted state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`candle-lit-${confession._id}`);
    if (saved === 'true') setLighted(true);
  }, [confession._id]);

  const fetchAvailableCandles = async () => {
    try {
      const res = await fetch('/api/user-candles');
      const data = await res.json();
      setAvailableDonationCandles(data.donationCandles || 0);
    } catch (err) {
      console.error('Failed to fetch donation candles');
    }
  };

  useEffect(() => {
    fetchAvailableCandles();
  }, []);

  useEffect(() => {
    if (success === '1') {
      fetchAvailableCandles();
    }
  }, [success]);

  const handleLight = async () => {
    if (lighted) return;
    try {
      const res = await fetch('/api/candle/light', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId: confession._id }),
      });
      if (res.ok) {
        setLighted(true);
        setCandleCount((prev: number) => prev + 1);
        localStorage.setItem(`candle-lit-${confession._id}`, 'true');
        toast.success('🕯️ Candle lit');
      } else {
        toast.error('Failed to light candle');
      }
    } catch (err) {
      toast.error('Failed to light candle');
    }
  };

  const handleApply = async () => {
    if (applying) return;
    setApplying(true);
    try {
      if (availableDonationCandles < 1) {
        onDonateClick(); // Trigger Stripe modal
        return;
      }

      const res = await fetch('/api/candle/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId: confession._id }),
      });
      if (res.ok) {
        setDonationCount((prev: number) => prev + 1);
        toast.success('✨ Donation candle applied');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to apply candle');
      }
    } catch (err) {
      toast.error('Failed to apply candle');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/wall?id=${confession._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied ↪');
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 mb-4 border border-amber-100">
      <p className="text-gray-800 text-lg whitespace-pre-wrap font-semibold mb-2">
        {confession.message}
      </p>
      {confession.reply && (
        <div className="mt-2 p-3 bg-amber-50 rounded text-sm border-l-4 border-amber-400">
          <strong className="text-amber-700">Priest:</strong> {confession.reply}
        </div>
      )}

      <div className="flex justify-between items-end text-sm text-gray-500 mt-4">
        <div className="flex flex-col gap-1">
          <div>🕯️ {candleCount} &nbsp; ✨ {donationCount}</div>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs text-gray-400">
          <div>{new Date(confession.createdAt).toLocaleString()}</div>
          <div className="flex gap-2 text-sm">
            <button
              onClick={handleLight}
              disabled={lighted}
              className={`bg-amber-600 hover:bg-amber-700 text-white py-1 px-3 rounded-xl ${
                lighted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Light 🕯️
            </button>
            <button
              onClick={handleApply}
              disabled={applying}
              className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-xl"
            >
              Apply ✨
            </button>
            <button
              onClick={handleShare}
              className="bg-sky-600 hover:bg-sky-700 text-white py-1 px-3 rounded-xl"
            >
              Share ↪
            </button>
            <button
              onClick={onDonateClick}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-xl"
            >
              Donate ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfessionCard(props: any) {
  return (
    <Suspense fallback={null}>
      <ConfessionCardInner {...props} />
    </Suspense>
  );
}
