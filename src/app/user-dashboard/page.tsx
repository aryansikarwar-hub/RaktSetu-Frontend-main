import React from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import DashboardContent from '@/app/user-dashboard/components/DashboardContent';

export const metadata: Metadata = {
  title: 'My Dashboard — RaktSetu',
  description: 'Track your donations, eligibility, rewards and nearby emergencies.',
};

export default function UserDashboardPage() {
  return (
    <SiteShell>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-8">
        <DashboardContent />
      </div>
    </SiteShell>
  );
}
