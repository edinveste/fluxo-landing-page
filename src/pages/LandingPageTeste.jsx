// ============================================================================
// Fluxo CRM — Landing Page de Vendas (Abordagem: "Tudo que você recebe")
// COMPONENTE REACT ÚNICO E AUTOCONTIDO. React 19 + Tailwind CSS v4.
//
// Esta versão remove todos os mockups/prints e substitui por cards de
// benefícios detalhados, separando claramente o CRM do Simulador Pro.
// TEMA: dark como padrão.
// ============================================================================
import React, { useState, useEffect } from "react";
import PlanosCards from "../components/planos/PlanosCards";
import { GARANTIA_DIAS } from "../config/planos";

// ============================================================================
// PRIMITIVOS DE UI
// ============================================================================

// ── Logo Fluxo ─────────────────────────────────────────────────────────────
function Logo({ size = "md" }) {
  const box = size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  const word = size === "lg" ? "text-2xl" : "text-lg";
  return (
    <a href="#topo" className="flex items-center gap-3 group">
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

// ── Theme Toggle ───────────────────────────────────────────────────────────
function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-label="Alternar tema"
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-colors border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-amber-300 dark:hover:bg-slate-800"
    >
      <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"} text-sm`} />
    </button>
  );
}

// ── Botão CTA ──────────────────────────────────────────────────────────────
function CTA({
  children,
  variant = "primary",
  size = "md",
  icon,
  href = "#preco",
  className = "",
}) {
  const sizes = { md: "h-11 px-5 text-sm", lg: "h-14 px-7 text-base" };
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5",
    emerald:
      "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800/60 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
    white:
      "bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10 hover:-translate-y-0.5",
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

// ── Eyebrow / Selo de seção ────────────────────────────────────────────────
function Eyebrow({ icon, children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
    amber:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    emerald:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    slate:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    red: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
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

// ── Card de Benefício (com ícone, título, descrição e bullets) ─────────────
function BeneficioCard({
  icon,
  title,
  description,
  bullets = [],
  tone = "blue",
  destaque = false,
}) {
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
    red: "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/10",
  };

  return (
    <div
      className={`group p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1
      ${destaque
          ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:border-blue-500/30 dark:from-blue-500/5 dark:to-slate-900/60 shadow-[0_12px_40px_rgba(37,99,235,0.08)] dark:shadow-none"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none"
        }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${tones[tone]}`}
      >
        <i className={`fa-solid ${icon} text-lg`} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mb-4">
        {description}
      </p>
      {bullets.length > 0 && (
        <ul className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
            >
              <i
                className={`fa-solid fa-check text-[11px] mt-0.5 flex-shrink-0 ${tones[tone].split(" ")[0]}`}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Card de Estatística ────────────────────────────────────────────────────
function StatCard({ valor, label, icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300",
  };
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${tones[tone]}`}
      >
        <i className={`fa-solid ${icon} text-sm`} />
      </div>
      <p className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">
        {valor}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}

// ── Hook: revela elementos no scroll ───────────────────────────────────────
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
// SEÇÕES DA LANDING PAGE
// ============================================================================

// ── NAVBAR ─────────────────────────────────────────────────────────────────
function Navbar({ dark, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#crm", label: "CRM" },
    { href: "#simulador", label: "Simulador" },
    { href: "#bonus", label: "Bônus" },
    { href: "#preco", label: "Preço" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70" : "bg-transparent"}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">
        <Logo />
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <CTA
            href="#preco"
            icon="fa-arrow-right"
            className="hidden sm:inline-flex"
          >
            Assinar agora
          </CTA>
        </div>
      </nav>
    </header>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-blue-500/10 dark:bg-blue-600/20 blur-3xl" />
        <div className="absolute top-10 right-0 w-[420px] h-[420px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center reveal">
          <Eyebrow icon="fa-house-user">
            CRM + Simulador para Corretores Autônomos
          </Eyebrow>
        </div>
        <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-black tracking-tight text-slate-900 dark:text-white text-balance reveal">
          O sistema completo para{" "}
          <span className="text-blue-600 dark:text-blue-400">
            organizar seus leads
          </span>{" "}
          e{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            fechar mais vendas
          </span>
        </h1>
        <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-pretty reveal">
          Chega de perder vendas por desorganização. O{" "}
          <strong className="text-slate-800 dark:text-white font-bold">
            Fluxo CRM
          </strong>{" "}
          centraliza todos os seus leads, automatiza follow-ups e ainda inclui o{" "}
          <strong className="text-slate-800 dark:text-white font-bold">
            Simulador Pro
          </strong>{" "}
          — a ferramenta que gera propostas profissionais e convence o cliente
          na hora.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center reveal">
          <CTA href="#preco" size="lg" icon="fa-bolt">
            Quero organizar minha rotina
          </CTA>
          <CTA href="#crm" size="lg" variant="secondary" icon="fa-circle-play">
            Ver todos os benefícios
          </CTA>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center text-sm text-slate-500 dark:text-slate-400 reveal">
          <span className="inline-flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-emerald-500" />{" "}
            Garantia de {GARANTIA_DIAS} dias
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="fa-solid fa-gift text-blue-500" /> Simulador Pro
            incluso
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="fa-solid fa-mobile-screen text-indigo-500" /> Funciona
            no celular
          </span>
        </div>
      </div>
    </section>
  );
}

// ── O PROBLEMA (DORES) ─────────────────────────────────────────────────────
function Dores() {
  const dores = [
    {
      icon: "fa-comment-slash",
      tone: "red",
      title: "Lead perdido no WhatsApp",
      desc: "A conversa some na multidão de mensagens. Você esquece quem era quente, quem pediu retorno e perde o timing da venda.",
    },
    {
      icon: "fa-clock-rotate-left",
      tone: "amber",
      title: "Follow-up que nunca sai",
      desc: 'Sem lembrete, o retorno fica pra depois — e "depois" o cliente já fechou com outro corretor.',
    },
    {
      icon: "fa-table-cells-large",
      tone: "slate",
      title: "Planilha bagunçada",
      desc: "Múltiplas abas, fórmulas quebradas, dados desatualizados. Você gasta mais tempo organizando do que vendendo.",
    },
    {
      icon: "fa-file-pen",
      tone: "amber",
      title: "Proposta amadora",
      desc: "Print de calculadora ou bloco de notas não convence. Falta profissionalismo na hora de apresentar os números.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center reveal">
          <Eyebrow icon="fa-circle-exclamation" tone="red">
            O que está custando suas vendas
          </Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Esses 4 problemas matam sua comissão todo mês
          </h2>
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

// ── SEÇÃO CRM (Todos os benefícios do CRM) ─────────────────────────────────
function SecaoCRM() {
  const beneficios = [
    {
      icon: "fa-table-columns",
      tone: "blue",
      title: "Funil de Leads Kanban",
      description:
        "Visualize todos os seus leads em um funil Kanban 100% personalizável. Crie, renomeie e reordene as etapas do seu jeito.",
      bullets: [
        "Arraste e solte leads entre as fases",
        "Visão em Kanban, Cards ou Tabela",
        "Cores e contadores por etapa",
        'Aba "Perdidos" para não perder histórico',
      ],
      destaque: true,
    },
    {
      icon: "fa-id-card-clip",
      tone: "indigo",
      title: "Ficha Completa do Lead",
      description:
        "Todas as informações do cliente em um só lugar: dados de contato, histórico de interações, tarefas vinculadas, propostas e score financeiro.",
      bullets: [
        "Histórico completo de anotações",
        "Tarefas e propostas vinculadas",
        "Score financeiro do lead",
        "Campo de composição de renda",
      ],
    },
    {
      icon: "fa-list-check",
      tone: "amber",
      title: "Tarefas e Follow-ups",
      description:
        "Nunca mais esqueça um retorno. O Fluxo organiza suas tarefas por urgência e cria lembretes automáticos quando o lead muda de fase.",
      bullets: [
        "Agrupadas por: Hoje, Atrasadas, Próximos 7 dias",
        "Criação automática ao mover o lead",
        "Notificações no sistema",
        "Filtro por lead e por data",
      ],
    },
    {
      icon: "fa-comment-dots",
      tone: "emerald",
      title: "Mensagens Prontas (WhatsApp + E-mail)",
      description:
        "Crie e salve modelos de mensagens com variáveis como {{nome}}, {{imovel}} e {{valor}}. Na hora do follow-up, é um clique.",
      bullets: [
        "Modelos para WhatsApp e e-mail",
        "Variáveis que preenchem sozinhas",
        "Disparo direto da ficha do lead",
        "Padronize seu atendimento",
      ],
      destaque: true,
    },
    {
      icon: "fa-handshake",
      tone: "purple",
      title: "Pipeline de Negócios",
      description:
        "Transforme leads em negócios e acompanhe o resultado comercial. Feche como Ganho ou Perdido, registre valores de venda e comissão.",
      bullets: [
        "Conversão de lead para negócio",
        "Registro de valor de venda e comissão",
        "Motivo da perda para aprendizado",
        "Dashboard de resultado comercial",
      ],
    },
    {
      icon: "fa-chart-pie",
      tone: "blue",
      title: "Dashboard de Métricas",
      description:
        "Acompanhe a saúde do seu funil com métricas em tempo real: leads por origem, taxa de conversão, VGV em pipeline e muito mais.",
      bullets: [
        "Origens dos leads (Meta Ads, link, landing page)",
        "Taxa de conversão por fase",
        "VGV total em pipeline",
        "Filtro por período",
      ],
    },
    {
      icon: "fa-link",
      tone: "cyan",
      title: "Captura Automática de Leads",
      description:
        "Seus leads entram sozinhos no funil. Integração com Meta Ads, link público e landing pages que jogam o lead direto na primeira fase.",
      bullets: [
        "Integração com Meta Ads e Google Ads",
        "Link público personalizado",
        "Landing pages prontas",
        "Redirecionamento automático para seu WhatsApp",
      ],
      destaque: true,
    },
    {
      icon: "fa-bolt",
      tone: "purple",
      title: "Automações Inteligentes",
      description:
        "Ao mover um lead de fase, o Fluxo automaticamente cria a próxima tarefa e sugere o próximo passo. Menos trabalho manual, mais eficiência.",
      bullets: [
        "Criação automática de tarefas",
        "Sugestão de próximas ações",
        "Disparo de mensagens programadas",
        "Economia de tempo operacional",
      ],
    },
    {
      icon: "fa-mobile-screen-button",
      tone: "indigo",
      title: "100% Responsivo",
      description:
        "Use no computador, tablet ou celular. Atualize leads e crie tarefas direto do WhatsApp, entre uma visita e outra.",
      bullets: [
        "Funciona em qualquer dispositivo",
        "Interface adaptada para mobile",
        "Rápido e leve",
        "Acesso de qualquer lugar",
      ],
    },
  ];

  return (
    <section id="crm" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center reveal">
          <Eyebrow icon="fa-brain" tone="blue">
            CRM Fluxo
          </Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Tudo que você precisa para nunca mais perder um lead
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 text-pretty">
            Do primeiro contato ao fechamento, cada funcionalidade foi pensada
            para o dia a dia do corretor autônomo.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
          {beneficios.map((b) => (
            <BeneficioCard key={b.title} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO SIMULADOR PRO ────────────────────────────────────────────────────
function SecaoSimulador() {
  const fechadores = [
    {
      icon: "fa-calculator",
      tone: "emerald",
      title: "Simulador de Financiamento Completo",
      description:
        "Simule SAC e PRICE, use FGTS, entrada e parcelas intermediárias. Mostre ao cliente exatamente quanto ele vai pagar por mês.",
      bullets: [
        "SAC e PRICE com amortização",
        "FGTS no financiamento",
        "Entrada, balões e reforços",
        "Comparação entre bancos (taxas)",
      ],
      destaque: true,
    },
    {
      icon: "fa-arrow-trend-up",
      tone: "emerald",
      title: "Relatório de Rentabilidade",
      description:
        "Para o cliente investidor: mostre a valorização projetada do imóvel, o ganho com aluguel e compare com a poupança.",
      bullets: [
        "Projeção de valorização",
        "Cálculo de renda com aluguel",
        "Comparativo com poupança",
        "Payback do investimento",
      ],
    },
    {
      icon: "fa-scale-balanced",
      tone: "emerald",
      title: "Comparador de Cenários",
      description:
        'Coloque duas propostas lado a lado. O cliente para de decidir SE compra e passa a escolher QUAL — a dúvida vira "qual?", não "se?".',
      bullets: [
        "Comparação lado a lado",
        "Diferentes entradas e prazos",
        "Visual claro para o cliente",
        "Decisão mais rápida",
      ],
      destaque: true,
    },
    {
      icon: "fa-person-digging",
      tone: "blue",
      title: "Evolução de Obras",
      description:
        "Calcule a projeção exata da fase de construção. Mostre a evolução dos juros de obra mês a mês e elimine surpresas para o comprador.",
      bullets: [
        "Curva de evolução ajustável",
        "Cálculo exato de juros de obra",
        "Projeção mês a mês até a entrega",
        "PDF dedicado para apresentar",
      ],
    },
    {
      icon: "fa-file-lines",
      tone: "blue",
      title: "PDF Profissional e Link Digital",
      description:
        "Saia do print de calculadora. Entregue um PDF com sua marca ou compartilhe um link interativo para o cliente abrir no WhatsApp.",
      bullets: [
        "PDF com seu logo e cores",
        "Link que abre no WhatsApp",
        "Compartilhável com a família",
        "Cara de empresa grande",
      ],
    },
    {
      icon: "fa-palette",
      tone: "indigo",
      title: "100% Personalizado com Sua Marca",
      description:
        "Seu logo, suas cores, seu WhatsApp em tudo: no painel do simulador, no PDF e no link da proposta.",
      bullets: [
        "Logo e cores da sua marca",
        "Seu WhatsApp visível",
        "Profissionalismo em cada detalhe",
        "Diferenciação da concorrência",
      ],
      destaque: true,
    },
  ];

  const extras = [
    { icon: "fa-helmet-safety", label: "Evolução de Obras x INCC" },
    { icon: "fa-tags", label: "Descontos e Cupons" },
    { icon: "fa-sliders", label: "Auto Balanceamento de Parcelas" },
    { icon: "fa-building-columns", label: "Simulação por Banco (taxas reais)" },
  ];

  return (
    <section
      id="simulador"
      className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center reveal">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <i className="fa-solid fa-circle-check text-[11px]" /> Incluso em
              todos os planos
            </span>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Simulador Pro: a ferramenta que{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              fecha a venda
            </span>{" "}
            na conversa
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 text-pretty">
            Não é só uma calculadora. É o argumento definitivo que{" "}
            <strong className="text-slate-800 dark:text-white font-bold">
              derruba objeções
            </strong>
            , prova que cabe no bolso e entrega uma proposta profissional.{" "}
            <strong className="text-slate-800 dark:text-white font-bold">
              Nenhum outro CRM inclui isso.
            </strong>
          </p>
        </div>

        {/* Cards principais do Simulador */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
          {fechadores.map((f) => (
            <BeneficioCard key={f.title} {...f} />
          ))}
        </div>

        {/* Extras */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 reveal">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            E ainda inclui:
          </span>
          {extras.map((e) => (
            <span
              key={e.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-white border-slate-200 text-slate-600 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300"
            >
              <i
                className={`fa-solid ${e.icon} text-[11px] text-emerald-500`}
              />
              {e.label}
            </span>
          ))}
        </div>

        {/* CTA do Simulador */}
        <div className="mt-10 flex justify-center reveal">
          <CTA href="#preco" variant="emerald" size="lg" icon="fa-arrow-right">
            Quero o CRM + Simulador Pro
          </CTA>
        </div>
      </div>
    </section>
  );
}

// ── SEÇÃO BÔNUS ────────────────────────────────────────────────────────────
function SecaoBonus() {
  const bonus = [
    {
      icon: "fa-link",
      tone: "purple",
      title: "Link na Bio (Premium)",
      description:
        "Página pública personalizada para sua bio do Instagram: foto, CRECI, redes sociais e blocos com suas páginas e WhatsApp.",
      bullets: [
        "Foto, CRECI e apresentação",
        "Redes sociais integradas",
        "Blocos arrastáveis",
        "Tudo em um link só",
      ],
    },
    {
      icon: "fa-globe",
      tone: "cyan",
      title: "Link Público de Captura",
      description:
        "Um endereço web que captura leads automaticamente e os joga na primeira fase do seu funil.",
      bullets: [
        "Formulário de captura",
        "Lead cai direto no funil",
        "Redirecionamento para WhatsApp",
        "Disponível em todos os planos",
      ],
    },
    {
      icon: "fa-file-lines",
      tone: "indigo",
      title: "Landing Pages Prontas",
      description:
        "Páginas de captura prontas para usar em campanhas. O lead preenche e entra automaticamente no seu CRM.",
      bullets: [
        "Templates prontos",
        "Otimizadas para conversão",
        "Integração com funil",
        "Sem precisar de programador",
      ],
    },
  ];

  return (
    <section id="bonus" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center reveal">
          <Eyebrow icon="fa-gift" tone="amber">
            Bônus Exclusivos
          </Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Mais ferramentas para você vender ainda mais
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 text-pretty">
            Além do CRM e do Simulador, você recebe esses recursos extras para
            capturar leads e fortalecer sua presença online.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
          {bonus.map((b) => (
            <BeneficioCard key={b.title} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── RESULTADOS (Stats) ─────────────────────────────────────────────────────
function Resultados() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/15 text-white border border-white/25">
            <i className="fa-solid fa-trophy text-[10px]" /> Resultados reais
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-white text-balance">
            O que o Fluxo faz pelos corretores
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 reveal">
          <StatCard
            valor="4.2x"
            label="Mais conversão no funil"
            icon="fa-arrow-trend-up"
            tone="emerald"
          />
          <StatCard
            valor="R$ 73 mil"
            label="Comissão média/mês"
            icon="fa-sack-dollar"
            tone="emerald"
          />
          <StatCard
            valor="0"
            label="Leads esquecidos"
            icon="fa-comment-slash"
            tone="red"
          />
          <StatCard
            valor="14 dias"
            label="Para ver resultado"
            icon="fa-bolt"
            tone="amber"
          />
        </div>

        <p className="mt-8 text-blue-100/70 text-sm max-w-2xl mx-auto reveal">
          * Resultados baseados no uso consistente do CRM + Simulador Pro por
          corretores autônomos. Seus resultados podem variar conforme seu volume
          de leads e dedicação.
        </p>
      </div>
    </section>
  );
}

// ── SEÇÃO PREÇO ────────────────────────────────────────────────────────────
function Preco() {
  return (
    <section id="preco" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center reveal">
          <Eyebrow icon="fa-tag">Planos</Eyebrow>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            Escolha o plano do seu momento
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 text-pretty">
            Comece pelo Simulador Pro ou vá direto para o CRM completo. O
            Simulador Pro já vem incluso no plano do CRM.
          </p>
        </div>

        <div className="mt-12 reveal">
          <PlanosCards />
        </div>

        <div className="mt-12 flex justify-center reveal">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-500/10">
            <i className="fa-solid fa-shield-halved text-emerald-600 dark:text-emerald-400 text-lg" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Garantia incondicional de {GARANTIA_DIAS} dias — não gostou,
              devolvemos 100% do seu dinheiro, sem perguntas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA FINAL ──────────────────────────────────────────────────────────────
function CtaFinal() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/60">
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
              <CTA href="#preco" variant="white" size="lg" icon="fa-bolt">
                Assinar o Fluxo CRM
              </CTA>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-50/90">
              <i className="fa-solid fa-shield-halved text-emerald-300" />
              Garantia incondicional de {GARANTIA_DIAS} dias.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="flex items-center gap-5 text-xs text-slate-400 dark:text-slate-500">
            <a
              href="/termos"
              className="hover:text-slate-600 dark:hover:text-slate-300"
            >
              Termos de uso
            </a>
            <a
              href="/privacidade"
              className="hover:text-slate-600 dark:hover:text-slate-300"
            >
              Privacidade
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/70 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 Fluxo CRM. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// FLUXO — App raiz
// ============================================================================
function LandingPageTeste() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("fluxo-theme");
      if (saved === "light") return false;
      if (saved === "dark") return true;
    } catch { }
    return true;
  });

  useEffect(() => {
    if (document.getElementById("fluxo-theme-style")) return;
    const st = document.createElement("style");
    st.id = "fluxo-theme-style";
    st.textContent = `
      html { scroll-behavior: smooth; }
      .fluxo-theme-switch, .fluxo-theme-switch *, .fluxo-theme-switch *::before, .fluxo-theme-switch *::after { transition: none !important; }
      @media (prefers-reduced-motion: no-preference) {
        .reveal { opacity: 0; transform: translateY(18px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
        .reveal.in { opacity: 1; transform: none; }
      }`;
    document.head.appendChild(st);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("fluxo-theme-switch");
    root.classList.toggle("dark", dark);
    void root.offsetHeight;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("fluxo-theme-switch"));
    });
    try {
      localStorage.setItem("fluxo-theme", dark ? "dark" : "light");
    } catch { }
    return () => cancelAnimationFrame(raf);
  }, [dark]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("fluxo-theme-switch");
    };
  }, []);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  useReveal();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600/20">
      <Navbar dark={dark} onToggleTheme={() => setDark((v) => !v)} />
      <main>
        <Hero />
        <Dores />
        <SecaoCRM />
        <SecaoSimulador />
        <SecaoBonus />
        <Resultados />
        <Preco />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPageTeste;
