// Ce qu'un outil sait du reste du site, côté app. Même règle que la version Node
// (contexteSiteNode, scripts/outils/decouvrir.mjs) : articles JSON publiés (jamais l'aperçu) et
// anciens articles français de articles.ts qui ne sont pas remplacés par un article du moteur.
//
// contexteSite() sert à serveur.ts (handlers de createServerFn) pour appeler pages.mjs ;
// articleEnLigne() sert à ArticlesLies (titre et description d'un article à lier).
import { fiches, redirections } from "virtual:ressources";
import { articles } from "@/lib/articles";
import type { ContexteSite } from "./types";

type ArticleLie = { slug: string; titre: string; description: string };

const enLigne = new Map<string, ArticleLie>();
for (const f of fiches)
  if (!f.preview)
    enLigne.set(f.slug, { slug: f.slug, titre: f.title, description: f.metaDescription ?? "" });
for (const a of articles.fr)
  if (!redirections[a.slug] && !enLigne.has(a.slug))
    enLigne.set(a.slug, { slug: a.slug, titre: a.title, description: a.desc });

const CONTEXTE: ContexteSite = { articles: new Set(enLigne.keys()) };

/** Le contexte à passer à pages(), audit() et redirections() de pages.mjs. */
export function contexteSite(): ContexteSite {
  return CONTEXTE;
}

/** Un article /ressources en ligne, ou undefined (slug inconnu, aperçu, ancien remplacé). */
export function articleEnLigne(slug: string): ArticleLie | undefined {
  return enLigne.get(slug);
}
