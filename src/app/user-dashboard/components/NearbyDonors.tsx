'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Phone, MapPin, Clock, Loader2, CheckCircle2, Award } from 'lucide-react';
import BloodTypeBadge from '@/components/ui/BloodTypeBadge';
import CitySelect from '@/components/ui/CitySelect';
import { donorApi } from '@/lib/api';
import { formatPhone, telHref } from '@/lib/phone';

const BLOOD_TYPES = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function NearbyDonors() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [city, setCity] = useState('All');
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params: any = {};
    if (selectedType !== 'All') params.bloodType = selectedType;
    if (city !== 'All') params.city = city;
    const res = await donorApi.search(params);
    setDonors(res.donors || []);
    setLoading(false);
  }, [selectedType, city]);

  useEffect(() => { load(); }, [load]);

  const filtered = donors.filter((d) =>
    !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="sm:w-44"><CitySelect value={city === 'All' ? '' : city} onChange={(c) => setCity(c || 'All')} includeAll allLabel="All Cities" placeholder="All Cities" /></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {BLOOD_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
              selectedType === t ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No donors match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((d) => (
            <div key={d._id} className="card p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full gradient-card-red flex items-center justify-center text-white font-bold flex-shrink-0">
                {d.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground truncate">{d.name}</p>
                  <BloodTypeBadge type={d.bloodType} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin size={11} /> {d.city}
                  {d.tier && <><span className="mx-1">·</span><Award size={11} /> {d.tier}</>}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  {d.eligible ? (
                    <span className="text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle2 size={11} /> Eligible</span>
                  ) : (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1"><Clock size={11} /> {d.eligibleInDays}d</span>
                  )}
                  <span className="text-[11px] text-muted-foreground">{d.totalDonations || 0} donations</span>
                </div>
                {revealedPhone === d._id && (
                  d.phone ? (
                    <a href={telHref(d.phone)} className="text-xs font-semibold text-primary flex items-center gap-1 mt-1.5 hover:underline">
                      <Phone size={11} /> {formatPhone(d.phone)}
                    </a>
                  ) : (
                    <p className="text-[11px] text-muted-foreground mt-1.5">No number on file</p>
                  )
                )}
              </div>
              <button
                onClick={() => setRevealedPhone(revealedPhone === d._id ? null : d._id)}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex-shrink-0"
                aria-label={revealedPhone === d._id ? 'Hide contact number' : 'Show contact number'}
              >
                <Phone size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {revealedPhone && (
        <p className="text-xs text-center text-muted-foreground">Tip: contact details are shared only with verified coordinators during active requests.</p>
      )}
    </div>
  );
}