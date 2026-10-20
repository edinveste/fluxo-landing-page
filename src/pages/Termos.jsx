import React, { useEffect } from "react";
import HeaderSimples from "../components/HeaderSimples";

export default function Termos({
  dark,
  onToggleTheme,
  onVoltar,
  onVerPrivacidade,
  onVerTermos,
  Footer,
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Termos de Uso | Fluxo CRM";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600/20">
      <HeaderSimples
        dark={dark}
        onToggleTheme={onToggleTheme}
        onVoltar={onVoltar}
      />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/60 rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Termos e Condições de Uso
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Última atualização: 24 de junho de 2026
            </p>
          </div>

          <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e utilizar a plataforma{" "}
                <strong className="text-slate-800 dark:text-slate-100">
                  Fluxo Crm
                </strong>{" "}
                (o &quot;Serviço&quot;), disponível em{" "}
                <strong className="text-slate-800 dark:text-slate-100">
                  fluxocrm.com.br
                </strong>
                , você concorda em cumprir e ficar vinculado a estes Termos de
                Uso. Se você não concorda com qualquer parte destes termos, não
                deve utilizar o nosso Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. Descrição do Serviço
              </h2>
              <p>
                O Fluxo Crm é um software como serviço (SaaS) desenvolvido para
                auxiliar profissionais do mercado imobiliário a criar simulações
                de financiamento, fluxos de pagamento, rentabilidade, propostas
                comerciais e gerenciar o relacionamento com clientes (CRM) —
                incluindo páginas públicas de captura de leads.
              </p>
            </section>

            <section className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-800/40">
              <h2 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>3.
                Isenção de Responsabilidade sobre Simulações
              </h2>
              <p className="text-amber-800 dark:text-amber-200/90">
                Todos os cálculos, taxas, tabelas de amortização e projeções
                financeiras geradas pelo Fluxo Crm possuem caráter{" "}
                <strong>estritamente informativo e de estimativa matemática</strong>.
              </p>
              <p className="text-amber-800 dark:text-amber-200/90 mt-2">
                O Fluxo Crm não é uma instituição financeira. As simulações não
                garantem a aprovação de crédito, não vinculam bancos ou
                construtoras e podem sofrer variações de acordo com a análise de
                crédito real do cliente final e as flutuações do mercado. Não nos
                responsabilizamos por negócios perdidos ou divergências de
                valores.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                4. Contas de Usuário e Segurança
              </h2>
              <p>
                Para acessar recursos avançados, você deve criar uma conta
                fornecendo informações precisas. Você é o único responsável por
                manter a confidencialidade de sua senha e por todas as atividades
                que ocorram sob sua conta. Notifique-nos imediatamente em caso de
                uso não autorizado.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                5. Assinaturas e Pagamentos
              </h2>
              <p>
                O Fluxo Crm oferece planos gratuitos e pagos. Ao assinar um
                plano pago, você concorda com o faturamento recorrente de acordo
                com a opção escolhida. O cancelamento pode ser feito a qualquer
                momento pelo painel, interrompendo a cobrança do ciclo seguinte.
                Não oferecemos reembolsos para períodos já faturados e
                parcialmente utilizados.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                6. Propriedade Intelectual
              </h2>
              <p>
                Todo o código, design, logotipos e interface do Fluxo Crm são de
                propriedade exclusiva da plataforma. É terminantemente proibida a
                cópia, engenharia reversa ou revenda não autorizada do nosso
                software.
              </p>
            </section>

            {/* Seção LGPD */}
            <section className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200/80 dark:border-blue-800/40">
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
                <i className="fa-solid fa-shield-halved mr-2"></i>7.
                Responsabilidade sobre Dados de Leads (LGPD)
              </h2>
              <p className="text-blue-800 dark:text-blue-200/90 mb-3">
                Ao utilizar as funcionalidades de captura de leads e CRM do
                Fluxo de Pagamento, o corretor (usuário da plataforma) atua como{" "}
                <strong>controlador dos dados pessoais</strong> dos seus
                clientes e potenciais clientes (leads), nos termos da Lei Geral
                de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
              </p>
              <p className="text-blue-800 dark:text-blue-200/90 mb-3">
                O Fluxo Crm atua como <strong>operador</strong>, processando
                esses dados exclusivamente em nome do corretor e conforme suas
                instruções, para o funcionamento da plataforma.
              </p>
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                Ao usar o Serviço, o corretor declara e se compromete a:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-blue-800 dark:text-blue-200/90">
                <li>
                  Coletar dados pessoais dos leads com base legal adequada
                  (consentimento, legítimo interesse ou outra prevista no Art. 7º
                  da LGPD);
                </li>
                <li>
                  Informar os leads sobre a finalidade da coleta e seus direitos
                  como titulares de dados;
                </li>
                <li>
                  Não utilizar os dados coletados para finalidades incompatíveis
                  com as informadas ao lead no momento da captura;
                </li>
                <li>
                  Atender as solicitações de exclusão, correção ou portabilidade
                  de dados feitas pelos próprios leads;
                </li>
                <li>
                  Manter os dados dos leads apenas pelo tempo necessário à
                  finalidade da coleta.
                </li>
              </ul>
              <p className="text-blue-700 dark:text-blue-300 text-xs mt-4">
                As páginas de captura geradas pela plataforma já incluem o
                checkbox de consentimento e gravam o timestamp do aceite,
                auxiliando o corretor a cumprir o Art. 7º, I da LGPD. O corretor
                é responsável por não desabilitar ou contornar esse mecanismo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                8. Política de Privacidade
              </h2>
              <p>
                O tratamento de dados pessoais dos corretores e dos leads é
                detalhado na nossa{" "}
                <a
                  href="/privacidade"
                  onClick={(e) => {
                    if (onVerPrivacidade) {
                      e.preventDefault();
                      onVerPrivacidade();
                    }
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  Política de Privacidade
                </a>
                , que é parte integrante destes Termos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                9. Alterações nos Termos
              </h2>
              <p>
                Podemos atualizar estes Termos periodicamente. Alterações
                relevantes serão comunicadas por e-mail ou via aviso na
                plataforma. O uso continuado do Serviço após a notificação
                implica aceite das novas condições.
              </p>
            </section>

            <section className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                10. Contato
              </h2>
              <p>
                Dúvidas sobre estes Termos ou sobre o tratamento de dados:
              </p>
              <p className="mt-2 font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <i className="fa-solid fa-envelope text-slate-400"></i>
                <a
                  href="mailto:contato@fluxocrm.com.br"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  contato@fluxocrm.com.br
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Rodapé minimalista e discreto para leitura jurídica */}
      <footer className="mt-8 pb-12 border-t border-slate-200/70 dark:border-slate-800/80 pt-8 text-xs text-slate-400 dark:text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Fluxo CRM. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <a
              href="/termos"
              onClick={(e) => {
                if (onVerTermos) {
                  e.preventDefault();
                  onVerTermos();
                }
              }}
              className="text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
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
              className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
            >
              Privacidade
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
