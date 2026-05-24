import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#16171b] text-white mt-20">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={36} />
              <span className="font-extrabold text-xl tracking-tight">
                Rakt<span className="text-accent">Setu</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              India&apos;s real-time blood and organ donor network. Connecting donors, hospitals, and recipients to save lives every day.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <FacebookIcon />, label: 'Facebook', href: '#' },
                { icon: <TwitterIcon />, label: 'Twitter', href: '#' },
                { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
                { icon: <LinkedinIcon />, label: 'LinkedIn', href: '#' },
              ]?.map((s) => (
                <a
                  key={`social-${s?.label}`}
                  href={s?.href}
                  aria-label={s?.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-150"
                >
                  {s?.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Find Donors', href: '/user-dashboard' },
                { label: 'Emergency Requests', href: '/emergency-page' },
                { label: 'Blood Stock', href: '/user-dashboard' },
                { label: 'Hospitals', href: '/user-dashboard' },
              ]?.map((link) => (
                <li key={`footer-link-${link?.label}`}>
                  <Link
                    href={link?.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blood Types */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-4">Blood Types Covered</h4>
            <div className="grid grid-cols-4 gap-2">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']?.map((bt) => (
                <div
                  key={`footer-bt-${bt}`}
                  className="bg-white/10 rounded-lg px-2 py-1.5 text-center text-xs font-bold text-white hover:bg-primary transition-colors duration-150 cursor-default"
                >
                  {bt}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">All blood types tracked in real-time across 8+ major hospitals</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-4">Emergency Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">1800-RAKTSETU</p>
                  <p className="text-xs text-gray-500">24/7 Emergency Helpline</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">help@raktsetu.in</p>
                  <p className="text-xs text-gray-500">Response within 1 hour</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Mumbai, Maharashtra</p>
                  <p className="text-xs text-gray-500">Serving all major Indian cities</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 RaktSetu India. All rights reserved. Built with{' '}
            <Heart size={12} className="inline text-primary" /> to save lives.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}