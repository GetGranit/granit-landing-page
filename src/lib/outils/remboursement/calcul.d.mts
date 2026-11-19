// Types de calcul.mjs (tsconfig n'a pas allowJs).

/** Ce dont les calculs ont besoin d'une entrée de donnees.json. */
export type EntreeMontants = {
  metier: string;
  categorie: string;
  base_remboursement: number;
  taux_secu: number | null;
  rembourse_secu: number | null;
  ticket_moderateur: number | null;
  prix_limite: number | null;
  panier_100_sante: string | null;
  part_complementaire_au_prix_limite: number | null;
};

/** Un taux 2027 renseigné dans publication.mjs. */
export type TauxPublie = { taux: number; source_id: string };
export type Taux2027 = Record<string, TauxPublie | null>;

export type Regime = {
  etat: "en-vigueur" | "publie" | "non-publie";
  taux: number | null;
  sourceId: string | null;
  jusquau: string | null;
  depuis: string | null;
};

export type Montants = {
  base: number;
  prixLimite: number | null;
  panier: string | null;
  regime: Regime;
  secu: number | null;
  ticketModerateur: number | null;
  complementaireAuPrixLimite: number | null;
};

export type Plafond = { montant: number; objet: "monture" | "aide-auditive"; sourceId: string };

export type ResultatCalcul = {
  montants: Montants;
  prix: number | null;
  sousLaBase: boolean;
  resteApresSecu: number | null;
  responsable:
    | { type: "100-sante"; complementaire: number | null; resteACharge: number | null }
    | { type: "libre"; minimum: number | null }
    | { type: "inconnu" };
  plafond: Plafond | null;
  alerte: "au-dela-prix-limite" | null;
};

export function centimes(euros: number): number;
export function partSecu(base: number, taux: number): number;
export function poste2027(e: { metier: string; taux_secu: number | null }): string | null;
export function veille(iso: string): string;
export function regimeTaux(
  e: { metier: string; taux_secu: number | null },
  jour: string,
  taux2027: Taux2027,
  bascule: string,
): Regime;
export function montantsAffiches(
  e: EntreeMontants,
  jour: string,
  taux2027: Taux2027,
  bascule: string,
): Montants;
export function plafondContratResponsable(e: { categorie: string }): Plafond | null;
export function calculer(p: {
  entree: EntreeMontants;
  prix: number | null;
  jour: string;
  taux2027: Taux2027;
  bascule: string;
}): ResultatCalcul;
export function lirePrix(texte: string): number | null;
