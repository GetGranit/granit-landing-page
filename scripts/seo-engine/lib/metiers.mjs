// Fiches métier : le lecteur, le vocabulaire, les sources, ce que Granit fait et l'encart final
// changent selon le métier de l'article. Choix déterministe à partir du champ `verticales`
// de l'entrée de file (pas d'appel au modèle) :
// - une seule fiche concernée → cette fiche, en entier ;
// - plusieurs → le tronc (tronc.md) + l'essentiel de chaque fiche concernée.
// Les fiches vivent dans scripts/seo-engine/metiers/*.md, une section « ## » par rubrique.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const DOSSIER_METIERS = new URL("../metiers/", import.meta.url).pathname;

/** Verticale de la file (et du site) → fiche métier. L'audio partage la fiche optique, les laboratoires celle des cliniques. */
export const FICHE_DE_VERTICALE = {
  optique: "optique",
  audio: "optique",
  dentaire: "dentaire",
  centres: "centres",
  pharmacie: "pharmacie",
  cliniques: "cliniques",
  laboratoires: "cliniques",
};

export const FICHES = ["optique", "dentaire", "centres", "pharmacie", "cliniques"];

/** Rubriques de chaque fiche (titres « ## » exacts). */
export const RUBRIQUES = {
  lecteur: "Lecteur",
  vocabulaire: "Vocabulaire et sigles",
  situations: "Situations et irritants",
  sources: "Sources officielles autorisées",
  granit: "Ce que Granit fait pour ce métier",
  interdits: "Ne jamais promettre",
  encart: "Encart final",
  relecture: "Règles de relecture",
  signature: "Signature",
};

// Ce qu'on garde de chaque fiche dans un article multi-métiers (le tronc porte le reste)
const RUBRIQUES_RESUME = ["lecteur", "vocabulaire", "sources", "granit", "interdits"];

/**
 * Entrées publiées avant l'obligation de `verticales` : elles restent optique, explicitement.
 * Liste figée : aucune entrée ne s'y ajoute (test « verticales obligatoire »).
 */
export function heritageOptique() {
  return new Set(JSON.parse(readFileSync(join(DOSSIER_METIERS, "heritage-optique.json"), "utf8")).slugs);
}

/** Verticales d'une entrée de file. Sans `verticales`, seule une entrée de l'héritage retombe sur l'optique ; sinon erreur. */
export function verticalesDe(article, heritage = heritageOptique()) {
  if (article.verticales?.length) return article.verticales;
  if (heritage.has(article.slug)) return ["optique"];
  throw new Error(`« ${article.slug} » : champ verticales manquant (obligatoire, ex. ["dentaire"])`);
}

/** Sections « ## » d'une fiche : { titre: corps }. */
export function sections(md) {
  const out = {};
  for (const bloc of md.split(/^## /m).slice(1)) {
    const fin = bloc.indexOf("\n");
    out[bloc.slice(0, fin).trim()] = bloc.slice(fin + 1).trim();
  }
  return out;
}

const jsonDe = (corps) => {
  const m = corps?.match(/```json\n([\s\S]*?)\n```/);
  return m ? JSON.parse(m[1]) : null;
};

/** Fiche lue et découpée : texte, rubriques, encart et signature (blocs json), URL des sources. */
export function lireFiche(nom) {
  const md = readFileSync(join(DOSSIER_METIERS, `${nom}.md`), "utf8");
  const s = sections(md);
  const rub = Object.fromEntries(Object.entries(RUBRIQUES).map(([k, titre]) => [k, s[titre] ?? ""]));
  return {
    nom,
    titre: md.match(/^# (.+)$/m)?.[1] ?? nom,
    md,
    rub,
    encart: jsonDe(rub.encart),
    signature: jsonDe(rub.signature),
    sources: [...(rub.sources.matchAll(/https:\/\/[^\s)>|]+/g))].map((m) => m[0]),
  };
}

/**
 * Fiche(s) à charger pour une entrée de file.
 * @returns {{ verticales: string[], fiches: string[], tronc: boolean, optique: boolean }}
 */
export function choisirFiche(article, heritage = heritageOptique()) {
  const verticales = verticalesDe(article, heritage);
  const inconnues = verticales.filter((v) => !FICHE_DE_VERTICALE[v]);
  if (inconnues.length) throw new Error(`« ${article.slug} » : pas de fiche métier pour ${inconnues.join(", ")}`);
  const fiches = FICHES.filter((f) => verticales.some((v) => FICHE_DE_VERTICALE[v] === f));
  return { verticales, fiches, tronc: fiches.length > 1, optique: fiches.length === 1 && fiches[0] === "optique" };
}

/** Fiche qui porte l'encart, la signature et le lecteur : la fiche seule, ou le tronc. */
export function fichePrincipale(choix) {
  return lireFiche(choix.tronc ? "tronc" : choix.fiches[0]);
}

/** Bloc du message de rédaction : la fiche entière, ou le tronc + l'essentiel de chaque fiche. */
export function blocMetier(choix, { reader } = {}) {
  const role = reader ? `\nRôle du lecteur indiqué par la file : « ${reader} » (à lire dans le métier ci-dessous).` : "";
  if (!choix.tronc) {
    const f = lireFiche(choix.fiches[0]);
    return (
      `## Fiche métier : ${f.titre}\n` +
      `Cette fiche remplace tout ce que le guide dit « par défaut » du lecteur, des exemples, des sources et de Granit. ` +
      `Écris pour ce lecteur, avec ses mots.${role}\n\n${sansEncart(f.md)}`
    );
  }
  const t = lireFiche("tronc");
  const resumes = choix.fiches.map((nom) => {
    const f = lireFiche(nom);
    return `### ${f.titre}\n${RUBRIQUES_RESUME.map((k) => `#### ${RUBRIQUES[k]}\n${f.rub[k]}`).join("\n\n")}`;
  });
  return (
    `## Article multi-métiers (${choix.fiches.join(", ")})\n` +
    `Le lecteur n'est pas seulement l'opticien. Suis le tronc ci-dessous, puis prends tes exemples dans chacun des métiers résumés.${role}\n\n` +
    `${sansEncart(t.md)}\n\n## Métiers concernés (résumés)\n\n${resumes.join("\n\n")}`
  );
}

// L'encart est posé par la page, pas par le modèle : on ne l'envoie pas à la rédaction.
const sansEncart = (md) => md.replace(/^## Encart final\n[\s\S]*?(?=^## |(?![\s\S]))/m, "").trim();

/** Lecteur à nommer dans les consignes courtes (liens, relecture). */
export function lecteurCourt(choix) {
  const f = fichePrincipale(choix);
  return f.rub.lecteur.split("\n").find((l) => l.startsWith("**Lecteur :**"))?.replace("**Lecteur :**", "").trim().replace(/\.$/, "") ?? f.titre;
}

/** Encart de fin de la page (champ `encart` de l'article), null pour l'optique (encart de la catégorie). */
export function encartPour(choix) {
  return choix.optique ? null : fichePrincipale(choix).encart;
}

/** Signature imposée par la fiche (hors optique), sinon null : la catégorie décide. */
export function signaturePour(choix) {
  return choix.optique ? null : fichePrincipale(choix).signature;
}

/** URL des sources autorisées pour l'article : fiches concernées + tronc s'il y a lieu. */
export function sourcesAutorisees(choix) {
  const noms = [...choix.fiches, ...(choix.tronc ? ["tronc"] : [])];
  return [...new Set(noms.flatMap((n) => lireFiche(n).sources))];
}

const domaine = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Sources de l'article dont le domaine n'apparaît dans aucune source autorisée par les fiches (avertissement). */
export function sourcesHorsFiche(sources, choix) {
  const ok = new Set(sourcesAutorisees(choix).map(domaine));
  return sources.filter((s) => !ok.has(domaine(s.url))).map((s) => `source hors fiche métier : ${s.url}`);
}

/** Règles de relecture propres au métier (lecteur, interdits, règles de la fiche). */
export function reglesMetier(choix) {
  const noms = choix.tronc ? ["tronc", ...choix.fiches] : choix.fiches;
  return noms
    .map((n) => {
      const f = lireFiche(n);
      return `### Métier : ${f.titre}\n${f.rub.relecture}\n\nNe jamais promettre :\n${f.rub.interdits}`;
    })
    .join("\n\n");
}

const ANCIENS = JSON.parse(readFileSync(new URL("../../../src/lib/ressources/verticales.json", import.meta.url), "utf8")).anciens;

/**
 * Une page en ligne est-elle une cible de lien pour cet article ? En optique seule : toutes, comme avant.
 * Sinon, seulement les pages d'un métier commun (entrée de file) ou rattachées au métier (ancien article).
 */
export function cibleDuMetier(choix, { entree, ancien }, heritage = heritageOptique()) {
  if (choix.optique) return true;
  const fiches = entree
    ? choisirFiche(entree, heritage).fiches
    : ANCIENS[ancien] === "tous"
      ? FICHES
      : (ANCIENS[ancien] ?? []).map((v) => FICHE_DE_VERTICALE[v]);
  return fiches.some((f) => choix.fiches.includes(f));
}
