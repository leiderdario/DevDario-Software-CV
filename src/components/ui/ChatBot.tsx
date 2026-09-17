'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  RefreshCw,
  Mail,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
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

/**
 * Parser for inline Markdown elements (Bold, Emails, WhatsApp, URLs, Code)
 */
function renderInlineFormatting(text: string) {
  // Regex tokens:
  // 1. **bold**
  // 2. Email: \b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b
  // 3. WhatsApp / Phone: \+57\s*3\d{2}\s*\d{3}\s*\d{4}|\+\d{1,3}[\s-]?\d{3,}[\s-]?\d{4,}
  // 4. [text](url)
  // 5. `code`
  // 6. Plain URL https?://...
  const tokenRegex =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\+57\s*3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}|https?:\/\/[^\s)]+)/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Bold **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-white tracking-tight">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[11px] text-amber-300 border border-white/5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown Link [title](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          <span>{label}</span>
          <ExternalLink size={10} className="inline opacity-70" />
        </a>
      );
    }

    // Email
    if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(part)) {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/15 px-2 py-0.5 text-[11px] font-mono text-[var(--color-accent)] hover:bg-[var(--color-accent)]/25 transition-colors align-middle shadow-xs"
        >
          <Mail size={11} />
          <span>{part}</span>
        </a>
      );
    }

    // Phone / WhatsApp
    if (/^\+57\s*3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}$/.test(part) || part.includes('57 300 803 7847')) {
      const cleanNum = part.replace(/\D/g, '');
      return (
        <a
          key={i}
          href={`https://wa.me/${cleanNum}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/35 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-mono text-emerald-400 hover:bg-emerald-500/25 transition-colors align-middle shadow-xs"
        >
          <MessageCircle size={11} />
          <span>{part}</span>
        </a>
      );
    }

    // Raw URL
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity break-all"
        >
          <span>{part.replace(/^https?:\/\//, '')}</span>
          <ExternalLink size={10} className="shrink-0 opacity-70" />
        </a>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

/**
 * Rich Message Formatter
 */
function FormattedMessage({ content }: { content: string }) {
  // Clean empty hanging bullets like `-\n` or isolated dashes
  const cleanContent = content
    .replace(/^[-*]\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split into paragraphs / lines
  const lines = cleanContent.split('\n');

  // Group consecutive bullet points into lists
  const renderedElements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${renderedElements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-zinc-200">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
              <div className="flex-1 leading-snug">{renderInlineFormatting(item)}</div>
            </li>
          ))}
        </ul>,
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) {
      flushList();
      continue;
    }

    // Check if bullet line
    const bulletMatch = rawLine.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      currentList.push(bulletMatch[1]);
    } else {
      flushList();
      renderedElements.push(
        <p key={`p-${renderedElements.length}`} className="my-1 text-zinc-200 leading-relaxed">
          {renderInlineFormatting(rawLine)}
        </p>,
      );
    }
  }

  flushList();

  return <div className="space-y-1 text-xs sm:text-[13px]">{renderedElements}</div>;
}

export function ChatBot() {
  const { lang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const initialGreeting = useMemo(() => {
    return lang === 'es'
      ? '¡Hola! Soy **Darío**, el copiloto inteligente de **Leider Bolaño**. Conozco al detalle sus 6+ años de experiencia, proyectos de IA, roles y casos de éxito. ¿Qué te gustaría consultar o cómo podemos colaborar?'
      : "Hello! I'm **Darío**, **Leider Bolaño**'s intelligent AI copilot. I know all about his 6+ years of experience, AI projects, roles, and achievements. What would you like to know or how can we collaborate?";
  }, [lang]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: initialGreeting,
    },
  ]);

  // Update greeting if language changes and only 1 message exists
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{ id: 'welcome', role: 'assistant', content: initialGreeting }];
      }
      return prev;
    });
  }, [initialGreeting]);

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
          content:
            data.reply ||
            (lang === 'es'
              ? 'Disculpa, no pude procesar esa respuesta en este momento.'
              : 'Sorry, I could not process that response right now.'),
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
              ? 'Hubo un error de conexión con la IA de Groq. Por favor intenta de nuevo en unos segundos.'
              : 'Connection error with Groq AI. Please try again in a few seconds.',
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
        <div className="relative mb-3 flex h-[540px] w-[94vw] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-[var(--color-accent)]/30 bg-[#121212]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)]/80 bg-black/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#ff8f5a] text-white shadow-md">
                <Bot size={20} />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-black bg-emerald-400 shadow-xs" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-bold tracking-tight text-white">
                    Darío
                  </h3>
                  <span className="rounded-full bg-[var(--color-accent)]/20 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                    Groq AI
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {lang === 'es'
                    ? 'Copiloto de IA de Leider Bolaño'
                    : "Leider Bolaño's AI Copilot"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-2.5 max-w-[90%]',
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
                )}
              >
                <div
                  className={cn(
                    'size-7 shrink-0 rounded-full flex items-center justify-center text-xs shadow-xs',
                    m.role === 'user'
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      : 'bg-[var(--color-accent)] text-white',
                  )}
                >
                  {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                </div>

                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 shadow-md transition-all',
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-[var(--color-accent)] to-[#e85a22] text-white rounded-br-xs'
                      : 'border border-white/10 bg-[#1a1a1a]/95 text-zinc-200 rounded-bl-xs',
                  )}
                >
                  {m.role === 'user' ? (
                    <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </p>
                  ) : (
                    <FormattedMessage content={m.content} />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px] pl-9">
                <RefreshCw size={12} className="animate-spin text-[var(--color-accent)]" />
                <span>{lang === 'es' ? 'Darío está pensando…' : 'Darío is thinking…'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions pills if few messages */}
          {messages.length <= 2 && !loading && (
            <div className="border-t border-white/5 bg-black/30 p-2.5">
              <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                <Sparkles size={11} className="text-[var(--color-accent)]" />
                {lang === 'es' ? 'Preguntas sugeridas:' : 'Suggested questions:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(sug)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-left text-[11px] text-zinc-200 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/15"
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
            className="flex items-center gap-2 border-t border-white/10 bg-black/50 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === 'es' ? 'Escribe tu pregunta para Darío…' : 'Ask Darío a question…'
              }
              className="flex-1 rounded-xl border border-white/10 bg-zinc-900/90 px-3.5 py-2 text-xs sm:text-[13px] text-white placeholder-zinc-500 focus:border-[var(--color-accent)] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex size-9 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white transition-all hover:opacity-90 disabled:opacity-30 shadow-md"
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
            ? lang === 'es'
              ? 'Cerrar a Darío'
              : 'Close Darío'
            : lang === 'es'
              ? 'Habla con Darío AI'
              : 'Chat with Darío AI'}
        </span>
      </button>
    </div>
  );
}
