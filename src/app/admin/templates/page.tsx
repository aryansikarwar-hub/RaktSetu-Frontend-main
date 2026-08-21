'use client';
import React, { useEffect, useState } from 'react';
import { commTemplatesApi } from '@/lib/api';
import RoleGuard from '@/components/RoleGuard';

export default function TemplatesAdminPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [filter, setFilter] = useState({ channel: '', name: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [previewing, setPreviewing] = useState<any | null>(null);
  const [sampleVars, setSampleVars] = useState({ name: 'Friend', units: '1', bloodType: 'O+', hospital: 'Local Hospital' });
  const [form, setForm] = useState({ name: '', channel: 'sms', subject: '', body: '', default: false });
  const [error, setError] = useState('');
  const [renderHtml, setRenderHtml] = useState(false);

  useEffect(() => { load(); }, [filter, page]);
  async function load() {
    setLoading(true); setError('');
    try {
      const params: any = { ...(filter.channel || filter.name ? filter : {}), page, limit: 12 };
      const res: any = await commTemplatesApi.list(params);
      setTemplates(res.templates || []);
      setTotal(res.total || 0);
    } catch (e: any) { setError(e.message || 'Failed'); }
    setLoading(false);
  }

  function startEdit(t: any) {
    setEditing(t); setForm({ name: t.name || '', channel: t.channel || 'sms', subject: t.subject || '', body: t.body || '', default: !!t.default });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try {
      if (editing) {
        await commTemplatesApi.update(editing._id, form as any);
        setEditing(null);
      } else {
        await commTemplatesApi.create(form as any);
      }
      setForm({ name: '', channel: 'sms', subject: '', body: '', default: false });
      load();
    } catch (e: any) { setError(e.message || 'Failed to save'); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this template?')) return;
    try { await commTemplatesApi.delete(id); load(); } catch (e:any) { setError(e.message || 'Delete failed'); }
  }

  function renderTemplate(tpl: string, vars: Record<string, any>) {
    if (!tpl) return '';
    return String(tpl).replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
      const v = vars[key];
      return v === undefined || v === null ? '' : String(v);
    });
  }

  function escapeHtml(s: string) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return (
    <RoleGuard allow={[ 'admin', 'coordinator' ]} featureName="Communication Template Management">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Communication Templates</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">{editing ? 'Edit Template' : 'Create Template'}</h3>
            <form onSubmit={save} className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
              <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="w-full p-2 border rounded">
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
              <input placeholder="Subject (email)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full p-2 border rounded" />
              <textarea placeholder="Body (use {{name}}, {{units}}, {{bloodType}}, {{hospital}})" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full p-2 border rounded h-28" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.default} onChange={(e) => setForm({ ...form, default: e.target.checked })} /> Default</label>
              {error && <div className="text-red-600">{error}</div>}
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-primary text-white rounded">{editing ? 'Save' : 'Create'}</button>
                {editing && <button type="button" className="px-3 py-2 border rounded" onClick={() => { setEditing(null); setForm({ name: '', channel: 'sms', subject: '', body: '', default: false }); }}>Cancel</button>}
              </div>
            </form>
          </div>

          <div>
            <div className="mb-4 flex gap-2">
              <select value={filter.channel} onChange={(e) => setFilter({ ...filter, channel: e.target.value })} className="p-2 border rounded">
                <option value="">All channels</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
              <input placeholder="Search name" value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} className="p-2 border rounded flex-1" />
              <button className="px-3 py-2 border rounded" onClick={() => setFilter({ channel: '', name: '' })}>Clear</button>
              <a href="/admin/templates/audits" className="px-3 py-2 border rounded ml-2">View audits</a>
            </div>
            <h3 className="font-semibold mb-2">Existing Templates</h3>
            {loading ? <p>Loading…</p> : (
              <div className="space-y-3">
                {templates.map((t:any) => (
                  <div key={t._id} className="p-3 border rounded">
                    <div className="flex justify-between items-start gap-3"><div>
                      <strong>{t.name}</strong>
                      <div className="text-sm text-muted">{t.channel}{t.default ? ' · default' : ''}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 border rounded" onClick={() => startEdit(t)}>Edit</button>
                      <button className="px-2 py-1 border rounded" onClick={() => setPreviewing(t)}>Preview</button>
                      <button className="px-2 py-1 border rounded text-red-600" onClick={() => remove(t._id)}>Delete</button>
                    </div></div>
                    <div className="text-sm mt-2 whitespace-pre-wrap">{t.body}</div>
                    {t.subject && <div className="text-xs text-muted mt-2">Subject: {t.subject}</div>}
                  </div>
                ))}
                {!templates.length && <p className="text-sm text-muted">No templates yet.</p>}
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
        </div>
        {previewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewing(null)} />
            <div className="relative max-w-2xl w-full bg-card rounded-2xl p-6 z-50 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Preview: {previewing.name} ({previewing.channel})</h3>
                <button onClick={() => setPreviewing(null)} className="px-2 py-1 border rounded">Close</button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted">Sample name</label>
                  <input className="w-full p-2 border rounded" value={sampleVars.name} onChange={(e) => setSampleVars({ ...sampleVars, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted">Units</label>
                  <input className="w-full p-2 border rounded" value={sampleVars.units} onChange={(e) => setSampleVars({ ...sampleVars, units: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted">Blood type</label>
                  <input className="w-full p-2 border rounded" value={sampleVars.bloodType} onChange={(e) => setSampleVars({ ...sampleVars, bloodType: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted">Hospital</label>
                  <input className="w-full p-2 border rounded" value={sampleVars.hospital} onChange={(e) => setSampleVars({ ...sampleVars, hospital: e.target.value })} />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-muted mb-1">Rendered subject</div>
                <div className="p-3 border rounded bg-muted/10 text-sm">{renderTemplate(previewing.subject || '', sampleVars)}</div>
              </div>
              <div>
                <div className="text-xs text-muted mb-1">Rendered body</div>
                {previewing.channel === 'email' ? (
                  <div>
                    <label className="flex items-center gap-2 mb-2"><input type="checkbox" checked={renderHtml} onChange={(e)=>setRenderHtml(e.target.checked)} /> Render as HTML</label>
                    {renderHtml ? (
                      <div className="p-3 border rounded bg-white text-sm" dangerouslySetInnerHTML={{ __html: String(renderTemplate(previewing.body || '', sampleVars)).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') }} />
                    ) : (
                      <div className="p-3 border rounded bg-white text-sm" dangerouslySetInnerHTML={{ __html: escapeHtml(renderTemplate(previewing.body || '', sampleVars)).replace(/\n/g, '<br/>') }} />
                    )}
                  </div>
                ) : (
                  <div className="p-3 border rounded bg-muted/10 text-sm whitespace-pre-wrap">{renderTemplate(previewing.body || '', sampleVars)}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
