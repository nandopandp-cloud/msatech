# MSATech — Landing page institucional

Experiência digital da MSATech, o pilar de tecnologia do Grupo MSA.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript estrito · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText) · Lenis

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck
```

Variável opcional: `NEXT_PUBLIC_SITE_URL` (URL canônica usada em metadados, Open Graph e JSON-LD).

## Narrativa

| # | Seção | Ideia | Técnica principal |
|---|---|---|---|
| — | Intro | A marca se desenha | Traçado SVG dos paths originais, 1x por sessão, pulável |
| 00 | Hero | "Transformamos ideias em experiências…" | Globo em Canvas 2D: partículas quadradas, arcos, órbitas; reage ao cursor; dispersa no scroll |
| 01 | O que somos | Estratégia → … → Negócio | Seção fixada, cadeia que acende elo por elo |
| 02 | Serviços | "Tudo começa com o desafio." | Painéis em perspectiva (tabs acessíveis) / acordeão no mobile |
| 03 | Processo | Do desafio à solução | Partículas que se reorganizam a cada etapa + trilho horizontal |
| 04 | Propósito | "Não existe ~~im~~possível." | Paisagem procedural com parallax, tipografia riscada no scroll |
| 05 | Cases | Portfólio | Grid editorial assimétrico, parallax, modal `<dialog>` |
| 06 | Clientes | Números + logos | Count-up, marquee reativo à velocidade do scroll |
| 07 | Grupo MSA | Ecossistema | Pilha 3D (CSS preserve-3d) que se separa no scroll |
| 08 | Diferenciais | Seis convicções | Índice editorial com preenchimento no hover |
| 09 | Manifesto | Um curta | Enquadramento de câmera, timecode, cenas com foco/desfoque |
| 10 | Contato | CTA + formulário | Piso em perspectiva com feixes de luz; formulário validado |

## Estrutura

```
src/
  app/                  layout (SEO, fontes, JSON-LD), página, ícone, OG image, /api/contact
  content/              ← todo o conteúdo editável (dados, não JSX)
  components/
    layout/             Header, Footer, ScrollHud (progresso + seção atual)
    motion/             SmoothScroll (Lenis ⇄ GSAP), Cursor, Intro
    hero/               Hero + renderer do globo (carregado via next/dynamic)
    services/           Serviços + arte generativa por pilar
    cases/              Grid, card, modal e capas generativas
    sections/           Demais seções + renderers de canvas
    ui/                 Logo, Button (magnético), Arrow, SectionLabel
  hooks/                useReveal, useMagnetic, useTilt, useMediaQuery, useInView
  lib/                  gsap, motion (tokens), intro, contact (contrato do formulário)
public/assets/          msatech-logo.svg / .png (arquivos oficiais)
docs/reference/         referência visual usada na direção de arte
```

## Substituindo placeholders

Nada foi inventado: tudo que depende de dado real está marcado e centralizado em `src/content/`.

- **Cases** — `content/cases.ts`. Troque `client`, `title`, `segment`, `year` e `story`. Para usar foto, coloque em `/public/cases/` e preencha `image` (sem imagem, a capa generativa `art` é usada). Com `href`, o card vira link para uma página dedicada; sem `href`, abre no modal.
- **Números** — `content/stats.ts`. `value: null` exibe "XX"; ao informar um número, o count-up acontece automaticamente.
- **Clientes** — `content/clients.ts`. Informe `name` e `logo` (SVG monocromático claro em `/public/clients/`).
- **Contato e redes** — `content/site.ts` (`contact.email`, `contact.phone`, `social[].href`, `group.url`). Campos `null` não aparecem.
- **Formulário** — a validação é compartilhada (`lib/contact.ts`). Para integrar CRM/e-mail/webhook, altere apenas `app/api/contact/route.ts`.

## Movimento, performance e acessibilidade

- Um único loop: Lenis roda no ticker do GSAP. Canvases só renderizam quando visíveis e com a aba ativa.
- `prefers-reduced-motion`: sem intro, sem smooth scroll, sem animações de entrada — todo o conteúdo fica visível de forma estática.
- Cursor customizado apenas em ponteiros finos; em campos de texto o cursor nativo volta.
- HTML semântico, skip link, foco visível, tabs com navegação por setas, modal com foco preso e `Esc`, `aria-live` nos conteúdos que mudam.
- Detalhes: barra de progresso, seção atual e percentual nas laterais, leitura de rotação do globo no hero, timecode do manifesto. No rodapé, passe o mouse na logo.
