'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
  isSubmitting?: boolean;
}

export default function EmailCapture({ onSubmit, isSubmitting }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onSubmit(email);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">Thank you!</h3>
            <p className="text-sm text-green-700">We&apos;ll keep you updated on new features.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Stay Updated</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Get notified about new features and pro plan benefits
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
