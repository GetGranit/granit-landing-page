// Page d'un ancien article (src/lib/articles.ts) : le rendu d'avant le guide, avec deux ajouts :
// le fil d'Ariane passe par la catégorie quand l'article est rattaché au cocon,
// « Continuer la lecture » montre d'abord des articles de la même catégorie,
// et la bande démo des nouvelles pages ferme l'article.
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useLanguage } from "@/lib/i18n";
import { articles, getArticle } from "@/lib/articles";
import { articleLd } from "@/lib/seo";
import { categorieDeAncien, tempsLecture, toutCategorie } from "@/lib/ressources/contenu";
import { breadcrumbLd } from "@/lib/ressources/seo";
import { BandeDemo } from "./BandeDemo";
import { Fil } from "./Fil";
import { NotFoundRessource } from "./Introuvable";

const labels = {
  fr: { back: "← Toutes les ressources", related: "Continuer la lecture" },
  en: { back: "← All resources", related: "Continue reading" },
};

type Carte = { slug: string; label: string; time: string; title: string };

export function PageAncien({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const article = getArticle(lang, slug) ?? getArticle(lang === "fr" ? "en" : "fr", slug);
  const t = labels[lang];
  if (!article) return <NotFoundRessource />;

  const cat = lang === "fr" ? categorieDeAncien(slug) : undefined;
  const memeTheme: Carte[] = cat
    ? toutCategorie(cat.slug)
        .filter((f) => f.slug !== slug)
        .map((f) => ({
          slug: f.slug,
          label: cat.court,
          time: tempsLecture(f.readTime),
          title: f.title,
        }))
    : [];
  const autres: Carte[] = articles[lang]
    .filter((a) => a.slug !== slug && !memeTheme.some((m) => m.slug === a.slug))
    .map((a) => ({ slug: a.slug, label: a.category, time: a.time, title: a.title }));
  const related = [...memeTheme, ...autres].slice(0, 3);

  const ld = articleLd({ title: article.title, description: article.desc, slug });
  const breadcrumb = cat
    ? breadcrumbLd([
        ["Ressources", "/ressources"],
        [cat.nom, `/ressources/categorie/${cat.slug}`],
        [article.title, `/ressources/${slug}`],
      ])
    : ld.breadcrumb;

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld.article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="mx-auto max-w-[760px] px-6 pt-24 pb-16">
        <div>
          {cat ? (
            <Fil
              items={[
                { nom: "Ressources", to: "/ressources" },
                {
                  nom: cat.nom,
                  to: "/ressources/categorie/$category",
                  params: { category: cat.slug },
                },
              ]}
            />
          ) : (
            <Link
              to="/ressources"
              className="text-[13px]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              {t.back}
            </Link>
          )}
          <div className="eyebrow mt-8">
            {article.category} · {article.time}
          </div>
          <h1
            className="font-serif mt-5"
            style={{
              fontSize: "clamp(36px,4.6vw,64px)",
              lineHeight: 1.1,
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            {article.title}
          </h1>
          <p className="body-lg mt-8">{article.desc}</p>
          <div className="mt-10 space-y-6">
            {article.body.map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.75]"
                style={{ color: "var(--text-soft)" }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </article>

      {lang === "fr" && <BandeDemo />}

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
                <div
                  className="text-[10px] uppercase tracking-[0.04em]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
                >
                  {a.label} · {a.time}
                </div>
                <div className="mt-4 text-[18px] font-serif leading-[1.25]">{a.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
