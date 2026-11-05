// Types de la rubrique d'actualités. Contrat du fichier : content/actualites/{slug}.json.
import type { VerticaleSlug } from "../ressources/types";

export type Format = "ce-qui-change" | "le-reflexe" | "le-controle" | "le-releve";
export type Statut = "brouillon" | "publie";

export type SourceEdition = { libelle: string; url: string; primaire: boolean };
export type Relecteur = { nom: string; date: string };
export type ChiffreReleve = { valeur: string; libelle: string };

export type QuiEdition = {
  texte: string;
  tableau?: { entetes: string[]; lignes: string[][] };
};

/** Le fichier JSON. Le slug vient du nom de fichier. Tout est en texte brut, sans HTML. */
export type EditionJson = {
  numero: number;
  format: Format;
  /** Le grand fait d'ouverture : « 1er janvier 2027 », « 72 h ». */
  fait: string;
  titre: string;
  /** 60 caractères au plus. */
  seoTitle: string;
  chapo: string;
  /** 120 à 160 caractères pour publier. */
  metaDescription: string;
  metiers: VerticaleSlug[];
  datePublished: string;
  dateModified: string;
  change: string[];
  qui: QuiEdition;
  gestes: string[];
  inconnu: string[];
  sources: SourceEdition[];
  /** null tant qu'aucune personne n'a relu : une édition sans relecteur ne se publie pas. */
  relecteur: Relecteur | null;
  statut: Statut;
  /** Requis pour le format le-releve, interdit sinon. */
  chiffres?: ChiffreReleve[];
  /** Notes de travail, jamais affichées. Doit être vide pour publier. */
  reste_a_verifier?: string[];
};

/** Ce que reçoit le site : sans notes de travail, avec le slug. */
export type Edition = Omit<EditionJson, "reste_a_verifier"> & { slug: string };

/** De quoi faire une carte ou le bloc du relevé, sans le corps. */
export type FicheEdition = Pick<
  Edition,
  | "slug"
  | "numero"
  | "format"
  | "fait"
  | "titre"
  | "chapo"
  | "metiers"
  | "datePublished"
  | "dateModified"
  | "statut"
  | "chiffres"
> & {
  /** Temps de lecture, en minutes. */
  lecture: number;
};
