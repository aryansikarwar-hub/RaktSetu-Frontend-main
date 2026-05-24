import React from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import FindBlood from './components/FindBlood';

export const metadata: Metadata = {
  title: 'Find Blood & Donors — RaktSetu',
  description: 'Search verified donors by blood type and city, check compatibility instantly, and let AI rank the best matches near you.',
};

export default function FindBloodPage() {
  return (
    <SiteShell>
      <FindBlood />
    </SiteShell>
  );
}
