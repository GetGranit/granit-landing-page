// Modules produits par scripts/ressources/vite-plugin.ts.
declare module "virtual:ressources" {
  import type { Fiche, Plateforme, RessourceJson } from "@/lib/ressources/types";
  export const fiches: Fiche[];
  export const charger: Record<
    string,
    () => Promise<{ default: { article: RessourceJson; plateforme: Plateforme | null } }>
  >;
}
