'use client';
/**
 * NotificationsContext
 * ────────────────────────────────────────────────────────────────────────────
 * Navbar.tsx aur Providers.tsx isko import karte hain, lekin ye file repo me
 * commit nahi hui thi — isliye Vercel build "Module not found" de raha tha.
 *
 * Navbar exactly ye use karta hai:
 *   const { notifications, unreadCount, markRead } = useNotifications();
 *   markRead(n._id).catch(() => {})     ← markRead ka Promise return karna zaroori hai
 *   n._id · n.title · n.link · n.urgent · n.createdAt
 *
 * Data source (dono tumhare hi repo ke hain):
 *   - notificationsApi.list()      → GET  /api/notifications
 *   - notificationsApi.markRead()  → POST /api/notifications/:id/read
 *   - connectRealtime()            → ws://…/ws, backend `{ type:'notification', payload }` bhejta hai
 */
import React, {
  createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, ReactNode,
} from 'react';
import { notificationsApi } from '@/lib/api';
import { connectRealtime } from '@/lib/realtimeClient';
import { useAuth } from '@/context/AuthContext';

/** Backend Notification model ke fields. */
export interface AppNotification {
  _id: string;
  type?: 'emergency' | 'eligibility' | 'inventory' | 'system';
  title: string;
  body?: string;
  urgent?: boolean;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  /** Navbar isko `.catch()` karta hai — hamesha Promise return karta hai, kabhi reject nahi hota. */
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
  add: (n: Partial<AppNotification>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

/** API/WS se aaya raw object → hamesha ek predictable shape. */
function normalize(raw: any): AppNotification {
  return {
    _id: String(raw?._id ?? raw?.id ?? ''),
    type: raw?.type ?? 'system',
    title: raw?.title ?? 'Notification',
    body: raw?.body ?? '',
    urgent: Boolean(raw?.urgent),
    read: Boolean(raw?.read),
    link: raw?.link || '/',
    createdAt: raw?.createdAt ?? new Date().toISOString(),
  };
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef<{ disconnect: () => void } | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res: any = await notificationsApi.list();
      const list = (res?.notifications || []) as any[];
      setNotifications(list.map(normalize).filter((n) => n._id));
    } catch {
      // Backend down / 401 / endpoint missing — chup-chaap khaali list.
      // Navbar tab bhi theek render hota hai, dropdown bas khaali dikhta hai.
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login pe load karo, logout pe saaf kar do.
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    refresh();
  }, [user, refresh]);

  // Live push — backend `{ type: 'notification', payload }` bhejta hai.
  useEffect(() => {
    if (!user) return undefined;

    const conn = connectRealtime(user._id, (msg: any) => {
      if (!msg || msg.type !== 'notification' || !msg.payload) return;
      const incoming = normalize(msg.payload);
      if (!incoming._id) return;
      setNotifications((list) => {
        // Duplicate push ignore karo.
        if (list.some((n) => n._id === incoming._id)) return list;
        return [incoming, ...list];
      });
    });

    socketRef.current = conn;
    return () => {
      try { conn.disconnect(); } catch { /* ignore */ }
      socketRef.current = null;
    };
  }, [user]);

  /** Optimistic: UI turant update, server call background me. Kabhi reject nahi hota. */
  const markRead = useCallback(async (id: string) => {
    setNotifications((list) => list.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch {
      /* silent — local state pehle hi update ho chuka hai */
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    // Backend pe bulk endpoint nahi hai — ek-ek karke bhej dete hain.
    await Promise.all(unreadIds.map((id) => notificationsApi.markRead(id).catch(() => null)));
  }, [notifications]);

  const add = useCallback((n: Partial<AppNotification>) => {
    setNotifications((list) => [normalize({ _id: `local-${list.length + 1}`, ...n }), ...list]);
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications((list) => list.filter((n) => n._id !== id));
  }, []);

  const clear = useCallback(() => setNotifications([]), []);

  const value = useMemo<NotificationsContextValue>(() => ({
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    isLoading,
    markRead,
    markAllRead,
    refresh,
    add,
    remove,
    clear,
  }), [notifications, isLoading, markRead, markAllRead, refresh, add, remove, clear]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

/** Alias — agar kahin `NotificationProvider` (bina "s") import ho jaaye. */
export const NotificationProvider = NotificationsProvider;

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  // Provider ke bahar call ho to crash na ho — safe no-op value.
  if (!ctx) {
    return {
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      markRead: async () => {},
      markAllRead: async () => {},
      refresh: async () => {},
      add: () => {},
      remove: () => {},
      clear: () => {},
    };
  }
  return ctx;
}

export const useNotificationsContext = useNotifications;

export default NotificationsContext;