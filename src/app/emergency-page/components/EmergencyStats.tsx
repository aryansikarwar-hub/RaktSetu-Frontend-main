import React from 'react';
import { AlertTriangle, Clock, Users, CheckCircle2 } from 'lucide-react';

const STATS = [
  {
    id: 'estat-active',
    icon: <AlertTriangle size={20} />,
    value: '7',
    label: 'Active Emergencies',
    sub: '3 critical, 4 urgent',
    color: 'text-primary',
    bg: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    id: 'estat-response',
    icon: <Clock size={20} />,
    value: '18 min',
    label: 'Avg Response Time',
    sub: '↓ 4 min from yesterday',
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900',
    iconBg: 'bg-green-100 text-green-700',
  },
  {
    id: 'estat-donors',
    icon: <Users size={20} />,
    value: '847',
    label: 'Donors Online Now',
    sub: 'Ready to respond',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'estat-resolved',
    icon: <CheckCircle2 size={20} />,
    value: '14',
    label: 'Resolved Today',
    sub: '100% fulfillment rate',
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900',
    iconBg: 'bg-purple-100 text-purple-700',
  },
];

export default function EmergencyStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS?.map((s) => (
        <div key={s?.id} className={`rounded-2xl border p-4 ${s?.bg}`}>
          <div className={`w-9 h-9 rounded-xl ${s?.iconBg} flex items-center justify-center mb-3`}>
            {s?.icon}
          </div>
          <p className={`text-2xl font-extrabold tabular-nums ${s?.color} leading-none mb-0.5`}>{s?.value}</p>
          <p className="text-xs font-semibold text-foreground">{s?.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s?.sub}</p>
        </div>
      ))}
    </div>
  );
}