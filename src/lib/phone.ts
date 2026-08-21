/**
 * Shared mobile-number helpers.
 * Numbers are stored digits-only (optionally with a +91 prefix); these helpers
 * turn them into something readable and into a dialable tel: href.
 */
 
/** Strip everything except digits and a leading + — used before validating/saving. */
export function normalizePhone(raw: string): string {
  return String(raw || '').replace(/[^\d+]/g, '');
}
 
/** 10-digit Indian mobile, optionally prefixed with +91 / 91 / 0. */
export const PHONE_RE = /^(?:\+?91|0)?[6-9]\d{9}$/;
 
export function isValidPhone(raw: string): boolean {
  return PHONE_RE.test(normalizePhone(raw));
}
 
/** "+919876543210" → "+91 98765 43210" */
export function formatPhone(raw?: string | null): string {
  if (!raw) return '';
  const digits = normalizePhone(raw).replace(/^\+/, '');
  const ten = digits.slice(-10);
  if (ten.length !== 10) return String(raw);
  return `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`;
}
 
/** Dialable href for <a> tags. */
export function telHref(raw?: string | null): string {
  const digits = normalizePhone(raw || '');
  if (!digits) return '';
  const ten = digits.replace(/^\+/, '').slice(-10);
  return `tel:+91${ten}`;
}