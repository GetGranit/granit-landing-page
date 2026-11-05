import { Link } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { useLanguage } from "@/lib/i18n";
import logoRose from "@/assets/logo-light.svg";
import { GrandLogo } from "./GrandLogo";

const LINKEDIN_URL = "https://www.linkedin.com/company/getgranit-ai";

const copy = {
  fr: {
    baseline: "Vos équipes soignent. Granit gère le reste.",
    hds: "Infrastructure certifiée HDS",
    product: "Produit",
    agents: "Agents",
    pricing: "Tarifs",
    resources: "Ressources",
    security: "Sécurité",
    company: "Société",
    contact: "Contact",
    partners: "Devenir partenaire",
    linkedin: "Granit sur LinkedIn",
    legal: "Légal",
    cgv: "CGV",
    privacy: "Confidentialité",
    rights: "Tous droits réservés",
    made: "Made in France",
    gdpr: "RGPD",
  },
  en: {
    baseline: "Your teams care. Granit handles the rest.",
    hds: "HDS-certified infrastructure",
    product: "Product",
    agents: "Agents",
    pricing: "Pricing",
    resources: "Resources",
    security: "Security",
    company: "Company",
    contact: "Contact",
    partners: "Become a partner",
    linkedin: "Granit on LinkedIn",
    legal: "Legal",
    cgv: "Terms of sale",
    privacy: "Privacy",
    rights: "All rights reserved",
    made: "Made in France",
    gdpr: "GDPR",
  },
};

/** collé : sans marge haute, sous une section pleine largeur (le CTA de fin de l'accueil). */
export function Footer({ colle = false }: { colle?: boolean }) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const posthog = usePostHog();

  return (
    <footer
      className={`section-sombre relative overflow-clip ${colle ? "" : "mt-24"}`}
      style={{ background: "var(--encre-2)" }}
    >
      <div className="mx-auto max-w-[1240px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={logoRose} alt="Granit" className="h-7 w-auto" />
            </Link>
            <p
              className="mt-4 max-w-xs text-[13.5px] leading-[1.6]"
              style={{ color: "var(--sur-encre-secondaire)" }}
            >
              {t.baseline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              <Badge>{t.hds}</Badge>
              <Badge>{t.gdpr}</Badge>
            </div>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.linkedin}
              onClick={() => posthog?.capture("linkedin_clicked", { placement: "footer" })}
              className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-opacity hover:opacity-75"
              style={{ borderColor: "rgba(250, 240, 242, 0.24)", color: "var(--rose)" }}
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>
          </div>

          {/* Links */}
          <FooterCol
            className="md:col-span-2 md:col-start-6"
            title={t.product}
            links={[
              { to: "/agents", label: t.agents },
              { to: "/tarifs", label: t.pricing },
              { to: "/ressources", label: t.resources },
            ]}
          />
          <FooterCol
            className="md:col-span-2"
            title={t.company}
            links={[
              { to: "/affiliation", label: t.partners },
              { to: "/", hash: "demo", label: t.contact },
            ]}
          />
          <FooterCol
            className="md:col-span-2"
            title={t.legal}
            links={[
              { to: "/cgv", label: t.cgv },
              { to: "/privacy", label: t.privacy },
            ]}
          />
        </div>

        <GrandLogo />

        <div
          className="mt-8 flex flex-col items-start justify-between gap-3 pt-5 text-[12px] md:flex-row md:items-center"
          style={{
            color: "var(--sur-encre-secondaire)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div>
            © {new Date().getFullYear()} Granit AI · {t.rights}
          </div>
          <div className="inline-flex items-center gap-1.5">
            {t.made}
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
        borderColor: "rgba(250, 240, 242, 0.24)",
        color: "var(--sur-encre-secondaire)",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--menthe)" }}
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
      <div className="eyebrow mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={`${l.to}-${i}`}>
            <Link
              to={l.to}
              hash={l.hash}
              className="text-[13.5px] transition-opacity hover:opacity-75"
              style={{ color: "var(--sur-encre-secondaire)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
