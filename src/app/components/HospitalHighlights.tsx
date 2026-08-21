'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Building2, Phone, MapPin, CheckCircle2, Loader2, Bed } from 'lucide-react';
import { hospitalApi } from '@/lib/api';
import Pagination from '@/components/ui/Pagination';

function deriveTypes(inventory: any[] = []) {
  const available = inventory.filter((i) => i.units >= 20).map((i) => i.bloodType);
  const critical = inventory.filter((i) => i.units > 0 && i.units < 20).map((i) => i.bloodType);
  return { available, critical };
}

/** Cards per page: 4 on phones, 6 on tablets, 8 on desktop (2 full rows of the grid). */
function usePageSize() {
  const [size, setSize] = useState(8);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setSize(w < 768 ? 4 : w < 1280 ? 6 : 8);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);
  return size;
}

export default function HospitalHighlights() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = usePageSize();
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hospitalApi.list().then((res) => {
      setHospitals(res.hospitals || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(hospitals.length / pageSize));

  // If the viewport shrinks, the current page can fall off the end — clamp it.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const visible = hospitals.slice(start, start + pageSize);

  const changePage = (p: number) => {
    setPage(p);
    // Scroll the section back into view so mobile users don't land mid-list.
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-16">
      <div ref={gridTopRef} className="scroll-mt-24" />
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="eyebrow">Network</span>
          <h2 className="section-header mt-4 text-3xl lg:text-4xl">Partner Hospitals</h2>
          <p className="section-subheader mt-2">Verified blood banks across India&apos;s major cities</p>
        </div>
        <span className="text-sm font-medium text-muted-foreground hidden md:block">Verified network →</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {visible.map((h) => {
            const { available, critical } = deriveTypes(h.inventory);
            return (
              <div key={h._id} className="card-hover p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground leading-tight truncate">{h.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{h.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {h.hasBloodBank && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-900">
                      <CheckCircle2 size={11} /> Blood Bank Active
                    </span>
                  )}
                  {h.beds > 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      <Bed size={11} /> {h.beds.toLocaleString('en-IN')} beds
                    </span>
                  )}
                </div>

                {available.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Available types:</p>
                    <div className="flex flex-wrap gap-1">
                      {available.map((bt: string) => (
                        <span key={`${h._id}-bt-${bt}`} className="text-xs font-bold bg-muted px-1.5 py-0.5 rounded font-mono">{bt}</span>
                      ))}
                    </div>
                  </div>
                )}

                {critical.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-primary mb-1.5">⚠ Low stock:</p>
                    <div className="flex flex-wrap gap-1">
                      {critical.map((bt: string) => (
                        <span key={`${h._id}-crit-${bt}`} className="text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 px-1.5 py-0.5 rounded font-mono">{bt}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-border">
                  <Phone size={12} className="text-muted-foreground" />
                  <a href={`tel:${h.phone}`} className="text-xs font-medium text-primary hover:underline">{h.phone}</a>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={changePage}
          pageSize={pageSize}
          totalItems={hospitals.length}
          itemLabel="hospitals"
        />
        </>
      )}
    </section>
  );
}