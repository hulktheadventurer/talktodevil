import './globals.css';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import DynamicFooter from '@/components/DynamicFooter';

export const metadata = {
  title: 'Confessly',
  description: 'A sacred space for your digital confessions.',
  icons: {
    icon: '/favicon.png', // ✅ updated from .ico to .png
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" /> {/* ✅ fallback support */}
      </head>
      <body className="bg-gradient-to-b from-orange-50 to-amber-100 text-gray-900 text-base flex flex-col min-h-screen">
        {/* Watermark */}
        <div
          className="fixed top-24 bottom-24 left-0 right-0 opacity-5 bg-no-repeat bg-center bg-contain pointer-events-none z-0"
          style={{ backgroundImage: `url('/confessly-logo.png')` }}
        />

        {/* Header */}
        <header className="z-10 relative flex justify-between items-center px-6 py-4 bg-amber-700 text-white shadow">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/confessly-logo-horizontal.png" alt="Confessly Logo" className="h-10 w-auto" />
          </Link>
          <nav className="space-x-6 text-base">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/wall" className="hover:underline">Wall</Link>
            <Link href="/blessing" className="hover:underline">Blessing</Link>
            <Link href="/archive" className="hover:underline">Archive</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow z-10 relative">{children}</main>

        {/* Footer */}
        <DynamicFooter />

        {/* 🔥 Toast */}
        <Toaster position="bottom-center" toastOptions={{ duration: 2500 }} />
      </body>
    </html>
  );
}
