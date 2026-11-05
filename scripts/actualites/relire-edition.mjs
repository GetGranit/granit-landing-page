#!/usr/bin/env node
// Relit une édition avec l'agent de relecture et écrit un rapport. Ne modifie aucun contenu.
// Usage : node scripts/actualites/relire-edition.mjs --slug <slug> [--rapport fichier.md] [--simuler]
//   --simuler : aucun appel à l'API ni au réseau (essai de la mécanique sans clé ni dépense).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { apiKey, coutDollars, rediger } from "../seo-engine/lib/claude.mjs";
import { cumulCout } from "../seo-engine/lib/relecture.mjs";
import { sectionsTon } from "../seo-engine/lib/site.mjs";
import { lireEditions } from "./en-ligne.mjs";
import { lireSources, rapportMarkdown, relire } from "./relecture.mjs";

const { values: opt } = parseArgs({
  options: {
    slug: { type: "string" },
    rapport: { type: "string" },
    simuler: { type: "boolean", default: false },
  },
});
if (!opt.slug) throw new Error("usage : relire-edition.mjs --slug <slug>");

const racine = resolve(import.meta.dirname, "../..");
const edition = lireEditions(racine).find((e) => e.slug === opt.slug);
if (!edition) throw new Error(`édition inconnue : ${opt.slug}`);

const { model, maxTokens } = JSON.parse(
  readFileSync(join(racine, "scripts/seo-engine/config.json"), "utf8"),
);
const date = new Date().toISOString().slice(0, 10);
const system = `Le ton de la marque Granit :\n\n${sectionsTon()}`;

function simulation(role) {
  const json = {
    relecteur: { points: [], decision_humaine: [], notes: [] },
    "contre-relecteur": { restes: [], ecartes: [], resume: "Simulation : aucun appel au modèle." },
  }[role];
  return { json, usage: {}, stopReason: "end_turn" };
}

const key = opt.simuler ? null : apiKey();
const appeler = (role, message, schema) =>
  opt.simuler
    ? simulation(role)
    : rediger({ apiKey: key, model, maxTokens, system, message, schema });

const sources = opt.simuler ? [] : edition.sources;
const pages = await lireSources(sources);
console.log(
  `Relecture ${opt.slug} · ${pages.filter((p) => p.texte).length} source(s) lue(s) sur ${pages.length}`,
);
const r = await relire({ edition, pages, date, appeler, log: (m) => console.log(m) });

const cout = cumulCout(r.usages, coutDollars, model);
const cible =
  opt.rapport ?? join(process.env.TMPDIR ?? "/tmp", "actualites", `${opt.slug}.relecture.md`);
mkdirSync(dirname(cible), { recursive: true });
writeFileSync(cible, `${rapportMarkdown(r, { slug: opt.slug, model, cout, date })}\n`);
console.log(`Verdict : ${r.verdict} · rapport : ${cible} · coût estimé : ${cout.toFixed(2)} $`);
