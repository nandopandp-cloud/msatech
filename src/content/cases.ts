/**
 * CASES — placeholders estruturados.
 *
 * Para publicar um case real:
 * 1. Substitua `client`, `title`, `segment`, `year` e os textos de `story`.
 * 2. Adicione uma imagem em /public/cases/<slug>.jpg e informe em `image`
 *    (sem imagem, a arte generativa `art` é usada como capa).
 * 3. Opcional: `href` aponta para uma página dedicada (ex.: /cases/<slug>).
 *    Sem `href`, o case abre no modal.
 */
export type CaseArt = "horizon" | "orbit" | "topography" | "monolith";

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  segment: string;
  year: string;
  services: string[];
  art: CaseArt;
  image?: string;
  href?: string;
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
    slug: "case-01",
    client: "Cliente 01",
    title: "Título do projeto 01",
    segment: "Segmento",
    year: "Ano",
    services: ["Estratégia", "Design", "Tecnologia"],
    art: "horizon",
    story: placeholderStory,
  },
  {
    slug: "case-02",
    client: "Cliente 02",
    title: "Título do projeto 02",
    segment: "Segmento",
    year: "Ano",
    services: ["Branding", "Experiência"],
    art: "orbit",
    story: placeholderStory,
  },
  {
    slug: "case-03",
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
    client: "Cliente 04",
    title: "Título do projeto 04",
    segment: "Segmento",
    year: "Ano",
    services: ["Estratégia", "Branding", "Design"],
    art: "monolith",
    story: placeholderStory,
  },
];
