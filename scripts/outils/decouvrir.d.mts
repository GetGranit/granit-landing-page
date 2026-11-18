import type {
  ContexteSite,
  ModulePages,
  OutilDescripteur,
  PageOutil,
} from "../../src/lib/outils/socle/types";

/** Un outil trouvé dans src/lib/outils/<id>/, avec ce que ses pages.mjs et publication.mjs exportent. */
export type OutilDecouvert = {
  id: string;
  /** Chemin absolu du dossier de l'outil. */
  dossier: string;
  outil: OutilDescripteur;
  /** pages({ site }) : le hub, puis les entrées publiées. */
  pages: PageOutil[];
  /** redirections({ site }) : { slug reçu: chemin cible } (301). */
  redirections: Record<string, string>;
  /** Le module pages.mjs, pour rappeler pages(), audit() et redirections() (tests, candidates). */
  module: ModulePages;
  /** Le module publication.mjs (SEUIL_MOTS_PROPRES, PAGES_MAX, PRIORITE…), vide s'il n'existe pas. */
  publication: Record<string, unknown>;
  /** Le contexte du site passé à pages.mjs. */
  site: ContexteSite;
};

export type EntreeSitemap = {
  chemin: string;
  lastmod: string;
  frequence: "weekly" | "monthly";
  priorite: string;
};

export const ACCUEIL_OUTILS: Readonly<{
  chemin: "/outils";
  nom: string;
  titre: string;
  description: string;
  h1: string;
}>;
export function contexteSiteNode(racine: string): ContexteSite;
export function dossiersOutils(racine: string): string[];
export function decouvrirOutils(
  racine: string,
  options?: { site?: ContexteSite },
): Promise<OutilDecouvert[]>;
export function entreeSitemap(p: PageOutil): EntreeSitemap;
export function pagesSitemap(outils: OutilDecouvert[]): EntreeSitemap[];
