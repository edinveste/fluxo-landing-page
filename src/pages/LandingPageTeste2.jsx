// ============================================================================
// Fluxo CRM — Landing Page de Vendas (Abordagem: "O Fechador de Negócios")
// COMPONENTE REACT ÚNICO E AUTOCONTIDO. React 19 + Tailwind CSS v4.
//
// Dependências: Tailwind CSS v4, Font Awesome (fa-solid / fa-brands).
// TEMA: dark como padrão.
// ============================================================================
import React, { useState, useEffect } from "react";
import { GARANTIA_DIAS } from "../config/planos";

// ============================================================================
// PRIMITIVOS DE UI (Simples e reutilizáveis)
// ============================================================================
function ThemeToggle({ dark, onToggle }) {
  /* ... idêntico ao seu código ... */
  return (
    <button
      onClick={onToggle}
      title={dark ? "Modo claro" : "Modo escuro"}
      aria-label="Alternar tema"
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-colors border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-amber-300 dark:hover:bg-slate-800"
    >
      <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"} text-sm`} />
    </button>
  );
}

function CTA({ children, href = "#preco", icon, className = "" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl font-bold tracking-tight transition-all duration-200 h-14 px-7 text-base bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 ${className}`}
    >
      {icon && <i className={`fa-solid ${icon}`} />}
      <span>{children}</span>
    </a>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20">
      <i className="fa-solid fa-circle-exclamation text-[10px]" />
      {children}
    </span>
  );
}

// ── Hook: revela elementos no scroll (simplificado) ─────────────────────────
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
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ============================================================================
// COMPONENTES DA LANDING PAGE (Abordagem focada em DOR + SOLUÇÃO)
// ============================================================================

// 1. NAVBAR (Enxuta)
function Navbar({ dark, onToggleTheme }) {
  /* ... estrutura similar, mas com menos links ... */
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 transition-all duration-300">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#topo" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30">
            <img
              src="/favicon.png"
              alt="Fluxo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
            Fluxo
          </span>
        </a>
        <div className="flex items-center gap-3">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <CTA
            href="#preco"
            className="h-11 px-5 text-sm hidden sm:inline-flex"
          >
            Assinar Agora
          </CTA>
        </div>
      </nav>
    </header>
  );
}

// 2. HERO (Gatilho: O dinheiro que você perde AGORA)
function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-red-500/10 dark:bg-red-600/20 blur-3xl" />
        <div className="absolute bottom-10 left-0 w-[420px] h-[420px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/20 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex justify-center mb-5 reveal">
          <Eyebrow>Para corretores autônomos cansados de perder vendas</Eyebrow>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-black tracking-tight text-slate-900 dark:text-white text-balance reveal">
          Quanto dinheiro você{" "}
          <span className="text-red-500 dark:text-red-400 line-through decoration-red-500/50">
            perdeu
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            esse mês
          </span>{" "}
          por não dar um retorno?
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-pretty reveal">
          Leads quentes esquecidos no WhatsApp, follow-ups que nunca
          acontecem... Tudo isso vira comissão no bolso de outro corretor. O{" "}
          <strong className="text-slate-900 dark:text-white font-bold">
            Fluxo CRM
          </strong>{" "}
          +{" "}
          <strong className="text-slate-900 dark:text-white font-bold">
            Simulador Pro
          </strong>{" "}
          formam o sistema que faltava para você parar de perder e começar a
          faturar.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
          <CTA href="#preco" icon="fa-bolt">
            Quero parar de perder vendas
          </CTA>
          <a
            href="#garantia"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <i className="fa-solid fa-shield-halved text-emerald-500" />{" "}
            Garantia de {GARANTIA_DIAS} dias
          </a>
        </div>
      </div>
    </section>
  );
}

// 3. O PROBLEMA (Só 2 cards, os mais caros)
function Problema() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center reveal">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
          Duas falhas que matam sua comissão no final do mês
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
              <i className="fa-solid fa-comment-slash text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Lead Quente Esquecido
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              A conversa some no WhatsApp e você perde o timing. Quando lembra,
              o cliente já fechou com outro. Cada lead esquecido é uma venda a
              menos.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <i className="fa-solid fa-calculator text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Proposta Amadora
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Enviar um print da calculadora do banco ou uma nota no bloco de
              notas não convence ninguém. Uma apresentação profissional é o que
              fecha negócios de alto valor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 4. A SOLUÇÃO (Os 2 pilares: CRM Organizador + Simulador Fechador)
function Solucao() {
  return (
    <section id="solucao" className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center reveal">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            O único sistema que te ajuda a{" "}
            <span className="text-blue-600 dark:text-blue-400">organizar</span>{" "}
            E a{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              fechar
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 text-pretty max-w-2xl mx-auto">
            Enquanto outros CRMs só organizam, o Fluxo vai além. Ele une o
            controle total da sua rotina com a ferramenta de convencimento que
            falta na hora da negociação.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-10 items-start">
          {/* Pilar 1: CRM */}
          <div className="reveal rounded-2xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-white dark:from-blue-500/5 dark:to-slate-900/60 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                <i className="fa-solid fa-brain text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                CRM Organizador
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Nunca mais perca um lead. O Fluxo centraliza todos os seus
              contatos, do WhatsApp e de outras fontes, em um funil visual que
              mostra exatamente quem você precisa contatar hoje.
            </p>
            <ul className="space-y-3">
              {[
                "Funil Kanban para arrastar leads por fase",
                "Tarefas automáticas por urgência (Hoje, Atrasadas)",
                "Mensagens prontas de WhatsApp com variáveis",
                "Dashboard com os leads quentes que precisam de retorno",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <i className="fa-solid fa-check text-blue-500 mt-0.5 flex-shrink-0" />{" "}
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Pilar 2: Simulador */}
          <div className="reveal rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-500/5 dark:to-slate-900/60 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <i className="fa-solid fa-file-contract text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Simulador Fechador
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Pare de enviar prints amadores. O Simulador Pro gera uma proposta
              completa, com PDF e link personalizado, que elimina as objeções do
              cliente e prova que o imóvel cabe no bolso dele.
            </p>
            <ul className="space-y-3">
              {[
                "Simulação de financiamento SAC/Price + FGTS",
                "Relatório de Rentabilidade para investidores",
                "PDF profissional com sua marca e foto",
                "Link compartilhável para o cliente decidir com a família",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <i className="fa-solid fa-check text-emerald-500 mt-0.5 flex-shrink-0" />{" "}
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// 5. PROVA SOCIAL (Resultado visual rápido)
function Resultado() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center reveal">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
          Imagine seu mês que vem com esse controle
        </h2>

        {/* Placeholder para imagem de resultado, você pode trocar por um print real */}
        <div className="mt-10 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
          <img
            src="/prints/dashboard-negocios.png"
            alt="Dashboard de resultado do Fluxo CRM"
            className="w-full h-auto"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback caso a imagem não exista */}
          <div className="hidden absolute inset-0 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center gap-3 p-6 text-slate-400 dark:text-slate-500">
            <i className="fa-solid fa-chart-line text-4xl" />
            <p className="font-bold text-sm">
              Dashboard de Negócios: R$ 1,2 mi em pipeline
            </p>
            <p className="text-xs">
              Substitua por um print real em /prints/dashboard-negocios.png
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { valor: "R$ 1,2 mi", label: "VGV no período" },
            { valor: "R$ 73 mil", label: "Sua Comissão" },
            { valor: "67%", label: "Conversão do funil" },
            { valor: "0", label: "Leads esquecidos" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
            >
              <p className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">
                {stat.valor}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. GARANTIA + PLANOS (Call to action final)
function PrecoFinal() {
  return (
    <section id="preco" className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center reveal">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-500/10 mb-8">
          <i className="fa-solid fa-shield-halved text-emerald-600 dark:text-emerald-400 text-xl" />
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
            Garantia incondicional de {GARANTIA_DIAS} dias. Se não gostar,
            devolvemos 100% do seu dinheiro sem perguntas.
          </p>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
          Da organização do lead ao fechamento da venda, em um só lugar.
        </h2>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-400 text-pretty">
          Assine o Fluxo CRM hoje e tenha o Simulador Pro incluso para começar a
          fechar negócios mais rápido.
        </p>

        <div className="mt-10 flex justify-center">
          <CTA href="#planos" size="lg" icon="fa-arrow-right">
            Ver Planos e Assinar
          </CTA>
        </div>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          A partir de R$ 49/mês. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}

// ── FOOTER (Mínimo) ──────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2026 Fluxo CRM. Feito para o corretor autônomo vender mais.
        </p>
      </div>
    </footer>
  );
}

// ============================================================================
// FLUXO — App raiz
// ============================================================================
function LandingPageTeste2() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("fluxo-theme");
      return saved !== "light";
    } catch {
      return true;
    }
  });

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
    } catch {}
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
    const t = setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
    return () => clearTimeout(t);
  }, []);

  useReveal();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500/20">
      <Navbar dark={dark} onToggleTheme={() => setDark((v) => !v)} />
      <main>
        <Hero />
        <Problema />
        <Solucao />
        <Resultado />
        <PrecoFinal />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPageTeste2;
