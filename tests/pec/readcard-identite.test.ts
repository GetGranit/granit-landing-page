// La lecture de l'identité n'est rendue que si le NIR est bien formé, de bonne clé et
// cohérent avec la date (NIR fictifs). `node --experimental-strip-types --test tests/pec/*.test.ts`
import { test } from "node:test";
import assert from "node:assert/strict";
import { dateValide, nirCoherentAvecDate, nirValide } from "../../src/lib/pec/simulation.ts";

test("NIR fictif de la carte d'exemple : clé valide, cohérent avec 12/05/1985", () => {
  assert.equal(nirValide("285057800608441"), true);
  assert.equal(dateValide("12/05/1985"), true);
  assert.equal(nirCoherentAvecDate("285057800608441", "12/05/1985"), true);
});
test("un n° d'adhérent pris pour un NIR est rejeté", () => {
  assert.equal(nirValide("00482117"), false);
  assert.equal(nirValide("285057800608442"), false);
});
