/**
 * CASES — placeholders estruturados.
 *
 * Para publicar um case real:
 * 1. Substitua `client`, `title`, `segment`, `year` e os textos de `story`.
 * 2. Troque a imagem em /public/images/cases/<slug>.jpg (as atuais são fotos
 *    ilustrativas do Unsplash). Sem `image`, a arte generativa `art` vira a capa.
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
  /** Enquadramento da foto (CSS object-position), ex.: "80% center". */
  imagePosition?: string;
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
    image: "/images/cases/case-01.jpg",
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
    image: "/images/cases/case-02.jpg",
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
