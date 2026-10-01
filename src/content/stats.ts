/**
 * Indicadores de capacidade. `value: null` exibe "XX" até termos o número real.
 * Ao preencher `value`, o contador anima de 0 até o valor automaticamente.
 */
export type Stat = {
  value: number | null;
  prefix?: string;
  suffix?: string;
  label: string;
};

export const stats: Stat[] = [
  { value: null, prefix: "+", label: "Projetos entregues" },
  { value: null, suffix: "+", label: "Clientes atendidos" },
  { value: null, label: "Segmentos de mercado" },
  { value: null, label: "Anos de experiência" },
];
