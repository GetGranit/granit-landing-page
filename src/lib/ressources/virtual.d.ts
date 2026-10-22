// Modules produits par scripts/ressources/vite-plugin.ts.
declare module "virtual:ressources" {
  import type { Concurrent, Fiche, Plateforme, RessourceJson } from "@/lib/ressources/types";
  export const fiches: Fiche[];
  /** Ancien slug remplacé -> slug de l'article qui le remplace. */
  export const redirections: Record<string, string>;
  export const charger: Record<
    string,
    () => Promise<{
      default: {
        article: RessourceJson;
        plateforme: Plateforme | null;
        concurrents: Record<string, Concurrent>;
      };
    }>
  >;
}
