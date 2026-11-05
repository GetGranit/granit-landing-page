// Le vrai dossier content/actualites : forme de chaque fichier, quel que soit son statut.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import {
  lireEditions,
  metiersValides,
  pourAffichage,
  validerCollection,
  validerPublication,
  validerStructure,
} from "../../scripts/actualites/en-ligne.mjs";

const RACINE = fileURLToPath(new URL("../..", import.meta.url));
const editions = lireEditions(RACINE);
const metiers = metiersValides(RACINE);

test("chaque édition a une forme valide", () => {
  for (const e of editions) assert.deepEqual(validerStructure(e, metiers), [], e.slug);
});

test("un numéro n'existe qu'une fois", () => {
  assert.deepEqual(validerCollection(editions), []);
});

test("chaque édition publiée passe les contrôles de publication", () => {
  for (const e of editions.filter((x) => x.statut === "publie"))
    assert.deepEqual(validerPublication(e), [], e.slug);
});

test("aucune marque ni note de travail dans ce qui part vers le site", () => {
  for (const e of editions) {
    const texte = JSON.stringify(pourAffichage(e));
    assert.doesNotMatch(texte, /\[[^\]"]*\]|reste_a_verifier/, e.slug);
  }
});
