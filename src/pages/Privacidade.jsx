import React, { useEffect } from "react";
import HeaderSimples from "../components/HeaderSimples";

export default function Privacidade({
  dark,
  onToggleTheme,
  onVoltar,
  onVerTermos,
  onVerPrivacidade,
  Footer,
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Política de Privacidade | Fluxo CRM";
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
              Política de Privacidade
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº
              13.709/2018 — LGPD) · Última atualização: 24 de junho de 2026
            </p>
          </div>

          <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            {/* Identificação */}
            <section>
              <p>
                Esta Política de Privacidade descreve como o{" "}
                <strong className="text-slate-800 dark:text-slate-100">
                  Fluxo Crm — Simulador e CRM para Corretores
                </strong>{" "}
                (
                <strong className="text-slate-800 dark:text-slate-100">
                  fluxocrm.com.br
                </strong>
                ) coleta, usa, armazena e protege dados pessoais, tanto dos
                corretores que utilizam a plataforma quanto dos leads (potenciais
                clientes) que preenchem as páginas de captura.
              </p>
            </section>

            {/* Controlador x Operador */}
            <section className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Controlador e Operador de Dados
              </h2>
              <p>
                Na relação com os <strong>leads</strong> (pessoas que preenchem as
                páginas de captura), o <strong>corretor</strong> é o{" "}
                <strong>controlador dos dados</strong> — é ele quem define a
                finalidade da coleta. O <strong>Fluxo Crm</strong> atua como{" "}
                <strong>operador</strong>, processando os dados em nome do
                corretor exclusivamente para operar a plataforma.
              </p>
              <p className="mt-2">
                Na relação com os <strong>corretores</strong> (usuários da
                plataforma), o Fluxo Crm é o controlador dos dados de cadastro e
                uso.
              </p>
            </section>

            {/* 1. Dados coletados */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                1. Dados que Coletamos
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    Dos corretores (usuários da plataforma):
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Cadastro:</strong> nome, e-mail, telefone e senha
                      (criptografada).
                    </li>
                    <li>
                      <strong>Perfil profissional:</strong> foto, link personalizado
                      (slug) e preferências da plataforma.
                    </li>
                    <li>
                      <strong>Dados de uso:</strong> propostas geradas, leads
                      cadastrados manualmente, simulações e configurações do funil.
                    </li>
                    <li>
                      <strong>Pagamento:</strong> informações de faturamento geridas
                      pelo processador parceiro. Não armazenamos dados completos de
                      cartão de crédito.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    Dos leads (via páginas de captura pública):
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Nome completo</li>
                    <li>Número de WhatsApp</li>
                    <li>Data de nascimento</li>
                    <li>Renda familiar mensal</li>
                    <li>Saldo de FGTS (opcional)</li>
                    <li>
                      Timestamp de consentimento (data e hora em que o lead
                      concordou com esta Política)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. Finalidade */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. Para que Usamos os Dados
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Corretores:</strong> fornecer, operar e manter a
                  plataforma; processar pagamentos; enviar comunicações técnicas;
                  personalizar PDFs, links e simulações.
                </li>
                <li>
                  <strong>Leads:</strong> registrar o interesse do potencial
                  cliente e permitir que o corretor realize contato via WhatsApp
                  para apresentar uma simulação de financiamento imobiliário
                  personalizada.
                </li>
              </ul>
            </section>

            {/* 3. Base Legal */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                3. Base Legal (LGPD)
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Consentimento (Art. 7º, I):</strong> os leads fornecem
                  consentimento expresso ao marcar o checkbox na página de captura
                  antes de enviar seus dados.
                </li>
                <li>
                  <strong>Execução de contrato (Art. 7º, V):</strong> os dados dos
                  corretores são tratados para prestação dos serviços contratados.
                </li>
                <li>
                  <strong>Legítimo interesse (Art. 7º, IX):</strong> dados mínimos
                  de uso da plataforma para segurança, prevenção de fraude e
                  melhoria do serviço.
                </li>
              </ul>
            </section>

            {/* 4. Compartilhamento */}
            <section className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200/80 dark:border-blue-800/40">
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                <i className="fa-solid fa-shield-halved mr-2"></i>4.
                Compartilhamento de Informações
              </h2>
              <p className="text-blue-800 dark:text-blue-200/90">
                O Fluxo Crm{" "}
                <strong>não vende, não aluga e não comercializa</strong> dados
                pessoais de corretores ou leads para terceiros. O compartilhamento
                ocorre apenas com provedores de infraestrutura estritamente
                necessários para o funcionamento da plataforma (banco de dados e
                autenticação via Supabase, hospedagem via Netlify e Vercel), todos
                sujeitos a suas próprias políticas de proteção de dados.
              </p>
            </section>

            {/* 5. Retenção */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                5. Retenção de Dados
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Os dados dos corretores são mantidos enquanto a conta estiver
                  ativa. Após o cancelamento, os dados são excluídos em até 90
                  dias, salvo obrigação legal de retenção.
                </li>
                <li>
                  Os dados dos leads ficam armazenados na conta do corretor
                  responsável. O lead pode solicitar a exclusão a qualquer momento
                  pelo canal de contato abaixo.
                </li>
              </ul>
            </section>

            {/* 6. Segurança */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                6. Segurança dos Dados
              </h2>
              <p>
                Adotamos medidas de segurança de nível industrial: criptografia de
                senhas, controle de acesso por linha (Row Level Security no banco
                de dados) e restrição de permissões por papel (anon, corretor,
                administrador). Apenas o corretor responsável tem acesso aos seus
                próprios leads e propostas.
              </p>
            </section>

            {/* 7. Direitos */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                7. Seus Direitos (LGPD — Art. 18)
              </h2>
              <p className="mb-2">
                Tanto corretores quanto leads podem, a qualquer momento, exercer
                os seguintes direitos mediante solicitação ao canal de contato
                abaixo:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Confirmação da existência de tratamento dos seus dados</li>
                <li>Acesso aos dados armazenados</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>
                  Exclusão dos dados tratados com base em consentimento (revogação
                  do consentimento)
                </li>
                <li>Portabilidade dos dados a outro fornecedor de serviço</li>
                <li>
                  Informação sobre com quem os dados foram compartilhados
                </li>
              </ul>
            </section>

            {/* 8. Exclusão de Conta e Dados */}
            <section className="bg-red-50 dark:bg-red-950/30 p-5 rounded-2xl border border-red-200/80 dark:border-red-800/40">
              <h2 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">
                <i className="fa-solid fa-trash-can mr-2"></i>8. Exclusão de
                Conta e Dados (Account &amp; Data Deletion)
              </h2>
              <p className="text-red-800 dark:text-red-200/90 mb-2">
                Você tem o direito de solicitar a exclusão completa e permanente
                da sua conta e de todos os dados associados a ela em nossa
                plataforma.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-red-800 dark:text-red-200/90">
                <li>
                  <strong>Pelo Painel:</strong> Acesse o sistema, vá até o menu
                  &quot;Configurações&quot;, acesse a aba &quot;Perfil e Visual&quot; e role até o
                  final da página. Clique no botão &quot;Excluir minha conta&quot;.
                </li>
                <li>
                  <strong>Por E-mail:</strong> Envie um e-mail para{" "}
                  <strong>contato@fluxocrm.com.br</strong> com o assunto
                  &quot;Solicitação de Exclusão de Conta&quot;. O processo será concluído em
                  até 48 horas úteis.
                </li>
              </ul>
            </section>

            {/* 9. Contato */}
            <section className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                9. Canal de Contato e Encarregado de Dados (DPO)
              </h2>
              <p>
                Para exercer seus direitos, tirar dúvidas ou reportar incidentes
                relacionados à privacidade, entre em contato:
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
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Responderemos em até 15 dias úteis conforme prazo previsto na LGPD.
              </p>
            </section>

            {/* 10. Cookies */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                10. Cookies
              </h2>
              <p>
                A plataforma utiliza cookies estritamente necessários para
                autenticação e manutenção da sessão do corretor. Não utilizamos
                cookies de rastreamento ou publicidade de terceiros.
              </p>
            </section>

            {/* 11. Alterações */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                11. Alterações nesta Política
              </h2>
              <p>
                Esta Política pode ser atualizada periodicamente. Alterações
                relevantes serão comunicadas por e-mail ou via aviso na
                plataforma. O uso continuado dos serviços após a notificação
                implica aceite das novas condições. Consulte também nossos{" "}
                <a
                  href="/termos"
                  onClick={(e) => {
                    if (onVerTermos) {
                      e.preventDefault();
                      onVerTermos();
                    }
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  Termos de Uso
                </a>
                .
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
              className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
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
              className="text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
            >
              Privacidade
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
