import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import logoMonogram from "@/assets/logo.svg";

const labels = {
  fr: { agents: "Agents", security: "Sécurité", pricing: "Tarifs", resources: "Ressources", login: "Se connecter", demo: "Demander une démo", switch: "EN" },
  en: { agents: "Agents", security: "Security", pricing: "Pricing", resources: "Resources", login: "Sign in", demo: "Book a demo", switch: "FR" },
};

export function Nav() {
  const { lang, toggleLang } = useLanguage();
  const t = labels[lang];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/agents", label: t.agents },
    { to: "/securite", label: t.security },
    { to: "/tarifs", label: t.pricing },
    { to: "/ressources", label: t.resources },
  ] as const;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className="mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full px-3 pl-5 pr-2 transition-all duration-500 sm:px-4 sm:pl-6 sm:pr-2"
        style={
          scrolled
            ? {
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(20px) saturate(1.4)",
                WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                border: "1px solid color-mix(in oklab, var(--terra) 35%, transparent)",
                boxShadow: "0 10px 30px -12px rgba(28,17,8,0.12)",
              }
            : { background: "transparent", border: "1px solid transparent" }
        }
      >
        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={() => {
            if (typeof window !== "undefined" && window.location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <img src={logoMonogram} alt="Granit" className="h-7 w-auto sm:h-9" />
          <span className="font-serif text-[20px] tracking-tight" style={{ color: "var(--text)", fontWeight: 700 }}>
            Granit
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[13.5px] transition-colors"
              style={{ color: "var(--text-soft)" }}
              activeProps={{ style: { color: "var(--text)", fontWeight: 500 } }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="hidden h-8 items-center rounded-full border px-2.5 text-[11px] transition-colors hover:border-[color:var(--text)] sm:inline-flex"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            aria-label={lang === "fr" ? "Passer en anglais" : "Switch to French"}
          >
            {t.switch}
          </button>
          <a href="https://app.getgranit.ai" className="hidden text-[13.5px] sm:inline-block sm:px-2" style={{ color: "var(--text-soft)" }}>
            {t.login}
          </a>
          <Link to="/" hash="demo" className="btn-primary text-[13px]" style={{ padding: "9px 16px" }}>
            {t.demo} <span className="arrow">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
