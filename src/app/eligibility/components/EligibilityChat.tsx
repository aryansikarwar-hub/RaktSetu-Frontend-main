'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, User } from 'lucide-react';
import HeartMascot from '@/components/ui/HeartMascot';
import { aiApi } from '@/lib/api';

interface Msg { role: 'user' | 'assistant'; text: string; }

const STARTERS = [
  'I had a fever last week, can I donate?',
  'I got a tattoo 2 months ago — am I eligible?',
  "I'm 17 and weigh 55 kg, can I donate?",
  'I donated 40 days ago, can I donate again?',
];

export default function EligibilityChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', text: "Hi! Tell me about yourself and I'll help check if you can donate blood today. For example, your age, weight, last donation, or any recent illness." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    try {
      const res = await aiApi.eligibilityChat(q, history);
      setMessages((prev) => [...prev, { role: 'assistant', text: res?.answer || 'Sorry, I could not process that. Please try the form.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again or use the form.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden flex flex-col" style={{ height: '560px' }}>
      <div className="px-5 py-3 border-b border-border flex items-center gap-2 bg-muted/30">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><HeartMascot size={22} /></div>
        <div>
          <p className="font-bold text-sm text-foreground flex items-center gap-1"><Sparkles size={13} className="text-accent" /> Eligibility Assistant</p>
          <p className="text-[11px] text-muted-foreground">Chat naturally — no forms needed</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-accent/15 text-accent' : 'bg-primary/10'}`}>
              {m.role === 'user' ? <User size={14} /> : <HeartMascot size={18} />}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-accent text-white rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><HeartMascot size={18} /></div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {STARTERS.map((s) => (
            <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-muted rounded-full pl-4 pr-1.5 py-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
            placeholder="Describe your situation…"
            className="flex-1 bg-transparent text-sm focus:outline-none text-foreground"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-colors flex-shrink-0"
            aria-label="Send"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Informational only — not medical advice.</p>
      </div>
    </div>
  );
}