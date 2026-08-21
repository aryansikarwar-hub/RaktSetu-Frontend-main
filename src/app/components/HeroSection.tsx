import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, Droplets, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-card-red text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/30 pointer-events-none" />
      <div className="relative max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-20 lg:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-white live-dot" />
            <span className="text-xs font-bold uppercase tracking-widest">Real-Time Donor Network</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
            Every Drop Counts. Every Donor Matters.
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
            India is most trusted real-time donor management platform. Connect with hospitals, find compatible donors, and respond to emergencies in minutes, not days.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/user-dashboard" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-white/90 active:scale-95 transition-all duration-150 shadow-lg">
              <Heart size={18} />
              Become a Donor
              <ArrowRight size={16} />
            </Link>
            <Link href="/emergency-page" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl border border-white/40 hover:bg-white hover:text-primary active:scale-95 transition-all duration-150 backdrop-blur-sm">
              <Droplets size={18} />
              View Emergencies
            </Link>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Shield size={16} />
              Govt. Verified Hospitals
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Heart size={16} />
              2,47,832 Registered Donors
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}