import React from 'react';
import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import ForecastDashboard from './components/ForecastDashboard';

export const metadata: Metadata = {
  title: 'Blood Demand Forecast — RaktSetu',
  description: 'AI-driven 7-day blood supply forecast by city — see which types are heading critical and act before shortages hit.',
};

export default function ForecastPage() {
  return (
    <SiteShell>
      <ForecastDashboard />
    </SiteShell>
  );
}
