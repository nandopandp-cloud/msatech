export type JourneyStep = {
  index: string;
  title: string;
  description: string;
};

/** Cada etapa corresponde a uma formação do sistema de partículas (mesma ordem). */
export const journey: JourneyStep[] = [
  { index: "01", title: "Desafio", description: "Todo projeto começa com uma pergunta difícil, e é aí que gostamos de começar." },
  { index: "02", title: "Imersão", description: "Entramos no seu negócio, ouvimos pessoas, lemos dados e mapeamos o contexto real." },
  { index: "03", title: "Estratégia", description: "Definimos direção, prioridades e o que precisa ser verdade para dar certo." },
  { index: "04", title: "Conceito", description: "Uma ideia central que organiza todas as decisões que vêm depois." },
  { index: "05", title: "Design", description: "Estrutura, linguagem e interface desenhadas para serem óbvias para quem usa." },
  { index: "06", title: "Tecnologia", description: "Arquitetura e código construídos para funcionar no mundo real e para crescer." },
  { index: "07", title: "Experiência", description: "Cada ponto de contato ajustado até a jornada fluir sem atrito." },
  { index: "08", title: "Resultado", description: "Medimos, aprendemos e evoluímos. A entrega é o começo do próximo passo." },
];
