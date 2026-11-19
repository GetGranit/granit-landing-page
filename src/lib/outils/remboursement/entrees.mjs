// L'index des données de l'outil B · Remboursement : les entrées de donnees.json rangées par code et
// par groupe. Côté serveur et Node seulement (pages.mjs, vues.mjs, tests) : jamais importé par une
// route ni par un composant (les données restent hors du bundle client).
import donnees from "./donnees.json" with { type: "json" };
import { GROUPES, HORS_GROUPE, groupeDeCategorie } from "./groupes.mjs";
import { DATE_BASCULE, METIERS, TAUX_2027 } from "./publication.mjs";

export { donnees };

/** Les sources de donnees.json, par identifiant. */
export const SOURCES = new Map(donnees.sources.map((s) => [s.id, s]));

/** Toutes les entrées qui ont un code, par code (LPP, CCAM, CIP). */
export const PAR_CODE = new Map(donnees.entrees.filter((e) => e.code).map((e) => [e.code, e]));

/** Les entrées d'un groupe (ou d'un groupe hors page), dans l'ordre de donnees.json. */
export function entreesDuGroupe(g) {
  return donnees.entrees.filter((e) => g.categories.includes(e.categorie));
}

/** Le groupe d'une entrée (GROUPES ou HORS_GROUPE). */
export const groupeDe = (e) => groupeDeCategorie(e.categorie);

/** Un métier de donnees.json a-t-il ses lignes dans le hub ? ses pages ? */
export const ouvert = (metier, quoi, metiers = METIERS) => Boolean(metiers[metier]?.[quoi]);

/** Contexte des repères (contenu.mjs) : codes, date, taux 2027, date de vérification. */
export function contexte(jour, { taux2027 = TAUX_2027, bascule = DATE_BASCULE } = {}) {
  return { codes: PAR_CODE, jour, taux2027, bascule, verifieLe: donnees.genere_le };
}

// Garde-fous au chargement (le build et les tests s'arrêtent) : un taux 2027 renseigné doit citer
// une source de donnees.json ; chaque catégorie a un et un seul groupe.
for (const [poste, t] of Object.entries(TAUX_2027)) {
  if (t === null) continue;
  if (typeof t?.taux !== "number" || t.taux <= 0 || t.taux > 100)
    throw new Error(`TAUX_2027.${poste} : taux invalide (${JSON.stringify(t)})`);
  if (!SOURCES.has(t.source_id))
    throw new Error(
      `TAUX_2027.${poste} : la source « ${t.source_id} » n'est pas dans donnees.json`,
    );
}
for (const e of donnees.entrees) {
  const n = [...GROUPES, ...HORS_GROUPE].filter((g) => g.categories.includes(e.categorie)).length;
  if (e.statut === "sur" && n !== 1)
    throw new Error(`Catégorie « ${e.categorie} » (${e.slug}) : ${n} groupe(s), il en faut un`);
}
