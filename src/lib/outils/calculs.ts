/**
 * Calculs des deux outils gratuits pour opticiens (lead magnets LinkedIn) :
 * /outils/tri-des-marques et /outils/heures-de-decembre.
 *
 * Pas d'import TanStack ni React ici : le module est testé tel quel par
 * node --test, et le serveur refait les mêmes calculs avant d'écrire le mail
 * (on ne fait jamais confiance aux totaux envoyés par le navigateur).
 */

/* ------------------------------------------------------------------ */
/* Tri des marques                                                     */
/* ------------------------------------------------------------------ */

export type LigneMarque = {
  nom: string;
  /** Pièces en stock aujourd'hui. */
  stock: number;
  /** Pièces vendues sur les 12 derniers mois. */
  ventes: number;
  /** Prix d'achat moyen d'une pièce, en euros. */
  prixAchat: number;
  /** Marge en %, facultative : elle ne change pas le verdict, elle ajoute une remarque. */
  marge?: number | null;
};

export type Verdict = "garder" | "reduire" | "sortir";

export type ResultatMarque = LigneMarque & {
  /** Mois nécessaires pour écouler le stock au rythme des 12 derniers mois ; Infinity sans vente. */
  moisDeStock: number;
  /** Part de la marque dans les ventes saisies, de 0 à 1. */
  partDesVentes: number;
  /** Pièces au-delà de 12 mois de ventes, au prix d'achat. */
  argentQuiDort: number;
  verdict: Verdict;
  /** Vrai quand une marque lente marge nettement mieux que la moyenne de l'opticien. */
  margeARegarder: boolean;
};

export type ResultatTri = {
  lignes: ResultatMarque[];
  argentQuiDort: number;
  compte: Record<Verdict, number>;
  /** La marque qui immobilise le plus d'argent, s'il y en a une. */
  pire: ResultatMarque | null;
};

/**
 * Seuils de la grille, en mois de stock. Ils viennent des règles citées par les
 * opticiens en commentaire du post d'origine (rotation, stock dormant) ; ils
 * sont affichés sur la page et restent à faire valider par quelqu'un du métier.
 */
export const SEUIL_GARDER = 6;
export const SEUIL_SORTIR = 12;
/** Une marque lente est signalée quand sa marge dépasse la moyenne de l'opticien de cet écart. */
export const ECART_MARGE = 5;
export const MAX_MARQUES = 30;

const positif = (n: unknown) => {
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? v : 0;
};

/** Le nom d'une marque tel qu'on accepte de le réécrire dans un mail : court, sans balise ni lien. */
export function nettoyerNom(nom: unknown, repli: string): string {
  const propre = String(nom ?? "")
    .replace(/[^\p{L}\p{N} &'’.\-+]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
  return propre || repli;
}

export function trierMarques(saisie: LigneMarque[]): ResultatTri {
  const lignes = saisie
    .slice(0, MAX_MARQUES)
    .map((l, i) => ({
      nom: nettoyerNom(l.nom, `Marque ${i + 1}`),
      stock: Math.round(positif(l.stock)),
      ventes: Math.round(positif(l.ventes)),
      prixAchat: positif(l.prixAchat),
      marge: l.marge == null ? null : Math.min(100, positif(l.marge)),
    }))
    .filter((l) => l.stock > 0 || l.ventes > 0);

  const totalVentes = lignes.reduce((s, l) => s + l.ventes, 0);
  const marges = lignes.map((l) => l.marge).filter((m): m is number => m != null && m > 0);
  const margeMoyenne = marges.length >= 2 ? marges.reduce((s, m) => s + m, 0) / marges.length : null;

  const compte: Record<Verdict, number> = { garder: 0, reduire: 0, sortir: 0 };
  let pire: ResultatMarque | null = null;

  const resultats = lignes.map((l): ResultatMarque => {
    const moisDeStock = l.ventes > 0 ? l.stock / (l.ventes / 12) : Infinity;
    const verdict: Verdict =
      moisDeStock < SEUIL_GARDER ? "garder" : moisDeStock <= SEUIL_SORTIR ? "reduire" : "sortir";
    const argentQuiDort = Math.max(0, l.stock - l.ventes) * l.prixAchat;
    const r: ResultatMarque = {
      ...l,
      moisDeStock,
      partDesVentes: totalVentes > 0 ? l.ventes / totalVentes : 0,
      argentQuiDort,
      verdict,
      margeARegarder:
        verdict !== "garder" &&
        margeMoyenne != null &&
        l.marge != null &&
        l.marge >= margeMoyenne + ECART_MARGE,
    };
    compte[verdict] += 1;
    if (argentQuiDort > 0 && (!pire || argentQuiDort > pire.argentQuiDort)) pire = r;
    return r;
  });

  return {
    lignes: resultats,
    argentQuiDort: resultats.reduce((s, r) => s + r.argentQuiDort, 0),
    compte,
    pire,
  };
}

/* ------------------------------------------------------------------ */
/* Heures de décembre                                                  */
/* ------------------------------------------------------------------ */

export type SaisieHeures = {
  /** Ventes par semaine, tous magasins confondus. */
  ventesParSemaine: number;
  /** Part des ventes en tiers payant, en %. */
  partTiersPayant: number;
  /** Minutes passées par dossier : l'estimation de l'opticien, on n'affirme aucune moyenne. */
  minutesParDossier: number;
  semaines: number;
};

export type ResultatHeures = {
  dossiers: number;
  heures: number;
  /** Heures traduites en dimanches de travail d'une personne. */
  dimanches: number;
};

/** Un dimanche travaillé compte pour 7 heures d'une personne (hypothèse affichée sur la page). */
export const HEURES_PAR_DIMANCHE = 7;

export function compterHeures(s: SaisieHeures): ResultatHeures {
  const part = Math.min(100, positif(s.partTiersPayant)) / 100;
  const dossiers = positif(s.ventesParSemaine) * part * Math.min(52, positif(s.semaines));
  const heures = (dossiers * Math.min(240, positif(s.minutesParDossier))) / 60;
  return { dossiers, heures, dimanches: heures / HEURES_PAR_DIMANCHE };
}

/** Semaines entières ou entamées entre `jour` et le 25 décembre de la même année (au moins 1). */
export function semainesAvantNoel(jour: Date): number {
  const noel = new Date(jour.getFullYear(), 11, 25);
  const jours = (noel.getTime() - jour.getTime()) / 86_400_000;
  return Math.max(1, Math.ceil(jours / 7));
}

/* ------------------------------------------------------------------ */
/* Écriture des nombres, à la française                                */
/* ------------------------------------------------------------------ */

/** 13595 → « 13 595 € » (espaces insécables). */
export function euros(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR")} €`;
}

/** 17.72 → « 17,7 » ; Infinity → « aucune vente ». */
export function mois(n: number): string {
  return Number.isFinite(n) ? n.toFixed(1).replace(".", ",") : "aucune vente";
}

/** 7.2 → « 7 dimanches » ; 0.6 → « un demi-dimanche » ; au demi près sous 10. */
export function dimanchesEnMots(n: number): string {
  if (n < 0.25) return "moins d’un demi-dimanche";
  if (n < 0.75) return "un demi-dimanche";
  const arrondi = n < 10 ? Math.round(n * 2) / 2 : Math.round(n);
  return `${String(arrondi).replace(".", ",")} dimanche${arrondi >= 2 ? "s" : ""}`;
}
