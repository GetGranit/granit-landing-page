import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { articles } from "@/lib/articles";
import { getArticleCover } from "@/lib/articleCovers";

export const Route = createFileRoute("/ressources/")({
  head: () => ({
    meta: [
      { title: "Ressources - Granit AI" },
      { name: "description", content: "Articles Granit AI sur l'automatisation administrative en santé." },
      { property: "og:title", content: "Ressources - Granit AI" },
      { property: "og:description", content: "Guides pratiques pour automatiser le back-office santé." },
    ],
  }),
  component: RessourcesPage,
});

const page = {
  fr: {
    eyebrow: "Ressources",
    title: "Articles pour équipes opérationnelles santé.",
    intro: "Guides pratiques, retours de terrain et analyses pour automatiser le back-office sans perdre le contrôle.",
    featured: "À la une",
    read: "Lire l'article",
    all: "Tous les articles",
  },
  en: {
    eyebrow: "Resources",
    title: "Articles for healthcare operations teams.",
    intro: "Practical guides, field insights and analysis to automate the back-office without losing control.",
    featured: "Featured",
    read: "Read article",
    all: "All articles",
  },
};



function RessourcesPage() {
  const { lang } = useLanguage();
  const t = page[lang];
  const list = articles[lang];
  const [featured, ...rest] = list;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] opacity-25"
          style={{
            backgroundImage: "radial-gradient(circle, var(--terra) 1px, transparent 1.4px)",
            backgroundSize: "16px 16px",
            maskImage: "radial-gradient(circle at 70% 50%, black, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 70% 50%, black, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-[1280px] px-6 pt-24 pb-12">
          <Reveal>
            <div className="eyebrow mb-5">{t.eyebrow}</div>
            <h1 className="h1-hero max-w-4xl" style={{ fontSize: "clamp(40px,5vw,76px)" }}>
              {t.title}
            </h1>
            <p className="body-lg mt-8 max-w-2xl">{t.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="mx-auto max-w-[1280px] px-6 pb-16">
          <Reveal>
            <Link
              to="/ressources/$slug"
              params={{ slug: featured.slug }}
              className="card-hover group grid overflow-hidden rounded-[18px] border bg-white/60 md:grid-cols-2"
              style={{
                borderColor: "color-mix(in oklab, var(--border) 70%, transparent)",
                boxShadow: "0 30px 70px -40px color-mix(in oklab, var(--terra) 35%, transparent)",
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                <img
                  src={getArticleCover(featured.slug)}
                  alt=""
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span
                  className="absolute left-5 top-5 rounded-full px-3 py-1 text-[10.5px]"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    color: "var(--terra)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {t.featured}
                </span>
              </div>
              <div className="flex flex-col p-8 md:p-10">
                <div
                  className="text-[10.5px] uppercase tracking-[0.06em]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
                >
                  {featured.category} · {featured.time}
                </div>
                <h2
                  className="mt-4 font-serif"
                  style={{ fontSize: "clamp(24px,2.6vw,34px)", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.015em" }}
                >
                  {featured.title}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.65]" style={{ color: "var(--text-soft)" }}>
                  {featured.desc}
                </p>
                <div
                  className="mt-auto pt-8 text-[13px]"
                  style={{ color: "var(--terra)", fontWeight: 600 }}
                >
                  {t.read} <span className="inline-block transition-transform group-hover:translate-x-0.5">↗</span>
                </div>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* GRID */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <Reveal>
          <div
            className="mb-8 flex items-end justify-between border-b pb-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="eyebrow">{t.all}</div>
            <div
              className="text-[12px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              {list.length} {lang === "fr" ? "articles" : "articles"}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, index) => {
            const cover = getArticleCover(article.slug);
            return (
              <Reveal key={article.slug} delay={index * 0.04}>
                <Link
                  to="/ressources/$slug"
                  params={{ slug: article.slug }}
                  className="card-hover group flex h-full flex-col overflow-hidden rounded-[14px] border bg-white"
                  style={{ borderColor: "color-mix(in oklab, var(--border) 70%, transparent)" }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={cover}
                      alt=""
                      width={1280}
                      height={800}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div
                      className="text-[10.5px] uppercase tracking-[0.06em]"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
                    >
                      {article.category} · {article.time}
                    </div>
                    <h2
                      className="mt-3 font-serif"
                      style={{ fontSize: "20px", lineHeight: 1.25, fontWeight: 600, letterSpacing: "-0.01em" }}
                    >
                      {article.title}
                    </h2>
                    <p className="mt-3 flex-1 text-[14px] leading-[1.65]" style={{ color: "var(--text-soft)" }}>
                      {article.desc}
                    </p>
                    <div
                      className="mt-6 inline-flex items-center gap-1 text-[12.5px]"
                      style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}
                    >
                      {t.read} <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
