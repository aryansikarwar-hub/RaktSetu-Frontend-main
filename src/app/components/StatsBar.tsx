'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Users, Droplets, Heart, Building2 } from 'lucide-react';
import { statsApi } from '@/lib/api';

const DEFAULT_STATS = [
  { id: 'stat-donors', icon: <Users size={28} />, value: 247832, label: 'Registered Donors', suffix: '+', color: 'text-primary' },
  { id: 'stat-units', icon: <Droplets size={28} />, value: 18640, label: 'Blood Units Available', suffix: '', color: 'text-blue-600' },
  { id: 'stat-lives', icon: <Heart size={28} />, value: 93200, label: 'Lives Saved', suffix: '+', color: 'text-green-600' },
  { id: 'stat-hospitals', icon: <Building2 size={28} />, value: 284, label: 'Hospitals Connected', suffix: '', color: 'text-purple-600' },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatItem({ stat, active }: { stat: typeof DEFAULT_STATS[0]; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active);
  return (
    <div className="flex flex-col items-center text-center px-6 py-6 border-r border-border last:border-0 group">
      <div className={`mb-3 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
      <p className={`text-3xl xl:text-4xl font-extrabold tabular-nums ${stat.color} leading-none mb-1`}>
        {count.toLocaleString('en-IN')}{stat.suffix}
      </p>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
    </div>
  );
}

export default function StatsBar() {
  const [active, setActive] = useState(false);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    statsApi.get().then((res) => {
      const s = res.stats;
      setStats((prev) => prev.map((item) => {
        if (item.id === 'stat-donors') return { ...item, value: s.registeredDonors ?? item.value };
        if (item.id === 'stat-units') return { ...item, value: s.bloodUnitsAvailable ?? item.value };
        if (item.id === 'stat-lives') return { ...item, value: s.livesSaved ?? item.value };
        if (item.id === 'stat-hospitals') return { ...item, value: s.hospitalsConnected ?? item.value };
        return item;
      }));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 -mt-8 relative z-10">
      <div className="bg-card rounded-3xl shadow-card-lg border border-border overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.id} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}