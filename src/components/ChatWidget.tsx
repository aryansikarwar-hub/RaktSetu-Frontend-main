'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Loader2, User } from 'lucide-react';
import HeartMascot from '@/components/ui/HeartMascot';
import { chatApi } from '@/lib/api';

interface Msg { role: 'user' | 'bot'; text: string; usedLive?: boolean; }

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: 'Hi! I’m the RaktSetu assistant 🩸 Ask me anything about blood donation, eligibility, compatibility, or how to use the app.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatApi.suggestions().then(setSuggestions).catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const ask = useCallback(async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, text: m.text }));
      const res = await chatApi.send(q, history);
      setMessages((m) => [...m, { role: 'bot', text: res.answer, usedLive: res.usedLive }]);
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: 'Sorry, I had trouble answering that. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        className={`fixed z-[55] bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-card-lg transition-all duration-300 ${
          open ? 'bg-card text-foreground rotate-90 border border-border' : 'gradient-card-red text-white hover:scale-105 emergency-pulse'
        }`}
      >
        {open ? <X size={24} /> : <HeartMascot size={34} />}
      </button>

      {/* Panel */}
      <div
        className={`fixed z-[55] bottom-24 right-5 w-[calc(100vw-2.5rem)] sm:w-96 max-w-96 transition-all duration-300 origin-bottom-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-card rounded-3xl border border-border shadow-card-lg overflow-hidden flex flex-col" style={{ height: 'min(560px, 75vh)' }}>
          {/* Header */}
          <div className="gradient-card-red px-4 py-3.5 flex items-center gap-3 text-white flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <HeartMascot size={26} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm leading-tight">RaktSetu Assistant</p>
              <p className="text-[11px] text-white/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 live-dot" /> Online · grounded in real data
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-accent/15 text-accent' : 'bg-primary/10 text-primary'}`}>
                  {m.role === 'user' ? <User size={14} /> : <HeartMascot size={18} />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    m.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'
                  }`}
                >
                  {m.text}
                  {m.usedLive && (
                    <span className="block mt-1.5 text-[10px] opacity-70 flex items-center gap-1">
                      <Sparkles size={10} /> includes live network data
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><HeartMascot size={18} /></div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && suggestions.length > 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {suggestions.slice(0, 3).map((s) => (
                <button key={s} onClick={() => ask(s)} className="text-[11px] px-2.5 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border flex-shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); ask(input); }}
              className="flex items-center gap-2 bg-muted rounded-full pl-4 pr-1.5 py-1.5"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about donating blood…"
                maxLength={300}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-colors flex-shrink-0"
                aria-label="Send"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
            <p className="text-[10px] text-muted-foreground text-center mt-1.5">Informational only — not medical advice.</p>
          </div>
        </div>
      </div>
    </>
  );
}
