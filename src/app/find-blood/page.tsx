import React from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import RoleGuard from '@/components/RoleGuard';
import FindBlood from './components/FindBlood';

export const metadata: Metadata = {
  title: 'Find Blood & Donors — RaktSetu',
  description: 'Search verified donors by blood type and city, check compatibility instantly, and let AI rank the best matches near you.',
};

export default function FindBloodPage() {
  return (
    <SiteShell>
      <RoleGuard allow={['hospital', 'admin']} featureName="Find Blood">
        <FindBlood />
      </RoleGuard>
    </SiteShell>
  );
}