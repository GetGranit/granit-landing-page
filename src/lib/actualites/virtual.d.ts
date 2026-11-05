// Modules produits par scripts/actualites/vite-plugin.ts.
declare module "virtual:actualites" {
  import type { Edition, FicheEdition } from "@/lib/actualites/types";
  /** Du plus récent au plus ancien. */
  export const fiches: FicheEdition[];
  export const charger: Record<string, () => Promise<{ default: Edition | null }>>;
}

declare module "virtual:actualites/presence" {
  /** Vrai dès que le build contient une édition. */
  export const rubriqueOuverte: boolean;
}
