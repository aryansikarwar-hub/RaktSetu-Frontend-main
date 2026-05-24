import React from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import EligibilityChecker from './components/EligibilityChecker';

export const metadata: Metadata = {
  title: 'Donation Eligibility Check — RaktSetu',
  description: 'Find out in 60 seconds whether you can donate blood today with RaktSetu’s AI pre-screening assistant.',
};

export default function EligibilityPage() {
  return (
    <SiteShell>
      <EligibilityChecker />
    </SiteShell>
  );
}
