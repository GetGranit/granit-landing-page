import { createFileRoute, notFound } from "@tanstack/react-router";
import { getArticle } from "@/lib/articles";
import { chargerArticle, categorie, ficheJson } from "@/lib/ressources/contenu";
import { blogPostingLd, breadcrumbLd, faqLd, titrePage } from "@/lib/ressources/seo";
import { PageAncien } from "@/components/ressources/PageAncien";
import { NotFoundRessource } from "@/components/ressources/Introuvable";
import { PageArticle } from "@/components/ressources/article/PageArticle";

export const Route = createFileRoute("/ressources/$slug")({
  // Ordre de recherche : articles JSON en ligne (aperçu compris hors production), puis articles.ts.
  loader: async ({ params }) => {
    if (ficheJson(params.slug)) {
      const data = await chargerArticle(params.slug);
      if (data?.article) return { kind: "json" as const, slug: params.slug, ...data };
    }
    if (getArticle("fr", params.slug) || getArticle("en", params.slug)) {
      return { kind: "ancien" as const, slug: params.slug };
    }
    throw notFound();
  },
  head: ({ loaderData }) => {
    if (loaderData?.kind === "json") {
      const a = loaderData.article;
      const title = titrePage(a.title);
      return {
        meta: [
          { title },
          { name: "description", content: a.metaDescription },
          { property: "og:title", content: title },
          { property: "og:description", content: a.metaDescription },
          { property: "og:type", content: "article" },
          ...(a.preview ? [{ name: "robots", content: "noindex, nofollow" }] : []),
        ],
      };
    }
    const a = loaderData
      ? (getArticle("fr", loaderData.slug) ?? getArticle("en", loaderData.slug))
      : undefined;
    const title = a ? `${a.title} - Granit AI` : "Article - Granit AI";
    const desc = a?.desc ?? "Article Granit AI.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
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
  const { article, plateforme } = data;
  const cat = categorie(article.category)!;
  const lds = [
    blogPostingLd(article, plateforme),
    faqLd(article),
    breadcrumbLd([
      ["Ressources", "/ressources"],
      [cat.nom, `/ressources/categorie/${cat.slug}`],
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
      <PageArticle article={article} plateforme={plateforme} />
    </>
  );
}
