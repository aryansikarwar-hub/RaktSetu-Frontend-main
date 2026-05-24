'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'donor' | 'hospital' | 'coordinator' | 'admin';
  bloodType: string;
  city: string;
  donorStatus: 'active' | 'inactive' | 'pending';
  lastDonation: string | null;
  phone: string;
  totalDonations?: number;
  points?: number;
  tier?: string;
  reliability?: number;
  available?: boolean;
  verified?: boolean;
  hospitalName?: string;
  licenseNumber?: string;
  designation?: string;
}

interface RegisterPayload {
  name: string; email: string; password: string;
  role?: 'donor' | 'hospital' | 'admin';
  bloodType?: string; city: string; phone?: string;
  hospitalName?: string; licenseNumber?: string; designation?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await authApi.me();
        if (mounted && u) setUser(u as AuthUser);
      } catch {
        /* not logged in */
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true); setError(null);
    try {
      const { user: u } = await authApi.login(email, password);
      setUser(u as AuthUser);
      return true;
    } catch (e: any) {
      setError(e.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true); setError(null);
    try {
      const { user: u } = await authApi.register(payload);
      setUser(u as AuthUser);
      return true;
    } catch (e: any) {
      setError(e.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user, isAdmin: user?.role === 'admin', isAuthenticated: Boolean(user),
        login, register, logout, isLoading, error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
