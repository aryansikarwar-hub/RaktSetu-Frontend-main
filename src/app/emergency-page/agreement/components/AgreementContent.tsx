'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2, User, Droplet, MapPin, Clock, AlertTriangle, ShieldCheck,
  Loader2, CheckCircle2, ArrowLeft, FileText, Phone, Heart, Hospital,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { emergencyApi } from '@/lib/api';

function refCode(id: string) {
  // Short human-friendly reference for the signed commitment.
  const tail = (id || '').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '0000';
  return `RS-${new Date().getFullYear()}-${tail}`;
}

export default function AgreementContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id') || '';
  const { user } = useAuth();

  const [emergency, setEmergency] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!id) { setError('No request selected.'); setLoading(false); return; }
    let active = true;
    (async () => {
      try {
        const res = await emergencyApi.get(id);
        if (active) setEmergency(res.emergency);
      } catch {
        if (active) setError('This request could not be found. It may have been fulfilled.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const reference = useMemo(() => refCode(id), [id]);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const canConfirm = agreed && signature.trim().length >= 3 && !submitting;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setSubmitting(true);
    try {
      await emergencyApi.respond(id);
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Could not record your commitment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="card p-12 flex justify-center"><Loader2 className="animate-spin text-primary" size={28} /></div>;
  }

  if (error && !emergency) {
    return (
      <div className="card p-10 text-center">
        <AlertTriangle size={36} className="mx-auto mb-3 text-amber-500" />
        <p className="font-semibold text-foreground">{error}</p>
        <Link href="/emergency-page" className="btn-primary inline-flex mt-5 text-sm">
          <ArrowLeft size={15} /> Back to Emergencies
        </Link>
      </div>
    );
  }

  // ── Success state ──
  if (done) {
    return (
      <div className="card overflow-hidden">
        <div className="gradient-card-red text-white p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
            <CheckCircle2 size={34} />
          </div>
          <h1 className="text-2xl font-extrabold">Commitment Confirmed</h1>
          <p className="text-white/85 mt-2">Thank you, {user?.name?.split(' ')[0]}. You may save a life today. 🩸</p>
        </div>
        <div className="p-6 md:p-8 space-y-4">
          <div className="rounded-2xl border border-border p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Reference number</p>
              <p className="font-bold text-foreground tracking-wide">{reference}</p>
            </div>
            <span className="badge-available"><ShieldCheck size={12} /> Recorded</span>
          </div>
          <div className="bg-muted/40 rounded-2xl p-4 text-sm text-foreground/80 space-y-2">
            <p className="font-semibold text-foreground">What happens next</p>
            <p>1. <span className="text-foreground">{emergency.hospital}</span> has been notified that you are responding.</p>
            <p>2. The hospital&apos;s coordinator may call you on your registered number to confirm timing.</p>
            <p>3. Please carry a valid photo ID and reach the hospital&apos;s blood bank as discussed.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${emergency.contactPhone}`} className="btn-primary text-sm">
              <Phone size={15} /> Call {emergency.contactName}
            </a>
            <Link href="/emergency-page" className="btn-secondary text-sm">
              <ArrowLeft size={15} /> Back to Emergencies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Agreement document ──
  return (
    <div className="space-y-4">
      <Link href="/emergency-page" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={15} /> Back to live feed
      </Link>

      <div className="card overflow-hidden">
        {/* Document header */}
        <div className="border-b border-border px-6 md:px-8 py-6 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl gradient-card-red flex items-center justify-center text-white flex-shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground leading-tight">Blood Donation Commitment</h1>
              <p className="text-xs text-muted-foreground">Voluntary pledge between donor and hospital</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Reference</p>
            <p className="font-bold text-foreground text-sm tracking-wide">{reference}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{today}</p>
          </div>
        </div>

        {/* Urgency banner */}
        <div className="px-6 md:px-8 pt-5">
          <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
            <AlertTriangle size={16} className="text-primary flex-shrink-0" />
            <p className="text-sm text-foreground/80">
              This is a <span className="font-semibold text-primary capitalize">{emergency.urgency}</span> request.
              By confirming, you pledge to respond as soon as you can.
            </p>
          </div>
        </div>

        {/* Two parties */}
        <div className="px-6 md:px-8 py-6 grid sm:grid-cols-2 gap-4">
          <PartyCard
            role="Requesting Hospital"
            icon={<Hospital size={18} />}
            name={emergency.hospital}
            lines={[
              { icon: <MapPin size={12} />, text: `${emergency.ward ? emergency.ward + ', ' : ''}${emergency.city}` },
              { icon: <User size={12} />, text: `Contact: ${emergency.contactName}` },
              { icon: <Phone size={12} />, text: emergency.contactPhone },
            ]}
          />
          <PartyCard
            role="Committing Donor"
            icon={<User size={18} />}
            name={user?.name || 'Donor'}
            lines={[
              { icon: <Droplet size={12} />, text: `Blood type: ${user?.bloodType || '—'}` },
              { icon: <MapPin size={12} />, text: user?.city || '—' },
              { icon: <Phone size={12} />, text: user?.phone || 'On registered number' },
            ]}
          />
        </div>

        {/* Request details */}
        <div className="px-6 md:px-8 pb-2">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest mb-3">Request Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Detail label="Blood Type" value={emergency.bloodType} />
            <Detail label="Units Needed" value={`${emergency.units}`} />
            <Detail label="Urgency" value={emergency.urgency} capitalize />
            <Detail label="Responders" value={`${emergency.respondersCount || 0}`} />
          </div>
          {emergency.reason && (
            <p className="mt-3 text-sm text-foreground/75 bg-muted/40 rounded-xl p-3">
              <span className="font-semibold text-foreground">Reason: </span>{emergency.reason}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="px-6 md:px-8 py-6">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest mb-3">Donor Commitment Terms</h2>
          <ul className="space-y-2.5 text-sm text-foreground/80">
            {[
              'I am voluntarily committing to donate blood for this request, with no payment given or received.',
              'I confirm I meet the basic eligibility criteria and have answered screening questions truthfully.',
              'I understand the hospital will perform mandatory medical screening before any donation.',
              'I will make a genuine effort to reach the hospital, and will inform the contact promptly if I am unable to.',
              'I consent to RaktSetu sharing my name and contact number with the requesting hospital for this request only.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Signature + confirm */}
        <div className="border-t border-border bg-muted/20 px-6 md:px-8 py-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">
              Type your full name to sign
            </label>
            <input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder={user?.name || 'Your full name'}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {signature.trim() && (
              <p className="mt-2 text-2xl text-primary" style={{ fontFamily: 'cursive' }}>{signature}</p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-border text-primary focus:ring-primary/30 flex-shrink-0"
            />
            <span className="text-sm text-foreground/80">
              I have read and agree to the commitment terms above, and I confirm the information is accurate.
            </span>
          </label>

          {error && <p className="text-sm text-primary">{error}</p>}

          <div className="flex flex-wrap gap-3 pt-1">
            <button onClick={handleConfirm} disabled={!canConfirm} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Recording…</> : <><Heart size={16} /> Confirm Commitment</>}
            </button>
            <Link href="/emergency-page" className="btn-secondary">Cancel</Link>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck size={13} /> This is a voluntary pledge, not a legal contract. RaktSetu never buys or sells blood.
          </p>
        </div>
      </div>
    </div>
  );
}

function PartyCard({ role, icon, name, lines }: {
  role: string; icon: React.ReactNode; name: string;
  lines: { icon: React.ReactNode; text: string }[];
}) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{role}</span>
      </div>
      <p className="font-bold text-foreground">{name}</p>
      <div className="mt-2 space-y-1">
        {lines.map((l, i) => (
          <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">{l.icon} {l.text}</p>
        ))}
      </div>
    </div>
  );
}

function Detail({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className={`font-bold text-foreground mt-0.5 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}