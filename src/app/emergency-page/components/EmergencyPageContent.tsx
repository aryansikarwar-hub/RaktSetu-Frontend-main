'use client';
import React, { useState } from 'react';
import EmergencyHeader from './EmergencyHeader';
import EmergencyRequestForm from './EmergencyRequestForm';
import ActiveEmergenciesFeed from './ActiveEmergenciesFeed';
import EmergencyStats from './EmergencyStats';
import { useAuth } from '@/context/AuthContext';

export default function EmergencyPageContent() {
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);

  // Only hospitals & admins can POST emergencies. Donors (and logged-out
  // visitors) can only VIEW the live feed so they can respond.
  const canPost = user?.role === 'hospital' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* canPost is passed so the header can hide the "Post" button for donors. */}
      <EmergencyHeader canPost={canPost} onOpenForm={() => setFormOpen(true)} />
      <EmergencyStats />

      {canPost ? (
        // Hospital / admin view: feed + posting form side by side.
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3">
            <ActiveEmergenciesFeed />
          </div>
          <div className="xl:col-span-2">
            <EmergencyRequestForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
          </div>
        </div>
      ) : (
        // Donor / public view: full-width feed only, no posting form.
        <ActiveEmergenciesFeed />
      )}
    </div>
  );
}