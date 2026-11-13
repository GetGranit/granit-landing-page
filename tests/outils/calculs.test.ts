// `node --experimental-strip-types --test tests/outils/*.test.ts`
// Les deux outils gratuits pour opticiens : calculs et contenu des mails.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compterHeures,
  dimanchesEnMots,
  euros,
  nettoyerNom,
  semainesAvantNoel,
  trierMarques,
} from "../../src/lib/outils/calculs.ts";
import {
  csvMarques,
  htmlMarques,
  lienRdv,
  texteHeures,
  texteMarques,
} from "../../src/lib/outils/mailOutils.ts";

const EXEMPLE = [
  { nom: "Marque A", stock: 120, ventes: 310, prixAchat: 62 },
  { nom: "Marque B", stock: 85, ventes: 140, prixAchat: 78 },
  { nom: "Marque C", stock: 140, ventes: 95, prixAchat: 55 },
  { nom: "Marque D", stock: 60, ventes: 22, prixAchat: 90 },
  { nom: "Marque E", stock: 45, ventes: 160, prixAchat: 48 },
  { nom: "Marque F", stock: 70, ventes: 0, prixAchat: 110 },
];
const COULEURS = {
  fond: "#FAF0F2",
  carte: "#FFFDFD",
  encadre: "#FAEAEF",
  texte: "#1F3530",
  secondaire: "#62716E",
  filet: "#E4E5E4",
  lien: "#2F7A64",
};

test("tri : les six marques d'exemple donnent les verdicts de la maquette", () => {
  const r = trierMarques(EXEMPLE);
  assert.deepEqual(
    r.lignes.map((l) => l.verdict),
    ["garder", "reduire", "sortir", "sortir", "garder", "sortir"],
  );
  assert.deepEqual(r.compte, { garder: 2, reduire: 1, sortir: 3 });
  // C : 45 pièces × 55 € ; D : 38 × 90 € ; F : 70 × 110 €.
  assert.equal(r.argentQuiDort, 2475 + 3420 + 7700);
  assert.equal(r.pire?.nom, "Marque F");
});

test("tri : mois de stock = stock ÷ ventes mensuelles, infini sans vente", () => {
  const r = trierMarques(EXEMPLE);
  assert.equal(r.lignes[2].moisDeStock.toFixed(1), "17.7");
  assert.equal(r.lignes[5].moisDeStock, Infinity);
});

test("tri : les seuils sont 6 mois (garder) et 12 mois inclus (réduire)", () => {
  const v = (stock: number) =>
    trierMarques([{ nom: "X", stock, ventes: 120, prixAchat: 10 }]).lignes[0].verdict;
  assert.equal(v(59), "garder");
  assert.equal(v(60), "reduire");
  assert.equal(v(120), "reduire");
  assert.equal(v(121), "sortir");
});

test("tri : la marge ne change pas le verdict, elle signale une marque lente qui marge bien", () => {
  const r = trierMarques([
    { nom: "Rapide", stock: 10, ventes: 100, prixAchat: 50, marge: 50 },
    { nom: "Lente", stock: 100, ventes: 20, prixAchat: 50, marge: 70 },
  ]);
  assert.equal(r.lignes[1].verdict, "sortir");
  assert.equal(r.lignes[1].margeARegarder, true);
  assert.equal(r.lignes[0].margeARegarder, false);
});

test("tri : saisies vides, négatives ou absurdes ne cassent rien", () => {
  const r = trierMarques([
    { nom: "", stock: NaN, ventes: -4, prixAchat: 10 },
    { nom: "<b>Gras</b> http://x.fr", stock: 5, ventes: 0, prixAchat: -3 },
  ]);
  assert.equal(r.lignes.length, 1);
  assert.equal(r.lignes[0].nom, "b Gras b http x.fr");
  assert.equal(r.argentQuiDort, 0);
});

test("nettoyerNom : court, sans balise, avec un repli", () => {
  assert.equal(nettoyerNom("  Ray & Co'  ", "Marque 1"), "Ray & Co'");
  assert.equal(nettoyerNom("", "Marque 1"), "Marque 1");
  assert.equal(nettoyerNom("a".repeat(80), "x").length, 40);
});

test("heures : 60 ventes, 70 % de tiers payant, 12 min, 6 semaines = 50 heures", () => {
  const r = compterHeures({
    ventesParSemaine: 60,
    partTiersPayant: 70,
    minutesParDossier: 12,
    semaines: 6,
  });
  assert.equal(Math.round(r.dossiers), 252);
  assert.equal(Math.round(r.heures), 50);
  assert.equal(dimanchesEnMots(r.dimanches), "7 dimanches");
});

test("heures : la part est bornée à 100 %, une saisie vide donne zéro", () => {
  const plein = { ventesParSemaine: 10, minutesParDossier: 60, semaines: 1 };
  assert.equal(compterHeures({ ...plein, partTiersPayant: 250 }).heures, 10);
  assert.equal(compterHeures({ ...plein, partTiersPayant: NaN }).heures, 0);
});

test("dimanches en mots", () => {
  assert.equal(dimanchesEnMots(0.1), "moins d’un demi-dimanche");
  assert.equal(dimanchesEnMots(0.5), "un demi-dimanche");
  assert.equal(dimanchesEnMots(1), "1 dimanche");
  assert.equal(dimanchesEnMots(2.6), "2,5 dimanches");
  assert.equal(dimanchesEnMots(14.4), "14 dimanches");
});

test("semaines avant Noël : au moins 1, même après le 25", () => {
  assert.equal(semainesAvantNoel(new Date(2026, 10, 13)), 6);
  assert.equal(semainesAvantNoel(new Date(2026, 11, 20)), 1);
  assert.equal(semainesAvantNoel(new Date(2026, 11, 28)), 1);
});

test("euros : milliers séparés, espace insécable avant le symbole", () => {
  assert.equal(euros(13595).replace(/[  ]/g, " "), "13 595 €");
});

test("mail marques : le résumé, le verdict de chaque marque et le lien de RDV tracé", () => {
  const r = trierMarques(EXEMPLE);
  const texte = texteMarques("Claire", r, 4000);
  assert.match(texte, /^Bonjour Claire,/);
  assert.match(texte, /surtout sur Marque F/);
  assert.match(texte, /- Marque C : 17,7 mois de stock, sortir/);
  assert.match(texte, /utm_source=lead-magnet&utm_medium=email&utm_campaign=tri-des-marques/);
  // Ni prix ni nom de client dans le mail.
  assert.doesNotMatch(texte, /tarif|abonnement|par mois,/i);
  assert.equal(lienRdv("x").includes("cal.com/paul-pietra-granit"), true);
});

test("mail marques : le HTML échappe les noms saisis", () => {
  const r = trierMarques([{ nom: "A & B", stock: 10, ventes: 1, prixAchat: 5 }]);
  const html = htmlMarques(COULEURS, "", r, 0);
  assert.match(html, /A &amp; B/);
  assert.doesNotMatch(html, /<script/);
});

test("csv : point-virgule, virgule décimale, BOM, et pas de formule Excel", () => {
  const r = trierMarques([
    { nom: "+Plus", stock: 140, ventes: 95, prixAchat: 55.5 },
    ...EXEMPLE.slice(0, 1),
  ]);
  const csv = csvMarques(r);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  const lignes = csv.slice(1).trim().split("\r\n");
  assert.equal(lignes.length, 3);
  assert.equal(lignes[0].split(";").length, 9);
  assert.match(lignes[1], /^'\+Plus;140;95;55,50;;17,7;/);
});

test("mail heures : le calcul et la liste des tâches", () => {
  const s = { ventesParSemaine: 60, partTiersPayant: 70, minutesParDossier: 12, semaines: 6 };
  const texte = texteHeures("", s, compterHeures(s));
  assert.match(texte, /^Bonjour,/);
  assert.match(texte, /50 heures d'ici Noël/);
  assert.match(texte, /pointer les virements reçus/);
});
