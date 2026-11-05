// La porte de l'aperçu : dev et prévisualisation Vercel seulement, partagée avec les Ressources.
import { test } from "node:test";
import assert from "node:assert/strict";
import { apercuAutorise } from "../../scripts/ressources/en-ligne.mjs";

test("build sans environnement : pas d'aperçu", () => {
  assert.equal(apercuAutorise("build", {}), false);
});

test("build de production : pas d'aperçu", () => {
  assert.equal(apercuAutorise("build", { VERCEL_ENV: "production" }), false);
});

test("build de prévisualisation Vercel : aperçu", () => {
  assert.equal(apercuAutorise("build", { VERCEL_ENV: "preview" }), true);
});

test("serveur de dev : aperçu", () => {
  assert.equal(apercuAutorise("serve", {}), true);
});
