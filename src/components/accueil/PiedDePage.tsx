/* Accueil : le pied de page. Qui nous sommes et le lien LinkedIn, le plan du site, les garanties,
   le logo en très grand et la ligne légale. Le bloc d'appel de la maquette est remplacé par le CTA de fin.
   Au survol du grand logo, les pierres oscillent doucement, puis la clé de voûte s'allume et verrouille les autres. */
import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { useLanguage } from "@/lib/i18n";
import {
  CLE_DE_VOUTE,
  IconCloud,
  IconEu,
  IconLinkedin,
  IconOut,
  IconShield,
  LOGO,
  linkedinUrl,
  useReducedMotion,
  useSymbole,
} from "./commun";

const copy = {
  fr: {
    footer: "Pied de page",
    home: "Granit, retour en haut",
    id: "Le back-office qui travaille pendant que vous soignez.",
    linkedin: "Suivre Granit sur LinkedIn",
    plan: "Plan du site",
    product: "Produit",
    company: "Société",
    agents: "Agents",
    pricing: "Tarifs",
    security: "Sécurité",
    resources: "Ressources",
    about: "À propos",
    partners: "Devenir partenaire",
    contact: "Contact",
    trust: "Garanties",
    hds: "Infrastructure HDS",
    ue: "Données dans l’UE",
    rgpd: "Conforme au RGPD",
    rights: "© 2026 Granit · Tous droits réservés",
    privacy: "Politique de confidentialité",
    cgv: "CGV",
  },
  en: {
    footer: "Footer",
    home: "Granit, back to top",
    id: "The back office that works while you care for patients.",
    linkedin: "Follow Granit on LinkedIn",
    plan: "Site map",
    product: "Product",
    company: "Company",
    agents: "Agents",
    pricing: "Pricing",
    security: "Security",
    resources: "Resources",
    about: "About",
    partners: "Become a partner",
    contact: "Contact",
    trust: "Commitments",
    hds: "HDS infrastructure",
    ue: "Data stays in the EU",
    rgpd: "GDPR compliant",
    rights: "© 2026 Granit · All rights reserved",
    privacy: "Privacy policy",
    cgv: "Terms of sale",
  },
};

function GrandLogo() {
  const logo = useSymbole(LOGO.horizontalRose);
  const rm = useReducedMotion();
  const [etat, setEtat] = useState<"" | "quake" | "lock">("");
  const tm = useRef(0);
  const on = useRef(false);
  const enter = () => {
    if (on.current) return;
    on.current = true;
    window.clearTimeout(tm.current);
    if (rm) {
      setEtat("lock");
      return;
    }
    setEtat("quake");
    tm.current = window.setTimeout(() => setEtat("lock"), 1050);
  };
  const leave = () => {
    on.current = false;
    window.clearTimeout(tm.current);
    tm.current = window.setTimeout(() => setEtat(""), 900);
  };
  if (!logo) return <div className="acc-ft-word" aria-hidden="true" />;
  let pierre = -1;
  return (
    <div className="acc-ft-word" aria-hidden="true">
      <svg
        viewBox={logo.viewBox}
        className={"acc-ft-mark" + (etat ? " " + etat : "")}
        onPointerEnter={enter}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") leave();
        }}
        onPointerDown={(e) => {
          /* au toucher : la même séquence, puis le logo se rendort */
          if (e.pointerType !== "mouse") {
            enter();
            window.setTimeout(leave, 1800);
          }
        }}
      >
        {logo.pieces.map((p, i) => {
          if (!p.stroke)
            return (
              <g key={i} transform={p.transform}>
                <path className="nom" d={p.d} />
              </g>
            );
          pierre++;
          const k = pierre;
          /* chaque pierre a sa propre oscillation, en unités du logo : discrète, elle s'amortit */
          const qx = (k % 2 ? 1 : -1) * (0.9 + (k % 3) * 0.3);
          const qy = 0.7 + ((k + 1) % 3) * 0.25;
          const qr = (k % 2 ? -1 : 1) * (0.9 + k * 0.2);
          return (
            <g key={i} transform={p.transform}>
              <path
                d={p.d}
                strokeWidth={p.stroke}
                className={"pierre" + (k === CLE_DE_VOUTE ? " key" : "")}
                style={{
                  ["--k" as string]: k,
                  ["--qx" as string]: qx.toFixed(1) + "px",
                  ["--qy" as string]: qy.toFixed(1) + "px",
                  ["--qr" as string]: qr.toFixed(1) + "deg",
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function PiedDePage() {
  const { lang } = useLanguage();
  const posthog = usePostHog();
  const t = copy[lang];
  const cols = [
    {
      h: t.product,
      l: [
        ["/agents", t.agents],
        ["/tarifs", t.pricing],
        ["/securite", t.security],
        ["/ressources", t.resources],
      ],
    },
    {
      h: t.company,
      l: [
        ["/a-propos", t.about],
        ["/affiliation", t.partners],
        ["/demo", t.contact],
      ],
    },
  ];
  return (
    <footer className="acc-ft" aria-label={t.footer}>
      <div className="acc-wrap">
        <div className="acc-ft-nav">
          <div className="acc-ft-id">
            <a
              className="acc-ft-brand"
              href="#top"
              aria-label={t.home}
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img src={LOGO.horizontalRose} alt="" width={140} height={30} />
            </a>
            <p>{t.id}</p>
            <a
              className="acc-ft-li"
              href={linkedinUrl("footer")}
              target="_blank"
              rel="noopener"
              onClick={() => posthog?.capture("linkedin_clicked", { placement: "footer" })}
            >
              <IconLinkedin />
              {t.linkedin}
              <IconOut />
            </a>
          </div>
          <nav className="acc-ft-cols" aria-label={t.plan}>
            {cols.map((c) => (
              <div className="acc-ft-col" key={c.h}>
                <h3>{c.h}</h3>
                <ul>
                  {c.l.map(([to, label]) => (
                    <li key={to}>
                      <Link to={to}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <ul className="acc-ft-trust" aria-label={t.trust}>
            <li>
              <IconCloud />
              <span>{t.hds}</span>
            </li>
            <li>
              <IconEu />
              <span>{t.ue}</span>
            </li>
            <li>
              <IconShield />
              <span>{t.rgpd}</span>
            </li>
          </ul>
        </div>
        <GrandLogo />
        <p className="acc-ft-base">
          <span>{t.rights}</span>
          <Link to="/privacy">{t.privacy}</Link>
          <Link to="/cgv">{t.cgv}</Link>
        </p>
      </div>
    </footer>
  );
}
