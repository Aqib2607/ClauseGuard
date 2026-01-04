'use client';

import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-400" />
            <span className="font-bold text-white">ClauseGuard</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ClauseGuard. AI-powered contract protection for freelancers.
          </p>
        </div>
      </div>
    </footer>
  );
}
