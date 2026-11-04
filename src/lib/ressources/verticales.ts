// Les métiers (verticales) des Ressources : première porte du hub, pages /ressources/metier/{v}.
// Les URL d'articles ne changent pas ; un article peut concerner plusieurs métiers.
// Pas d'import « @/… » ici : le plugin Vite lit aussi ce fichier.
import anciensData from "./anciens.json";
import data from "./verticales.json";
import type { CategorySlug, VerticaleSlug } from "./types";

type Lang = "fr" | "en";

export type Verticale = {
  slug: VerticaleSlug;
  nom: string;
  court: string;
  description: string;
  /** Texte alternatif de la photo (ce qu'on y voit). */
  alt: string;
  /** Catégorie dont on reprend les couleurs. */
  teinte: CategorySlug;
  /** Titre de la bande démo : seulement une capacité réelle de Granit pour ce métier. */
  agent: string;
};

/**
 * Textes alternatifs des photos (public/ressources/metiers/{métier}-800.jpg et -1600.jpg) :
 * ce qu'on voit sur l'image. À mettre à jour ici quand une photo change (puis npm run images).
 */
const ALTS: Record<VerticaleSlug, string> = {
  optique:
    "Lunettes en écaille posées sur un linge blanc, leur ombre projetée sur un mur terracotta",
  pharmacie:
    "Pilulier, plaquette de comprimés et sachet blanc sur un comptoir de pharmacie, croix verte allumée au fond",
  dentaire:
    "Moulage de mâchoire dentaire sur un plateau blanc, avec un miroir et une sonde de dentiste",
  centres:
    "Stéthoscope posé sur un bureau de consultation en bois, à côté d'un agenda de rendez-vous",
  cliniques:
    "Lit de clinique au soleil, couverture grise pliée, pied à perfusion et dossier médical sur pince",
};

const ALTS_EN: Record<VerticaleSlug, string> = {
  optique:
    "Tortoiseshell glasses resting on a white cloth, their shadow cast on a terracotta wall",
  audio:
    "Two behind-the-ear hearing aids resting on a cloth, next to their open charging case",
  pharmacie:
    "Pill organizer, blister pack and white paper bag on a pharmacy counter, green cross lit in the background",
  dentaire:
    "Dental jaw model on a white tray, with a dentist's mirror and probe",
  centres:
    "Stethoscope on a wooden consultation desk, next to an appointment book",
  cliniques:
    "Clinic bed in the sun, folded gray blanket, IV pole and medical chart on a clipboard",
  ehpad:
    "Green armchair by a window, wool throw, wooden cane, cup of tea, glasses and pill organizer on a small table",
  laboratoires:
    "Lab bench with a rack of color-capped sample tubes, gloves and a centrifuge",
};

/** Le métier principal : sa page est toujours indexée, quel que soit le nombre d'articles. */
export const VERTICALE_PRINCIPALE: VerticaleSlug = "optique";

export const ORDRE_VERTICALES = data.ordre as VerticaleSlug[];

type Textes = Pick<Verticale, "nom" | "court" | "description" | "agent">;

/** Un métier, avec ses textes en anglais si `lang` vaut "en" (champ `en` de verticales.json). */
export function verticale(slug: string, lang: Lang = "fr"): Verticale | undefined {
  const v = (
    data.verticales as Record<string, Omit<Verticale, "slug" | "alt"> & { en?: Textes }>
  )[slug];
  if (!v) return undefined;
  const { en, ...fr } = v;
  const s = slug as VerticaleSlug;
  return lang === "en" && en
    ? { slug: s, ...fr, ...en, alt: ALTS_EN[s] }
    : { slug: s, ...fr, alt: ALTS[s] };
}

/**
 * Anciennes pages métier fusionnées (redirection 301) : le métier qui les reprend,
 * ou `null` quand aucun ne convient (renvoi vers /ressources).
 */
export const FUSIONS = data.fusions as Record<string, VerticaleSlug | null>;

/** Métiers valides d'une liste qui peut porter d'anciens slugs (audio → optique…), sans doublon. */
export function normaliserVerticales(vs: string[]): VerticaleSlug[] {
  const cibles = vs.map((v) => (v in FUSIONS ? FUSIONS[v] : (v as VerticaleSlug)));
  return [...new Set(cibles.filter((v): v is VerticaleSlug => v !== null))];
}

export const VERTICALES: Verticale[] = ORDRE_VERTICALES.map((v) => verticale(v)!);

/** Les métiers dans l'ordre, dans la langue demandée. */
export const verticalesLang = (lang: Lang): Verticale[] =>
  ORDRE_VERTICALES.map((v) => verticale(v, lang)!);

/** Photo du métier : 800 ou 1600 px de large, 16:9. */
export const photoVerticale = (
  v: VerticaleSlug,
  largeur: 800 | 1600,
  ext: "jpg" | "webp" = "jpg",
) => `/ressources/metiers/${v}-${largeur}.${ext}`;

const anciens = data.anciens as Record<string, VerticaleSlug[] | "tous">;

/** Métiers d'un ancien article ; `transversal` s'il vaut pour tous. */
export function verticalesAncien(slug: string): {
  verticales: VerticaleSlug[];
  transversal: boolean;
} {
  const v = anciens[slug];
  if (v === "tous") return { verticales: [...ORDRE_VERTICALES], transversal: true };
  return { verticales: v ?? [], transversal: false };
}

/** Teinte de la carte d'un ancien article (étiquette, fond d'attente) : sa catégorie s'il est rattaché, sinon celle de son métier. */
export function teinteAncien(slug: string): CategorySlug {
  const rattache = (anciensData.rattaches as Record<string, CategorySlug>)[slug];
  if (rattache) return rattache;
  const v = anciens[slug];
  return Array.isArray(v) && v[0] ? verticale(v[0])!.teinte : "glossaire";
}
