import React, { useState, useEffect } from "react";
import PlanosCards from "../components/planos/PlanosCards";
import { GARANTIA_DIAS } from "../config/planos";

const CHECKOUT_URL = "#preco";

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
    xl: "h-16 px-10 text-lg",
  };
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 " +
      "dark:bg-slate-800/60 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
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

function Navbar({ dark, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="topo"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm"
          : "bg-transparent py-2"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <CTA variant="primary" size="md" href={CHECKOUT_URL} className="hidden sm:inline-flex">
            Assinar Agora
          </CTA>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent blur-3xl rounded-full opacity-60 dark:opacity-40 -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20 mb-8 animate-fade-in-up">
          <i className="fa-solid fa-rocket" /> Acelere suas vendas
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
          O CRM Definitivo para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Corretores de Elite</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Feche mais negócios sem complicação. Um sistema direto ao ponto com simulador interativo, funil de vendas inteligente e automação de WhatsApp em um único lugar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTA size="xl" href={CHECKOUT_URL} icon="fa-bolt" className="w-full sm:w-auto">
            Começar Agora
          </CTA>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 sm:hidden">
            Garantia incondicional de {GARANTIA_DIAS} dias
          </p>
        </div>
        <div className="mt-8 hidden sm:flex items-center justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-check-circle text-emerald-500" /> Cancelamento grátis
          </span>
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-check-circle text-emerald-500" /> {GARANTIA_DIAS} dias de garantia
          </span>
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-check-circle text-emerald-500" /> Acesso imediato
          </span>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: "fa-calculator",
      title: "Simulador Interativo",
      desc: "Monte propostas comerciais irrecusáveis em segundos. Compare cenários, aplique descontos e mostre o valor real ao seu cliente na hora.",
      color: "blue"
    },
    {
      icon: "fa-filter",
      title: "Funil de Vendas (Kanban)",
      desc: "Organize seus leads visualmente. Saiba exatamente quem contatar hoje e não perca nenhuma oportunidade por falta de acompanhamento.",
      color: "emerald"
    },
    {
      icon: "fa-whatsapp",
      title: "Automação de WhatsApp",
      desc: "Modelos de mensagens prontos a um clique. Envie propostas, faça follow-ups e agende visitas diretamente pelo sistema de forma profissional.",
      color: "green"
    },
    {
      icon: "fa-chart-pie",
      title: "Métricas e Dashboard",
      desc: "Acompanhe seus resultados comerciais em tempo real. Veja sua taxa de conversão, comissões projetadas e metas alcançadas.",
      color: "purple"
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "emerald": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "green": return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
      case "purple": return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
      case "blue":
      default: return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    }
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#101726]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Tudo o que você precisa. Nada do que você não usa.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Diga adeus às planilhas confusas e sistemas complexos. O Fluxo CRM foi desenhado para ser rápido, prático e focado na conversão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white dark:bg-[#161f33] border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${getColorClasses(f.color)}`}>
                <i className={`fa-solid ${f.icon} text-2xl`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeneficiosExtra() {
  const itens = [
    {
      titulo: "Gere Confiança Imediata",
      desc: "Envie PDFs profissionais e limpos com a sua foto e a sua marca, passando muito mais segurança para o seu cliente já no primeiro contato.",
      icon: "fa-star"
    },
    {
      titulo: "Livre-se do Retrabalho",
      desc: "O cliente mudou de ideia e quer dar menos de entrada? Refaça a proposta em 2 segundos pelo celular e feche a venda na hora.",
      icon: "fa-bolt"
    },
    {
      titulo: "Nunca Perca o Timing",
      desc: "Com o nosso Kanban de vendas, você bate o olho e sabe exatamente quem está esperando um follow-up e quem está pronto para fechar.",
      icon: "fa-clock"
    },
    {
      titulo: "Link na Bio que Vende",
      desc: "Você ganha uma página de Linktree personalizada com sua foto e seus links para colocar no Instagram e capturar leads automaticamente.",
      icon: "fa-link"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Mais velocidade. Menos esforço.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A concorrência no mercado imobiliário não perdoa. Destaque-se entregando o melhor atendimento de forma escalável e sem dor de cabeça.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {itens.map((item, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                <i className={`fa-solid ${item.icon} text-xl`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.titulo}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Preco() {
  return (
    <section id="preco" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Planos simples e transparentes
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Escolha o melhor plano para o seu momento. Cancele quando quiser, sem burocracia.
          </p>
        </div>

        {/* Componente de planos reutilizado */}
        <PlanosCards dark={false} isPageDark={true} />

        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800/50">
            <i className="fa-solid fa-shield-halved text-emerald-500" />
            Satisfação garantida ou seu dinheiro de volta em até {GARANTIA_DIAS} dias.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <Logo />
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-500 text-center">
          © {new Date().getFullYear()} Fluxo CRM. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default function LpCrm() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("fluxo-theme");
      if (saved !== null) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return true; // default dark
    }
  });

  // Aplica/retira a classe "dark" no <html>
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
    } catch {
      /* ignora */
    }
    return () => cancelAnimationFrame(raf);
  }, [dark]);

  // Remove .dark ao desmontar para não vazar pro app
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("fluxo-theme-switch");
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600/20 font-sans">
      <Navbar dark={dark} onToggleTheme={() => setDark((v) => !v)} />
      <main>
        <Hero />
        <Features />
        <BeneficiosExtra />
        <Preco />
      </main>
      <Footer />
    </div>
  );
}
