// Les 5 métiers du site, vus par les outils. Même ordre et mêmes noms que
// src/lib/ressources/verticales.json (un test le vérifie) ; `court` est le libellé des pastilles
// et des filtres des outils. ESM pur : lu par Node (pages.mjs, sitemap) comme par l'app.

/** @type {readonly import("./metiers.d.mts").MetierInfo[]} */
export const METIERS_OUTILS = Object.freeze([
  {
    id: "optique",
    nom: "Opticiens et audioprothésistes",
    court: "Optique et audio",
    page: "/metiers/opticiens",
    rubrique: "/ressources/metier/optique",
  },
  {
    id: "dentaire",
    nom: "Centres dentaires",
    court: "Dentaire",
    page: "/metiers/dentaire",
    rubrique: "/ressources/metier/dentaire",
  },
  {
    id: "centres",
    nom: "Centres de santé et ophtalmologie",
    court: "Centres de santé",
    page: "/metiers/centres-sante",
    rubrique: "/ressources/metier/centres",
  },
  {
    id: "pharmacie",
    nom: "Pharmacies",
    court: "Pharmacie",
    page: "/metiers/pharmacie",
    rubrique: "/ressources/metier/pharmacie",
  },
  {
    id: "cliniques",
    nom: "Cliniques et laboratoires",
    court: "Cliniques et labos",
    page: "/metiers/cliniques-laboratoires",
    rubrique: "/ressources/metier/cliniques",
  },
]);

/** Les identifiants, dans l'ordre. */
export const IDS_METIERS = Object.freeze(METIERS_OUTILS.map((m) => m.id));

/** @param {unknown} v */
export const estMetierOutil = (v) => typeof v === "string" && IDS_METIERS.includes(v);

/** @param {string} id */
export const metierOutil = (id) => METIERS_OUTILS.find((m) => m.id === id);

/**
 * Traduit les clés métier d'un jeu de données vers les métiers du site, dédupliqués et rangés dans
 * l'ordre de METIERS_OUTILS. Une clé qui est déjà un métier du site passe telle quelle ; une clé
 * de la table vaut son métier (ou `null` : ignorée) ; toute autre clé lève une erreur, ce qui fait
 * échouer le build et les tests communs.
 *
 * Exemple (A) : versMetiers(["optique-audio", "dentaire"], { "optique-audio": "optique" })
 * → ["optique", "dentaire"].
 *
 * @param {readonly string[]} cles
 * @param {Record<string, string | null>} [table]
 */
export function versMetiers(cles, table = {}) {
  const vus = new Set();
  for (const cle of cles) {
    const cible = Object.hasOwn(table, cle) ? table[cle] : estMetierOutil(cle) ? cle : undefined;
    if (cible === undefined || (cible !== null && !estMetierOutil(cible)))
      throw new Error(
        `Métier inconnu : « ${cle} ». Ajoutez-le à la table de votre pages.mjs (métiers du site : ${IDS_METIERS.join(", ")}).`,
      );
    if (cible) vus.add(cible);
  }
  return IDS_METIERS.filter((id) => vus.has(id));
}
