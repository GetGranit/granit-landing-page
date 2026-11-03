/* Accueil : la barre d'annonce (levée de fonds) et la navigation pleine largeur,
   transparente sur la vidéo du hero, pleine dès qu'on a quitté le haut. Mêmes liens que la Nav du site. */
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { useLanguage } from "@/lib/i18n";
import { IconArrow, IconOut, LOGO, calUrl } from "./commun";

const copy = {
  fr: {
    news: "Nouveau : Granit annonce sa levée de fonds",
    newsMore: "Lire l’annonce",
    nav: "Navigation principale",
    home: "Granit, retour en haut",
    agents: "Agents",
    security: "Sécurité",
    pricing: "Tarifs",
    resources: "Ressources",
    login: "Se connecter",
    demo: "Demander une démo",
    switch: "EN",
    switchLabel: "Passer en anglais",
  },
  en: {
    news: "New: Granit announces its funding round",
    newsMore: "Read the announcement",
    nav: "Main navigation",
    home: "Granit, back to top",
    agents: "Agents",
    security: "Security",
    pricing: "Pricing",
    resources: "Resources",
    login: "Sign in",
    demo: "Book a demo",
    switch: "FR",
    switchLabel: "Switch to French",
  },
} satisfies Record<"fr" | "en", Record<string, string>>;

export function BarreNav() {
  const { lang, toggleLang } = useLanguage();
  const posthog = usePostHog();
  const t = copy[lang];
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    { to: "/agents", label: t.agents },
    { to: "/securite", label: t.security },
    { to: "/tarifs", label: t.pricing },
    { to: "/ressources", label: t.resources },
  ] as const;

  return (
    <>
      <div className="acc-bar">
        <a href="#levee">
          <span>{t.news}</span>
          <b className="acc-bar-more">
            {t.newsMore}
            <IconArrow />
          </b>
        </a>
      </div>
      <nav className={"acc-nav" + (solid ? " is-solid" : "")} aria-label={t.nav}>
        <a
          className="acc-brand"
          href="#top"
          aria-label={t.home}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img
            className="acc-brand-rose"
            src={LOGO.horizontalRose}
            alt=""
            width={120}
            height={26}
          />
          <img className="acc-brand-encre" src={LOGO.horizontal} alt="" width={120} height={26} />
        </a>
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="acc-l">
            {l.label}
          </Link>
        ))}
        <a
          className="acc-l acc-login"
          href="https://app.getgranit.ai"
          onClick={() => posthog?.capture("sign_in_clicked", { location: "navigation" })}
        >
          {t.login}
        </a>
        <button
          type="button"
          className="acc-lang"
          aria-label={t.switchLabel}
          onClick={() => {
            posthog?.capture("language_switched", { language_to: lang === "fr" ? "en" : "fr" });
            toggleLang();
          }}
        >
          {t.switch}
        </button>
        <a
          className="acc-nav-cta"
          href={calUrl("nav")}
          target="_blank"
          rel="noopener"
          onClick={() => posthog?.capture("demo_booking_clicked", { placement: "nav" })}
        >
          {t.demo}
          <IconOut />
        </a>
      </nav>
    </>
  );
}
