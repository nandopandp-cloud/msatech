/**
 * Indicadores de capacidade. O contador anima de 0 até `value` ao entrar na tela.
 * `value: null` exibe "XX" (útil para um indicador ainda não confirmado).
 */
export type Stat = {
  value: number | null;
  prefix?: string;
  suffix?: string;
  label: string;
};

export const stats: Stat[] = [
  { value: 35, prefix: "+",label: "Projetos entregues" },
  { value: 30, prefix: "+", label: "Clientes atendidos" },
  { value: 23, prefix: "+", label: "Segmentos de mercado" },
  { value: 20, prefix: "+", label: "Anos de experiência" },
];
