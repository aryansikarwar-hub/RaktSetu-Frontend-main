'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function OtpLoginPage() {
  const [to, setTo] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await authApi.sendOtp(to);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res: any = await authApi.verifyOtp(to, code);
      if (res && res.token) {
        // reload so AuthProvider picks up new token
        window.location.href = '/';
      } else {
        setError('Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">OTP Login</h2>
      {!sent ? (
        <form onSubmit={send} className="space-y-4">
          <label className="block">
            <span className="text-sm">Email or phone</span>
            <input value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="you@example.com or +9198..." />
          </label>
          {error && <div className="text-red-600">{error}</div>}
          <button disabled={loading || !to} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Sending...' : 'Send OTP'}</button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <p className="text-sm">OTP sent to <strong>{to}</strong>. Enter the 6-digit code below.</p>
          <label className="block">
            <input value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="123456" />
          </label>
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex gap-2">
            <button disabled={loading || !code} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? 'Verifying...' : 'Verify & Login'}</button>
            <button type="button" onClick={() => { setSent(false); setCode(''); setError(''); }} className="px-4 py-2 border rounded">Use different contact</button>
          </div>
        </form>
      )}
    </div>
  );
}
