// Les outils référentiels présents dans le build, vus par l'app : /outils, le pied de page et les
// liens d'un outil à l'autre (LienOutil). Chaque `src/lib/outils/<id>/outil.mjs` fusionné est trouvé
// seul ; sans dossier d'outil, la liste est vide et rien ne s'affiche.
// Côté Node (sitemap, llms.txt, tests), c'est scripts/outils/decouvrir.mjs qui fait la même découverte.
import type { OutilDescripteur, OutilId } from "./types";

// Seulement les descripteurs (quelques lignes chacun) : jamais donnees.json ni pages.mjs.
const descripteurs = import.meta.glob<OutilDescripteur>("/src/lib/outils/*/outil.mjs", {
  eager: true,
  import: "OUTIL",
});

/** Rangés dans l'ordre de /outils (`OUTIL.ordre`). */
export function trierOutils(liste: Iterable<OutilDescripteur>): OutilDescripteur[] {
  return [...liste].filter(Boolean).sort((a, b) => a.ordre - b.ordre || a.id.localeCompare(b.id));
}

const OUTILS = trierOutils(Object.values(descripteurs));

/** Les outils fusionnés, dans l'ordre de /outils. */
export function outilsDisponibles(): readonly OutilDescripteur[] {
  return OUTILS;
}

/** Le descripteur d'un outil s'il est fusionné ; sinon undefined (LienOutil n'affiche alors rien). */
export function outilDisponible(id: OutilId | string): OutilDescripteur | undefined {
  return OUTILS.find((o) => o.id === id);
}
