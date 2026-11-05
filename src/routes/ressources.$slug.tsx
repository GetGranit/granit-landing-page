import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getArticle } from "@/lib/articles";
import { chargerArticle, ficheJson, metierDe, remplacant } from "@/lib/ressources/contenu";
import { prechargerEn, useArticleEn } from "@/lib/ressources/langue";
import { slugFrDeAncienEn } from "@/lib/legacyBlog";
import { blogPostingLd, breadcrumbLd, faqLd, titrePage } from "@/lib/ressources/seo";
import { photoFiche, src } from "@/lib/ressources/photos";
import { SITE_URL } from "@/lib/seo";
import { PageAncien } from "@/components/ressources/PageAncien";
import { NotFoundRessource } from "@/components/ressources/Introuvable";
import { PageArticle } from "@/components/ressources/article/PageArticle";

export const Route = createFileRoute("/ressources/$slug")({
  // Ordre de recherche : articles JSON en ligne (aperçu compris hors production), puis articles.ts.
  // Ancien article remplacé par un article du moteur : redirection permanente.
  // Ancien slug anglais (articles.en) : même redirection, vers l'adresse française de l'article,
  // qui sert les deux langues.
  beforeLoad: ({ params }) => {
    const fr = slugFrDeAncienEn(params.slug);
    const cible = remplacant(fr ?? params.slug) ?? fr;
    if (cible)
      throw redirect({ to: "/ressources/$slug", params: { slug: cible }, statusCode: 301 });
  },
  // Le serveur rend le français ; en navigation déjà en anglais, la traduction est préchargée.
  loader: async ({ params }) => {
    if (ficheJson(params.slug)) {
      const [data] = await Promise.all([chargerArticle(params.slug), prechargerEn(params.slug)]);
      if (data?.article) return { kind: "json" as const, slug: params.slug, ...data };
    }
    if (getArticle("fr", params.slug)) {
      await prechargerEn(params.slug);
      return { kind: "ancien" as const, slug: params.slug };
    }
    throw notFound();
  },
  head: ({ loaderData }) => {
    if (loaderData?.kind === "json") {
      const a = loaderData.article;
      const title = a.seoTitle?.trim() || titrePage(a.title);
      const fiche = ficheJson(a.slug);
      // og:image : l'aperçu dessiné s'il existe (fiches plateformes), sinon la photo du thème.
      const image = fiche ? SITE_URL + (fiche.og ?? src(photoFiche(fiche), 1600)) : undefined;
      const [largeur, hauteur] = fiche?.og ? ["1200", "630"] : ["1600", "900"];
      return {
        meta: [
          { title },
          { name: "description", content: a.metaDescription },
          { property: "og:title", content: title },
          { name: "twitter:title", content: title },
          { property: "og:description", content: a.metaDescription },
          { property: "og:type", content: "article" },
          ...(image
            ? [
                { property: "og:image", content: image },
                { property: "og:image:width", content: largeur },
                { property: "og:image:height", content: hauteur },
                { property: "og:image:alt", content: a.title },
                { name: "twitter:card", content: "summary_large_image" },
                { name: "twitter:image", content: image },
              ]
            : []),
          ...(a.preview ? [{ name: "robots", content: "noindex, nofollow" }] : []),
        ],
      };
    }
    const a = loaderData ? getArticle("fr", loaderData.slug) : undefined;
    const title = a ? `${a.title} - Granit` : "Article - Granit";
    const desc = a?.desc ?? "Article Granit.";
    const balise = a?.seoTitle?.trim() || title;
    return {
      meta: [
        { title: balise },
        { name: "description", content: desc },
        { property: "og:title", content: balise },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: ArticleRoute,
  notFoundComponent: NotFoundRessource,
});

function ArticleRoute() {
  const data = Route.useLoaderData();
  if (data.kind === "ancien") return <PageAncien slug={data.slug} />;
  return <ArticleJson data={data} />;
}

function ArticleJson({ data }: { data: Extract<ReturnType<typeof Route.useLoaderData>, { kind: "json" }> }) {
  // Données structurées en français (comme le rendu serveur) ; la page suit la langue de l'écran.
  const en = useArticleEn(data.slug);
  const { article, plateforme, concurrents } = data;
  const metier = metierDe(article.slug);
  const lds = [
    blogPostingLd(article, plateforme),
    faqLd(article),
    breadcrumbLd([
      ["Ressources", "/ressources"],
      ...(metier ? [[metier.nom, `/ressources/metier/${metier.slug}`] as [string, string]] : []),
      [article.title, `/ressources/${article.slug}`],
    ]),
  ].filter(Boolean);
  return (
    <>
      {lds.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <PageArticle
        article={en?.article ?? article}
        plateforme={en ? en.plateforme : plateforme}
        concurrents={(en ?? data).concurrents ?? {}}
      />
    </>
  );
}
