import React from 'react';

interface BloodTypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const bloodTypeColors: Record<string, string> = {
  'A+': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900',
  'A-': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900',
  'B+': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900',
  'B-': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900',
  'O+': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-900',
  'O-': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900',
  'AB+': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900',
  'AB-': 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-900',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 font-bold',
  md: 'text-sm px-2.5 py-1 font-bold',
  lg: 'text-base px-3 py-1.5 font-extrabold',
};

export default function BloodTypeBadge({ type, size = 'md', className = '' }: BloodTypeBadgeProps) {
  const colorClass = bloodTypeColors[type] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg border font-mono ${colorClass} ${sizeClasses[size]} ${className}`}
    >
      {type}
    </span>
  );
}