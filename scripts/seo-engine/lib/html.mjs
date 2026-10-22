// Lecture du HTML renvoyé par Claude : liste blanche du gabarit (section 5),
// extraction du texte, des H2 et des liens. Sans dépendance.

const MARQUEURS = ["chiffres", "organismes", "statuts", "contacts"];

/** Marqueurs data-bloc attendus (une fois chacun) selon le type de page (gabarit §6 et §6 bis). */
export const MARQUEURS_PAR_TYPE = {
  plateforme: MARQUEURS,
  vs: ["coup-doeil", "frise", "choisir"],
  grille: ["frise", "modeles", "grille"],
};

const DIV_CLASSES = new Set(["key-takeaways", "callout callout--warn", "callout callout--tip", "tbl"]);

// balise -> attributs autorisés (class est vérifiée à part)
const BALISES = {
  p: [], strong: [], em: [], ul: [], li: [], h3: [],
  a: ["href"], h2: ["id"], ol: ["class"], div: ["class", "data-bloc", "data-figure"],
  table: [], thead: [], tbody: [], tr: [], th: [], td: [],
  blockquote: [], cite: [],
};

const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
const ATTR_RE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"/g;

function attrs(raw) {
  const out = {};
  for (const m of raw.matchAll(ATTR_RE)) out[m[1].toLowerCase()] = m[2];
  // un attribut sans guillemets ou sans valeur ne passe pas la regex : on le signale
  const reste = raw.replace(ATTR_RE, "").replace(/\/\s*$/, "").trim();
  if (reste) out.__invalide = reste;
  return out;
}

/** Balises, attributs et classes hors de la section 5 du gabarit. */
export function horsListeBlanche(html, { plateforme = false, marqueurs = plateforme ? MARQUEURS : [] } = {}) {
  const fautes = [];
  for (const m of html.matchAll(TAG_RE)) {
    const nom = m[1].toLowerCase();
    const ferme = m[0].startsWith("</");
    if (!(nom in BALISES)) {
      fautes.push(`balise <${nom}> interdite`);
      continue;
    }
    if (ferme) continue;
    const a = attrs(m[2]);
    if (a.__invalide) fautes.push(`<${nom}> : attribut mal formé « ${a.__invalide} »`);
    for (const cle of Object.keys(a)) {
      if (cle === "__invalide") continue;
      if (!BALISES[nom].includes(cle)) fautes.push(`<${nom}> : attribut ${cle} interdit`);
    }
    if (nom === "ol" && a.class !== undefined && a.class !== "steps") fautes.push(`<ol class="${a.class}"> interdit`);
    if (nom === "div") {
      if (a["data-figure"] !== undefined) {
        if (Object.keys(a).length > 1) fautes.push("<div data-figure> : aucun autre attribut");
      } else if (a["data-bloc"] !== undefined) {
        if (!marqueurs.length) fautes.push(`marqueur data-bloc="${a["data-bloc"]}" hors page plateforme ou comparatif`);
        else if (!marqueurs.includes(a["data-bloc"])) fautes.push(`marqueur data-bloc="${a["data-bloc"]}" inconnu`);
      } else if (!DIV_CLASSES.has(a.class ?? "")) {
        fautes.push(`<div class="${a.class ?? ""}"> interdit`);
      }
    }
  }
  return [...new Set(fautes)];
}

const ENTITES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };

export function texte(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITES[e] ?? " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function mots(t) {
  return t.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m));
}

export function h2s(html) {
  return [...html.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)].map((m) => ({
    id: attrs(m[1]).id ?? "",
    texte: texte(m[2]),
  }));
}

export function liens(html) {
  return [...html.matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: m[1],
    ancre: texte(m[2]),
  }));
}

export function compteMarqueur(html, nom) {
  return (html.match(new RegExp(`data-bloc="${nom}"`, "g")) ?? []).length;
}

export { MARQUEURS };

/** minuscules, sans accents, ponctuation -> espace */
export function normalise(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
