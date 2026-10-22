#!/usr/bin/env node
// Boucle de relecture d'un article déjà rédigé : relecteur → correcteur → contre-relecture → verdict.
// Usage : node scripts/seo-engine/relire-article.mjs --slug portail-actil [--verdict fichier.md] [--dry --out dossier] [--simuler]
//   --verdict : où écrire le verdict en markdown (corps de la PR). Par défaut à côté de l'article, dans $TMPDIR/seo-engine.
//   --dry : n'écrit l'article corrigé que dans --out, ne touche pas à content/.
//   --simuler : aucun appel à l'API, réponses factices (essai de la mécanique sans clé ni dépense).
// Le fichier de faits n'est jamais modifié. Sortie GitHub : verdict=pret|humain, cout.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";
import { citations, controler, typeDePage, verifierSources } from "./lib/checks.mjs";
import { apiKey, coutDollars, rediger } from "./lib/claude.mjs";
import { CHAMPS_ARTICLE, boucle, contexte, cumulCout, verdictMarkdown } from "./lib/relecture.mjs";
import { CONTENU, MOTEUR, ciblesDeLiens, concurrentsPour, ecrireJson, faitsPour, lireFile, lireJson, sortieGithub, systemeGuide } from "./lib/site.mjs";

const { values: opt } = parseArgs({
  options: {
    slug: { type: "string" },
    verdict: { type: "string" },
    dry: { type: "boolean", default: false },
    out: { type: "string" },
    model: { type: "string" },
    simuler: { type: "boolean", default: false },
  },
});
if (!opt.slug) throw new Error("usage : relire-article.mjs --slug <slug>");

const config = lireJson(join(MOTEUR, "config.json"));
if (opt.model) config.model = opt.model;
const schemaArticle = lireJson(join(MOTEUR, "article-output.schema.json"));
const file = lireFile();
const article = file.find((a) => a.slug === opt.slug);
if (!article) throw new Error(`slug inconnu dans la file : ${opt.slug}`);
const chemin = join(CONTENU, `${article.slug}.json`);
const fiche = lireJson(chemin);
const type = typeDePage(article);
const fp = faitsPour(article);
const cibles = ciblesDeLiens(file, article);
// Page comparative : les fichiers des acteurs remplacent le fichier de faits (sans « exclus », jamais affiché)
const concurrents = concurrentsPour(article);
const faitsComparatif = article.concurrents?.length
  ? Object.values(concurrents).map(({ exclus, aRelire, ...publics }) => publics)
  : undefined;
console.log(`Relecture ${article.slug} · type ${type}${fp?.faits ? ` · faits ${fp.nom}` : ""}${opt.simuler ? " · SIMULATION" : ""}`);

const ctx = contexte({
  meta: { slug: article.slug, title: article.title, type, primaryKeyword: article.primaryKeyword, keywordCluster: article.keywordCluster, reader: article.reader },
  faits: fp?.faits ?? faitsComparatif,
  liens: [...[...cibles].map(([c, t]) => `${c} : ${t}`), `Pages produit (2 liens maximum) : ${config.pagesProduit.join(", ")}`],
});

async function controle(out) {
  const c = controler(out, { article, type, faits: fp?.faits, concurrents, cibles, pagesProduit: config.pagesProduit });
  const s = await verifierSources(out.sources ?? [], citations(out.contentHtml ?? ""));
  return { erreurs: [...c.erreurs, ...s.erreurs], avertissements: [...c.avertissements, ...s.avertissements] };
}

// Réponses factices : un point de détail, une correction qui ne change rien, un verdict « prêt »
function simulation(role) {
  const json = {
    relecteur: { points: [{ gravite: "A_CORRIGER", angle: "copy", extrait: "(simulation)", correction: "(simulation)" }] },
    correcteur: { ...Object.fromEntries(CHAMPS_ARTICLE.map((k) => [k, fiche[k]])), decision_humaine: [], non_appliques: [] },
    verificateur: { verdict: "pret", resume: "Simulation : aucun appel au modèle.", restes: [] },
  }[role];
  return { json, usage: {}, stopReason: "end_turn" };
}

const system = systemeGuide();
const key = opt.simuler ? null : apiKey();
async function appeler(role, message, schema) {
  if (opt.simuler) return simulation(role);
  const t0 = Date.now();
  const r = await rediger({ apiKey: key, model: config.model, maxTokens: config.maxTokens, system, message, schema });
  console.log(`  ${role} : ${Math.round((Date.now() - t0) / 1000)} s · ${r.usage.output_tokens} tokens en sortie · ${coutDollars(r.usage, config.model).toFixed(2)} $`);
  return r;
}

const usages = [];
let r;
try {
  r = await boucle({ fiche, ctx, schemaArticle, appeler, controle, log: (m) => console.log(m), usages });
} catch (e) {
  // le coût est affiché même si la boucle s'arrête en route (le lot de nuit le compte dans le plafond)
  console.log(`Coût estimé : ${cumulCout(usages, coutDollars, config.model).toFixed(2)} $`);
  throw e;
}
const cout = cumulCout(usages, coutDollars, config.model);

// Article corrigé : seulement s'il a changé ; la trace de la boucle va dans moteur.relecture
if (r.fiche !== fiche) {
  r.fiche.moteur = {
    ...r.fiche.moteur,
    avertissements: r.avertissements,
    relecture: { verdict: r.verdict, tours: r.tours, model: config.model, le: new Date().toISOString() },
  };
  const dossier = opt.dry ? opt.out ?? join(process.env.TMPDIR ?? "/tmp", "seo-engine") : CONTENU;
  mkdirSync(dossier, { recursive: true });
  ecrireJson(join(dossier, `${article.slug}.json`), r.fiche);
  console.log(`Article corrigé écrit : ${join(dossier, `${article.slug}.json`)}`);
}

const md = verdictMarkdown(r, { model: config.model, cout });
const cible = opt.verdict ?? join(opt.out ?? join(process.env.TMPDIR ?? "/tmp", "seo-engine"), `${article.slug}.verdict.md`);
mkdirSync(dirname(cible), { recursive: true });
writeFileSync(cible, md + "\n");
console.log(`Verdict : ${r.verdict} (${r.tours} tour(s)) · écrit dans ${cible}`);
console.log(`Coût estimé : ${cout.toFixed(2)} $`);
sortieGithub({ verdict: r.verdict, cout_relecture: cout.toFixed(2) });
