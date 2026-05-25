'use client';
import React, { useState } from 'react';
import { Award, Heart, Droplets, Star, Shield, Zap, Lock, Download, Share2, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const BADGES = [
  { id: 'first', icon: Heart, name: 'First Drop', desc: 'Completed your first donation', earned: true, color: 'text-red-500 bg-red-500/10' },
  { id: 'gold', icon: Award, name: 'Gold Donor', desc: 'Donated 5+ times', earned: true, color: 'text-yellow-500 bg-yellow-500/10' },
  { id: 'lifesaver', icon: Shield, name: 'Lifesaver', desc: 'Responded to an emergency', earned: true, color: 'text-blue-500 bg-blue-500/10' },
  { id: 'regular', icon: Droplets, name: 'Regular Hero', desc: 'Donated 3 times in a year', earned: true, color: 'text-purple-500 bg-purple-500/10' },
  { id: 'rapid', icon: Zap, name: 'Rapid Responder', desc: 'Responded within 1 hour', earned: false, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'platinum', icon: Star, name: 'Platinum Donor', desc: 'Donate 10+ times', earned: false, color: 'text-cyan-500 bg-cyan-500/10' },
];

export default function BadgesContent() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const earned = BADGES.filter((b) => b.earned);
  const locked = BADGES.filter((b) => !b.earned);

  // A simple public certificate URL others can open. In a real deployment this
  // would point to a server-rendered certificate page.
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/certificate/${encodeURIComponent(user?.name || 'donor')}`
    : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  const shareSocial = (platform: string) => {
    const text = encodeURIComponent(`I'm a proud blood donor on RaktSetu! I've helped save lives. Join me 🩸`);
    const url = encodeURIComponent(shareUrl);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(links[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <Link href="/user-dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-foreground mb-1">Badges & Certificate</h1>
        <p className="text-sm text-muted-foreground">Your donor achievements and a certificate you can share.</p>
      </div>

      {/* Earned badges */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Earned ({earned.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {earned.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.id} className="card p-5 text-center hover:shadow-card-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${b.color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-sm text-foreground">{b.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locked badges */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Locked ({locked.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {locked.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.id} className="card p-5 text-center opacity-60">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 relative">
                  <Icon size={26} className="text-muted-foreground" />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center">
                    <Lock size={11} className="text-muted-foreground" />
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foreground">{b.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shareable certificate */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Your Certificate</h2>
        <div className="rounded-3xl border-4 border-primary/30 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-card p-8 text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 opacity-10"><Droplets size={64} className="text-primary" /></div>
          <div className="absolute bottom-4 right-4 opacity-10"><Droplets size={64} className="text-primary" /></div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-2">Certificate of Appreciation</p>
            <Award size={40} className="mx-auto text-yellow-500 mb-3" />
            <p className="text-sm text-muted-foreground">This certifies that</p>
            <h3 className="text-3xl font-extrabold text-foreground my-2">{user?.name || 'Donor'}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              is a recognized <span className="font-bold text-primary">Gold Tier Blood Donor</span> on RaktSetu,
              having contributed to saving lives across India.
            </p>
            <p className="text-xs text-muted-foreground mt-4">RaktSetu India · {new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Share actions */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button onClick={() => window.print()} className="btn-primary text-sm py-2.5 px-4">
            <Download size={16} /> Download / Print
          </button>
          <button onClick={copyLink} className="btn-secondary text-sm py-2.5 px-4">
            {copied ? <><Check size={16} className="text-green-500" /> Copied!</> : <><Share2 size={16} /> Copy Share Link</>}
          </button>
          <button onClick={() => shareSocial('whatsapp')} className="text-sm py-2.5 px-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">WhatsApp</button>
          <button onClick={() => shareSocial('twitter')} className="text-sm py-2.5 px-4 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors">Twitter / X</button>
          <button onClick={() => shareSocial('linkedin')} className="text-sm py-2.5 px-4 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors">LinkedIn</button>
          <button onClick={() => shareSocial('facebook')} className="text-sm py-2.5 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">Facebook</button>
        </div>
      </div>
    </div>
  );
}