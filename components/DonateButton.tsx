'use client';

import { useDonateModal } from '@/hooks/useDonateModal';

export default function DonateButton() {
  const { open } = useDonateModal();

  return (
    <button
      onClick={open}
      className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
    >
      🔥 Offer Flames
    </button>
  );
}
