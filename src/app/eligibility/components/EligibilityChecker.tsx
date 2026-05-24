'use client';
import React, { useState } from 'react';
import {
  Stethoscope, CheckCircle2, AlertTriangle, XCircle, Loader2, RotateCcw,
  Info, ChevronRight, ShieldCheck,
} from 'lucide-react';
import { aiApi } from '@/lib/api';

interface Answers {
  age: string; weightKg: string; recentDonationDays: string;
  recentIllness: boolean; recentTattoo: boolean; recentSurgery: boolean;
  pregnant: boolean; chronicCondition: boolean; medications: boolean; recentAlcohol: boolean;
}

const initial: Answers = {
  age: '', weightKg: '', recentDonationDays: '',
  recentIllness: false, recentTattoo: false, recentSurgery: false,
  pregnant: false, chronicCondition: false, medications: false, recentAlcohol: false,
};

const toggles: { key: keyof Answers; label: string; hint: string }[] = [
  { key: 'recentIllness', label: 'Fever or illness in the last 2 weeks', hint: 'Cold, flu, infection, etc.' },
  { key: 'recentTattoo', label: 'Tattoo or piercing in the last 6 months', hint: '' },
  { key: 'recentSurgery', label: 'Major surgery recently', hint: 'Within recovery period' },
  { key: 'pregnant', label: 'Currently pregnant or recently delivered', hint: '' },
  { key: 'chronicCondition', label: 'Chronic condition', hint: 'Heart, kidney, uncontrolled diabetes' },
  { key: 'medications', label: 'On regular medication', hint: 'Some affect eligibility' },
  { key: 'recentAlcohol', label: 'Consumed alcohol in last 24 hours', hint: '' },
];

export default function EligibilityChecker() {
  const [answers, setAnswers] = useState<Answers>(initial);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const update = (k: keyof Answers, v: string | boolean) => setAnswers((a) => ({ ...a, [k]: v }));

  const run = async () => {
    setLoading(true);
    const payload = {
      ...answers,
      age: answers.age ? Number(answers.age) : undefined,
      weightKg: answers.weightKg ? Number(answers.weightKg) : undefined,
      recentDonationDays: answers.recentDonationDays !== '' ? Number(answers.recentDonationDays) : undefined,
    };
    const res = await aiApi.screenEligibility(payload);
    setResult(res);
    setLoading(false);
    setTimeout(() => document.getElementById('elig-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const reset = () => { setAnswers(initial); setResult(null); };

  const verdictMeta: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    eligible: { color: 'text-green-700 dark:text-green-300', bg: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900', icon: <CheckCircle2 size={28} />, label: 'Likely Eligible' },
    defer: { color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900', icon: <AlertTriangle size={28} />, label: 'Please Wait' },
    not_eligible: { color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900', icon: <XCircle size={28} />, label: 'Not Eligible Now' },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
          <Stethoscope size={26} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">AI Eligibility Pre-Screen</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Answer a few quick questions to find out if you can donate today. Takes under a minute and saves you a wasted trip.
        </p>
      </div>

      <div className="card p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Age</label>
            <input type="number" min={1} max={120} className="input-field" placeholder="Years" value={answers.age} onChange={(e) => update('age', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Weight (kg)</label>
            <input type="number" min={1} className="input-field" placeholder="kg" value={answers.weightKg} onChange={(e) => update('weightKg', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Days since last donation</label>
            <input type="number" min={0} className="input-field" placeholder="e.g. 120" value={answers.recentDonationDays} onChange={(e) => update('recentDonationDays', e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Health & lifestyle</p>
          {toggles.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => update(t.key, !answers[t.key])}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                answers[t.key] ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/40'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                {t.hint && <p className="text-xs text-muted-foreground mt-0.5">{t.hint}</p>}
              </div>
              <span className={`w-11 h-6 rounded-full flex-shrink-0 relative transition-colors ${answers[t.key] ? 'bg-primary' : 'bg-border'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${answers[t.key] ? 'left-[22px]' : 'left-0.5'}`} />
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={run} disabled={loading} className="btn-primary flex-1">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Analysing…</> : <>Check Eligibility <ChevronRight size={18} /></>}
          </button>
          {result && <button onClick={reset} className="btn-secondary"><RotateCcw size={16} /> Reset</button>}
        </div>
      </div>

      {result && (
        <div id="elig-result" className="mt-6 fade-in-up">
          <div className={`rounded-2xl border p-6 ${verdictMeta[result.verdict].bg}`}>
            <div className="flex items-start gap-4">
              <span className={verdictMeta[result.verdict].color}>{verdictMeta[result.verdict].icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`text-lg font-bold ${verdictMeta[result.verdict].color}`}>{verdictMeta[result.verdict].label}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-card border border-border text-muted-foreground">
                    {Math.round(result.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {result.blockers?.length > 0 && (
              <ResultList title="Blocking issues" items={result.blockers} tone="red" />
            )}
            {result.deferrals?.length > 0 && (
              <ResultList title="Reasons to wait" items={result.deferrals} tone="amber" />
            )}
            {result.notes?.length > 0 && (
              <ResultList title="Good to know" items={result.notes} tone="muted" />
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground mt-4 px-2">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <p>{result.disclaimer}</p>
          </div>

          {result.verdict === 'eligible' && (
            <div className="mt-4 card p-5 flex items-center gap-4">
              <ShieldCheck className="text-accent flex-shrink-0" size={28} />
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">You're good to go!</p>
                <p className="text-xs text-muted-foreground">Find a nearby donation centre or respond to an active emergency.</p>
              </div>
              <a href="/emergency-page" className="btn-primary text-sm py-2 px-4 whitespace-nowrap">View Emergencies</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultList({ title, items, tone }: { title: string; items: string[]; tone: 'red' | 'amber' | 'muted' }) {
  const dot = tone === 'red' ? 'bg-red-500' : tone === 'amber' ? 'bg-amber-500' : 'bg-muted-foreground';
  return (
    <div className="mt-4 pt-4 border-t border-border/60">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
