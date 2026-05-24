import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import '../styles/tailwind.css';
import Providers from '@/components/Providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#c0392b',
};

export const metadata: Metadata = {
  title: 'RaktSetu — Real-Time Blood & Organ Donor Network India',
  description:
    'RaktSetu connects blood and organ donors with hospitals across India in real time — AI-powered donor matching, eligibility screening, and live inventory to reduce preventable deaths.',
  keywords: ['blood donation', 'organ donation', 'India', 'donor network', 'emergency blood', 'RaktSetu'],
  icons: { icon: [{ url: '/favicon.ico', type: 'image/x-icon' }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body className={plusJakartaSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
