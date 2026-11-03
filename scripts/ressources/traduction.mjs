// Versions anglaises de la rubrique Ressources (content/en/…), posées sur le français.
// Utilisé par le plugin Vite (scripts/ressources/vite-plugin.ts) ; testé dans tests/ressources-traduction.test.ts.
//
// Le français reste la référence : un fichier anglais ne fournit que des textes. Les champs
// structurels (slug, ids, catégorie, métiers, dates, plateforme, statuts lus par le code, URL,
// mots-clés) viennent toujours du français. Un fichier anglais absent, illisible ou incomplet :
// la page reste en français, avec un avertissement au build (jamais d'échec).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Un texte traduit. */
const T = "texte";
/** Une liste de paragraphes, de longueur libre (corps d'un ancien article). */
const PARAGRAPHES = "paragraphes";
/** Valeur d'un axe comparé : « oui », « non » et « non publié » sont lus par le code, jamais traduits. */
const AXE = "axe";
const VALEURS_AXE = new Set(["oui", "non", "non publié"]);

// Schémas : seuls les champs nommés sont pris dans le fichier anglais.
// Objet = champs à traduire ; [schéma] = liste de même longueur, élément par élément ;
// { "*": schéma } = dictionnaire, clé par clé.
export const SCHEMAS = {
  article: {
    title: T,
    metaDescription: T,
    contentHtml: T,
    categoryName: T,
    author: { jobTitle: T },
    reviewer: { jobTitle: T },
    tocItems: [{ label: T }],
    faqItems: [{ question: T, answer: T }],
    sources: [{ label: T }],
    figures: [
      {
        titre: T,
        legende: T,
        colonnes: [T],
        elements: [{ label: T, detail: T, valeurs: [T] }],
      },
    ],
  },
  // Le libellé d'un statut est le mot affiché par le portail (et lu par le code) : il reste tel quel.
  plateforme: {
    identite: [{ label: T, valeur: T }],
    chiffres: [{ valeur: T, label: T }],
    statuts: [{ sens: T, action: T }],
    contacts: [{ label: T, valeur: T, detail: T }],
    sources: { "*": { label: T } },
  },
  concurrent: {
    axes: { "*": { valeur: AXE, detail: T } },
    meilleurSi: [T],
    sources: { "*": { label: T } },
  },
  ancien: { category: T, title: T, desc: T, time: T, body: PARAGRAPHES },
};

const estTexte = (v) => typeof v === "string" && v.trim() !== "";
const estObjet = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/**
 * Pose les textes de `en` sur `fr` selon `schema`. Renvoie la valeur fusionnée et la liste des
 * problèmes (champ manquant, liste de longueur différente…). Un champ vide ou absent en français
 * n'est pas demandé en anglais.
 */
export function fusionner(fr, en, schema, chemin = "") {
  const problemes = [];
  const ici = chemin || "(racine)";
  if (fr === null || fr === undefined) return { valeur: fr, problemes };

  if (schema === T || schema === AXE) {
    if (typeof fr !== "string" || fr.trim() === "") return { valeur: fr, problemes };
    if (schema === AXE && VALEURS_AXE.has(fr)) return { valeur: fr, problemes };
    if (!estTexte(en)) problemes.push(`${ici} : texte manquant`);
    return { valeur: estTexte(en) ? en : fr, problemes };
  }

  if (schema === PARAGRAPHES) {
    if (!Array.isArray(en) || !en.length || !en.every(estTexte)) {
      problemes.push(`${ici} : paragraphes manquants`);
      return { valeur: fr, problemes };
    }
    return { valeur: en, problemes };
  }

  if (Array.isArray(schema)) {
    if (!Array.isArray(fr)) return { valeur: fr, problemes };
    if (!Array.isArray(en) || en.length !== fr.length) {
      problemes.push(
        `${ici} : ${Array.isArray(en) ? `${en.length} éléments au lieu de ${fr.length}` : "liste manquante"}`,
      );
      return { valeur: fr, problemes };
    }
    const valeur = fr.map((x, i) => {
      const r = fusionner(x, en[i], schema[0], `${chemin}[${i}]`);
      problemes.push(...r.problemes);
      return r.valeur;
    });
    return { valeur, problemes };
  }

  // Objet ou dictionnaire.
  if (!estObjet(fr)) return { valeur: fr, problemes };
  if (!estObjet(en)) {
    problemes.push(`${ici} : objet manquant`);
    return { valeur: fr, problemes };
  }
  const valeur = { ...fr };
  const cles = "*" in schema ? Object.keys(fr) : Object.keys(schema);
  for (const cle of cles) {
    if (!(cle in fr)) continue;
    const r = fusionner(fr[cle], en[cle], schema[cle] ?? schema["*"], chemin ? `${chemin}.${cle}` : cle);
    problemes.push(...r.problemes);
    valeur[cle] = r.valeur;
  }
  return { valeur, problemes };
}

/** Contrôles propres à un article : même slug, ancres du sommaire et marqueurs présents dans le HTML anglais. */
function controlerArticle(fr, en) {
  const problemes = [];
  if (en.slug !== fr.slug) problemes.push(`slug « ${en.slug} » au lieu de « ${fr.slug} »`);
  if (typeof en.contentHtml !== "string") return problemes;
  for (const t of fr.tocItems ?? []) {
    if (!new RegExp(`id=["']${t.id}["']`).test(en.contentHtml))
      problemes.push(`contentHtml : ancre id="${t.id}" absente (sommaire)`);
  }
  const marqueurs = [...(fr.contentHtml ?? "").matchAll(/data-(bloc|figure)=["']([a-z0-9-]+)["']/g)];
  for (const [, type, id] of marqueurs) {
    if (!new RegExp(`data-${type}=["']${id}["']`).test(en.contentHtml))
      problemes.push(`contentHtml : marqueur data-${type}="${id}" absent`);
  }
  return problemes;
}

/**
 * Traduit un objet français à partir de son fichier anglais, s'il existe.
 * Renvoie `{ valeur }` (fusion réussie), `{}` (pas de fichier : repli silencieux),
 * ou `{ avertissement }` (fichier illisible ou incomplet : repli français).
 */
export function traduire(fichier, fr, schema, controle) {
  if (!existsSync(fichier)) return {};
  let en;
  try {
    en = JSON.parse(readFileSync(fichier, "utf8"));
  } catch (e) {
    return { avertissement: `${fichier} : JSON illisible (${e.message})` };
  }
  if (!estObjet(en)) return { avertissement: `${fichier} : pas un objet JSON` };
  const r = fusionner(fr, en, schema);
  const problemes = [...(controle?.(fr, en) ?? []), ...r.problemes];
  if (problemes.length)
    return { avertissement: `${fichier} : repli sur le français\n  - ${problemes.join("\n  - ")}` };
  return { valeur: r.valeur };
}

/**
 * Toutes les versions anglaises du contenu en ligne.
 * - `articles`, `plateformes`, `concurrents` : objets français traduits, par slug (absents si pas de traduction valide) ;
 * - `anciens` : anciens articles de articles.ts traduits, par slug ({ slug, category, title, desc, time, body }) ;
 * - `avertissements` : un message par fichier écarté ; `lus` : fichiers à surveiller en dev.
 */
export function lireTraductions(racine, { articles, plateformes, concurrents }, anciensFr = []) {
  const en = (dossier, slug) => join(racine, "content/en", dossier, `${slug}.json`);
  const sortie = { articles: {}, plateformes: {}, concurrents: {}, anciens: {}, avertissements: [], lus: [] };
  const passer = (cible, dossier, slug, fr, schema, controle) => {
    const fichier = en(dossier, slug);
    sortie.lus.push(fichier);
    const r = traduire(fichier, fr, schema, controle);
    if (r.valeur) cible[slug] = r.valeur;
    if (r.avertissement) sortie.avertissements.push(r.avertissement);
  };
  for (const a of articles) passer(sortie.articles, "ressources", a.slug, a, SCHEMAS.article, controlerArticle);
  for (const [nom, p] of Object.entries(plateformes)) passer(sortie.plateformes, "plateformes", nom, p, SCHEMAS.plateforme);
  for (const [slug, c] of Object.entries(concurrents)) passer(sortie.concurrents, "concurrents", slug, c, SCHEMAS.concurrent);
  for (const a of anciensFr)
    passer(sortie.anciens, "anciens", a.slug, a, SCHEMAS.ancien, (fr, x) =>
      x.slug === fr.slug ? [] : [`slug « ${x.slug} » au lieu de « ${fr.slug} »`],
    );
  return sortie;
}
