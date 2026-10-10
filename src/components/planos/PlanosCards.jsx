// src/components/planos/PlanosCards.jsx
// ────────────────────────────────────────────────────────────────────────────
// Tabela de planos (cards) alimentada por src/config/planos.js — FONTE ÚNICA.
// Usada na seção de preço da landing do CRM (/crm) e reutilizável na página do
// Simulador passando `apenas={["essencial"]}` (mostra só o card do Simulador).
//
// TEMA: usa variantes `dark:` do Tailwind. As landings de VENDA fazem dark mode
// pela classe .dark no <html> (ver FluxoLandingPage) — diferente do PAINEL, que
// usa prop darkMode. Por isso aqui é `dark:` mesmo (contexto de landing).
// ────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { PLANOS_VENDA, CICLOS, formatarPreco } from "../../config/planos";
import InteresseSiteModal from "./InteresseSiteModal";

// Mapa de cores por accent. Classes ESTÁTICAS (Tailwind JIT só detecta string
// literal — não monte `bg-${accent}-500` dinamicamente).
const ACCENTS = {
  emerald: {
    icoBg:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    ring: "border-emerald-500",
    btn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30",
    check: "text-emerald-500",
    badge: "bg-emerald-500 text-white",
  },
  blue: {
    icoBg: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    ring: "border-blue-500",
    btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30",
    check: "text-blue-500",
    badge: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  },
  purple: {
    icoBg:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    ring: "border-purple-500",
    btn: "bg-purple-600 hover:bg-purple-700 shadow-purple-600/30",
    check: "text-purple-500",
    badge: "bg-purple-600 text-white",
  },
  // Dourado / premium — gradiente âmbar→amarelo pra remeter a "ouro".
  gold: {
    icoBg:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    ring: "border-amber-500",
    btn: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/30",
    check: "text-amber-500",
    badge: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
  },
};

function abrirCheckout(url) {
  if (!url || url.includes("PLACEHOLDER")) {
    alert("Link de checkout ainda não configurado para este plano/ciclo.");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function PlanosCards({ apenas = null }) {
  const [ciclo, setCiclo] = useState("anual");
  const [interesseAberto, setInteresseAberto] = useState(false);

  const planos = apenas
    ? PLANOS_VENDA.filter((p) => apenas.includes(p.chave))
    : PLANOS_VENDA;
  const unico = planos.length === 1;

  // Faixa "Site Imobiliário" oculta (05/07/2026): corretor vai repensar o
  // posicionamento do add-on. Trocar para `planos.some((p) => p.chave === "premium")`
  // pra reativar.
  const mostrarSiteImobiliario = false;

  return (
    <div>
      {/* ── Toggle de ciclo (Anual / Mensal) ── */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/60">
          {Object.values(CICLOS).map((c) => {
            const ativo = ciclo === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCiclo(c.id)}
                className={`relative px-5 sm:px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  ativo
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {c.rotulo}
                {c.id === "anual" && (
                  <span className="ml-2 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    3 meses grátis
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Cards ── */}
      <div
        className={`grid gap-6 items-stretch ${
          unico
            ? "max-w-md mx-auto"
            : planos.length === 2
            ? "md:grid-cols-2 max-w-4xl mx-auto"
            : "md:grid-cols-3 max-w-6xl mx-auto"
        }`}
      >
        {planos.map((plano) => {
          const ac = ACCENTS[plano.accent] || ACCENTS.blue;
          const preco = plano.precos[ciclo];
          const { inteiro, centavos } = formatarPreco(preco.valor);
          return (
            <div
              key={plano.chave}
              className={`group relative flex flex-col rounded-3xl p-8 bg-white dark:bg-slate-900/70 border-2 shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                plano.destaque
                  ? `${ac.ring} shadow-2xl md:scale-[1.03]`
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Selo */}
              {plano.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div
                    className={`${ac.badge} px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg`}
                  >
                    {plano.badge}
                  </div>
                </div>
              )}

              {/* Cabeçalho */}
              <div className="text-center mb-6 mt-2">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${ac.icoBg}`}
                >
                  <i className={`fa-solid ${plano.icone} text-xl`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {plano.nome}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-snug">
                  {plano.descricao}
                </p>
              </div>

              {/* Preço */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg font-bold text-slate-400 dark:text-slate-500">
                    R$
                  </span>
                  <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {inteiro}
                  </span>
                  {centavos !== "00" && (
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ,{centavos}
                    </span>
                  )}
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-1">
                    {CICLOS[ciclo].sufixo}
                  </span>
                </div>
                {ciclo === "anual" && preco.parcelaEquivalente && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    equivale a ~R$ {preco.parcelaEquivalente}/mês
                  </p>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={() => abrirCheckout(plano.links[ciclo])}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 mb-6 ${ac.btn}`}
              >
                {plano.chamada} <i className="fa-solid fa-arrow-right ml-2" />
              </button>

              {/* Recursos */}
              <div className="space-y-3 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  {plano.introRecursos}
                </p>
                {plano.recursos.map((r) => {
                  const texto = typeof r === "string" ? r : r.texto;
                  const emBreve = typeof r === "object" && r.emBreve;
                  return (
                    <div key={texto} className="flex items-start gap-3">
                      <i
                        className={`fa-solid fa-circle-check text-sm mt-0.5 ${ac.check}`}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300 leading-tight">
                        {texto}
                        {emBreve && (
                          <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 align-middle">
                            Em breve
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA extra só no card do Simulador: testar de graça.
                  Vai direto pro app do fluxo de pagamento (aberto a todos).
              {plano.chave === "essencial" && (
                <a
                  href="/simulador"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
                >
                  <i className="fa-solid fa-calculator" />
                  Usar Simulador Gratuito
                </a>
              )} */}
            </div>
          );
        })}
      </div>

      {/* ── Complemento opcional: Site Imobiliário (faixa própria) ──
          Fica FORA dos cards de propósito: é um add-on à parte do Premium,
          não um recurso incluso. Só aparece quando o Premium está visível
          (some na página do Simulador, com apenas={["essencial"]}).
          Recurso ainda NÃO construído — o botão valida a demanda gravando
          o interesse (InteresseSiteModal). */}
      {mostrarSiteImobiliario && (
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-3xl border border-dashed border-amber-300 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5 p-6 sm:p-7">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
              <i className="fa-solid fa-house-laptop text-2xl text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Site Imobiliário próprio
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  Opcional · à parte
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                Sua vitrine de imóveis online, onde o cliente vê o que você tem
                e fala com você.{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Complemento contratado à parte do plano.
                </span>{" "}
                Quer esse recurso? Demonstre interesse.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInteresseAberto(true)}
              className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white dark:text-amber-400 dark:hover:text-white transition-colors"
            >
              <i className="fa-solid fa-bell" />
              Tenho interesse
            </button>
          </div>
        </div>
      )}

      <InteresseSiteModal
        aberto={interesseAberto}
        onClose={() => setInteresseAberto(false)}
        ciclo={ciclo}
      />
    </div>
  );
}
