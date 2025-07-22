'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function FlameButton({
  confessionId,
  onLit,
  className = '',
  small = false,
  glowType = '',
}: {
  confessionId: string;
  onLit?: () => void;
  className?: string;
  small?: boolean;
  glowType?: string;
}) {
  const [lit, setLit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`flame-offered-${confessionId}`);
    if (saved === 'true') {
      setLit(true);
    }
  }, [confessionId]);

  const handleClick = async () => {
    if (lit || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/candle/light', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId, count: 1 }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Failed to offer flame');
      }

      localStorage.setItem(`flame-offered-${confessionId}`, 'true');
      setLit(true);
      toast.success('🔥 Flame offered');
      onLit?.();
      setGlow(true);
      setTimeout(() => setGlow(false), 600);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const glowClass = glow ? `animate-glow ${glowType ? `glow-${glowType}` : 'text-red-500'}` : '';

  return (
    <button
      onClick={handleClick}
      disabled={lit || loading}
      className={`${glowClass} ${lit || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? 'Offering...' : small ? '🔥' : 'Offer Flame 🔥'}
    </button>
  );
}
