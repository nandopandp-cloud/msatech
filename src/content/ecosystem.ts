export type EcosystemLayer = {
  id: string;
  title: string;
  note: string;
  highlight?: boolean;
};

/** Ordem de cima para baixo na pilha. A MSATech é a base tecnológica. */
export const ecosystem: EcosystemLayer[] = [
  { id: "contabilidade", title: "Contabilidade", note: "Saúde financeira e conformidade." },
  { id: "Consultoria Jurídica", title: "Consultoria Jurídica", note: "Segurança jurídica para decidir." },
  { id: "negocios", title: "Negócios", note: "Consultoria para crescer com método." },
  { id: "tecnologia", title: "Tecnologia", note: "A camada digital que conecta tudo.", highlight: true },
];
