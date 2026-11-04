// Page d'un ancien article (src/lib/articles.ts) : le rendu d'avant le guide, avec deux ajouts :
// le fil d'Ariane passe par le métier de l'article,
// et « Continuer la lecture » montre d'abord des articles de la même catégorie.
// En anglais : la traduction de content/en/anciens si elle existe, sinon le texte français.
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useLanguage } from "@/lib/i18n";
import { articles, getArticle } from "@/lib/articles";
import { articleLd } from "@/lib/seo";
import {
  categorieDeAncien,
  ficheLang,
  metierDe,
  tempsLecture,
  textesAncien,
  titreCourt,
  toutCategorie,
} from "@/lib/ressources/contenu";
import { useAncienEn } from "@/lib/ressources/langue";
import { breadcrumbLd } from "@/lib/ressources/seo";
import { Fil, itemMetier, useItemRessources } from "./Fil";
import { NotFoundRessource } from "./Introuvable";

const labels = {
  fr: { related: "Continuer la lecture" },
  en: { related: "Continue reading" },
};

type Carte = { slug: string; label: string; time: string; title: string };

export function PageAncien({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const fr = getArticle("fr", slug);
  const en = useAncienEn(slug);
  const ressources = useItemRessources();
  const t = labels[lang];
  if (!fr) return <NotFoundRessource />;
  const article = en ?? fr;

  const cat = categorieDeAncien(slug, lang);
  const memeTheme: Carte[] = cat
    ? toutCategorie(cat.slug)
        .filter((f) => f.slug !== slug)
        .map((f) => ficheLang(f, lang))
        .map((f) => ({
          slug: f.slug,
          label: cat.court,
          time: tempsLecture(f.readTime),
          title: f.title,
        }))
    : [];
  const autres: Carte[] = articles.fr
    .filter((a) => a.slug !== slug && !memeTheme.some((m) => m.slug === a.slug))
    .map((a) => {
      const x = textesAncien(a, lang);
      return { slug: a.slug, label: x.category, time: x.time, title: x.title };
    });
  const related = [...memeTheme, ...autres].slice(0, 3);

  // Données structurées en français, comme le rendu serveur.
  const ld = articleLd({ title: fr.title, description: fr.desc, slug });
  // Fil d'Ariane par métier ; un article valable pour tous les métiers s'arrête à Ressources.
  const metierFr = metierDe(slug);
  const metier = metierDe(slug, lang);
  const breadcrumb = breadcrumbLd([
    ["Ressources", "/ressources"],
    ...(metierFr ? [[metierFr.nom, `/ressources/metier/${metierFr.slug}`] as [string, string]] : []),
    [fr.title, `/ressources/${slug}`],
  ]);

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
          <Fil
            items={[
              ressources,
              ...(metier ? [itemMetier(metier)] : []),
              { nom: titreCourt(article.title) },
            ]}
          />
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

      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <div className="border-t pt-12" style={{ borderColor: "var(--border)" }}>
          <div className="eyebrow mb-6">{t.related}</div>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                to="/ressources/$slug"
                params={{ slug: a.slug }}
                className="card-hover flex h-full flex-col rounded-[8px] border bg-papier p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="eyebrow">
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
