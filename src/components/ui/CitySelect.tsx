'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Search, ChevronDown, Check } from 'lucide-react';
import { INDIA_CITIES } from '@/lib/cities';

interface Props {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  includeAll?: boolean;       // adds an "All Cities" option at the top
  allLabel?: string;
  className?: string;
  id?: string;
  error?: boolean;
}

export default function CitySelect({
  value, onChange, placeholder = 'Select city', includeAll = false,
  allLabel = 'All Cities', className = '', id, error = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => {
    const base = includeAll ? [allLabel, ...INDIA_CITIES] : INDIA_CITIES;
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter((c) => c.toLowerCase().includes(q));
  }, [query, includeAll, allLabel]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (open) { setQuery(''); setHighlight(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  const select = (city: string) => { onChange(city); setOpen(false); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (options[highlight]) select(options[highlight]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border bg-card text-left transition-all duration-150
          focus:outline-none focus:border-primary ${error ? 'border-critical' : 'border-input'}`}
      >
        <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
        <span className={`flex-1 truncate text-sm ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-card rounded-2xl border border-border shadow-card-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
                onKeyDown={onKey}
                placeholder="Search city…"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto py-1" role="listbox">
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted-foreground text-center">No city found</li>
            ) : (
              options.map((c, i) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => select(c)}
                    onMouseEnter={() => setHighlight(i)}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-left transition-colors ${
                      i === highlight ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="truncate">{c}</span>
                    {value === c && <Check size={15} className="text-primary flex-shrink-0" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
