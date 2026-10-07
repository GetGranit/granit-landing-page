// `node --experimental-strip-types --test tests/pec/*.test.ts`
// Garde-fou de l'affichage : ce que la carte nomme en toutes lettres passe avant
// le routage produit (SP Santé n'y a aucun alias, iSanté sort d'abord Viamédis).
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveCard, type Resolution } from "../../src/lib/pec/resolve.ts";

const base = {
  est_carte_tp: true,
  lisible: true,
  assureur: null,
  gestionnaire: null,
  reseau: null,
  tp_optique: null,
  amc: null,
  fin_droits: null,
};
const ids = (r: Resolution) =>
  r.kind === "unique"
    ? [r.platform.id]
    : r.kind === "plusieurs"
      ? r.platforms.map((p) => p.id)
      : [];

test("gérée par SP Santé → SP Santé, jamais « PEC Viamédis prête »", () => {
  assert.deepEqual(ids(resolveCard({ ...base, assureur: "AXA", gestionnaire: "SP santé" })), [
    "sp_sante",
  ]);
});
test("iSanté nommé → on demande, iSanté en premier", () => {
  assert.deepEqual(ids(resolveCard({ ...base, assureur: "Mutuelle X", tp_optique: "iSanté" })), [
    "isante",
    "viamedis",
  ]);
});
test("réseau Kalixia → Viamédis seul (simulable)", () => {
  const r = resolveCard({ ...base, reseau: "Kalixia", tp_optique: "KALIXIA" });
  assert.equal(r.kind, "unique");
  assert.equal(r.kind === "unique" && r.platform.simulable, true);
});
test("CGRM → portail CGRM, plus Viamédis", () => {
  assert.deepEqual(ids(resolveCard({ ...base, assureur: "CGRM" })), ["cgrm"]);
});
test("MGEN → deux portails, on ne devine pas", () => {
  assert.deepEqual(ids(resolveCard({ ...base, assureur: "MGEN" })), ["viamedis", "oxantis"]);
});
