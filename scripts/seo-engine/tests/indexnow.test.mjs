import assert from "node:assert/strict";
import { test } from "node:test";
import { CLE, corps, slugsTouches } from "../lib/indexnow.mjs";

test("slugsTouches : articles modifiés + anciens remplacés, le reste ignoré", () => {
  const fiches = { neuf: { remplace: ["ancien-a", "ancien-b"] }, refonte: {} };
  const s = slugsTouches(
    ["content/ressources/neuf.json", "content/ressources/refonte.json", "content/apercu/ressources/x.json", "src/a.ts"],
    (slug) => fiches[slug],
  );
  assert.deepEqual(s, ["neuf", "ancien-a", "ancien-b", "refonte"]);
});

test("slugsTouches : article supprimé (fiche absente) gardé", () => {
  assert.deepEqual(slugsTouches(["content/ressources/parti.json"], () => null), ["parti"]);
});

test("corps : host, clé, emplacement de la clé, URL dédoublonnées", () => {
  const c = corps("https://www.getgranit.ai", ["https://www.getgranit.ai/a", "https://www.getgranit.ai/a"]);
  assert.equal(c.host, "www.getgranit.ai");
  assert.equal(c.keyLocation, `https://www.getgranit.ai/${CLE}.txt`);
  assert.deepEqual(c.urlList, ["https://www.getgranit.ai/a"]);
});
