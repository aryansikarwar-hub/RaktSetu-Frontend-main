'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Loader2, RefreshCw, Activity, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import BloodTypeBadge from '@/components/ui/BloodTypeBadge';
import CitySelect from '@/components/ui/CitySelect';
import { aiApi } from '@/lib/api';

const riskColor: Record<string, string> = { critical: '#dc2626', low: '#f59e0b', stable: '#16a34a' };

export default function ForecastDashboard() {
  const [city, setCity] = useState('Mumbai');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async (c: string) => {
    setLoading(true);
    const res = await aiApi.forecast(c);
    setData(res);
    setLoading(false);
  };

  useEffect(() => { load(city); }, [city]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Predictive supply intelligence</span>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-4">Blood Demand Forecast</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            A 7-day outlook of which blood types are heading toward critical levels — so drives can be launched before
            shortages cost lives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-52"><CitySelect value={city} onChange={setCity} /></div>
          <button onClick={() => load(city)} className="btn-secondary py-3 px-4" aria-label="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading || !data ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : (
        <>
          {data.criticalTypes.length > 0 && (
            <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-5 mb-6 flex items-start gap-3 fade-in-up">
              <AlertTriangle className="text-primary flex-shrink-0 mt-0.5" size={22} />
              <div>
                <p className="font-bold text-red-800 dark:text-red-300">
                  {data.criticalTypes.length} blood type{data.criticalTypes.length > 1 ? 's' : ''} at critical risk in {data.city}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.criticalTypes.map((t: string) => <BloodTypeBadge key={t} type={t} size="sm" />)}
                </div>
                <p className="text-xs text-red-700/70 dark:text-red-400/70 mt-2">Immediate donor drives recommended for these types.</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-primary" />
                <h3 className="font-bold text-foreground">Days of supply by blood type</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.forecast} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                    <XAxis dataKey="bloodType" tick={{ fill: 'rgb(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgb(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'rgb(var(--card))', border: '1px solid rgb(var(--border))', borderRadius: 12, fontSize: 13 }}
                      labelStyle={{ color: 'rgb(var(--foreground))', fontWeight: 600 }}
                      formatter={(v: any) => [`${v} days`, 'Supply']}
                    />
                    <Bar dataKey="daysOfSupply" radius={[6, 6, 0, 0]}>
                      {data.forecast.map((f: any) => <Cell key={f.bloodType} fill={riskColor[f.risk]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <Legend color="#dc2626" label="Critical (<2 days)" />
                <Legend color="#f59e0b" label="Low (<5 days)" />
                <Legend color="#16a34a" label="Stable" />
              </div>
            </div>

            {/* Risk list */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-accent" />
                <h3 className="font-bold text-foreground">Action plan</h3>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar">
                {data.forecast.map((f: any) => (
                  <div key={f.bloodType} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <BloodTypeBadge type={f.bloodType} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold capitalize" style={{ color: riskColor[f.risk] }}>{f.risk}</span>
                        <span className="text-xs text-muted-foreground">{f.daysOfSupply}d · {f.currentStock}u</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{f.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
            <TrendingUp size={13} /> Forecast generated {new Date(data.generatedAt).toLocaleString()} · {data.horizonDays}-day horizon · engine: {data.engine}
          </p>
        </>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded" style={{ background: color }} />
      {label}
    </span>
  );
}
