'use client';

import { useEffect, useState } from 'react';
import ShareButton from '@/components/ShareButton';
import DonateModal from '@/components/DonateModal';
import toast from 'react-hot-toast';

export default function ArchivePage() {
  const [blessings, setBlessings] = useState<any[]>([]);
  const [availableFlames, setAvailableFlames] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [isDonateOpen, setDonateOpen] = useState(false);

  const fetchAvailableFlames = async () => {
    try {
      const res = await fetch('/api/user-candles');
      const data = await res.json();
      setAvailableFlames(data.donationCandles || 0);
    } catch (err) {
      console.error('Failed to fetch lotus offerings');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/blessing/all');
        const data = await res.json();
        setBlessings(data.blessings || []);
        await fetchAvailableFlames();
      } catch (err) {
        console.error('Error loading archive data:', err);
        toast.error('Failed to load reflections. Please try again.');
      }
    };

    load();

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1' && params.get('candles')) {
      fetchAvailableFlames();
    }
  }, []);

  return (
    <main className="min-h-screen bg-yellow-50 text-yellow-900 flex flex-col items-center px-6 py-20">
      <section className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-700 mb-2">📜 Archive of Meditations</h1>
        <button
          onClick={() => { setSelectedId(''); setDonateOpen(true); }}
          className="px-5 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 font-semibold"
        >
          Offer Peace
        </button>
        {availableFlames > 0 && (
          <p className="mt-2 text-sm text-yellow-500">
            🌸 You have {availableFlames} lotus{availableFlames > 1 ? 'es' : ''} to offer
          </p>
        )}
      </section>

      <section className="w-full max-w-3xl mt-4">
        <h2 className="text-3xl font-bold text-center text-yellow-600 mb-6">Past Reflections</h2>
        <ul className="space-y-6">
          {blessings.map((b: any, i: number) => (
            <li
              key={b._id || i}
              id={`meditation-${i}`}
              className="bg-yellow-100 p-4 rounded-lg shadow border border-yellow-600 space-y-2"
            >
              <p className="italic text-yellow-900 text-lg text-center">“{b.text}”</p>
              <p className="text-sm text-yellow-600 text-right">
                Shared on {new Date(b.date).toLocaleDateString()}
              </p>
              <div className="flex justify-end gap-2 flex-wrap">
                <ShareButton
                  label="Share ↪"
                  icon={null}
                  link={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://talktobuddha.life'}/archive#meditation-${i}`}
                  className="bg-yellow-700 hover:bg-yellow-800 text-white px-3 py-1 text-sm rounded"
                />
                <button
                  onClick={() => {
                    setSelectedId(b._id?.toString() || '');
                    setDonateOpen(true);
                  }}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 text-sm rounded"
                >
                  Offer Lotus
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
