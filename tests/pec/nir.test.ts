// `node --experimental-strip-types --test tests/pec/*.test.ts`
// Contrôles de l'écran « Le patient ». Tous les NIR ci-dessous sont fictifs,
// calculés pour l'occasion (clé = 97 - (13 premiers chiffres mod 97)).
import { test } from "node:test";
import assert from "node:assert/strict";
import { dateValide, nirCoherentAvecDate, nirValide } from "../../src/lib/pec/simulation.ts";

test("NIR fictif avec la bonne clé → valide, espaces tolérés", () => {
  assert.equal(nirValide("185057800608491"), true);
  assert.equal(nirValide("1 85 05 78 006 084 91"), true);
  assert.equal(nirValide("290019912345636"), true);
});
test("mauvaise clé ou mauvaise longueur → refusé", () => {
  assert.equal(nirValide("185057800608492"), false);
  assert.equal(nirValide("18505780060849"), false);
  assert.equal(nirValide("5850578006084" + "91"), false);
});
test("Corse : 2A compte 19, 2B compte 18", () => {
  assert.equal(nirValide("185052A01234579"), true);
  assert.equal(nirValide("185052b01234509"), true);
  assert.equal(nirValide("185052A01234509"), false);
});
test("date de naissance JJ/MM/AAAA réelle et passée", () => {
  assert.equal(dateValide("12/05/1985"), true);
  assert.equal(dateValide("31/02/1985"), false);
  assert.equal(dateValide("1985-05-12"), false);
  assert.equal(dateValide("01/01/2999"), false);
});
test("l'année du NIR doit correspondre à la date", () => {
  assert.equal(nirCoherentAvecDate("185057800608491", "12/05/1985"), true);
  assert.equal(nirCoherentAvecDate("185057800608491", "12/05/1986"), false);
});
