'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, MapPin, Clock, Phone, ChevronDown, ChevronUp, Droplets,
  Brain, Loader2, CheckCircle2, XCircle, RefreshCw, Filter,
} from 'lucide-react';
import BloodTypeBadge from '@/components/ui/BloodTypeBadge';
import CallModal from '@/components/CallModal';
import { emergencyApi } from '@/lib/api';

const urgencyMeta: Record<string, { ring: string; label: string; dot: string }> = {
  critical: { ring: 'border-l-red-500', label: 'badge-critical', dot: 'bg-red-500' },
  urgent: { ring: 'border-l-amber-500', label: 'badge-low', dot: 'bg-amber-500' },
  moderate: { ring: 'border-l-blue-500', label: 'badge-available', dot: 'bg-blue-500' },
};

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}

export default function ActiveEmergenciesFeed() {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await emergencyApi.list({ status: 'open' });
    setEmergencies(res.emergencies || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const cities = ['All', ...Array.from(new Set(emergencies.map((e) => e.city)))];
  const filtered = cityFilter === 'All' ? emergencies : emergencies.filter((e) => e.city === cityFilter);

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <h3 className="font-bold text-foreground">Live Emergency Feed</h3>
          <span className="text-xs text-muted-foreground">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select className="text-sm pl-8 pr-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={load} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted" aria-label="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCircle2 size={36} className="mx-auto mb-3 text-green-500 opacity-60" />
          <p>No active emergencies right now.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filtered.slice(0, visibleCount).map((e) => <EmergencyItem key={e._id} emergency={e} />)}
          {visibleCount < filtered.length && (
            <div className="flex justify-center py-4">
              <button onClick={() => setVisibleCount((c) => c + 8)} className="btn-secondary px-6 py-2.5 text-sm">
                Show more ({filtered.length - visibleCount} left)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmergencyItem({ emergency: e }: { emergency: any }) {
  const [expanded, setExpanded] = useState(false);
  const [matches, setMatches] = useState<any>(null);
  const [matching, setMatching] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [callDonor, setCallDonor] = useState<{ name: string; phone: string } | null>(null);
  const meta = urgencyMeta[e.urgency] || urgencyMeta.moderate;

  const runMatch = async () => {
    setMatching(true);
    const res = await emergencyApi.matches(e._id);
    setMatches(res);
    setMatching(false);
  };

  return (
    <div className={`border-l-4 ${meta.ring} px-5 py-4 hover:bg-muted/30 transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <BloodTypeBadge type={e.bloodType} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={meta.label}><AlertTriangle size={11} /> {e.urgency}</span>
              {e.triageLabel && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70 border border-border">
                  {e.triageLabel}
                </span>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={11} /> {timeAgo(e.createdAt)}</span>
            </div>
            <p className="font-semibold text-foreground mt-1.5 truncate">{e.units} units · {e.hospital}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin size={11} /> {e.ward ? `${e.ward}, ` : ''}{e.city}
            </p>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-1 text-muted-foreground hover:text-foreground flex-shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pl-1 space-y-3 fade-in-up">
          {e.reason && <p className="text-sm text-foreground/80 bg-muted/50 rounded-xl p-3">{e.reason}</p>}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {e.patientAge && <span>Patient: {e.patientAge}y {e.patientGender}</span>}
            <span className="flex items-center gap-1"><Droplets size={12} /> {e.respondersCount || 0} responding</span>
          </div>

          {e.triageReasons?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {e.triageReasons.map((r: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/80">{r}</span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setCallDonor(null); setCallOpen(true); }} className="btn-primary text-sm py-2 px-4">
              <Phone size={14} /> Call {e.contactName}
            </button>
            <button onClick={runMatch} disabled={matching} className="btn-secondary text-sm py-2 px-4">
              {matching ? <><Loader2 size={14} className="animate-spin" /> Matching…</> : <><Brain size={14} /> AI Match Donors</>}
            </button>
          </div>

          <CallModal
            open={callOpen}
            onClose={() => { setCallOpen(false); setCallDonor(null); }}
            name={callDonor ? callDonor.name : e.contactName}
            phone={callDonor ? callDonor.phone : e.contactPhone}
            subtitle={callDonor ? 'Matched donor' : `${e.hospital} · ${e.city}`}
          />

          {matches && (
            <div className="mt-2 rounded-xl border border-border overflow-hidden">
              <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Brain size={12} className="text-accent" /> Top matches · {matches.totalCompatible} compatible
              </div>
              <div className="divide-y divide-border">
                {matches.matches.slice(0, 5).map((m: any, i: number) => (
                  <div key={m.donorId} className="px-3 py-2 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">#{i + 1}</span>
                    <span className={`text-sm font-bold w-8 ${m.score >= 80 ? 'text-green-600' : m.score >= 60 ? 'text-amber-600' : 'text-muted-foreground'}`}>{m.score}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{m.reasons.slice(0, 2).join(' · ')}</p>
                    </div>
                    <BloodTypeBadge type={m.bloodType} size="sm" />
                    {m.eligible ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-amber-500" />}
                    {m.phone && (
                      <button
                        onClick={() => { setCallDonor({ name: m.name, phone: m.phone }); setCallOpen(true); }}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                        aria-label={`Call ${m.name}`}
                      >
                        <Phone size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}