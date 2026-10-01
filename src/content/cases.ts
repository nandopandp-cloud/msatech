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
    slug: "learnix",
    client: "Learnix",
    title: "O streaming de conhecimento da empresa.",
    segment: "Educação corporativa",
    year: "2026",
    services: ["Produto", "Experiência", "Design", "Tecnologia"],
    art: "topography",
    showcase: {
      screen: "/images/cases/learnix/cover-screen.jpg",
      width: 2400,
      height: 1417,
      colors: { primary: "#e50914", secondary: "#ff5a3c" },
      chips: [
        { label: "Seu progresso", value: "75%" },
        { label: "Certificado", value: "de conclusão" },
      ],
    },
    intro:
      "A Learnix é uma plataforma de aprendizagem e cursos online feita para os colaboradores da empresa — quase uma Netflix interna. Trilhas, aulas em vídeo, materiais e certificados num catálogo que convida a dar o play, para que aprender vire parte da rotina, e não mais uma obrigação.",
    facts: [
      { label: "Cliente", value: "Learnix" },
      { label: "Segmento", value: "Educação corporativa" },
      { label: "Entrega", value: "Plataforma de cursos em vídeo" },
      { label: "Público", value: "Colaboradores da empresa" },
    ],
    story: {
      challenge:
        "Treinamento interno costuma morar em PDFs, pastas compartilhadas e links perdidos. O conhecimento existia, mas era difícil de encontrar e pouco convidativo de consumir — e sem acompanhamento, ninguém sabia quem tinha aprendido o quê.",
      solution:
        "Uma experiência inspirada nos serviços de streaming: home com destaque e “continue de onde parou”, prateleiras de populares, lançamentos e mais bem avaliados, categorias por área e páginas de curso completas, com aulas em sequência, materiais de apoio, avaliações e perguntas.",
      result:
        "Aprender ficou tão natural quanto escolher o que assistir. Cada colaborador encontra o curso certo em segundos, avança no próprio ritmo e conclui com certificado — e a empresa ganha um único lugar para o conhecimento que a faz funcionar.",
    },
    highlights: [
      { title: "Catálogo estilo streaming", text: "Destaque na home, prateleiras de populares, lançamentos e mais bem avaliados — descobrir um curso é tão fácil quanto escolher uma série." },
      { title: "Continue de onde parou", text: "O progresso acompanha o colaborador: a home sempre abre no próximo passo de cada curso." },
      { title: "Trilhas por área", text: "Categorias para cada público — admins, educadores, produto — com níveis, duração e aulas em sequência." },
      { title: "Página de curso completa", text: "Overview, conteúdo, materiais, avaliações e perguntas, com instrutor e o que você vai aprender em destaque." },
      { title: "Materiais e certificados", text: "Planilhas, guias e PDFs de apoio para baixar, e certificado ao concluir cada curso." },
      { title: "No ritmo de cada um", text: "Acesso de qualquer dispositivo, quando e onde o colaborador quiser — aprender cabe na rotina." },
    ],
    screens: [
      {
        src: "/images/cases/learnix/login.jpg",
        width: 2400,
        height: 1305,
        alt: "Tela de acesso da Learnix com a mensagem “Aprenda. Evolua. Alcance mais.” ao lado do formulário de login",
        title: "Aprenda. Evolua. Alcance mais.",
        caption: "O acesso já tem cara de catálogo: os cursos aparecem ao fundo, prontos para o play.",
        chrome: "learnix · Bem-vindo de volta",
        layout: "wide",
      },
      {
        src: "/images/cases/learnix/home.jpg",
        width: 2000,
        height: 2671,
        alt: "Home da Learnix com curso em destaque, categorias e prateleiras de populares, novos lançamentos e mais bem avaliados",
        title: "Uma home para dar o play",
        caption: "Um curso em destaque para continuar de onde parou e prateleiras que fazem o colaborador descobrir o próximo.",
        points: ["Destaque com “continue de onde parou”", "Categorias por área", "Populares e novos lançamentos", "Mais bem avaliados"],
        chrome: "learnix · Início",
        layout: "scroll",
      },
      {
        src: "/images/cases/learnix/curso.jpg",
        width: 2000,
        height: 2186,
        alt: "Página do curso Admins na Learnix com lista de aulas, descrição, instrutor, informações do curso e o que você vai aprender",
        title: "Página do curso",
        caption: "Tudo o que o colaborador precisa antes e durante o curso: aulas em sequência, instrutor, materiais e o que vai aprender.",
        points: ["Aulas em sequência com progresso", "Overview, materiais e avaliações", "Instrutor e informações do curso", "Certificado ao concluir"],
        chrome: "learnix · Admins",
        layout: "scroll",
      },
      {
        src: "/images/cases/learnix/key-visual.jpg",
        width: 1672,
        height: 941,
        alt: "Key visual da Learnix: “Aprenda. Evolua. Alcance mais.” com a plataforma em notebook e celular, progresso, certificado e materiais da aula",
        title: "Conhecimento que move carreiras.",
        caption: "Key visual de lançamento: a mesma experiência no notebook e no celular, com progresso, certificado e materiais ao alcance.",
        kicker: "Divulgação",
        layout: "wide",
      },
    ],
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
