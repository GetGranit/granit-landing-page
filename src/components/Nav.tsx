import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { useLanguage } from "@/lib/i18n";
import { rubriqueOuverte } from "@/lib/actualites/ouverture";
import logoMonogram from "@/assets/logo.svg";
import { MenuMetiers } from "./MenuMetiers";

const labels = {
  fr: { security: "Sécurité", pricing: "Tarifs", resources: "Ressources", news: "Actualités", login: "Se connecter", demo: "Demander une démo", demoCourt: "Démo", switch: "EN" },
  en: { security: "Security", pricing: "Pricing", resources: "Resources", news: "News", login: "Sign in", demo: "Book a demo", demoCourt: "Demo", switch: "FR" },
};

export function Nav() {
  const { lang, toggleLang } = useLanguage();
  const posthog = usePostHog();
  const t = labels[lang];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/tarifs", label: t.pricing },
    { to: "/ressources", label: t.resources },
    // Le lien n'existe que si une édition est en ligne.
    ...(rubriqueOuverte ? ([{ to: "/actualites", label: t.news }] as const) : []),
  ] as const;

  return (
    <header className="sticky top-0 z-50 px-3 py-1.5 sm:px-6 sm:py-2">
      <div
        className="relative mx-auto flex h-16 max-w-[1200px] items-center justify-between rounded-full px-3 pl-5 pr-2 transition-[background-color,border-color,box-shadow] duration-200 sm:px-4 sm:pl-6 sm:pr-2 lg:px-4"
        style={
          scrolled
            ? {
                background: "rgba(250,240,242,0.96)",
                backdropFilter: "blur(16px) saturate(1.2)",
                WebkitBackdropFilter: "blur(16px) saturate(1.2)",
                border: "1px solid var(--border)",
                boxShadow: "0 10px 30px -12px rgba(31,53,48,0.12)",
              }
            : { background: "transparent", border: "1px solid transparent" }
        }
      >
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => {
            if (typeof window !== "undefined" && window.location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <img src={logoMonogram} alt="Granit" className="h-7 w-auto min-[400px]:h-8 sm:h-9" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex xl:absolute xl:left-1/2 xl:-translate-x-1/2">
          <MenuMetiers lang={lang} />
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:bg-[color:var(--lavis)]"
              style={{ color: "var(--text)" }}
              activeProps={{ className: "bg-[color:var(--lavis)]" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sous lg, la navigation est masquée : « Métiers » reste accessible en un clic. */}
          <Link
            to="/metiers"
            className="hidden rounded-full px-2 py-2 text-[14px] font-medium transition-colors hover:bg-[color:var(--lavis)] min-[340px]:inline-block lg:hidden"
            style={{ color: "var(--text)" }}
            activeProps={{ className: "bg-[color:var(--lavis)]" }}
          >
            {lang === "fr" ? "Métiers" : "Trades"}
          </Link>
          <button
            type="button"
            onClick={() => {
              const languageTo = lang === "fr" ? "en" : "fr";
              posthog.capture("language_switched", { language_to: languageTo });
              toggleLang();
            }}
            className="inline-flex h-8 items-center rounded-full border px-2.5 text-[11px] transition-colors hover:border-[color:var(--text)]"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            aria-label={lang === "fr" ? "Passer en anglais" : "Switch to French"}
          >
            {t.switch}
          </button>
          <a
            href="https://app.getgranit.ai"
            className="hidden text-[15px] font-medium sm:inline-block sm:px-2"
            style={{ color: "var(--text)" }}
            onClick={() => posthog.capture("sign_in_clicked", { location: "navigation" })}
          >
            {t.login}
          </a>
          <Link to="/" hash="demo" className="btn-primary whitespace-nowrap px-3.5 py-[11px] text-[14px] sm:px-[18px]">
            {/* Sur petit écran, « Démo » laisse la place au logo et à « Métiers ». */}
            <span className="sm:hidden">{t.demoCourt}</span>
            <span className="hidden sm:inline">{t.demo}</span> <span className="arrow">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
