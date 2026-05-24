import React, { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background gradient-mesh flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
