'use client';
import React, { useState, useEffect } from 'react';
import {
  X, Mail, Lock, User, Phone, Droplet, Loader2, CheckCircle2,
  HeartHandshake, Building2, ShieldCheck, Eye, EyeOff, AlertCircle, BadgeCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CitySelect from '@/components/ui/CitySelect';
 
const BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
 
type Role = 'donor' | 'hospital' | 'admin';
const ROLES: { id: Role; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'donor', label: 'Donor', icon: <HeartHandshake size={16} />, desc: 'Donate blood & respond to emergencies' },
  { id: 'hospital', label: 'Hospital', icon: <Building2 size={16} />, desc: 'Post requests & manage blood inventory' },
  { id: 'admin', label: 'Admin', icon: <ShieldCheck size={16} />, desc: 'Oversee the network' },
];
 
const DEMO: Record<Role, { email: string }> = {
  donor: { email: 'arjun@raktsetu.in' },
  hospital: { email: 'hospital@raktsetu.in' },
  admin: { email: 'admin@raktsetu.in' },
};
 
interface Props {
  open: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (m: 'login' | 'register') => void;
}
 
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 10-digit Indian mobile, optionally prefixed with +91 / 91 / 0.
const phoneRe = /^(?:\+?91|0)?[6-9]\d{9}$/;
 
/** Keep only digits and a leading + so validation ignores spaces/dashes. */
function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, '');
}
 
export default function AuthModal({ open, mode, onClose, onSwitchMode }: Props) {
  const { login, register, isLoading, error } = useAuth();
  const [role, setRole] = useState<Role>('donor');
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    name: '', email: 'arjun@raktsetu.in', password: 'password123',
    phone: '', city: 'Mumbai', bloodType: 'O+',
    hospitalName: '', licenseNumber: '', designation: '',
  });
 
  useEffect(() => {
    if (open) { setSuccess(false); setTouched({}); }
  }, [open, mode]);
 
  useEffect(() => {
    setForm((f) => ({ ...f, email: DEMO[role].email }));
  }, [role]);
 
  if (!open) return null;
 
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const blur = (k: string) => setTouched((t) => ({ ...t, [k]: true }));
 
  // ── Validation ──
  const errors: Record<string, string> = {};
  if (mode === 'register') {
    if (!form.name.trim()) errors.name = 'Name is required';
    else if (form.name.trim().length < 2) errors.name = 'Name is too short';
    if (!form.city) errors.city = 'City is required';
    if (!form.phone.trim()) errors.phone = 'Mobile number is required';
    else if (!phoneRe.test(normalizePhone(form.phone))) errors.phone = 'Enter a valid 10-digit mobile number';
    if (role === 'donor' && !form.bloodType) errors.bloodType = 'Select your blood type';
    if (role === 'hospital' && !form.hospitalName.trim()) errors.hospitalName = 'Hospital name is required';
  }
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!emailRe.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.password) errors.password = 'Password is required';
  else if (mode === 'register') {
    if (form.password.length < 6) errors.password = 'At least 6 characters';
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) errors.password = 'Use letters and numbers';
  }
 
  const pwdStrength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  })();
 
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    Object.keys(form).forEach((k) => { allTouched[k] = true; });
    setTouched(allTouched);
    if (Object.keys(errors).length > 0) return;
 
    let ok = false;
    if (mode === 'login') {
      ok = await login(form.email, form.password);
    } else {
      ok = await register({
        name: form.name, email: form.email, password: form.password,
        phone: normalizePhone(form.phone), city: form.city, role,
        bloodType: role === 'donor' ? form.bloodType : undefined,
        hospitalName: role === 'hospital' ? form.hospitalName : undefined,
        licenseNumber: role === 'hospital' ? form.licenseNumber : undefined,
        designation: role === 'hospital' ? form.designation : undefined,
      });
    }
    if (ok) { setSuccess(true); setTimeout(onClose, 800); }
  };
 
  const showErr = (k: string) => touched[k] && errors[k];
 
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-card-lg border border-border overflow-hidden fade-in-up max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="gradient-card-red px-6 py-5 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors"><X size={20} /></button>
          <h2 className="text-xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="text-sm text-white/80 mt-1">
            {mode === 'login' ? 'Sign in to your RaktSetu account' : 'Join the network that saves lives'}
          </p>
        </div>
 
        {/* Role selector */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all ${
                  role === r.id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {r.icon}
                <span className="text-xs font-semibold">{r.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">{ROLES.find((r) => r.id === role)?.desc}</p>
        </div>
 
        {/* Form */}
        <form onSubmit={submit} className="p-6 pt-4 space-y-3.5" noValidate>
          {mode === 'register' && (
            <Field icon={<User size={16} />} label={role === 'hospital' ? 'Contact Person' : 'Full Name'} error={showErr('name')}>
              <input className={inputCls(showErr('name'))} placeholder="Your name" value={form.name}
                onChange={(e) => update('name', e.target.value)} onBlur={() => blur('name')} />
            </Field>
          )}
 
          {mode === 'register' && role === 'hospital' && (
            <>
              <Field icon={<Building2 size={16} />} label="Hospital Name" error={showErr('hospitalName')}>
                <input className={inputCls(showErr('hospitalName'))} placeholder="e.g. Apollo Hospital" value={form.hospitalName}
                  onChange={(e) => update('hospitalName', e.target.value)} onBlur={() => blur('hospitalName')} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field icon={<BadgeCheck size={16} />} label="License No. (optional)">
                  <input className={inputCls(false)} placeholder="Reg. number" value={form.licenseNumber}
                    onChange={(e) => update('licenseNumber', e.target.value)} />
                </Field>
                <Field icon={<User size={16} />} label="Designation">
                  <input className={inputCls(false)} placeholder="e.g. Blood Bank Officer" value={form.designation}
                    onChange={(e) => update('designation', e.target.value)} />
                </Field>
              </div>
            </>
          )}
 
          <Field icon={<Mail size={16} />} label="Email" error={showErr('email')}>
            <input type="email" className={inputCls(showErr('email'))} placeholder="you@example.com" value={form.email}
              onChange={(e) => update('email', e.target.value)} onBlur={() => blur('email')} />
          </Field>
 
          {mode === 'register' && (
            <Field icon={<Phone size={16} />} label="Mobile Number" error={showErr('phone')}>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={16}
                className={inputCls(showErr('phone'))}
                placeholder="98765 43210"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                onBlur={() => blur('phone')}
              />
            </Field>
          )}
 
          <Field icon={<Lock size={16} />} label="Password" error={showErr('password')}>
            <input type={showPwd ? 'text' : 'password'} className={`${inputCls(showErr('password'))} pr-10`} placeholder="••••••••"
              value={form.password} onChange={(e) => update('password', e.target.value)} onBlur={() => blur('password')} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>
 
          {mode === 'register' && form.password && (
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                  pwdStrength > i ? (pwdStrength <= 2 ? 'bg-amber-500' : 'bg-green-500') : 'bg-border'
                }`} />
              ))}
            </div>
          )}
 
          {mode === 'register' && (
            <div className={`grid ${role === 'donor' ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">City</label>
                <CitySelect value={form.city} onChange={(c) => { update('city', c); blur('city'); }} error={Boolean(showErr('city'))} />
                {showErr('city') && <ErrText msg={errors.city} />}
              </div>
              {role === 'donor' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Blood Type</label>
                  <div className="relative">
                    <Droplet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary z-10" />
                    <select className={`${inputCls(showErr('bloodType'))} pl-10`} value={form.bloodType}
                      onChange={(e) => update('bloodType', e.target.value)} onBlur={() => blur('bloodType')}>
                      <option value="">Select</option>
                      {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {showErr('bloodType') && <ErrText msg={errors.bloodType} />}
                </div>
              )}
            </div>
          )}
 
          {error && (
            <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg px-3 py-2">
              <AlertCircle size={15} /> {error}
            </div>
          )}
 
          <button type="submit" disabled={isLoading || success} className="btn-primary w-full !mt-5">
            {success ? <><CheckCircle2 size={18} /> Success!</> : isLoading ? <><Loader2 size={18} className="animate-spin" /> Please wait…</>
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
 
          {mode === 'login' && (
            <p className="text-xs text-center text-muted-foreground">
              Demo {ROLES.find((r) => r.id === role)?.label}: {DEMO[role].email} / password123
            </p>
          )}
 
          <p className="text-sm text-center text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : 'Already a member? '}
            <button type="button" onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')} className="text-primary font-semibold hover:underline">
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
 
function inputCls(hasError: boolean | string | undefined) {
  return `input-field pl-10 ${hasError ? '!border-critical' : ''}`;
}
 
function Field({ icon, label, error, children }: { icon: React.ReactNode; label: string; error?: boolean | string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">{icon}</span>
        {children}
      </div>
      {typeof error === 'string' && error && <ErrText msg={error} />}
    </div>
  );
}
 
function ErrText({ msg }: { msg: string }) {
  return <p className="text-xs text-critical mt-1 flex items-center gap-1"><AlertCircle size={11} /> {msg}</p>;
}