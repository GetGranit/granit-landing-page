// Boucle de relecture d'un article déjà rédigé : relecteur → correcteur → contre-relecture.
// Trois rôles, trois appels distincts au modèle ; le correcteur ne se relit jamais lui-même.
// La logique est pure (l'appel au modèle et les contrôles sont injectés) pour être testée sans réseau.
import { mots, texte } from "./html.mjs";

export const GRAVITES = ["BLOQUANT", "A_CORRIGER", "DETAIL"];
export const ANGLES = ["faits", "conformite", "seo", "copy"];
export const TOURS_MAX = 2;

// Champs de l'article que le correcteur a le droit de réécrire (même schéma que publish-article)
export const CHAMPS_ARTICLE = ["metaDescription", "contentHtml", "tocItems", "faqItems", "sources", "figures"];

// Règles en dur, issues de la relecture à la main du lot du 09/10/2026 (4 relecteurs, 8 fiches)
export const REGLES = `## Règles de relecture (en plus du guide)

### Faits
- Le fichier de faits est la seule source de vérité. Toute affirmation précise (nombre, date, délai, contact, URL, libellé de statut, procédure, menu) doit y figurer, ou dans une source citée.
- Aucun chiffre hors fichier de faits.
- Pas de fréquence ni de classement inventé : « la première cause », « le plus souvent », « souvent », « l'erreur la plus fréquente ». Écrire « la vérification à faire en premier », « peut ».
- Une absence ne se présente pas comme un fait : « X ne publie pas… » devient « Les pages consultées ne donnent pas… ».
- Une date sans année, ou déjà passée, se retire ou se date au passé. Un compte annoncé (« trois points ») doit égaler la liste qui suit.

### Conformité
- Aucun prix ni montant facturé : dire « numéro surtaxé ».
- Aucune donnée patient, aucun nom de client, de magasin ou d'opticien.
- Aucune source ni allusion à un incident, une cyberattaque, une violation de données, la CNIL, un conflit, une mise en demeure ou un litige.
- Pas de dénigrement d'une plateforme, d'une mutuelle ou d'un concurrent.
- Pas de lien vers une ancre (#…).
- Aucune promesse sur ce que fait Granit au-delà du fichier de faits ; pas d'état interne (« ce que nous relevons », « notre connecteur ») ; Granit au plus une fois, jamais dans « Vous bloquez ? » ni dans un intertitre.
- Pas de conseil contraire aux conditions d'utilisation (ex. partager un compte nominatif).

### SEO
- L'adresse du portail dans la 1re phrase (en gras), liée à la page de connexion si elle est dans les faits, et reprise dans une puce de « L'essentiel ».
- La réponse de FAQ sur l'accès cite l'adresse.
- metaDescription de 140 à 160 caractères, avec le mot-clé principal.
- Les requêtes de navigation du groupe de mots-clés trouvent une réponse (H3 ou question de FAQ), sans citer le mot-clé.

### Copy (lecteur : un opticien ou une assistante au comptoir, sur téléphone, qui bloque sur une mutuelle)
- Ne jamais citer un mot-clé ou une recherche (« que l'on tape », « la requête », « les recherches du type »).
- Pas de paragraphe de remplissage (« Cette page reprend / rassemble… ») : le sommaire fait ce travail.
- Phrases de 25 mots au plus.
- Ne jamais annoncer un bloc vide ou un relevé absent (« la liste ci-dessous » sans liste).

### Ce qui n'est jamais un point
- Les marqueurs data-bloc (chiffres, organismes, statuts, contacts) : le contrôle du moteur exige chacun une fois, et un bloc dont la liste est vide ne s'affiche pas. Ne jamais demander de retirer, déplacer ou ajouter un marqueur. Seul le texte autour ne doit pas annoncer une liste vide.
- La citation <blockquote> est facultative. Ne la demande que si le fichier de faits contient un texte exact (citation mot pour mot) ; sinon, n'en parle pas.- Définir un terme du portail à sa première apparition. Répondre d'abord à l'idée fausse du lecteur.`;

const POINT = {
  type: "object",
  additionalProperties: false,
  required: ["gravite", "angle", "extrait", "correction"],
  properties: {
    gravite: { type: "string", enum: GRAVITES },
    angle: { type: "string", enum: ANGLES },
    extrait: { type: "string", description: "phrase exacte de l'article, ou champ concerné" },
    correction: { type: "string", description: "texte de remplacement proposé, ou action précise" },
  },
};

export const SCHEMA_RELECTURE = {
  type: "object",
  additionalProperties: false,
  required: ["points"],
  properties: { points: { type: "array", items: POINT } },
};

export const SCHEMA_VERDICT = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "resume", "restes"],
  properties: {
    verdict: { type: "string", enum: ["pret", "humain"] },
    resume: { type: "string", description: "ce qui a été vérifié, en phrases courtes" },
    restes: { type: "array", description: "points encore ouverts, y compris ceux introduits par la correction", items: POINT },
  },
};

/** Schéma du correcteur : l'article (schéma de publish-article) + ce qu'il ne peut pas trancher. */
export function schemaCorrection(schemaArticle) {
  const s = structuredClone(schemaArticle);
  s.properties.decision_humaine = {
    type: "array",
    description: "points qui demandent de changer un fait ou de décider à la place d'un humain (publier, changer la file). Vide sinon.",
    items: { type: "string" },
  };
  s.properties.non_appliques = {
    type: "array",
    items: {
      type: "object",
      additionalProperties: false,
      required: ["point", "raison"],
      properties: { point: { type: "string" }, raison: { type: "string" } },
    },
  };
  s.required = [...s.required, "decision_humaine", "non_appliques"];
  return s;
}

/** Point qui justifie un tour de correction. */
export const aCorriger = (p) => p.gravite !== "DETAIL";

/** Point qui empêche « pret » : tout BLOQUANT, et les A_CORRIGER hors style (le style restant ne suffit pas à bloquer). */
export const bloquant = (p) => p.gravite === "BLOQUANT" || (p.gravite === "A_CORRIGER" && p.angle !== "copy");

/** Une erreur des contrôles du moteur devient un point bloquant pour le tour suivant. */
export const pointMecanique = (e) => ({ gravite: "BLOQUANT", angle: "conformite", extrait: "contrôle du moteur", correction: e });

/** Verdict final, calculé sur les restes du vérificateur : « humain » seulement s'il reste un point bloquant, une erreur ou une décision. */
export function decider({ verif, erreurs = [], decisions = [] }) {
  if (!verif || erreurs.length || decisions.length) return "humain";
  return verif.restes.some(bloquant) ? "humain" : "pret";
}

export function cumulCout(usages, coutDollars, model) {
  return usages.reduce((t, u) => t + coutDollars(u, model), 0);
}

/** Applique la sortie du correcteur à la fiche de l'article (rien d'autre ne bouge). */
export function appliquer(fiche, corr) {
  const f = { ...fiche };
  for (const k of CHAMPS_ARTICLE) if (corr[k] !== undefined) f[k] = corr[k];
  f.wordCount = mots(texte(f.contentHtml)).length;
  f.readTime = Math.max(1, Math.round(f.wordCount / 230));
  return f;
}

const corps = (fiche) => Object.fromEntries(CHAMPS_ARTICLE.map((k) => [k, fiche[k] ?? []]));
const bloc = (titre, v) => `## ${titre}\n\`\`\`json\n${JSON.stringify(v, null, 2)}\n\`\`\``;
const listePoints = (pts) => pts.map((p, i) => `${i + 1}. [${p.gravite} · ${p.angle}] « ${p.extrait} » → ${p.correction}`).join("\n");

/** Contexte commun aux trois rôles : métadonnées, fichier de faits, liens autorisés, règles. */
export function contexte({ meta, faits, liens }) {
  return [
    bloc("Métadonnées de l'article (file)", meta),
    faits ? bloc("Fichier de faits (seule source de vérité, en lecture seule)", faits) : "## Fichier de faits\nAucun.",
    `## Liens internes autorisés\n${liens.map((l) => `- ${l}`).join("\n")}`,
    REGLES,
  ].join("\n\n");
}

export function messageRelecteur(ctx, fiche) {
  return [
    `Tu es le relecteur d'un article de la rubrique Ressources de getgranit.ai. Relis-le sous 4 angles : faits, conformité, SEO, copy.`,
    ctx,
    bloc("Article à relire", corps(fiche)),
    `## Consigne\nListe chaque défaut avec sa gravité : BLOQUANT (interdit, à retirer avant publication), A_CORRIGER (faux, inventé ou nuisible au lecteur), DETAIL (mieux, sans urgence). ` +
      `extrait = la phrase exacte de l'article ; correction = le texte de remplacement. Ne relève que des défauts réels et vérifiables avec le fichier de faits et les règles. ` +
      `Les blocs data-bloc sont remplis au rendu depuis les faits : ne les relis pas. Si l'article est bon, renvoie une liste vide.`,
  ].join("\n\n");
}

export function messageCorrecteur(ctx, fiche, points) {
  return [
    `Tu es le correcteur d'un article de la rubrique Ressources de getgranit.ai. Applique la relecture ci-dessous.`,
    ctx,
    bloc("Article à corriger", corps(fiche)),
    `## Points de relecture\n${listePoints(points)}`,
    `## Consigne\nRenvoie l'article entier corrigé. Applique tous les points BLOQUANT et A_CORRIGER, et les DETAIL quand c'est simple. ` +
      `Les points de style (copy) s'appliquent mécaniquement et en totalité : coupe en phrases de 25 mots au plus toute phrase qui dépasse, même hors des points cités. ` +
      `Ne touche à rien d'autre : garde les id des H2, tocItems alignés, les marqueurs data-bloc et data-figure, les sources encore citées. ` +
      `N'invente aucun fait : retire plutôt que remplacer. Tu ne modifies jamais le fichier de faits. ` +
      `decision_humaine sert seulement s'il faut changer le fichier de faits, ou décider de publier ou de changer la file ; jamais pour un marqueur data-bloc ni pour une citation (voir « Ce qui n'est jamais un point »). ` +
      `Un point que tu n'appliques pas va dans non_appliques, avec la raison.`,
  ].join("\n\n");
}

export function messageVerificateur(ctx, fiche, { points, corr, avertissements }) {
  return [
    `Tu fais la contre-relecture d'un article de la rubrique Ressources de getgranit.ai. Tu n'as ni relu ni corrigé la version précédente.`,
    ctx,
    bloc("Article corrigé", corps(fiche)),
    `## Points de relecture demandés\n${listePoints(points)}`,
    `## Ce que le correcteur dit ne pas avoir appliqué\n${corr.non_appliques.map((n) => `- ${n.point} → ${n.raison}`).join("\n") || "Rien."}`,
    `## Décisions renvoyées à un humain\n${corr.decision_humaine.map((d) => `- ${d}`).join("\n") || "Aucune."}`,
    `## Contrôles du moteur\n0 erreur. Avertissements : ${avertissements.join(" ; ") || "aucun"}`,
    `## Consigne\nVérifie point par point que chaque point est réglé, ou que son rejet est justifié. Cherche aussi les défauts introduits par la correction, avec les mêmes règles. ` +
      `restes = tout ce qui reste ouvert, avec sa gravité. verdict = pret si aucun BLOQUANT ni A_CORRIGER de fond (faits, conformité, SEO) ne reste et qu'aucune vraie décision humaine n'est en attente : des restes de style seuls n'empêchent pas pret. ` +
      `resume : ce que tu as vérifié, en phrases courtes, sans jargon.`,
  ].join("\n\n");
}

/**
 * Boucle complète.
 * appeler(role, message, schema) -> { json, usage } ; controle(fiche) -> { erreurs, avertissements }
 */
export async function boucle({ fiche, ctx, schemaArticle, appeler, controle, log = () => {}, usages = [] }) {
  const appel = async (role, message, schema) => {
    const r = await appeler(role, message, schema);
    usages.push(r.usage ?? {});
    if (!r.json) throw new Error(`${role} : réponse illisible (${r.stopReason})`);
    return r.json;
  };

  const { points } = await appel("relecteur", messageRelecteur(ctx, fiche), SCHEMA_RELECTURE);
  log(`Relecture : ${points.length} point(s), dont ${points.filter(aCorriger).length} à corriger`);
  const res = { fiche, points, tours: 0, verif: null, erreurs: [], decisions: [], nonAppliques: [], avertissements: [], usages };
  if (!points.length) {
    res.verif = { verdict: "pret", resume: "La relecture n'a relevé aucun point.", restes: [] };
    return { ...res, verdict: "pret" };
  }

  let aTraiter = points;
  while (aTraiter.length && res.tours < TOURS_MAX) {
    res.tours++;
    const corr = await appel("correcteur", messageCorrecteur(ctx, res.fiche, aTraiter), schemaCorrection(schemaArticle));
    res.decisions.push(...corr.decision_humaine);
    res.nonAppliques.push(...corr.non_appliques);
    const candidat = appliquer(res.fiche, corr);
    const c = await controle(candidat);
    log(`Tour ${res.tours} : correction · ${c.erreurs.length} erreur(s) au contrôle du moteur`);
    res.erreurs = c.erreurs;
    if (c.erreurs.length) {
      // la correction casse un contrôle : on garde la version d'avant et on renvoie les erreurs
      aTraiter = [...aTraiter, ...c.erreurs.map(pointMecanique)];
      res.verif = null;
      continue;
    }
    res.fiche = candidat;
    res.avertissements = c.avertissements;
    res.verif = await appel("verificateur", messageVerificateur(ctx, candidat, { points: aTraiter, corr, avertissements: c.avertissements }), SCHEMA_VERDICT);
    log(`Tour ${res.tours} : contre-relecture · ${res.verif.verdict} · ${res.verif.restes.length} reste(s)`);
    aTraiter = res.verif.restes.filter(aCorriger);
  }
  return { ...res, verdict: decider({ verif: res.verif, erreurs: res.erreurs, decisions: res.decisions }) };
}

const puces = (xs) => xs.map((x) => `- ${x}`).join("\n");
const pointMd = (p) => `[${p.gravite} · ${p.angle}] « ${p.extrait} » → ${p.correction}`;

/** Commentaire de verdict (corps de PR), au format des verdicts faits à la main le 09/10. */
export function verdictMarkdown(r, { model, cout }) {
  const tete = r.verdict === "pret" ? "✅ Prête" : "🟡 Décision humaine";
  const l = [
    `## Boucle relecture → correction → verdict : ${tete}`,
    "",
    `${r.tours} tour(s) de correction. Relecture, correction et contre-relecture faites par trois appels distincts à ${model} ; contrôles du moteur repassés après chaque correction.`,
    "",
    `**Résumé :** ${r.verif?.resume ?? "Pas de contre-relecture : la dernière correction a été refusée par les contrôles du moteur, l'article reste dans sa version d'avant."}`,
  ];
  const restes = r.verif?.restes ?? [];
  if (r.erreurs.length) l.push("", "**Contrôles du moteur en échec :**", puces(r.erreurs));
  if (restes.some(bloquant)) l.push("", "**Restant :**", puces(restes.filter(bloquant).map(pointMd)));
  if (restes.some((p) => !bloquant(p))) l.push("", "**Retouches de style et détails restants (ne bloquent pas) :**", puces(restes.filter((p) => !bloquant(p)).map(pointMd)));
  if (r.decisions.length) l.push("", "**À trancher par un humain :**", puces(r.decisions));
  if (r.nonAppliques.length) l.push("", "**Retours non appliqués (et pourquoi) :**", puces(r.nonAppliques.map((n) => `${n.point} → ${n.raison}`)));
  if (r.points.length) l.push("", "<details><summary>Points de la première relecture</summary>", "", puces(r.points.map(pointMd)), "", "</details>");
  if (r.avertissements.length) l.push("", `Avertissements du moteur après correction : ${r.avertissements.length}.`);
  l.push("", `Coût estimé de la boucle : ${cout.toFixed(2)} $`);
  return l.join("\n");
}
