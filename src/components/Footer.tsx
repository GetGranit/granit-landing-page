import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import logoMonogram from "@/assets/logo.svg";

const copy = {
  fr: {
    baseline: "Plateforme d'agents IA pour la santé.",
    product: "Produit",
    agents: "Agents",
    pricing: "Tarifs",
    resources: "Ressources",
    security: "Sécurité",
    company: "Société",
    about: "À propos",
    contact: "Contact",
    demo: "Demander une démo",
    legal: "Légal",
    cgv: "CGV",
    rights: "Tous droits réservés",
    made: "Made in France",
  },
  en: {
    baseline: "AI agent platform for healthcare.",
    product: "Product",
    agents: "Agents",
    pricing: "Pricing",
    resources: "Resources",
    security: "Security",
    company: "Company",
    about: "About",
    contact: "Contact",
    demo: "Book a demo",
    legal: "Legal",
    cgv: "Terms",
    rights: "All rights reserved",
    made: "Made in France",
  },
};

export function Footer() {
  const { lang } = useLanguage();
  const t = copy[lang];

  return (
    <footer
      className="relative mt-24 border-t"
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-[1240px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={logoMonogram} alt="Granit" className="h-7 w-auto" />
              <span
                className="font-serif text-[20px] tracking-tight"
                style={{ color: "var(--text)", fontWeight: 700 }}
              >
                Granit
              </span>
            </Link>
            <p
              className="mt-4 max-w-xs text-[13.5px] leading-[1.6]"
              style={{ color: "var(--text-soft)" }}
            >
              {t.baseline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              <Badge>HDS</Badge>
              <Badge>RGPD</Badge>
            </div>
          </div>

          {/* Links */}
          <FooterCol
            className="md:col-span-2 md:col-start-6"
            title={t.product}
            links={[
              { to: "/agents", label: t.agents },
              { to: "/tarifs", label: t.pricing },
              { to: "/securite", label: t.security },
              { to: "/ressources", label: t.resources },
            ]}
          />
          <FooterCol
            className="md:col-span-2"
            title={t.company}
            links={[
              { to: "/a-propos", label: t.about },
              { to: "/", hash: "demo", label: t.contact },
            ]}
          />
          <FooterCol
            className="md:col-span-2"
            title={t.legal}
            links={[
              { to: "/cgv", label: t.cgv },
              { to: "/", hash: "demo", label: t.demo },
            ]}
          />
        </div>

        <div
          className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-5 text-[12px] md:flex-row md:items-center"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            borderColor: "var(--border)",
          }}
        >
          <div>
            © {new Date().getFullYear()} Granit AI · {t.rights}
          </div>
          <div className="inline-flex items-center gap-1.5">
            {t.made} <span aria-hidden>🇫🇷</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px]"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg2)",
        color: "var(--text-soft)",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--sage)" }}
      />
      {children}
    </span>
  );
}

function FooterCol({
  title,
  links,
  className,
}: {
  title: string;
  links: { to: string; hash?: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        className="mb-3 text-[11px]"
        style={{
          color: "var(--terra)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {title}
      </div>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={`${l.to}-${i}`}>
            <Link
              to={l.to}
              hash={l.hash}
              className="text-[13.5px] transition-colors"
              style={{ color: "var(--text-soft)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
