// Types de vues.mjs (tsconfig n'a pas allowJs). Les composants importent ces types (import type),
// jamais vues.mjs lui-même : il lit donnees.json.
import type { ContexteSite, GroupeHub, LigneHub, PageOutil, SourceDonnee } from "../socle/types";
import type { Taux2027 } from "./calcul.mjs";
import type { METIERS } from "./publication.mjs";

export type Paragraphe = { texte: string; source_ids: string[] };
export type Bandeau = {
  titre: string;
  texte: string;
  source_ids: string[];
  etat: "en-vigueur" | "publie" | "non-publie";
};
export type DetailsLigne = {
  lignes: { libelle: string; valeur: string }[];
  conditions: string | null;
  datation: string;
};
export type LigneRemboursement = LigneHub & { details: DetailsLigne | null };
export type OptionFacette = { valeur: string; libelle: string; compte: number };

/** Une ligne du tableau d'une page de groupe : ce que les montants demandent, rien d'autre. */
export type CodeAffiche = {
  code: string;
  ancre: string;
  libelle: string;
  designation: string;
  categorie: string;
  metier: string;
  type_code: string;
  base_remboursement: number;
  taux_secu: number | null;
  rembourse_secu: number | null;
  ticket_moderateur: number | null;
  prix_limite: number | null;
  panier_100_sante: string | null;
  part_complementaire_au_prix_limite: number | null;
  date_tarif: string | null;
  date_arrete: string | null;
  /** La phrase qui date ses montants (source, date d'effet, taux). */
  datation: string;
};

export type VueHub = {
  jour: string;
  hub: PageOutil;
  bandeau: Bandeau;
  datation: string;
  lignes: LigneRemboursement[];
  groupes: GroupeHub[];
  facettes: { domaine: OptionFacette[]; panier: OptionFacette[] };
  methode: { id: string; titre: string; paragraphes: Paragraphe[] }[];
  faitFoi: string;
  faq: { question: string; reponse: string }[];
  sources: SourceDonnee[];
  articles: string[];
  outilsLies: { id: string; texte: string }[];
  etatVide: {
    messages: Record<"fabricant" | "inconnu" | "ccam" | "cip" | "texte" | "page", string>;
    lienLpp: string;
    lienBdpm: string;
    articleDentaire: string | null;
    dentaireOuvert: boolean;
    pharmacieOuverte: boolean;
  };
};

export type VueEntreePage = {
  type: "page";
  jour: string;
  regle: { taux2027: Taux2027; bascule: string };
  page: PageOutil;
  groupe: { slug: string; nom: string; metier: string; surTitre: string };
  reponse: string[];
  essentiel: { libelle: string; valeur: string }[];
  intertitres: Record<"calcul" | "tableau" | "tranches" | "texte", string>;
  tranches: string;
  paragraphes: Paragraphe[];
  conditions: { communes: string[]; particulieres: { categories: string[]; textes: string[] }[] };
  limites: string;
  codes: CodeAffiche[];
  datation: string;
  faitFoi: string;
  bandeau: Bandeau;
  sources: SourceDonnee[];
  voisins: { chemin: string; titre: string; resume: string }[];
  articles: string[];
  outilsLies: { id: string; texte: string }[];
  publie: boolean;
};
export type VueEntree =
  VueEntreePage | { type: "redirection"; vers: string } | { type: "introuvable" };

type Options = {
  site: ContexteSite;
  jour: string;
  metiers?: typeof METIERS;
  taux2027?: Taux2027;
  bascule?: string;
};
export function aujourdhuiParis(maintenant?: Date): string;
export function vueHub(o: Options): VueHub;
export function vueEntree(slug: string, o: Options): VueEntree;
export function datation(
  e: unknown,
  jour: string,
  regle?: { taux2027?: Taux2027; bascule?: string },
): string;
export function bandeau2027(
  jour: string,
  regle?: { taux2027?: Taux2027; bascule?: string },
): Bandeau;
