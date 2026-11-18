// La carte Granit (« pont ») des pages d'outil : ses deux liens.
import { calcomDemoUrl } from "../../calcom.ts";
import { metierOutil } from "./metiers.mjs";
import type { MetierOutil, OutilId } from "./types";

/**
 * Lien « Demander une démo » : Cal.com, utm_campaign=outil-<id>, utm_content=outil-<page>,
 * utm_term=<slug de l'entrée>.
 */
export function lienDemoOutil(
  outil: OutilId,
  page: "hub" | "entree" | "introuvable",
  slug?: string,
): string {
  return calcomDemoUrl(`outil-${page}`, slug, `outil-${outil}`);
}

/** Bouton « Voir ce que font les agents » : la page du métier s'il n'y en a qu'un, sinon /metiers. */
export function cibleMetier(metiers?: readonly MetierOutil[]): string {
  const uniques = [...new Set(metiers ?? [])];
  return (uniques.length === 1 && metierOutil(uniques[0])?.page) || "/metiers";
}
