import React from 'react';
import { CheckCircle2, Clock, Award, MapPin } from 'lucide-react';
import BloodTypeBadge from '@/components/ui/BloodTypeBadge';
import { AuthUser } from '@/context/AuthContext';

interface WelcomeCardProps {
  user: AuthUser;
}

export default function WelcomeCard({ user }: WelcomeCardProps) {
  const donationDate = user.lastDonation ? new Date(user.lastDonation) : null;
  const daysSince = donationDate
    ? Math.floor((Date.now() - donationDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const eligibleIn = daysSince !== null ? Math.max(0, 90 - daysSince) : null;
  const isEligible = eligibleIn === 0;

  return (
    <div className="relative overflow-hidden rounded-3xl gradient-card-red text-white p-6 md:p-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-extrabold flex-shrink-0 border-2 border-white/30">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Welcome back</p>
            </div>
            <h1 className="text-2xl font-extrabold leading-tight">{user.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <BloodTypeBadge type={user.bloodType} size="sm" className="bg-white/20 text-white border-white/30" />
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <MapPin size={12} />
                {user.city}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                user.donorStatus === 'active' ? 'bg-green-400/20 text-green-200' : 'bg-amber-400/20 text-amber-200'
              }`}>
                <CheckCircle2 size={11} />
                {user.donorStatus === 'active' ? 'Active Donor' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>

        {/* Right stats */}
        <div className="flex gap-4 flex-wrap">
          <div className="bg-white/15 rounded-2xl px-5 py-4 text-center backdrop-blur-sm border border-white/20 min-w-24">
            <p className="text-2xl font-extrabold tabular-nums">7</p>
            <p className="text-xs text-white/70 font-medium mt-0.5">Total Donations</p>
          </div>
          <div className={`rounded-2xl px-5 py-4 text-center backdrop-blur-sm border border-white/20 min-w-24 ${
            isEligible ? 'bg-green-400/20' : 'bg-white/15'
          }`}>
            <div className="flex items-center justify-center gap-1 mb-0.5">
              {isEligible ? (
                <CheckCircle2 size={16} className="text-green-300" />
              ) : (
                <Clock size={16} className="text-white/70" />
              )}
            </div>
            {isEligible ? (
              <>
                <p className="text-sm font-extrabold text-green-300">Eligible!</p>
                <p className="text-xs text-white/70 font-medium">Ready to donate</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-extrabold tabular-nums">{eligibleIn}</p>
                <p className="text-xs text-white/70 font-medium">Days to eligible</p>
              </>
            )}
          </div>
          <div className="bg-white/15 rounded-2xl px-5 py-4 text-center backdrop-blur-sm border border-white/20 min-w-24">
            <Award size={20} className="mx-auto mb-1 text-yellow-300" />
            <p className="text-sm font-extrabold">Gold</p>
            <p className="text-xs text-white/70 font-medium">Donor Tier</p>
          </div>
        </div>
      </div>
    </div>
  );
}