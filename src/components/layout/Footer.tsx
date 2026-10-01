import { mainNav } from "@/content/sections";
import { site, type SocialIcon } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Arrow } from "@/components/ui/Arrow";

const ICONS: Record<SocialIcon, React.ReactNode> = {
  linkedin: <path d="M4.5 9h3v10h-3zM6 4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 9h2.9v1.4c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19h-3v-4.8c0-1.2 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V19h-3z" fill="currentColor" />,
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5v5l4.2-2.5z" fill="currentColor" />
    </>
  ),
};

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-20 md:pt-28">
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {/* Easter egg: no hover, os dois quadrados trocam de lugar. */}
            <a href="#top" aria-label="MSATech — voltar ao início" className="logo-egg inline-block">
              <Logo className="h-auto w-[min(70vw,420px)] overflow-visible" />
            </a>
            <p className="t-micro mt-8 text-fg/45">{site.tagline}</p>
          </div>

          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            <div>
              <p className="t-micro text-fg/35">Navegação</p>
              <ul className="mt-5 space-y-3">
                {mainNav
                  .filter((n) => n.href !== "#grupo-msa")
                  .map((n) => (
                    <li key={n.href}>
                      <a href={n.href} className="link-underline text-fg/75 transition-colors hover:text-fg">
                        {n.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <p className="t-micro text-fg/35">Ecossistema</p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href={site.group.url} className="link-underline text-fg/75 transition-colors hover:text-fg">
                    {site.group.name}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="t-micro text-fg/35">Redes</p>
              <ul className="mt-5 flex gap-3">
                {site.social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="grid size-11 place-items-center rounded-full border border-fg/15 text-fg/70 transition-colors duration-300 hover:border-orange hover:text-orange"
                    >
                      <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
                        {ICONS[s.icon]}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <p className="t-micro text-fg/35">
            © {year} {site.name}. Parte do {site.group.name}.
          </p>
          <p className="t-micro hidden text-fg/25 lg:block">Feito com estratégia, design e tecnologia.</p>
          <a href="#top" className="t-micro group flex items-center gap-3 text-fg/50 transition-colors hover:text-fg">
            Voltar ao topo
            <span className="grid size-8 place-items-center rounded-full border border-fg/15 transition-colors group-hover:border-orange group-hover:text-orange">
              <Arrow direction="up" className="size-3" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
