#!/usr/bin/env node
// Moteur SEO Granit : rédige le prochain article de la file et l'écrit dans content/ressources/.
// Usage : node scripts/seo-engine/publish-article.mjs [--slug portail-viamedis] [--dry] [--out dossier] [--model claude-opus-5-5]
//   --dry : n'écrit que l'article (dans --out), ne touche ni à la file ni aux autres articles.
// Le commit, la PR et la notification sont faits par le workflow (ship.sh, notify.mjs).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { controler, typeDePage, verifierSources } from "./lib/checks.mjs";
import { coutDollars, rediger } from "./lib/claude.mjs";
import { mots, texte } from "./lib/html.mjs";
import {
  CONTENU, MOTEUR, anciensArticles, ecrireFile, ecrireJson, faitsPour, lireFile, lireJson,
  publies, sectionsGabarit, sortieGithub,
} from "./lib/site.mjs";

const { values: opt } = parseArgs({
  options: { slug: { type: "string" }, dry: { type: "boolean", default: false }, out: { type: "string" }, model: { type: "string" } },
});

const config = lireJson(join(MOTEUR, "config.json"));
if (opt.model) config.model = opt.model;
const schema = lireJson(join(MOTEUR, "article-output.schema.json"));
const aujourdhui = new Date().toISOString().slice(0, 10);

function apiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  const local = join(process.env.HOME ?? "", ".config/granit/anthropic.key");
  if (existsSync(local)) return readFileSync(local, "utf8").trim();
  throw new Error("ANTHROPIC_API_KEY manquante");
}

// 1. Choix de l'article
const file = lireFile();
const article = opt.slug ? file.find((a) => a.slug === opt.slug) : file.find((a) => a.status === "pending");
if (!article) {
  if (opt.slug) throw new Error(`slug inconnu dans la file : ${opt.slug}`);
  console.log("File vide : aucun article pending. Rien à faire.");
  sortieGithub({ slug: "" });
  process.exit(0);
}
if (opt.slug && article.status !== "pending" && !opt.dry) {
  throw new Error(`« ${article.slug} » a le statut ${article.status} : seul un article pending se publie (ou utiliser --dry)`);
}
const type = typeDePage(article);
const fp = faitsPour(article);
if (type === "plateforme" && !fp?.faits) throw new Error(`fichier de faits manquant : content/plateformes/${fp?.nom}.json`);
console.log(`Article ${article.id} · ${article.slug} · type ${type}${fp?.faits ? ` · faits ${fp.nom}` : ""}`);

// 2. Cibles de liens autorisées
const enLigne = publies(file);
const cibles = new Map();
for (const a of enLigne) cibles.set(`/ressources/${a.slug}`, a.title);
for (const a of anciensArticles()) cibles.set(`/ressources/${a.slug}`, `${a.titre} (ancien article, ${a.categorie})`);
cibles.set("/ressources", "Hub des ressources");
const slugsEnLigne = new Set(enLigne.map((a) => a.slug));
const liensPrevus = (article.internalLinks ?? []).filter((l) => slugsEnLigne.has(l.slug));

// 3. Message envoyé à Claude
const meta = {
  slug: article.slug,
  category: article.category,
  categoryName: config.categories[article.category],
  title: article.title,
  primaryKeyword: article.primaryKeyword,
  keywordCluster: article.keywordCluster,
  faqQuestions: article.faqQuestions,
  parentSlug: article.parentSlug,
  level: article.level,
  reader: article.reader,
  granitData: article.granitData,
};

const consignesType = {
  standard: "Page standard.",
  resolution: "Page résolution : plan imposé en 7 temps (voir le guide) et composant <ol class=\"steps\"> obligatoire pour l'action.",
  plateforme:
    "Page plateforme : les 7 H2 imposés par le guide, rédigés uniquement à partir de `faits` et `conventionnement` du fichier de faits ci-dessous, " +
    "et les 4 marqueurs data-bloc (chiffres, organismes, statuts, contacts) posés une fois chacun à l'endroit indiqué par la section 6 du gabarit. " +
    "Tout nombre du texte doit figurer dans le fichier de faits. Ne cite pas HDS. " +
    "Si `organismes.liste` est vide, pose quand même le marqueur organismes et dis en une phrase pourquoi la liste n'est pas relevée (voir `organismes.note`).",
};

function message(retour) {
  const parts = [
    `Rédige l'article suivant pour la rubrique Ressources de getgranit.ai.`,
    `## Métadonnées\n\`\`\`json\n${JSON.stringify(meta, null, 2)}\n\`\`\``,
    `## Type de page\n${consignesType[type]}`,
  ];
  if (article.toValidate) {
    parts.push(`## Points non tranchés\n${article.toValidate}\nN'affirme rien sur ces points : contourne-les ou reste général.`);
  }
  parts.push(
    `## Liens internes autorisés (chemins exacts)\n` +
      (liensPrevus.length
        ? `Liens prévus dont la cible est en ligne (ancre conseillée) :\n${liensPrevus.map((l) => `- /ressources/${l.slug} : « ${l.anchor} » (${l.type})`).join("\n")}\n`
        : "Aucun lien prévu n'est encore en ligne.\n") +
      `Autres pages en ligne que tu peux lier si c'est pertinent pour un opticien :\n${[...cibles]
        .filter(([c]) => !liensPrevus.some((l) => `/ressources/${l.slug}` === c))
        .map(([c, t]) => `- ${c} : ${t}`)
        .join("\n")}\n` +
      `Pages produit (2 liens maximum) : ${config.pagesProduit.join(", ")}.\n` +
      `Aucun autre lien interne. Vise 3 à 8 liens internes.`,
  );
  if (fp?.faits) {
    parts.push(
      `## Fichier de faits (${fp.nom}, relevé le ${fp.faits.checkedOn})\n` +
        (type === "plateforme" ? "" : "Contexte seulement : pas de marqueur data-bloc dans cette page.\n") +
        `\`\`\`json\n${JSON.stringify(fp.faits, null, 2)}\n\`\`\``,
    );
  }
  parts.push(
    `## Schémas (champ figures)\n` +
      `0 à 2 schémas, seulement quand un schéma fait comprendre plus vite qu'un paragraphe. Le site les dessine dans la charte Granit : tu ne fournis que le contenu.\n` +
      `- flux : qui envoie quoi à qui, dans l'ordre (ex. opticien → plateforme → complémentaire). detail = ce qui passe vers l'élément suivant.\n` +
      `- etapes : actions dans l'ordre, quand la liste d'étapes du texte gagne à être vue d'un coup d'œil.\n` +
      `- comparaison : 2 ou 3 options côte à côte (colonnes), une valeur courte par option pour chaque critère.\n` +
      `Règles : une seule idée par schéma ; libellés de 1 à 4 mots ; detail de 60 caractères max ; focus sur 1 élément au plus (le point à retenir) ; ` +
      `la légende dit quoi regarder ; aucun fait ni chiffre qui ne soit pas déjà dans le texte. ` +
      `Place chaque schéma dans contentHtml par <div data-figure="{id}"></div>, juste après le paragraphe qu'il illustre, jamais avant « L'essentiel ».`,
  );
  parts.push(
    `## Rappels de sortie\n` +
      `- contentHtml : 1 800 à 2 500 mots (jamais moins de 1 500), ouverture en <p>, puis « L'essentiel », puis les H2 en questions avec un id.\n` +
      `- Pas de H1, pas de FAQ, pas d'encart final, pas d'image dans contentHtml.\n` +
      `- tocItems : un élément par H2, mêmes id, même ordre.\n` +
      `- metaDescription : 140 à 160 caractères, avec le mot-clé principal.\n` +
      `- sources : chaque lien externe du corps, 2 minimum, uniquement des pages officielles que tu connais avec certitude.\n` +
      `- Mot-clé principal « ${article.primaryKeyword} » dans les 100 premiers mots.`,
  );
  if (retour) parts.push(`## Correction demandée\nLa version précédente a été refusée pour ces raisons. Corrige-les toutes :\n${retour.map((e) => `- ${e}`).join("\n")}`);
  return parts.join("\n\n");
}

const system = `${readFileSync(join(MOTEUR, "BLOG_CMS_granit.md"), "utf8")}\n\n---\n\n# Extrait du gabarit (GABARIT_ARTICLE_granit.md)\n\n${sectionsGabarit()}`;

// 4. Rédaction + contrôles, 2 essais maximum
const key = apiKey();
let sortie = null;
let bilan = null;
let retour = null;
let cout = 0;
for (let essai = 1; essai <= 2 && !sortie; essai++) {
  console.log(`Essai ${essai} : appel à ${config.model}…`);
  const t0 = Date.now();
  const r = await rediger({ apiKey: key, model: config.model, maxTokens: config.maxTokens, system, message: message(retour), schema });
  cout += coutDollars(r.usage, config.model);
  console.log(`  ${Math.round((Date.now() - t0) / 1000)} s · ${r.usage.output_tokens} tokens en sortie · arrêt ${r.stopReason}`);
  if (!r.json) {
    retour = [`réponse incomplète ou illisible (${r.stopReason})`];
    console.log(`  Refusé : ${retour[0]}`);
    continue;
  }
  const c = controler(r.json, { article, type, faits: fp?.faits, cibles, pagesProduit: config.pagesProduit });
  const s = await verifierSources(r.json.sources ?? []);
  const erreurs = [...c.erreurs, ...s.erreurs];
  console.log(`  ${c.nbMots} mots · ${erreurs.length} erreur(s) · ${c.avertissements.length + s.avertissements.length} avertissement(s)`);
  if (erreurs.length) {
    erreurs.forEach((e) => console.log(`  ✗ ${e}`));
    retour = erreurs;
    if (opt.dry && opt.out) {
      mkdirSync(opt.out, { recursive: true });
      ecrireJson(join(opt.out, `${article.slug}.refus-${essai}.json`), { erreurs, ...r.json });
    }
    continue;
  }
  sortie = r.json;
  bilan = { nbMots: c.nbMots, avertissements: [...c.avertissements, ...s.avertissements] };
}
console.log(`Coût estimé : ${cout.toFixed(2)} $`);
if (!sortie) {
  console.error("Deux essais refusés : arrêt sans publier.");
  process.exit(1);
}
bilan.avertissements.forEach((a) => console.log(`  ! ${a}`));

// 5. Fichier de l'article (lu par la page /ressources/{slug})
const nbMots = mots(texte(sortie.contentHtml)).length;
const fiche = {
  slug: article.slug,
  id: article.id,
  category: article.category,
  categoryName: config.categories[article.category],
  type,
  plateforme: fp?.faits ? fp.nom : null,
  title: article.title,
  primaryKeyword: article.primaryKeyword,
  keywordCluster: article.keywordCluster,
  parentSlug: article.parentSlug,
  level: article.level,
  author: { name: config.auteur.nom, jobTitle: config.auteur.fonction, photo: config.auteur.photo },
  reviewer: config.relecteur || null,
  datePublished: aujourdhui,
  dateModified: aujourdhui,
  checkedOn: type === "plateforme" ? fp.faits.checkedOn : null,
  wordCount: nbMots,
  readTime: Math.max(1, Math.round(nbMots / 230)),
  metaDescription: sortie.metaDescription,
  contentHtml: sortie.contentHtml,
  tocItems: sortie.tocItems,
  faqItems: sortie.faqItems,
  sources: sortie.sources,
  figures: sortie.figures ?? [],
  internalLinks: liensPrevus,
  liensEntrants: [],
  moteur: { model: config.model, genereLe: new Date().toISOString(), avertissements: bilan.avertissements },
};

const dossier = opt.dry ? opt.out ?? join(process.env.TMPDIR ?? "/tmp", "seo-engine") : CONTENU;
mkdirSync(dossier, { recursive: true });
ecrireJson(join(dossier, `${article.slug}.json`), fiche);
console.log(`Écrit : ${join(dossier, `${article.slug}.json`)}`);
if (opt.dry) process.exit(0);

// 6. Maillage en retour : le parent et les sœurs en ligne pointent vers le nouvel article
for (const voisin of enLigne) {
  const estParent = voisin.slug === article.parentSlug;
  const estSoeur = article.parentSlug && voisin.parentSlug === article.parentSlug;
  if (!estParent && !estSoeur) continue;
  const p = join(CONTENU, `${voisin.slug}.json`);
  const f = lireJson(p);
  if (f.liensEntrants?.some((l) => l.slug === article.slug)) continue;
  const prevu = (voisin.internalLinks ?? []).find((l) => l.slug === article.slug);
  f.liensEntrants = [...(f.liensEntrants ?? []), { slug: article.slug, anchor: prevu?.anchor ?? article.title, type: estParent ? "enfant" : "soeur" }];
  ecrireJson(p, f);
  console.log(`Lien ajouté depuis ${voisin.slug}`);
}

// 7. Statut dans la file : relecture humaine pour les premiers articles et ceux qui ont des points à valider
const dejaSortis = file.filter((a) => ["published", "review"].includes(a.status)).length;
const relecture = dejaSortis < config.relectureDesPremiers || Boolean(article.toValidate);
article.status = relecture ? "review" : "published";
article.publishedAt = aujourdhui;
ecrireFile(file);

sortieGithub({
  slug: article.slug,
  title: article.title,
  url: `${config.site}/ressources/${article.slug}`,
  review: relecture,
  avertissements: bilan.avertissements.length,
  cout: cout.toFixed(2),
});
console.log(relecture ? "→ relecture humaine (PR)" : "→ publication directe");
