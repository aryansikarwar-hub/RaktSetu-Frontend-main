'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2, Droplets, AlertTriangle, TrendingUp, Plus, Activity,
  Package, Users, ArrowRight, CheckCircle2, Clock,
} from 'lucide-react';
import BloodTypeBadge from '@/components/ui/BloodTypeBadge';
import { hospitalApi, emergencyApi, aiApi } from '@/lib/api';
import type { AuthUser } from '@/context/AuthContext';

export default function HospitalDashboard({ user }: { user: AuthUser }) {
  const [inventory, setInventory] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editableInventory, setEditableInventory] = useState<any[] | null>(null);
  const [savingInv, setSavingInv] = useState(false);

  useEffect(() => {
    (async () => {
      const [inv, em, fc] = await Promise.all([
        hospitalApi.aggregateInventory(user.city).catch(() => ({ inventory: [] })),
        emergencyApi.list({ status: 'open' }).catch(() => ({ emergencies: [] })),
        aiApi.forecast(user.city).catch(() => null),
      ]);
      setInventory(inv.inventory || []);
      setRequests((em.emergencies || []).filter((e: any) => e.city === user.city || true).slice(0, 5));
      setForecast(fc);
      setLoading(false);
    })();
  }, [user.city]);

  const totalUnits = inventory.reduce((s, i) => s + i.units, 0);
  const criticalCount = inventory.filter((i) => i.status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card gradient-card-red text-white p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/25" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Building2 size={28} />
            </div>
            <div>
              <p className="text-white/80 text-sm">Hospital Dashboard</p>
              <h1 className="text-2xl font-bold">{user.hospitalName || user.name}</h1>
              <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                {user.city} {user.verified && <span className="inline-flex items-center gap-1 ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full"><CheckCircle2 size={11} /> Verified</span>}
              </p>
            </div>
          </div>
          <Link href="/emergency-page" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-5 py-3 rounded-xl hover:bg-white/90 transition-all whitespace-nowrap">
            <Plus size={18} /> Post Blood Request
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package size={20} />} label="Total Units in Stock" value={totalUnits} tone="primary" />
        <StatCard icon={<AlertTriangle size={20} />} label="Critical Types" value={criticalCount} tone="critical" />
        <StatCard icon={<Activity size={20} />} label="Open Requests" value={requests.length} tone="accent" />
        <StatCard icon={<Users size={20} />} label="City" value={user.city} tone="muted" isText />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inventory */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-primary" />
              <h3 className="font-bold text-foreground">Blood Inventory — {user.city}</h3>
            </div>
            <Link href="/forecast" className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-1.5 transition-all">
              View forecast <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <SkeletonGrid />
          ) : inventory.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No inventory data for {user.city} yet.</p>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {inventory.map((i) => {
                const tone = i.status === 'critical' ? 'border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30'
                  : i.status === 'low' ? 'border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30'
                  : 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30';
                const txt = i.status === 'critical' ? 'text-red-600 dark:text-red-400' : i.status === 'low' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400';
                return (
                  <div key={i.bloodType} className={`rounded-2xl border p-4 text-center ${tone}`}>
                    <BloodTypeBadge type={i.bloodType} size="sm" />
                    <p className={`text-2xl font-bold tabular-nums mt-2 ${txt}`}>{i.units}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">units · {i.status}</p>
                  </div>
                );
              })}
            </div>

              <div className="mt-4 flex items-center gap-2">
                {!editing ? (
                  <button onClick={async () => {
                    // prepare editable inventory: find hospital id by name and load current inventory
                    try {
                      const list = await hospitalApi.list(user.city);
                      const match = list.hospitals.find((h:any) => h.name === (user.hospitalName || '')) || list.hospitals[0];
                      setEditableInventory(match ? (match.inventory || []) : inventory.map((i:any)=>({ bloodType: i.bloodType, units: i.units })));
                      setEditing(true);
                    } catch {
                      setEditableInventory(inventory.map((i:any)=>({ bloodType: i.bloodType, units: i.units })));
                      setEditing(true);
                    }
                  }} className="btn-primary px-3 py-2 text-sm">Edit Inventory</button>
                ) : (
                  <>
                    <button onClick={() => { setEditing(false); setEditableInventory(null); }} className="px-3 py-2 rounded-lg">Cancel</button>
                    <button onClick={async () => {
                      if (!editableInventory) return;
                      setSavingInv(true);
                      try {
                        const list = await hospitalApi.list(user.city);
                        const match = list.hospitals.find((h:any) => h.name === (user.hospitalName || '')) || list.hospitals[0];
                        const hid = match ? match._id : undefined;
                        if (!hid) throw new Error('Hospital not found to update');
                        await hospitalApi.updateInventory(hid, editableInventory.map((x:any)=>({ bloodType: x.bloodType, units: Number(x.units) })));
                        // refresh
                        const inv = await hospitalApi.aggregateInventory(user.city);
                        setInventory(inv.inventory || []);
                        setEditing(false);
                        setEditableInventory(null);
                      } catch (err) {
                        // eslint-disable-next-line no-alert
                        alert('Failed to save inventory');
                      } finally { setSavingInv(false); }
                    }} className="btn-primary px-3 py-2 text-sm">{savingInv ? 'Saving...' : 'Save Inventory'}</button>
                  </>
                )}
              </div>

              {editing && editableInventory && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {editableInventory.map((it:any, idx:number) => (
                    <div key={it.bloodType} className="rounded-2xl border p-3 text-center">
                      <div className="font-mono font-bold mb-2">{it.bloodType}</div>
                      <input type="number" value={it.units} onChange={(e)=>{
                        const v = Number(e.target.value);
                        setEditableInventory((s:any)=>{ const copy = [...s]; copy[idx] = { ...copy[idx], units: isNaN(v)?0:v }; return copy; });
                      }} className="w-full px-2 py-1 rounded-md text-center" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Forecast alerts */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-accent" />
            <h3 className="font-bold text-foreground">AI Supply Alerts</h3>
          </div>
          {forecast?.criticalTypes?.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Types heading critical this week:</p>
              {forecast.forecast.filter((f: any) => f.risk !== 'stable').slice(0, 5).map((f: any) => (
                <div key={f.bloodType} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <BloodTypeBadge type={f.bloodType} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold capitalize" style={{ color: f.risk === 'critical' ? '#dc2626' : '#f59e0b' }}>{f.risk} · {f.daysOfSupply}d supply</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{f.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 size={32} className="mx-auto text-green-500 mb-2 opacity-70" />
              <p className="text-sm text-muted-foreground">Supply looks healthy. No critical alerts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent requests */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-primary" />
          <h3 className="font-bold text-foreground">Recent Emergency Requests</h3>
        </div>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No open requests right now.</p>
        ) : (
          <div className="space-y-2">
            {requests.map((r) => (
              <div key={r._id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors">
                <BloodTypeBadge type={r.bloodType} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{r.units} units · {r.hospital}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={11} /> {r.triageLabel || r.urgency}</p>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Users size={12} /> {r.respondersCount || 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, tone, isText }: { icon: React.ReactNode; label: string; value: any; tone: string; isText?: boolean }) {
  const toneMap: Record<string, string> = {
    primary: 'text-primary bg-primary/10', critical: 'text-red-600 bg-red-500/10',
    accent: 'text-accent bg-accent/10', muted: 'text-muted-foreground bg-muted',
  };
  return (
    <div className="card p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${toneMap[tone]}`}>{icon}</div>
      <p className={`font-bold text-foreground ${isText ? 'text-lg' : 'text-2xl tabular-nums'}`}>{value}</p>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border p-4 h-24 bg-muted/40 animate-pulse" />
      ))}
    </div>
  );
}
