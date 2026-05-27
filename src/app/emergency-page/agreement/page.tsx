import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import RoleGuard from '@/components/RoleGuard';
import AgreementContent from './components/AgreementContent';

export const metadata: Metadata = {
  title: 'Donation Commitment — RaktSetu',
  description: 'Review and confirm your commitment to respond to this emergency blood request.',
};

// Donor-only. The emergency id arrives as ?id=... from the "Accept Request" button.
export default function AgreementPage() {
  return (
    <SiteShell>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
        <RoleGuard allow={['donor']} featureName="Donation Commitment">
          <Suspense fallback={<div className="card p-10 text-center text-muted-foreground">Loading…</div>}>
            <AgreementContent />
          </Suspense>
        </RoleGuard>
      </div>
    </SiteShell>
  );
}