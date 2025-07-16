'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Confession {
  _id: string;
  message: string;
  reply: string;
  createdAt: string;
  public: boolean;
  candleCount?: number;
  donationCandleCount?: number;
  thread?: { role: string; message: string }[];
}

export default function AdminPage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [candleCount, setCandleCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [totalConfessions, setTotalConfessions] = useState(0);
  const [silentCount, setSilentCount] = useState(0);
  const [sortKey, setSortKey] = useState<'recent' | 'candles' | 'donations'>('recent');
  const [authed, setAuthed] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminAuthed');
    if (isLoggedIn) {
      setAuthed(true);
      fetchData();
    }
  }, []);

  const handleLogin = async () => {
    const res = await fetch(`/api/auth/check?password=${inputPassword}`);
    if (res.ok) {
      sessionStorage.setItem('adminAuthed', 'true');
      setAuthed(true);
      fetchData();
    } else {
      toast.error('Access denied');
    }
  };

  const fetchData = async () => {
    try {
      const [confessionRes, statsRes] = await Promise.all([
        fetch('/api/confessions'),
        fetch('/api/candle/total'),
      ]);

      if (!confessionRes.ok || !statsRes.ok) {
        throw new Error('One or more requests failed');
      }

      const confessionsData = await confessionRes.json();
      const statsData = await statsRes.json();

      setConfessions(confessionsData);
      setCandleCount(statsData.totalCandles || 0);
      setDonationCount(statsData.totalDonations || 0);
      setTotalConfessions(statsData.totalConfessions || 0);
      setSilentCount(statsData.silentConfessions || 0);
    } catch (err) {
      toast.error('Failed to load admin data');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/confess/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete');

      setConfessions((prev) => prev.filter((c) => c._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const exportToCSV = () => {
    const headers = ['Created At', 'Conversation', 'Candle Count', 'Donation Candles'];

    const rows = confessions.map((conf) => {
      let conversation = '';

      if (Array.isArray(conf.thread)) {
        conversation = conf.thread
          .map((t) => `${t.role === 'user' ? 'You' : 'Father'}: ${t.message}`)
          .join(' | ');
      } else {
        conversation = `You: ${conf.message}`;
        if (conf.reply) conversation += ` | Father: ${conf.reply}`;
      }

      return [
        conf.createdAt ? new Date(conf.createdAt).toLocaleString() : 'Unknown',
        conversation,
        String(conf.candleCount ?? 0),
        String(conf.donationCandleCount ?? 0),
      ];
    });

    const summaryRow = ['TOTAL', '', candleCount.toString(), donationCount.toString()];

    const csvContent = [headers, ...rows, summaryRow]
      .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'confessions_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedConfessions = [...confessions]
    .filter(
      (conf) =>
        conf.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conf.reply?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'candles') {
        return (b.candleCount ?? 0) - (a.candleCount ?? 0);
      } else if (sortKey === 'donations') {
        return (b.donationCandleCount ?? 0) - (a.donationCandleCount ?? 0);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const visibleConfessions = sortedConfessions.slice(0, visibleCount);

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <button
          onClick={handleLogin}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
        <StatCard label="Confessions" value={totalConfessions} />
        <StatCard label="Silent Confessions" value={silentCount} />
        <StatCard label="Candles Lit" value={candleCount} />
        <StatCard label="Donation Candles" value={donationCount} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Manage Confessions</h2>
        <div className="space-x-2 text-sm">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="border rounded px-2 py-1"
          >
            <option value="recent">Sort by Recent</option>
            <option value="candles">Sort by Candles</option>
            <option value="donations">Sort by Donation</option>
          </select>
          <button
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {visibleConfessions.map((conf) => (
          <div key={conf._id} className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-800 whitespace-pre-wrap space-y-1">
              {Array.isArray(conf.thread) ? (
                conf.thread.map((t, i) => (
                  <div key={i}>
                    <span className="font-semibold">
                      {t.role === 'user' ? 'You:' : 'Father:'}
                    </span>{' '}
                    {t.message}
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <span className="font-semibold">You:</span> {conf.message}
                  </div>
                  {conf.reply && (
                    <div className="mt-1">
                      <span className="font-semibold">Father:</span> {conf.reply}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>
                {conf.createdAt
                  ? new Date(conf.createdAt).toLocaleString()
                  : 'Unknown'}
              </span>
              <div className="flex items-center gap-2">
                <span>🕯 {conf.candleCount ?? 0}</span>
                <span>✨ {conf.donationCandleCount ?? 0}</span>
                <button
                  onClick={() => handleDelete(conf._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleConfessions.length < sortedConfessions.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
