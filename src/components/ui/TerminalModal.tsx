'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';
import { playTerminalKeySound, playClickSound } from '@/lib/sound';
import { cn } from '@/lib/cn';

type HistoryItem = {
  command?: string;
  output: string | React.ReactNode;
  isError?: boolean;
};

const WELCOME_BANNER = `
 ██████╗ ███████╗██╗   ██╗██████╗  █████╗ ██████╗ ██╗ ██████╗ 
 ██╔══██╗██╔════╝██║   ██║██╔══██╗██╔══██╗██╔══██╗██║██╔═══██╗
 ██║  ██║█████╗  ██║   ██║██║  ██║███████║██████╔╝██║██║   ██║
 ██║  ██║██╔══╝  ╚██╗ ██╔╝██║  ██║██╔══██║██╔══██╗██║██║   ██║
 ██████╔╝███████╗ ╚████╔╝ ██████╔╝██║  ██║██║  ██║██║╚██████╔╝
 ╚═════╝ ╚══════╝  ╚═══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ 

[*] Red Teaming & AI Engineering Interactive Terminal [v2.6.1]
[*] Kali Linux 2026.4 / x86_64 / zsh
[*] Escribe 'help' para ver los comandos disponibles. Presiona [ESC] o '~' para salir.
`;

export function TerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { output: <pre className="font-mono text-[11px] leading-tight text-emerald-400 select-none">{WELCOME_BANNER}</pre> },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcut listener (~ or ` or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea outside terminal
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === '`' || e.key === '~') {
        if (!isInput || isOpen) {
          e.preventDefault();
          setIsOpen((prev) => !prev);
          playClickSound(true);
        }
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [isOpen, history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    playTerminalKeySound();
    setCmdHistory((prev) => [...prev, trimmed]);
    setCmdHistoryIdx(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let output: React.ReactNode = '';
    let isError = false;

    switch (command) {
      case 'help':
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-emerald-400 font-bold">Comandos disponibles:</p>
            <p><span className="text-amber-400 font-semibold">whoami</span> — Perfil y biografía técnica de Leider Darío</p>
            <p><span className="text-amber-400 font-semibold">skills</span> — Stack tecnológico dominado (Frontend, Backend, AI, Red Teaming)</p>
            <p><span className="text-amber-400 font-semibold">projects --list</span> — Lista de proyectos emblemáticos con métricas</p>
            <p><span className="text-amber-400 font-semibold">experience</span> — Trayectoria y puestos profesionales</p>
            <p><span className="text-amber-400 font-semibold">education</span> — Especialización en MAKAIA, Universidad de Cartagena y Zaragoza</p>
            <p><span className="text-amber-400 font-semibold">contact</span> — Correo profesional y enlaces directos</p>
            <p><span className="text-amber-400 font-semibold">sudo hire leider</span> — Protocolo de contratación con autorización root</p>
            <p><span className="text-amber-400 font-semibold">clear</span> — Limpiar pantalla</p>
            <p><span className="text-amber-400 font-semibold">exit</span> — Cerrar la terminal</p>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1.5 text-zinc-200">
            <p className="text-emerald-400 font-semibold">Leider Darío Bolaño Agámez</p>
            <p>Full Stack Developer · AI Engineer · Software Engineer</p>
            <p className="text-zinc-400">Medellín / Cartagena, Colombia · 6+ años de experiencia · +9 empresas · 2 continentes</p>
            <p className="text-zinc-300 italic">"Construyo software que aprende, escala y rinde números — no demos bonitos."</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 text-zinc-200">
            <div>
              <span className="text-cyan-400 font-bold">[IA & ML]</span>: LangChain, LangGraph, Agentes Autónomos, Computer Vision, K-Means Clustering, RAG, Fine-Tuning, OpenAI & Anthropic APIs.
            </div>
            <div>
              <span className="text-amber-400 font-bold">[Frontend]</span>: Next.js, React, React Native, TypeScript, GSAP, Lenis, Tailwind CSS, Zod, React Hook Form.
            </div>
            <div>
              <span className="text-emerald-400 font-bold">[Backend & Datos]</span>: Node.js, Python (FastAPI), Ruby, PHP, PostgreSQL, MySQL, Firebase, WebSockets, REST APIs.
            </div>
            <div>
              <span className="text-red-400 font-bold">[Ciberseguridad]</span>: Red Teaming Asistido por IA, Kali Linux, Parrot OS, Sandbox Bubbles, Falco Runtime, Guardrails Anti-Prompt-Injection.
            </div>
          </div>
        );
        break;

      case 'projects':
      case 'projects --list':
        output = (
          <div className="space-y-2 text-zinc-200">
            <p className="text-emerald-400 font-bold">Top Proyectos en Producción & I+D:</p>
            <p>1. <span className="text-white font-semibold">ALIRA</span> — IA Multimodal (visión, voz, pulso en tiempo real, latencia &lt;16ms). Presentado en Univ. de Zaragoza.</p>
            <p>2. <span className="text-white font-semibold">Kamuli</span> — Workbench de auditoría y red teaming ético con IA sin censura en 6 capas de defensa.</p>
            <p>3. <span className="text-white font-semibold">Habitusutos</span> — Sistema de vigilancia postural con webcam para oficinas en tiempo real (<a href="https://habitusutos.vercel.app" target="_blank" className="underline text-cyan-400">habitusutos.vercel.app</a>).</p>
            <p>4. <span className="text-white font-semibold">BecaliaCo</span> — SaaS de descubrimiento de becas con agentes IA y pagos en producción (<a href="https://becaliaco.com" target="_blank" className="underline text-cyan-400">becaliaco.com</a>).</p>
            <p>5. <span className="text-white font-semibold">Plataforma Mahates</span> — Monolito modular turístico liderando equipo de 5 ingenieros.</p>
            <p>6. <span className="text-white font-semibold">Lingua Viva</span> — App de inglés con IA adaptativa (2.º lugar nacional en el IV Seminario UdeC Magangué 2026).</p>
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-2 text-zinc-200">
            <p>• <span className="text-emerald-400 font-bold">Universidad de Cartagena</span> (Sep - Oct 2026): Desarrollador Backend para Habitusutos en tiempo real.</p>
            <p>• <span className="text-emerald-400 font-bold">Dran Digital</span> (Ene 2025 - Presente): Full Stack Developer principal (React, React Native, PHP, LangGraph, N8N).</p>
            <p>• <span className="text-emerald-400 font-bold">Alcaldía de Mahates</span> (Ene - Jul 2026): Líder técnico y Full Stack Developer (Node.js, PostgreSQL, Docker).</p>
            <p>• <span className="text-emerald-400 font-bold">Nequi — Bancolombia</span> (Ago - Sep 2024): Pasante en optimización de funnels e integraciones.</p>
            <p>• <span className="text-emerald-400 font-bold">SmartAssets</span> (Feb - Jun 2024): Fullstack PHP Developer y arquitectura web.</p>
          </div>
        );
        break;

      case 'education':
        output = (
          <div className="space-y-1.5 text-zinc-200">
            <p>• <span className="text-amber-400 font-bold">MAKAIA Bootcamp</span> (Oct 2026 — Actualidad): Especialización en Análisis de Datos con Inteligencia Artificial.</p>
            <p>• <span className="text-emerald-400 font-bold">Universidad de Cartagena</span> (Feb 2022 — Oct 2026): Ingeniería de Software.</p>
            <p>• <span className="text-cyan-400 font-bold">Universidad de Zaragoza</span> (Oct 2025): Pasantía Internacional de Investigación (Proyecto ALIRA).</p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-zinc-200">
            <p className="text-emerald-400 font-semibold">Coordenadas de contacto directo:</p>
            <p>Email: <a href="mailto:lbolanoa1@unicartagena.edu.co" className="text-cyan-300 underline">lbolanoa1@unicartagena.edu.co</a></p>
            <p>Teléfono: <a href="tel:+573008037847" className="text-cyan-300 underline">+57 300 803 7847</a></p>
            <p>GitHub: <a href="https://github.com/leiderdario" target="_blank" className="text-cyan-300 underline">github.com/leiderdario</a></p>
            <p>Ubicación: Medellín / Cartagena, Colombia</p>
          </div>
        );
        break;

      case 'sudo':
        if (arg.includes('hire leider') || arg.includes('hire')) {
          output = (
            <div className="space-y-2 text-emerald-400 p-2 rounded border border-emerald-500/30 bg-emerald-950/30">
              <p className="font-bold text-base">🎉 [AUTH GRANTED]: ¡Propuesta desbloqueada con éxito!</p>
              <p className="text-zinc-200">
                Has iniciado el protocolo de contratación de Leider Darío. Escribe directamente a <span className="text-white font-bold underline">lbolanoa1@unicartagena.edu.co</span> o llámale al <span className="text-white font-bold">+57 300 803 7847</span> para agendar una llamada y recibir respuesta en menos de 24 horas.
              </p>
            </div>
          );
        } else {
          output = `sudo: ${arg}: command not recognized. Try 'sudo hire leider'.`;
          isError = true;
        }
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'exit':
        setIsOpen(false);
        return;

      default:
        output = `Comando '${trimmed}' no encontrado en el sistema. Escribe 'help' para ver la lista de comandos disponibles.`;
        isError = true;
    }

    setHistory((prev) => [...prev, { command: trimmed, output, isError }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = cmdHistoryIdx < 0 ? cmdHistory.length - 1 : Math.max(0, cmdHistoryIdx - 1);
        setCmdHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistoryIdx >= 0) {
        const nextIdx = cmdHistoryIdx + 1;
        if (nextIdx < cmdHistory.length) {
          setCmdHistoryIdx(nextIdx);
          setInput(cmdHistory[nextIdx]);
        } else {
          setCmdHistoryIdx(-1);
          setInput('');
        }
      }
    }
  };

  return (
    <>
      {/* Easter Egg Trigger badge in footer / corner */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          playClickSound(true);
        }}
        className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/85 px-3 py-1.5 font-mono text-xs text-emerald-400 shadow-xl backdrop-blur-md transition-all hover:border-emerald-400 hover:bg-emerald-950/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        title="Abrir terminal interactiva (~)"
      >
        <Terminal size={14} />
        <span>Terminal (~ / `)</span>
      </button>

      {/* Terminal Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex h-[620px] max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-emerald-500/40 bg-[#0c1015]/95 font-mono text-xs shadow-2xl ring-1 ring-emerald-500/20">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-[#161c24] px-4 py-2.5 select-none">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="size-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  aria-label="Close"
                />
                <span className="size-3 rounded-full bg-yellow-500" />
                <span className="size-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-zinc-400 text-[11px] font-mono">
                  leider@offensive-ai:~$ (zsh)
                </span>
              </div>

              <div className="flex items-center gap-3 text-zinc-400">
                <span className="text-[10px] uppercase text-zinc-500 hidden sm:inline">Press ESC to exit</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded p-0.5 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={scrollRef}
              onClick={() => inputRef.current?.focus()}
              className="flex-1 overflow-y-auto p-4 space-y-3 font-mono cursor-text"
            >
              {history.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  {item.command && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="text-zinc-500">leider@kali:~$</span>
                      <span className="text-white font-medium">{item.command}</span>
                    </div>
                  )}
                  <div className={cn('text-zinc-300 leading-relaxed pl-2 border-l border-zinc-800/80', item.isError && 'text-red-400')}>
                    {item.output}
                  </div>
                </div>
              ))}

              {/* Active Prompt Line */}
              <div className="flex items-center gap-2 pt-1 text-emerald-400">
                <span className="text-zinc-500 select-none">leider@kali:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-emerald-300 outline-none border-none caret-emerald-400 font-mono text-xs"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
