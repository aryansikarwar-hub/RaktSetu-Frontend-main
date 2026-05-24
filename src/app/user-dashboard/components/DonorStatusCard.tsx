import React from 'react';
import { Droplets, Calendar, Phone, MapPin, Edit3, Shield } from 'lucide-react';
import BloodTypeBadge from '@/components/ui/BloodTypeBadge';
import { AuthUser } from '@/context/AuthContext';

interface DonorStatusCardProps {
  user: AuthUser;
}

const DONATION_HISTORY = [
  { id: 'dh-001', date: '14 Feb 2026', hospital: 'Kokilaben Hospital', units: 1, type: 'Whole Blood' },
  { id: 'dh-002', date: '08 Oct 2025', hospital: 'Lilavati Hospital', units: 1, type: 'Whole Blood' },
  { id: 'dh-003', date: '22 Jun 2025', hospital: 'Breach Candy Hospital', units: 2, type: 'Platelets' },
  { id: 'dh-004', date: '15 Mar 2025', hospital: 'Kokilaben Hospital', units: 1, type: 'Whole Blood' },
];

export default function DonorStatusCard({ user }: DonorStatusCardProps) {
  return (
    <div className="card h-full p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-foreground">Donor Profile</h3>
        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
          <Edit3 size={15} />
        </button>
      </div>

      {/* Blood Type Feature */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Blood Type</p>
        <BloodTypeBadge type={user.bloodType} size="lg" />
        <p className="text-xs text-muted-foreground mt-2">Universal donor for: O+, A+, B+, AB+</p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Calendar size={13} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Donation</p>
            <p className="text-sm font-semibold text-foreground">
              {user.lastDonation
                ? new Date(user.lastDonation).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Never donated'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <MapPin size={13} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">City</p>
            <p className="text-sm font-semibold text-foreground">{user.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Phone size={13} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Contact</p>
            <p className="text-sm font-semibold text-foreground">{user.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Shield size={13} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Verification</p>
            <p className="text-sm font-semibold text-green-600">Verified ✓</p>
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Donation History</h4>
          <div className="flex items-center gap-1">
            <Droplets size={12} className="text-primary" />
            <span className="text-xs font-bold text-primary">7 total</span>
          </div>
        </div>
        <div className="space-y-2">
          {DONATION_HISTORY.map((d) => (
            <div key={d.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-xs font-semibold text-foreground">{d.hospital}</p>
                <p className="text-xs text-muted-foreground">{d.date} · {d.type}</p>
              </div>
              <span className="text-xs font-bold text-primary">{d.units}u</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}