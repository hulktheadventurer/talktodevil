'use client';

import { useEffect, useState, Suspense } from 'react';
import { toast } from 'react-hot-toast';

function ConfessionCardInner({ confession, onDonateClick, availableDonationCandles = 0 }: any) {
  const [lighted, setLighted] = useState(false);
  const [applying, setApplying] = useState(false);
  const [candleCount, setCandleCount] = useState(confession.candleCount || 0);
  const [donationCount, setDonationCount] = useState(confession.donationCandleCount || 0);
  const [input, setInput] = useState('');
  const [thread, setThread] = useState(confession.thread || []);
  const [loadingReply, setLoadingReply] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`candle-lit-${confession._id}`);
    if (saved === 'true') setLighted(true);
  }, [confession._id]);

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
        onDonateClick();
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

  const handleSend = async () => {
    if (!input.trim()) return;
    const newThread = [...thread, { role: 'user', message: input, timestamp: new Date() }];
    setThread(newThread);
    setInput('');
    setLoadingReply(true);
    try {
      const res = await fetch(`/api/confess/${confession._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (res.ok) {
        setThread([...newThread, { role: 'father', message: data.reply, timestamp: new Date() }]);
      } else {
        toast.error(data.error || 'Failed to reply');
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 mb-4 border border-amber-100">
      <div className="space-y-3">
{thread.map((t: { role: string; message: string }, idx: number) => (
          <div
            key={idx}
            className={`text-sm whitespace-pre-wrap ${t.role === 'father' ? 'text-amber-700 bg-amber-50 border-l-4 border-amber-400 px-3 py-2 rounded' : 'text-gray-800 font-semibold'}`}
          >
            {t.role === 'father' ? <strong>Priest:</strong> : null} {t.message}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Speak again..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleSend}
            disabled={loadingReply}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>

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
              className={`bg-amber-600 hover:bg-amber-700 text-white py-1 px-3 rounded-xl ${lighted ? 'opacity-50 cursor-not-allowed' : ''}`}
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
