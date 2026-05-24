'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DATA = [
  { month: 'Jun', donations: 1, units: 1 },
  { month: 'Jul', donations: 0, units: 0 },
  { month: 'Aug', donations: 0, units: 0 },
  { month: 'Sep', donations: 0, units: 0 },
  { month: 'Oct', donations: 1, units: 1 },
  { month: 'Nov', donations: 0, units: 0 },
  { month: 'Dec', donations: 0, units: 0 },
  { month: 'Jan', donations: 0, units: 0 },
  { month: 'Feb', donations: 1, units: 2 },
  { month: 'Mar', donations: 0, units: 0 },
  { month: 'Apr', donations: 0, units: 0 },
  { month: 'May', donations: 0, units: 0 },
];

interface TooltipPayloadItem {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-card-md text-xs">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={`tt-${p.name}`} className="text-muted-foreground">{p.name}: <span className="font-semibold text-foreground">{p.value}</span></p>
      ))}
    </div>
  );
}

export default function DonationStatsChartInner() {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground text-sm">Donation History</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 12 months</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold tabular-nums text-primary">7</p>
          <p className="text-xs text-muted-foreground">Total donations</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgb(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'rgb(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgb(var(--muted))', opacity: 0.5 }} />
          <Bar dataKey="donations" name="Donations" radius={[4, 4, 0, 0]}>
            {DATA.map((entry, index) => (
              <Cell key={`cell-bar-${index + 1}`} fill={entry.donations > 0 ? 'rgb(var(--primary))' : 'rgb(var(--muted))'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-1 mt-2">
        <span className="w-3 h-3 rounded bg-primary" />
        <span className="text-xs text-muted-foreground">Donation months</span>
      </div>
    </div>
  );
}