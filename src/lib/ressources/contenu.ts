// Le contenu de la rubrique Ressources, vu par le site :
// articles JSON en ligne (fournis par le plugin, aperçu compris hors production)
// et anciens articles de articles.ts, rattachés ou non à une catégorie du cocon.
// Anglais : les textes viennent de content/en/ (plugin) et des champs `en` de categories.json
// et verticales.json ; sans traduction, le français reste affiché.
import {
  anciensEn,
  couverturesAnciens,
  charger,
  chargerAncienEn,
  chargerEn,
  fiches as fichesJson,
  redirections,
} from "virtual:ressources";
import { articles, type Article } from "@/lib/articles";
import type { Lang } from "@/lib/i18n";
import categoriesData from "./categories.json";
import anciensData from "./anciens.json";
import type { CategorySlug, Fiche, VerticaleSlug } from "./types";
import {
  ORDRE_VERTICALES,
  teinteAncien,
  verticale,
  verticalesAncien,
  type Verticale,
} from "./verticales";

export type Categorie = {
  slug: CategorySlug;
  nom: string;
  court: string;
  ink: string;
  tint: string;
  description: string;
  agent: string;
  /** Titre de l'encart de fin d'article (CtaAgent.tsx). */
  fin: string;
  /** Ce que l'agent montre en animation : saisie de PEC, contrôle avant envoi ou virements. */
  animation: "pec" | "controle" | "virements";
};

type TextesCategorie = Pick<Categorie, "nom" | "court" | "description" | "agent" | "fin">;
const CATS = categoriesData.categories as Record<
  CategorySlug,
  Omit<Categorie, "slug"> & { en?: TextesCategorie }
>;
export const ORDRE = categoriesData.ordre as CategorySlug[];
/** Catégories qui ont une rangée sur le hub (le glossaire a son propre bloc). */
export const ORDRE_HUB = ORDRE.filter((c) => c !== "glossaire");
export const GLOSSAIRE_SLUG = "glossaire-tiers-payant";

/** Une catégorie, avec ses textes en anglais si `lang` vaut "en". */
export function categorie(slug: string, lang: Lang = "fr"): Categorie | undefined {
  const c = CATS[slug as CategorySlug];
  if (!c) return undefined;
  const { en, ...fr } = c;
  return { slug: slug as CategorySlug, ...fr, ...(lang === "en" ? en : undefined) };
}

export function descriptionCategorie(c: Categorie, lang: Lang = "fr"): string {
  return (
    c.description +
    (lang === "en" ? categoriesData.suffixeDescriptionEn : categoriesData.suffixeDescription)
  );
}

const rattaches = anciensData.rattaches as Record<string, CategorySlug>;

function ficheAncien(a: Article): Fiche {
  const rattache = rattaches[a.slug];
  const en = anciensEn[a.slug];
  return {
    slug: a.slug,
    category: rattache ?? teinteAncien(a.slug),
    title: a.title,
    readTime: a.time,
    metaDescription: a.desc,
    pillar: false,
    wave: 99,
    ancien: true,
    preview: false,
    ...verticalesAncien(a.slug),
    // Hors cocon, la carte porte le métier de l'ancien article (« Pharmacie »), pas une catégorie.
    etiquette: rattache ? undefined : a.category,
    rattache: Boolean(rattache),
    couverture: couverturesAnciens[a.slug],
    en: en && {
      title: en.title,
      metaDescription: en.desc,
      etiquette: rattache ? undefined : en.category,
      readTime: en.time,
    },
  };
}

/** Textes d'un ancien article dans la langue de l'écran (content/en/anciens), sinon le français. */
export function textesAncien(a: Article, lang: Lang): Pick<Article, "category" | "title" | "desc" | "time"> {
  const en = lang === "en" ? anciensEn[a.slug] : undefined;
  return en ?? a;
}

/** La fiche dans la langue de l'écran : ses textes anglais s'ils existent, sinon le français. */
export function ficheLang(f: Fiche, lang: Lang): Fiche {
  if (lang !== "en" || !f.en) return f;
  const { en } = f;
  return {
    ...f,
    title: en.title,
    metaDescription: en.metaDescription ?? f.metaDescription,
    etiquette: en.etiquette ?? f.etiquette,
    readTime: en.readTime ?? f.readTime,
  };
}

/** Slug de l'article qui remplace cet ancien article, s'il est en ligne (redirection 301). */
export function remplacant(slug: string): string | undefined {
  return redirections[slug];
}

/** Tous les anciens articles FR encore en ligne (sans les remplacés), dans l'ordre de articles.ts. */
const anciensFr: Fiche[] = articles.fr
  // remplacés (301) ou réécrits par le moteur à la même adresse (refonte) : on n'affiche que le nouveau
  .filter((a) => !redirections[a.slug] && !fichesJson.some((f) => f.slug === a.slug))
  .map(ficheAncien);

/** Anciens articles FR rattachés à une catégorie du cocon. */
const anciensRattaches: Fiche[] = anciensFr.filter((f) => f.rattache);

/** Articles JSON en ligne (aperçu compris hors production). */
export const fichesCocon: Fiche[] = fichesJson;

export function ficheJson(slug: string): Fiche | undefined {
  return fichesCocon.find((f) => f.slug === slug);
}

export async function chargerArticle(slug: string) {
  const f = charger[slug];
  return f ? (await f()).default : undefined;
}

/** Chargeurs des versions anglaises (absents quand il n'y a pas de traduction valide). */
export const chargeurEn = (slug: string) => chargerEn[slug];
export const chargeurAncienEn = (slug: string) => chargerAncienEn[slug];

export function categorieDeAncien(slug: string, lang: Lang = "fr"): Categorie | undefined {
  return rattaches[slug] ? categorie(rattaches[slug], lang) : undefined;
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
export function categoriesActives(lang: Lang = "fr"): Categorie[] {
  return ORDRE_HUB.filter((c) => toutCategorie(c).length > 0).map((c) => categorie(c, lang)!);
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
  [...fichesCocon].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")).forEach(ajouter);
  anciensRattaches.forEach(ajouter);
  return choix;
}

/** Une fiche, qu'elle vienne du JSON ou d'un ancien article rattaché. */
export function ficheEnLigne(slug: string): Fiche | undefined {
  return ficheJson(slug) ?? anciensRattaches.find((f) => f.slug === slug);
}

/** Titre court : la partie avant « : » (« : » en anglais). */
export function titreCourt(t: string): string {
  return t.split(/ ?: /)[0];
}

/** Coupe un titre au « : » (ou après un « ? » suivi d'une suite) pour l'italique coloré. */
export function couperTitre(t: string): [string, string | undefined] {
  const m = t.match(/^(.+?)(?: ?: |(?<=\?) )(.+)$/);
  return m ? [m[1], m[2]] : [t, undefined];
}

const MOIS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];
const MOIS_LONGS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** « 2026-10-07 » → « 7 oct. 2026 » (ou « 7 octobre 2026 » en version longue). */
export function dateFr(iso: string | undefined, longue = false): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const mois = (longue ? MOIS_LONGS : MOIS)[Number(m[2]) - 1];
  return `${Number(m[3])} ${mois} ${m[1]}`;
}

/** Comme dateFr, en anglais américain : « Oct 7, 2026 » (« October 7, 2026 » en version longue). */
export function dateLang(iso: string | undefined, lang: Lang, longue = false): string {
  if (lang === "fr") return dateFr(iso, longue);
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const mois = (longue ? MONTHS_LONG : MONTHS)[Number(m[2]) - 1];
  return `${mois} ${Number(m[3])}, ${m[1]}`;
}

/** Jour et mois seulement : « 7 oct. » / « Oct 7 ». */
export function jourMois(iso: string | undefined, lang: Lang): string {
  return lang === "en"
    ? dateLang(iso, lang).replace(/, \d{4}$/, "")
    : dateFr(iso).replace(/ \d{4}$/, "");
}

export function tempsLecture(t: number | string): string {
  return typeof t === "number" ? `${t} min` : t;
}

/** Articles propres à un métier (hors transversaux) : JSON, puis anciens articles. */
export function fichesVerticale(v: VerticaleSlug): Fiche[] {
  const parTri = (a: Fiche, b: Fiche) =>
    Number(b.pillar) - Number(a.pillar) || a.wave - b.wave || parTitre(a, b);
  return [
    ...fichesCocon.filter((f) => f.verticales.includes(v)).sort(parTri),
    ...anciensFr.filter((f) => !f.transversal && f.verticales.includes(v)),
  ];
}

/** Anciens articles valables pour tous les métiers. */
export const fichesTransversales: Fiche[] = anciensFr.filter((f) => f.transversal);

/** Tous les métiers, dans l'ordre, avec leur nombre d'articles propres. */
export function verticalesActives(lang: Lang = "fr") {
  return ORDRE_VERTICALES.map((v) => ({ v: verticale(v, lang)!, n: fichesVerticale(v).length }));
}

/**
 * Métier d'un article pour le fil d'Ariane et l'onglet actif : son premier métier.
 * Aucun pour un ancien article valable pour tous les métiers, ni pour un article sorti
 * de toutes les pages métier (surcharge vide, ex. l'article EHPAD).
 */
export function metierDe(slug: string, lang: Lang = "fr"): Verticale | undefined {
  const f = ficheJson(slug);
  if (f) return f.verticales[0] ? verticale(f.verticales[0], lang) : undefined;
  const a = verticalesAncien(slug);
  return a.transversal || !a.verticales[0] ? undefined : verticale(a.verticales[0], lang);
}
