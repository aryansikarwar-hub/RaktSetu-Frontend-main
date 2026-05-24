'use client';
import React, { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, Info, Clock, X } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'emergency',
    title: 'URGENT: O- Blood Needed',
    body: 'AIIMS New Delhi requires 4 units of O- blood immediately. Patient: post-accident trauma. Contact Dr. Mehta at 011-2658-8500.',
    time: '2 min ago',
    read: false,
    hospital: 'AIIMS New Delhi',
  },
  {
    id: 'notif-002',
    type: 'info',
    title: 'Donation Eligibility Update',
    body: 'You will be eligible to donate blood again on 15 May 2026 — 3 days from now. Schedule your appointment at Kokilaben Hospital.',
    time: '1 hr ago',
    read: false,
    hospital: null,
  },
  {
    id: 'notif-003',
    type: 'success',
    title: 'Donation Certificate Ready',
    body: 'Your RaktSetu Gold Donor certificate for the February 2026 donation is ready for download. You have donated 7 times.',
    time: '3 hr ago',
    read: true,
    hospital: null,
  },
  {
    id: 'notif-004',
    type: 'emergency',
    title: 'B- Blood Critical — Fortis Mumbai',
    body: 'B- blood stock at Fortis Mulund has reached critical level (8 units). 3 scheduled surgeries may be affected. Donors needed urgently.',
    time: '5 hr ago',
    read: true,
    hospital: 'Fortis Mulund',
  },
  {
    id: 'notif-005',
    type: 'info',
    title: 'Blood Camp: 18 May 2026',
    body: 'RaktSetu is organizing a blood donation camp at CSMT Mumbai. Register to participate and receive a free health check-up.',
    time: '1 day ago',
    read: true,
    hospital: null,
  },
  {
    id: 'notif-006',
    type: 'success',
    title: 'Profile Verified',
    body: 'Your donor profile has been verified by our medical team. You are now visible to hospitals in the Mumbai region.',
    time: '3 days ago',
    read: true,
    hospital: null,
  },
];

const typeConfig = {
  emergency: { icon: <AlertTriangle size={15} />, bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-900', iconColor: 'text-primary', dot: 'bg-primary' },
  info: { icon: <Info size={15} />, bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900', iconColor: 'text-blue-600', dot: 'bg-blue-500' },
  success: { icon: <CheckCircle2 size={15} />, bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-900', iconColor: 'text-green-600', dot: 'bg-green-500' },
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'emergency'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'emergency') return n.type === 'emergency';
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-foreground" />
          <h3 className="font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-medium text-primary hover:underline"
        >
          Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-muted rounded-lg p-0.5">
        {[
          { id: 'all' as const, label: 'All' },
          { id: 'unread' as const, label: `Unread (${unreadCount})` },
          { id: 'emergency' as const, label: 'Emergency' },
        ].map((tab) => (
          <button
            key={`notif-tab-${tab.id}`}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all duration-150 ${
              filter === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No notifications in this category</p>
          </div>
        )}
        {filtered.map((notif) => {
          const cfg = typeConfig[notif.type as keyof typeof typeConfig];
          return (
            <div
              key={notif.id}
              className={`relative group flex gap-3 p-3 rounded-xl border transition-all duration-150 ${
                notif.read ? 'bg-card border-border' : `${cfg.bg} ${cfg.border}`
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.read ? 'bg-muted text-muted-foreground' : `${cfg.bg} ${cfg.iconColor}`}`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs font-bold leading-tight ${notif.read ? 'text-foreground' : 'text-foreground'}`}>
                    {!notif.read && <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5 mb-0.5`} />}
                    {notif.title}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</span>
                    <button
                      onClick={() => dismiss(notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-foreground transition-all"
                      aria-label="Dismiss notification"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
                {notif.hospital && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock size={10} className="text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">{notif.hospital}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}