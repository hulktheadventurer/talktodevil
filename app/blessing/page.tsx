'use client';

import { useEffect, useState } from 'react';
import CandleButton from '@/components/CandleButton';
import ShareButton from '@/components/ShareButton';
import DonateModal from '@/components/DonateModal';
import toast from 'react-hot-toast';

export default function BlessingPage() {
  const [temptation, setTemptation] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableFlames, setAvailableFlames] = useState(0);
  const [temptationFlameCount, setTemptationFlameCount] = useState(0);
  const [isDonateOpen, setDonateOpen] = useState(false);

  const fetchAvailableFlames = async () => {
    try {
      const res = await fetch('/api/user-candles');
      const data = await res.json();
      setAvailableFlames(data.donationCandles || 0);
    } catch (err) {
      console.error('Failed to fetch donation flames');
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/blessing');
        const data = await res.json();
        setTemptation(data.temptation || data.blessing || '');
        setCreatedAt(data.createdAt || '');

        const countRes = await fetch('/api/blessing/counts');
        const countData = await countRes.json();
        setTemptationFlameCount(countData.blessingCandleCount || 0);

        await fetchAvailableFlames();
      } catch (err) {
        console.error('Error loading temptation data:', err);
        toast.error('Failed to load today’s temptation. Try again later.');
      } finally {
        setLoading(false);
      }
    }

    load();

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1' && params.get('candles')) {
      fetchAvailableFlames();
    }
  }, []);

  if (loading)
    return (
      <p className="text-center text-red-500">
        Summoning today’s temptation...
      </p>
    );

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-4 text-red-700">
        🔥 Today’s Temptation
      </h1>

      <div className="text-center mb-4">
        <button
          onClick={() => setDonateOpen(true)}
          className="bg-red-700 hover:bg-red-800 text-white font-semibold px-5 py-2 rounded"
        >
          Offer Flames
        </button>

        {availableFlames > 0 && (
          <p className="text-sm text-red-300 mt-2">
            You have {availableFlames} flame
            {availableFlames > 1 ? 's' : ''} to offer 🔥
          </p>
        )}
      </div>

      <div className="bg-black text-red-100 p-4 rounded-lg shadow-lg max-w-2xl mx-auto border border-red-800 space-y-3">
        <div className="text-base font-semibold border-l-4 border-red-600 pl-2">
          Temptation from Below:
        </div>
        <div className="bg-red-950 p-4 rounded text-base leading-relaxed whitespace-pre-wrap italic text-red-200">
          “{temptation}”
        </div>

        <div className="flex justify-between flex-wrap text-xs text-red-400 items-center">
          <div className="flex gap-3 items-center">
            <span>{temptationFlameCount} 🔥</span>
          </div>
          <span>
            Unleashed on{' '}
            {createdAt ? new Date(createdAt).toLocaleString() : 'Unknown'}
          </span>
        </div>

        <div className="flex justify-end flex-wrap gap-2 mt-2 items-center">
          <CandleButton
            confessionId="blessing"
            glowType="blessing"
            onLit={() => setTemptationFlameCount((prev) => prev + 1)}
            className="bg-red-600 hover:bg-red-700 text-white"
          />
          <ShareButton
            link={temptation}
            label="Share"
            icon={<span>↪</span>}
            className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 text-sm rounded"
          />
          <button
            onClick={() => setDonateOpen(true)}
            className="bg-pink-700 hover:bg-pink-800 text-white px-3 py-1 text-sm rounded"
          >
            Offer ❤️
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
