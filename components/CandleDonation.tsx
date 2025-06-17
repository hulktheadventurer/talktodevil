// components/CandleDonation.tsx
'use client';

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CandleDonation({ confessionId }: { confessionId: string }) {
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/candle/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply candle.');

      toast.success('Candle applied ✨');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="bg-purple-600 text-white px-3 py-1 text-sm rounded"
    >
      Apply ✨
    </button>
  );
}