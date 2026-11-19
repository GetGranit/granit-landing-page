// Les phrases de l'outil C, générées à partir du relevé (releve.mjs), sans rien inventer : chaque
// phrase reprend un fait de donnees.json (libellé, numéro AMC, métiers, dates, notes des sources).
//
// Les mêmes fonctions servent à pages.mjs (titres, descriptions, texte propre compté pour le seuil) et
// à serveur.ts (ce que la page affiche) : le texte compté est le texte rendu.
// Les gabarits viennent de outils-nuit/C/textes.md (§ 3), avec ses cas C1, C2 et C3.
import { formaterDate } from "../socle/texte.mjs";
import {
  COURT,
  LISTES,
  METIERS_C,
  NOMBRES,
  PROSE,
  RESTRICTIONS,
  capitale,
  domaineEnMinuscules,
  enumerer,
  fr,
  grouper,
  libellesDe,
  metiersSurs,
  principauxSurs,
  segmentsFermes,
} from "./releve.mjs";
import { NOMS_COURTS, SUJETS } from "./publication.mjs";

/** « de l’ », « du », « de la », « des » ; « à l’ », « au »… devant un métier avec son article. */
const DE = [
  ["l’", "de l’"],
  ["le ", "du "],
  ["la ", "de la "],
  ["les ", "des "],
];
const A = [
  ["l’", "à l’"],
  ["le ", "au "],
  ["la ", "à la "],
  ["les ", "aux "],
];
const contracter = (table, g) => {
  for (const [k, v] of table) if (g.startsWith(k)) return v + g.slice(k.length);
  return g;
};

/** « l’optique, le dentaire et la pharmacie ». @param {string[]} ms métiers de C */
export const metiersEnProse = (ms) => enumerer(ms.map((m) => PROSE[m]));

/**
 * Les façons de dire un ensemble de métiers dans une description, de la plus précise à la plus
 * courte : un ou deux métiers nommés ; trois et plus qui se suivent dans l'ordre du site :
 * « cinq métiers, du dentaire aux cliniques » ; sinon « {n} métiers ».
 * @param {string[]} ms
 */
export function quiMetiers(ms) {
  if (ms.length <= 2) return [metiersEnProse(ms)];
  const idx = ms.map((m) => METIERS_C.indexOf(m));
  const formes = [];
  if (idx.every((v, i) => v === idx[0] + i))
    formes.push(
      `${NOMBRES[ms.length]} métiers, ${contracter(DE, PROSE[ms[0]])} ${contracter(A, PROSE[ms.at(-1)])}`,
    );
  if (ms.length === 3) formes.push(metiersEnProse(ms));
  formes.push(`${NOMBRES[ms.length] ?? ms.length} métiers`);
  return formes;
}

/** Le nom, éventuellement court (NOMS_COURTS). */
const nomDe = (e, court = false) => (court && NOMS_COURTS[e.slug]) || e.mutuelle;

/**
 * Le nom en milieu de phrase, avec son article (« la Mutuelle SG »), et s'il est pluriel.
 * @returns {[string, boolean]}
 */
export function sujet(e, court = false) {
  const [s, pluriel] = SUJETS[e.slug] ?? [nomDe(e, court), false];
  if (court && NOMS_COURTS[e.slug])
    return [`${s.startsWith("la ") ? "la " : ""}${NOMS_COURTS[e.slug]}`, pluriel];
  return [s, pluriel];
}

/** « de Mutualia », « de la Mutuelle SG », « des Mutuelles du Soleil ». */
const deSujet = (e) => {
  const [s] = sujet(e);
  if (s.startsWith("la ")) return `de ${s}`;
  if (s.startsWith("les ")) return `des ${s.slice(4)}`;
  return /^[aeiouyhéâAEIOUYHÉ]/.test(s) ? `d’${s}` : `de ${s}`;
};

/** « celle d’iSanté », « celle de SP santé ». */
const de = (op) => (/^[aeiouyhAEIOUYHi]/.test(op) ? `d’${op}` : `de ${op}`);

/** Les opérateurs des métiers sûrs (fait principal), dans l'ordre : Map opérateur → métiers. */
export function parOperateur(faits) {
  const g = new Map();
  for (const f of principauxSurs(faits)) {
    if (!g.has(f.operateur)) g.set(f.operateur, []);
    g.get(f.operateur).push(f.metier);
  }
  return g;
}

/** Les sources des métiers sûrs (fait principal). */
const sourcesSures = (faits) => [...new Set(principauxSurs(faits).flatMap((f) => f.sourceIds))];

/** La date du relevé : la plus récente consultation des sources des métiers sûrs (JJ/MM/AAAA). */
export function dateReleve(faits, sources) {
  const ds = sourcesSures(faits)
    .map((id) => sources.get(id)?.consulte_le)
    .filter(Boolean)
    .sort();
  return ds.length ? formaterDate(ds.at(-1)) : null;
}

/** Le cas de textes.md § 3.1 : C1 un seul métier sûr, C2 un seul opérateur, C3 plusieurs. */
export function casDe(faits) {
  if (metiersSurs(faits).length === 1) return "C1";
  return parOperateur(faits).size === 1 ? "C2" : "C3";
}

const estIso = (d) => /^\d{4}-\d\d-\d\d/.test(d ?? "");

/** La première forme dont la longueur tient dans les bornes, sinon une erreur (le build s'arrête). */
export function forme(formes, min, max, quoi) {
  const ok = formes.find((f) => f.length >= min && f.length <= max);
  if (!ok) throw new Error(`${quoi} : aucune forme entre ${min} et ${max} caractères`);
  return ok;
}

/** Les formes du <title>, dans l'ordre (textes.md § 3.1) : chaque forme au nom complet, puis court. */
export function titres(e, faits) {
  const ms = metiersSurs(faits);
  const ops = [...parOperateur(faits).keys()];
  let formes;
  if (ms.length === 1)
    formes = [
      `{M} tiers payant ${COURT[ms[0]]} : quel portail ?`,
      `{M} : tiers payant ${COURT[ms[0]]}`,
    ];
  else if (ops.length === 1)
    formes = [
      `{M} tiers payant : ${ops[0]}, pour quels métiers ?`,
      `{M} tiers payant : ${ops[0]} par métier`,
      `{M} : tiers payant ${ops[0]}`,
    ];
  else
    formes = [
      "{M} tiers payant : le portail, métier par métier",
      "{M} tiers payant : portail par métier",
      "{M} : tiers payant par métier",
    ];
  return formes.flatMap((f) => [false, true].map((c) => fr(f.replace("{M}", nomDe(e, c)))));
}

/** Le H1 (textes.md § 3.1). */
export function h1(e, faits) {
  const ms = metiersSurs(faits);
  if (ms.length === 1) return fr(`${e.mutuelle} tiers payant en ${COURT[ms[0]]} : quel portail ?`);
  return fr(`${e.mutuelle} tiers payant : quel portail, métier par métier ?`);
}

const FINS_LISTE = [
  "Le libellé, le numéro AMC et que faire si la carte du patient diffère.",
  "Libellé, numéro AMC et que faire si la carte du patient diffère.",
  "Libellé, numéro AMC et que faire si la carte diffère.",
  "Le libellé et le numéro AMC à vérifier sur la carte.",
  "Libellé et numéro AMC à vérifier sur la carte.",
];
const FINS_PAGE = [
  "Ce qu’il faut vérifier sur la carte du patient, et que faire si elle diffère.",
  "Ce qu’il faut vérifier sur la carte, et que faire si elle diffère.",
  "Que vérifier sur la carte, et que faire si elle diffère.",
];

/** Les descriptions candidates, de la plus précise à la plus courte (textes.md § 3.2). */
export function descriptions(e, faits, sources) {
  const ops = parOperateur(faits);
  const d = dateReleve(faits, sources);
  const sids = sourcesSures(faits);
  const liste = sids.every((s) => Object.hasOwn(LISTES, s));
  const out = [];
  for (const court of [false, true]) {
    const [S, pluriel] = sujet(e, court);
    const Sm = capitale(S);
    const [figure, passe, indique] = pluriel
      ? ["figurent", "passent", "indiquent"]
      : ["figure", "passe", "indique"];
    if (ops.size === 1) {
      const [op, mm] = [...ops][0];
      for (const qui of quiMetiers(mm)) {
        let debuts;
        let fins;
        if (liste) {
          debuts = [
            `${Sm} ${figure} dans la liste publique ${op} pour ${qui} (relevé du ${d}).`,
            `${Sm} ${figure} dans la liste publique ${op} pour ${qui}, au ${d}.`,
          ];
          const k = libellesDe(principauxSurs(faits).filter((f) => mm.includes(f.metier))).length;
          const tous = libellesDe(faits.filter((f) => f.statut === "sur" && mm.includes(f.metier)));
          const n = Math.max(k, tous.length);
          fins =
            n <= 1
              ? FINS_LISTE
              : [
                  `Les ${NOMBRES[n] ?? n} libellés, leurs numéros AMC et que faire si la carte diffère.`,
                  `Les ${NOMBRES[n] ?? n} libellés et leurs numéros AMC, carte à l’appui.`,
                  "Libellés et numéros AMC à vérifier sur la carte.",
                ];
        } else {
          const src = sources.get([...sids].sort()[0]);
          debuts = estIso(src?.date_source)
            ? [
                `Selon ${src.editeur} (${formaterDate(src.date_source)}), ${S} ${passe} par ${op} pour ${qui}.`,
              ]
            : [`${Sm} ${indique} passer par ${op} pour ${qui} (page lue le ${d}).`];
          fins = FINS_PAGE;
        }
        for (const b of fins) for (const a of debuts) out.push(fr(`${a} ${b}`));
      }
    } else {
      const amcs = new Set(libellesDe(principauxSurs(faits)).map((l) => l.amc));
      const num = amcs.size > 1 ? "numéros AMC" : "numéro AMC";
      const variantes = [false, true].map((courtM) =>
        [...ops]
          .map(([op, mm]) => {
            const q = quiMetiers(mm);
            return `${op} pour ${courtM && mm.length > 2 ? q.at(-1) : q[0]}`;
          })
          .join(", "),
      );
      for (const v of variantes)
        for (const b of [
          `Libellés, ${num} et que faire si la carte diffère.`,
          `Libellés et ${num} à vérifier sur la carte.`,
          `Libellés et ${num}, carte à l’appui.`,
        ]) {
          const M = nomDe(e, court);
          for (const a of [
            `${M} : ${v}, d’après leurs listes publiques (${d}).`,
            `${M} : ${v} (listes publiques du ${d}).`,
          ])
            out.push(fr(`${a} ${b}`));
        }
    }
  }
  return out;
}

/** La seconde phrase de chaque réponse : la carte fait foi. */
export const PHRASE_CARTE = fr(
  "La carte de tiers payant du patient fait foi : elle désigne l’opérateur de chaque prestation.",
);

/** La réponse en deux phrases (textes.md § 3.3). */
export function reponse(e, faits, sources) {
  const ops = parOperateur(faits);
  const d = dateReleve(faits, sources);
  const sids = sourcesSures(faits);
  const [S, pluriel] = sujet(e);
  const figure = pluriel ? "figurent" : "figure";
  let un;
  if (ops.size === 1) {
    const [op, mm] = [...ops][0];
    const libs = libellesDe(faits.filter((f) => f.statut === "sur" && mm.includes(f.metier)));
    if (sids.every((s) => Object.hasOwn(LISTES, s))) {
      un =
        libs.length === 1
          ? `Pour ${metiersEnProse(mm)}, ${S} ${figure} dans la liste publique ${op} sous le libellé « ${libs[0].libelle} » (numéro AMC ${libs[0].amc}, relevé du ${d}).`
          : `Pour ${metiersEnProse(mm)}, ${S} ${figure} dans la liste publique ${op} sous ${NOMBRES[libs.length] ?? libs.length} libellés, chacun avec son numéro AMC (relevé du ${d}).`;
    } else {
      const s = sources.get([...sids].sort()[0]);
      un = estIso(s?.date_source)
        ? `Selon ${s.editeur} (${formaterDate(s.date_source)}), ${S} ${pluriel ? "passent" : "passe"} par ${op} pour ${metiersEnProse(mm)}.`
        : `${capitale(S)} ${pluriel ? "indiquent" : "indique"} passer par ${op} pour ${metiersEnProse(mm)} (page non datée, lue le ${d}).`;
    }
  } else {
    const parts = [...ops];
    un =
      `Pour ${metiersEnProse(parts[0][1])}, ${S} ${figure} dans la liste publique ${parts[0][0]}` +
      parts
        .slice(1)
        .map(([op, mm]) => ` ; pour ${metiersEnProse(mm)}, dans celle ${de(op)}`)
        .join("") +
      ` (relevé du ${d}).`;
  }
  return [fr(un), PHRASE_CARTE];
}

/** L'avertissement « fait foi » d'une page (textes.md § 3.3). */
export const avertissement = (e) =>
  fr(
    `Un opérateur relevé pour un métier ne veut pas dire que tous les contrats ${deSujet(e)} y passent : pour chaque dossier, suivez la carte de tiers payant du patient.`,
  );

/**
 * « pour la pharmacie et les laboratoires depuis le 21/12/2005 et pour le dentaire depuis le
 * 01/01/2025 » : les métiers d'un libellé, regroupés par date d'ouverture.
 */
function parDate(faits) {
  return enumerer(
    grouper(faits, (f) => f.depuis ?? "").map(
      (x) => `pour ${metiersEnProse(x.metiers)}${x.cle ? ` depuis le ${x.cle}` : ""}`,
    ),
  );
}

/**
 * Les phrases du relevé sûr d'une entrée, une par fait, fusionnées (cadre.md § 6, « textePropre ») :
 * une par couple (opérateur, libellé, numéro AMC) avec ses métiers et ses dates (plusieurs libellés
 * chez un même opérateur : une phrase d'introduction et un point de liste par libellé) ; une par ligne
 * de sous-domaine en plus ; une par segment fermé ; une par réseau de soins sûr ; les notes ; les notes
 * des sources hors des deux listes. Ces phrases sont rendues telles quelles sur la page.
 * @returns {{ releve: { phrase: string, items: string[] }[], restrictions: string[], fermes: string[], reseaux: string[], notes: string[], sources: string[] }}
 */
export function phrases(e, faits) {
  const surs = faits.filter((f) => f.statut === "sur");
  const deListe = surs.filter((f) => f.liste && f.segments);
  const [S, pluriel] = sujet(e);
  const releve = grouper(deListe, (f) => f.operateur).map(({ faits: fsOp }) => {
    const op = fsOp[0].operateur;
    const etat = fsOp[0].segments[0].etat;
    const couples = grouper(fsOp, (f) => `${f.libelle}|${f.amc}`);
    if (couples.length === 1) {
      const f = couples[0].faits[0];
      return {
        phrase: fr(
          `Dans la liste publique ${op} relevée le ${etat}, le libellé « ${f.libelle} » (numéro AMC ${f.amc}) est ouvert ${parDate(couples[0].faits)}.`,
        ),
        items: [],
      };
    }
    return {
      phrase: fr(
        `Dans la liste publique ${op} relevée le ${etat}, ${S} ${pluriel ? "figurent" : "figure"} sous ${NOMBRES[couples.length] ?? couples.length} libellés, chacun avec son numéro AMC.`,
      ),
      items: couples.map(({ faits: fs }) =>
        fr(`« ${fs[0].libelle} » (numéro AMC ${fs[0].amc}) : ouvert ${parDate(fs)}.`),
      ),
    };
  });
  const restrictions = [];
  for (const g of grouper(
    deListe.filter((f) => f.sousDomaines.length),
    (f) => `${f.operateur}|${f.avecLigneLibre}|${f.sousDomaines.join(",")}`,
  )) {
    const f = g.faits[0];
    const sd = enumerer(f.sousDomaines);
    restrictions.push(
      fr(
        f.avecLigneLibre
          ? `Pour ${metiersEnProse(g.metiers)}, la liste ${f.operateur} porte aussi une ligne réservée (${sd}) ; la ligne sans restriction couvre tout le métier.`
          : `Pour ${metiersEnProse(g.metiers)}, la liste ${f.operateur} n’ouvre que des lignes de sous-domaine : ${sd}.`,
      ),
    );
  }
  const fermes = segmentsFermes(e.segments_fermes).map((s) => {
    const doms = enumerer(
      s.domaines.map(domaineEnMinuscules).sort((a, b) => a.localeCompare(b, "fr")),
    );
    return fr(
      `Chez ${s.operateur}, ${s.domaines.length > 1 ? `les segments ${doms} du libellé « ${s.libelle} » sont fermés` : `le segment ${doms} du libellé « ${s.libelle} » est fermé`} depuis le ${s.date}.`,
    );
  });
  const reseaux = (e.reseau_soins ?? [])
    .filter((r) => r.statut === "sur")
    .map((r) => fr(r.note_verification));
  const notes = (e.notes ?? []).map(fr);
  const sources = [...new Set(surs.filter((f) => !f.liste).map((f) => fr(f.note)))];
  return { releve, restrictions, fermes, reseaux, notes, sources };
}

/** Le texte propre d'une entrée, tel que la page le rend (seuil de contenu du socle). */
export function textePropre(e, faits) {
  const p = phrases(e, faits);
  return [
    ...p.notes,
    ...p.releve.flatMap((b) => [b.phrase, ...b.items]),
    ...p.restrictions,
    ...p.sources,
    ...p.fermes,
    ...p.reseaux,
  ].join(" ");
}

/**
 * Ce qu'on écrit pour un fait « à vérifier » : l'opérateur, « à confirmer sur la carte » et la raison
 * (l'effet de la restriction pour un segment des listes, la note de la source sinon).
 */
export function raisonAConfirmer(f) {
  if (f.restriction && RESTRICTIONS[f.restriction]) return fr(RESTRICTIONS[f.restriction].effet);
  if (f.liste && f.suite) return fr(f.suite);
  return fr(f.note);
}
