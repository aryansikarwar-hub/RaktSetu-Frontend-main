import React from 'react';
import SiteShell from '@/components/SiteShell';
import HeroSection from '@/app/components/HeroSection';
import StatsBar from '@/app/components/StatsBar';
import FeatureShowcase from '@/app/components/FeatureShowcase';
import BloodTypeGrid from '@/app/components/BloodTypeGrid';
import HowItWorks from '@/app/components/HowItWorks';
import EmergencyBanner from '@/app/components/EmergencyBanner';
import HospitalHighlights from '@/app/components/HospitalHighlights';

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />
      <StatsBar />
      <FeatureShowcase />
      <HowItWorks />
      <BloodTypeGrid />
      <HospitalHighlights />
      <EmergencyBanner />
    </SiteShell>
  );
}
