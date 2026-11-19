// Outil A, codes rejet : ce qu'une page d'entrée affiche, calculé à partir de donnees.json.
// Une seule source de vérité pour trois usages : pages.mjs (seuil de contenu, sitemap, tests),
// serveur.ts (la page rendue) et les tests propres. Le texte propre compté par le seuil est donc
// exactement celui que la page rend.
//
// ESM pur, lisible par Node sans option. Jamais importé par une route ni un composant (il lit
// donnees.json) : seulement par pages.mjs, donc par serveur.ts et les scripts Node.
//
// Les mots viennent de outils-nuit/A/textes.md (§ 3.2 à 3.6) ; les faits, de donnees.json.
import donnees from "./donnees.json" with { type: "json" };
import { decouperPhrases } from "../socle/mots.mjs";
import { IDS_METIERS, metierOutil, versMetiers } from "../socle/metiers.mjs";
import { estDateIso, formaterDate } from "../socle/texte.mjs";
import { OUTIL } from "./outil.mjs";
import {
  ARTICLES,
  LIBELLES_COURTS,
  NATURES,
  OUTILS_LIES,
  PRIORITE,
  RESUMES,
} from "./publication.mjs";

/** Espace insécable (avant : ; ? ! et dans « »). */
const NB = "\u00a0";

/** Clés métier des données → métiers du site (socle.md § 5). */
export const TABLE_METIERS = {
  "optique-audio": "optique",
  "centre-de-sante": "centres",
  "clinique-laboratoire": "cliniques",
};

/**
 * La phrase commune à presque toutes les notes NOEMIE : déjà dite par l'avertissement « fait foi »,
 * elle n'est pas répétée dans « À savoir sur cette source » (textes.md § 3.4).
 */
export const PHRASE_COMMUNE =
  "Libellés publiés par des CPAM du régime général ; le libellé reçu dans votre propre retour fait foi et un autre régime peut employer un autre texte.";

/**
 * Lien d'origine des questions réelles (outils-nuit/A/questions.md) : le lien et la question
 * reformulée, jamais le nom de la personne.
 */
export const LIENS_QUESTIONS = {
  "noemie-0450054":
    "https://www.infirmiers.com/forum/teletransmission-degradee-cmu-et-ald-t120885.html",
  "noemie-2900005": "https://forum.epsilog.com/viewtopic.php?t=10696&start=16",
  "noemie-0180051": "https://forum.epsilog.com/viewtopic.php?t=10696&start=16",
};

export const parSlug = new Map(donnees.entrees.map((e) => [e.slug, e]));
export const sources = new Map(donnees.sources.map((s) => [s.id, s]));
export const cheminEntree = (slug) => `${OUTIL.chemin}/${slug}`;

// ─── Petits outils de texte ───────────────────────────────────────────────────────────────────

/** Typographie française d'un texte venu des données : espaces insécables avant : ; ? ! et dans « ». */
export function typo(texte) {
  return String(texte ?? "")
    .replace(/ ([:;?!])/g, `${NB}$1`)
    .replace(/«[ \u00a0]?/g, `«${NB}`)
    .replace(/[ \u00a0]?»/g, `${NB}»`);
}

/**
 * Un libellé tel qu'on l'affiche : recopié de la source (majuscules, abréviations et fautes
 * comprises), ses guillemets internes passés en “ ” pour ne pas se mêler aux « » de la page.
 */
export function libelleAffiche(texte) {
  let t = String(texte ?? "").trim();
  if (/^«.*»$/.test(t)) t = t.replace(/^«\s*/, "").replace(/\s*»$/, "");
  return typo(t.replace(/«\s*/g, "“").replace(/\s*»/g, "”"));
}

export const majuscule = (t) => (t ? t.charAt(0).toLocaleUpperCase("fr") + t.slice(1) : t);
export const point = (t) => (!t || /[.!?…]$/.test(t) ? t : `${t}.`);
export const phrases = (t) => decouperPhrases(typo(t));
export const premierePhrase = (t) => phrases(t)[0] ?? "";

// ─── Sources ──────────────────────────────────────────────────────────────────────────────────

/** « CPAM de la Gironde (publié sur ameli.fr) » → { court: « CPAM de la Gironde », qui: « la CPAM de la Gironde » }. */
export function nomSource(s) {
  const court = String(s?.editeur ?? "")
    .split(" (")[0]
    .replace(/'/g, "’")
    .trim();
  const qui = /^CPAM/.test(court)
    ? `la ${court}`
    : /^Assurance Maladie/.test(court)
      ? `l’${court}`
      : /^GIE/.test(court)
        ? `le ${court}`
        : court;
  return { court, qui };
}

/** Année d'un document (« 2019-04-12 » → « 2019 »), ou undefined s'il n'est pas daté. */
export const anneeSource = (s) => String(s?.date_source ?? "").match(/\b(19|20)\d{2}\b/)?.[0];

/** Date d'un document telle qu'affichée : « 12/04/2019 », sinon le texte de la source. */
export const dateSource = (s) => formaterDate(s?.date_source ?? "");

/** Une source est datée si sa date porte une année. */
export const estDatee = (s) => Boolean(anneeSource(s));

/** Une source telle qu'affichée : apostrophes typographiques et espaces insécables (le lien et les dates ne changent pas). */
export const sourceAffichee = (s) => ({
  ...s,
  editeur: typo(s.editeur.replace(/'/g, "’")),
  titre: typo(s.titre.replace(/'/g, "’")),
});

/** La source du libellé officiel (convention de data-A : source_ids[0]). */
export const sourcePrincipale = (e) => sources.get(e.source_ids[0]);

/** Sources d'une entrée, du document le plus récent au plus ancien (non datées en dernier). */
export function sourcesEntree(e) {
  const cle = (s) => String(s.date_source).match(/^\d{4}(?:-\d{2}){0,2}/)?.[0] ?? "";
  return e.source_ids
    .map((id) => sources.get(id))
    .filter(Boolean)
    .sort((a, b) => cle(b).localeCompare(cle(a)));
}

// ─── L'entrée vue par la page ─────────────────────────────────────────────────────────────────

export const estTraitementCaisse = (e) => NATURES[e.slug] === "attente";

/** Famille de rejet (textes.md § 3.1) ; ARL et messages de service : leur famille de données. */
export const nature = (e) => NATURES[e.slug] ?? e.famille;

/** Pour les voisins, Traitement caisse compte avec les doublons (textes.md § 3.5). */
const natureVoisins = (e) => (estTraitementCaisse(e) ? "transmission" : nature(e));

/** Le code tel qu'affiché : « 0450054 », « Traitement caisse », « 2502 ». */
export const codeAffiche = (e) =>
  /^\d+$/.test(e.code) ? e.code : majuscule(String(e.code).toLocaleLowerCase("fr"));

export const metiersEntree = (e) => versMetiers(e.metiers, TABLE_METIERS);

/** « Tous les métiers », ou les libellés courts du socle séparés par « · ». */
export function libelleMetiers(metiers) {
  if (metiers.length === IDS_METIERS.length) return "Tous les métiers";
  return metiers.map((m) => metierOutil(m)?.court ?? m).join(" · ");
}

/** « en dentaire », « en pharmacie »… pour « Autres codes rejets en … » (textes.md § 3.5). */
const EN_METIER = {
  optique: "en optique et audio",
  dentaire: "en dentaire",
  centres: "en centre de santé",
  pharmacie: "en pharmacie",
  cliniques: "en établissement",
};

export function surTitre(e) {
  if (estTraitementCaisse(e)) return "Retour NOEMIE · Assurance Maladie";
  if (e.famille === "arl") return "ARL négatif · SESAM-Vitale";
  if (e.famille === "sesam-vitale") return "Message de service · SESAM-Vitale";
  const ms = metiersEntree(e);
  if (ms.length === 1)
    return `Code rejet NOEMIE · ${(metierOutil(ms[0])?.court ?? ms[0]).toLocaleLowerCase("fr")}`;
  return "Code rejet NOEMIE · Assurance Maladie";
}

/** Le nom d'un code selon sa famille : « Code rejet 0450054 », « ARL négatif 2502 »… */
function nomCode(e) {
  if (e.famille === "arl") return `ARL négatif ${e.code}`;
  if (e.famille === "sesam-vitale") return `Message de service ${e.code}`;
  return `Code rejet ${e.code}`;
}

export function h1(e) {
  if (estTraitementCaisse(e))
    return `«${NB}Traitement caisse${NB}» dans un retour NOEMIE${NB}: ce n’est pas un rejet`;
  return `${nomCode(e)}${NB}: «${NB}${libelleAffiche(e.libelle_officiel)}${NB}»`;
}

/** La première forme dont la longueur tient dans les bornes, sinon une erreur (le build s'arrête). */
export function forme(formes, min, max, quoi) {
  const ok = formes.find((f) => f && f.length >= min && f.length <= max);
  if (!ok) throw new Error(`${quoi} : aucune forme entre ${min} et ${max} caractères`);
  return ok;
}

/** <title> (textes.md § 3.2) : 60 caractères au plus. */
export function titre(e) {
  if (estTraitementCaisse(e)) return `Traitement caisse NOEMIE${NB}: ce n’est pas un rejet`;
  const court = LIBELLES_COURTS[e.slug];
  const lib = libelleAffiche(e.libelle_officiel);
  const fin = nature(e) === "transmission" ? "que faire" : "que corriger";
  const formes =
    e.famille === "noemie"
      ? [court && `${nomCode(e)}${NB}: ${court}, ${fin}`, court && `${nomCode(e)}${NB}: ${court}`]
      : [`${nomCode(e)}${NB}: ${lib}`, court && `${nomCode(e)}${NB}: ${court}`];
  formes.push(`${nomCode(e)}${NB}: sens et correction`, nomCode(e));
  return forme(formes, 10, 60, `titre de ${e.slug}`);
}

/** Objets de la description, du plus long au plus court (textes.md § 3.2). */
const OBJETS = {
  normal: [
    "La cause probable et quoi corriger avant de renvoyer la facture",
    "La cause probable et quoi corriger avant de la renvoyer",
    "La cause probable et quoi corriger avant de renvoyer",
    "La cause probable et ce qu’il faut corriger",
    "La cause probable et quoi corriger",
    "Cause probable et correction",
  ],
  transmission: [
    "Pourquoi ne pas renvoyer la facture et que faire à la place",
    "Pourquoi ne pas la renvoyer et que faire à la place",
    "Pourquoi ne pas la renvoyer, et que faire",
    "Que faire au lieu de la renvoyer",
  ],
  gie: [
    "Ce qu’il signale, la cause probable et quoi faire avant de renvoyer le lot",
    "Ce qu’il signale, la cause probable et quoi faire avant de renvoyer",
    "Ce qu’il signale, la cause probable et quoi faire",
    "La cause probable et quoi faire",
  ],
};

/**
 * Meta description (textes.md § 3.2) : « Code rejet {code} : {résumé}. {objet}, selon {la caisse}
 * ({année}). » Le premier objet qui tient entre 140 et 155 caractères ; sinon entre 140 et 160.
 */
export function description(e) {
  if (estTraitementCaisse(e))
    return `«${NB}Traitement caisse${NB}» dans un retour NOEMIE${NB}: la caisse étudie la facture, ce n’est pas un rejet. Que faire en attendant, et pourquoi ne pas la renvoyer.`;
  const s = sourcePrincipale(e);
  const { qui } = nomSource(s);
  const annee = anneeSource(s);
  const resume = RESUMES[e.slug] ?? premierePhrase(e.explication).replace(/\.$/, "");
  const objets =
    e.famille !== "noemie"
      ? OBJETS.gie
      : nature(e) === "transmission"
        ? OBJETS.transmission
        : OBJETS.normal;
  const formes = objets.map((o) => `${nomCode(e)}${NB}: ${resume}. ${o}, selon ${qui} (${annee}).`);
  const lib = libelleAffiche(e.libelle_officiel);
  formes.push(
    ...objets.map(
      (o) =>
        `${nomCode(e)} «${NB}${lib}${NB}»${NB}: ${o.toLocaleLowerCase("fr")}, selon ${qui} (${annee}).`,
    ),
  );
  const court = formes.find((f) => f.length >= 140 && f.length <= 155);
  return court ?? forme(formes, 140, 160, `description de ${e.slug}`);
}

/**
 * La réponse sous le H1, deux phrases (textes.md § 3.3) :
 * R1, `explication` a deux phrases : ces deux phrases ;
 * R2, sinon : la phrase d'`explication`, puis la première phrase d'`action` (plus la suivante si
 * elle fait moins de 40 caractères, « Ne retransmettez pas. »).
 */
export function reponse(e) {
  const ex = phrases(e.explication);
  if (ex.length >= 2) return { regle: "R1", phrases: ex.slice(0, 2) };
  const ac = phrases(e.action);
  const suite = ac[0] && ac[0].length < 40 && ac[1] ? `${ac[0]} ${ac[1]}` : ac[0];
  return { regle: "R2", phrases: [ex[0], suite].filter(Boolean) };
}

/** `cause` découpée en points aux « ; », une majuscule et un point par point. */
export const causes = (e) =>
  typo(e.cause)
    .split(/\s*;\s*/)
    .map((c) => point(majuscule(c.trim())))
    .filter(Boolean);

/** `action` découpée en étapes, une phrase par étape. */
export const etapes = (e) => phrases(e.action);

/** « L'essentiel », 3 ou 4 lignes (textes.md § 3.3). */
export function essentiel(e) {
  const r = reponse(e);
  return [
    { libelle: "Libellé officiel", valeur: libelleAffiche(e.libelle_officiel) },
    { libelle: "Cause probable", valeur: point(premierePhrase(causes(e)[0] ?? "")) },
    ...(r.regle === "R1" && etapes(e)[0]
      ? [{ libelle: "Quoi corriger", valeur: etapes(e)[0] }]
      : []),
    { libelle: "Métiers", valeur: libelleMetiers(metiersEntree(e)) },
  ];
}

/** L'avertissement « fait foi », sous L'essentiel : la caisse, la date du document. */
export function avertissement(e) {
  const s = sourcePrincipale(e);
  if (estTraitementCaisse(e)) {
    const dates = sourcesEntree(e)
      .filter((x) => estDateIso(x.date_source))
      .map(dateSource);
    return {
      texte: `Le libellé de votre retour fait foi. Ce motif est décrit par l’Assurance Maladie sur ameli.fr (pages du ${dates.join(" et du ")})${NB}; il n’a pas de code numérique.`,
      sourceIds: e.source_ids.filter((id) => sources.has(id)),
    };
  }
  const autre =
    e.famille === "noemie"
      ? "une autre caisse ou un autre régime (MSA, régimes spéciaux) peut écrire autre chose"
      : "la version du cahier des charges suivie par votre logiciel peut employer un autre texte";
  return {
    texte: `Le libellé de votre retour fait foi. Celui-ci est celui publié par ${nomSource(s).qui} (document du ${dateSource(s)})${NB}; ${autre}.`,
    sourceIds: [s.id],
  };
}

/** Le libellé, source par source (textes.md § 3.4) : un tableau, ou une phrase s'il n'y en a qu'un. */
export function libelles(e) {
  const ligne = (texte, id) => {
    const s = sources.get(id);
    return {
      sourceId: id,
      editeur: nomSource(s).court,
      date: dateSource(s),
      texte: libelleAffiche(texte),
    };
  };
  const lignes = [
    ligne(e.libelle_officiel, e.source_ids[0]),
    ...(e.libelles_variantes ?? [])
      .filter((v) => sources.has(v.source_id))
      .map((v) => ligne(v.texte, v.source_id)),
  ];
  if (lignes.length > 1)
    return {
      titre:
        e.famille === "noemie"
          ? `Le libellé ${e.code}, caisse par caisse`
          : `Le libellé ${e.code}, source par source`,
      lignes,
    };
  const s = sourcePrincipale(e);
  const n = e.source_ids.length;
  const objet = estTraitementCaisse(e) ? "ce motif" : "ce code";
  return {
    titre: "Le libellé publié",
    lignes,
    phrase: `«${NB}${lignes[0].texte}${NB}», d’après ${nomSource(s).qui} (document du ${dateSource(s)}). ${
      n > 1
        ? `Aucun autre libellé n’a été relevé pour ${objet} dans les ${n} documents lus.`
        : `C’est le seul document lu qui cite ${objet}.`
    }`,
  };
}

/** « Le code 0450054 s'écrit aussi » : les autres écritures, sans le code lui-même. */
export function ecritures(e) {
  const affiche = codeAffiche(e);
  const valeurs = [...new Set(e.autres_ecritures ?? [])].filter(
    (w) => w !== e.code && w !== affiche,
  );
  if (!valeurs.length) return null;
  return { titre: `Le code ${affiche} s’écrit aussi`, valeurs };
}

const DEDUIT = "La source ne donne pas de cause\u00a0: ces pistes sont déduites du libellé.";

/** Intertitres et contenus des sections Causes et Correction (textes.md § 3.4 et 3.6). */
export function sectionsCauseAction(e) {
  const deduit = e.cause_action_origine === "deduit_du_libelle";
  const n = nature(e);
  const titreCauses = deduit
    ? "Ce que le libellé laisse supposer"
    : estTraitementCaisse(e)
      ? "Pourquoi la facture est à l’étude"
      : ({
          droits: "D’où vient l’écart avec les droits du patient",
          identification: "D’où vient l’erreur d’identification",
          facture: "Ce qui ne va pas dans la facture",
          transmission: "Pourquoi la caisse y voit un doublon",
        }[n] ?? "Causes probables");
  const titreCorrection = deduit
    ? "Ce qu’on peut vérifier"
    : estTraitementCaisse(e)
      ? "Que faire en attendant le retour suivant"
      : n === "transmission"
        ? "Que faire à la place d’un nouvel envoi"
        : e.famille === "noemie"
          ? `Corriger un rejet ${e.code}, étape par étape`
          : "Quoi corriger";
  return {
    causes: { titre: titreCauses, items: causes(e), deduit: deduit ? DEDUIT : undefined },
    correction: { titre: titreCorrection, etapes: etapes(e), deduit: deduit ? DEDUIT : undefined },
  };
}

/** La question posée par des professionnels, reformulée, avec son lien d'origine. */
export function question(e) {
  const q = e.questions_reelles?.[0];
  if (!q) return null;
  return {
    titre: "La question posée par des professionnels",
    texte: typo(q),
    lien: LIENS_QUESTIONS[e.slug],
  };
}

/** « À savoir sur cette source » : la note, sans la phrase commune, puis les professions citées. */
export function note(e) {
  // Comparée après typographie : les données portent déjà une espace insécable avant « ; ».
  const texte = typo(e.note_verification).replace(typo(PHRASE_COMMUNE), "").trim();
  const professions = e.professions_citees_par_les_sources ?? [];
  const ameliSeul = e.source_ids.every((id) => id.startsWith("ameli-"));
  const cite = professions.length
    ? `${ameliSeul ? "Cité dans les pages ameli.fr" : "Cité dans les mémos des caisses"} pour${NB}: ${professions.join(", ")}.`
    : "";
  if (!texte && !cite) return null;
  return {
    titre: "À savoir sur cette source",
    texte: texte || undefined,
    professions: cite || undefined,
  };
}

/**
 * Le texte propre de l'entrée, tel que la page le rend (cadre.md § 4) : libellé officiel,
 * explication, cause, action, autres libellés, question réelle, note de source. Sans intertitres,
 * liens, blocs communs ni carte Granit. Chaque morceau finit par un point, pour que le découpage
 * en phrases du seuil ne colle pas un libellé à la phrase qui le suit.
 */
export function textePropre(e) {
  const q = question(e);
  const n = note(e);
  return [
    libelleAffiche(e.libelle_officiel),
    ...phrases(e.explication),
    ...causes(e),
    ...etapes(e),
    ...(e.libelles_variantes ?? []).map((v) => libelleAffiche(v.texte)),
    q?.texte,
    n?.texte,
  ]
    .filter(Boolean)
    .map(point)
    .join(" ");
}

// ─── Voisins et articles ──────────────────────────────────────────────────────────────────────

/** Préfixe numérique d'un code (4 chiffres), pour la distance entre codes ; null hors des chiffres. */
function prefixe(e) {
  if (/^\d{7}$/.test(e.code)) return Number(e.code.slice(0, 4));
  if (/^\d{4}$/.test(e.code)) return Number(e.code);
  return null;
}

const rangPriorite = (e) => {
  const i = PRIORITE.indexOf(e.slug);
  return i < 0 ? Infinity : i;
};

/** Du préfixe le plus proche au plus éloigné ; à égalité, l'ordre de PRIORITE, puis le code. */
function trierProches(e, liste) {
  const p = prefixe(e);
  const distance = (x) => {
    const q = prefixe(x);
    return p === null || q === null ? Infinity : Math.abs(p - q);
  };
  return [...liste].sort(
    (a, b) =>
      distance(a) - distance(b) ||
      rangPriorite(a) - rangPriorite(b) ||
      String(a.code).localeCompare(String(b.code)),
  );
}

/**
 * Les voisins d'une entrée parmi les pages publiées, 3 à 6 (textes.md § 3.5) : 1. ses codes voisins
 * publiés ; 2. pour une entrée d'un seul métier, les codes publiés de ce seul métier ; 3. les codes
 * publiés de la même famille de rejet, du préfixe le plus proche au plus éloigné ; 4. s'il en manque
 * pour arriver à 3, le préfixe le plus proche dans la même famille de données, puis partout.
 * @param {{ slug: string }} e
 * @param {ReadonlySet<string>} publiees slugs des pages publiées
 */
export function voisins(e, publiees) {
  const choisis = [];
  const ajouter = (x, max = 6) => {
    if (x && x.slug !== e.slug && choisis.length < max && !choisis.includes(x)) choisis.push(x);
  };
  const autres = [...publiees]
    .filter((s) => s !== e.slug)
    .map((s) => parSlug.get(s))
    .filter(Boolean);
  for (const s of e.codes_voisins ?? []) if (publiees.has(s)) ajouter(parSlug.get(s));
  const ms = metiersEntree(e);
  if (ms.length === 1)
    trierProches(
      e,
      autres.filter((x) => {
        const mx = metiersEntree(x);
        return mx.length === 1 && mx[0] === ms[0];
      }),
    ).forEach((x) => ajouter(x));
  trierProches(
    e,
    autres.filter((x) => natureVoisins(x) === natureVoisins(e)),
  ).forEach((x) => ajouter(x));
  trierProches(
    e,
    autres.filter((x) => x.famille === e.famille),
  ).forEach((x) => ajouter(x, 3));
  trierProches(e, autres).forEach((x) => ajouter(x, 3));
  return choisis;
}

/** Titre du bloc des voisins (textes.md § 3.5) : il doit rester vrai pour tous les voisins listés. */
export function titreVoisins(e, liste) {
  const ms = metiersEntree(e);
  if (ms.length === 1 && liste.every((x) => metiersEntree(x).includes(ms[0])))
    return `Autres codes rejets ${EN_METIER[ms[0]]}`;
  const n = natureVoisins(e);
  const titres = {
    droits: "Autres rejets liés aux droits du patient",
    identification: "Autres rejets d’identification",
    facture: "Autres rejets sur le contenu de la facture",
    transmission: "Autres retours à ne pas renvoyer tels quels",
  };
  if (titres[n] && liste.every((x) => natureVoisins(x) === n)) return titres[n];
  return "Codes voisins";
}

/** Une carte de voisin : le code, le libellé court, ce que la caisse reproche. */
export function carteVoisin(x) {
  const court = LIBELLES_COURTS[x.slug];
  return {
    chemin: cheminEntree(x.slug),
    code: codeAffiche(x),
    titre: court
      ? majuscule(court)
      : estTraitementCaisse(x)
        ? "Traitement caisse"
        : libelleAffiche(x.libelle_officiel),
    resume: RESUMES[x.slug] ? point(majuscule(RESUMES[x.slug])) : premierePhrase(x.explication),
  };
}

/**
 * Articles liés (1 à 3, en ligne seulement), règle de textes.md § 3.5, sauf ARTICLES[slug] :
 * codes-rejets-noemie ; + rejet-beneficiaire-inconnu (0250050, 0270051) ; + rejet-tiers-payant
 * (droits, identification) ; + quand-relancer-mutuelle (doublons, Traitement caisse, ARL) ;
 * + officine-balance-agee-tiers-payant (codes 4000…) ; + dentaire-paniers-100-sante-tiers-payant
 * (codes du seul dentaire).
 * @param {{ articles: ReadonlySet<string> }} site
 */
export function articles(e, site) {
  const n = nature(e);
  const ms = metiersEntree(e);
  const liste = ARTICLES[e.slug] ?? [
    "codes-rejets-noemie",
    ...(["noemie-0250050", "noemie-0270051"].includes(e.slug)
      ? ["rejet-beneficiaire-inconnu"]
      : []),
    ...(n === "droits" || n === "identification" ? ["rejet-tiers-payant"] : []),
    ...(n === "transmission" || n === "attente" || e.famille !== "noemie"
      ? ["quand-relancer-mutuelle"]
      : []),
    ...(/^4000/.test(e.code) ? ["officine-balance-agee-tiers-payant"] : []),
    ...(ms.length === 1 && ms[0] === "dentaire" ? ["dentaire-paniers-100-sante-tiers-payant"] : []),
  ];
  return [...new Set(liste)].filter((s) => site.articles.has(s)).slice(0, 3);
}

/** Liens vers les autres outils (OUTILS_LIES de publication.mjs). */
export const outilsLies = (e) => OUTILS_LIES[e.slug] ?? [];
