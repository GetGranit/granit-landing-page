#!/usr/bin/env node
// Repasse les contrôles du moteur sur un article déjà écrit (après une correction à la main ou par un agent).
// Usage : node scripts/seo-engine/verifier-article.mjs portail-almerys
// Sortie 0 si aucune erreur, 1 sinon. Les avertissements sont affichés sans bloquer.
import { join } from "node:path";
import { citations, controler, typeDePage, verifierSources } from "./lib/checks.mjs";
import { CONTENU, MOTEUR, ciblesDeLiens, faitsPour, lireFile, lireJson } from "./lib/site.mjs";

const slug = process.argv[2];
if (!slug) throw new Error("usage : verifier-article.mjs <slug>");

const config = lireJson(join(MOTEUR, "config.json"));
const file = lireFile();
const article = file.find((a) => a.slug === slug);
if (!article) throw new Error(`slug inconnu dans la file : ${slug}`);
const out = lireJson(join(CONTENU, `${slug}.json`));
const type = typeDePage(article);
const fp = faitsPour(article);

const cibles = ciblesDeLiens(file, article);

const c = controler(out, { article, type, faits: fp?.faits, cibles, pagesProduit: config.pagesProduit });
const s = await verifierSources(out.sources ?? [], citations(out.contentHtml ?? ""));
const erreurs = [...c.erreurs, ...s.erreurs];
const avert = [...c.avertissements, ...s.avertissements];
console.log(`${slug} · ${c.nbMots} mots · ${erreurs.length} erreur(s) · ${avert.length} avertissement(s)`);
erreurs.forEach((e) => console.log(`  ✗ ${e}`));
avert.forEach((a) => console.log(`  ! ${a}`));
process.exit(erreurs.length ? 1 : 0);
