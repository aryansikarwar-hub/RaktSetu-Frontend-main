/**
 * Client-side mirror of the backend's blood logic + rule engines.
 * Used ONLY in mock mode (NEXT_PUBLIC_USE_MOCK=true) so the AI features work
 * with zero backend. In real mode these calls go to the Express API instead.
 */

export const BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const CAN_DONATE_TO: Record<string, string[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export const CAN_RECEIVE_FROM: Record<string, string[]> = BLOOD_TYPES.reduce((acc, r) => {
  acc[r] = BLOOD_TYPES.filter((d) => CAN_DONATE_TO[d].includes(r));
  return acc;
}, {} as Record<string, string[]>);

export const isCompatible = (donor: string, recipient: string) =>
  Boolean(CAN_DONATE_TO[donor]?.includes(recipient));

export const donorsForRecipient = (r: string) => CAN_RECEIVE_FROM[r] || [];

export const DONATION_INTERVAL_DAYS = 90;

export function daysSince(dateStr?: string | null) {
  if (!dateStr) return null;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
}

export function donationEligibility(lastDonation?: string | null) {
  const since = daysSince(lastDonation);
  if (since === null) return { eligible: true, daysRemaining: 0 };
  const remaining = Math.max(0, DONATION_INTERVAL_DAYS - since);
  return { eligible: remaining === 0, daysRemaining: remaining };
}

const CITY_COORDS: Record<string, [number, number]> = {
  Mumbai: [72.8777, 19.076], Delhi: [77.209, 28.6139], 'New Delhi': [77.209, 28.6139],
  Bangalore: [77.5946, 12.9716], Chennai: [80.2707, 13.0827], Pune: [73.8567, 18.5204],
  Hyderabad: [78.4867, 17.385], Kolkata: [88.3639, 22.5726], Indore: [75.8577, 22.7196],
  Ahmedabad: [72.5714, 23.0225], Jaipur: [75.7873, 26.9124],
};
const cityCoords = (c?: string) => (c ? CITY_COORDS[c] : null) || null;

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]), dLng = toRad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10;
}

/* ── Donor match (mirrors backend rulesEngine) ── */
export function matchDonors(request: any, donors: any[] = []) {
  const reqCoords = request.coordinates || cityCoords(request.city);
  const matches = donors
    .filter((d) => isCompatible(d.bloodType, request.bloodType))
    .map((d) => {
      const reasons: string[] = [];
      let score = 0;
      if (d.bloodType === request.bloodType) { score += 35; reasons.push('Exact blood-type match'); }
      else { score += 22; reasons.push(`${d.bloodType} compatible with ${request.bloodType}`); }
      const elig = donationEligibility(d.lastDonation);
      if (elig.eligible) { score += 25; reasons.push('Eligible now'); }
      else { score += Math.max(0, 12 - elig.daysRemaining / 10); reasons.push(`Eligible in ${elig.daysRemaining}d`); }
      const dCoords = d.coordinates || cityCoords(d.city);
      let distanceKm: number | null = null;
      if (reqCoords && dCoords) {
        distanceKm = haversineKm(reqCoords, dCoords);
        if (distanceKm <= 5) { score += 20; reasons.push('Within 5 km'); }
        else if (distanceKm <= 15) { score += 14; reasons.push('Within 15 km'); }
        else if (distanceKm <= 40) { score += 8; }
        else score += 2;
      } else if (d.city === request.city) { score += 14; reasons.push('Same city'); }
      const reliability = d.reliability ?? 80;
      score += (reliability / 100) * 12;
      if (reliability >= 90) reasons.push('Highly reliable');
      if (d.available === false) { score -= 25; reasons.push('Unavailable'); }
      return {
        donorId: d._id, name: d.name, phone: d.phone || null, bloodType: d.bloodType, city: d.city, distanceKm,
        eligible: elig.eligible, eligibleInDays: elig.daysRemaining, reliability,
        score: Math.round(Math.min(100, Math.max(0, score))), reasons,
      };
    })
    .sort((a, b) => b.score - a.score);
  return { totalCompatible: matches.length, matches: matches.slice(0, 20), engine: 'rules' };
}

/* ── Eligibility screening ── */
export function screenEligibility(a: any = {}) {
  const blockers: string[] = [], deferrals: string[] = [], notes: string[] = [];
  const age = Number(a.age);
  if (!Number.isNaN(age)) {
    if (age < 18) blockers.push('Must be at least 18 years old');
    if (age > 65) deferrals.push('Donors over 65 need physician clearance');
  }
  const weight = Number(a.weightKg);
  if (!Number.isNaN(weight) && weight < 50) blockers.push('Minimum weight is 50 kg');
  if (a.recentIllness) deferrals.push('Recent fever/illness — wait until fully recovered');
  if (a.recentTattoo) deferrals.push('Recent tattoo/piercing — defer 6 months');
  if (a.recentSurgery) deferrals.push('Recent major surgery — defer until cleared');
  if (a.pregnant) deferrals.push('Pregnant/recently delivered — defer');
  if (a.recentDonationDays !== undefined && a.recentDonationDays !== '' && Number(a.recentDonationDays) < 90)
    deferrals.push(`Last donation ${a.recentDonationDays} days ago — wait until 90 days`);
  if (a.chronicCondition) deferrals.push('Chronic condition — needs medical review');
  if (a.medications) notes.push('Some medications affect eligibility — disclose at the centre');
  if (a.recentAlcohol) notes.push('Avoid alcohol 24h before donating');

  let verdict: 'eligible' | 'defer' | 'not_eligible' = 'eligible';
  if (blockers.length) verdict = 'not_eligible';
  else if (deferrals.length) verdict = 'defer';
  const confidence = blockers.length ? 0.95 : deferrals.length ? 0.7 : 0.85;
  const summary =
    verdict === 'eligible'
      ? 'Based on your answers, you appear eligible to donate. Final confirmation happens at the centre with a quick hemoglobin & vitals check.'
      : verdict === 'defer'
      ? 'You may need to wait before donating. Please review the points below.'
      : 'Unfortunately you are not currently eligible to donate.';
  return {
    verdict, confidence, summary, blockers, deferrals, notes,
    disclaimer: 'This is an informational pre-screen, not medical advice. The donation centre makes the final decision.',
    engine: 'rules',
  };
}

/* ── Demand forecast ── */
const POP_DEMAND_WEIGHT: Record<string, number> = {
  'O+': 1.0, 'B+': 0.95, 'A+': 0.8, 'AB+': 0.5, 'O-': 0.7, 'B-': 0.55, 'A-': 0.5, 'AB-': 0.35,
};
export function forecastDemand(city: string, history: any[] = []) {
  const byType: Record<string, number> = {};
  history.forEach((h) => { byType[h.bloodType] = (byType[h.bloodType] || 0) + (h.units || 0); });
  const forecast = Object.keys(POP_DEMAND_WEIGHT).map((t) => {
    const stock = byType[t] ?? 0;
    const dailyBurn = Math.max(1, Math.round(POP_DEMAND_WEIGHT[t] * 18));
    const daysOfSupply = Math.round((stock / dailyBurn) * 10) / 10;
    const risk = daysOfSupply < 2 ? 'critical' : daysOfSupply < 5 ? 'low' : 'stable';
    return {
      bloodType: t, currentStock: stock, estDailyUse: dailyBurn, daysOfSupply, risk,
      recommendation: risk === 'critical' ? 'Launch a targeted donor drive immediately'
        : risk === 'low' ? 'Schedule a donation camp this week' : 'Supply healthy — maintain routine collection',
    };
  }).sort((x, y) => x.daysOfSupply - y.daysOfSupply);
  return {
    city, horizonDays: 7, generatedAt: new Date().toISOString(), forecast,
    criticalTypes: forecast.filter((f) => f.risk === 'critical').map((f) => f.bloodType), engine: 'rules',
  };
}

/* ── Triage ── */
export function triageRequest(request: any = {}) {
  let score = 0; const reasons: string[] = [];
  score += ({ critical: 45, urgent: 28, moderate: 12 } as any)[request.urgency] ?? 20;
  reasons.push(`Urgency: ${request.urgency || 'unknown'}`);
  const units = Number(request.units) || 1;
  if (units >= 5) { score += 20; reasons.push(`Large requirement (${units} units)`); }
  else if (units >= 3) { score += 12; reasons.push(`${units} units needed`); }
  else score += 5;
  const pool = donorsForRecipient(request.bloodType).length;
  if (pool <= 2) { score += 18; reasons.push(`Rare type (${request.bloodType})`); }
  else if (pool <= 4) { score += 10; reasons.push(`Limited donor pool for ${request.bloodType}`); }
  const age = Number(request.patientAge);
  if (!Number.isNaN(age) && (age <= 5 || age >= 70)) { score += 10; reasons.push('Vulnerable patient age'); }
  score = Math.round(Math.min(100, score));
  const triageLabel = score >= 75 ? 'P1 — Immediate' : score >= 50 ? 'P2 — High' : score >= 30 ? 'P3 — Standard' : 'P4 — Routine';
  return { priorityScore: score, triageLabel, triageReasons: reasons, engine: 'rules' };
}