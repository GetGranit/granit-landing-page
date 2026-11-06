// Modules produits par scripts/ressources/vite-plugin.ts.
declare module "virtual:ressources" {
  import type { Article } from "@/lib/articles";
  import type { CouvertureFiche } from "@/lib/ressources/couverture";
  import type { Concurrent, Fiche, Plateforme, RessourceJson } from "@/lib/ressources/types";
  type Corps = () => Promise<{
    default: {
      article: RessourceJson;
      plateforme: Plateforme | null;
      concurrents: Record<string, Concurrent>;
    };
  }>;
  export const fiches: Fiche[];
  /** Couvertures des anciens articles de articles.ts (content/couvertures-anciens.json). */
  export const couverturesAnciens: Record<string, CouvertureFiche>;
  /** Ancien slug remplacé -> slug de l'article qui le remplace. */
  export const redirections: Record<string, string>;
  export const charger: Record<string, Corps>;
  /** Version anglaise, seulement pour les articles qui ont une traduction valide (content/en/ressources). */
  export const chargerEn: Record<string, Corps>;
  /** Anciens articles traduits (content/en/anciens), sans leur corps. */
  export const anciensEn: Record<string, Omit<Article, "body">>;
  export const chargerAncienEn: Record<string, () => Promise<{ default: Article }>>;
}
