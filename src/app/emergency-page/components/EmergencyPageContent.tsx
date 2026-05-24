'use client';
import React, { useState } from 'react';
import EmergencyHeader from './EmergencyHeader';
import EmergencyRequestForm from './EmergencyRequestForm';
import ActiveEmergenciesFeed from './ActiveEmergenciesFeed';
import EmergencyStats from './EmergencyStats';

export default function EmergencyPageContent() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <EmergencyHeader onOpenForm={() => setFormOpen(true)} />
      <EmergencyStats />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Feed — wider */}
        <div className="xl:col-span-3">
          <ActiveEmergenciesFeed />
        </div>
        {/* Form — narrower */}
        <div className="xl:col-span-2">
          <EmergencyRequestForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
        </div>
      </div>
    </div>
  );
}