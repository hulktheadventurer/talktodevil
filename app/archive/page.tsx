'use client';

import { useEffect, useState } from 'react';
import ShareButton from '@/components/ShareButton';
import DonateModal from '@/components/DonateModal';
import toast from 'react-hot-toast';

export default function ArchivePage() {
  const [temptations, setTemptations] = useState<any[]>([]);
  const [availableFlames, setAvailableFlames] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [isDonateOpen, setDonateOpen] = useState(false);

  const fetchAvailableFlames = async () => {
    try {
      const res = await fetch('/api/user-candles');
      const data = await res.json();
      setAvailableFlames(data.donationCandles || 0);
    } catch (err) {
      console.error('Failed to fetch flame offerings');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/blessing/all');
        const data = await res.json();
        setTemptations(data.blessings || []);
        await fetchAvailableFlames();
      } catch (err) {
        console.error('Error loading archive data:', err);
        toast.error('Failed to load temptations. Please try again.');
      }
    };

    load();

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1' && params.get('candles')) {
      fetchAvailableFlames();
    }
  }, []);

  return (
    <main className="min-h-screen bg-red-50 text-red-900 flex flex-col items-center px-6 py-20">
      <section className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-bold text-red-700 mb-2">📜 Archive of Temptations</h1>
        <button
          onClick={() => { setSelectedId(''); setDonateOpen(true); }}
          className="px-5 py-2 bg-red-700 text-white rounded hover:bg-red-800 font-semibold"
        >
          Feed the Flame
        </button>
        {availableFlames > 0 && (
          <p className="mt-2 text-sm text-red-500">
            🔥 You have {availableFlames} flame{availableFlames > 1 ? 's' : ''} to offer
          </p>
        )}
      </section>

      <section className="w-full max-w-3xl mt-4">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Past Temptations</h2>
        <ul className="space-y-6">
          {temptations.map((t: any, i: number) => (
            <li
              key={t._id || i}
              id={`temptation-${i}`}
              className="bg-red-100 p-4 rounded-lg shadow border border-red-600 space-y-2"
            >
              <p className="italic text-red-900 text-lg text-center">“{t.text}”</p>
              <p className="text-sm text-red-600 text-right">
                Summoned on {new Date(t.date).toLocaleDateString()}
              </p>
              <div className="flex justify-end gap-2 flex-wrap">
                <ShareButton
                  label="Share ↪"
                  icon={null}
                  link={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://talktodevil.life'}/archive#temptation-${i}`}
                  className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 text-sm rounded"
                />
                <button
                  onClick={() => {
                    setSelectedId(t._id?.toString() || '');
                    setDonateOpen(true);
                  }}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 text-sm rounded"
                >
                  Offer Flame
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setDonateOpen(false)}
        confessionId={selectedId}
        allowCustom
      />
    </main>
  );
}
