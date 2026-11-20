// `node --experimental-strip-types --test tests/pec/*.test.ts`
// On ne route que sur ce que la carte nomme en toutes lettres (portail, réseau) :
// aucune table mutuelle → portail dans ce dépôt public.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EXAMPLE_CARD,
  resolveCard,
  searchPortails,
  type Resolution,
} from "../../src/lib/pec/resolve.ts";

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

test("gérée par SP Santé → SP Santé", () => {
  assert.deepEqual(ids(resolveCard({ ...base, assureur: "AXA", gestionnaire: "SP santé" })), [
    "sp_sante",
  ]);
});
test("iSanté sur la ligne optique → iSanté", () => {
  assert.deepEqual(ids(resolveCard({ ...base, assureur: "Mutuelle X", tp_optique: "iSanté" })), [
    "isante",
  ]);
});
test("réseau Kalixia → Kalixia, traité sur Viamédis (simulable)", () => {
  const r = resolveCard({ ...base, reseau: "Kalixia", tp_optique: "KALIXIA" });
  assert.equal(r.kind, "unique");
  assert.equal(r.kind === "unique" && r.platform.id, "kalixia");
  assert.equal(r.kind === "unique" && r.platform.reseau_via, "viamedis");
  assert.equal(r.kind === "unique" && r.platform.simulable, true);
});
test("la carte d'exemple trouve toujours son portail", () => {
  assert.equal(resolveCard(EXAMPLE_CARD).kind, "unique");
});
test("deux portails nommés → on demande", () => {
  assert.deepEqual(
    ids(resolveCard({ ...base, gestionnaire: "Almerys", tp_optique: "Santéclair" })).sort(),
    ["almerys", "santeclair"],
  );
});
test("seulement le nom de la mutuelle → inconnu (Paul répond)", () => {
  for (const assureur of ["MGEN", "HARMONIE MUTUELLE", "CGRM", "MUTUELLE INCONNUE"])
    assert.equal(resolveCard({ ...base, assureur }).kind, "inconnu", assureur);
});
test("carte vide → inconnu", () => {
  assert.equal(resolveCard(base).kind, "inconnu");
});

test("recherche de portail : accents et casse indifférents", () => {
  const r = searchPortails("viamedis");
  assert.equal(r[0]?.nom, "Viamédis");
  assert.deepEqual(r[0]?.platforms, ["viamedis"]);
  assert.deepEqual(searchPortails("VIAMÉDIS"), r);
  assert.deepEqual(searchPortails("tp+")[0]?.platforms, ["santeclair"]);
});
test("recherche de portail : trop court ou nom de mutuelle → []", () => {
  assert.deepEqual(searchPortails("v"), []);
  assert.deepEqual(searchPortails("Harmonie Mutuelle"), []);
  assert.ok(searchPortails("a", 3).length <= 3);
});
