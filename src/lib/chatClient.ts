/**
 * Client-side mirror of the backend RAG chatbot (chatRagEngine + knowledgeBase).
 * Used ONLY in mock mode (NEXT_PUBLIC_USE_MOCK=true) so the chatbot works with
 * zero backend. In real mode, chat goes to POST /api/ai/chat instead.
 *
 * Retrieval-Augmented Generation, deterministic:
 *   retrieve relevant KB entries → augment with live data → grounded answer.
 */

interface KBEntry { id: string; topic: string; keywords: string[]; answer: string; }

export const KNOWLEDGE_BASE: KBEntry[] = [
  { id: 'kb-eligibility-basic', topic: 'eligibility',
    keywords: ['eligible', 'eligibility', 'can i donate', 'who can donate', 'requirements', 'qualify', 'age', 'weight'],
    answer: 'To donate blood in India you generally must be 18–65 years old, weigh at least 50 kg, and be in good health with normal hemoglobin. You can use RaktSetu’s AI Eligibility Pre-Screen (Eligibility page) to check in under a minute before visiting a centre.' },
  { id: 'kb-frequency', topic: 'eligibility',
    keywords: ['how often', 'frequency', 'gap between', 'how long to wait', 'days between', 'next donation', '90 days', 'three months', 'donate again'],
    answer: 'Whole blood can be donated once every 90 days (about 3 months). Platelets and plasma have shorter intervals (around 2 weeks). RaktSetu tracks your last donation and shows a countdown to your next eligible date on your dashboard.' },
  { id: 'kb-compatibility', topic: 'compatibility',
    keywords: ['compatible', 'compatibility', 'who can receive', 'universal donor', 'universal recipient', 'blood type', 'match types', 'o negative', 'ab positive'],
    answer: 'O− is the universal red-cell donor (can give to all types) and AB+ is the universal recipient (can receive from all types). Use the Compatibility Checker on the Find Blood page to see exactly who any type can give to and receive from.' },
  { id: 'kb-emergency-post', topic: 'emergency',
    keywords: ['emergency', 'urgent', 'post request', 'need blood', 'request blood', 'broadcast', 'how to request'],
    answer: 'To request blood urgently, open the Emergency page and fill the request form (blood type, units, hospital, city, contact). Our AI triage instantly assigns a priority (P1–P4) and the request appears on the live feed for compatible, available donors and hospitals nearby.' },
  { id: 'kb-find-donor', topic: 'donors',
    keywords: ['find donor', 'search donor', 'nearby donor', 'locate', 'find blood', 'donor near me'],
    answer: 'Use the Find Blood page to search verified donors by blood type, city, and live availability. The AI Match tab ranks the best donors for a request by compatibility, distance, eligibility, and reliability.' },
  { id: 'kb-process', topic: 'process',
    keywords: ['process', 'how does donation work', 'what happens', 'procedure', 'safe', 'painful', 'how long', 'time'],
    answer: 'Donation is safe and takes about 10–15 minutes for the actual draw (30–45 minutes total with registration and rest). A sterile, single-use needle is used. You’ll get a quick health check (hemoglobin, BP) before donating. Drink water and avoid heavy activity right after.' },
  { id: 'kb-after-care', topic: 'process',
    keywords: ['after donation', 'aftercare', 'recover', 'rest', 'eat', 'side effects', 'dizzy'],
    answer: 'After donating: rest 10–15 minutes, drink plenty of fluids, eat a snack, avoid strenuous exercise and alcohol for 24 hours, and keep the bandage on for a few hours. Mild tiredness is normal; your body replaces the fluid within a day.' },
  { id: 'kb-register', topic: 'account',
    keywords: ['register', 'sign up', 'create account', 'join', 'become donor', 'how to join'],
    answer: 'Click Register and choose your role — Donor, Hospital, or Admin. Donors provide blood type and city; hospitals provide their hospital name and license. Once registered you can manage availability, respond to emergencies, and track donations.' },
  { id: 'kb-roles', topic: 'account',
    keywords: ['role', 'hospital account', 'admin', 'donor account', 'difference', 'types of account'],
    answer: 'RaktSetu has three account types: Donors (donate and respond to requests), Hospitals (post requests and manage blood inventory), and Admins (oversee the network). You pick your role during signup.' },
  { id: 'kb-forecast', topic: 'forecast',
    keywords: ['forecast', 'shortage', 'demand', 'prediction', 'stock', 'inventory', 'supply'],
    answer: 'The Forecast page shows a 7-day AI prediction of which blood types will run critical in a city, with recommended actions. Hospitals use it to launch donation drives before a shortage hits.' },
  { id: 'kb-safety', topic: 'safety',
    keywords: ['safe to donate', 'risk', 'infection', 'covid', 'disease', 'reuse needle', 'is it safe'],
    answer: 'Donating is very safe. Equipment is sterile and single-use, so there is no risk of infection from donating. The blood is screened before transfusion. If you feel unwell, were recently ill, or are unsure, run the Eligibility Pre-Screen first.' },
  { id: 'kb-contact', topic: 'support',
    keywords: ['contact', 'help', 'support', 'phone', 'reach', 'helpline'],
    answer: 'For help, use the 24/7 helpline 1800-RAKTSETU or email help@raktsetu.in. For a medical emergency, post on the Emergency page so nearby donors and hospitals are alerted immediately.' },
];

export const SUGGESTED_QUESTIONS = [
  'Am I eligible to donate?',
  'How often can I donate blood?',
  'Who can receive O− blood?',
  'How do I post an emergency request?',
  'Is donating blood safe?',
];

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'i', 'can', 'to', 'of', 'for', 'how', 'what', 'who', 'my', 'me', 'in', 'on', 'and', 'or', 'be', 'it', 'this', 'that', 'with']);

function tokenize(text: string) {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s−-]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w));
}

function retrieve(question: string, k = 3) {
  const qTokens = tokenize(question);
  const qLower = question.toLowerCase();
  const qTokenSet = new Set(qTokens);
  return KNOWLEDGE_BASE.map((entry) => {
    let score = 0;
    for (const kw of entry.keywords) {
      if (qLower.includes(kw)) score += kw.split(' ').length >= 2 ? 6 : 3;
      else if (kw.includes(' ') && kw.split(' ').every((t) => qTokenSet.has(t))) score += 2;
    }
    const kwTokens = new Set(entry.keywords.join(' ').split(' '));
    for (const t of qTokens) if (kwTokens.has(t)) score += 1.5;
    return { entry, score };
  }).filter((s) => s.score >= 2).sort((a, b) => b.score - a.score).slice(0, k);
}

function liveContext(question: string, live: any = {}) {
  const q = question.toLowerCase();
  const facts: string[] = [];
  if (/emergenc|urgent|right now|currently|active|open request/.test(q) && live.openEmergencies != null) {
    facts.push(`There are currently ${live.openEmergencies} open emergency request(s) on the network.`);
    if (live.topEmergency) facts.push(`The highest-priority one needs ${live.topEmergency.units} unit(s) of ${live.topEmergency.bloodType} at ${live.topEmergency.hospital}, ${live.topEmergency.city}.`);
  }
  if (/how many donor|donor count|registered|total donor/.test(q) && live.donors != null) {
    facts.push(`RaktSetu currently has ${live.donors.toLocaleString('en-IN')} registered donors.`);
  }
  if (/hospital|blood bank|stock|inventory|units available/.test(q) && live.hospitals != null) {
    facts.push(`There are ${live.hospitals} verified partner hospitals, with about ${(live.totalUnits || 0).toLocaleString('en-IN')} units in tracked inventory.`);
  }
  return facts;
}

export function chat(question: string, live: any = {}) {
  const retrieved = retrieve(question, 3);
  const facts = liveContext(question, live);
  const sources = retrieved.map((r) => ({ id: r.entry.id, topic: r.entry.topic }));
  let answer: string;
  if (retrieved.length === 0 && facts.length === 0) {
    answer = 'I’m not certain about that one. I can help with blood-donation eligibility, compatibility, how to donate, posting emergencies, finding donors, and using RaktSetu. Try rephrasing, or tap a suggested question.';
  } else {
    const parts: string[] = [];
    if (facts.length) parts.push(facts.join(' '));
    if (retrieved[0]) parts.push(retrieved[0].entry.answer);
    if (retrieved[1] && retrieved[1].entry.topic !== retrieved[0].entry.topic && retrieved[1].score >= 3) parts.push(retrieved[1].entry.answer);
    answer = parts.join('\n\n');
  }
  return { answer, sources, usedLive: facts.length > 0, engine: 'rules-rag' };
}
