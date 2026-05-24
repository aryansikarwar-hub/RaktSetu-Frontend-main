'use client';
import React, { useState } from 'react';
import WelcomeCard from './WelcomeCard';
import QuickActions from './QuickActions';
import DonorStatusCard from './DonorStatusCard';
import NotificationsPanel from './NotificationsPanel';
import ActivityTimeline from './ActivityTimeline';
import DonationStatsChart from './DonationStatsChart';
import NearbyDonors from './NearbyDonors';
import HospitalDashboard from './HospitalDashboard';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '@/context/AuthContext';

export default function DashboardContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p className="font-semibold text-foreground">Please log in to view your dashboard</p>
        </div>
      </div>
    );
  }

  // Route to the right experience based on account role.
  if (user.role === 'hospital') return <HospitalDashboard user={user} />;
  if (user.role === 'admin') return <AdminDashboard user={user} />;
  return <DonorDashboard user={user} />;
}

function DonorDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'donors'>('overview');

  return (
    <div className="space-y-6">
      <WelcomeCard user={user} />

      <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit">
        {[
          { id: 'overview' as const, label: 'Overview' },
          { id: 'activity' as const, label: 'Activity' },
          { id: 'donors' as const, label: 'Nearby Donors' },
        ].map((tab) => (
          <button
            key={`dash-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
              activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <QuickActions />
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1"><DonorStatusCard user={user} /></div>
            <div className="lg:col-span-2"><NotificationsPanel /></div>
            <div className="lg:col-span-3 xl:col-span-1"><DonationStatsChart /></div>
          </div>
        </>
      )}

      {activeTab === 'activity' && <ActivityTimeline />}
      {activeTab === 'donors' && <NearbyDonors />}
    </div>
  );
}
