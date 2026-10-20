// ============================================================================
// Fluxo CRM — Landing page de vendas (corretor autônomo)
// COMPONENTE REACT ÚNICO E AUTOCONTIDO. React 19 + Tailwind CSS v4.
//
// Dependências (já presentes no projeto):
//   • Tailwind CSS v4  • Font Awesome global (classes fa-solid / fa-brands)
//
// TEMA: dark é o padrão; o modo é controlado pela classe "dark" no <html>.
// A estratégia de classe está habilitada em src/index.css:
//     @custom-variant dark (&:where(.dark, .dark *));
// IMPORTANTE: o app logado NÃO usa a classe .dark (faz dark via prop JS).
// Por isso esta página REMOVE a classe .dark ao desmontar (cleanup do efeito),
// evitando que o tema escuro "vaze" para o restante do app ao navegar.
//
// PRINTS: troque os caminhos /prints/*.png pelas imagens reais das telas.
// Enquanto não existirem, aparece um placeholder com a legenda da tela.
//
// CHECKOUT: ajuste CHECKOUT_URL abaixo para o seu link real de assinatura
// (Hotmart / Kiwify / Stripe / etc). Por enquanto aponta para /planos.
// ============================================================================
import React, { useState, useEffect, useRef } from "react";
import PlanosCards from "./components/planos/PlanosCards";
import { GARANTIA_DIAS } from "./config/planos";
import AppOriginal from "./AppOriginal";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";

// Os CTAs "Assinar" rolam até a seção de planos (a tabela de 3 cards com toggle).
const CHECKOUT_URL = "#preco";

// ============================================================================
// FLUXO — Primitivos de UI compartilhados (landing de vendas)
// Casam com o visual do app: logo azul–indigo, slate, rounded-3xl/xl,
// shadow suave, Font Awesome. Tema claro + escuro (variantes dark:).
// ============================================================================
// ── Logo Fluxo (igual ao da sidebar do app) ─────────────────────────────────
function Logo({ size = "md", onVoltar }) {
  const box = size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  const word = size === "lg" ? "text-2xl" : "text-lg";
  return (
    <a
      href={onVoltar ? "/" : "#topo"}
      onClick={(e) => {
        if (onVoltar) {
          e.preventDefault();
          onVoltar();
        }
      }}
      className="flex items-center gap-3 group"
    >
      <div
        className={`${box} rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105`}
      >
        <img
          src="/favicon.png"
          alt="Fluxo"
          className="w-full h-full object-cover"
        />
      </div>
      <span
        className={`${word} font-black tracking-tight text-slate-800 dark:text-white`}
      >
        Fluxo
      </span>
    </a>
  );
}

// ── Botão de tema (sol / lua) ────────────────────────────────────────────────
function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-label="Alternar tema"
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-colors
                 border-slate-200 bg-white text-slate-600 hover:bg-slate-50
                 dark:border-slate-700 dark:bg-slate-800/60 dark:text-amber-300 dark:hover:bg-slate-800"
    >
      <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"} text-sm`} />
    </button>
  );
}

// ── Botão CTA reutilizável ───────────────────────────────────────────────────
function CTA({
  children,
  variant = "primary",
  size = "md",
  icon,
  href = "#preco",
  className = "",
}) {
  const sizes = {
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-7 text-base",
  };
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 " +
      "dark:bg-slate-800/60 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
    white:
      "bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10 hover:-translate-y-0.5",
    ghostWhite:
      "bg-white/10 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm",
  };
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl font-bold tracking-tight transition-all duration-200 ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {icon && <i className={`fa-solid ${icon}`} />}
      <span>{children}</span>
    </a>
  );
}

// ── Eyebrow / selo de seção ──────────────────────────────────────────────────
function Eyebrow({ icon, children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
    amber:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    emerald:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    slate:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${tones[tone]}`}
    >
      {icon && <i className={`fa-solid ${icon} text-[10px]`} />}
      {children}
    </span>
  );
}

// ── Slot de print: <img src="/prints/..."> com fallback de placeholder ───────
// Faz um probe da imagem antes de montá-la: enquanto o print real não existir
// em /prints/..., mostramos só o placeholder (sem requisição quebrada nem
// imagem partida). Quando você colocar o arquivo real, ele aparece sozinho.
function ScreenSlot({ src, label, icon = "fa-image", ratio = "16/10" }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    const probe = new Image();
    probe.onload = () => {
      if (alive) setOk(true);
    };
    probe.onerror = () => {
      if (alive) setOk(false);
    };
    probe.src = src;
    return () => {
      alive = false;
    };
  }, [src]);
  const showPlaceholder = !ok;
  return (
    <div
      className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900"
      style={{ aspectRatio: ratio }}
    >
      {/* Imagem real (você troca depois em /prints/...) — só monta se existir */}
      {ok && (
        <img
          src={src}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      )}
      {/* Placeholder visual enquanto não há print real */}
      {showPlaceholder && (
        <div className="absolute inset-0 slot-stripes flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
            <i
              className={`fa-solid ${icon} text-xl text-slate-400 dark:text-slate-500`}
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-300">
              {label}
            </p>
            <p className="text-[10px] font-mono tracking-tight text-slate-400 dark:text-slate-500">
              {src}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Moldura de navegador (com a barrinha de pontos) ──────────────────────────
function BrowserMockup({
  src,
  label,
  icon,
  url = "app.fluxocrm.com.br",
  ratio = "16/10",
  className = "",
  children,
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_20px_60px_-15px_rgba(2,6,23,0.25)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] ${className}`}
    >
      {/* Barra do navegador */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/90" />
          <span className="w-3 h-3 rounded-full bg-amber-400/90" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/90" />
        </div>
        <div className="flex-1 hidden sm:flex items-center gap-2 mx-2 px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-400 dark:text-slate-500">
          <i className="fa-solid fa-lock text-[9px] text-emerald-500" />
          <span className="font-medium">{url}</span>
        </div>
      </div>
      {children ? (
        <div className="relative w-full" style={{ aspectRatio: ratio }}>
          {children}
        </div>
      ) : (
        <ScreenSlot src={src} label={label} icon={icon} ratio={ratio} />
      )}
    </div>
  );
}

// ── "Print fixo": renderiza o mockup numa tela de largura DESKTOP e escala ────
// Em vez de deixar o mockup reflowar (e ficar espremido no celular), montamos
// o conteúdo numa "tela" de largura fixa (width, ex. 600px = visão de PC) e
// usamos transform: scale() pra encolher proporcionalmente até caber na caixa.
// Resultado: no celular aparece a MESMA foto do PC, só menor (como um print).
// Use junto com a prop `fixo` do mockup (força o layout desktop, já que os
// breakpoints `sm:` do Tailwind seguem o viewport, não a largura da tela fixa).
function FixedShot({ width = 600, ratio = "16/10", children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  const [rw, rh] = ratio.split("/").map(Number);
  const height = (width * rh) / rw;
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div
        className="relative"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Mockup em código: tela de Mensagens prontas (WhatsApp + e-mail) ───────────
// Renderizado em JSX/CSS (sem print), no estilo do app: lista de modelos
// salvos, abas WhatsApp/E-mail e um cartão com variáveis. Decorativo.
function MockupTemplates() {
  const modelos = [
    {
      icon: "fa-whatsapp",
      brand: true,
      tone: "emerald",
      nome: "Primeiro contato",
      previa: "Oi {{nome}}, vi seu interesse no {{imovel}}! Posso te enviar...",
    },
    {
      icon: "fa-whatsapp",
      brand: true,
      tone: "emerald",
      nome: "Follow-up 48h",
      previa: "{{nome}}, conseguiu ver a proposta do {{imovel}}? Fico à...",
    },
    {
      icon: "fa-envelope",
      brand: false,
      tone: "blue",
      nome: "Proposta enviada",
      previa: "Olá {{nome}}, segue a simulação do {{imovel}} no valor de...",
    },
  ];
  return (
    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/40 p-4 sm:p-5 flex flex-col gap-3 overflow-hidden">
      {/* Cabeçalho da tela */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <i className="fa-solid fa-comment-dots text-sm" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold text-slate-800 dark:text-white">
              Mensagens prontas
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Modelos de WhatsApp e e-mail
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-sm shadow-blue-600/30">
          <i className="fa-solid fa-plus text-[9px]" /> Novo modelo
        </span>
      </div>

      {/* Abas WhatsApp / E-mail */}
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200">
          <i className="fa-brands fa-whatsapp text-emerald-500" /> WhatsApp
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          <i className="fa-solid fa-envelope" /> E-mail
        </span>
      </div>

      {/* Lista de modelos */}
      <div className="flex flex-col gap-2">
        {modelos.map((m) => (
          <div
            key={m.nome}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none"
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${m.tone === "emerald"
                ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-300"
                }`}
            >
              <i
                className={`${m.brand ? "fa-brands" : "fa-solid"} ${m.icon} text-sm`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-slate-800 dark:text-white truncate">
                {m.nome}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                {m.previa}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1 text-slate-300 dark:text-slate-600">
              <i className="fa-solid fa-pen text-[10px]" />
              <i className="fa-solid fa-paper-plane text-[10px] text-blue-400 dark:text-blue-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé: variáveis disponíveis */}
      <div className="mt-auto flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Variáveis:
        </span>
        {["{{nome}}", "{{imovel}}", "{{valor}}"].map((v) => (
          <span
            key={v}
            className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 text-[10px] font-mono font-semibold"
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Mockup em código: Funil de Leads (Kanban) ────────────────────────────────
// Renderizado em JSX/CSS (sem print), no estilo do app: barra com fases
// coloridas + contador e cards de lead arrastáveis. Decorativo.
// ── Mockup INTERATIVO: Funil em 3 visuais (Kanban / Cards / Tabela) ───────────
// O visitante alterna o visual nos botões do topo e vê cada modo ao vivo.
// Renderizado em JSX/CSS (sem print); decorativo, com dados de exemplo.
function MockupFunilInterativo({ initialView = "kanban", fixo = false }) {
  const [view, setView] = useState(initialView);
  // Quando dentro do FixedShot (print de PC), forçamos o layout desktop —
  // os breakpoints `sm:` seguem o viewport, então no celular não disparariam.
  const smInline = fixo ? "inline" : "hidden sm:inline";
  const [faseSel, setFaseSel] = useState(0); // fase ativa nas visões Cards/Tabela

  const fases = [
    { nome: "Novo Lead", dot: "bg-blue-400", hex: "#60a5fa", badge: "blue" },
    { nome: "Em contato", dot: "bg-amber-400", hex: "#fbbf24", badge: "amber" },
    {
      nome: "Visita Agendada",
      dot: "bg-violet-400",
      hex: "#a78bfa",
      badge: "violet",
    },
    { nome: "Proposta", dot: "bg-indigo-400", hex: "#818cf8", badge: "indigo" },
    {
      nome: "Negócio",
      dot: "bg-emerald-400",
      hex: "#34d399",
      badge: "emerald",
      negocio: true,
    },
  ];
  const leads = [
    {
      nome: "Maria Santos",
      whatsapp: "(11) 98765-4321",
      imovel: "Res. Itaim · MCMV",
      valor: "R$ 240.000",
      score: 82,
      fase: 0,
    },
    {
      nome: "João Pereira",
      whatsapp: "(11) 99812-7744",
      imovel: "Cobertura Centro",
      valor: "R$ 520.000",
      score: 64,
      fase: 0,
    },
    {
      nome: "Ana Costa",
      whatsapp: "(11) 91234-5678",
      imovel: "Apto 2 dorms",
      valor: "R$ 310.000",
      score: 47,
      fase: 1,
    },
    {
      nome: "Carlos Lima",
      whatsapp: "(11) 98800-1122",
      imovel: "Flow Residencial",
      valor: "R$ 198.000",
      score: 73,
      fase: 1,
    },
    {
      nome: "Lucas Martins",
      whatsapp: "(11) 99466-2200",
      imovel: "Parque das Flores",
      valor: "R$ 365.000",
      score: 70,
      fase: 2,
    },
    {
      nome: "Beatriz Rocha",
      whatsapp: "(11) 99777-3344",
      imovel: "Jardim das Acácias",
      valor: "R$ 320.000",
      score: 91,
      fase: 3,
    },
    {
      nome: "Pedro Alves",
      whatsapp: "(11) 99555-8899",
      imovel: "Vista Verde",
      valor: "R$ 410.000",
      score: 58,
      fase: 4,
    },
    {
      nome: "Fernanda Dias",
      whatsapp: "(11) 99123-4567",
      imovel: "Apto Jardim Sul",
      valor: "R$ 275.000",
      score: 55,
      fase: 0,
    },
    {
      nome: "Rafael Gomes",
      whatsapp: "(11) 98456-7788",
      imovel: "Vila Nova · MCMV",
      valor: "R$ 215.000",
      score: 68,
      fase: 0,
    },
    {
      nome: "Juliana Reis",
      whatsapp: "(11) 99344-1290",
      imovel: "Ed. Aurora",
      valor: "R$ 340.000",
      score: 79,
      fase: 1,
    },
    {
      nome: "Marcos Vieira",
      whatsapp: "(11) 98221-5566",
      imovel: "Res. Bosque",
      valor: "R$ 295.000",
      score: 61,
      fase: 2,
    },
    {
      nome: "Camila Souza",
      whatsapp: "(11) 99877-2143",
      imovel: "Cond. Águas Claras",
      valor: "R$ 388.000",
      score: 85,
      fase: 3,
    },
  ];
  // Cor do Score igual ao CRM: ≥76 emerald · ≥51 green · ≥26 amber · resto red.
  const scoreBadge = (s) =>
    s >= 76
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
      : s >= 51
        ? "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300"
        : s >= 26
          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
          : "bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300";

  const tabs = [
    { id: "kanban", label: "Kanban", icon: "fa-table-columns" },
    { id: "cards", label: "Cards", icon: "fa-grip" },
    { id: "tabela", label: "Tabela", icon: "fa-table-list" },
  ];

  return (
    <div
      className={`absolute inset-0 bg-slate-50 dark:bg-slate-950/40 ${fixo ? "p-5" : "p-4 sm:p-5"} flex flex-col gap-3 overflow-hidden`}
    >
      {/* Barra superior com o seletor de visual */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-table-columns text-sm" />
          </div>
          <p className="text-[13px] font-bold text-slate-800 dark:text-white truncate">
            Funil de Leads
          </p>
        </div>
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex-shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setView(t.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors ${view === t.id
                ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
            >
              <i
                className={`fa-solid ${t.icon} text-[10px] ${view === t.id ? "text-blue-500" : ""}`}
              />
              <span className={smInline}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Barra de fases (só nas visões Cards/Tabela) — selecione a fase */}
      {view !== "kanban" && (
        <div className="flex items-center gap-1.5 overflow-hidden">
          {fases.map((f, fi) => {
            const ativo = faseSel === fi;
            const count = leads.filter((l) => l.fase === fi).length;
            return (
              <button
                key={f.nome}
                type="button"
                onClick={() => setFaseSel(fi)}
                style={ativo ? { borderColor: f.hex } : undefined}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-colors ${ativo
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
              >
                {f.negocio ? (
                  <i
                    className="fa-solid fa-handshake text-[10px]"
                    style={{ color: f.hex }}
                  />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${f.dot}`} />
                )}
                <span className={smInline}>{f.nome}</span>
                <span className="px-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Visual: KANBAN */}
      {view === "kanban" && (
        <div className="flex-1 grid grid-cols-5 gap-2 min-h-0">
          {fases.map((f, fi) => {
            const cards = leads.filter((l) => l.fase === fi);
            return (
              <div
                key={f.nome}
                className="flex flex-col gap-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 p-2"
              >
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${f.dot}`} />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">
                      {f.nome}
                    </span>
                  </div>
                  <span className="flex-shrink-0 px-1.5 rounded-full bg-white dark:bg-slate-800 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                    {cards.length}
                  </span>
                </div>
                {cards.map((card) => (
                  <div
                    key={card.nome}
                    className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1 h-9 rounded-full ${f.dot}`} />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 dark:text-white truncate leading-tight">
                          {card.nome}
                        </p>
                        <p className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-500 truncate">
                          <i className="fa-brands fa-whatsapp text-emerald-500" />
                          {card.whatsapp}
                        </p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
                          {card.imovel}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Visual: CARDS — leads da fase selecionada */}
      {view === "cards" && (
        <div
          className={`flex-1 grid ${fixo ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3"} gap-2 min-h-0 content-start overflow-hidden`}
        >
          {leads
            .filter((l) => l.fase === faseSel)
            .map((l) => {
              const f = fases[l.fase];
              return (
                <div
                  key={l.nome}
                  className="flex flex-col rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none"
                >
                  {/* Nome + Score */}
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="text-[12px] font-bold text-slate-800 dark:text-white truncate leading-tight">
                      {l.nome}
                    </p>
                    <span
                      className={`flex-shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${scoreBadge(l.score)}`}
                    >
                      {l.score}
                    </span>
                  </div>
                  {/* Campos */}
                  <div className="mt-1.5 space-y-0.5">
                    <p className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-500 truncate">
                      <i className="fa-brands fa-whatsapp text-emerald-500" />
                      {l.whatsapp}
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
                      {l.imovel} · {l.valor}
                    </p>
                  </div>
                  {/* Controle de fase no rodapé */}
                  <div className="mt-auto pt-2">
                    <div className="w-full flex items-center justify-between gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />
                        <span className="text-[9px] font-semibold truncate">
                          {f.nome}
                        </span>
                      </span>
                      <i className="fa-solid fa-chevron-down text-[8px] text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Visual: TABELA — colunas com divisórias, tudo na mesma linha */}
      {view === "tabela" && (
        <div className="flex-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden min-h-0">
          {/* Cabeçalho */}
          <div className="grid grid-cols-[1.2fr_1fr_1.1fr_0.5fr_0.8fr_0.9fr] divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            {[
              "Nome",
              "WhatsApp",
              "Empreendimento",
              "Score",
              "Valor",
              "Fase",
            ].map((h) => (
              <span
                key={h}
                className="px-2.5 py-2 text-[9px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 truncate"
              >
                {h}
              </span>
            ))}
          </div>
          {/* Linhas */}
          {leads
            .filter((l) => l.fase === faseSel)
            .map((l) => {
              const f = fases[l.fase];
              return (
                <div
                  key={l.nome}
                  className="grid grid-cols-[1.2fr_1fr_1.1fr_0.5fr_0.8fr_0.9fr] divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                >
                  <span className="px-2.5 py-2 text-[11px] font-bold text-slate-800 dark:text-white truncate">
                    {l.nome}
                  </span>
                  <span className="px-2.5 py-2 text-[10px] text-slate-500 dark:text-slate-400 truncate self-center">
                    {l.whatsapp}
                  </span>
                  <span className="px-2.5 py-2 text-[10px] text-slate-500 dark:text-slate-400 truncate self-center">
                    {l.imovel}
                  </span>
                  <span className="px-2.5 py-2 self-center">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-bold ${scoreBadge(l.score)}`}
                    >
                      {l.score}
                    </span>
                  </span>
                  <span className="px-2.5 py-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate self-center">
                    {l.valor}
                  </span>
                  <span className="px-2 py-2 self-center">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />
                      <span className="text-[8px] font-semibold truncate max-w-[42px]">
                        {f.nome}
                      </span>
                      <i className="fa-solid fa-chevron-down text-[7px] text-slate-300 dark:text-slate-600" />
                    </span>
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ── Mockups em código: chip de tom + card de KPI (StatCard do app) ────────────
const CHIP_TONE = {
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  red: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300",
};
function MockupStat({ tema = "blue", icon, titulo, valor, sub }) {
  return (
    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none">
      <div className="flex items-start justify-between gap-1.5">
        <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 leading-snug pt-0.5">
          {titulo}
        </span>
        <span
          className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${CHIP_TONE[tema]}`}
        >
          <i className={`fa-solid ${icon} text-[10px]`} />
        </span>
      </div>
      <p className="mt-2 text-[17px] leading-none font-semibold tracking-tight text-slate-800 dark:text-white tabular-nums">
        {valor}
      </p>
      {sub && (
        <p className="mt-1 text-[9px] font-medium text-slate-400 dark:text-slate-500">
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Mockup em código: Dashboard de Negócios (resultado comercial) ─────────────
function MockupNegocios() {
  const fechados = [
    {
      nome: "Pedro Alves",
      imovel: "Vista Verde",
      venda: "R$ 410.000",
      com: "R$ 24.600",
      data: "24/06",
    },
    {
      nome: "Lucas Dias",
      imovel: "Res. Aurora",
      venda: "R$ 285.000",
      com: "R$ 17.100",
      data: "19/06",
    },
    {
      nome: "Sofia Melo",
      imovel: "Cond. Park",
      venda: "R$ 530.000",
      com: "R$ 31.800",
      data: "12/06",
    },
  ];
  return (
    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/40 p-4 sm:p-5 flex flex-col gap-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="leading-tight">
          <p className="text-[13px] font-bold text-slate-800 dark:text-white">
            Negócios
          </p>
          <p className="text-[9px] text-slate-400 dark:text-slate-500">
            Resultado comercial
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
          <i className="fa-solid fa-calendar text-[9px] text-blue-500" /> 30
          dias
        </span>
      </div>

      {/* KPIs — 8 cards (2 linhas de 4), iguais ao dashboard real */}
      <div className="grid grid-cols-4 gap-2">
        <MockupStat
          tema="emerald"
          icon="fa-sack-dollar"
          titulo="VGV no período"
          valor="R$ 1,2 mi"
        />
        <MockupStat
          tema="blue"
          icon="fa-hand-holding-dollar"
          titulo="Comissão no período"
          valor="R$ 73 mil"
        />
        <MockupStat
          tema="purple"
          icon="fa-receipt"
          titulo="Ticket médio"
          valor="R$ 305 mil"
        />
        <MockupStat
          tema="emerald"
          icon="fa-trophy"
          titulo="Vendas no período"
          valor="4"
        />
        <MockupStat
          tema="blue"
          icon="fa-spinner"
          titulo="Em negociação"
          valor="R$ 940 mil"
          sub="3 negócios abertos"
        />
        <MockupStat
          tema="emerald"
          icon="fa-percent"
          titulo="Taxa de conversão"
          valor="67%"
        />
        <MockupStat
          tema="amber"
          icon="fa-circle-check"
          titulo="VGV total"
          valor="R$ 4,8 mi"
        />
        <MockupStat
          tema="red"
          icon="fa-ban"
          titulo="Perdidos no período"
          valor="2"
        />
      </div>

      {/* Negócios fechados recentes */}
      <div className="flex-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden min-h-0">
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-800 dark:text-white">
            Negócios Fechados Recentes
          </p>
        </div>
        <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr_0.6fr] px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40">
          {["Cliente", "Venda", "Comissão", "Data"].map((h, i) => (
            <span
              key={h}
              className={`text-[8px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 ${i > 0 ? "text-right" : ""}`}
            >
              {h}
            </span>
          ))}
        </div>
        {fechados.map((f) => (
          <div
            key={f.nome}
            className="grid grid-cols-[1.4fr_0.9fr_0.9fr_0.6fr] items-center px-3 py-1.5 border-t border-slate-50 dark:border-slate-800/60"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-800 dark:text-white truncate leading-tight">
                {f.nome}
              </p>
              <p className="text-[8px] text-slate-400 dark:text-slate-500 truncate">
                {f.imovel}
              </p>
            </div>
            <span className="text-[10px] font-semibold text-right text-slate-700 dark:text-slate-200 tabular-nums">
              {f.venda}
            </span>
            <span className="text-[10px] text-right text-slate-400 dark:text-slate-500 tabular-nums">
              {f.com}
            </span>
            <span className="text-[10px] text-right text-slate-400 dark:text-slate-500 tabular-nums">
              {f.data}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mockup em código: Dashboard (métricas + origens dos leads) ────────────────
function MockupMetricas() {
  const origens = [
    { nome: "Facebook Ads", pct: 45, cor: "bg-blue-500" },
    { nome: "Link público", pct: 32, cor: "bg-indigo-500" },
    { nome: "Landing page", pct: 23, cor: "bg-emerald-500" },
  ];
  return (
    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/40 p-4 sm:p-5 flex flex-col gap-3 overflow-hidden">
      <div className="leading-tight">
        <p className="text-[13px] font-bold text-slate-800 dark:text-white">
          Dashboard
        </p>
        <p className="text-[9px] text-slate-400 dark:text-slate-500">
          O que precisa da sua atenção hoje
        </p>
      </div>

      {/* Cards de ação — 8 cards iguais ao dashboard real */}
      <div className="grid grid-cols-4 gap-2">
        <MockupStat
          tema="red"
          icon="fa-phone-slash"
          titulo="Novo Lead"
          valor="4"
        />
        <MockupStat
          tema="blue"
          icon="fa-calendar-day"
          titulo="Follow-up hoje"
          valor="5"
        />
        <MockupStat
          tema="purple"
          icon="fa-house-circle-check"
          titulo="Visitas de hoje"
          valor="2"
        />
        <MockupStat
          tema="purple"
          icon="fa-calendar-days"
          titulo="Visitas futuras"
          valor="6"
        />
        <MockupStat
          tema="amber"
          icon="fa-triangle-exclamation"
          titulo="Leads esquecidos"
          valor="3"
        />
        <MockupStat
          tema="red"
          icon="fa-fire"
          titulo="Leads Quentes sem Retorno"
          valor="8"
        />
        <MockupStat
          tema="amber"
          icon="fa-clock-rotate-left"
          titulo="Follow-ups Atrasados"
          valor="1"
        />
        <MockupStat
          tema="blue"
          icon="fa-sack-dollar"
          titulo="VGV em pipeline"
          valor="R$ 2,1 mi"
        />
      </div>

      {/* Origens dos leads */}
      <div className="flex-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 min-h-0">
        <p className="text-[11px] font-bold text-slate-800 dark:text-white">
          Origens dos leads
        </p>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 mb-3">
          De onde vêm seus contatos
        </p>
        <div className="space-y-2.5">
          {origens.map((o) => (
            <div key={o.nome}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  {o.nome}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                  {o.pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${o.cor}`}
                  style={{ width: `${o.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Mockup em código: Link na Bio (página pública do corretor) ────────────────
function MockupLinkBio() {
  const blocos = [
    {
      icon: "fa-calculator",
      bg: "bg-blue-100",
      cor: "text-blue-600",
      titulo: "Simulação de financiamento",
      desc: "Veja se cabe no seu bolso",
    },
    {
      icon: "fa-building",
      bg: "bg-emerald-100",
      cor: "text-emerald-600",
      titulo: "Imóveis disponíveis",
      desc: "Confira meu portfólio",
    },
    {
      icon: "fa-chart-line",
      bg: "bg-indigo-100",
      cor: "text-indigo-600",
      titulo: "Rentabilidade do aluguel",
      desc: "Simule seu investimento",
    },
  ];
  const redes = [
    {
      bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
      icon: "fa-instagram",
    },
    { bg: "bg-blue-600", icon: "fa-facebook-f" },
    { bg: "bg-red-600", icon: "fa-youtube" },
  ];
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-200 flex flex-col items-center px-4 pt-6 pb-4 overflow-hidden">
      <div className="w-full max-w-[200px] flex flex-col items-center gap-2.5">
        {/* Avatar + nome */}
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center ring-4 ring-white shadow-md">
          <span className="text-white text-xl font-bold">J</span>
        </div>
        <div className="text-center">
          <p className="text-[14px] font-bold text-slate-800">João Silva</p>
          <p className="text-[10px] text-slate-500">Corretor de Imóveis</p>
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600 text-[8px] font-semibold">
            <i className="fa-solid fa-shield-halved text-[7px]" /> CRECI
            123456-F
          </span>
          <p className="text-[9px] text-slate-600 mt-1.5 leading-relaxed">
            Realizo o sonho da casa própria com MCMV.
          </p>
        </div>

        {/* WhatsApp */}
        <div className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 text-white font-semibold py-2 rounded-xl shadow-md shadow-emerald-500/30 text-[11px]">
          <i className="fa-brands fa-whatsapp" /> Falar no WhatsApp
        </div>

        {/* Blocos */}
        {blocos.map((b) => (
          <div
            key={b.titulo}
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 flex items-center gap-2 shadow-sm"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${b.bg}`}
            >
              <i className={`fa-solid ${b.icon} ${b.cor} text-[11px]`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-800 leading-tight truncate">
                {b.titulo}
              </p>
              <p className="text-[8px] text-slate-500 truncate">{b.desc}</p>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-300 text-[10px]" />
          </div>
        ))}

        {/* Redes */}
        <div className="flex items-center justify-center gap-2 mt-1">
          {redes.map((r) => (
            <span
              key={r.icon}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm ${r.bg}`}
            >
              <i className={`fa-brands ${r.icon} text-[11px]`} />
            </span>
          ))}
        </div>
        <p className="text-[8px] text-slate-400 mt-1">
          By <span className="font-semibold text-slate-500">Fluxo</span>
        </p>
      </div>
    </div>
  );
}

// ── Moldura de celular ───────────────────────────────────────────────────────
function PhoneMockup({ src, label, icon, className = "", children }) {
  return (
    <div
      className={`relative mx-auto w-[260px] max-w-full rounded-[2.5rem] border-[10px] border-slate-900 dark:border-slate-700 bg-slate-900 dark:bg-slate-700 shadow-[0_30px_70px_-20px_rgba(2,6,23,0.5)] ${className}`}
    >
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 dark:bg-slate-700 rounded-full z-10" />
      <div className="rounded-[1.8rem] overflow-hidden bg-white dark:bg-slate-900">
        {children ? (
          <div className="relative w-full" style={{ aspectRatio: "9/19" }}>
            {children}
          </div>
        ) : (
          <ScreenSlot src={src} label={label} icon={icon} ratio="9/19" />
        )}
      </div>
    </div>
  );
}

// ── Card de funcionalidade (ícone + título + descrição) ──────────────────────
function FeatureCard({ icon, title, children, tone = "blue" }) {
  const tones = {
    blue: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10",
    indigo:
      "text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10",
    emerald:
      "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10",
    amber:
      "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10",
    purple:
      "text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-500/10",
    cyan: "text-cyan-600 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-500/10",
  };
  return (
    <div
      className="group p-6 rounded-2xl border bg-white border-slate-200 hover:border-blue-200 hover:-translate-y-1
                    dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-blue-500/40
                    shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-300"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${tones[tone]}`}
      >
        <i className={`fa-solid ${icon} text-lg`} />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {children}
      </p>
    </div>
  );
}

// ── Item de FAQ (acordeão) ───────────────────────────────────────────────────
function FaqItem({ q, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={`rounded-2xl border transition-colors ${open
        ? "bg-white border-blue-200 dark:bg-slate-900 dark:border-blue-500/40"
        : "bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700"
        }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5"
      >
        <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight">
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${open
            ? "bg-blue-600 text-white rotate-180"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }`}
        >
          <i className="fa-solid fa-chevron-down text-xs" />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Hook: revela elementos no scroll ─────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ============================================================================
// FLUXO — Seções A: Navbar, Hero, A Dor, Diferencial
// ============================================================================

// ── 1. NAVBAR fixa ───────────────────────────────────────────────────────────
function Navbar({ dark, onToggleTheme, onVerPlanos }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#funcionalidades", label: "Funcionalidades" },
    { href: "#bonus", label: "Simulador Pro" },
    { href: "/planos", label: "Preço", isPlanos: true },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">
        <Logo />

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                if (l.isPlanos && onVerPlanos) {
                  e.preventDefault();
                  onVerPlanos();
                }
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70
                         dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <CTA
            href="https://app.fluxocrm.com.br/login"
            icon="fa-arrow-right-to-bracket"
            variant="secondary"
            className="hidden sm:inline-flex"
          >
            Já tem conta? Login
          </CTA>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600
                       dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
          >
            <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"}`}
      >
        <div className="px-4 pb-4 pt-1 space-y-1 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                setOpen(false);
                if (l.isPlanos && onVerPlanos) {
                  e.preventDefault();
                  onVerPlanos();
                }
              }}
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          <CTA
            href="https://app.fluxocrm.com.br/login"
            icon="fa-arrow-right-to-bracket"
            variant="secondary"
            className="w-full mt-2"
          >
            Já tem conta? Login
          </CTA>
        </div>
      </div>
    </header>
  );
}

// ── 2. HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24"
    >
      {/* Brilhos de fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-blue-500/10 dark:bg-blue-600/20 blur-3xl" />
        <div className="absolute top-10 right-0 w-[420px] h-[420px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(37,99,235,0.06),transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Texto */}
          <div>
            <div className="flex justify-center">
              <Eyebrow icon="fa-house-user">
                CRM para o corretor autônomo
              </Eyebrow>
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] font-black tracking-tight text-slate-900 dark:text-white text-balance">
              Cada lead perdido é{" "}
              <span className="text-blue-600 dark:text-blue-400">
                uma comissão
              </span>{" "}
              — que nunca chega
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-pretty">
              Diferente dos CRMs inchados feitos para imobiliárias, o{" "}
              <strong className="text-slate-800 dark:text-white font-bold">
                Fluxo é simples, funcional e focado no corretor autônomo
              </strong>
              . O Fluxo ajuda você a responder mais rápido, acompanhar negociações e aumentar suas chances de fechar cada venda.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
              {/* Ação principal = começar o teste grátis (leva ao cadastro; a
                  ativação é 1 clique no painel — ver TrialBanner). */}
              <CTA href="https://app.fluxocrm.com.br/login?cadastro=1" size="lg" icon="fa-bolt">
                Começar teste grátis
              </CTA>
              <CTA
                href={CHECKOUT_URL}
                size="lg"
                variant="secondary"
                icon="fa-tag"
              >
                Ver planos
              </CTA>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <i className="fa-solid fa-gift text-blue-500" /> 10 dias grátis do
                CRM Pro
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500" /> Sem
                cartão de crédito
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="fa-solid fa-mobile-screen text-indigo-500" />{" "}
                Funciona no celular
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 3. SEÇÃO "A DOR" ──────────────────────────────────────────────────────────
function Dor() {
  const dores = [
    {
      icon: "fa-comment-slash",
      tone: "red",
      title: "Lead perdido no WhatsApp",
      desc: "Conversa some no meio de mil mensagens e você não lembra quem era quente, quem pediu retorno nem o que combinou.",
    },
    {
      icon: "fa-clock-rotate-left",
      tone: "amber",
      title: "Follow-up que não acontece",
      desc: 'Sem lembrete, o retorno fica pra depois — e "depois" o cliente já fechou com outro corretor.',
    },
    {
      icon: "fa-table-cells-large",
      tone: "slate",
      title: "Planilha bagunçada",
      desc: "Várias abas, fórmulas quebradas, dado desatualizado. Você gasta mais tempo organizando do que vendendo.",
    },
    {
      icon: "fa-fire",
      tone: "red",
      title: "Não sabe o que está quente",
      desc: 'Sem visão do funil, é no "achismo". Você não enxerga quais negócios estão perto de fechar.',
    },
  ];
  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center reveal">
          <Eyebrow icon="fa-circle-exclamation" tone="slate">
            O dia a dia hoje
          </Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Vender é com você.{" "}
            <span className="text-slate-400 dark:text-slate-500">
              Se perder na organização, não.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 text-pretty">
            Todo corretor autônomo conhece essas dores. Elas custam vendas todo
            mês — e quase nunca é por falta de leads.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal">
          {dores.map((d) => (
            <div
              key={d.title}
              className="p-6 rounded-2xl border bg-white border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${d.tone === "red"
                  ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
                  : d.tone === "amber"
                    ? "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
              >
                <i className={`fa-solid ${d.icon}`} />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5">
                {d.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 4. SEÇÃO DIFERENCIAL ──────────────────────────────────────────────────────
function Diferencial() {
  const pilares = [
    {
      icon: "fa-feather-pointed",
      title: "Simples",
      desc: "Abriu, entendeu, usou. Sem manual, sem semana de implantação, sem consultor.",
    },
    {
      icon: "fa-bullseye",
      title: "Focado no autônomo",
      desc: "Feito pra um corretor — não pra uma equipe de 50 pessoas e uma diretoria.",
    },
    {
      icon: "fa-screwdriver-wrench",
      title: "Funcional",
      desc: "Só o que você usa de verdade: leads, tarefas, funil e proposta. Nada de tela morta.",
    },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 shadow-[0_30px_80px_-30px_rgba(37,99,235,0.6)] reveal">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.25),transparent_45%)]"
          />
          <div className="relative grid lg:grid-cols-2 gap-10 p-8 sm:p-12 lg:p-14 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/15 text-white border border-white/25">
                <i className="fa-solid fa-wand-magic-sparkles text-[10px]" />{" "}
                Por que o Fluxo é diferente
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-white text-balance">
                CRM de imobiliária é pesado. O seu não precisa ser.
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-blue-50/90 text-pretty">
                A maioria dos CRMs foi feito para imobiliárias com equipe,
                gestor e mil configurações. Pra um corretor autônomo, isso vira
                peso morto. O Fluxo corta o excesso e entrega o essencial —{" "}
                <strong className="text-white font-bold">
                  e ainda traz o Simulador Pro junto do funil
                </strong>
                , algo que nenhum outro une.
              </p>
              <div className="mt-7">
                <CTA
                  href="#funcionalidades"
                  variant="white"
                  icon="fa-arrow-right"
                >
                  Ver como funciona
                </CTA>
              </div>
            </div>
            <div className="grid sm:grid-cols-1 gap-3">
              {pilares.map((p) => (
                <div
                  key={p.title}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white">
                    <i className={`fa-solid ${p.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-blue-50/80">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 4.1. CARTEIRA E PATRIMÔNIO (O maior ativo do corretor) ─────────────────────
function CarteiraPatrimonio() {
  const pilares = [
    {
      icon: "fa-key",
      cor: "blue",
      titulo: "Independência total de imobiliárias",
      desc: "Mude de imobiliária, atue com múltiplos parceiros ou trabalhe 100% autônomo. Você nunca mais deixará seus clientes para trás em sistemas de terceiros.",
      tag: "Sua base com você",
    },
    {
      icon: "fa-shield-halved",
      cor: "emerald",
      titulo: "Blindado contra bloqueios do WhatsApp",
      desc: "Não dependa da sorte de um celular não estragar ou de uma conta de WhatsApp não ser bloqueada. Seus contatos e históricos ficam em nuvem protegida.",
      tag: "Backup seguro em nuvem",
    },
    {
      icon: "fa-arrows-rotate",
      cor: "indigo",
      titulo: "Comissões recorrentes e recompras",
      desc: "Quem comprou o primeiro imóvel com você hoje, compra o segundo amanhã e indica parentes depois. Uma base organizada rende vendas por anos na sua mão.",
      tag: "Patrimônio de longo prazo",
    },
  ];

  const CORES = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20",
  };

  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center reveal">
          <Eyebrow icon="fa-shield-halved" tone="blue">Patrimônio & Liberdade</Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Você não trabalha para o sistema da imobiliária.{" "}
            <span className="text-blue-600 dark:text-blue-400">
              A carteira de clientes é sua.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 text-pretty">
            Imobiliárias passam, construtoras mudam e plantões acabam. Mas a relação de confiança com o comprador é sua. O Fluxo foi feito para ser a sua fortaleza particular: seus leads, históricos e propostas pertencem a você — para sempre.
          </p>
        </div>

        {/* Grid dos 3 Pilares do Patrimônio */}
        <div className="mt-14 grid md:grid-cols-3 gap-6 reveal">
          {pilares.map((p) => (
            <div
              key={p.titulo}
              className="group relative p-8 rounded-3xl border bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${CORES[p.cor]}`}>
                    <i className={`fa-solid ${p.icon} text-lg`} />
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${CORES[p.cor]}`}>
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {p.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {p.desc}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <i className="fa-solid fa-circle-check text-xs" />
                <span>Garantido no Fluxo CRM</span>
              </div>
            </div>
          ))}
        </div>

        {/* Faixa de reflexão / autoridade */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-600/10 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 p-6 sm:p-7 text-center reveal">
          <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
            💡 <strong className="text-blue-600 dark:text-blue-400 font-bold">O maior erro de um corretor</strong> é passar anos gerando negócios para terceiros e, no fim das contas, não ter a sua própria base sob controle. Construa seu patrimônio com segurança.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FLUXO — Seções B: Funcionalidades (grid + blocos texto+print) e Bônus
// ============================================================================

// Bloco grande "texto + print" com lados alternados
function FeatureSplit({
  reverse,
  eyebrow,
  icon,
  title,
  desc,
  bullets,
  mockup,
  tone = "blue",
}) {
  return (
    <div className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center reveal`}>
      <div className={reverse ? "lg:order-2" : ""}>
        <Eyebrow icon={icon} tone={tone}>
          {eyebrow}
        </Eyebrow>
        <h3 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
          {title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 text-pretty">
          {desc}
        </p>
        <ul className="mt-6 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <i className="fa-solid fa-check text-[10px]" />
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-indigo-600/10 blur-2xl -z-10"
          />
          {mockup}
        </div>
      </div>
    </div>
  );
}

function Funcionalidades() {
  const pilares = [
    {
      numero: "01",
      icon: "fa-bolt",
      cor: "blue",
      badge: "Captação Automática",
      titulo: "Leads de anúncios e links caindo direto no seu funil",
      desc: "Integre campanhas do Meta Ads (Facebook/Instagram), Google Ads e suas páginas de captura. O cliente preenche e entra na hora no CRM com notificação imediata.",
      beneficios: [
        "Integração oficial com Meta e Google Ads",
        "Páginas de captura e link na Bio inclusos",
        "Redirecionamento automático pro seu WhatsApp",
        "Atendimento em segundos sem perder contato",
      ],
    },
    {
      numero: "02",
      icon: "fa-table-columns",
      cor: "indigo",
      badge: "Gestão Visual",
      titulo: "Funil Kanban com fases 100% personalizáveis",
      desc: "Arraste e solte os leads entre as etapas do seu processo comercial. Tenha a ficha completa do cliente com histórico, tarefas, anotações e score de qualificação.",
      beneficios: [
        "Visualização em Kanban, Cards ou Tabela",
        "Etapas, cores e tags customizáveis",
        "Ficha com histórico, anotações e propostas",
        "Zero leads esquecidos no WhatsApp",
      ],
    },
    {
      numero: "03",
      icon: "fa-comment-dots",
      cor: "emerald",
      badge: "Velocidade no Atendimento",
      titulo: "Respostas em 1 clique com mensagens inteligentes",
      desc: "Padronize seu atendimento sem travar pensando no que escrever. Modelos prontos de WhatsApp que preenchem sozinhos o nome do cliente, imóvel e valores da proposta.",
      beneficios: [
        "Modelos prontos de WhatsApp e e-mail",
        "Variáveis que preenchem os dados sozinhas",
        "Disparo com 1 clique direto da ficha do lead",
        "Agenda de follow-ups com alertas no sino",
      ],
    },
    {
      numero: "04",
      icon: "fa-sack-dollar",
      cor: "amber",
      badge: "Resultado Comercial",
      titulo: "Pipeline de negócios e previsão de comissões",
      desc: "Transforme leads em negócios com um clique. Saiba exatamente o VGV em negociação, comissões a receber, taxa de conversão e motivos de perda em tempo real.",
      beneficios: [
        "Pipeline de fechamento (Ganho vs. Perdido)",
        "Previsão de comissão e VGV somados",
        "Registro de motivos de perda para evoluir",
        "Métricas comerciais sem planilhas complexas",
      ],
    },
  ];

  const CORES = {
    blue: {
      badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/60 dark:border-blue-500/20",
      icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white",
      check: "text-blue-500",
      num: "text-blue-500/15 dark:text-blue-400/15",
      border: "hover:border-blue-300 dark:hover:border-blue-500/40",
    },
    indigo: {
      badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-500/20",
      icon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white",
      check: "text-indigo-500",
      num: "text-indigo-500/15 dark:text-indigo-400/15",
      border: "hover:border-indigo-300 dark:hover:border-indigo-500/40",
    },
    emerald: {
      badge: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20",
      icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
      check: "text-emerald-500",
      num: "text-emerald-500/15 dark:text-emerald-400/15",
      border: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
    },
    amber: {
      badge: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20",
      icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white",
      check: "text-amber-500",
      num: "text-amber-500/15 dark:text-amber-400/15",
      border: "hover:border-amber-300 dark:hover:border-amber-500/40",
    },
  };

  return (
    <section id="funcionalidades" className="py-16 sm:py-24 bg-slate-50/50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center reveal">
          <Eyebrow icon="fa-layer-group">Módulo CRM</Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Tudo que o corretor autônomo precisa. Sem complicação.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 text-pretty">
            Do primeiro contato até o recebimento da comissão, veja como o Fluxo organiza seu dia a dia em 4 pilares diretos:
          </p>
        </div>

        {/* Grid dos 4 Pilares de Alto Impacto */}
        <div className="mt-12 grid sm:grid-cols-2 gap-6 reveal">
          {pilares.map((p) => {
            const st = CORES[p.cor];
            return (
              <div
                key={p.numero}
                className={`group relative p-7 sm:p-8 rounded-3xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 ${st.border}`}
              >
                {/* Número decorativo de fundo */}
                <span className={`absolute top-6 right-7 font-black text-4xl select-none ${st.num}`}>
                  {p.numero}
                </span>

                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${st.icon}`}>
                    <i className={`fa-solid ${p.icon} text-lg`} />
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${st.badge}`}>
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {p.titulo}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {p.desc}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  {p.beneficios.map((b) => (
                    <div key={b} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      <i className={`fa-solid fa-circle-check text-xs ${st.check}`} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── 6. BÔNUS — SIMULADOR PRO ─────────────────────────────────────────
function Bonus() {
  // Os "fechadores": recursos que ajudam o corretor a CONVENCER e fechar a venda.
  // É aqui que mora a ênfase — o que tira a objeção e vira o "sim".
  const fechadores = [
    {
      icon: "fa-arrow-trend-up",
      title: "Relatório de Rentabilidade p/ Investidor",
      desc: 'Cliente achou caro? Vire o jogo. Mostre em número quanto o imóvel rende — valorização e aluguel — e transforme "tá caro" em "é investimento".',
    },
    {
      icon: "fa-calculator",
      title: "Simulador de Fluxo de Pagamento",
      desc: 'Crie propostas irrecusáveis. O simulador conta com autobalanceamento de parcelas, desconto automático e modo de apresentação.',
    },
    {
      icon: "fa-building-columns",
      title: "Financiamento, FGTS e amortização",
      desc: "SAC ou PRICE? Qual banco? Simule o financiamento, use o FGTS e antecipe parcelas pra provar na tela que cabe no bolso dele.",
    },
  ];

  // Recursos de apoio: montar e apresentar a proposta com cara de profissional.
  // Ferramentas (desconto, parcelas) aparecem aqui, em tom menor — de propósito.
  const apoio = [
    {
      icon: "fa-scale-balanced",
      title: "Comparador de cenários",
      desc: 'Duas propostas lado a lado. O cliente para de decidir se compra e passa a escolher qual leva — a dúvida vira "qual", não "se".',
    },
    {
      icon: "fa-person-digging",
      title: "Evolução de Obras",
      desc: "Calcule a projeção exata da fase de construção. Mostre a evolução dos juros de obra mês a mês e elimine surpresas para o comprador.",
    },
    {
      icon: "fa-file-lines",
      title: "PDF profissional e Link digital",
      desc: "Saia do print de calculadora. Gere uma proposta em PDF com a sua marca ou envie um link interativo para o cliente abrir no WhatsApp.",
    },
  ];

  return (
    <section
      id="bonus"
      className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-3xl mx-auto text-center reveal">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <i className="fa-solid fa-circle-check text-[11px]" /> Já incluso
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              no plano do CRM
            </span>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            O Simulador Pro que fecha a venda na conversa
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 text-pretty">
            Não é mais uma calculadora. É a ferramenta que{" "}
            <strong className="text-slate-800 dark:text-white font-bold">
              derruba a objeção do "tá caro"
            </strong>
            , prova que cabe no bolso e entrega uma proposta que o cliente abre,
            entende e compartilha.{" "}
            <strong className="text-slate-800 dark:text-white font-bold">
              Nenhum concorrente une CRM + Simulador assim.
            </strong>
          </p>
        </div>

        {/* Fechadores — os recursos que convencem (destaque) */}
        <div className="mt-12 grid lg:grid-cols-3 gap-5 reveal">
          {fechadores.map((f) => (
            <div
              key={f.title}
              className="group relative p-6 sm:p-7 rounded-3xl border-2 bg-white border-blue-100 hover:border-blue-300 dark:bg-slate-900/60 dark:border-blue-500/20 dark:hover:border-blue-500/40 shadow-[0_12px_40px_rgba(37,99,235,0.06)] dark:shadow-none transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 transition-transform duration-300 group-hover:scale-110">
                  <i className={`fa-solid ${f.icon} text-lg`} />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <i className="fa-solid fa-bolt text-[9px]" /> Fecha venda
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight text-balance">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 text-pretty">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Apoio — montar e apresentar a proposta */}
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 reveal">
          {apoio.map((a) => (
            <div
              key={a.title}
              className="flex items-start gap-4 p-5 rounded-2xl border bg-white border-slate-200 dark:bg-slate-900/60 dark:border-slate-800"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                <i className={`fa-solid ${a.icon} text-sm`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  {a.title}
                </h4>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mt-1">
                  {a.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Módulos extras + CTAs (incluindo testar grátis) */}
        <div className="mt-10 flex flex-col items-center gap-6 reveal">
          {/*<div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              E ainda inclui:
            </span>
            {[
              {
                icon: "fa-building-columns",
                label: "Financiamento (SAC/PRICE + FGTS)",
              },
              { icon: "fa-helmet-safety", label: "Evolução de Obras x INCC" },
            ].map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-white border-slate-200 text-slate-600 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300"
              >
                <i
                  className={`fa-solid ${f.icon} text-[11px] text-blue-500 dark:text-blue-400`}
                />
                {f.label}
              </span>
            ))}
          </div>*/}
          <div className="flex justify-center">
            <CTA href={CHECKOUT_URL} icon="fa-arrow-right">
              Quero o CRM + Simulador Pro
            </CTA>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FLUXO — Seções C: Preço + Garantia, FAQ, CTA Final, Footer
// ============================================================================

// ── 7. TESTE GRÁTIS — SEÇÃO DE FECHAMENTO NA HOME ───────────────────────────
function TesteGratisSecao({ onVerPlanos }) {
  return (
    <section id="preco" className="py-20 sm:py-28 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border-2 border-blue-500/60 dark:border-blue-500/40 bg-gradient-to-br from-blue-50 via-white to-blue-50/40 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-900 p-8 sm:p-14 text-center shadow-2xl shadow-blue-500/10 reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-6">
            <i className="fa-solid fa-gift text-[11px]" /> 10 dias 100% grátis
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white text-balance leading-tight">
            Experimente o CRM + Simulador{" "}
            <span className="text-blue-600 dark:text-blue-400">sem pagar nada</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-pretty">
            Crie sua conta em 1 minuto e libere tudo: funil Kanban, gestão de leads, tarefas, mensagens prontas de WhatsApp e o Simulador Pro de propostas. Sem cartão de crédito.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://app.fluxocrm.com.br/login?cadastro=1"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl font-bold tracking-tight h-14 px-8 text-base bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/30 hover:-translate-y-0.5 transition-all"
            >
              <i className="fa-solid fa-bolt" /> Começar meu teste grátis agora
            </a>

            <button
              onClick={onVerPlanos}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-14 px-6 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
            >
              <span>Ver planos e valores pagos</span>
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-emerald-500" /> Sem cartão de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-emerald-500" /> Ativação em 1 clique
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-emerald-500" /> Cancele quando quiser
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PÁGINA DEDICADA DE PLANOS (/planos) ──────────────────────────────────────
function PaginaPlanos({ dark, onToggleTheme, onVoltar, onVerTermos, onVerPrivacidade }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Planos e Preços | Fluxo CRM";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600/20">
      {/* Header específico da página de planos */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">
          <div onClick={onVoltar} className="cursor-pointer">
            <Logo />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle dark={dark} onToggle={onToggleTheme} />
            <button
              onClick={onVoltar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-xs" />
              <span>Voltar ao início</span>
            </button>
          </div>
        </div>
      </header>

      <main className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Eyebrow icon="fa-tag">Planos e Valores</Eyebrow>
            <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
              Escolha o plano ideal para a sua rotina.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 text-pretty">
              Comece pelo Simulador Pro ou vá direto para o CRM Pro completo. Assinatura transparente, sem multas e com garantia total.
            </p>
          </div>

          {/* Cards de Preços oficiais */}
          <PlanosCards />

          {/* Faixa de Teste Grátis de apoio */}
          <div className="mt-14 max-w-3xl mx-auto text-center p-7 sm:p-9 rounded-3xl bg-blue-50/60 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-gift text-xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Quer testar o CRM Pro antes de assinar?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mt-2">
              Ative 10 dias de teste 100% gratuito do CRM Pro. Sem cartão de crédito e sem pegadinhas.
            </p>
            <div className="mt-5">
              <a
                href="https://app.fluxocrm.com.br/login?cadastro=1"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-bolt" /> Começar teste grátis por 10 dias
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer
        onVerTermos={onVerTermos}
        onVerPrivacidade={onVerPrivacidade}
        onVoltarHome={onVoltar}
      />
    </div>
  );
}



// ── 8. FAQ ────────────────────────────────────────────────────────────────────
function Faq() {
  const itens = [
    {
      q: "Preciso ser de uma imobiliária?",
      a: "Não. O Fluxo foi feito justamente pro corretor autônomo. Você usa sozinho, no seu ritmo, sem depender de equipe, gestor ou TI.",
      open: true,
    },
    {
      q: "Tem teste grátis?",
      a: "Tem. Você cria sua conta e ativa 10 dias de teste do CRM Pro com um clique no painel — todas as ferramentas liberadas (leads, funil, tarefas, captura), sem cartão de crédito. Quando o teste acabar, é só escolher um plano pra continuar; nada é cobrado automaticamente.",
    },
    {
      q: "Tem garantia?",
      a: "Você tem 10 dias de teste 100% gratuito para usar a ferramenta na prática antes de assinar. Esse é o seu período de garantia — só assine se ver resultado.",
    },
    {
      q: "É difícil de configurar?",
      a: "Não. Você cria sua conta e já começa a usar. As fases do funil já vêm prontas (e você personaliza se quiser). Sem implantação, sem consultor, sem semana de treinamento.",
    },
    {
      q: "Funciona no celular?",
      a: "Sim. O Fluxo é responsivo e funciona no celular, tablet e computador. Você atualiza o lead e cria tarefas direto do WhatsApp, na rua, entre uma visita e outra.",
    },
    {
      q: "O simulador está incluso mesmo?",
      a: "Sim. O Simulador Pro já vem incluso no plano do CRM, sem custo extra. Você monta o fluxo de pagamento, gera PDF e link — tudo vinculado ao lead no funil.",
    },
    {
      q: "Posso personalizar as fases do meu funil?",
      a: 'Pode, 100%. Crie, renomeie e reordene as etapas como você trabalha. Cada fase tem cor e contador, e ainda existe a aba "Perdidos" pra não perder histórico.',
    },
    {
      q: "Como meus leads chegam até aqui?",
      a: "Pela captura automática: Meta Ads, seu link público ou as landing pages prontas do Fluxo. O lead preenche e cai direto na primeira fase do funil, com redirecionamento pro seu WhatsApp.",
    },
    {
      q: "Dá pra salvar mensagens prontas de WhatsApp e e-mail?",
      a: "Dá. Você cria e salva seus próprios modelos de WhatsApp e e-mail com variáveis (nome do cliente, imóvel, valor) e dispara direto da ficha do lead, em um clique. Padroniza o atendimento e acaba com o follow-up esquecido.",
    },
    {
      q: "O que é o Link na Bio?",
      a: "É a sua página pública de apresentação — o link que você coloca na bio do Instagram. Tem sua foto, CRECI, redes sociais e blocos com suas páginas e WhatsApp, tudo num endereço só. O endereço de captura já funciona no plano Pro; a página de LinkBio corretor personalizada é um recurso do plano Premium.",
    },
    {
      q: "E se eu não gostar?",
      a: "Você tem garantia incondicional de 14 dias (direito de arrependimento, CDC Art. 49). Não curtiu, devolvemos 100% do valor sem perguntas, só solicitar o reembolso.",
    },
  ];
  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/60"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center reveal">
          <Eyebrow icon="fa-circle-question">Perguntas frequentes</Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Ainda com dúvida? A gente responde.
          </h2>
        </div>
        <div className="mt-10 space-y-3 reveal">
          {itens.map((it) => (
            <FaqItem key={it.q} q={it.q} defaultOpen={it.open}>
              {it.a}
            </FaqItem>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 9. CTA FINAL ──────────────────────────────────────────────────────────────
function CtaFinal() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-14 sm:px-12 sm:py-20 text-center shadow-[0_30px_80px_-30px_rgba(37,99,235,0.6)] reveal">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_55%)]"
          />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white text-balance">
              Pare de perder venda por desorganização.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-blue-50/90 text-pretty">
              Organize seus leads, sua rotina e seus negócios num lugar só — com
              o Simulador Pro já incluso. Simples, funcional e feito pro
              corretor autônomo.
            </p>
            <div className="mt-8 flex justify-center">
              <CTA href="https://app.fluxocrm.com.br/login?cadastro=1" variant="white" size="lg" icon="fa-bolt">
                Começar teste grátis
              </CTA>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-50/90">
              <i className="fa-solid fa-gift text-emerald-300" />
              Teste grátis de 10 dias — sem cartão de crédito.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 10. FOOTER ────────────────────────────────────────────────────────────────
function Footer({ onVerTermos, onVerPrivacidade, onVoltarHome }) {
  const cols = [
    {
      title: "Produto",
      links: ["Funcionalidades", "Simulador Pro incluso", "Preço", "FAQ"],
    },
    {
      title: "Recursos",
      links: ["Captura de leads", "Funil Kanban", "Dashboard", "Tarefas"],
    },
    { title: "Empresa", links: ["Sobre o Fluxo", "Contato", "Suporte"] },
  ];
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Logo onVoltar={onVoltarHome} />
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-xs">
              O CRM simples, funcional e focado no corretor autônomo. Organize
              seus leads e feche mais vendas — sem perder tempo configurando
              ferramenta.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {["fa-instagram", "fa-whatsapp", "fa-youtube"].map((ic) => (
                <a
                  key={ic}
                  href="#"
                  aria-label={ic}
                  className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:border-blue-200 dark:hover:text-blue-400 transition-colors"
                >
                  <i className={`fa-brands ${ic}`} />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 Fluxo CRM. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-400 dark:text-slate-500">
            <a
              href="/termos"
              onClick={(e) => {
                if (onVerTermos) {
                  e.preventDefault();
                  onVerTermos();
                }
              }}
              className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              Termos de uso
            </a>
            <a
              href="/privacidade"
              onClick={(e) => {
                if (onVerPrivacidade) {
                  e.preventDefault();
                  onVerPrivacidade();
                }
              }}
              className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// FLUXO — App raiz: estado de tema (DARK por padrão) + composição + mount
// ============================================================================

function FluxoLandingPage() {
  // Tema escuro é o PADRÃO ao abrir
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("fluxo-theme");
      if (saved === "light") return false;
      if (saved === "dark") return true;
    } catch {
      /* localStorage indisponível — usa o padrão */
    }
    return true; // default dark
  });

  // Injeta uma vez os estilos auxiliares (sem dependência de CSS global):
  // - desliga transições durante a troca de tema (evita "congelar" o bg)
  // - animação de revelação no scroll (.reveal/.in)
  // - textura listrada dos placeholders de print (.slot-stripes)
  useEffect(() => {
    if (document.getElementById("fluxo-theme-style")) return;
    const st = document.createElement("style");
    st.id = "fluxo-theme-style";
    st.textContent = `
      html { scroll-behavior: smooth; }
      .fluxo-theme-switch, .fluxo-theme-switch *, .fluxo-theme-switch *::before, .fluxo-theme-switch *::after { transition: none !important; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .slot-stripes { background-image: repeating-linear-gradient(45deg, rgba(100,116,139,0.06) 0px, rgba(100,116,139,0.06) 10px, transparent 10px, transparent 20px); }
      .dark .slot-stripes { background-image: repeating-linear-gradient(45deg, rgba(148,163,184,0.07) 0px, rgba(148,163,184,0.07) 10px, transparent 10px, transparent 20px); }
      @media (prefers-reduced-motion: no-preference) {
        .reveal { opacity: 0; transform: translateY(18px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
        .reveal.in { opacity: 1; transform: none; }
      }`;
    document.head.appendChild(st);
  }, []);

  // Aplica/retira a classe "dark" no <html> e persiste.
  // Durante a troca, desliga transições e força reflow pra fixar o valor final.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("fluxo-theme-switch");
    root.classList.toggle("dark", dark);
    void root.offsetHeight; // commit imediato do estado final
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("fluxo-theme-switch"));
    });
    try {
      localStorage.setItem("fluxo-theme", dark ? "dark" : "light");
    } catch {
      /* ignora */
    }
    return () => cancelAnimationFrame(raf);
  }, [dark]);

  // IMPORTANTE: ao sair da landing, remove a classe .dark do <html>.
  // O app logado faz dark via prop JS (não usa .dark); sem isto, o tema escuro
  // da landing "vazaria" e ativaria todos os utilitários dark: do app.
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("fluxo-theme-switch");
    };
  }, []);

  useReveal();

  // Ao chegar via link com âncora (ex.: /crm#bonus vindo do Paywall do Simulador),
  // a navegação client-side do React Router NÃO rola sozinha — então rolamos aqui.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    // espera o conteúdo montar antes de buscar o alvo
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const [pagina, setPagina] = useState(() => {
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p.startsWith("/planos")) return "planos";
      if (p.startsWith("/termos")) return "termos";
      if (p.startsWith("/privacidade")) return "privacidade";
    }
    return "home";
  });

  useEffect(() => {
    const onPopState = () => {
      const p = window.location.pathname;
      if (p.startsWith("/planos")) {
        setPagina("planos");
      } else if (p.startsWith("/termos")) {
        setPagina("termos");
      } else if (p.startsWith("/privacidade")) {
        setPagina("privacidade");
      } else {
        setPagina("home");
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const irParaPlanos = () => {
    window.history.pushState(null, "", "/planos");
    setPagina("planos");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const irParaTermos = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    window.history.pushState(null, "", "/termos");
    setPagina("termos");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const irParaPrivacidade = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    window.history.pushState(null, "", "/privacidade");
    setPagina("privacidade");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const irParaHome = () => {
    window.history.pushState(null, "", "/");
    setPagina("home");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    if (pagina === "home") {
      document.title = "Fluxo CRM | O CRM e Simulador do Corretor Autônomo";
    }
  }, [pagina]);

  const [usarOriginal, setUsarOriginal] = useState(false);

  if (usarOriginal) {
    return (
      <div className="relative">
        <AppOriginal
          onVerTermos={irParaTermos}
          onVerPrivacidade={irParaPrivacidade}
        />
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setUsarOriginal(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-[11px] shadow-md transition-all border border-slate-700/60 backdrop-blur-sm cursor-pointer"
          >
            <i className="fa-solid fa-compress text-[10px] text-blue-400" /> Versão compacta
          </button>
        </div>
      </div>
    );
  }

  if (pagina === "termos") {
    return (
      <div className="relative">
        <Termos
          dark={dark}
          onToggleTheme={() => setDark((v) => !v)}
          onVoltar={irParaHome}
          onVerTermos={irParaTermos}
          onVerPrivacidade={irParaPrivacidade}
          Footer={Footer}
        />
        {/* Botão flutuante de teste para comparar com a versão original */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setUsarOriginal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-[11px] shadow-md transition-all border border-slate-700/60 backdrop-blur-sm cursor-pointer"
          >
            <i className="fa-solid fa-expand text-[10px] text-slate-400" /> Versão completa
          </button>
        </div>
      </div>
    );
  }

  if (pagina === "privacidade") {
    return (
      <div className="relative">
        <Privacidade
          dark={dark}
          onToggleTheme={() => setDark((v) => !v)}
          onVoltar={irParaHome}
          onVerTermos={irParaTermos}
          onVerPrivacidade={irParaPrivacidade}
          Footer={Footer}
        />
        {/* Botão flutuante de teste para comparar com a versão original */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setUsarOriginal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-[11px] shadow-md transition-all border border-slate-700/60 backdrop-blur-sm cursor-pointer"
          >
            <i className="fa-solid fa-expand text-[10px] text-slate-400" /> Versão completa
          </button>
        </div>
      </div>
    );
  }

  if (pagina === "planos") {
    return (
      <div className="relative">
        <PaginaPlanos
          dark={dark}
          onToggleTheme={() => setDark((v) => !v)}
          onVoltar={irParaHome}
          onVerTermos={irParaTermos}
          onVerPrivacidade={irParaPrivacidade}
        />
        {/* Botão flutuante de teste para comparar com a versão original */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setUsarOriginal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-[11px] shadow-md transition-all border border-slate-700/60 backdrop-blur-sm cursor-pointer"
          >
            <i className="fa-solid fa-expand text-[10px] text-slate-400" /> Versão completa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600/20">
      <Navbar dark={dark} onToggleTheme={() => setDark((v) => !v)} onVerPlanos={irParaPlanos} />
      <main>
        <Hero />
        <Dor />
        <Diferencial />
        <CarteiraPatrimonio />
        <Funcionalidades />
        <Bonus />
        <TesteGratisSecao onVerPlanos={irParaPlanos} />
        <Faq />
        <CtaFinal />
      </main>
      <Footer
        onVerTermos={irParaTermos}
        onVerPrivacidade={irParaPrivacidade}
        onVoltarHome={irParaHome}
      />

      {/* Botão flutuante de teste para comparar com a versão original */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setUsarOriginal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-[11px] shadow-md transition-all border border-slate-700/60 backdrop-blur-sm cursor-pointer"
        >
          <i className="fa-solid fa-expand text-[10px] text-slate-400" /> Versão completa
        </button>
      </div>
    </div>
  );
}
export default FluxoLandingPage;
