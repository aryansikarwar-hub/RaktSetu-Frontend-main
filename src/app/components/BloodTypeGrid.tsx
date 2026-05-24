import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const BLOOD_DATA = [
  { id: 'bt-a-pos', type: 'A+', units: 1847, status: 'available', donors: 412, trend: 'up', change: '+12%', compatible: ['A+', 'AB+'] },
  { id: 'bt-a-neg', type: 'A-', units: 134, status: 'low', donors: 89, trend: 'down', change: '-8%', compatible: ['A+', 'A-', 'AB+', 'AB-'] },
  { id: 'bt-b-pos', type: 'B+', units: 2103, status: 'available', donors: 487, trend: 'up', change: '+6%', compatible: ['B+', 'AB+'] },
  { id: 'bt-b-neg', type: 'B-', units: 67, status: 'critical', donors: 34, trend: 'down', change: '-23%', compatible: ['B+', 'B-', 'AB+', 'AB-'] },
  { id: 'bt-o-pos', type: 'O+', units: 3241, status: 'available', donors: 721, trend: 'up', change: '+18%', compatible: ['O+', 'A+', 'B+', 'AB+'] },
  { id: 'bt-o-neg', type: 'O-', units: 298, status: 'low', donors: 156, trend: 'neutral', change: '0%', compatible: ['All types'] },
  { id: 'bt-ab-pos', type: 'AB+', units: 892, status: 'available', donors: 203, trend: 'up', change: '+4%', compatible: ['AB+'] },
  { id: 'bt-ab-neg', type: 'AB-', units: 41, status: 'critical', donors: 18, trend: 'down', change: '-31%', compatible: ['AB+', 'AB-'] },
];

const statusConfig = {
  available: {
    label: 'Available',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-900',
    badge: 'badge-available',
    bar: 'bg-green-500',
    barWidth: (units: number) => Math.min((units / 3500) * 100, 100),
  },
  low: {
    label: 'Low Stock',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-900',
    badge: 'badge-low',
    bar: 'bg-amber-500',
    barWidth: (units: number) => Math.min((units / 3500) * 100, 100),
  },
  critical: {
    label: 'Critical',
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-900',
    badge: 'badge-critical',
    bar: 'bg-red-500',
    barWidth: (units: number) => Math.min((units / 3500) * 100, 100),
  },
};

export default function BloodTypeGrid() {
  return (
    <section className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-16 bg-muted/30 rounded-3xl my-4">
      <div className="text-center mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">Live Inventory</span>
        <h2 className="section-header mt-4 text-3xl lg:text-4xl">
          National Blood Stock Overview
        </h2>
        <p className="section-subheader max-w-xl mx-auto mt-3">
          Real-time blood availability aggregated across all 284 connected hospitals. Updated every 15 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BLOOD_DATA.map((bt) => {
          const cfg = statusConfig[bt.status as keyof typeof statusConfig];
          const barWidth = cfg.barWidth(bt.units);
          return (
            <div
              key={bt.id}
              className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5 hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 cursor-default`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-3xl font-extrabold text-foreground font-mono">{bt.type}</span>
                  <div className="mt-1">
                    <span className={cfg.badge}>{cfg.label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums text-foreground">{bt.units.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground">units</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full ${cfg.bar} rounded-full transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{bt.donors} active donors</span>
                <div className="flex items-center gap-1">
                  {bt.trend === 'up' ? (
                    <TrendingUp size={12} className="text-green-600" />
                  ) : bt.trend === 'down' ? (
                    <TrendingDown size={12} className="text-red-600" />
                  ) : (
                    <Minus size={12} className="text-muted-foreground" />
                  )}
                  <span className={bt.trend === 'up' ? 'text-green-600 font-semibold' : bt.trend === 'down' ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>
                    {bt.change}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-foreground/10">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Donates to:</span>{' '}
                  {bt.compatible.join(', ')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" />Available (&gt;500 units)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" />Low (100–500 units)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" />Critical (&lt;100 units)</div>
      </div>
    </section>
  );
}