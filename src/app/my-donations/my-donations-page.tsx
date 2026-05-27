import React from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import RoleGuard from '@/components/RoleGuard';
import MyDonations from './components/MyDonations';

export const metadata: Metadata = {
  title: 'My Donations — RaktSetu',
  description: 'Your blood donation history, lives impacted, and the countdown to your next eligible donation date.',
};

// Donor-only page. Shows the logged-in donor their personal donation history and
// when they can donate again — the two questions every returning donor asks.
export default function MyDonationsPage() {
  return (
    <SiteShell>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        <RoleGuard allow={['donor']} featureName="My Donations">
          <MyDonations />
        </RoleGuard>
      </div>
    </SiteShell>
  );
}