'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  Menu, X, Home, AlertTriangle, LayoutDashboard, LogOut, LogIn, UserPlus,
  ChevronDown, Bell, Sun, Moon, Activity, Stethoscope, Search, Award,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import AuthModal from '@/components/AuthModal';

interface NavItem { label: string; href: string; icon: React.ReactNode; }

const publicNav: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home size={16} /> },
  { label: 'Eligibility', href: '/eligibility', icon: <Stethoscope size={16} /> },
  { label: 'Emergencies', href: '/emergency-page', icon: <AlertTriangle size={16} /> },
];

// Navigation shown to a logged-in DONOR.
// Donors can view emergencies (to respond) and check their own eligibility —
// but they do NOT get "Find Blood" (hospital-only) or "Forecast" (hospital/admin).
const donorNav: NavItem[] = [
  { label: 'Dashboard', href: '/user-dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Eligibility', href: '/eligibility', icon: <Stethoscope size={16} /> },
  { label: 'Emergencies', href: '/emergency-page', icon: <AlertTriangle size={16} /> },
];

// Navigation shown to a logged-in HOSPITAL.
const hospitalNav: NavItem[] = [
  { label: 'Dashboard', href: '/user-dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Find Blood', href: '/find-blood', icon: <Search size={16} /> },
  { label: 'Forecast', href: '/forecast', icon: <Activity size={16} /> },
  { label: 'Emergencies', href: '/emergency-page', icon: <AlertTriangle size={16} /> },
];

// Navigation shown to a logged-in ADMIN — oversees the whole network.
const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/user-dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Find Blood', href: '/find-blood', icon: <Search size={16} /> },
  { label: 'Forecast', href: '/forecast', icon: <Activity size={16} /> },
  { label: 'Emergencies', href: '/emergency-page', icon: <AlertTriangle size={16} /> },
];

function navForRole(role?: string): NavItem[] {
  if (role === 'hospital') return hospitalNav;
  if (role === 'admin') return adminNav;
  return donorNav;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navItems = user ? navForRole(user.role) : publicNav;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const openAuth = (mode: 'login' | 'register') => { setAuthMode(mode); setAuthOpen(true); };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-card border-b border-border' : 'bg-card/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <AppLogo size={36} />
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                Rakt<span className="text-primary">Setu</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={`nav-${item.href}`}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user ? (
                <>
                  <div className="relative">
                    <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all" aria-label="Notifications">
                      <Bell size={20} />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-2xl border border-border shadow-card-lg z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                          <span className="font-semibold text-sm">Notifications</span>
                          <span className="text-xs text-muted-foreground">3 unread</span>
                        </div>
                        {[
                          { id: 'n1', text: 'Emergency: O- blood needed at AIIMS Delhi', time: '2 min ago', urgent: true, href: '/emergency-page' },
                          { id: 'n2', text: 'Your donation eligibility restores in 3 days', time: '1 hr ago', urgent: false, href: '/eligibility' },
                          { id: 'n3', text: 'Kokilaben Hospital updated blood stock', time: '3 hr ago', urgent: false, href: '/user-dashboard' },
                        ].map((n) => (
                          <Link
                            key={n.id}
                            href={n.href}
                            onClick={() => setNotifOpen(false)}
                            className="block px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-2">
                              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.urgent ? 'bg-primary' : 'bg-border'}`} />
                              <div>
                                <p className="text-sm text-foreground leading-snug">{n.text}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <Link href="/emergency-page" onClick={() => setNotifOpen(false)} className="block px-4 py-2.5 text-center text-xs font-semibold text-primary hover:bg-primary/5 transition-colors">
                          View all emergencies →
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="relative pl-2 border-l border-border">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-8 h-8 rounded-full gradient-card-red flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{user.name.charAt(0)}</div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-foreground leading-tight">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.bloodType} · {user.city}</p>
                      </div>
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-2xl border border-border shadow-card-lg z-50 overflow-hidden">
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-sm font-semibold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email || `${user.bloodType} · ${user.city}`}</p>
                          </div>
                          <div className="py-1">
                            <Link href="/user-dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                              <LayoutDashboard size={16} /> My Dashboard
                            </Link>
                            {user.role === 'donor' && (
                              <Link href="/badges" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                                <Award size={16} /> Badges & Certificate
                              </Link>
                            )}
                            <Link href="/eligibility" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                              <Stethoscope size={16} /> Check Eligibility
                            </Link>
                          </div>
                          <div className="py-1 border-t border-border">
                            <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors">
                              <LogOut size={16} /> Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                    <LogOut size={15} />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => openAuth('login')} className="btn-ghost text-sm"><LogIn size={15} /> Login</button>
                  <button onClick={() => openAuth('register')} className="btn-primary text-sm py-2 px-4"><UserPlus size={15} /> Register</button>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:bg-muted" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-card shadow-card-lg transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <span className="font-extrabold text-lg text-foreground">Rakt<span className="text-primary">Setu</span></span>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"><X size={20} /></button>
          </div>

          {user && (
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-card-red flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.bloodType} · {user.city}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <Link key={`mobile-nav-${item.href}`} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                {item.icon}{item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-border">
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-all">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <div className="space-y-2">
                <button onClick={() => { openAuth('register'); setMobileOpen(false); }} className="btn-primary w-full">Get Started</button>
                <button onClick={() => { openAuth('login'); setMobileOpen(false); }} className="btn-secondary w-full">Login</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-16" />
      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onSwitchMode={setAuthMode} />
    </>
  );
}