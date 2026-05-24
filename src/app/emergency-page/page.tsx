import React from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import EmergencyPageContent from '@/app/emergency-page/components/EmergencyPageContent';

export const metadata: Metadata = {
  title: 'Emergency Blood Requests — RaktSetu',
  description: 'Broadcast an urgent blood requirement to nearby donors and hospitals, or respond to active emergencies in real time.',
};

export default function EmergencyPage() {
  return (
    <SiteShell>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-8">
        <EmergencyPageContent />
      </div>
    </SiteShell>
  );
}
