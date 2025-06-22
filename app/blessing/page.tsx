'use client';

import { useEffect, useState } from 'react';
import CandleButton from '@/components/CandleButton';
import ShareButton from '@/components/ShareButton';
import DonateModal from '@/components/DonateModal';
import toast from 'react-hot-toast';

export default function BlessingPage() {
  const [blessing, setBlessing] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableDonationCandles, setAvailableDonationCandles] = useState(0);
  const [blessingCandleCount, setBlessingCandleCount] = useState(0);
  const [blessingDonationCount, setBlessingDonationCount] = useState(0);
  const [isDonateOpen, setDonateOpen] = useState(false);

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
    async function load() {
      try {
        const blessingRes = await fetch('/api/blessing');
        const blessingData = await blessingRes.json();
        setBlessing(blessingData.blessing || '');
        setCreatedAt(blessingData.createdAt || '');

        const countsRes = await fetch('/api/blessing/counts');
        const countsData = await countsRes.json();
        setBlessingCandleCount(countsData.blessingCandleCount || 0);
        setBlessingDonationCount(countsData.blessingDonationCount || 0);

        await fetchAvailableCandles();
      } catch (err) {
        console.error('Error loading blessing data:', err);
        toast.error('Failed to load blessing. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    load();

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1' && params.get('candles')) {
      fetchAvailableCandles();
    }
  }, []);

  const handleApply = async () => {
    try {
      const res = await fetch('/api/candle/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId: 'blessing' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply candle.');

      toast.success('Candle applied ✨');
      setBlessingDonationCount((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-4">🌤️ Today’s Blessing</h1>
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

      <div className="bg-white p-4 rounded-lg shadow max-w-2xl mx-auto border border-amber-100 space-y-3">
        <div className="text-base font-semibold text-gray-700 border-l-4 border-amber-500 pl-2">
          Today's Blessing:
        </div>
        <div className="bg-yellow-50 p-4 rounded text-base leading-relaxed whitespace-pre-wrap">
          “{blessing}”
        </div>

        <div className="flex justify-between flex-wrap text-xs text-gray-500 items-center">
          <div className="flex gap-3 items-center">
            <span>{blessingCandleCount} 🕯</span>
            <span>{blessingDonationCount} ✨</span>
          </div>
          <span className="text-gray-400">
            Posted on {createdAt ? new Date(createdAt).toLocaleString() : 'Unknown'}
          </span>
        </div>

        <div className="flex justify-end flex-wrap gap-2 mt-2 items-center">
          <CandleButton
            confessionId="blessing"
            glowType="blessing"
            onLit={() => setBlessingCandleCount((prev) => prev + 1)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          />
          <button
            onClick={handleApply}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm rounded"
          >
            Apply ✨
          </button>
          <ShareButton
            link={blessing}
            label="Share"
            icon={<span>↪</span>}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
          />
          <button
            onClick={() => setDonateOpen(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 text-sm rounded"
          >
            Donate ❤️
          </button>
        </div>
      </div>

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setDonateOpen(false)}
        confessionId="blessing"
        allowCustom
      />
    </main>
  );
}
