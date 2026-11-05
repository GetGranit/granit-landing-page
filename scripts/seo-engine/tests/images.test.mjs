// node --test scripts/seo-engine/tests/
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { EXCEPTIONS_IMAGES, PLAFONDS_IMAGES, imagesTropLourdes } from "../../ressources/en-ligne.mjs";
import { RACINE } from "../lib/site.mjs";

const KO = 1024;

function depot(fichiers) {
  const racine = mkdtempSync(join(tmpdir(), "images-"));
  for (const [chemin, taille] of Object.entries(fichiers)) {
    mkdirSync(join(racine, chemin, ".."), { recursive: true });
    writeFileSync(join(racine, chemin), Buffer.alloc(taille));
  }
  return racine;
}

test("les images du dépôt respectent leur plafond", () => {
  assert.deepEqual(imagesTropLourdes(RACINE), []);
});

test("image trop lourde : refusée, sous-dossiers compris, autres fichiers ignorés", () => {
  const racine = depot({
    "public/logos/ok.png": PLAFONDS_IMAGES["public/logos"],
    "public/logos/annuaire/lourd.PNG": PLAFONDS_IMAGES["public/logos"] + 1,
    "public/ressources/themes/lourd.jpg": 301 * KO,
    "public/ressources/notes.json": 400 * KO,
  });
  assert.deepEqual(imagesTropLourdes(racine).sort(), [
    "public/logos/annuaire/lourd.PNG : 61 Ko (60 Ko maximum)",
    "public/ressources/themes/lourd.jpg : 301 Ko (300 Ko maximum)",
  ]);
  rmSync(racine, { recursive: true });
});

test("exception : tolérée à son poids, jamais au-delà", () => {
  const chemin = "public/logos/annuaire/harmonie-mutuelle.svg";
  const permis = depot({ [chemin]: EXCEPTIONS_IMAGES[chemin] });
  assert.deepEqual(imagesTropLourdes(permis), []);
  rmSync(permis, { recursive: true });
  const alourdi = depot({ [chemin]: EXCEPTIONS_IMAGES[chemin] + KO });
  assert.equal(imagesTropLourdes(alourdi).length, 1);
  rmSync(alourdi, { recursive: true });
});

test("dossier absent : rien à contrôler", () => {
  const racine = depot({});
  assert.deepEqual(imagesTropLourdes(racine), []);
  rmSync(racine, { recursive: true });
});
