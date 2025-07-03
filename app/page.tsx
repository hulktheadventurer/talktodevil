'use client';

import React, { useState, useEffect, useRef } from 'react';
import DonateModal from '@/components/DonateModal';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [thread, setThread] = useState<
    { role: string; message: string; timestamp: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [posted, setPosted] = useState(false);
  const responseEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = {
      role: 'user',
      message: input,
      timestamp: new Date().toISOString(),
    };
    setThread((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/confess/reply-temp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread: [...thread, userMessage] }),
      });
      const data = await res.json();
      const fatherMessage = {
        role: 'father',
        message: data.reply,
        timestamp: new Date().toISOString(),
      };
      setThread((prev) => [...prev, fatherMessage]);
    } catch (err) {
      console.error('Reply error', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostToWall = async () => {
    try {
      const res = await fetch('/api/confess/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread }),
      });
      if (res.ok) {
        setPosted(true);
      }
    } catch (err) {
      console.error('Failed to post confession');
    }
  };

  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread]);

  return (
    <div className="relative px-6 py-12 w-full max-w-3xl mx-auto z-10">
      <div className="text-center mb-6">
        <button
          onClick={() => setShowDonateModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-xl"
        >
          Light a Donation Candle
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-8 text-center text-amber-800 z-10 relative">
        Speak, My Child
      </h2>

      <div className="bg-white shadow-xl rounded-2xl p-6 border border-amber-200 max-h-[60vh] overflow-y-auto space-y-4">
        {thread.map((entry, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed text-sm ${
              entry.role === 'father'
                ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-400 px-3 py-2 rounded'
                : 'text-gray-800 font-semibold'
            }`}
          >
            {entry.role === 'father' ? <strong>Priest:</strong> : null} {entry.message}
          </div>
        ))}
        {loading && (
          <div className="italic text-amber-600">The Father is listening...</div>
        )}
        <div ref={responseEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex flex-col space-y-4 mt-6 z-10 relative"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak again..."
          className="w-full p-4 border-2 border-amber-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50"
          rows={3}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 text-white px-8 py-2 rounded-2xl hover:bg-amber-700 font-semibold shadow"
          >
            Send
          </button>
          <button
            type="button"
            disabled={posted || thread.length === 0}
            onClick={handlePostToWall}
            className="bg-purple-600 text-white px-8 py-2 rounded-2xl hover:bg-purple-700 font-semibold shadow"
          >
            {posted ? '✅ Posted' : 'Post to Wall'}
          </button>
        </div>
      </form>

      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
      />
    </div>
  );
}
