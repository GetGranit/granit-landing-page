// Ce dépôt est public : aucun renvoi au code produit privé (chemins, numéros de
// ligne, catalogues de portail, tables de la base) dans src/ ni tests/.
// Le contenu des articles (content/, scripts/seo-engine/) n'est pas couvert ici.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RACINE = join(import.meta.dirname, "..", "..");
const MOI = relative(RACINE, import.meta.filename);
const MOTIFS = [
  /GetGranit\/granit@/,
  /granit_shared/,
  /name_options_/,
  /\b[a-z_]+\.py:\d+/,
  /\b(routing|platforms|classify)\.py\b/,
  /tp_facturation/,
  /granit_readonly/,
];

function fichiers(dossier: string): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : [chemin];
  });
}

test("src/ et tests/ ne citent pas le code produit privé", () => {
  const trouves: string[] = [];
  for (const base of ["src", "tests"])
    for (const f of fichiers(join(RACINE, base))) {
      const rel = relative(RACINE, f);
      if (rel === MOI || !/\.(ts|tsx|js|mjs|json|txt|md|css)$/.test(f)) continue;
      const texte = readFileSync(f, "utf8");
      for (const m of MOTIFS) if (m.test(texte)) trouves.push(`${rel} (${m})`);
    }
  assert.deepEqual(trouves, []);
});
