// Tests node:test (Node ≥ 22) : `node --experimental-strip-types --test classify.test.ts`
// (voir README.txt). Les attentes de candidatesForCard sont celles du Python
// `candidates_for_card(..., metier="optique")` sur des cartes FICTIVES, figées par
// pec-export.py dans classify.oracle.json — le port doit rendre exactement la même liste.
import { test } from "node:test";
import assert from "node:assert/strict";
import { candidatesForCard, searchMutuelles, type Card } from "../../src/lib/pec/classify.ts";
import oracle from "./classify.oracle.json" with { type: "json" };
import platforms from "../../src/lib/pec/platforms.json" with { type: "json" };

const CAS: Record<string, { card: Card; expected: string[] }> = {
  "Kalixia nommé en colonne OPTI → Viamédis (opérateur optique), puis Oxantis (oxantis.net)": oracle[0],
  "réseau Kalixia seul → Viamédis": oracle[1],
  "Groupama en optique → portail Groupama (TPG), jamais Sévéane": oracle[2],
  "MGEN, ambiguë : Viamédis puis Oxantis": oracle[3],
  "HELIUM, ambiguë sur 3 catalogues": oracle[4],
  "mutuelle inconnue → [] (gère seule)": oracle[5],
  "gestionnaire Almerys l'emporte sur une marque inconnue": oracle[6],
  "Santéclair TP+": oracle[7],
  "MCA : alias exact sur le champ entier": oracle[9],
  "MCA : nom long": oracle[10],
  "Matmut → Ociane Matmut": oracle[11],
  "champ TP (Viamédis) avant la marque (Groupama)": oracle[12],
  "réseau Carte Blanche en tête, puis les catalogues de la marque": oracle[13],
  "CGRM n'a pas d'alias : seul le catalogue Viamédis le connaît": oracle[14],
  "carte vide → []": oracle[17],
};

for (const [nom, { card, expected }] of Object.entries(CAS)) {
  test(nom, () => assert.deepEqual(candidatesForCard(card), expected));
}

test("tout l'oracle Python passe", () => {
  for (const { card, expected } of oracle) assert.deepEqual(candidatesForCard(card), expected, JSON.stringify(card));
});

test("chaque id rendu existe dans platforms.json", () => {
  const ids = new Set(platforms.platforms.map((p) => p.id));
  for (const { card } of oracle) for (const id of candidatesForCard(card)) assert.ok(ids.has(id), id);
});

test("seuls Viamédis, Kalixia, Génération et EMOA sont simulables", () => {
  const sim = platforms.platforms.filter((p) => p.simulable).map((p) => p.id).sort();
  assert.deepEqual(sim, ["emoa", "generation", "kalixia", "viamedis"]);
});

test("recherche tolérante aux accents et à la casse", () => {
  const r = searchMutuelles("agrica");
  assert.ok(r.length > 0 && r[0].nom.toUpperCase().startsWith("AGRICA"));
  assert.deepEqual(searchMutuelles("AGRICA"), searchMutuelles("ágrica"));
});

test("recherche : trop court ou inconnu → []", () => {
  assert.deepEqual(searchMutuelles("a"), []);
  assert.deepEqual(searchMutuelles("zzzz mutuelle inexistante"), []);
  assert.ok(searchMutuelles("e", 8).length === 0 && searchMutuelles("mut", 3).length <= 3);
});
