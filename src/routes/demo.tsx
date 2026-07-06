import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Démo live - Granit AI" },
      { name: "description", content: "Démo interactive de la plateforme Granit AI. Données fictives, navigation libre." },
      { property: "og:title", content: "Démo live - Granit AI" },
      { property: "og:description", content: "Voir la plateforme tourner en conditions réelles." },
    ],
  }),
  component: DemoPage,
});

const copy = {
  fr: { badge: "Démo live · données fictives", cta: "Réserver une démo", title: "Granit AI - Démo" },
  en: { badge: "Live demo · fictitious data", cta: "Book a demo", title: "Granit AI - Demo" },
};

function DemoPage() {
  const { lang } = useLanguage();
  const t = copy[lang];
  return (
    <div className="flex h-screen flex-col" style={{ background: "var(--bg)" }}>
      <header className="flex h-12 items-center justify-between border-b px-4" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <Link to="/" className="flex items-center gap-2"><span className="text-[14px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>←</span><span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "var(--terra)", color: "var(--primary-foreground)" }}><span className="font-serif text-[13px] leading-none">G</span></span><span className="text-[14px]" style={{ fontWeight: 500 }}>Granit</span></Link>
        <div className="rounded-full px-3 py-1 text-[11px]" style={{ background: "var(--bg3)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{t.badge}</div>
        <Link to="/" hash="demo" className="btn-primary text-[13px]" style={{ padding: "6px 14px" }}>{t.cta} <span className="arrow">↗</span></Link>
      </header>
      <iframe src="/demo.html" title={t.title} style={{ width: "100%", height: "calc(100vh - 48px)", border: "none" }} />
    </div>
  );
}
