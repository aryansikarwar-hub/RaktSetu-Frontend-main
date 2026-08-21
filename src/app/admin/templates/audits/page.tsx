'use client';
import React, { useEffect, useState } from 'react';
import RoleGuard from '@/components/RoleGuard';
import { commTemplatesApi } from '@/lib/api';

export default function AuditsPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ target: 'CommTemplate', targetId: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedFields, setSelectedFields] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => { load(); }, [filter, page]);
  async function load() {
    setLoading(true); setError('');
    try {
      const res: any = await commTemplatesApi.listAudits({ ...(filter.target ? { target: filter.target } : {}), ...(filter.targetId ? { targetId: filter.targetId } : {}), page, limit: 12 });
      setAudits(res.audits || []);
      setTotal(res.total || 0);
    } catch (e: any) { setError(e.message || 'Failed'); }
    setLoading(false);
  }

  async function restore(audit: any, fields?: string[]) {
    if (!audit || !audit.targetId || !audit.data) return;
    const label = fields && fields.length ? `selected fields (${fields.join(', ')})` : 'full snapshot';
    if (!confirm(`Restore ${label} on template ${audit.targetId} from ${new Date(audit.createdAt).toLocaleString()}?`)) return;
    try {
      const payload = fields && fields.length ? fields.reduce((acc:any, f:string) => { acc[f] = audit.data[f]; return acc; }, {}) : audit.data;
      await commTemplatesApi.update(audit.targetId, payload);
      // refresh audits and templates
      load();
      alert('Restored. Audit record created.');
    } catch (e: any) { alert(e.message || 'Restore failed'); }
  }

  return (
    <RoleGuard allow={[ 'admin', 'coordinator' ]} featureName="Audit Viewer">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Audit Logs (Templates)</h2>
        <div className="mb-4 flex gap-2">
          <input placeholder="Template ID (optional)" value={filter.targetId} onChange={(e) => setFilter({ ...filter, targetId: e.target.value })} className="p-2 border rounded flex-1" />
          <button className="px-3 py-2 border rounded" onClick={() => { setFilter({ target: 'CommTemplate', targetId: '' }); setPage(1); }}>Clear</button>
        </div>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        {loading ? <p>Loading…</p> : (
          <div className="space-y-3">
            {audits.map((a:any) => (
              <div key={a._id} className="p-3 border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold">{a.action} — {a.target} {a.targetId ? `(${a.targetId})` : ''}</div>
                    <div className="text-xs text-muted">By {a.actor || 'system'} · {new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {a.data && <button className="px-2 py-1 border rounded" onClick={() => restore(a)}>Restore Full</button>}
                    {a.data && <button className="px-2 py-1 border rounded" onClick={() => setExpanded({ ...expanded, [a._id]: !expanded[a._id] })}>{expanded[a._id] ? 'Hide Fields' : 'Restore Fields'}</button>}
                  </div>
                </div>
                {a.data && (
                  <div className="mt-2">
                    <pre className="text-sm bg-muted/10 p-2 rounded overflow-auto">{JSON.stringify(a.data, null, 2)}</pre>
                    {expanded[a._id] && (
                      <div className="mt-2 p-2 border rounded">
                        <div className="text-sm font-medium mb-2">Select fields to restore</div>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(a.data).map((k:string) => (
                            <label key={k} className="inline-flex items-center gap-2">
                              <input type="checkbox" checked={selectedFields[a._id]?.[k] || false} onChange={(e) => {
                                setSelectedFields({ ...selectedFields, [a._id]: { ...(selectedFields[a._id] || {}), [k]: e.target.checked } });
                              }} />
                              <span className="text-sm">{k}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-2">
                          <button className="px-3 py-1 border rounded" onClick={() => {
                            const fields = Object.entries(selectedFields[a._id] || {}).filter(([_,v])=>v).map(([k])=>k);
                            restore(a, fields);
                          }}>Restore Selected</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {!audits.length && <p className="text-sm text-muted">No audit entries.</p>}
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
