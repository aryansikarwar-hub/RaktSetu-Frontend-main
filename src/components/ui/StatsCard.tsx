import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'dark' | 'warning';
}

export default function StatsCard({
  label,
  value,
  subtext,
  icon,
  trend,
  trendValue,
  variant = 'default',
}: StatsCardProps) {
  const bgClass = {
    default: 'bg-card border border-border',
    primary: 'gradient-card-red text-white',
    dark: 'gradient-card-dark text-white',
    warning: 'bg-amber-50 border border-amber-200',
  }[variant];

  const textClass = variant === 'primary' || variant === 'dark' ? 'text-white' : 'text-foreground';
  const mutedClass = variant === 'primary' || variant === 'dark' ? 'text-white/70' : 'text-muted-foreground';
  const iconBg = variant === 'primary' || variant === 'dark' ? 'bg-white/20' : 'bg-primary/10';
  const iconColor = variant === 'primary' || variant === 'dark' ? 'text-white' : 'text-primary';

  return (
    <div className={`rounded-2xl p-5 ${bgClass} shadow-card`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        {trend && trendValue && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend === 'up'
                ? variant === 'default' ?'bg-green-100 text-green-700' :'bg-white/20 text-white'
                : trend === 'down'
                ? variant === 'default' ?'bg-red-100 text-red-700' :'bg-white/20 text-white' :'bg-gray-100 text-gray-600'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold tabular-nums leading-none mb-1 ${textClass}`}>{value}</p>
      <p className={`text-xs font-semibold uppercase tracking-widest ${mutedClass} mb-0.5`}>{label}</p>
      {subtext && <p className={`text-xs ${mutedClass} mt-1`}>{subtext}</p>}
    </div>
  );
}