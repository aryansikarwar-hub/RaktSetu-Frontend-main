'use client';
import React, { useState } from 'react';
import { X, Phone, MessageCircle, Copy, Check, User } from 'lucide-react';

interface CallModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  phone: string;
  subtitle?: string;
}

/**
 * CallModal — a popup that gives the user real ways to reach a contact:
 *  - Call Now (opens the phone dialer on mobile)
 *  - WhatsApp (opens a chat with a prefilled message)
 *  - Copy Number (handy on laptops where tel: links do nothing)
 *
 * This replaces the old bare `tel:` link which did nothing on desktop.
 */
export default function CallModal({ open, onClose, name, phone, subtitle }: CallModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  // Clean the phone number for tel:/wa.me (keep digits and a leading +).
  const cleanPhone = (phone || '').replace(/[^\d+]/g, '');
  const waNumber = cleanPhone.replace(/^\+/, '');
  const waText = encodeURIComponent(`Hello ${name}, I'm reaching out via RaktSetu regarding a blood requirement.`);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card rounded-3xl shadow-card-lg border border-border overflow-hidden fade-in-up">
        <div className="gradient-card-red px-6 py-5 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors" aria-label="Close">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">{name || 'Contact'}</h3>
              {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Phone Number</p>
            <p className="text-2xl font-bold text-foreground tabular-nums tracking-wide">{phone || 'Not available'}</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-accent active:scale-95 transition-all duration-150"
            >
              <Phone size={18} /> Call Now
            </a>

            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all duration-150"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>

            <button
              onClick={copyNumber}
              className="inline-flex items-center justify-center gap-2 bg-muted text-foreground font-semibold px-5 py-3 rounded-xl hover:bg-muted/70 active:scale-95 transition-all duration-150 border border-border"
            >
              {copied ? <><Check size={18} className="text-green-500" /> Copied!</> : <><Copy size={18} /> Copy Number</>}
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            Please be respectful. Only call regarding genuine blood requirements.
          </p>
        </div>
      </div>
    </div>
  );
}