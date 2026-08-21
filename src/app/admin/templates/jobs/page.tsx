'use client';
import React, { useEffect, useState } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { commTemplatesApi } from '@/lib/api';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');

  useEffect(() => { load(); }, [page, status]);
  async function load() {
    setLoading(true);
    try {
      const res: any = await commTemplatesApi.listJobs({ status, page, limit: 12 });
      setJobs(res.jobs || []);
      setTotal(res.total || 0);
    } catch (e:any) {}
    setLoading(false);
  }

  async function retry(id: string) {
    if (!confirm('Retry this job now?')) return;
    try {
      await commTemplatesApi.retryJob(id);
      load();
      alert('Retry triggered');
    } catch (e:any) { alert('Retry failed'); }
  }

  return (
    <RoleGuard allow={[ 'admin', 'coordinator' ]} featureName="Comm Jobs">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Communication Queue</h2>
          <div>
            <select value={status} onChange={(e)=>{ setStatus(e.target.value); setPage(1); }} className="p-2 border rounded">
              <option value="pending">Pending</option>
              <option value="sending">Sending</option>
              <option value="success">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        {loading ? <p>Loading…</p> : (
          <div className="space-y-3">
            {jobs.map((j:any) => (
              <div key={j._id} className="p-3 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{j.type.toUpperCase()} → {j.to}</div>
                    <div className="text-xs text-muted">Status: {j.status} · Attempts: {j.attempts}</div>
                  </div>
                  <div className="flex gap-2">
                    {j.status !== 'success' && <button className="px-3 py-1 border rounded" onClick={()=>retry(j._id)}>Retry</button>}
                  </div>
                </div>
                <div className="text-sm mt-2 whitespace-pre-wrap">{j.body}</div>
                {j.subject && <div className="text-xs text-muted mt-2">Subject: {j.subject}</div>}
              </div>
            ))}
            {!jobs.length && <p className="text-sm text-muted">No jobs.</p>}
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted">Total: {total}</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</button>
            <div className="px-2">Page {page}</div>
            <button className="px-3 py-1 border rounded" onClick={() => setPage(page + 1)} disabled={page * 12 >= total}>Next</button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
