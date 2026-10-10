// src/components/planos/InteresseSiteModal.jsx
// ────────────────────────────────────────────────────────────────────────────
// Modal de VALIDAÇÃO DE DEMANDA do "Site Imobiliário" (add-on do CRM Premium).
// Aberto pelo botão "Tenho interesse" no card Premium (PlanosCards). Capta nome
// + WhatsApp e grava na tabela `interesse_site_imobiliario` (migration
// 20260627). O objetivo é medir interesse ANTES de construir o módulo de vitrine.
//
// TEMA: landing de venda usa a classe .dark no <html> → aqui é `dark:` (não a
// prop darkMode do painel). Mesmo padrão do PlanosCards.
// ────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";

const maskWhatsApp = (value) => {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.substring(0, 11);
  if (v.length > 2) v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
  if (v.length > 10) v = `${v.substring(0, 10)}-${v.substring(10)}`;
  return v;
};

export default function InteresseSiteModal({ aberto, onClose, ciclo }) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  if (!aberto) return null;

  const nomeValido = nome.trim().length >= 2;
  const whatsValido = whatsapp.replace(/\D/g, "").length === 11;

  const fechar = () => {
    // Reseta pra um próximo "Tenho interesse" começar limpo.
    setNome("");
    setWhatsapp("");
    setEnviado(false);
    setErro("");
    setCarregando(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeValido || !whatsValido) return;
    setCarregando(true);
    setErro("");

    const { error } = await supabaseClient
      .from("interesse_site_imobiliario")
      .insert([
        {
          nome: nome.trim(),
          whatsapp: whatsapp.replace(/\D/g, ""),
          ciclo: ciclo || null,
          origem: "card_premium_crm",
        },
      ]);

    setCarregando(false);
    if (error) {
      setErro("Não consegui registrar agora. Tente de novo em instantes.");
      return;
    }
    setEnviado(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={fechar}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar */}
        <button
          onClick={fechar}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Fechar"
        >
          <i className="fa-solid fa-xmark" />
        </button>

        {enviado ? (
          /* ── Sucesso ── */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Interesse registrado!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Obrigado, {nome.trim().split(" ")[0]}. Assim que o Site Imobiliário
              estiver disponível, a gente fala com você pelo WhatsApp.
            </p>
            <button
              onClick={fechar}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/30 transition-all"
            >
              Fechar
            </button>
          </div>
        ) : (
          /* ── Formulário ── */
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-house-laptop text-xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Site Imobiliário próprio
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-snug">
                Sua vitrine de imóveis online: o cliente vê seus imóveis e fala
                com você. Estamos avaliando lançar como complemento contratado à
                parte do plano — deixe seu contato e seja avisado em primeira mão.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Seu nome
                </label>
                <input
                  type="text"
                  maxLength={50}
                  placeholder="Ex: João Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskWhatsApp(e.target.value))}
                  className="w-full rounded-xl px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>

              {erro && (
                <p className="text-xs text-red-500 text-center">{erro}</p>
              )}

              <button
                type="submit"
                disabled={carregando || !nomeValido || !whatsValido}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${
                  carregando || !nomeValido || !whatsValido
                    ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/30"
                }`}
              >
                {carregando ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-bell" />
                    Quero ser avisado
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400">
                Sem compromisso. Usamos seu contato só pra avisar do lançamento.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
