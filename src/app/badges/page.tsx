import React from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import RoleGuard from '@/components/RoleGuard';
import BadgesContent from './components/BadgesContent';

export const metadata: Metadata = {
  title: 'My Badges & Certificate — RaktSetu',
  description: 'View your donor achievements, tier badges, and download a shareable donation certificate.',
};

export default function BadgesPage() {
  return (
    <SiteShell>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        <RoleGuard allow={['donor']} featureName="Badges & Certificate">
          <BadgesContent />
        </RoleGuard>
      </div>
    </SiteShell>
  );
}