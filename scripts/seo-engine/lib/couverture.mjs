// Bloc `couverture` d'un article : la scène que le site dessine (src/lib/ressources/couverture.ts).
// Écrit par la rédaction, dans la même réponse que l'article. Il ne bloque jamais la publication :
// un bloc refusé est retiré, avec un avertissement, et le site dessine sa scène générique.
import { texte as texteHtml } from "./html.mjs";

// Même liste que SCENES dans src/lib/ressources/couverture.ts (vérifié par couverture.test.mjs).
export const SCENES = {
  statuts: { min: 3, max: 4, usage: "des dossiers ou factures avec leur statut (ex. un rejet parmi des dossiers payés)" },
  frise: { min: 3, max: 5, usage: "des étapes dans l'ordre, dont une où ça se joue" },
  ecart: { min: 3, max: 3, usage: "attendu, reçu, écart (exactement 3 éléments dans cet ordre)" },
  paliers: { min: 3, max: 5, usage: "des tranches qui montent (ex. ancienneté, volumes)" },
  controles: { min: 3, max: 4, usage: "une liste de vérifications" },
  options: { min: 2, max: 3, usage: "2 ou 3 choix comparés ; celui que l'article met en avant en etat fait" },
  agenda: { min: 2, max: 2, usage: "deux outils reliés, un planning au-dessus (2 éléments : les deux outils)" },
  boucles: { min: 3, max: 3, usage: "trois sujets menés en parallèle" },
};

const LONGUEUR = { titre: 22, repere: 20, label: 20, badge: 14, accroche: 48, mot: 11 };
/** Scènes en colonnes : le libellé tient sur deux lignes, chaque mot doit y entrer. */
const EN_COLONNES = new Set(["frise", "paliers", "options", "boucles"]);

/** Les mots pleins d'un libellé, sans accents ni casse, pour les retrouver dans l'article. */
const mots = (t) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .match(/[a-z0-9]{3,}/g) ?? [];

/**
 * Erreurs d'un bloc. `texte` : le texte de l'article, `plateformes` : { slug: { nom, logo } }.
 * Un libellé doit venir de l'article ; un chiffre aussi : rien d'affiché qui n'y soit écrit.
 */
export function controlerCouverture(c, { texte, plateformes = {}, interdits = () => [] }) {
  const erreurs = [];
  const def = SCENES[c?.scene];
  if (!def) return [`scène inconnue : ${c?.scene}`];
  const elements = c.elements ?? [];
  if (elements.length < def.min || elements.length > def.max)
    erreurs.push(`${c.scene} : ${elements.length} éléments (${def.min} à ${def.max})`);

  const trop = (quoi, valeur, max) => {
    if ((valeur ?? "").length > max) erreurs.push(`${quoi} trop long : « ${valeur} » (${max} max)`);
    if (!(valeur ?? "").trim()) erreurs.push(`${quoi} vide`);
  };
  trop("titre", c.titre, LONGUEUR.titre);
  trop("repère", c.repere, LONGUEUR.repere);
  elements.forEach((e) => trop("libellé", e.label, LONGUEUR.label));
  if (EN_COLONNES.has(c.scene))
    for (const e of elements)
      for (const m of (e.label ?? "").split(/[\s'’-]+/))
        if (m.length > LONGUEUR.mot) erreurs.push(`mot trop long pour une colonne : « ${m} » (${LONGUEUR.mot} max)`);
  if (c.badge) trop("badge", c.badge, LONGUEUR.badge);
  const accroche = `${c.accroche?.debut ?? ""} ${c.accroche?.fin ?? ""}`.trim();
  trop("accroche", accroche, LONGUEUR.accroche);

  const article = new Set(mots(texte));
  for (const libelle of [c.titre, c.repere, ...elements.map((e) => e.label)]) {
    const absents = mots(libelle ?? "").filter((m) => !article.has(m));
    if (absents.length) erreurs.push(`« ${libelle} » : ${absents.join(", ")} absent de l'article`);
  }
  for (const n of accroche.match(/\d+/g) ?? [])
    if (!texte.includes(n)) erreurs.push(`accroche : ${n} absent de l'article`);
  for (const t of interdits([accroche, c.titre, c.repere].join(" ")))
    erreurs.push(`TON.md : ${t}`);

  if (c.marque) {
    const p = plateformes[c.marque];
    if (!p?.logo) erreurs.push(`marque sans logo : ${c.marque}`);
    else if (!mots(texte).includes(mots(p.nom)[0]))
      erreurs.push(`marque absente de l'article : ${p.nom}`);
  }
  const en = c.en;
  if (!en || (en.labels ?? []).length !== elements.length) erreurs.push("textes anglais incomplets");
  return erreurs;
}

/** Typographie française sur les textes affichés. */
const apostrophes = (c) => JSON.parse(JSON.stringify(c).replace(/(\p{L})'(\p{L})/gu, "$1’$2"));

/** L'accroche est une phrase : pas d'espace en trop, un point à la fin. */
function phrase({ debut, fin }) {
  const f = fin.trim();
  return { debut: debut.trim(), fin: /[.?!]$/.test(f) ? f : `${f}.` };
}

/** Le bloc à écrire dans l'article, ou null s'il est refusé (scène générique sur le site). */
export function retenirCouverture(c, contexte, avertir = () => {}) {
  if (!c) return null;
  const erreurs = controlerCouverture(c, contexte);
  if (!erreurs.length) return apostrophes({ ...c, accroche: phrase(c.accroche) });
  avertir(`couverture retirée (scène générique) : ${erreurs.join(" ; ")}`);
  return null;
}

/** Consigne de rédaction : `recentes` = scènes des derniers articles du thème, à ne pas répéter. */
export function consigneCouverture({ plateformes = {}, recentes = [] }) {
  const liste = Object.entries(SCENES)
    .map(([nom, s]) => `- ${nom} : ${s.usage}.`)
    .join("\n");
  const logos = Object.entries(plateformes)
    .filter(([, p]) => p.logo)
    .map(([slug, p]) => `${slug} (${p.nom})`)
    .join(", ");
  return (
    `## Couverture (champ couverture)\n` +
    `Le site dessine une fenêtre de logiciel qui montre l'idée de l'article d'un coup d'œil. Tu ne fournis que le contenu. Choisis la scène qui ne pourrait pas illustrer un autre article :\n${liste}\n` +
    (recentes.length ? `Évite si possible les dernières scènes de ce thème : ${recentes.join(", ")}.\n` : "") +
    `Règles :\n` +
    `- Chaque mot de titre, repere et label vient de l'article, dans les mots du métier. Aucun chiffre ni montant.\n` +
    `- titre : ${LONGUEUR.titre} caractères max ; repere : ${LONGUEUR.repere} ; label : ${LONGUEUR.label} ; badge : ${LONGUEUR.badge}, seulement pour frise, sinon null.\n` +
    `- frise, paliers, options, boucles : libellés courts, en colonnes, ${LONGUEUR.mot} lettres max par mot.\n` +
    `- etat : fait, attente ou alerte. Une seule alerte au plus, là où l'article porte le problème.\n` +
    `- marque : si l'article porte sur une mutuelle ou un portail de cette liste, son slug, sinon null. Son logo remplace le titre. Liste : ${logos}.\n` +
    `- accroche : la phrase de l'image de partage, ${LONGUEUR.accroche} caractères max en tout, coupée en debut et fin. La fin prend l'accent de couleur. Elle dit l'idée sans répéter le titre, au ton de TON.md.\n` +
    `- en : les mêmes textes en anglais, labels dans le même ordre.`
  );
}

/** Texte d'un article, pour contrôler les mots de la couverture. */
export const texteArticle = (a) =>
  [a.title, a.primaryKeyword, texteHtml(a.contentHtml ?? ""), ...(a.tocItems ?? []).map((t) => t.label)].join(" ");
