'use client';

import { useEffect, useState } from 'react';
import DonateModal from './DonateModal';

export default function DynamicFooter() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donationCount, setDonationCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/candle/total')
      .then(res => res.json())
      .then(data => setDonationCount(data.totalDonations))
      .catch(() => setDonationCount(null));
  }, []);

  return (
    <footer className="bg-amber-800 text-center text-sm text-amber-100 py-4 z-10 relative">
      <div className="flex flex-wrap justify-center items-center gap-4 mb-2">
        <a href="/terms" className="underline">Terms & Privacy</a>
        <a href="/disclaimer" className="underline">Disclaimer</a>
        <button
          onClick={() => setIsDonateOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded text-sm"
        >
          🔥 Offer Flames
        </button>
      </div>

      <p className="text-xs text-amber-300 italic mb-1">
        Every flame feeds the inferno.
      </p>
      <p className="text-xs italic text-amber-200 mb-3">From the Devil’s lair, with wicked love.</p>

      {/* BoredAtWork Universe Section */}
      <div className="text-amber-100 text-xs">
        <p className="font-semibold mb-1">🌀 BoredAtWork Universe</p>
        <ul className="space-y-1 text-amber-200">
          <li><a href="https://www.talktodevil.life" className="underline">TalkToDevil</a> — Chat with the Devil himself 😈</li>
          <li><a href="https://www.askthedevil.life" className="underline">AskTheDevil</a> — The Devil’s arcade of twisted games 🎮</li>
          <li><a href="https://www.talktogod.life" className="underline">TalkToGod</a> — Divine chats from above ✨</li>
          <li><a href="https://www.talktobuddha.life" className="underline">TalkToBuddha</a> — Zen wisdom from the Enlightened One 🪷</li>
          <li><a href="https://www.dreamdecoder.life" className="underline">DreamDecoder</a> — Interpret your weirdest dreams 💤</li>
          <li><a href="https://www.confessly.com" className="underline">Confessly</a> — Whisper to the Father 🙏</li>
        </ul>
        <p className="text-amber-300 italic mt-2">
          More unholy apps coming soon...
        </p>
      </div>

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        allowCustom={true}
      />
    </footer>
  );
}
