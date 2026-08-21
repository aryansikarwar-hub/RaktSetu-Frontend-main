'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
 
interface PaginationProps {
  page: number;              // current page, 1-based
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
  /** Label used in the "Showing X–Y of Z hospitals" line. */
  itemLabel?: string;
  totalItems?: number;
  pageSize?: number;
}
 
/**
 * Compact Prev / Next pager.
 * On mobile it collapses to two big tap targets + a "2 / 7" counter;
 * from `sm` up it also shows numbered page buttons with ellipses.
 */
export default function Pagination({
  page, totalPages, onChange, className = '', itemLabel = 'items', totalItems, pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null;
 
  const go = (p: number) => {
    const next = Math.min(Math.max(p, 1), totalPages);
    if (next !== page) onChange(next);
  };
 
  // Window of page numbers around the current page (desktop only).
  const pages: (number | 'gap')[] = [];
  const push = (n: number | 'gap') => pages.push(n);
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) push(i);
  } else {
    push(1);
    if (page > 3) push('gap');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i += 1) push(i);
    if (page < totalPages - 2) push('gap');
    push(totalPages);
  }
 
  const from = pageSize ? (page - 1) * pageSize + 1 : null;
  const to = pageSize && totalItems ? Math.min(page * pageSize, totalItems) : null;
 
  const arrowCls = 'flex items-center justify-center gap-1 h-11 px-4 rounded-xl border border-border text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:pointer-events-none';
 
  return (
    <div className={`mt-8 flex flex-col items-center gap-3 ${className}`}>
      {from && to && totalItems ? (
        <p className="text-xs text-muted-foreground">
          Showing {from}–{to} of {totalItems} {itemLabel}
        </p>
      ) : null}
 
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
        <button type="button" onClick={() => go(page - 1)} disabled={page === 1} className={`${arrowCls} flex-1 sm:flex-none`} aria-label="Previous page">
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>
 
        {/* Numbered pages — desktop / tablet */}
        <div className="hidden sm:flex items-center gap-1.5">
          {pages.map((p, i) =>
            p === 'gap' ? (
              <span key={`gap-${i}`} className="px-1 text-muted-foreground select-none">…</span>
            ) : (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => go(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`h-10 min-w-10 px-3 rounded-xl text-sm font-semibold transition-all ${
                  p === page
                    ? 'bg-primary text-white shadow-card'
                    : 'border border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
 
        {/* Compact counter — mobile */}
        <span className="sm:hidden text-sm font-semibold text-muted-foreground tabular-nums px-2">
          {page} / {totalPages}
        </span>
 
        <button type="button" onClick={() => go(page + 1)} disabled={page === totalPages} className={`${arrowCls} flex-1 sm:flex-none`} aria-label="Next page">
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
 