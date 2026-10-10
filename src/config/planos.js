// src/config/planos.js
// ────────────────────────────────────────────────────────────────────────────
// FONTE ÚNICA DA VERDADE dos planos de venda (preços, recursos, links de checkout).
//
// É renderizado na tabela de 3 cards da landing do CRM (/crm) e, depois, no card
// único da página do Simulador (/planos) — passando `apenas={["essencial"]}` pro
// <PlanosCards>. Como os dois lugares leem ESTE arquivo, os números NUNCA divergem.
//
// IMPORTANTE:
//  • `chave` é o valor gravado em profiles.plano e usado no gating de acesso.
//    NÃO MUDE a chave (quebra o controle de plano de todo mundo que já assinou).
//  • `nome` é só o rótulo de exibição — pode mudar quando quiser.
//  • Os links abaixo são PLACEHOLDER. Troque pelos 6 links reais da Kiwify
//    (cada plano × ciclo). Enquanto tiver "PLACEHOLDER", o botão avisa em vez
//    de abrir um link quebrado.
// ────────────────────────────────────────────────────────────────────────────

export const GARANTIA_DIAS = 10;

// Ciclos de cobrança (o toggle anual/mensal usa estes metadados)
export const CICLOS = {
  anual: { id: "anual", rotulo: "Anual", sufixo: "/ano" },
  mensal: { id: "mensal", rotulo: "Mensal", sufixo: "/mês" },
};

export const PLANOS_VENDA = [
  // ── 1. SIMULADOR PRO (chave estável: essencial) ──────────────────────────────
  {
    chave: "essencial",
    nome: "Simulador Pro",
    icone: "fa-calculator",
    accent: "emerald",
    descricao: "Para o corretor que quer passar credibilidade e fechar na primeira reunião.",
    badge: null,
    destaque: false,
    precos: {
      anual: { valor: 147, parcelaEquivalente: 12 },
      mensal: { valor: 19 },
    },
    links: {
      anual: "https://wa.me/5511967085177?text=Tenho%20interesse%20no%20Simulador%20Pro",
      mensal: "https://wa.me/5511967085177?text=Tenho%20interesse%20no%20Simulador%20Pro",
    },
    chamada: "Liberar meu Simulador agora",
    introRecursos: "Recursos do Simulador Pro:",
    recursos: [
      "Fluxo de Pagamento",
      "Análises do Investidor",
      "Relatório Rentabilidade",
      "Amortização, FGTS, PPP",
      "Link digital personalizado",
      "PDF profissional da proposta",
      "Comparador de financiamentos",
      "Comparador de fluxo",
      "Auto balanceamento de parcelas",
      "Desconto automático no fluxo",
      "Logo, WhatsApp e personalização do painel",
      "Modo Apresentação cliente",
    ],
  },

  // ── 2. CRM PRO (chave estável: pro) — destaque ───────────────────────────
  {
    chave: "pro",
    nome: "CRM Pro",
    icone: "fa-rocket",
    accent: "blue",
    descricao: "Para o corretor que quer parar de esquecer clientes no WhatsApp e multiplicar as vendas.",
    badge: "Mais escolhido",
    destaque: true,
    precos: {
      anual: { valor: 347, parcelaEquivalente: 29 },
      mensal: { valor: 39 },
    },
    links: {
      anual: "https://wa.me/5511967085177?text=Tenho%20interesse%20no%20CRM%20Pro",
      mensal: "https://wa.me/5511967085177?text=Tenho%20interesse%20no%20CRM%20Pro",
    },
    chamada: "Começar a organizar meus leads",
    introRecursos: "Tudo do Simulador Pro, mais:",
    recursos: [
      "Funil com fases personalizáveis",
      "Layout Kanban, Cards ou Tabela",
      "Ficha do lead completa (histórico, tarefas, propostas)",
      "Importação em massa de leads ",
      "Etiquetas e tags de leads",
      "Tarefas e follow-ups (lista + agenda)",
      "Lembretes e notificações (sino in-app)",
      "Gestão de negócios e Resultado Comercial",
      "Links de Captura de leads",
      "Automações do funil",
      "Paginas de captura, link na Bio",
      "Captação automática via Google/Meta Ads",
    ],
  },
];

// Quebra o preço em partes pra estilizar o card (R$ 97 → { inteiro:"97", centavos:"00" }).
export const formatarPreco = (valor) => {
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);
  return {
    inteiro: String(inteiro),
    centavos: String(centavos).padStart(2, "0"),
  };
};
