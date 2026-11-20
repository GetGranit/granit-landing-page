// Ce dépôt est public : le contenu publié (content/), les notes du moteur SEO
// (scripts/) et les données de /pec ne citent pas le code produit privé ni ne
// laissent lire le volume d'activité de Granit.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RACINE = join(import.meta.dirname, "..");
const MOTIFS = [
  /GetGranit\/granit@/,
  /granit@[0-9a-f]{7}\b/,
  /granit_shared/,
  /name_options_/,
  /\b[a-z_]+\.py:\d+/,
  /\b(platforms|routing|classify|fields|verdict|canaux|payments|constants)\.py\b/,
  /tp_facturation/,
  /granit_readonly/,
  /motif_refus/,
];

function fichiers(dossier: string): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    if (nom === "node_modules") return [];
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : [chemin];
  });
}

test("content/ et scripts/ ne citent pas le code produit privé", () => {
  const trouves: string[] = [];
  for (const base of ["content", "scripts"])
    for (const f of fichiers(join(RACINE, base))) {
      if (!/\.(json|md|mjs|js|ts|txt)$/.test(f)) continue;
      const texte = readFileSync(f, "utf8");
      for (const m of MOTIFS) if (m.test(texte)) trouves.push(`${relative(RACINE, f)} (${m})`);
    }
  assert.deepEqual(trouves, []);
});

test("estimations.json : des fourchettes, aucun effectif", () => {
  const texte = readFileSync(join(RACINE, "src/lib/pec/estimations.json"), "utf8");
  assert.doesNotMatch(texte, /"n(_total)?"\s*:/);
});
