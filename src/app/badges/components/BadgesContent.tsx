'use client';
import React, { useState, useRef } from 'react';
import { Award, Heart, Droplets, Star, Shield, Zap, Lock, Download, Share2, Check, ArrowLeft, PartyPopper } from 'lucide-react';
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

  // Stable certificate ID derived from the name (so it doesn't change each render).
  const certId = `RS/IND/${new Date().getFullYear()}/${String((user?.name || 'donor').split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 7 % 100000).padStart(5, '0')}`;
  const issueDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/certificate/${encodeURIComponent(user?.name || 'donor')}`
    : '';

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

  const shareSocial = (platform: string) => {
    const text = encodeURIComponent(`I'm a proud Gold Tier Blood Donor on RaktSetu! I've helped save lives. Join me 🩸`);
    const url = encodeURIComponent(shareUrl);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(links[platform], '_blank', 'noopener,noreferrer');
  };

  // Download ONLY the certificate by opening a print window with just that node.
  const downloadCertificate = () => {
    const node = document.getElementById('rs-certificate');
    if (!node) return;
    const win = window.open('', '_blank', 'width=1100,height=750');
    if (!win) return;
    win.document.write(`
      <html><head><title>RaktSetu Certificate - ${user?.name || 'Donor'}</title>
      <style>
        @page { size: landscape; margin: 0; }
        body { margin: 0; font-family: Georgia, 'Times New Roman', serif; }
      </style>
      </head><body>${node.outerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div className="space-y-8">
      <Link href="/user-dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Congratulations banner with the donor's name */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white p-6 text-center relative overflow-hidden">
        <PartyPopper className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" size={48} />
        <PartyPopper className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 scale-x-[-1]" size={48} />
        <p className="text-sm font-bold uppercase tracking-widest opacity-90">Congratulations</p>
        <h1 className="text-3xl font-extrabold my-1">{user?.name || 'Donor'}! 🎉</h1>
        <p className="text-sm opacity-90">You've earned your Gold Tier Donor certificate. Thank you for saving lives.</p>
      </div>

      {/* Earned badges */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Earned ({earned.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {earned.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.id} className="card p-5 text-center hover:shadow-card-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${b.color} flex items-center justify-center mx-auto mb-3`}><Icon size={26} /></div>
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
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center"><Lock size={11} className="text-muted-foreground" /></span>
                </div>
                <h3 className="font-bold text-sm text-foreground">{b.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Elegant certificate */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Your Certificate</h2>
        <div id="rs-certificate" style={{ background: '#fffdf8', border: '10px solid #b8860b', padding: '40px', borderRadius: '8px', position: 'relative', fontFamily: 'Georgia, serif', color: '#3a2f1b' }}>
          <div style={{ border: '2px solid #d4af37', padding: '32px', borderRadius: '4px', textAlign: 'center' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px' }}>🩸</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#b22222' }}>RaktSetu</div>
                  <div style={{ fontSize: '10px', color: '#8a7a5c' }}>Be a Lifeline. Donate Blood.</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#8a7a5c' }}>
                <div>Certificate ID: {certId}</div>
                <div>Date: {issueDate}</div>
              </div>
            </div>

            <div style={{ fontSize: '34px', margin: '6px 0' }}>🏆</div>
            <h2 style={{ fontSize: '30px', letterSpacing: '2px', color: '#1e3a5f', margin: '6px 0', fontWeight: 'bold' }}>CERTIFICATE OF APPRECIATION</h2>
            <p style={{ fontSize: '12px', letterSpacing: '2px', color: '#8a7a5c', margin: '12px 0 4px' }}>THIS CERTIFIES THAT</p>
            <h1 style={{ fontSize: '40px', color: '#b22222', fontStyle: 'italic', margin: '8px 0', fontFamily: 'Georgia, serif' }}>{user?.name || 'Donor'}</h1>
            <p style={{ fontSize: '15px', color: '#3a2f1b', maxWidth: '520px', margin: '8px auto', lineHeight: 1.6 }}>
              is a recognized <strong style={{ color: '#b8860b' }}>Gold Tier Blood Donor</strong> on RaktSetu,
              having contributed to saving lives across India.
            </p>
            <p style={{ fontSize: '15px', fontStyle: 'italic', color: '#555', marginTop: '16px' }}>Your compassion strengthens communities.</p>
            <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#b22222', fontStyle: 'italic' }}>Thank You for Being a Lifeline.</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '28px', fontSize: '11px', color: '#8a7a5c' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px' }}>🥇</div>
                <div style={{ fontWeight: 'bold' }}>GOLD TIER DONOR</div>
              </div>
              <div>RaktSetu India • {new Date().getFullYear()}</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontStyle: 'italic', fontSize: '16px', color: '#3a2f1b', borderBottom: '1px solid #b8860b', paddingBottom: '2px', minWidth: '120px' }}>Team RaktSetu</div>
                <div>Grateful. Together. Saving Lives.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button onClick={downloadCertificate} className="btn-primary text-sm py-2.5 px-4">
            <Download size={16} /> Download / Print Certificate
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