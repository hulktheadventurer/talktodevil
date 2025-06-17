
'use client';

import React, { useState, useEffect, useRef } from 'react';
import DonateModal from '@/components/DonateModal';

export default function HomePage() {
  const [confession, setConfession] = useState('');
  const [postToWall, setPostToWall] = useState(true);
const [response, setResponse] = useState<{ reply: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
const responseEndRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!confession.trim()) return;
    setLoading(true);

    const res = await fetch("/api/confess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confession, public: postToWall })
    });

    const data = await res.json();
    const aiReply = data.reply;

    const newResponse = {
      reply: aiReply,
      timestamp: new Date().toISOString()
    };

    setResponse(newResponse);
    setLoading(false);
    setConfession('');
  };

  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

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

      <h2 className="text-3xl font-bold mb-8 text-center text-amber-800 z-10 relative">Speak, My Child</h2>

      {loading && (
        <div className="flex justify-center py-4 z-10 relative">
          <div className="italic text-amber-600">The Father is listening...</div>
        </div>
      )}

      {response && (
        <div className="flex flex-col space-y-6 z-10 relative">
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-amber-200 max-h-[60vh] overflow-y-auto">
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 shadow-inner text-gray-800 whitespace-pre-wrap leading-relaxed">
              {response.reply}
            </div>
            <div className="mt-3 text-sm text-gray-500 text-right">
              {new Date(response.timestamp).toLocaleString()}
            </div>
          </div>
          <div ref={responseEndRef} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-8 z-10 relative">
        <textarea
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Confess here..."
          className="w-full p-4 border-2 border-amber-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50"
          rows={4}
        />
        <div className="text-sm italic text-amber-600 text-center">
          You may speak again whenever your heart stirs — the Father will listen anew.
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label className="flex items-center space-x-3 text-base">
            <input
              type="checkbox"
              checked={postToWall}
              onChange={(e) => setPostToWall(e.target.checked)}
              className="accent-amber-600"
            />
            <span>Post to Wall</span>
          </label>
          <button
            type="submit"
            className="bg-amber-600 text-white px-8 py-2 rounded-2xl hover:bg-amber-700 font-semibold shadow"
          >
            Confess
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
