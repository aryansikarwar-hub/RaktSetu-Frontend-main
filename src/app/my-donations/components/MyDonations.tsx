'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Droplet, CalendarClock, CheckCircle2, Clock, Heart, Trophy, MapPin,
  Building2, ArrowRight, Download, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { donationEligibility, DONATION_INTERVAL_DAYS } from '@/lib/bloodClient';
import { donationApi } from '@/lib/api';

interface DonationRecord {
  id: string;
  date: string;          // ISO date
  hospital: string;
  city: string;
  bloodType: string;
  units: number;
  donationType: string;
  pointsAwarded: number;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const daysAgo = (iso: string) =>
  Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));

export default function MyDonations() {
  const { user } = useAuth();
  const [records, setRecords] = useState<DonationRecord[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await donationApi.myHistory(user || undefined);
        if (active) setRecords(res.donations || []);
      } catch {
        if (active) setRecords([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user]);

  // Next-eligible countdown, computed the same way the backend does.
  const elig = useMemo(() => donationEligibility(user?.lastDonation), [user?.lastDonation]);
  const totalDonations = user?.totalDonations ?? records?.length ?? 0;
  const livesImpacted = totalDonations * 3; // 1 donation ≈ up to 3 lives
  const points = user?.points ?? 0;

  const nextEligibleDate = useMemo(() => {
    if (!user?.lastDonation) return null;
    const d = new Date(user.lastDonation);
    d.setDate(d.getDate() + DONATION_INTERVAL_DAYS);
    return d;
  }, [user?.lastDonation]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
          <Droplet size={13} /> Your Impact
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">My Donations</h1>
        <p className="text-muted-foreground mt-1">
          Every drop you’ve given and when you can give again.
        </p>
      </div>

      {/* Eligibility / countdown banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-card-red text-white p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 border-2 border-white/30">
              {elig.eligible ? <CheckCircle2 size={32} /> : <Clock size={32} />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-0.5">
                {elig.eligible ? 'You can donate now' : 'Next donation in'}
              </p>
              {elig.eligible ? (
                <h2 className="text-2xl font-extrabold leading-tight">You’re eligible today 🎉</h2>
              ) : (
                <h2 className="text-2xl font-extrabold leading-tight">
                  {elig.daysRemaining} {elig.daysRemaining === 1 ? 'day' : 'days'} to go
                </h2>
              )}
              <p className="text-sm text-white/80 mt-1">
                {nextEligibleDate
                  ? `Eligible from ${fmtDate(nextEligibleDate.toISOString())}`
                  : 'No donations recorded yet — your first one can be today.'}
              </p>
            </div>
          </div>
          {elig.eligible ? (
            <Link href="/emergency-page" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-primary font-bold text-sm hover:bg-white/90 transition-colors whitespace-nowrap">
              <Heart size={16} /> See who needs blood <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="text-right">
              <p className="text-3xl font-extrabold">{elig.daysRemaining}</p>
              <p className="text-xs text-white/70">days remaining</p>
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Droplet size={20} />} label="Total Donations" value={totalDonations} />
        <StatCard icon={<Heart size={20} />} label="Lives Impacted" value={`~${livesImpacted}`} />
        <StatCard icon={<Trophy size={20} />} label="Reward Points" value={points} />
        <StatCard
          icon={<Droplet size={20} />}
          label="Your Blood Type"
          value={user?.bloodType || '—'}
        />
      </div>

      {/* History */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CalendarClock size={18} className="text-primary" /> Donation History
          </h3>
          <Link href="/badges" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <Download size={13} /> Certificate
          </Link>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : records && records.length > 0 ? (
          <ul className="divide-y divide-border">
            {records.map((r) => (
              <li key={r.id} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/40 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                  {r.bloodType}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate flex items-center gap-1.5">
                    <Building2 size={13} className="text-muted-foreground" /> {r.hospital}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {r.city}</span>
                    <span>·</span>
                    <span>{r.donationType}</span>
                    <span>·</span>
                    <span>{r.units} unit{r.units > 1 ? 's' : ''}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">{fmtDate(r.date)}</p>
                  <p className="text-xs text-muted-foreground">{daysAgo(r.date)} days ago</p>
                </div>
                {r.pointsAwarded > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full flex-shrink-0">
                    <Sparkles size={11} /> +{r.pointsAwarded}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
              <Droplet size={26} />
            </div>
            <p className="font-semibold text-foreground">No donations yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Your donation history will appear here once you make your first donation.
            </p>
            <Link href="/emergency-page" className="btn-primary inline-flex text-sm">
              <Heart size={15} /> Find a place to donate
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-foreground leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}