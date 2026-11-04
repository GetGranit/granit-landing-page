#!/usr/bin/env node
// Pose seoTitle et metaDescription sur les pages déjà en ligne, sans rien toucher d'autre.
// Idempotent : à rejouer après un rebase si d'autres PR ont changé les mêmes fichiers.
// Usage : node scripts/seo-engine/titres-existants.mjs [--dry]
// --dry contrôle la table et liste les fichiers à changer, sans écrire.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TITRE_MAX, contientMotCle } from "./lib/checks.mjs";
import { CONTENU, RACINE, lireFile } from "./lib/site.mjs";

const META_MIN = 140;
const META_MAX = 160;

/** Articles de content/ressources : slug -> seoTitle, et metaDescription quand elle change. */
const ARTICLES = {
  // Fiches portails : l'intention de recherche est la connexion (Search Console, 24 au 30/10/2026).
  "portail-isante": { seoTitle: "iSanté TP : connexion à l'espace pro opticien" },
  "portail-almerys": { seoTitle: "Almerys TP : connexion à l'espace pro opticien" },
  "portail-santeclair": { seoTitle: "TP Santéclair : connexion à l'espace pro opticien" },
  "portail-actil": { seoTitle: "Actil TP : connexion à l'espace pro opticien" },
  "portail-itelis": { seoTitle: "Itelis TP : connexion à l'espace pro opticien" },
  "portail-seveane": { seoTitle: "Sévéane TP (Korelio) : connexion à l'espace pro opticien" },
  "portail-sp-sante": { seoTitle: "SP Santé TP : connexion à l'espace pro opticien" },
  "portail-viamedis": { seoTitle: "Viamédis TP : connexion à l'espace pro opticien" },
  // Portail fermé : le titre garde l'information de fermeture.
  "portail-oxantis": { seoTitle: "Oxantis TP a fermé le 26 octobre 2026 : passage à Viamedis" },
  "portails-tiers-payant": {
    seoTitle: "Portails de tiers payant pour opticiens : connexion et PEC",
    metaDescription:
      "Quel portail de tiers payant pour un opticien ? Trouvez le bon, ouvrez un compte, faites une prise en charge, traitez un rejet et suivez le paiement.",
  },
  "viamedis-espace-pro": {
    seoTitle: "Viamédis : créer son compte et accéder à l'espace pro",
    metaDescription:
      "Pour ouvrir votre espace pro Viamedis, créez un compte sur viamedispro.com, activez viamedis.net, réglez les blocages. Étapes et contacts vérifiés.",
  },
  "mutuelle-quel-portail": { seoTitle: "Numéro AMC, c'est quoi ? Trouver le portail de la mutuelle" },

  "audioprothese-renouvellement-tiers-payant": {
    seoTitle: "Renouvellement d'appareil auditif : la règle des 4 ans",
    metaDescription:
      "Un renouvellement d'appareil auditif n'est pris en charge qu'après 4 ans, oreille par oreille. Classe, période d'essai : les points qui évitent un refus.",
  },
  "checklist-prise-en-charge": {
    seoTitle: "Checklist prise en charge optique : 8 contrôles avant envoi",
    metaDescription:
      "Avant d'envoyer une prise en charge optique, suivez cette checklist : droits, portail, ordonnance, devis et pièces. Les 8 contrôles qui évitent le rejet.",
  },
  "codes-rejets-noemie": {
    seoTitle: "Codes rejets NOEMIE : liste, signification et action",
    metaDescription:
      "Où trouver la liste des codes rejets NOEMIE et leur libellé fiable ? Classez la cause, corrigez et relancez une facture rejetée, avec la méthode pas à pas.",
  },
  "dentaire-paniers-100-sante-tiers-payant": {
    seoTitle: "Panier 100 % Santé dentaire : sécuriser le tiers payant",
    metaDescription:
      "Sur un panier 100 % Santé dentaire, classez la prothèse et verrouillez le devis pour éviter le rejet. La méthode pour sécuriser votre tiers payant.",
  },
  "facturation-ehpad-controle-humain": { seoTitle: "Logiciel de facturation résident : garder la main en EHPAD" },
  "gerer-tiers-payant-magasin": { seoTitle: "Gestion du tiers payant : interne, externe ou automatisée ?" },
  "granit-vs-iremia": { seoTitle: "Granit ou Iremia Santé : lequel choisir pour votre magasin ?" },
  "integration-doctolib-lgo": {
    metaDescription:
      "Dans un centre de santé, des agents relient l'agenda Doctolib au logiciel métier, sans double saisie ni refonte. La méthode par paliers, contrôle gardé.",
  },
  "officine-balance-agee-tiers-payant": {
    seoTitle: "Créances tiers payant en pharmacie : solder la balance âgée",
    metaDescription:
      "Pour solder les créances tiers payant en pharmacie, triez la balance âgée par cause, puis traitez ARL négatifs, rejets et virements non lettrés à temps.",
  },
  "orthodontie-facturation-traitements-longs": { seoTitle: "Facturation orthodontie : fiabiliser les traitements longs" },
  "quand-relancer-mutuelle": { seoTitle: "Quand relancer une mutuelle ? Le calendrier par étape" },
  "recouvrement-patient-empathie": { seoTitle: "Recouvrement patient : relancer sans abîmer la relation" },
  "rejet-beneficiaire-inconnu": {
    seoTitle: "Rejet mutuelle « bénéficiaire inconnu » : que corriger ?",
    metaDescription:
      "Un rejet bénéficiaire inconnu de la mutuelle se corrige sans refacturer la part AMO : causes, correction pas à pas, preuves à garder et moment de relancer.",
  },
  "sesam-vitale-evolutions-2025": {
    metaDescription:
      "SESAM-Vitale 1.40 évolue avec l'appli carte Vitale, ADRi, les pièces numérisées et l'ordonnance numérique. Ce qui change pour votre facturation au quotidien.",
  },
  "tiers-payant-opticien": {
    seoTitle: "Tiers payant opticien : du devis à l'encaissement",
    metaDescription:
      "Le tiers payant opticien, étape par étape : AMO et mutuelle, prise en charge, devis 100 % Santé, paiement et rejets. Le circuit complet jusqu'à l'encaissement.",
  },
  "trois-boucles-pharmacie": { seoTitle: "Automatisation en pharmacie : ordonnances, rejets, réassort" },
  "virement-mutuelle-inferieur": {
    seoTitle: "Virement de mutuelle inférieur à la facture : que faire ?",
    metaDescription:
      "Votre virement de mutuelle est inférieur à la facture ? Comparez les trois montants, trouvez la cause de l'écart, gardez les preuves et sachez qui relancer.",
  },
};

/** Anciens articles de src/lib/articles.ts encore en ligne : slug -> seoTitle, et desc (leur meta) quand elle change. */
const ANCIENS = {
  "rapprochement-noemie": {
    seoTitle: "Rapprocher flux NOEMIE et virements bancaires chaque matin",
    desc: "En laboratoire, rapprocher chaque matin les flux NOEMIE et les virements bancaires réduit les écarts de caisse et donne une liste des dossiers bloquants.",
  },
  "groupes-multi-sites-pilotage": {
    seoTitle: "Groupes multi-sites : piloter tous ses centres",
    desc: "Centraliser les indicateurs, comparer les sites, recevoir des alertes consolidées : ce qu'une plateforme unifiée apporte au pilotage d'un groupe multi-sites.",
  },
  "logs-agent-sante": {
    seoTitle: "Ce qu'un agent IA doit journaliser en environnement de santé",
    desc: "Un agent IA sur des données de santé doit laisser une piste d'audit complète : traçabilité, rôles, conservation. Les exigences avant la mise en production.",
  },
  "ia-generative-sante-cadre": {
    seoTitle: "IA générative en santé : ce que la réglementation impose",
    desc: "RGPD, HDS, AI Act, MDR : quels textes s'appliquent vraiment à un agent IA administratif en établissement de santé, et lesquels ne le concernent pas.",
  },
  "hopital-prive-ordonnancement": {
    seoTitle: "Hôpital privé : ordonnancer les flux administratifs",
    desc: "Pré-admission, admission, séjour, sortie, facturation : comment aligner les agents IA sur le parcours du patient en hôpital privé plutôt que sur les services.",
  },
  "ia-vs-rpa-sante": {
    seoTitle: "IA agentique vs RPA : pourquoi le RPA a échoué en santé",
    desc: "Le RPA a déçu en santé : fragile aux changements d'interface, incapable de raisonner, coûteux à maintenir. Ce qui change avec des agents qui s'adaptent.",
  },
};

/** Pages métier de src/lib/ressources/verticales.json : metaDescription, séparée de la description affichée sur la page. */
const VERTICALES = {
  dentaire:
    "Comment sécuriser le tiers payant d'un cabinet ou d'un centre dentaire : paniers 100 % Santé, devis et facturation des traitements d'orthodontie.",
  centres:
    "Facturation, recouvrement et outils : des repères pour le back-office d'un centre de santé, d'un centre d'ophtalmologie ou d'un groupe multi-sites.",
  pharmacie:
    "Des repères pour le back-office d'une officine : solder les créances de tiers payant, traiter les rejets, préparer le réassort et saisir les ordonnances.",
  cliniques:
    "Des repères pour le back-office d'une clinique, d'un hôpital privé ou d'un laboratoire : admissions, rejets, retours NOEMIE et rapprochement des paiements.",
};

const dry = process.argv.includes("--dry");

function controlerTable() {
  const file = lireFile();
  const erreurs = [];
  const titres = new Map();
  const lignes = [
    ...Object.entries(ARTICLES).map(([slug, a]) => [slug, a.seoTitle, a.metaDescription]),
    ...Object.entries(ANCIENS).map(([slug, a]) => [slug, a.seoTitle, a.desc]),
    ...Object.entries(VERTICALES).map(([slug, meta]) => [slug, undefined, meta]),
  ];
  for (const [slug, titre, meta] of lignes) {
    if (titre) {
      if (titre.length > TITRE_MAX) erreurs.push(`${slug} : seoTitle de ${titre.length} caractères`);
      if (titres.has(titre)) erreurs.push(`${slug} : même seoTitle que ${titres.get(titre)}`);
      titres.set(titre, slug);
    }
    if (meta && (meta.length < META_MIN || meta.length > META_MAX)) erreurs.push(`${slug} : meta de ${meta.length} caractères`);
    if (/[—  ]/.test(`${titre}${meta}`) || /tiers-payant/i.test(`${titre}${meta}`)) erreurs.push(`${slug} : typographie`);
    const motCle = file.find((a) => a.slug === slug)?.primaryKeyword;
    if (titre && slug in ARTICLES && !contientMotCle(titre, motCle)) erreurs.push(`${slug} : seoTitle sans « ${motCle} »`);
    if (meta && slug in ARTICLES && !contientMotCle(meta, motCle)) erreurs.push(`${slug} : meta sans « ${motCle} »`);
  }
  if (erreurs.length) throw new Error(`Table refusée :\n- ${erreurs.join("\n- ")}`);
}

const formater = (a) => `${JSON.stringify(a, null, 2)}\n`;

/** Réécrit le JSON avec seoTitle juste après title. Refuse un fichier dont la mise en forme ne se relit pas à l'identique. */
function appliquerArticle(slug, { seoTitle, metaDescription }) {
  const chemin = join(CONTENU, `${slug}.json`);
  const avant = readFileSync(chemin, "utf8");
  const article = JSON.parse(avant);
  if (formater(article) !== avant) throw new Error(`${slug} : mise en forme inattendue, rien n'est écrit`);
  const sortie = {};
  for (const [cle, valeur] of Object.entries(article)) {
    if (cle === "seoTitle" && seoTitle) continue;
    sortie[cle] = cle === "metaDescription" && metaDescription ? metaDescription : valeur;
    if (cle === "title" && seoTitle) sortie.seoTitle = seoTitle;
  }
  const apres = formater(sortie);
  if (apres === avant) return false;
  if (!dry) writeFileSync(chemin, apres);
  return true;
}

/** Bloc français de src/lib/articles.ts : seoTitle juste après title, desc remplacée. */
function appliquerAnciens() {
  const chemin = join(RACINE, "src/lib/articles.ts");
  const avant = readFileSync(chemin, "utf8");
  const debut = avant.indexOf("fr: [");
  const fin = avant.indexOf("en: [");
  let fr = avant.slice(debut, fin);
  for (const [slug, { seoTitle, desc }] of Object.entries(ANCIENS)) {
    const motif = new RegExp(`(slug: "${slug}",\\n\\s*category: "[^"]+",\\n(\\s*)title: "[^"]+",\\n)(?:\\s*seoTitle: "[^"]+",\\n)?(\\s*desc: )("[^"]+")`);
    if (!motif.test(fr)) throw new Error(`${slug} : introuvable dans src/lib/articles.ts`);
    fr = fr.replace(motif, (_, tete, marge, cle, ancienne) =>
      `${tete}${marge}seoTitle: ${JSON.stringify(seoTitle)},\n${cle}${desc ? JSON.stringify(desc) : ancienne}`);
  }
  const apres = avant.slice(0, debut) + fr + avant.slice(fin);
  if (apres === avant) return false;
  if (!dry) writeFileSync(chemin, apres);
  return true;
}

/** Pose metaDescription juste après la description française de chaque métier, sans reformater le fichier. */
function appliquerVerticales() {
  const chemin = join(RACINE, "src/lib/ressources/verticales.json");
  const avant = readFileSync(chemin, "utf8");
  let apres = avant;
  for (const [slug, meta] of Object.entries(VERTICALES)) {
    const motif = new RegExp(`("${slug}": \\{[^}]*?"description": "[^"]+",\\n(\\s*))(?:"metaDescription": "[^"]+",\\n\\s*)?`);
    if (!motif.test(apres)) throw new Error(`${slug} : introuvable dans verticales.json`);
    apres = apres.replace(motif, (_, tete, marge) => `${tete}"metaDescription": ${JSON.stringify(meta)},\n${marge}`);
  }
  if (apres === avant) return false;
  if (!dry) writeFileSync(chemin, apres);
  return true;
}

controlerTable();
const changes = Object.entries(ARTICLES).filter(([slug, champs]) => appliquerArticle(slug, champs)).map(([slug]) => slug);
if (appliquerAnciens()) changes.push("src/lib/articles.ts");
if (appliquerVerticales()) changes.push("src/lib/ressources/verticales.json");
console.log(`${changes.length} fichier(s) ${dry ? "à changer" : "changé(s)"}${changes.length ? ` :\n- ${changes.join("\n- ")}` : ""}`);
