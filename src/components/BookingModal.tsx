'use client';
import React, { useState } from 'react';
import { hospitalApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function BookingModal({ hospital, open, onClose }: { hospital: any; open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [slotAt, setSlotAt] = useState('');
  const [units, setUnits] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError('Please login to book a slot');
    if (!slotAt) return setError('Please choose date & time');
    setLoading(true); setError(null);
    try {
      const res = await hospitalApi.createBooking(hospital._id, { slotAt, units, notes: '' });
      // simple success
      onClose();
      // eslint-disable-next-line no-alert
      alert('Booking created. Check My Donations → Bookings for details.');
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-card rounded-2xl p-6 w-full max-w-md z-10">
        <h3 className="font-semibold text-lg mb-2">Book slot at {hospital.name}</h3>
        <p className="text-xs text-muted-foreground mb-4">Please arrive 15 minutes before your scheduled time.</p>

        <label className="block mb-3">
          <span className="text-xs text-muted-foreground">Date & time</span>
          <input value={slotAt} onChange={(e) => setSlotAt(e.target.value)} type="datetime-local" className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-transparent" />
        </label>

        <label className="block mb-4">
          <span className="text-xs text-muted-foreground">Units</span>
          <input value={units} onChange={(e) => setUnits(Number(e.target.value))} min={1} max={5} type="number" className="mt-1 w-24 px-3 py-2 rounded-lg border border-border bg-transparent" />
        </label>

        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-4 py-2 text-sm">{loading ? 'Booking...' : 'Book slot'}</button>
        </div>
      </form>
    </div>
  );
}
