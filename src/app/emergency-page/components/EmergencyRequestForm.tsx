'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CitySelect from '@/components/ui/CitySelect';
import { AlertTriangle, Loader2, CheckCircle2, X, Sparkles } from 'lucide-react';
import { emergencyApi, aiApi } from '@/lib/api';

interface EmergencyFormData {
  bloodType: string;
  units: number;
  urgency: string;
  hospital: string;
  city: string;
  ward: string;
  contactName: string;
  contactPhone: string;
  reason: string;
  patientAge: number;
  patientGender: string;
  agreeTerms: boolean;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const URGENCY_LEVELS = [
  { value: 'critical', label: 'Critical — Within 2 hours', color: 'text-red-600' },
  { value: 'urgent', label: 'Urgent — Within 6 hours', color: 'text-amber-600' },
  { value: 'moderate', label: 'Moderate — Within 24 hours', color: 'text-blue-600' },
];

interface EmergencyRequestFormProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function EmergencyRequestForm({ isOpen: _isOpen, onClose: _onClose }: EmergencyRequestFormProps) {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [aiWriting, setAiWriting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [triage, setTriage] = useState<any>(null);
  const [refId, setRefId] = useState('');

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmergencyFormData>({
    defaultValues: {
      urgency: 'critical',
      units: 1,
      patientGender: 'Male',
    },
  });

  // Real backend integration: POST /api/emergencies — returns the created
  // request plus the AI triage (priority score + label + reasons).
  const onSubmit = async (data: EmergencyFormData) => {
    setSubmitState('loading');
    setSubmitError('');
    try {
      const payload = {
        bloodType: data.bloodType, units: Number(data.units), urgency: data.urgency,
        hospital: data.hospital, city: data.city, ward: data.ward,
        contactName: data.contactName, contactPhone: data.contactPhone,
        patientAge: data.patientAge ? Number(data.patientAge) : undefined,
        patientGender: data.patientGender, reason: data.reason,
      };
      const res = await emergencyApi.create(payload);
      setTriage(res.triage || null);
      setRefId((res.emergency?._id || `EMRG-${Date.now()}`).toString().slice(-6).toUpperCase());
      setSubmitState('success');
    } catch (err: any) {
      // Show the real reason instead of failing silently.
      setSubmitError(err?.message || 'Could not post the request. Please check all fields and try again.');
      setSubmitState('idle');
    }
  };

  const resetForm = () => {
    setSubmitState('idle');
    setTriage(null);
    reset();
    setSelectedBloodType('');
  };

  if (submitState === 'success') {
    return (
      <div className="card p-8 flex flex-col items-center justify-center text-center min-h-96">
        <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Emergency Broadcast</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          Your request is now live on the emergency feed and visible to compatible donors and hospitals nearby.
        </p>
        {triage && (
          <div className="mt-4 w-full max-w-xs rounded-2xl border border-border p-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">AI Triage</span>
              <span className="text-sm font-bold text-primary">{triage.triageLabel}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${triage.priorityScore}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Priority score: {triage.priorityScore}/100</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(triage.triageReasons || []).map((r: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/80">{r}</span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 px-4 py-2 bg-green-50 dark:bg-green-950/40 rounded-xl border border-green-200 dark:border-green-900 text-xs text-green-700 dark:text-green-300 font-medium">
          Reference ID: EMRG-{refId}
        </div>
        <button onClick={resetForm} className="btn-secondary mt-5 text-sm py-2 px-5">Post Another</button>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden sticky top-20">
      {/* Form header */}
      <div className="gradient-card-red px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <AlertTriangle size={18} />
          <h3 className="font-bold">Post Emergency Request</h3>
        </div>
        {_onClose && (
          <button onClick={_onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

        {/* Blood Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Blood Type Required <span className="text-primary">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_TYPES.map((bt) => (
              <button
                key={`form-bt-${bt}`}
                type="button"
                onClick={() => {
                  setSelectedBloodType(bt);
                  setValue('bloodType', bt, { shouldValidate: true });
                }}
                className={`py-2 rounded-xl text-sm font-extrabold border-2 transition-all duration-150 font-mono ${
                  selectedBloodType === bt
                    ? 'bg-primary text-white border-primary scale-105 shadow-sm'
                    : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                {bt}
              </button>
            ))}
          </div>
          <input type="hidden" {...register('bloodType', { required: 'Please select a blood type' })} />
          {errors.bloodType && (
            <p className="text-xs text-primary mt-1 font-medium">{errors.bloodType.message}</p>
          )}
        </div>

        {/* Units + Urgency */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="units" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Units Needed <span className="text-primary">*</span>
            </label>
            <input
              id="units"
              type="number"
              min={1}
              max={20}
              className="input-field"
              placeholder="e.g. 2"
              {...register('units', {
                required: 'Required',
                min: { value: 1, message: 'Min 1 unit' },
                max: { value: 20, message: 'Max 20 units' },
              })}
            />
            {errors.units && <p className="text-xs text-primary mt-1">{errors.units.message}</p>}
          </div>
          <div>
            <label htmlFor="urgency" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Urgency Level <span className="text-primary">*</span>
            </label>
            <select
              id="urgency"
              className="input-field text-sm"
              {...register('urgency', { required: 'Required' })}
            >
              {URGENCY_LEVELS.map((u) => (
                <option key={`urgency-opt-${u.value}`} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hospital */}
        <div>
          <label htmlFor="hospital" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Hospital Name <span className="text-primary">*</span>
          </label>
          <input
            id="hospital"
            type="text"
            className="input-field"
            placeholder="e.g. AIIMS New Delhi"
            {...register('hospital', { required: 'Hospital name is required' })}
          />
          {errors.hospital && <p className="text-xs text-primary mt-1">{errors.hospital.message}</p>}
        </div>

        {/* City + Ward */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              City <span className="text-primary">*</span>
            </label>
            <input type="hidden" {...register('city', { required: 'City is required' })} />
            <CitySelect
              value={watch('city') || ''}
              onChange={(c) => setValue('city', c, { shouldValidate: true })}
              error={Boolean(errors.city)}
            />
            {errors.city && <p className="text-xs text-primary mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="ward" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Ward / Department
            </label>
            <input
              id="ward"
              type="text"
              className="input-field"
              placeholder="e.g. ICU, Surgery"
              {...register('ward')}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="contactName" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Contact Person <span className="text-primary">*</span>
            </label>
            <input
              id="contactName"
              type="text"
              className="input-field"
              placeholder="Dr. / Nurse name"
              {...register('contactName', { required: 'Contact name required' })}
            />
            {errors.contactName && <p className="text-xs text-primary mt-1">{errors.contactName.message}</p>}
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Phone Number <span className="text-primary">*</span>
            </label>
            <input
              id="contactPhone"
              type="tel"
              className="input-field"
              placeholder="+91 98765 XXXXX"
              {...register('contactPhone', {
                required: 'Phone is required',
                pattern: { value: /^[+\d\s-]{10,}$/, message: 'Enter valid phone number' },
              })}
            />
            {errors.contactPhone && <p className="text-xs text-primary mt-1">{errors.contactPhone.message}</p>}
          </div>
        </div>

        {/* Patient info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="patientAge" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Patient Age
            </label>
            <input
              id="patientAge"
              type="number"
              min={0}
              max={120}
              className="input-field"
              placeholder="Age in years"
              {...register('patientAge', {
                min: { value: 0, message: 'Invalid age' },
                max: { value: 120, message: 'Invalid age' },
              })}
            />
          </div>
          <div>
            <label htmlFor="patientGender" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Patient Gender
            </label>
            <select
              id="patientGender"
              className="input-field text-sm"
              {...register('patientGender')}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="reason" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Medical Reason <span className="text-primary">*</span>
            </label>
            <button
              type="button"
              onClick={async () => {
                setAiWriting(true);
                try {
                  const res = await aiApi.describeEmergency({
                    bloodType: watch('bloodType'), units: watch('units'), hospital: watch('hospital'),
                    city: watch('city'), ward: watch('ward'), urgency: watch('urgency'),
                    patientAge: watch('patientAge'), reason: watch('reason'),
                  });
                  if (res?.description) setValue('reason', res.description, { shouldValidate: true });
                } finally { setAiWriting(false); }
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors disabled:opacity-50"
              disabled={aiWriting}
            >
              {aiWriting ? <><Loader2 size={12} className="animate-spin" /> Writing…</> : <><Sparkles size={12} /> AI Write</>}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-1.5">Briefly describe the medical condition or surgery requiring blood — or let AI write it.</p>
          <textarea
            id="reason"
            rows={3}
            className="input-field resize-none"
            placeholder="e.g. Post-accident trauma surgery scheduled in 2 hours, patient blood type confirmed..."
            {...register('reason', {
              required: 'Please describe the medical reason',
              minLength: { value: 20, message: 'Please provide at least 20 characters' },
            })}
          />
          {errors.reason && <p className="text-xs text-primary mt-1">{errors.reason.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl">
          <input
            id="agreeTerms"
            type="checkbox"
            className="mt-0.5 accent-primary w-4 h-4 flex-shrink-0"
            {...register('agreeTerms', { required: 'You must confirm this is a genuine request' })}
          />
          <label htmlFor="agreeTerms" className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed cursor-pointer">
            I confirm this is a genuine medical emergency. False emergency requests are a violation of RaktSetu terms and may result in account suspension.
          </label>
        </div>
        {errors.agreeTerms && <p className="text-xs text-primary -mt-2">{errors.agreeTerms.message}</p>}

        {/* Show why submit failed, if it did */}
        {submitError && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
            {submitError}
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-xs text-amber-700 dark:text-amber-400">
            Please fill all required fields correctly before broadcasting.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitState === 'loading'}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-accent active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 min-h-[52px]"
        >
          {submitState === 'loading' ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Broadcasting Emergency...
            </>
          ) : (
            <>
              <AlertTriangle size={18} />
              Broadcast Emergency Request
            </>
          )}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          Your request is broadcast to compatible, available donors and partner hospitals in the selected city — and ranked by our AI triage engine.
        </p>
      </form>
    </div>
  );
}