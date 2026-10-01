/**
 * Logos de clientes — placeholders. Para cada cliente real, informe `name`
 * e `logo` (SVG monocromático em /public/clients/, preferencialmente branco).
 */
export type Client = {
  name: string;
  logo?: string;
};

export const clients: Client[] = Array.from({ length: 8 }, (_, i) => ({
  name: `Cliente ${String(i + 1).padStart(2, "0")}`,
}));
