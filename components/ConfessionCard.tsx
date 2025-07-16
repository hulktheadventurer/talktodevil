'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { toast } from 'react-hot-toast';

function ConfessionCardInner({
  confession,
  onDonateClick,
  isWallView = false,
}: any) {
  const [lighted, setLighted] = useState(false);
  const [candleCount, setCandleCount] = useState(confession.candleCount || 0);
  const [input, setInput] = useState('');
  const [thread, setThread] = useState(confession.thread || []);
  const [loadingReply, setLoadingReply] = useState(false);
  const responseEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`candle-lit-${confession._id}`);
    if (saved === 'true') setLighted(true);
  }, [confession._id]);

  useEffect(() => {
    if (!isWallView) {
      responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread, isWallView]);

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
    } catch {
      toast.error('Failed to light candle');
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

    if (isWallView) return;

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
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 mb-4 border border-amber-100">
      <div className="flex flex-col gap-2">
        {thread.map((t: { role: string; message: string }, idx: number) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${
              t.role === 'father'
                ? 'bg-amber-100 text-amber-800 self-start'
                : 'bg-amber-600 text-white self-end'
            }`}
          >
            <strong>{t.role === 'father' ? 'Priest:' : 'You:'}</strong> {t.message}
          </div>
        ))}
        <div ref={responseEndRef} />
        {!isWallView && loadingReply && (
          <div className="italic text-amber-600 self-start">The Father is listening...</div>
        )}
      </div>

      {/* Input box (only on home page) */}
      {!isWallView && (
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
              disabled={!input.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Stats + Actions */}
      <div className="flex justify-between items-end text-sm text-gray-500 mt-4">
        <div className="flex flex-col gap-1">
          <div>🕯️ {candleCount}</div>
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
