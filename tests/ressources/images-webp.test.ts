// Un <source> WebP absent ne retombe pas sur le JPEG : l'image serait cassée. Toute photo de thème
// ou de métier doit donc avoir son WebP, aux deux largeurs (npm run images).
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const racine = join(import.meta.dirname, "../../public/ressources");

for (const dossier of ["themes", "metiers"]) {
  test(`chaque photo de ${dossier} a son WebP`, () => {
    const noms = readdirSync(join(racine, dossier));
    const jpeg = noms.filter((n) => n.endsWith(".jpg"));
    assert.ok(jpeg.length > 0);
    for (const n of jpeg) {
      assert.match(n, /-(800|1600)\.jpg$/);
      assert.ok(noms.includes(n.replace(/\.jpg$/, ".webp")), `${n} sans WebP : npm run images`);
    }
  });
}
