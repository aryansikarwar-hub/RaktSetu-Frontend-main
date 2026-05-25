'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, GitCompareArrows, Brain, MapPin, Loader2, Droplet, CheckCircle2,
  XCircle, Phone, Award, Clock, ArrowRight, Zap, ChevronDown, ChevronUp, Shield, Activity,
} from 'lucide-react';
import BloodTypeBadge from '@/components/ui/BloodTypeBadge';
import CitySelect from '@/components/ui/CitySelect';
import CallModal from '@/components/CallModal';
import { donorApi, aiApi } from '@/lib/api';

const BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const TABS = [
  { id: 'search', label: 'Donor Search', icon: <Search size={16} /> },
  { id: 'compat', label: 'Compatibility', icon: <GitCompareArrows size={16} /> },
  { id: 'match', label: 'AI Match', icon: <Brain size={16} /> },
];

export default function FindBlood() {
  const [tab, setTab] = useState('search');

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <div className="text-center mb-8">
        <span className="eyebrow">Find blood, fast</span>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-4">Locate donors & check compatibility</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Search verified donors, understand who can give to whom, and let the AI engine rank the best matches near you.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-2xl bg-muted border border-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-card text-primary shadow-card' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'search' && <DonorSearch />}
      {tab === 'compat' && <CompatibilityChecker />}
      {tab === 'match' && <AIMatch />}
    </div>
  );
}

/* ─────────────────────── Donor Search ─────────────────────── */
function DonorSearch() {
  const [bloodType, setBloodType] = useState('');
  const [city, setCity] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const search = useCallback(async () => {
    setLoading(true);
    setVisibleCount(12);
    const params: any = {};
    if (bloodType) params.bloodType = bloodType;
    if (city !== 'All') params.city = city;
    if (onlyAvailable) params.available = true;
    const res = await donorApi.search(params);
    setDonors(res.donors || []);
    setLoading(false);
  }, [bloodType, city, onlyAvailable]);

  useEffect(() => { search(); }, [search]);

  return (
    <div>
      <div className="card p-5 mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Blood Type</label>
            <select className="input-field" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
              <option value="">Any type</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">City</label>
            <CitySelect value={city === 'All' ? '' : city} onChange={(c) => setCity(c || 'All')} includeAll allLabel="All Cities" placeholder="All Cities" />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                onlyAvailable ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
              }`}
            >
              <CheckCircle2 size={16} /> Available only
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : donors.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search size={40} className="mx-auto mb-3 opacity-40" />
          <p>No donors found. Try widening your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{donors.length} donor{donors.length !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.slice(0, visibleCount).map((d) => <DonorCard key={d._id} donor={d} />)}
          </div>
          {visibleCount < donors.length && (
            <div className="flex justify-center mt-6">
              <button onClick={() => setVisibleCount((c) => c + 12)} className="btn-secondary px-6 py-2.5">
                Show more ({donors.length - visibleCount} left)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DonorCard({ donor }: { donor: any }) {
  const [expanded, setExpanded] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const tierColor: Record<string, string> = {
    Platinum: 'text-slate-300', Gold: 'text-amber-500', Silver: 'text-slate-400', Bronze: 'text-orange-700',
  };
  return (
    <div className="card-hover p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full gradient-card-red flex items-center justify-center text-white font-bold">{donor.name?.charAt(0)}</div>
          <div>
            <p className="font-semibold text-foreground leading-tight">{donor.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={11} /> {donor.city}</p>
          </div>
        </div>
        <BloodTypeBadge type={donor.bloodType} size="md" />
      </div>

      <div className="flex items-center gap-3 mt-4 text-xs">
        {donor.eligible ? (
          <span className="badge-available"><CheckCircle2 size={12} /> Eligible now</span>
        ) : (
          <span className="badge-low"><Clock size={12} /> {donor.eligibleInDays}d to go</span>
        )}
        {donor.tier && (
          <span className={`inline-flex items-center gap-1 font-semibold ${tierColor[donor.tier] || 'text-muted-foreground'}`}>
            <Award size={12} /> {donor.tier}
          </span>
        )}
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm fade-in-up">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5"><Activity size={13} /> Reliability</span>
            <span className="font-semibold text-foreground">{donor.reliability ?? 80}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5"><Droplet size={13} /> Total donations</span>
            <span className="font-semibold text-foreground">{donor.totalDonations || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5"><Clock size={13} /> Last donation</span>
            <span className="font-semibold text-foreground">{donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : 'Never'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5"><Shield size={13} /> Status</span>
            <span className={`font-semibold ${donor.available ? 'text-green-600' : 'text-amber-600'}`}>{donor.available ? 'Available' : 'Unavailable'}</span>
          </div>
          {donor.phone && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5"><Phone size={13} /> Phone</span>
              <span className="font-semibold text-foreground">{donor.phone}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          {expanded ? <>Less <ChevronUp size={13} /></> : <>More details <ChevronDown size={13} /></>}
        </button>
        <button onClick={() => setCallOpen(true)} className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-1.5 transition-all">
          <Phone size={14} /> Contact
        </button>
      </div>

      <CallModal
        open={callOpen}
        onClose={() => setCallOpen(false)}
        name={donor.name}
        phone={donor.phone || 'Not available'}
        subtitle={`${donor.bloodType} · ${donor.city}`}
      />
    </div>
  );
}

/* ─────────────────────── Compatibility Checker ─────────────────────── */
function CompatibilityChecker() {
  const [type, setType] = useState('O-');
  const [data, setData] = useState<any>(null);

  useEffect(() => { donorApi.compatibility(type).then(setData); }, [type]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 lg:p-8">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-3">Select a blood type to see compatibility</p>
          <div className="flex flex-wrap justify-center gap-2">
            {BLOOD_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`w-14 h-14 rounded-2xl font-bold font-mono text-sm border-2 transition-all ${
                  type === t ? 'border-primary bg-primary text-white scale-105 shadow-red-glow' : 'border-border text-foreground hover:border-primary/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {data && (
          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div className="rounded-2xl border border-green-200 dark:border-green-900 bg-green-50/60 dark:bg-green-950/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="text-green-600 dark:text-green-400" size={18} />
                <h3 className="font-bold text-green-800 dark:text-green-300">Can donate to</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.canDonateTo.map((t: string) => (
                  <button key={t} onClick={() => setType(t)} title={`See ${t} compatibility`} className="transition-transform hover:scale-110 active:scale-95">
                    <BloodTypeBadge type={t} size="md" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-green-700/70 dark:text-green-400/70 mt-3">
                {data.canDonateTo.length === 8 ? 'Universal donor — gives to everyone!' : `${data.canDonateTo.length} recipient type(s)`}
              </p>
              <p className="text-[11px] text-green-700/60 dark:text-green-400/60 mt-1">Tap a type to view its compatibility.</p>
            </div>

            <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Droplet className="text-blue-600 dark:text-blue-400" size={18} />
                <h3 className="font-bold text-blue-800 dark:text-blue-300">Can receive from</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.canReceiveFrom.map((t: string) => (
                  <button key={t} onClick={() => setType(t)} title={`See ${t} compatibility`} className="transition-transform hover:scale-110 active:scale-95">
                    <BloodTypeBadge type={t} size="md" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-3">
                {data.canReceiveFrom.length === 8 ? 'Universal recipient — receives from everyone!' : `${data.canReceiveFrom.length} donor type(s)`}
              </p>
              <p className="text-[11px] text-blue-700/60 dark:text-blue-400/60 mt-1">Tap a type to view its compatibility.</p>
            </div>

            <div className="sm:col-span-2 rounded-2xl bg-muted/50 border border-border p-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{type}</span> can donate to{' '}
              <span className="font-semibold text-green-600">{data.canDonateTo.length}</span> type(s) and receive from{' '}
              <span className="font-semibold text-blue-600">{data.canReceiveFrom.length}</span> type(s).
              {data.canDonateTo.length === 8 && ' This is the universal donor.'}
              {data.canReceiveFrom.length === 8 && ' This is the universal recipient.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── AI Match ─────────────────────── */
function AIMatch() {
  const [bloodType, setBloodType] = useState('O-');
  const [city, setCity] = useState('Mumbai');
  const [urgency, setUrgency] = useState('urgent');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [callMatch, setCallMatch] = useState<{ name: string; phone: string } | null>(null);

  const run = async () => {
    setLoading(true);
    const res = await aiApi.match({ bloodType, city, urgency });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center"><Brain size={20} /></div>
          <div>
            <h3 className="font-bold text-foreground">Smart Donor Match</h3>
            <p className="text-xs text-muted-foreground">Ranks donors by compatibility, distance, eligibility & reliability</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Needed type</label>
            <select className="input-field" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">City</label>
            <CitySelect value={city} onChange={setCity} placeholder="Select city" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Urgency</label>
            <select className="input-field" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="moderate">Moderate</option>
            </select>
          </div>
        </div>

        <button onClick={run} disabled={loading} className="btn-accent w-full mt-5">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Ranking donors…</> : <><Zap size={18} /> Run Smart Match</>}
        </button>
      </div>

      {result && (
        <div className="mt-6 fade-in-up">
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-semibold text-foreground">{result.totalCompatible}</span> compatible donors found · showing top {Math.min(result.matches.length, 20)}
          </p>
          <div className="space-y-3">
            {result.matches.map((m: any, i: number) => (
              <div key={m.donorId} className="card p-4 flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-12 flex-shrink-0">
                  <span className="text-[10px] text-muted-foreground font-semibold">#{i + 1}</span>
                  <div className={`text-lg font-bold ${m.score >= 80 ? 'text-green-600' : m.score >= 60 ? 'text-amber-600' : 'text-muted-foreground'}`}>{m.score}</div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider">score</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground truncate">{m.name}</p>
                    <BloodTypeBadge type={m.bloodType} size="sm" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    {m.city && <span className="inline-flex items-center gap-0.5"><MapPin size={10} /> {m.city}</span>}
                    {m.distanceKm != null && <span>· {Math.round(m.distanceKm)} km away</span>}
                    {m.reliability != null && <span>· {m.reliability}% reliable</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {m.reasons.slice(0, 3).map((r: string, ri: number) => (
                      <span key={ri} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{r}</span>
                    ))}
                  </div>
                </div>
                {m.eligible ? <CheckCircle2 className="text-green-500 flex-shrink-0" size={18} /> : <XCircle className="text-amber-500 flex-shrink-0" size={18} />}
                {m.phone && (
                  <button
                    onClick={() => setCallMatch({ name: m.name, phone: m.phone })}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                    aria-label={`Call ${m.name}`}
                  >
                    <Phone size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {callMatch && (
        <CallModal
          open={!!callMatch}
          onClose={() => setCallMatch(null)}
          name={callMatch.name}
          phone={callMatch.phone}
          subtitle="Matched donor"
        />
      )}
    </div>
  );
}