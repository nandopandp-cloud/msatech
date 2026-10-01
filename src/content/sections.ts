/** Mapa único de seções: alimenta a navegação, o indicador de seção e as âncoras. */
export const sections = [
  { id: "top", label: "Início" },
  { id: "sobre", label: "O que somos" },
  { id: "servicos", label: "Serviços" },
  { id: "processo", label: "Processo" },
  { id: "proposito", label: "Propósito" },
  { id: "cases", label: "Cases" },
  { id: "clientes", label: "Clientes" },
  { id: "grupo-msa", label: "Grupo MSA" },
  { id: "diferenciais", label: "Diferenciais" },
  { id: "manifesto", label: "Manifesto" },
  { id: "contato", label: "Contato" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const sectionIndex = (id: SectionId) =>
  String(sections.findIndex((s) => s.id === id)).padStart(2, "0");

export const mainNav: { label: string; href: `#${SectionId}` }[] = [
  { label: "Serviços", href: "#servicos" },
  { label: "Cases", href: "#cases" },
  { label: "Grupo MSA", href: "#grupo-msa" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];
