import React from 'react';
import { AlertTriangle, Plus, Phone } from 'lucide-react';

interface EmergencyHeaderProps {
  // Both props are optional so this component never breaks, regardless of
  // which caller renders it.
  onOpenForm?: () => void;
  // When false (donor / public), the "Post Emergency" button is hidden and the
  // copy changes to a "respond to emergencies" framing.
  canPost?: boolean;
}

export default function EmergencyHeader({ onOpenForm, canPost = false }: EmergencyHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#16171b] text-white p-6 md:p-8">
      {/* Pulsing rings decoration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-primary/60 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
            <AlertTriangle size={20} className="text-primary" />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-primary live-dot" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Emergency Network — Live</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight">
          Blood Emergency Response Network
        </h1>
        <p className="text-white/70 text-sm leading-relaxed mb-6">
          {canPost
            ? 'Post critical blood requests and connect with verified donors across India. Average response time: 18 minutes. All emergencies are monitored by hospital coordinators.'
            : 'See active blood emergencies near you and respond to save a life. Average response time: 18 minutes. New requests are posted by verified hospitals in real time.'}
        </p>
        <div className="flex flex-wrap gap-3">
          {canPost && (
            <button
              onClick={onOpenForm}
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-accent active:scale-95 transition-all duration-150"
            >
              <Plus size={16} />
              Post Emergency Request
            </button>
          )}
          <a
            href="tel:1800543266"
            className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/20 active:scale-95 transition-all duration-150 border border-white/20"
          >
            <Phone size={16} />
            1800-RAKTSETU
          </a>
        </div>
      </div>
    </div>
  );
}