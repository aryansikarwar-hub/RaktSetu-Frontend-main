'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Search, HeartPulse, AlertTriangle, ArrowRight, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Action = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  iconBg: string;
  badge: string | null;
  // Which roles may see this action.
  roles: Array<'donor' | 'hospital' | 'admin'>;
};

const ALL_ACTIONS: Action[] = [
  {
    id: 'qa-register',
    icon: <UserPlus size={24} />,
    title: 'My Donor Profile',
    description: 'Update your availability and donor details',
    href: '/user-dashboard',
    color: 'bg-red-50 dark:bg-red-950/20 text-primary border-red-100 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-950/40',
    iconBg: 'bg-primary text-white',
    badge: null,
    roles: ['donor'],
  },
  {
    id: 'qa-eligibility',
    icon: <HeartPulse size={24} />,
    title: 'Check Eligibility',
    description: 'Run the AI pre-screen to see if you can donate today',
    href: '/eligibility',
    color: 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900 hover:bg-purple-100 dark:hover:bg-purple-950/40',
    iconBg: 'bg-purple-600 text-white',
    badge: null,
    roles: ['donor'],
  },
  {
    id: 'qa-view-emergency',
    icon: <Eye size={24} />,
    title: 'View Emergencies',
    description: 'See active blood requests near you and respond',
    href: '/emergency-page',
    color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-950/40',
    iconBg: 'bg-amber-500 text-white',
    badge: null,
    roles: ['donor'],
  },
  {
    // Hospitals only: search the donor network.
    id: 'qa-find',
    icon: <Search size={24} />,
    title: 'Find Blood',
    description: 'Search donors by blood type and city near you',
    href: '/find-blood',
    color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-950/40',
    iconBg: 'bg-blue-600 text-white',
    badge: null,
    roles: ['hospital'],
  },
  {
    // Hospitals only: post a new emergency request.
    id: 'qa-emergency',
    icon: <AlertTriangle size={24} />,
    title: 'Post Emergency',
    description: 'Post a critical blood request to all nearby donors',
    href: '/emergency-page',
    color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-950/40',
    iconBg: 'bg-amber-500 text-white',
    badge: null,
    roles: ['hospital'],
  },
];

export default function QuickActions() {
  const { user } = useAuth();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const role = (user?.role || 'donor') as 'donor' | 'hospital' | 'admin';
  const actions = ALL_ACTIONS.filter((a) => a.roles.includes(role));

  if (actions.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            onMouseEnter={() => setHoveredId(action.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`group relative block border rounded-2xl p-5 transition-all duration-200 hover:shadow-card-md hover:-translate-y-0.5 ${action.color}`}
          >
            {action.badge && (
              <span className="absolute top-3 right-3 text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                {action.badge}
              </span>
            )}
            <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform duration-150`}>
              {action.icon}
            </div>
            <h3 className="font-bold text-sm mb-1">{action.title}</h3>
            <p className="text-xs opacity-70 leading-relaxed mb-3">{action.description}</p>
            <div className={`flex items-center gap-1 text-xs font-semibold transition-all duration-150 ${hoveredId === action.id ? 'translate-x-1' : ''}`}>
              Get started <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}