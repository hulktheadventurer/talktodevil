'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { toast } from 'react-hot-toast';

function ConfessionCardInner({
  confession,
  onDonateClick,
  isWallView = false,
}: any) {
  const [lighted, setLighted] = useState(false);
  const [flameCount, setFlameCount] = useState(confession.candleCount || 0);
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
        setFlameCount((prev: number) => prev + 1);
        localStorage.setItem(`candle-lit-${confession._id}`, 'true');
        toast.success('🪷 Lotus offered');
      } else {
        toast.error('Failed to offer lotus');
      }
    } catch {
      toast.error('Failed to offer lotus');
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
        setThread([...newThread, { role: 'buddha', message: data.reply, timestamp: new Date() }]);
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
    <div className="bg-yellow-50 text-yellow-900 shadow-lg rounded-xl p-4 mb-4 border border-yellow-300">
      <div className="flex flex-col gap-2">
        {thread.map((t: { role: string; message: string }, idx: number) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${
              ['father', 'devil', 'god', 'buddha'].includes(t.role)
                ? 'bg-yellow-100 text-yellow-900 self-start'
                : 'bg-yellow-600 text-white self-end'
            }`}
          >
            <strong>{t.role === 'user' ? 'You:' : 'Buddha:'}</strong> {t.message}
          </div>
        ))}
        <div ref={responseEndRef} />
        {!isWallView && loadingReply && (
          <div className="italic text-yellow-500 self-start">
            The Buddha is listening...
          </div>
        )}
      </div>

      {!isWallView && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Speak again..."
              className="flex-1 px-3 py-2 border border-yellow-400 bg-yellow-50 text-yellow-900 rounded"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end text-sm text-yellow-700 mt-4">
        <div className="flex flex-col gap-1">
          <div>🪷 {flameCount}</div>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-yellow-600">
          <div>{new Date(confession.createdAt).toLocaleString()}</div>
          <div className="flex gap-2 text-sm">
            <button
              onClick={handleLight}
              disabled={lighted}
              className={`bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded-xl ${
                lighted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Offer 🪷
            </button>
            <button
              onClick={handleShare}
              className="bg-amber-600 hover:bg-amber-700 text-white py-1 px-3 rounded-xl"
            >
              Share ↪
            </button>
            <button
              onClick={onDonateClick}
              className="bg-orange-700 hover:bg-orange-800 text-white py-1 px-3 rounded-xl"
            >
              Donate 🪷
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
