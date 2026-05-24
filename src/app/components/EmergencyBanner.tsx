'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

export default function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <section className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-8">
      <div className="relative overflow-hidden rounded-3xl gradient-card-red emergency-pulse p-8 md:p-12 text-white shadow-red-glow">
        {/* dark overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
        {/* Background rings */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-20 hidden md:block">
          <div className="absolute w-48 h-48 rounded-full border-2 border-white pulse-ring" style={{ transitionDelay: '0ms' }} />
          <div className="absolute w-32 h-32 rounded-full border-2 border-white top-8 left-8 pulse-ring" style={{ transitionDelay: '0.5s' }} />
          <div className="w-16 h-16 rounded-full bg-white/20 relative z-10 top-16 left-16 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="Dismiss banner"
        >
          <X size={16} />
        </button>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Emergency Alert Active</span>
            <span className="w-2 h-2 rounded-full bg-yellow-300 live-dot" />
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight">
            3 Critical Blood Requests Need You Right Now
          </h2>
          <p className="text-white/80 text-base mb-6 leading-relaxed">
            O- blood critically low at AIIMS Delhi, B- shortage at Fortis Mumbai. If you&apos;re eligible to donate, your response in the next 2 hours can directly save a life.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/emergency-page"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-white/90 active:scale-95 transition-all duration-150"
            >
              View Emergencies
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/emergency-page"
              className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 active:scale-95 transition-all duration-150 border border-white/30"
            >
              Submit New Request
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}