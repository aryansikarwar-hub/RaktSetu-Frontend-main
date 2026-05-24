'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplets, Heart, ArrowRight, Shield, Clock, Users } from 'lucide-react';

const ROTATING_WORDS = ['Blood', 'Organs', 'Platelets', 'Plasma', 'Hope'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS?.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full blob-primary" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blob-primary" />
      </div>
      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white animate-bounce-gentle hidden lg:flex">
        <Droplets size={24} />
      </div>
      <div className="absolute bottom-32 left-20 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white animate-pulse-slow hidden lg:flex">
        <Heart size={20} />
      </div>
      <div className="relative max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 live-dot" />
              <span className="text-sm font-medium">Live Network Active — 847 donors online</span>
            </div>

            <h1 className="text-hero-xl font-extrabold leading-tight mb-3">
              Save Lives.
            </h1>
            <h1 className="text-hero-xl font-extrabold leading-tight mb-6">
              Donate{' '}
              <span
                className="text-yellow-300 inline-block transition-all duration-300"
                style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
              >
                {ROTATING_WORDS?.[wordIndex]}
              </span>{' '}
              &amp; Organs.
            </h1>

            <p className="text-hero-sm text-white/80 leading-relaxed mb-8 max-w-lg">
              India&apos;s most trusted real-time donor management platform. Connect with hospitals, find compatible donors, and respond to emergencies — in minutes, not days.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/user-dashboard" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-white/90 active:scale-[0.97] transition-all duration-150 shadow-lg">
                <Heart size={18} />
                Become a Donor
                <ArrowRight size={16} />
              </Link>
              <Link href="/find-blood" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl border border-white/40 hover:bg-white hover:text-primary active:scale-[0.97] transition-all duration-150 backdrop-blur-sm">
                <Droplets size={18} />
                Find Blood Now
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Shield size={14} />, text: 'Govt. Verified Hospitals' },
                { icon: <Clock size={14} />, text: 'Avg. 18 min response' },
                { icon: <Users size={14} />, text: '2.4L+ Registered Donors' },
              ]?.map((badge) => (
                <div key={`trust-${badge?.text}`} className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                  {badge?.icon}
                  {badge?.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Blood Type Cards Visual */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main card */}
              <div className="bg-card rounded-3xl p-6 shadow-card-lg">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live Blood Stock</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">Mumbai Region</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 live-dot" />
                    Live
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { type: 'A+', units: 124, status: 'available' },
                    { type: 'A-', units: 12, status: 'critical' },
                    { type: 'B+', units: 89, status: 'available' },
                    { type: 'B-', units: 8, status: 'critical' },
                    { type: 'O+', units: 203, status: 'available' },
                    { type: 'O-', units: 34, status: 'low' },
                    { type: 'AB+', units: 56, status: 'available' },
                    { type: 'AB-', units: 6, status: 'critical' },
                  ]?.map((item) => (
                    <div
                      key={`hero-bt-${item?.type}`}
                      className={`rounded-xl p-3 text-center ${
                        item?.status === 'critical' ?'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900'
                          : item?.status === 'low' ?'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900' :'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900'
                      }`}
                    >
                      <p className="text-xs font-bold text-foreground">{item?.type}</p>
                      <p className={`text-lg font-extrabold tabular-nums ${
                        item?.status === 'critical' ? 'text-red-600' : item?.status === 'low' ? 'text-amber-600' : 'text-green-600'
                      }`}>{item?.units}</p>
                      <p className="text-xs text-muted-foreground">units</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">Last updated: 2 minutes ago</p>
              </div>

              {/* Floating emergency card */}
              <div className="absolute -bottom-4 -left-8 bg-card rounded-2xl p-4 shadow-card-lg border-l-4 border-primary max-w-52">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Droplets size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">URGENT: O- Blood</p>
                    <p className="text-xs text-muted-foreground">AIIMS Delhi · 4 units needed</p>
                    <p className="text-xs text-primary font-semibold mt-1">3 donors responding →</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 720 0 0 40L0 60Z" fill="#f8f9fa" />
        </svg>
      </div>
    </section>
  );
}