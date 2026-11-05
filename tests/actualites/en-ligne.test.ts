// Sûreté de mise en ligne : un brouillon n'entre jamais en production, une édition incomplète
// ne se publie pas. Fixture : tests/actualites/fixture/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  editionsEnLigne,
  estMarque,
  lireContenu,
  lireEditions,
  metiersValides,
  pourAffichage,
  validerCollection,
  validerPublication,
  validerStructure,
} from "../../scripts/actualites/en-ligne.mjs";

const RACINE = fileURLToPath(new URL("./fixture", import.meta.url));
const METIERS = metiersValides(RACINE);
const modele = () => {
  const e = structuredClone(lireEditions(RACINE).find((x) => x.statut === "publie"));
  assert.ok(e);
  return e as unknown as Record<string, any>;
};

/** Racine temporaire avec un seul fichier d'édition. */
function avecFichier(nom: string, contenu: string, f: (racine: string) => void) {
  const racine = mkdtempSync(join(tmpdir(), "actualites-"));
  try {
    mkdirSync(join(racine, "content/actualites"), { recursive: true });
    writeFileSync(join(racine, "content/actualites", nom), contenu);
    f(racine);
  } finally {
    rmSync(racine, { recursive: true, force: true });
  }
}

test("le modèle de fixture passe tous les contrôles", () => {
  assert.deepEqual(validerStructure(modele(), METIERS), []);
  assert.deepEqual(validerPublication(modele()), []);
});

test("un brouillon est absent de editionsEnLigne", () => {
  assert.deepEqual(
    editionsEnLigne(RACINE).map((e) => e.slug),
    ["exemple-publie"],
  );
});

test("un brouillon est visible avec avecBrouillons, absent sans", () => {
  const avec = lireContenu(RACINE, { avecBrouillons: true }).editions.map((e) => e.slug);
  assert.deepEqual(avec, ["exemple-brouillon", "exemple-publie"]);
  const sans = lireContenu(RACINE).editions.map((e) => e.slug);
  assert.deepEqual(sans, ["exemple-publie"]);
});

test("un dossier sans édition ne casse rien", () => {
  const racine = mkdtempSync(join(tmpdir(), "actualites-"));
  try {
    assert.deepEqual(editionsEnLigne(racine), []);
  } finally {
    rmSync(racine, { recursive: true, force: true });
  }
});

for (const statut of ['"statut": "publié"', '"statut": "PUBLIE"', '"titre": "sans statut"']) {
  test(`statut inconnu refusé à la lecture (${statut})`, () => {
    avecFichier("a.json", `{ ${statut} }`, (racine) => {
      assert.throws(() => lireEditions(racine), /statut inconnu/);
    });
  });
}

test("JSON illisible refusé à la lecture", () => {
  avecFichier("a.json", "{ pas du json", (racine) => {
    assert.throws(() => lireEditions(racine), /illisible/);
  });
});

test("une édition publiée incomplète fait échouer la lecture, brouillons ou non", () => {
  const e = modele();
  e.relecteur = null;
  const { slug: _s, fichier: _f, ...fichier } = e;
  const racine = mkdtempSync(join(tmpdir(), "actualites-"));
  try {
    mkdirSync(join(racine, "content/actualites"), { recursive: true });
    mkdirSync(join(racine, "src/lib/ressources"), { recursive: true });
    writeFileSync(
      join(racine, "src/lib/ressources/verticales.json"),
      JSON.stringify({ ordre: METIERS }),
    );
    writeFileSync(join(racine, "content/actualites/a.json"), JSON.stringify(fichier));
    assert.throws(() => editionsEnLigne(racine), /aucun relecteur/);
    assert.throws(() => lireContenu(racine, { avecBrouillons: true }), /aucun relecteur/);
  } finally {
    rmSync(racine, { recursive: true, force: true });
  }
});

test("publiée refusée sans relecteur", () => {
  const e = modele();
  e.relecteur = null;
  assert.ok(validerPublication(e).includes("aucun relecteur"));
});

test("publiée refusée avec une source non primaire seule", () => {
  const e = modele();
  e.sources[0].primaire = false;
  assert.ok(validerPublication(e).includes("aucune source primaire"));
});

test("un relevé peut se publier sans source primaire", () => {
  const e = modele();
  e.format = "le-releve";
  e.chiffres = [{ valeur: "1 sur 2", libelle: "en moins de 2 minutes" }];
  e.sources = [];
  assert.deepEqual(validerStructure(e, METIERS), []);
  assert.deepEqual(validerPublication(e), []);
});

test("publiée refusée avec une marque, y compris en profondeur", () => {
  for (const poser of [
    (e: Record<string, any>) => (e.inconnu = ["[à vérifier] état du budget"]),
    (e: Record<string, any>) => (e.chapo = "Texte [date] à poser."),
    (e: Record<string, any>) => (e.qui.tableau.lignes[0][1] = "[à vérifier]"),
    (e: Record<string, any>) => (e.sources[0].libelle = "Moniteur [à sourcer]"),
    (e: Record<string, any>) => (e.gestes = ["À contrôler le matin de la publication."]),
  ]) {
    const e = modele();
    poser(e);
    assert.ok(
      validerPublication(e).some((m) => m.startsWith("marque restante")),
      JSON.stringify(e),
    );
  }
});

test("publiée refusée tant que reste_a_verifier n'est pas vide", () => {
  const e = modele();
  e.reste_a_verifier = ["Un point ouvert."];
  assert.ok(validerPublication(e).includes("reste_a_verifier n'est pas vide"));
});

test("les notes de travail ne déclenchent pas la recherche de marques", () => {
  const e = modele();
  e.reste_a_verifier = [];
  assert.deepEqual(validerPublication(e), []);
  e.reste_a_verifier = ["Le marqueur [à vérifier] reste."];
  assert.deepEqual(validerPublication(e), ["reste_a_verifier n'est pas vide"]);
});

test("une phrase n'est pas une marque", () => {
  assert.equal(estMarque("Frais annexes : la liste à vérifier avant un contrôle"), false);
  assert.equal(estMarque("Le Moniteur précise qu'il reste à confirmer."), false);
  assert.equal(estMarque("[à vérifier] état"), true);
  assert.equal(estMarque("à contrôler"), true);
  assert.equal(estMarque("À vérifier : le budget"), true);
});

test("metaDescription hors de 120 à 160 refusée à la publication", () => {
  const e = modele();
  e.metaDescription = "Trop courte.";
  assert.equal(validerPublication(e).length, 1);
});

test("chiffres hors relevé refusés, chiffres requis pour un relevé", () => {
  const e = modele();
  e.chiffres = [{ valeur: "1", libelle: "x" }];
  assert.ok(validerStructure(e, METIERS).some((m) => m.startsWith("chiffres interdits")));
  const r = modele();
  r.format = "le-releve";
  assert.ok(validerStructure(r, METIERS).some((m) => m.startsWith("chiffres requis")));
});

test("ancien métier fusionné refusé", () => {
  const e = modele();
  e.metiers = ["audio"];
  assert.ok(validerStructure(e, METIERS).includes("métier inconnu : audio"));
});

test("seoTitle de 61 caractères refusé, 60 accepté", () => {
  const e = modele();
  e.seoTitle = "x".repeat(61);
  assert.equal(validerStructure(e, METIERS).length, 1);
  e.seoTitle = "x".repeat(60);
  assert.deepEqual(validerStructure(e, METIERS), []);
});

test("dates, url et relecteur mal formés refusés", () => {
  const cas: [string, (e: Record<string, any>) => void, string][] = [
    ["date", (e) => (e.datePublished = "05/11/2026"), "datePublished invalide"],
    ["ordre", (e) => (e.dateModified = "2026-11-01"), "dateModified avant datePublished"],
    ["url", (e) => (e.sources[0].url = "http://a.fr"), "source sans url https : http://a.fr"],
    ["relecteur", (e) => (e.relecteur = { nom: "" }), "relecteur mal formé (null, ou nom et date)"],
    ["slug", (e) => (e.slug = "Pas Un Slug"), "slug invalide : Pas Un Slug"],
  ];
  for (const [nom, poser, attendu] of cas) {
    const e = modele();
    poser(e);
    assert.ok(validerStructure(e, METIERS).includes(attendu), nom);
  }
});

test("numero en double refusé", () => {
  const erreurs = validerCollection([
    { numero: 1, slug: "a" },
    { numero: 1, slug: "b" },
  ]);
  assert.equal(erreurs.length, 1);
});

test("pourAffichage ne laisse sortir ni note de travail ni marque", () => {
  const brouillon = lireEditions(RACINE).find((e) => e.statut === "brouillon");
  assert.ok(brouillon);
  const e = pourAffichage(brouillon);
  const texte = JSON.stringify(e);
  assert.equal("reste_a_verifier" in e, false);
  assert.equal("fichier" in e, false);
  assert.deepEqual(e.change, ["Un paragraphe."]);
  assert.deepEqual(e.inconnu, []);
  assert.doesNotMatch(texte, /note de travail|à vérifier|contrôler/i);
});

test("pourAffichage ne change pas une édition publiée, hors chemin du fichier", () => {
  const publiee = lireEditions(RACINE).find((e) => e.statut === "publie");
  assert.ok(publiee);
  const { fichier: _f, ...attendu } = publiee;
  assert.deepEqual(pourAffichage(publiee), attendu);
});
