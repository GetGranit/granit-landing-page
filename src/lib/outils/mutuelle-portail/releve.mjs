// Lecture du relevé de l'outil C (mutuelle → portail de tiers payant), à partir de donnees.json.
//
// ESM pur, sans dépendance hors du socle : lu par pages.mjs (sitemap, tests, worker) et par serveur.ts.
// Jamais importé par une route ni par un composant (le navigateur ne reçoit que ce que la page affiche).
//
// Les listes publiques SP santé et iSanté ne sont aujourd'hui que dans `note_verification`, sous une
// forme fixe écrite par le script de data-C :
//   Libellé « X » (n° AMC N), segment « S » de la liste publique OP (état au JJ/MM/AAAA) : ligne sans
//   restriction active depuis le JJ/MM/AAAA ; ligne « SOUS-DOMAINE » active depuis le JJ/MM/AAAA.
//   [effet de la restriction.] Ne vaut que pour une carte qui désigne OP.[ suite]
// plusieurs segments étant séparés par « Autre segment : ». `lireSegments` relit cette forme ; le test
// propre à C exige que 100 % des notes des deux listes soient lues.
import { versMetiers } from "../socle/metiers.mjs";
import { normaliser } from "../socle/texte.mjs";

/** Les 7 métiers de C, dans l'ordre du relevé (donnees.json). */
export const METIERS_C = Object.freeze([
  "optique",
  "audio",
  "dentaire",
  "pharmacie",
  "centre-de-sante",
  "laboratoire",
  "hospitalisation",
]);

/** Métiers de C → métiers du site (socle.md § 5) : audio va avec l'optique, labo et clinique ensemble. */
export const TABLE_METIERS = {
  audio: "optique",
  "centre-de-sante": "centres",
  laboratoire: "cliniques",
  hospitalisation: "cliniques",
};

/** Libellé d'une ligne de tableau (« Clinique » = établissement hospitalier privé ou ESPIC). */
export const NOM_METIER = {
  optique: "Optique",
  audio: "Audio",
  dentaire: "Dentaire",
  pharmacie: "Pharmacie",
  "centre-de-sante": "Centre de santé",
  laboratoire: "Laboratoire",
  hospitalisation: "Clinique",
};

/** Le métier dans une phrase, avec son article. */
export const PROSE = {
  optique: "l’optique",
  audio: "l’audioprothèse",
  dentaire: "le dentaire",
  pharmacie: "la pharmacie",
  "centre-de-sante": "les centres de santé",
  laboratoire: "les laboratoires",
  hospitalisation: "les cliniques",
};

/** Le métier dans un titre (« Mutualia tiers payant optique : quel portail ? »). */
export const COURT = {
  optique: "optique",
  audio: "audio",
  dentaire: "dentaire",
  pharmacie: "pharmacie",
  "centre-de-sante": "centres de santé",
  laboratoire: "laboratoire",
  hospitalisation: "clinique",
};

/** Les deux listes publiques par domaine : identifiant de source → opérateur. */
export const LISTES = { "sp-liste-amc": "SP santé", "isante-liste-amc": "iSanté" };

/** Les restrictions de sous-domaine (champ `restriction`) : ce qu'on écrit à côté de l'opérateur. */
export const RESTRICTIONS = {
  "stomatologue uniquement": {
    court: "réservé aux stomatologues",
    effet:
      "Segment réservé aux stomatologues (spécialité 18) : il ne vaut ni pour un chirurgien-dentiste ni pour un centre dentaire.",
    // Un segment stomatologue ne vaut jamais pour un chirurgien-dentiste ni pour un centre dentaire :
    // il ne donne pas la facette « dentaire » du hub.
    sansFacette: true,
  },
  "consultations externes uniquement": {
    court: "consultations externes seulement",
    effet:
      "Segment limité aux actes de consultation externe : il ne vaut pas pour un séjour en clinique.",
    sansFacette: false,
  },
  "frais de séjour uniquement": {
    court: "frais de séjour seulement",
    effet:
      "Segment limité aux frais de séjour : les consultations externes ne sont pas couvertes par ce segment.",
    sansFacette: false,
  },
};

/** Sous-domaine tel que la liste l'écrit → ce qu'on affiche. */
const SOUS_DOMAINES = {
  "UNIQUEMENT STOMATOLOGUE (18)": "stomatologues",
  "POUR ACTES DE CONSULTATION EXTERNE": "consultations externes",
  "POUR FRAIS DE SEJOUR": "frais de séjour",
};

/** Nombres écrits en lettres (titres, descriptions, réponses). */
export const NOMBRES = { 2: "deux", 3: "trois", 4: "quatre", 5: "cinq", 6: "six", 7: "sept" };

/**
 * Typographie française d'un texte affiché : espace insécable avant « : ; ? ! » et dans « »,
 * apostrophe typographique. Ne touche ni aux adresses (« https:// » n'a pas d'espace avant « : »).
 * @param {string} t
 */
export function fr(t) {
  return String(t ?? "")
    .replace(/ ([:;?!])/g, " $1")
    .replace(/« /g, "« ")
    .replace(/ »/g, " »")
    .replace(/'/g, "’");
}

/** Première lettre en capitale. @param {string} t */
export const capitale = (t) => (t ? t[0].toUpperCase() + t.slice(1) : t);

/** « a, b et c ». @param {string[]} xs */
export function enumerer(xs) {
  if (xs.length <= 1) return xs[0] ?? "";
  return `${xs.slice(0, -1).join(", ")} et ${xs.at(-1)}`;
}

const SEGMENT =
  /^Libellé « ([^»]+) » \(n° AMC (\d+)\), segment « ([^»]+) » de la liste publique (SP santé|iSanté) \(état au (\d\d\/\d\d\/\d{4})\) : (.+?)\.(?: (.*?))? Ne vaut que pour une carte qui désigne (SP santé|iSanté)\.(?: (.*))?$/;
const LIGNE = /^ligne (?:sans restriction|« ([^»]+) ») active depuis le (\d\d\/\d\d\/\d{4})$/;

/**
 * Relit la note d'un segment des listes SP santé ou iSanté. Renvoie null si la note n'a pas la forme
 * attendue (le test propre à C l'interdit pour les deux listes).
 * @param {string} note
 */
export function lireSegments(note) {
  const segments = [];
  for (const morceau of String(note ?? "").split(" Autre segment : ")) {
    const m = morceau.match(SEGMENT);
    if (!m || m[4] !== m[8]) return null;
    const lignes = [];
    for (const l of m[6].split(" ; ")) {
      const ml = l.match(LIGNE);
      if (!ml) return null;
      lignes.push({ sousDomaine: ml[1] ?? null, depuis: ml[2] });
    }
    segments.push({
      libelle: m[1],
      amc: m[2],
      segment: m[3],
      operateur: m[4],
      etat: m[5],
      lignes,
      effet: m[7] ?? null,
      suite: m[9] ?? null,
    });
  }
  return segments.length ? segments : null;
}

/** JJ/MM/AAAA → AAAAMMJJ, pour comparer. */
const cleDate = (d) => d.split("/").reverse().join("");

/**
 * Date d'ouverture d'un segment : celle de la ligne sans restriction s'il y en a une, sinon la plus
 * ancienne de ses lignes.
 */
function ouvertDepuis(seg) {
  const libres = seg.lignes.filter((l) => !l.sousDomaine);
  const lignes = libres.length ? libres : seg.lignes;
  return lignes.map((l) => l.depuis).sort((a, b) => cleDate(a).localeCompare(cleDate(b)))[0];
}

/**
 * Les faits d'une entrée : un par opérateur cité pour un métier (le principal, puis les alternatives),
 * avec ce que les listes publiques en disent (libellé, numéro AMC, segments, sous-domaines, date).
 * @param {any} e entrée de donnees.json
 */
export function faitsDe(e) {
  const faits = [];
  for (const metier of METIERS_C) {
    const v = e.par_metier?.[metier];
    if (!v) continue;
    [v, ...(v.alternatives ?? [])].forEach((it, rang) => {
      const liste = it.source_ids.find((s) => Object.hasOwn(LISTES, s)) ?? null;
      const segments = liste ? lireSegments(it.note_verification) : null;
      const premier = segments?.[0];
      const sousDomaines = segments
        ? [...new Set(segments.flatMap((s) => s.lignes.map((l) => l.sousDomaine).filter(Boolean)))]
        : [];
      faits.push({
        id: `${e.slug}:${metier}${rang ? `:${rang}` : ""}`,
        metier,
        rang,
        operateurId: it.operateur_id,
        operateur: it.operateur,
        role: it.role,
        portail: it.portail_url ?? null,
        statut: it.statut,
        restriction: it.restriction ?? null,
        sourceIds: it.source_ids,
        liste,
        segments,
        libelle: premier?.libelle ?? null,
        amc: premier?.amc ?? null,
        depuis: premier ? ouvertDepuis(premier) : null,
        nomsSegments: segments ? [...new Set(segments.map((s) => s.segment))] : [],
        // Lignes listées en plus de la ligne sans restriction (« et une ligne stomatologues »).
        sousDomaines: sousDomaines.map((s) => SOUS_DOMAINES[s] ?? s.toLowerCase()),
        avecLigneLibre: segments
          ? segments.some((s) => s.lignes.some((l) => !l.sousDomaine))
          : false,
        suite: premier?.suite ?? null,
        note: it.note_verification ?? "",
      });
    });
  }
  return faits;
}

/** Le fait principal de chaque métier, s'il est sûr. */
export const principauxSurs = (faits) => faits.filter((f) => f.rang === 0 && f.statut === "sur");

/** Les métiers de C dont le fait principal est sûr (l'opérateur relevé), dans l'ordre. */
export const metiersSurs = (faits) => principauxSurs(faits).map((f) => f.metier);

/** Les métiers du site qu'un ensemble de métiers de C touche. @param {string[]} ms */
export const metiersSite = (ms) => versMetiers(ms, TABLE_METIERS);

/**
 * Le métier du site que donne un fait pour la facette « metier » du hub : aucun pour un segment
 * réservé aux stomatologues (il ne vaut ni pour un chirurgien-dentiste ni pour un centre dentaire).
 */
export function metierFacette(f) {
  if (f.restriction && RESTRICTIONS[f.restriction]?.sansFacette) return null;
  return versMetiers([f.metier], TABLE_METIERS)[0] ?? null;
}

/**
 * Regroupe des faits par clé, dans l'ordre de première apparition : [{ cle, faits, metiers }].
 * @param {any[]} faits
 * @param {(f: any) => string} cle
 */
export function grouper(faits, cle) {
  const groupes = new Map();
  for (const f of faits) {
    const k = cle(f);
    if (!groupes.has(k)) groupes.set(k, []);
    groupes.get(k).push(f);
  }
  return [...groupes].map(([k, fs]) => ({
    cle: k,
    faits: fs,
    metiers: METIERS_C.filter((m) => fs.some((f) => f.metier === m)),
  }));
}

/** « Optique, audio, dentaire » : les métiers de C en tête de ligne. @param {string[]} ms */
export const listeMetiers = (ms) => capitale(ms.map((m) => NOM_METIER[m].toLowerCase()).join(", "));

/** Les libellés et numéros AMC (dédupliqués) d'un ensemble de faits, dans l'ordre. */
export function libellesDe(faits) {
  const vus = new Map();
  for (const f of faits)
    for (const s of f.segments ?? [])
      if (!vus.has(`${s.libelle}|${s.amc}`))
        vus.set(`${s.libelle}|${s.amc}`, { libelle: s.libelle, amc: s.amc });
  return [...vus.values()];
}

/** Texte cherchable d'une entrée (nom, autres noms, libellés des listes, groupe, opérateurs). */
export function texteCherchable(e, faits) {
  return [
    e.mutuelle,
    ...(e.autres_noms ?? []),
    e.groupe,
    ...libellesDe(faits).map((l) => l.libelle),
    ...new Set(faits.map((f) => f.operateur)),
  ]
    .filter(Boolean)
    .join(" ");
}

/** Lettre du groupe A à Z d'une entrée (« La Banque Postale » sous L). */
export const lettre = (nom) => (normaliser(nom)[0] ?? "#").toUpperCase();

/**
 * Les segments fermés d'une entrée, fusionnés par opérateur, libellé et date :
 * [{ operateur, libelle, date, domaines: ["Audioprothésiste", "Opticien"] }].
 * Forme des données : « iSanté « SMABTP VIE » : Audioprothésiste (fermé le 31/12/2025) ».
 * @param {string[]} lignes
 */
export function segmentsFermes(lignes) {
  const groupes = new Map();
  for (const l of lignes ?? []) {
    const m = String(l).match(/^(.+?) « ([^»]+) » : (.+?) \(fermé le (\d\d\/\d\d\/\d{4})\)$/);
    if (!m) throw new Error(`Segment fermé illisible : « ${l} »`);
    const k = `${m[1]}|${m[2]}|${m[4]}`;
    if (!groupes.has(k))
      groupes.set(k, { operateur: m[1], libelle: m[2], date: m[4], domaines: [] });
    groupes.get(k).domaines.push(m[3]);
  }
  return [...groupes.values()];
}

/** Un domaine de liste dans une phrase (« Audioprothésiste » → « audioprothésiste », ESPIC reste). */
export const domaineEnMinuscules = (d) => (d === "ESPIC" ? d : d[0].toLowerCase() + d.slice(1));
