import React from 'react';
import { Droplets, Bell, UserCheck, Award, Building2, HeartPulse } from 'lucide-react';

const ACTIVITIES = [
  {
    id: 'act-001',
    icon: <Droplets size={16} />,
    iconBg: 'bg-primary text-white',
    title: 'Blood Donation Completed',
    detail: '1 unit of O+ whole blood donated at Kokilaben Hospital, Mumbai',
    time: '14 Feb 2026, 10:30 AM',
    tag: 'Donation',
    tagColor: 'bg-red-50 dark:bg-red-950/30 text-primary border-red-200 dark:border-red-900',
  },
  {
    id: 'act-002',
    icon: <Bell size={16} />,
    iconBg: 'bg-amber-500 text-white',
    title: 'Emergency Alert Responded',
    detail: 'You responded to an O+ emergency at Lilavati Hospital. Your response helped save a patient.',
    time: '10 Feb 2026, 3:14 PM',
    tag: 'Emergency',
    tagColor: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900',
  },
  {
    id: 'act-003',
    icon: <Award size={16} />,
    iconBg: 'bg-yellow-500 text-white',
    title: 'Gold Donor Tier Achieved',
    detail: 'You have reached Gold Donor status after 7 successful donations. Certificate issued.',
    time: '14 Feb 2026, 11:00 AM',
    tag: 'Achievement',
    tagColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  {
    id: 'act-004',
    icon: <UserCheck size={16} />,
    iconBg: 'bg-green-600 text-white',
    title: 'Profile Verified by Medical Team',
    detail: 'Your health records and blood type have been verified by RaktSetu medical coordinators.',
    time: '01 Feb 2026, 9:00 AM',
    tag: 'Verification',
    tagColor: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900',
  },
  {
    id: 'act-005',
    icon: <Building2 size={16} />,
    iconBg: 'bg-blue-600 text-white',
    title: 'Hospital Added to Network',
    detail: 'Kokilaben Dhirubhai Ambani Hospital, Mumbai joined the RaktSetu network and is now tracking your blood type.',
    time: '28 Jan 2026, 2:45 PM',
    tag: 'Network',
    tagColor: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900',
  },
  {
    id: 'act-006',
    icon: <HeartPulse size={16} />,
    iconBg: 'bg-purple-600 text-white',
    title: 'Platelet Donation Completed',
    detail: '2 units of platelets donated at Breach Candy Hospital for a cancer patient.',
    time: '22 Jun 2025, 11:20 AM',
    tag: 'Donation',
    tagColor: 'bg-red-50 dark:bg-red-950/30 text-primary border-red-200 dark:border-red-900',
  },
];

export default function ActivityTimeline() {
  return (
    <div className="card p-6">
      <h3 className="font-bold text-foreground mb-6">Activity Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-6">
          {ACTIVITIES?.map((act) => (
            <div key={act?.id} className="relative flex gap-4 pl-2">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl ${act?.iconBg} flex items-center justify-center flex-shrink-0 z-10 shadow-sm`}>
                {act?.icon}
              </div>
              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-foreground">{act?.title}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${act?.tagColor}`}>{act?.tag}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{act?.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{act?.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}