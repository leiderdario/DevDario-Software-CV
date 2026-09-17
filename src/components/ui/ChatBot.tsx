'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/cn';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTIONS = {
  es: [
    '¿Cuáles son tus proyectos de IA más avanzados?',
    'Cuéntame de tu experiencia en ciberseguridad y Kamuli.',
    '¿Qué hiciste en la Universidad de Cartagena con Habitusutos?',
    '¿Cómo podemos contactarte para una oportunidad?',
  ],
  en: [
    'What are your most advanced AI projects?',
    'Tell me about your cybersecurity experience with Kamuli.',
    'What did you build at Universidad de Cartagena with Habitusutos?',
    'How can I get in touch with you for a role?',
  ],
};

export function ChatBot() {
  const { lang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        lang === 'es'
          ? '¡Hola! Soy el agente de IA entrenado con el portafolio y trayectoria de Leider Darío. Pregúntame sobre sus proyectos de IA, experiencia backend, red teaming o cómo trabajar juntos.'
          : "Hello! I'm the AI agent trained on Leider Darío's portfolio and track record. Ask me about his AI projects, backend experience, red teaming, or how to work together.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        throw new Error('Chat request failed');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || (lang === 'es' ? 'Disculpa, no pude responder en este momento.' : 'Sorry, I could not respond right now.'),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            lang === 'es'
              ? 'Hubo un error de conexión con la IA de Groq. Por favor intenta de nuevo.'
              : 'Connection error with Groq AI. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.es;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="relative mb-3 flex h-[520px] w-[92vw] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-[var(--color-accent)]/30 bg-[#121212]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)]/80 bg-black/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white shadow-sm">
                <Bot size={18} />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-black bg-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-semibold tracking-tight text-[var(--color-text)]">
                    Leider AI Agent
                  </h3>
                  <span className="rounded bg-[var(--color-accent)]/20 px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider text-[var(--color-accent)]">
                    Groq Llama-3.3
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-dim)]">
                  {lang === 'es' ? 'Entrenado con su CV y proyectos' : 'Trained on his CV & projects'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-[var(--color-text-dim)] transition-colors hover:bg-white/10 hover:text-[var(--color-text)]"
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-2.5 max-w-[85%]',
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
                )}
              >
                <div
                  className={cn(
                    'size-6 shrink-0 rounded-full flex items-center justify-center text-[10px]',
                    m.role === 'user'
                      ? 'bg-zinc-700 text-zinc-200'
                      : 'bg-[var(--color-accent)] text-white',
                  )}
                >
                  {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>

                <div
                  className={cn(
                    'rounded-2xl px-3.5 py-2.5 leading-relaxed',
                    m.role === 'user'
                      ? 'bg-[var(--color-accent)] text-white rounded-br-none shadow-md'
                      : 'border border-[var(--color-border)] bg-[var(--color-bg-alt)]/90 text-[var(--color-text)] rounded-bl-none',
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[var(--color-text-dim)] font-mono text-[11px]">
                <RefreshCw size={12} className="animate-spin text-[var(--color-accent)]" />
                <span>{lang === 'es' ? 'Pensando respuesta…' : 'Thinking…'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions pills if few messages */}
          {messages.length <= 2 && !loading && (
            <div className="border-t border-[var(--color-border)]/50 bg-black/20 p-2.5">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-dim)]">
                {lang === 'es' ? 'Preguntas sugeridas:' : 'Suggested questions:'}
              </span>
              <div className="flex flex-wrap gap-1">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(sug)}
                    className="rounded-full border border-[var(--color-border)] bg-white/5 px-2 py-1 text-left text-[11px] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-[var(--color-border)]/80 bg-black/40 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === 'es' ? 'Pregúntale algo sobre Leider…' : 'Ask something about Leider…'
              }
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text)] placeholder-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex size-8 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              aria-label="Enviar mensaje"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center gap-2.5 rounded-full border border-[var(--color-accent)]/40 bg-[#141414] px-4 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/20"
      >
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
        </span>

        <Bot size={16} className="text-[var(--color-accent)] transition-transform group-hover:rotate-12" />

        <span className="font-mono text-xs">
          {isOpen
            ? lang === 'es' ? 'Cerrar Chat' : 'Close Chat'
            : lang === 'es' ? 'Pregúntale a mi IA' : 'Ask my AI Agent'}
        </span>
      </button>
    </div>
  );
}
