'use client';
import React from 'react';
import Link from 'next/link';
import {
  Brain, Stethoscope, TrendingUp, Search, ShieldCheck, Bell,
  ArrowUpRight, Sparkles, GitCompareArrows, Trophy,
} from 'lucide-react';

const aiFeatures = [
  {
    icon: <Brain size={22} />,
    title: 'Smart Donor Match',
    desc: 'Ranks compatible donors by blood type, distance, eligibility & reliability — so coordinators call the right person first.',
    href: '/find-blood',
    tag: 'AI',
  },
  {
    icon: <Stethoscope size={22} />,
    title: 'Eligibility Pre-Screen',
    desc: 'An instant health questionnaire that tells you if you can donate today — preventing wasted trips to the centre.',
    href: '/eligibility',
    tag: 'AI',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Demand Forecasting',
    desc: 'Predicts which blood types will run critical in your city this week, turning shortages from reactive to proactive.',
    href: '/forecast',
    tag: 'AI',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Emergency Triage',
    desc: 'Every incoming request is auto-scored P1–P4 by urgency, units, rarity & patient age, so the most critical cases surface first.',
    href: '/emergency-page',
    tag: 'AI',
  },
];

const coreFeatures = [
  { icon: <GitCompareArrows size={20} />, title: 'Compatibility Checker', desc: 'Instantly see who can give to and receive from any blood type.' },
  { icon: <Search size={20} />, title: 'Nearby Donor Search', desc: 'Filter active donors by type, city and live availability.' },
  { icon: <Bell size={20} />, title: 'Eligibility Reminders', desc: 'Auto-countdown to your next eligible donation date.' },
  { icon: <Trophy size={20} />, title: 'Donor Rewards', desc: 'Earn points, tiers and badges for every life you help save.' },
  { icon: <ShieldCheck size={20} />, title: 'Verified Hospitals', desc: 'Real-time blood-bank inventory from verified partner hospitals.' },
];

export default function FeatureShowcase() {
  return (
    <section className="py-16 lg:py-24 px-4 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow">Built to save lives</span>
          <h2 className="section-header mt-4">Intelligence that closes the gap between donors and patients</h2>
          <p className="section-subheader">
            RaktSetu pairs an AI matching engine with practical, everyday tools — so the right blood reaches the right
            patient, faster.
          </p>
        </div>

        {/* AI features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {aiFeatures.map((f, i) => (
            <Link
              key={f.title}
              href={f.href}
              className="group card-hover p-6 relative overflow-hidden fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute top-4 right-4 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                {f.tag}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="font-bold text-foreground flex items-center gap-1">
                {f.title}
                <ArrowUpRight size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>

        {/* Core (non-AI) features */}
        <div className="card p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Everyday essentials, done right</h3>
              <p className="text-sm text-muted-foreground mt-1">Practical tools that work without any AI — reliable from day one.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border p-4 hover:border-primary/40 hover:bg-muted/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3">{f.icon}</div>
                <h4 className="font-semibold text-sm text-foreground">{f.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
