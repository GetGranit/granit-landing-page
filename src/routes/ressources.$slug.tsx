import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { articles, getArticle } from "@/lib/articles";
import { articleLd } from "@/lib/seo";

export const Route = createFileRoute("/ressources/$slug")({
  loader: ({ params }) => {
    const fr = getArticle("fr", params.slug);
    const en = getArticle("en", params.slug);
    if (!fr && !en) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const a = loaderData ? getArticle("fr", loaderData.slug) ?? getArticle("en", loaderData.slug) : undefined;
    const title = a ? `${a.title} - Granit AI` : "Article - Granit AI";
    const desc = a?.desc ?? "Article Granit AI.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ArticlePage,
  notFoundComponent: () => (
    <SiteLayout>
      <section className="mx-auto max-w-[800px] px-6 py-32 text-center">
        <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4vw,56px)" }}>Article introuvable</h1>
        <Link to="/ressources" className="btn-primary mt-8 inline-flex">Retour aux ressources</Link>
      </section>
    </SiteLayout>
  ),
});

const labels = {
  fr: { back: "← Toutes les ressources", related: "Continuer la lecture" },
  en: { back: "← All resources", related: "Continue reading" },
};

function ArticlePage() {
  const { slug } = Route.useParams();
  const { lang } = useLanguage();
  const article = getArticle(lang, slug) ?? getArticle(lang === "fr" ? "en" : "fr", slug);
  const t = labels[lang];

  if (!article) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-[800px] px-6 py-32 text-center">
          <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4vw,56px)" }}>Article introuvable</h1>
        </section>
      </SiteLayout>
    );
  }

  const related = articles[lang].filter((a) => a.slug !== slug).slice(0, 3);
  const ld = articleLd({ title: article.title, description: article.desc, slug });

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld.article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld.breadcrumb) }} />
      <article className="mx-auto max-w-[760px] px-6 pt-24 pb-16">
        <Reveal>
          <Link to="/ressources" className="text-[13px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {t.back}
          </Link>
          <div className="eyebrow mt-8">
            {article.category} · {article.time}
          </div>
          <h1 className="font-serif mt-5" style={{ fontSize: "clamp(36px,4.6vw,64px)", lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {article.title}
          </h1>
          <p className="body-lg mt-8">{article.desc}</p>
          <div className="mt-10 space-y-6">
            {article.body.map((p, i) => (
              <p key={i} className="text-[17px] leading-[1.75]" style={{ color: "var(--text-soft)" }}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </article>

      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <div className="border-t pt-12" style={{ borderColor: "var(--border)" }}>
          <div className="eyebrow mb-6">{t.related}</div>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                to="/ressources/$slug"
                params={{ slug: a.slug }}
                className="card-hover flex h-full flex-col rounded-[8px] border bg-white/40 p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="text-[10px] uppercase tracking-[0.04em]" style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}>
                  {a.category} · {a.time}
                </div>
                <div className="mt-4 text-[18px] font-serif leading-[1.25]" style={{ fontWeight: 700 }}>
                  {a.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
