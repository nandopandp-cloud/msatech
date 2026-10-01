/**
 * Configuração institucional. Tudo que é "dado real" da empresa mora aqui —
 * campos `null` são intencionalmente vazios até termos a informação oficial
 * (a interface simplesmente não renderiza o que ainda não existe).
 */
export const site = {
  name: "MSATech",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://msatech.com.br",
  title: "MSATech | Estratégia, Design, Tecnologia e Experiência",
  description:
    "A MSATech conecta estratégia, branding, design, experiência e tecnologia para criar soluções digitais personalizadas que movem negócios.",
  tagline: "Strategy. Brand. Experience. Technology.",
  locale: "pt_BR",
  group: {
    name: "Grupo MSA",
    /** TODO: URL oficial do Grupo MSA. */
    url: "#grupo-msa",
  },
  contact: {
    /** TODO: preencher com os canais oficiais. Campos nulos não aparecem na página. */
    email: null as string | null,
    phone: null as string | null,
  },
  social: [
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "YouTube", href: "#", icon: "youtube" },
  ] as const,
} as const;

export type SocialIcon = (typeof site.social)[number]["icon"];
