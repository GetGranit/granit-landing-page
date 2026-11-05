// Mise en page sans contenu complet : avec ou sans relevé, une seule édition, filtre.
import { test } from "node:test";
import assert from "node:assert/strict";
import { metiersPresents, repartir, tempsLecture } from "../../src/lib/actualites/rangement.ts";
import { finDe } from "../../src/lib/actualites/textes.ts";
import type { FicheEdition, Format } from "../../src/lib/actualites/types.ts";
import type { VerticaleSlug } from "../../src/lib/ressources/types.ts";

const f = (
  numero: number,
  format: Format = "ce-qui-change",
  metiers: VerticaleSlug[] = ["optique"],
): FicheEdition => ({
  slug: `e${numero}`,
  numero,
  format,
  fait: "x",
  titre: "x",
  chapo: "x",
  metiers,
  datePublished: "2026-11-05",
  dateModified: "2026-11-05",
  lecture: 2,
  statut: "publie",
});
const numeros = (l: FicheEdition[]) => l.map((x) => x.numero);

test("sans relevé : la deuxième édition passe à côté de la une", () => {
  const r = repartir([f(1), f(3), f(2)]);
  assert.equal(r.une?.numero, 3);
  assert.equal(r.cote?.numero, 2);
  assert.equal(r.releve, null);
  assert.deepEqual(numeros(r.grille), [1]);
});

test("avec relevé : il sort de la grille et prend la place d'à côté", () => {
  const r = repartir([f(1), f(4), f(3, "le-releve"), f(2)]);
  assert.equal(r.une?.numero, 4);
  assert.equal(r.cote, null);
  assert.equal(r.releve?.numero, 3);
  assert.deepEqual(numeros(r.grille), [2, 1]);
});

test("une seule édition : la une, rien d'autre", () => {
  const r = repartir([f(1)]);
  assert.equal(r.une?.numero, 1);
  assert.equal(r.cote, null);
  assert.deepEqual(r.grille, []);
});

test("aucune édition : rien ne casse", () => {
  assert.deepEqual(repartir([]), { une: null, cote: null, releve: null, grille: [] });
});

test("filtre actif : ni une ni relevé", () => {
  const r = repartir([f(1, "ce-qui-change", ["pharmacie"]), f(3, "le-releve"), f(2)], "optique");
  assert.equal(r.une, null);
  assert.equal(r.releve, null);
  assert.deepEqual(numeros(r.grille), [3, 2]);
});

test("métiers présents, dans l'ordre donné", () => {
  const fiches = [f(1, "le-reflexe", ["pharmacie"]), f(2, "le-reflexe", ["centres", "optique"])];
  const ordre: VerticaleSlug[] = ["optique", "dentaire", "centres", "pharmacie", "cliniques"];
  assert.deepEqual(metiersPresents(fiches, ordre), ["optique", "centres", "pharmacie"]);
});

test("temps de lecture : au moins une minute, calculé sur les mots", () => {
  const vide = { chapo: "", change: [], qui: { texte: "" }, gestes: [], inconnu: [] };
  assert.equal(tempsLecture(vide), 1);
  assert.equal(tempsLecture({ ...vide, chapo: "mot ".repeat(600) }), 3);
});

test("fin d'édition : déclinaison du métier, repli sur la promesse", () => {
  assert.equal(finDe(["optique"]), "Vos opticiens conseillent.");
  assert.equal(finDe(["centres", "dentaire", "cliniques"]), "Vos équipes accueillent.");
  assert.equal(finDe(["pharmacie"]), "Vos équipes soignent.");
  assert.equal(finDe(["pharmacie"], "en"), "Your teams care.");
});
