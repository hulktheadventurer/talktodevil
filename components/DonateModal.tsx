'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

const lotusTiers = [
  { label: 'Single Lotus', count: 1, price: 0.99 },
  { label: 'Gentle Bloom (3)', count: 3, price: 2.49 },
  { label: 'Tranquil Grove (5)', count: 5, price: 3.99 },
  { label: 'Field of Serenity (10)', count: 10, price: 6.99 },
  { label: 'Custom', count: 0, price: 0 },
];

export default function DonateModal({
  isOpen,
  onClose,
  confessionId,
  allowCustom = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  confessionId?: string;
  allowCustom?: boolean;
}) {
  const [selectedTier, setSelectedTier] = useState(lotusTiers[0]);
  const [customCount, setCustomCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    const lotuses = selectedTier.label === 'Custom' ? customCount : selectedTier.count;
    const amount = Number(
      selectedTier.label === 'Custom'
        ? (customCount * 0.99).toFixed(2)
        : selectedTier.price
    );

    if (!lotuses || lotuses <= 0) {
      toast.error('Invalid lotus amount');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, candles: lotuses, confessionId }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Something went wrong with checkout');
      }
    } catch (err) {
      toast.error('Error creating Stripe session');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg border border-yellow-500 text-yellow-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-yellow-500 hover:text-yellow-700 text-lg font-bold"
        >
          ✖
        </button>
        <h2 className="text-center text-lg font-semibold text-yellow-700 mb-4">
          Make a Peaceful Offering
        </h2>

        <div className="space-y-2">
          {lotusTiers.map((tier) =>
            tier.label === 'Custom' && !allowCustom ? null : (
              <button
                key={tier.label}
                className={`block w-full text-left px-4 py-2 rounded font-medium ${
                  selectedTier.label === tier.label
                    ? 'bg-yellow-700 text-white'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
                onClick={() => setSelectedTier(tier)}
              >
                {tier.label}{' '}
                {tier.label === 'Custom'
                  ? '- Set your amount'
                  : `- £${tier.price}`}
              </button>
            )
          )}

          {selectedTier.label === 'Custom' && (
            <input
              type="number"
              min={1}
              value={customCount}
              onChange={(e) => setCustomCount(parseInt(e.target.value) || 1)}
              className="mt-2 w-full p-2 border border-yellow-500 rounded bg-white text-yellow-900 text-center"
              placeholder="Number of lotuses"
            />
          )}

          <button
            onClick={handleDonate}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded font-semibold ${
              loading
                ? 'bg-yellow-300 text-white cursor-wait'
                : 'bg-yellow-700 text-white hover:bg-yellow-800'
            }`}
          >
            {loading ? 'Processing...' : 'Offer Lotus 🌸'}
          </button>
        </div>
      </div>
    </div>
  );
}
