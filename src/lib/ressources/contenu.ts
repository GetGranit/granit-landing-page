// Le contenu de la rubrique Ressources, vu par le site :
// articles JSON en ligne (fournis par le plugin, aperçu compris hors production)
// et anciens articles de articles.ts, rattachés ou non à une catégorie du cocon.
import { charger, fiches as fichesJson } from "virtual:ressources";
import { articles, type Article } from "@/lib/articles";
import categoriesData from "./categories.json";
import anciensData from "./anciens.json";
import type { CategorySlug, Fiche } from "./types";

export type Categorie = {
  slug: CategorySlug;
  nom: string;
  court: string;
  ink: string;
  tint: string;
  description: string;
  agent: string;
};

const CATS = categoriesData.categories as Record<CategorySlug, Omit<Categorie, "slug">>;
export const ORDRE = categoriesData.ordre as CategorySlug[];
/** Catégories qui ont une rangée sur le hub (le glossaire a son propre bloc). */
export const ORDRE_HUB = ORDRE.filter((c) => c !== "glossaire");
export const GLOSSAIRE_SLUG = "glossaire-tiers-payant";

export function categorie(slug: string): Categorie | undefined {
  const c = CATS[slug as CategorySlug];
  return c ? { slug: slug as CategorySlug, ...c } : undefined;
}

export function descriptionCategorie(c: Categorie): string {
  return c.description + categoriesData.suffixeDescription;
}

const rattaches = anciensData.rattaches as Record<string, CategorySlug>;

function ficheAncien(a: Article, category: CategorySlug): Fiche {
  return {
    slug: a.slug,
    category,
    title: a.title,
    readTime: a.time,
    metaDescription: a.desc,
    pillar: false,
    wave: 99,
    ancien: true,
    preview: false,
  };
}

/** Anciens articles FR rattachés au cocon, dans l'ordre de articles.ts. */
const anciensRattaches: Fiche[] = articles.fr
  .filter((a) => rattaches[a.slug])
  .map((a) => ficheAncien(a, rattaches[a.slug]));

/** Les 14 anciens articles hors cocon, dans l'ordre de la spec (audioprothèse d'abord). */
export const autresMetiers: Article[] = anciensData.autresMetiers
  .map((s) => articles.fr.find((a) => a.slug === s))
  .filter((a): a is Article => Boolean(a));

/** Articles JSON en ligne (aperçu compris hors production). */
export const fichesCocon: Fiche[] = fichesJson;

export function ficheJson(slug: string): Fiche | undefined {
  return fichesCocon.find((f) => f.slug === slug);
}

export async function chargerArticle(slug: string) {
  const f = charger[slug];
  return f ? (await f()).default : undefined;
}

export function categorieDeAncien(slug: string): Categorie | undefined {
  return rattaches[slug] ? categorie(rattaches[slug]) : undefined;
}

const parTitre = (a: Fiche, b: Fiche) => a.title.localeCompare(b.title, "fr");

/** Articles d'une catégorie : pilier, puis par vague, puis par titre. Sans les anciens. */
export function fichesCategorie(c: CategorySlug): Fiche[] {
  return fichesCocon
    .filter((f) => f.category === c)
    .sort((a, b) => Number(b.pillar) - Number(a.pillar) || a.wave - b.wave || parTitre(a, b));
}

export function anciensDeCategorie(c: CategorySlug): Fiche[] {
  return anciensRattaches.filter((f) => f.category === c);
}

/** Tout ce qu'une catégorie montre, anciens articles rattachés en dernier. */
export function toutCategorie(c: CategorySlug): Fiche[] {
  return [...fichesCategorie(c), ...anciensDeCategorie(c)];
}

/** Catégories qui ont au moins un article en ligne (onglets, pages catégorie, sitemap). */
export function categoriesActives(): Categorie[] {
  return ORDRE_HUB.filter((c) => toutCategorie(c).length > 0).map((c) => categorie(c)!);
}

export function glossaireEnLigne(): Fiche | undefined {
  return ficheJson(GLOSSAIRE_SLUG);
}

/** Fiches plateformes (portail-*) en ligne, par nom. */
export function fichesPlateformes(): Fiche[] {
  return fichesCocon
    .filter((f) => f.category === "plateformes" && f.slug.startsWith("portail-"))
    .sort((a, b) =>
      (a.plateforme?.nom ?? a.title).localeCompare(b.plateforme?.nom ?? b.title, "fr"),
    );
}

const A_LA_UNE = [
  "tiers-payant-opticien",
  "portail-viamedis",
  "rejet-tiers-payant",
  "portails-tiers-payant",
  "rapprochement-bancaire-tiers-payant",
  "gerer-tiers-payant-magasin",
  "conformite-opticien",
];

/**
 * « À la une » : les 5 premiers en ligne de la liste fixe, complétés par les articles
 * du cocon les plus récemment mis à jour, puis par les anciens articles rattachés.
 */
export function aLaUne(): Fiche[] {
  const choix: Fiche[] = [];
  const ajouter = (f: Fiche | undefined) => {
    if (f && choix.length < 5 && !choix.some((x) => x.slug === f.slug)) choix.push(f);
  };
  A_LA_UNE.forEach((s) => ajouter(ficheJson(s)));
  [...fichesCocon]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .forEach(ajouter);
  anciensRattaches.forEach(ajouter);
  return choix;
}

/** Une fiche, qu'elle vienne du JSON ou d'un ancien article rattaché. */
export function ficheEnLigne(slug: string): Fiche | undefined {
  return ficheJson(slug) ?? anciensRattaches.find((f) => f.slug === slug);
}

/** Titre court : la partie avant « : ». */
export function titreCourt(t: string): string {
  return t.split(" : ")[0];
}

/** Coupe un titre au « : » (ou après un « ? » suivi d'une suite) pour l'italique coloré. */
export function couperTitre(t: string): [string, string | undefined] {
  const m = t.match(/^(.+?)(?: : |(?<=\?) )(.+)$/);
  return m ? [m[1], m[2]] : [t, undefined];
}

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const MOIS_LONGS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « 2026-10-07 » → « 7 oct. 2026 » (ou « 7 octobre 2026 » en version longue). */
export function dateFr(iso: string | undefined, longue = false): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const mois = (longue ? MOIS_LONGS : MOIS)[Number(m[2]) - 1];
  return `${Number(m[3])} ${mois} ${m[1]}`;
}

export function tempsLecture(t: number | string): string {
  return typeof t === "number" ? `${t} min` : t;
}
