// Page métier optique : chaque article lié depuis « Qu'est-ce qui coince ? » existe.
// Un slug renommé ou retiré ferait disparaître le lien sans bruit ; ce test le signale.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { PROBLEMES_SLUGS } from "../../src/lib/ressources/problemesOptique.ts";

test("chaque problème de la page optique pointe vers 2 ou 3 articles existants", () => {
  for (const [id, slugs] of Object.entries(PROBLEMES_SLUGS)) {
    assert.ok(slugs.length >= 2 && slugs.length <= 3, `${id} : ${slugs.length} articles`);
    for (const slug of slugs) {
      const fichier = new URL(`../../content/ressources/${slug}.json`, import.meta.url);
      assert.ok(existsSync(fichier), `${id} : ${slug} introuvable`);
    }
  }
});
