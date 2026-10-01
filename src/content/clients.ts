/**
 * Clientes exibidos na faixa de marcas.
 *
 * Para adicionar um cliente: gere o logo em PNG com fundo transparente e versão
 * clara (legível sobre fundo escuro), salve em /public/clients/ e inclua aqui
 * com as dimensões reais do arquivo (evita salto de layout).
 * Sem `logo`, o nome aparece como texto.
 */
export type Client = {
  name: string;
  logo?: string;
  width?: number;
  height?: number;
};

export const clients: Client[] = [
  { name: "Radar", logo: "/clients/radar.png", width: 212, height: 71 },
  { name: "Luumu", logo: "/clients/luumu.png", width: 292, height: 71 },
  { name: "Learnix", logo: "/clients/learnix.png", width: 264, height: 73 },
  { name: "Jovens Gênios", logo: "/clients/jovens-genios.png", width: 256, height: 86 },
  { name: "GenieX", logo: "/clients/geniex.png", width: 363, height: 105 },
  { name: "GenieConnect", logo: "/clients/genieconnect.png", width: 338, height: 84 },
  { name: "EasyPulse", logo: "/clients/easypulse.png", width: 255, height: 59 },
  { name: "SONA", logo: "/clients/sona.png", width: 342, height: 100 },
  { name: "Runway AI", logo: "/clients/runway-ai.png", width: 420, height: 90 },
  { name: "trpy", logo: "/clients/trpy.png", width: 420, height: 217 },
  { name: "Orbit", logo: "/clients/orbit.png", width: 420, height: 103 },
];
