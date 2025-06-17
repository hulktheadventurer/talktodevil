'use client';

import { useState } from 'react';
import { useDonateModal } from '@/hooks/useDonateModal';

export default function DonateButton() {
  const { open } = useDonateModal();

  return (
    <button
      onClick={open}
      className="bg-amber-600 text-white px-4 py-2 rounded-lg shadow hover:bg-amber-700 transition"
    >
      🕯️ Donate Candles
    </button>
  );
}
