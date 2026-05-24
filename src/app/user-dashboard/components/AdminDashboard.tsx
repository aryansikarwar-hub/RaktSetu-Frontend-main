'use client';
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Building2, Activity, Droplets, AlertTriangle,
  TrendingUp, CheckCircle2, Search, Heart,
} from 'lucide-react';
import BloodTypeBadge from '@/components/ui/BloodTypeBadge';
import { statsApi, emergencyApi, donorApi, hospitalApi } from '@/lib/api';
import type { AuthUser } from '@/context/AuthContext';

export default function AdminDashboard({ user }: { user: AuthUser }) {
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [tab, setTab] = useState<'requests' | 'donors' | 'hospitals'>('requests');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, em, dn, hp] = await Promise.all([
        statsApi.get().catch(() => ({ stats: {} })),
        emergencyApi.list({ status: 'open' }).catch(() => ({ emergencies: [] })),
        donorApi.search({}).catch(() => ({ donors: [] })),
        hospitalApi.list().catch(() => ({ hospitals: [] })),
      ]);
      setStats(s.stats);
      setRequests(em.emergencies || []);
      setDonors(dn.donors || []);
      setHospitals(hp.hospitals || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Network Administration</p>
            <h1 className="text-2xl font-bold text-foreground">Welcome, {user.name}</h1>
            <p className="text-muted-foreground text-sm">Overseeing the RaktSetu network</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-900 w-fit">
          <span className="w-2 h-2 rounded-full bg-green-500 live-dot" /> System healthy
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStat icon={<Users size={20} />} label="Registered Donors" value={stats?.registeredDonors} tone="primary" />
        <AdminStat icon={<Building2 size={20} />} label="Hospitals" value={stats?.hospitalsConnected} tone="accent" />
        <AdminStat icon={<Droplets size={20} />} label="Units Available" value={stats?.bloodUnitsAvailable} tone="blue" />
        <AdminStat icon={<AlertTriangle size={20} />} label="Open Emergencies" value={stats?.openEmergencies} tone="critical" />
      </div>

      {/* Lives saved highlight */}
      <div className="card gradient-card-red text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/25" />
        <div className="relative z-10 flex items-center gap-4">
          <Heart size={32} className="flex-shrink-0" />
          <div>
            <p className="text-3xl font-extrabold tabular-nums">{(stats?.livesSaved || 0).toLocaleString('en-IN')}</p>
            <p className="text-white/80 text-sm">estimated lives saved through the network</p>
          </div>
        </div>
      </div>

      {/* Management tabs */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-border">
          {[
            { id: 'requests' as const, label: 'Emergencies', icon: <Activity size={15} />, count: requests.length },
            { id: 'donors' as const, label: 'Donors', icon: <Users size={15} />, count: donors.length },
            { id: 'hospitals' as const, label: 'Hospitals', icon: <Building2 size={15} />, count: hospitals.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon} {t.label}
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="p-4 max-h-[480px] overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-muted/40 animate-pulse" />)}</div>
          ) : tab === 'requests' ? (
            <div className="space-y-2">
              {requests.map((r) => (
                <div key={r._id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <BloodTypeBadge type={r.bloodType} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.units}u · {r.hospital}, {r.city}</p>
                    <p className="text-xs text-muted-foreground">{r.triageLabel || r.urgency} · {r.respondersCount || 0} responding</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${r.urgency === 'critical' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>{r.urgency}</span>
                </div>
              ))}
            </div>
          ) : tab === 'donors' ? (
            <div className="grid sm:grid-cols-2 gap-2">
              {donors.map((d) => (
                <div key={d._id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <div className="w-9 h-9 rounded-full gradient-card-red flex items-center justify-center text-white font-bold text-sm">{d.name?.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.city} · {d.totalDonations || 0} donations</p>
                  </div>
                  <BloodTypeBadge type={d.bloodType} size="sm" />
                  {d.verified && <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {hospitals.map((h) => (
                <div key={h._id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Building2 size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.city} · {h.beds?.toLocaleString('en-IN')} beds</p>
                  </div>
                  {h.verified && <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle2 size={12} /> Verified</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminStat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: any; tone: string }) {
  const toneMap: Record<string, string> = {
    primary: 'text-primary bg-primary/10', accent: 'text-accent bg-accent/10',
    blue: 'text-blue-600 bg-blue-500/10', critical: 'text-red-600 bg-red-500/10',
  };
  return (
    <div className="card p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${toneMap[tone]}`}>{icon}</div>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value != null ? Number(value).toLocaleString('en-IN') : '—'}</p>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
