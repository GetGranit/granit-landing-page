// Calculs de l'outil B · Remboursement : fonctions pures, les mêmes au rendu serveur, dans le
// navigateur (le calcul d'une page de groupe) et dans les tests. Aucune donnée ici : chaque fonction
// reçoit l'entrée de donnees.json et la date du jour.
//
// Tout vient de formules.md (outils-nuit/B), et seulement de ce qui y est sourcé :
// - Sécu = base × taux, arrondi au centime le plus proche (§ 1, § 6) ; ticket modérateur = base − Sécu ;
// - 100 % Santé : la complémentaire d'un contrat responsable prend prix − Sécu jusqu'au prix limite,
//   reste à charge nul (R871-2, § 2) ; au-delà du prix limite, le produit n'est plus facturable en
//   100 % Santé ;
// - tarif libre : le contrat responsable couvre au moins le ticket modérateur (R871-2 1°) ; plafonds
//   affichés : monture 100 €, aide auditive classe II 1 700 € (R871-2 3° et 4°) ; aucun plafond pour
//   les verres (correspondance simples / complexes ↔ codes LPP non sourcée) ;
// - panier inconnu (appairage, verres teintés, freinateurs) : aucune part de la complémentaire ;
// - au 01/01/2027 (décrets n° 2026-809, 810, 811) : sans taux publié, aucun montant Sécu.
// Jamais : franchise, participation forfaitaire, ALD, C2S (non sourcés ou hors cas général).

/** Centimes entiers d'un montant en euros (9,75 → 975). @param {number} euros */
export const centimes = (euros) => Math.round(euros * 100);

/**
 * Part de la Sécurité sociale : base × taux, arrondie au centime le plus proche (formules.md § 6),
 * calculée en centimes entiers pour éviter les erreurs de virgule flottante.
 * @param {number} base en euros
 * @param {number} taux en % (60)
 */
export function partSecu(base, taux) {
  return Math.round((centimes(base) * taux) / 100) / 100;
}

/** Différence de deux montants, au centime exact. */
const moins = (a, b) => (centimes(a) - centimes(b)) / 100;

/**
 * Le poste de R160-5 dont dépend le taux 2027 d'une entrée, ou null si les décrets d'août 2026 ne le
 * changent pas (médicaments à 65 % et 100 %).
 * @param {{ metier: string, taux_secu: number | null }} e
 */
export function poste2027(e) {
  if (e.metier === "optique" || e.metier === "audio") return "lpp";
  if (e.metier === "dentaire") return "dentaire";
  if (e.metier === "pharmacie" && e.taux_secu === 30) return "medicament_30";
  if (e.metier === "pharmacie" && e.taux_secu === 15) return "medicament_15";
  return null;
}

/** Source du taux en vigueur avant la bascule, par métier (donnees.json, `sources`). */
const SOURCE_TAUX = {
  optique: "ameli-taux",
  audio: "ameli-taux",
  dentaire: "ameli-taux",
  pharmacie: "bdpm-cis-cip",
};

/** La veille d'une date ISO (« 2027-01-01 » → « 2026-12-31 »). @param {string} iso */
export function veille(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Le taux de la Sécurité sociale qui s'applique à une entrée un jour donné.
 * - `en-vigueur` : le taux de donnees.json (lu sur ameli) ; `jusquau` = veille de la bascule si un
 *   décret d'août 2026 le change ;
 * - `publie` : après la bascule, le taux 2027 renseigné dans publication.mjs (TAUX_2027) ;
 * - `non-publie` : après la bascule, taux 2027 encore inconnu : aucun montant Sécu.
 * @param {{ metier: string, taux_secu: number | null }} e
 * @param {string} jour AAAA-MM-JJ (Europe/Paris)
 * @param {Record<string, { taux: number, source_id: string } | null>} taux2027
 * @param {string} bascule AAAA-MM-JJ
 */
export function regimeTaux(e, jour, taux2027, bascule) {
  const poste = poste2027(e);
  if (!poste || jour < bascule)
    return {
      etat: "en-vigueur",
      taux: e.taux_secu,
      sourceId: SOURCE_TAUX[e.metier],
      jusquau: poste ? veille(bascule) : null,
      depuis: null,
    };
  const t = taux2027?.[poste];
  if (!t) return { etat: "non-publie", taux: null, sourceId: null, jusquau: null, depuis: bascule };
  return { etat: "publie", taux: t.taux, sourceId: t.source_id, jusquau: null, depuis: bascule };
}

/**
 * Les montants qu'une page affiche pour une entrée, un jour donné (cadre.md § 6.1).
 * Avant la bascule : les montants de donnees.json tels quels (`rembourse_secu`, pas recalculé).
 * Après, taux publié : recalculés avec ce taux. Après, taux non publié : Sécu, ticket modérateur et
 * part de la complémentaire à null (la page écrit « taux 2027 non publié »).
 * @param {import("./calcul.d.mts").EntreeMontants} e
 * @param {string} jour AAAA-MM-JJ
 * @param {Record<string, { taux: number, source_id: string } | null>} taux2027
 * @param {string} bascule AAAA-MM-JJ
 */
export function montantsAffiches(e, jour, taux2027, bascule) {
  const regime = regimeTaux(e, jour, taux2027, bascule);
  const base = e.base_remboursement;
  const prixLimite = e.prix_limite ?? null;
  const panier = e.panier_100_sante ?? null;
  let secu = null;
  let ticketModerateur = null;
  if (regime.etat === "en-vigueur") {
    secu = e.rembourse_secu;
    ticketModerateur = e.ticket_moderateur;
  } else if (regime.etat === "publie") {
    secu = partSecu(base, regime.taux);
    ticketModerateur = moins(base, secu);
  }
  const complementaireAuPrixLimite =
    panier === "100-sante" && prixLimite !== null && secu !== null
      ? regime.etat === "en-vigueur" && e.part_complementaire_au_prix_limite != null
        ? e.part_complementaire_au_prix_limite
        : moins(prixLimite, secu)
      : null;
  return { base, prixLimite, panier, regime, secu, ticketModerateur, complementaireAuPrixLimite };
}

/**
 * Plafond de prise en charge d'un contrat responsable, part Sécu et ticket modérateur compris
 * (R871-2, formules.md § 2), seulement là où il est sourcé et rattaché sans ambiguïté à un code :
 * monture de classe B (100 €, 3°) et aide auditive de classe II (1 700 € par aide, 4°). Jamais pour
 * un verre.
 * @param {{ categorie: string }} e
 * @returns {{ montant: number, objet: "monture" | "aide-auditive", sourceId: string } | null}
 */
export function plafondContratResponsable(e) {
  if (e.categorie === "monture adulte classe B" || e.categorie === "monture enfant classe B")
    return { montant: 100, objet: "monture", sourceId: "css-r871-2" };
  if (e.categorie.startsWith("aide auditive classe II "))
    return { montant: 1700, objet: "aide-auditive", sourceId: "css-r871-2" };
  return null;
}

/**
 * Le calcul d'une page de groupe pour un code et un prix facturé (cadre.md § 6.1, textes.md § 3.7).
 * `prix` : nombre en euros, ou null si le champ est vide.
 * @param {{ entree: import("./calcul.d.mts").EntreeMontants, prix: number | null, jour: string,
 *           taux2027: Record<string, { taux: number, source_id: string } | null>, bascule: string }} p
 */
export function calculer({ entree, prix, jour, taux2027, bascule }) {
  const m = montantsAffiches(entree, jour, taux2027, bascule);
  const prixValide = typeof prix === "number" && Number.isFinite(prix) && prix >= 0 ? prix : null;
  // En dessous de la base, la règle de prise en charge n'est pas dans les sources lues.
  const sousLaBase = prixValide !== null && centimes(prixValide) < centimes(m.base);
  const resteApresSecu =
    prixValide !== null && !sousLaBase && m.secu !== null ? moins(prixValide, m.secu) : null;
  const auDelaPrixLimite =
    m.panier === "100-sante" &&
    m.prixLimite !== null &&
    prixValide !== null &&
    centimes(prixValide) > centimes(m.prixLimite);

  /** Ce qu'un contrat responsable doit au moins (formules.md § 2). */
  let responsable;
  if (m.panier === "100-sante")
    responsable = {
      type: "100-sante",
      // La part de la complémentaire n'est donnée que si le prix est dans le 100 % Santé.
      complementaire: resteApresSecu !== null && !auDelaPrixLimite ? resteApresSecu : null,
      resteACharge: auDelaPrixLimite ? null : 0,
    };
  else if (m.panier === "libre") responsable = { type: "libre", minimum: m.ticketModerateur };
  else responsable = { type: "inconnu" };

  return {
    montants: m,
    prix: prixValide,
    sousLaBase,
    resteApresSecu,
    responsable,
    plafond: m.panier === "libre" ? plafondContratResponsable(entree) : null,
    alerte: auDelaPrixLimite ? "au-dela-prix-limite" : null,
  };
}

/**
 * Lit un prix saisi (« 32,50 », « 32.5 », « 32,50 € ») ; null si vide ou illisible.
 * @param {string} texte
 */
export function lirePrix(texte) {
  const t = String(texte ?? "")
    .replace(/[\s\u00a0\u202f€]/g, "")
    .replace(",", ".");
  if (!t) return null;
  if (!/^\d+(?:\.\d{0,2})?$/.test(t)) return null;
  return Number(t);
}
