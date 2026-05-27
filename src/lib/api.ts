/**
 * ───────────────────────────────────────────────────────────────────────────
 *  API CLIENT  —  the single gateway between the UI and the backend.
 * ───────────────────────────────────────────────────────────────────────────
 *  When NEXT_PUBLIC_USE_MOCK=true the methods resolve from local mock data and
 *  the client-side rule engines, so the whole app works with NO backend.
 *  Flip the env to "false" and every method hits the real Express API instead —
 *  the component code never changes.
 */
import {
  MOCK_DONORS, MOCK_HOSPITALS, MOCK_EMERGENCIES, MOCK_STATS, MOCK_USERS,
} from './mockData';
import {
  matchDonors as clientMatch, screenEligibility as clientScreen,
  forecastDemand as clientForecast, triageRequest as clientTriage,
  CAN_DONATE_TO, donorsForRecipient, donationEligibility,
} from './bloodClient';
import { chat as clientChat, SUGGESTED_QUESTIONS } from './chatClient';

export const USE_MOCK =
  (process.env.NEXT_PUBLIC_USE_MOCK ?? 'true').toLowerCase() !== 'false';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'raktsetu_token';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  if (typeof window !== 'undefined') window.localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data as T;
}

/* ─────────────────────────────── AUTH ─────────────────────────────── */
export const authApi = {
  async login(email: string, password: string) {
    if (USE_MOCK) {
      await delay(600);
      const user = MOCK_USERS.find((u) => u.email === email.toLowerCase());
      if (!user) throw new Error('Invalid credentials');
      const token = `mock.${user._id}`;
      setToken(token);
      return { user, token };
    }
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(data.token);
    return data;
  },

  async register(payload: Record<string, unknown>) {
    if (USE_MOCK) {
      await delay(700);
      const role = (payload.role as string) || 'donor';
      const user = {
        _id: `mock_${Date.now()}`, role, donorStatus: 'active', available: true,
        totalDonations: 0, points: 0, tier: 'Bronze', reliability: 80, verified: false,
        lastDonation: null, bloodType: '', ...payload,
      };
      const token = `mock.${user._id}`;
      setToken(token);
      // make this user discoverable by authApi.me() within the session
      MOCK_USERS.push(user as any);
      return { user, token };
    }
    const data = await request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    setToken(data.token);
    return data;
  },

  async me() {
    if (USE_MOCK) {
      const token = getToken();
      if (!token) return null;
      const id = token.replace('mock.', '');
      return MOCK_USERS.find((u) => u._id === id) || MOCK_USERS[0];
    }
    const data = await request('/auth/me');
    return data.user;
  },

  logout() { clearToken(); },
};

/* ─────────────────────────────── DONORS ─────────────────────────────── */
export const donorApi = {
  async search(params: { bloodType?: string; city?: string; available?: boolean; compatibleWith?: string } = {}) {
    if (USE_MOCK) {
      await delay(300);
      let donors = [...MOCK_DONORS] as any[];
      if (params.bloodType) donors = donors.filter((d) => d.bloodType === params.bloodType);
      if (params.city) donors = donors.filter((d) => d.city === params.city);
      if (params.available !== undefined) donors = donors.filter((d) => d.available === params.available);
      if (params.compatibleWith) {
        const valid = donorsForRecipient(params.compatibleWith);
        donors = donors.filter((d) => valid.includes(d.bloodType));
      }
      donors = donors.map((d) => {
        const e = donationEligibility(d.lastDonation);
        return { ...d, eligible: e.eligible, eligibleInDays: e.daysRemaining };
      });
      return { count: donors.length, donors };
    }
    const qs = new URLSearchParams(params as any).toString();
    return request(`/donors?${qs}`);
  },

  compatibility(type: string) {
    if (USE_MOCK) {
      return Promise.resolve({
        bloodType: type, canDonateTo: CAN_DONATE_TO[type] || [], canReceiveFrom: donorsForRecipient(type),
      });
    }
    return request(`/donors/compatibility/${type}`);
  },
};

/* ─────────────────────────────── DONATIONS (history) ─────────────────────────────── */
export const donationApi = {
  // Donation history for the logged-in donor.
  // In mock mode it builds a believable history from the donor's own profile,
  // so the "My Donations" page works with NO backend. With USE_MOCK=false it
  // calls GET /api/donors/me/donations (add that route when you're ready).
  async myHistory(user?: { bloodType?: string; city?: string; totalDonations?: number; lastDonation?: string | null }) {
    if (USE_MOCK) {
      await delay(350);

      const bloodType = user?.bloodType || 'O+';
      const city = user?.city || 'Mumbai';
      const total = user?.totalDonations ?? 3;
      const last = user?.lastDonation ? new Date(user.lastDonation) : new Date();

      const HOSPITALS = [
        'AIIMS', 'Apollo Hospital', 'Fortis Hospital', 'Kokilaben Hospital',
        'Lilavati Hospital', 'Max Super Speciality', 'Manipal Hospital',
      ];
      const TYPES = ['Whole Blood', 'Platelets', 'Plasma'];

      // Generate `total` past donations, ~92 days apart, newest first.
      const donations = Array.from({ length: Math.max(0, total) }).map((_, i) => {
        const d = new Date(last);
        d.setDate(d.getDate() - i * 92);
        return {
          id: `mock_don_${i}`,
          date: d.toISOString(),
          hospital: `${HOSPITALS[i % HOSPITALS.length]}, ${city}`,
          city,
          bloodType,
          units: 1,
          donationType: TYPES[i % TYPES.length],
          pointsAwarded: 50,
        };
      });

      return { count: donations.length, donations };
    }

    return request('/donors/me/donations');
  },
};

/* ─────────────────────────────── HOSPITALS ─────────────────────────────── */
export const hospitalApi = {
  async list(city?: string) {
    if (USE_MOCK) {
      await delay(250);
      const hospitals = city ? MOCK_HOSPITALS.filter((h) => h.city === city) : MOCK_HOSPITALS;
      return { count: hospitals.length, hospitals };
    }
    return request(`/hospitals${city ? `?city=${city}` : ''}`);
  },

  async aggregateInventory(city?: string) {
    if (USE_MOCK) {
      const hospitals = city ? MOCK_HOSPITALS.filter((h) => h.city === city) : MOCK_HOSPITALS;
      const totals: Record<string, number> = {};
      hospitals.forEach((h) => h.inventory.forEach((i: any) => { totals[i.bloodType] = (totals[i.bloodType] || 0) + i.units; }));
      const inventory = Object.entries(totals).map(([bloodType, units]) => ({
        bloodType, units, status: units < 100 ? 'critical' : units < 500 ? 'low' : 'available',
      }));
      return { inventory };
    }
    return request(`/hospitals/inventory/aggregate${city ? `?city=${city}` : ''}`);
  },
};

/* ─────────────────────────────── EMERGENCIES ─────────────────────────────── */
export const emergencyApi = {
  async list(params: { status?: string; city?: string } = {}) {
    if (USE_MOCK) {
      await delay(300);
      let list = [...MOCK_EMERGENCIES] as any[];
      if (params.status) list = list.filter((e) => e.status === params.status);
      if (params.city) list = list.filter((e) => e.city === params.city);
      return { count: list.length, emergencies: list };
    }
    const qs = new URLSearchParams(params as any).toString();
    return request(`/emergencies?${qs}`);
  },

  async create(payload: Record<string, unknown>) {
    if (USE_MOCK) {
      await delay(1200);
      const triage = clientTriage(payload);
      const emergency = { _id: `mock_${Date.now()}`, status: 'open', respondersCount: 0, createdAt: new Date().toISOString(), ...payload, ...triage };
      MOCK_EMERGENCIES.unshift(emergency as any);
      return { emergency, triage };
    }
    return request('/emergencies', { method: 'POST', body: JSON.stringify(payload) });
  },

  async matches(id: string) {
    if (USE_MOCK) {
      await delay(500);
      const e = MOCK_EMERGENCIES.find((x) => x._id === id);
      if (!e) throw new Error('Emergency not found');
      return clientMatch({ bloodType: e.bloodType, city: e.city, urgency: e.urgency }, MOCK_DONORS);
    }
    return request(`/emergencies/${id}/matches`);
  },

  // Fetch a single emergency by id (used by the agreement page).
  async get(id: string) {
    if (USE_MOCK) {
      await delay(200);
      const e = MOCK_EMERGENCIES.find((x) => x._id === id);
      if (!e) throw new Error('Emergency not found');
      return { emergency: e };
    }
    // Backend has no single-get route; fetch the open list and find it.
    const res = await request(`/emergencies`);
    const found = (res.emergencies || []).find((x: any) => x._id === id);
    if (!found) throw new Error('Emergency not found');
    return { emergency: found };
  },

  // A donor pledges/commits to respond to an emergency.
  async respond(id: string) {
    if (USE_MOCK) {
      await delay(700);
      const e = MOCK_EMERGENCIES.find((x) => x._id === id) as any;
      if (e) { e.respondersCount = (e.respondersCount || 0) + 1; e.status = 'matched'; }
      return { success: true, emergency: e };
    }
    return request(`/emergencies/${id}/respond`, { method: 'POST', body: JSON.stringify({}) });
  },
};

/* ─────────────────────────────── AI ─────────────────────────────── */
export const aiApi = {
  async screenEligibility(answers: Record<string, unknown>) {
    if (USE_MOCK) { await delay(900); return clientScreen(answers); }
    return request('/ai/eligibility', { method: 'POST', body: JSON.stringify(answers) });
  },

  async forecast(city: string) {
    if (USE_MOCK) {
      await delay(700);
      const hospitals = MOCK_HOSPITALS.filter((h) => h.city === city || city === 'All');
      const history: any[] = [];
      hospitals.forEach((h) => h.inventory.forEach((i: any) => history.push(i)));
      return clientForecast(city, history);
    }
    return request(`/ai/forecast?city=${encodeURIComponent(city)}`);
  },

  async match(payload: { bloodType: string; city?: string; urgency?: string }) {
    if (USE_MOCK) { await delay(500); return clientMatch(payload, MOCK_DONORS); }
    return request('/ai/match', { method: 'POST', body: JSON.stringify(payload) });
  },

  status() {
    if (USE_MOCK) return Promise.resolve({ mode: 'rules (client)', features: ['match', 'eligibility', 'forecast', 'triage'] });
    return request('/ai/status');
  },

  async describeEmergency(details: Record<string, unknown>) {
    if (USE_MOCK) {
      await delay(600);
      const d: any = details;
      return { description: `${d.units || ''} unit(s) of ${d.bloodType || 'blood'} needed at ${d.hospital || 'hospital'}${d.reason ? ` — ${d.reason}` : ''}. Urgency: ${d.urgency || 'urgent'}.` };
    }
    return request('/ai/describe-emergency', { method: 'POST', body: JSON.stringify(details) });
  },

  async outreach(donor: Record<string, unknown>, req2: Record<string, unknown>) {
    if (USE_MOCK) {
      await delay(600);
      const name = (donor as any).name?.split(' ')[0] || 'there';
      return { message: `Hi ${name}, ${(req2 as any).bloodType || 'blood'} is urgently needed at ${(req2 as any).hospital || 'a nearby hospital'}. You're a match — please respond if you can help. Thank you! 🩸` };
    }
    return request('/ai/outreach', { method: 'POST', body: JSON.stringify({ donor, request: req2 }) });
  },

  async eligibilityChat(message: string, history: { role: string; text: string }[] = []) {
    if (USE_MOCK) {
      await delay(700);
      const m = message.toLowerCase();
      const hints: string[] = [];
      if (/(fever|cold|flu|ill|sick)/.test(m)) hints.push('Recent illness usually means waiting until fully recovered (~2 weeks).');
      if (/(tattoo|piercing)/.test(m)) hints.push('A recent tattoo/piercing typically defers donation up to 6 months.');
      if (/(pregnan|delivery)/.test(m)) hints.push('Pregnancy/recent delivery defers donation until a doctor clears you.');
      if (/(alcohol|drink)/.test(m)) hints.push('Avoid donating within 24 hours of alcohol.');
      const base = hints.length ? hints.join(' ') : 'Tell me your age, weight, last donation date, and any recent illness, tattoo, surgery, pregnancy, or medication.';
      return { answer: `${base} (Informational only — not medical advice.)` };
    }
    return request('/ai/eligibility-chat', { method: 'POST', body: JSON.stringify({ message, history }) });
  },
};

/* ─────────────────────────────── STATS ─────────────────────────────── */
export const statsApi = {
  async get() {
    if (USE_MOCK) { await delay(200); return { stats: MOCK_STATS }; }
    return request('/stats');
  },
};

/* ─────────────────────────────── CHAT (RAG) ─────────────────────────────── */
export const chatApi = {
  async suggestions(): Promise<string[]> {
    if (USE_MOCK) return SUGGESTED_QUESTIONS;
    const res = await request('/ai/chat/suggestions');
    return res.suggestions || [];
  },

  async send(message: string, history: any[] = []) {
    if (USE_MOCK) {
      await delay(650);
      const top = MOCK_EMERGENCIES[0];
      const live = {
        donors: MOCK_STATS.registeredDonors,
        hospitals: MOCK_STATS.hospitalsConnected,
        totalUnits: MOCK_STATS.bloodUnitsAvailable,
        openEmergencies: MOCK_EMERGENCIES.length,
        topEmergency: top ? { bloodType: top.bloodType, units: top.units, hospital: top.hospital, city: top.city } : null,
      };
      return clientChat(message, live);
    }
    return request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) });
  },
};