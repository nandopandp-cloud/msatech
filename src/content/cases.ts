/**
 * CASES
 *
 * Para publicar um case real:
 * 1. Substitua `client`, `title`, `segment`, `year` e os textos de `story`.
 * 2. Capa: `showcase` (tela do produto em perspectiva sobre as cores do cliente)
 *    tem prioridade; depois `image` em /public/images/cases/<slug>.jpg; sem
 *    nenhum dos dois, a arte generativa `art` vira a capa.
 * 3. Opcional: `intro`, `facts`, `highlights` e `screens` transformam o modal
 *    num estudo de caso completo (ver Eco1ne).
 * 4. Opcional: `href` aponta para uma página dedicada (ex.: /cases/<slug>).
 *    Sem `href`, o case abre no modal.
 */
export type CaseArt = "horizon" | "orbit" | "topography" | "monolith";

export type CaseScreen = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  caption: string;
  points?: string[];
  /** Rótulo acima do título; padrão "Tela NN". */
  kicker?: string;
  /** Título exibido na barra do navegador; sem ele, a imagem aparece sem moldura. */
  chrome?: string;
  /** "wide": largura total, inteira. "scroll": tela longa percorrida conforme a rolagem. */
  layout: "wide" | "scroll";
};

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  segment: string;
  year: string;
  services: string[];
  art: CaseArt;
  image?: string;
  /** Enquadramento da foto (CSS object-position), ex.: "80% center". */
  imagePosition?: string;
  href?: string;
  /** Capa composta: tela do produto em perspectiva sobre as cores da marca do cliente. */
  showcase?: {
    screen: string;
    width: number;
    height: number;
    colors: { primary: string; secondary: string };
    chips?: { label: string; value: string }[];
  };
  intro?: string;
  facts?: { label: string; value: string }[];
  highlights?: { title: string; text: string }[];
  screens?: CaseScreen[];
  story: {
    challenge: string;
    solution: string;
    result: string;
  };
};

const placeholderStory = {
  challenge: "[Descreva aqui o desafio do cliente: contexto, problema e o que estava em jogo.]",
  solution: "[Descreva a solução construída: decisões estratégicas, design e tecnologia.]",
  result: "[Descreva o resultado com dados reais: indicadores, impacto e próximos passos.]",
};

export const cases: CaseStudy[] = [
  {
    slug: "eco1ne",
    client: "Eco1ne",
    title: "Do estoque ao lucro, uma única visão.",
    segment: "Distribuição",
    year: "2026",
    services: ["Estratégia", "Produto", "Design", "Tecnologia"],
    art: "horizon",
    showcase: {
      screen: "/images/cases/eco1ne/cover-screen.jpg",
      width: 2400,
      height: 1417,
      colors: { primary: "#12a150", secondary: "#f2791f" },
      chips: [
        { label: "Integrações ativas", value: "2 de 2" },
        { label: "Bling", value: "Dados sincronizados" },
      ],
    },
    intro:
      "A Eco1ne é uma distribuidora de materiais recicláveis com um portfólio extenso e anos de mercado. Construímos a plataforma que reúne o estoque de todos os CNPJs da operação numa única tela — e traduz cada movimentação em custo, margem e lucro.",
    facts: [
      { label: "Cliente", value: "Eco1ne" },
      { label: "Segmento", value: "Distribuição de materiais recicláveis" },
      { label: "Entrega", value: "Plataforma web de gestão de estoque e financeiro" },
      { label: "Integração", value: "ERP Bling, multi-CNPJ" },
    ],
    story: {
      challenge:
        "Centenas de SKUs, várias unidades de medida e mais de um CNPJ operando ao mesmo tempo. Os dados existiam no ERP, mas espalhados: saber quanto havia em estoque, quanto aquilo valia e quanto cada venda realmente deixava de lucro exigia planilhas e retrabalho.",
      solution:
        "Uma plataforma conectada ao Bling que consolida os CNPJs por produto, normaliza unidades de medida e cruza vendas, custo das mercadorias, impostos e devoluções. Da visão geral ao detalhe de cada SKU, com alertas para o que precisa de atenção.",
      result:
        "Clareza total do estoque da ECO Distribuidora e uma leitura financeira ao mesmo tempo holística e granular: valor do estoque a custo e a preço de venda, lucro potencial, margem por produto e os pontos cegos de dados à vista.",
    },
    highlights: [
      { title: "Visão multi-CNPJ", text: "Estoque real de todas as empresas do grupo somado por produto, com filtro por CNPJ e período." },
      { title: "Unidades normalizadas", text: "Unidades, caixas, pacotes, fardos, kits e rolos lidos do cadastro de cada produto — sem conversões manuais." },
      { title: "Financeiro do estoque", text: "Vendas brutas, custo das mercadorias, impostos, devoluções e lucro líquido, com evolução diária e comparação com o período anterior." },
      { title: "Rentabilidade por produto", text: "Valor de venda, custo total e margem de cada SKU, com os produtos de maior impacto financeiro em destaque." },
      { title: "Estoque crítico", text: "Saldos negativos e itens abaixo do mínimo sinalizados antes de virarem ruptura ou erro de inventário." },
      { title: "Qualidade dos dados", text: "Produtos sem preço de custo identificados e isolados, para que nenhum número de margem seja inflado." },
    ],
    screens: [
      {
        src: "/images/cases/eco1ne/login.jpg",
        width: 2400,
        height: 1310,
        alt: "Tela de acesso da Eco1ne com a mensagem “Conecte, controle e simplifique sua operação” e formulário de login",
        title: "Porta de entrada",
        caption: "A marca apresenta a proposta logo no acesso: integra, consolida, simplifica e dá controle.",
        chrome: "eco1ne · Acesse sua conta",
        layout: "wide",
      },
      {
        src: "/images/cases/eco1ne/dashboard.jpg",
        width: 2000,
        height: 2450,
        alt: "Dashboard da Eco1ne com estoque por unidade de medida, entradas, saídas, valor do estoque, movimentações e estoque por CNPJ",
        title: "Visão geral do estoque",
        caption: "Tudo o que importa sobre o estoque em uma rolagem — do saldo por unidade de medida às últimas movimentações.",
        points: ["Estoque por unidade de medida", "Entradas, saídas e valor do estoque", "Distribuição por CNPJ", "Produtos com estoque crítico"],
        chrome: "eco1ne · Dashboard",
        layout: "scroll",
      },
      {
        src: "/images/cases/eco1ne/financeiro.jpg",
        width: 2000,
        height: 2999,
        alt: "Tela Financeiro do estoque com vendas brutas, custo das mercadorias, lucro líquido, impostos, evolução financeira e produtos de maior impacto",
        title: "Financeiro do estoque",
        caption: "O estoque lido como dinheiro: quanto entrou, quanto custou, quanto ficou — e em quais produtos.",
        points: ["Lucro líquido e bruto", "Evolução financeira diária", "Distribuição do valor de venda", "Top produtos por venda e custo"],
        chrome: "eco1ne · Financeiro do estoque",
        layout: "scroll",
      },
      {
        src: "/images/cases/eco1ne/key-visual.jpg",
        width: 1672,
        height: 941,
        alt: "Key visual da Eco1ne: “Seu estoque. Uma única visão.” com o dashboard em um monitor",
        title: "Seu estoque. Uma única visão.",
        caption: "Key visual de lançamento da plataforma, unindo o verde e o laranja da marca.",
        kicker: "Key visual",
        layout: "wide",
      },
    ],
  },
  {
    slug: "luumu",
    client: "Luumu",
    title: "A voz do cliente, redesenhada do zero.",
    segment: "SaaS",
    year: "2026",
    services: ["Branding", "Produto", "Design", "Tecnologia"],
    art: "orbit",
    showcase: {
      screen: "/images/cases/luumu/cover-screen.jpg",
      width: 2400,
      height: 1417,
      colors: { primary: "#7c3aed", secondary: "#84cc16" },
      chips: [
        { label: "CSAT médio", value: "4.6" },
        { label: "Respostas hoje", value: "128" },
      ],
    },
    intro:
      "A Luumu é uma plataforma de pesquisas, dados de produto, engajamento e experiência do usuário: um conjunto de ferramentas de pesquisa online para escutar os clientes e melhorar o produto continuamente. A MSATech redesenhou tudo — da marca à construção da ferramenta e à divulgação.",
    facts: [
      { label: "Cliente", value: "Luumu" },
      { label: "Segmento", value: "SaaS de Voice of Customer" },
      { label: "Entrega", value: "Marca, produto e lançamento" },
      { label: "Pesquisas", value: "CSAT, NPS, CES e feedback livre" },
    ],
    story: {
      challenge:
        "Pesquisa e dados de produto são assuntos técnicos — e o mercado está cheio de ferramentas que parecem planilhas. A Luumu precisava de uma marca própria e de uma experiência que transformasse respostas em algo simples de ler, entender e colocar em prática.",
      solution:
        "Redesenho completo: uma marca nova, com mascote, paleta roxa e verde e um tom de voz próximo; a plataforma redesenhada e construída de ponta a ponta; e o lançamento, com key visuals e materiais de divulgação.",
      result:
        "Um produto coerente da primeira impressão ao dashboard: CSAT, NPS, CES e feedback livre no mesmo lugar, resultados em tempo real e uma marca memorável que leva a voz do cliente para dentro das decisões.",
    },
    highlights: [
      { title: "Marca e mascote", text: "Identidade criada do zero — nome em destaque, mascote carismático e uma paleta roxa e verde que dá personalidade a um tema técnico." },
      { title: "Pesquisas sob medida", text: "CSAT, NPS, CES e feedback livre, com templates prontos para criar uma pesquisa em minutos." },
      { title: "Resultados em tempo real", text: "Satisfação, sentimento, evolução da nota e respostas por canal atualizados conforme os clientes respondem." },
      { title: "Integração simplificada", text: "API, SDK e webhooks para levar as pesquisas para dentro do produto e os dados para onde o time já trabalha." },
      { title: "Feito para times", text: "Workspaces por time, busca global e tema claro ou escuro — a mesma clareza para quem pesquisa e para quem decide." },
      { title: "Lançamento", text: "Key visuals e materiais de divulgação que apresentam a nova Luumu ao mercado com a mesma voz do produto." },
    ],
    screens: [
      {
        src: "/images/cases/luumu/login.jpg",
        width: 2400,
        height: 1305,
        alt: "Tela de acesso da Luumu com o mascote e a mensagem “Ouça. Entenda. Melhore.” ao lado do formulário de login",
        title: "Ouça. Entenda. Melhore.",
        caption: "O acesso já apresenta a marca: o mascote, os indicadores que importam e a promessa da plataforma em três palavras.",
        chrome: "luumu · Bem-vindo de volta",
        layout: "wide",
      },
      {
        src: "/images/cases/luumu/dashboard.jpg",
        width: 2000,
        height: 1579,
        alt: "Dashboard da Luumu com CSAT, sentimento positivo, respostas, evolução da nota, respostas por canal e pesquisas recentes",
        title: "Visão geral",
        caption: "Tudo o que os clientes estão dizendo, resumido em uma tela — e a um clique de uma nova pesquisa.",
        points: ["CSAT e sentimento positivo", "Evolução semanal da nota", "Respostas por canal", "Pesquisas recentes e templates"],
        chrome: "luumu · Dashboard",
        layout: "scroll",
      },
      {
        src: "/images/cases/luumu/key-visual.jpg",
        width: 1672,
        height: 941,
        alt: "Key visual da Luumu: “A voz dos seus clientes em um só lugar.” com o dashboard em um notebook e o mascote",
        title: "A voz dos seus clientes em um só lugar.",
        caption: "Key visual de lançamento: o produto real, os tipos de pesquisa e o mascote contando a mesma história.",
        kicker: "Divulgação",
        layout: "wide",
      },
    ],
  },
  {
    slug: "case-03",
    image: "/images/cases/case-03-port.jpg",
    imagePosition: "78% center",
    client: "Cliente 03",
    title: "Título do projeto 03",
    segment: "Segmento",
    year: "Ano",
    services: ["Produto", "Tecnologia"],
    art: "topography",
    story: placeholderStory,
  },
  {
    slug: "case-04",
    image: "/images/cases/case-04.jpg",
    client: "Cliente 04",
    title: "Título do projeto 04",
    segment: "Segmento",
    year: "Ano",
    services: ["Estratégia", "Branding", "Design"],
    art: "monolith",
    story: placeholderStory,
  },
];
