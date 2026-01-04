'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">ClauseGuard</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              How It Works
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
