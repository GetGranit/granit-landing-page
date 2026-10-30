#!/usr/bin/env node
// Repasse les contrôles du moteur sur des articles déjà écrits (après une correction à la main ou par un agent,
// sur chaque PR qui touche content/ressources, et chaque lundi sur tout le site).
// Usage : node scripts/seo-engine/verifier-article.mjs portail-almerys [autre-slug …]
//         node scripts/seo-engine/verifier-article.mjs --tous [--resume fichier.md]
// Sortie 0 si aucune erreur, 1 sinon. Les avertissements sont affichés sans bloquer.
// --resume écrit la liste des articles en erreur (une ligne par article) pour Slack ou le résumé GitHub.
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { citations, controler, typeDePage, verifierSources } from "./lib/checks.mjs";
import { CONTENU, MOTEUR, ciblesDeLiens, concurrentsPour, faitsPour, lireFile, lireJson } from "./lib/site.mjs";

const args = process.argv.slice(2);
const iResume = args.indexOf("--resume");
const resume = iResume >= 0 ? args.splice(iResume, 2)[1] : null;
const tous = args.includes("--tous");
const config = lireJson(join(MOTEUR, "config.json"));
const file = lireFile();

const slugs = tous
  ? readdirSync(CONTENU).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort()
  : args.filter((a) => !a.startsWith("--"));
if (!slugs.length) throw new Error("usage : verifier-article.mjs <slug> [slug …] | --tous [--resume fichier]");

async function verifier(slug) {
  const article = file.find((a) => a.slug === slug);
  if (!article) return { slug, erreurs: [`slug inconnu dans la file : ${slug}`], avert: [], nbMots: 0 };
  const chemin = join(CONTENU, `${slug}.json`);
  if (!existsSync(chemin)) return { slug, erreurs: [`fichier absent : content/ressources/${slug}.json`], avert: [], nbMots: 0 };
  const out = lireJson(chemin);
  const c = controler(out, {
    article,
    type: typeDePage(article),
    faits: faitsPour(article)?.faits,
    concurrents: concurrentsPour(article),
    cibles: ciblesDeLiens(file, article),
    pagesProduit: config.pagesProduit,
  });
  const s = await verifierSources(out.sources ?? [], citations(out.contentHtml ?? ""));
  // Liens de connexion à l'espace pro (en tête des pages plateforme) : une adresse morte est une erreur.
  // Certains portails refusent les robots (403) : seulement un avertissement.
  const liensAcces = typeDePage(article) === "plateforme" ? (faitsPour(article)?.faits?.acces?.liens ?? []) : [];
  const a = await verifierSources(liensAcces);
  const acces = (m) => `accès espace pro, ${m.replace(/^source /, "lien ")}`;
  return {
    slug,
    erreurs: [...c.erreurs, ...s.erreurs, ...a.erreurs.map(acces)],
    // une page de connexion est presque toujours rendue en JavaScript : pas de citation à y vérifier
    avert: [...c.avertissements, ...s.avertissements, ...a.avertissements.filter((m) => !m.includes("rendue en JavaScript")).map(acces)],
    nbMots: c.nbMots,
  };
}

const resultats = [];
for (const slug of slugs) {
  const r = await verifier(slug);
  resultats.push(r);
  console.log(`${slug} · ${r.nbMots} mots · ${r.erreurs.length} erreur(s) · ${r.avert.length} avertissement(s)`);
  r.erreurs.forEach((e) => console.log(`  ✗ ${e}`));
  r.avert.forEach((a) => console.log(`  ! ${a}`));
}

const enErreur = resultats.filter((r) => r.erreurs.length);
if (slugs.length > 1) console.log(`\n${slugs.length - enErreur.length}/${slugs.length} article(s) conforme(s)`);
if (resume)
  writeFileSync(resume, enErreur.map((r) => `• ${r.slug} : ${r.erreurs.join(" ; ")}`).join("\n") + (enErreur.length ? "\n" : ""));
process.exit(enErreur.length ? 1 : 0);
