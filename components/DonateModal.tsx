'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

const flameTiers = [
  { label: 'Single Flame', count: 1, price: 0.99 },
  { label: 'Smoldering Ember (3)', count: 3, price: 2.49 },
  { label: 'Infernal Blaze (5)', count: 5, price: 3.99 },
  { label: 'Hellfire Surge (10)', count: 10, price: 6.99 },
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
  const [selectedTier, setSelectedTier] = useState(flameTiers[0]);
  const [customCount, setCustomCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    const flames = selectedTier.label === 'Custom' ? customCount : selectedTier.count;
    const amount = Number(
      selectedTier.label === 'Custom'
        ? (customCount * 0.99).toFixed(2)
        : selectedTier.price
    );

    if (!flames || flames <= 0) {
      toast.error('Invalid flame amount');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, candles: flames, confessionId }),
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
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg border border-red-500 text-red-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 hover:text-red-700 text-lg font-bold"
        >
          ✖
        </button>
        <h2 className="text-center text-lg font-semibold text-red-700 mb-4">
          Make a Fiery Offering
        </h2>

        <div className="space-y-2">
          {flameTiers.map((tier) =>
            tier.label === 'Custom' && !allowCustom ? null : (
              <button
                key={tier.label}
                className={`block w-full text-left px-4 py-2 rounded font-medium ${
                  selectedTier.label === tier.label
                    ? 'bg-red-700 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700'
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
              className="mt-2 w-full p-2 border border-red-500 rounded bg-white text-red-900 text-center"
              placeholder="Number of flames"
            />
          )}

          <button
            onClick={handleDonate}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded font-semibold ${
              loading
                ? 'bg-red-300 text-white cursor-wait'
                : 'bg-red-700 text-white hover:bg-red-800'
            }`}
          >
            {loading ? 'Summoning...' : 'Offer Flame 🔥'}
          </button>
        </div>
      </div>
    </div>
  );
}
