export type ServiceVisualId =
  | "strategy"
  | "branding"
  | "design"
  | "experience"
  | "technology"
  | "product";

export type Service = {
  id: ServiceVisualId;
  index: string;
  title: string;
  statement: string;
  capabilities: string[];
  /** Tom da atmosfera da seção quando o serviço está ativo. */
  tone: string;
};

export const services: Service[] = [
  {
    id: "strategy",
    index: "01",
    title: "Estratégia",
    statement: "Antes de construir qualquer coisa, entendemos para onde você precisa ir.",
    capabilities: [
      "Estratégia digital",
      "Estratégia de produto",
      "Posicionamento",
      "Transformação digital",
      "Consultoria",
    ],
    tone: "#d9d6cf",
  },
  {
    id: "branding",
    index: "02",
    title: "Branding",
    statement: "Marcas fortes não apenas aparecem. Elas ocupam espaço na mente das pessoas.",
    capabilities: [
      "Estratégia de marca",
      "Identidade",
      "Posicionamento",
      "Arquitetura de marca",
      "Direcionamento estratégico",
    ],
    tone: "#e7d5c8",
  },
  {
    id: "design",
    index: "03",
    title: "Design",
    statement: "Transformamos estratégia em experiências simples, intuitivas e memoráveis.",
    capabilities: ["UX Design", "UI Design", "Design de Produto", "Design Systems", "Experiência digital"],
    tone: "#d3dbdb",
  },
  {
    id: "experience",
    index: "04",
    title: "Experiência",
    statement: "Cada interação é uma oportunidade de criar valor.",
    capabilities: [
      "Customer Experience",
      "User Experience",
      "Jornada do cliente",
      "Estratégia de experiência",
      "Otimização de pontos de contato",
    ],
    tone: "#e4dacf",
  },
  {
    id: "technology",
    index: "05",
    title: "Tecnologia",
    statement: "Construímos a infraestrutura digital que transforma ideias em realidade.",
    capabilities: ["Sites e landing pages", "Aplicativos", "Sistemas", "Plataformas digitais", "Soluções sob medida"],
    tone: "#cfd6d7",
  },
  {
    id: "product",
    index: "06",
    title: "Produto",
    statement: "Da primeira hipótese ao produto que escala.",
    capabilities: ["Descoberta de produto", "MVPs", "Produtos digitais", "Validação", "Evolução contínua"],
    tone: "#e2d8d0",
  },
];
