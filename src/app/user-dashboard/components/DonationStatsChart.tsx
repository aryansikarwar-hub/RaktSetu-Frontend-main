'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const DonationStatsChartInner = dynamic(() => import('./DonationStatsChartInner'), { ssr: false });

export default function DonationStatsChart() {
  return <DonationStatsChartInner />;
}