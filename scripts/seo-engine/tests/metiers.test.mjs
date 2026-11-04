// node --test scripts/seo-engine/tests/
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  FICHE_DE_VERTICALE, FICHES, RUBRIQUES, blocMetier, choisirFiche, encartPour, heritageOptique, lireFiche, reglesMetier,
  signaturePour, sourcesHorsFiche,
} from "../lib/metiers.mjs";
import { contexte, regles } from "../lib/relecture.mjs";

const MOTEUR = new URL("../", import.meta.url).pathname;
const file = JSON.parse(readFileSync(join(MOTEUR, "articles-queue.json"), "utf8"));
const heritage = heritageOptique();

test("choix de fiche : déterministe d'après verticales", () => {
  const c = (verticales, slug = "x") => choisirFiche({ slug, verticales }, new Set(["ancien"]));
  assert.deepEqual(c(["optique"]).fiches, ["optique"]);
  assert.equal(c(["optique"]).optique, true);
  assert.deepEqual(c(["optique", "audio"]).fiches, ["optique"]);
  assert.deepEqual(c(["audio"]).fiches, ["optique"]);
  assert.deepEqual(c(["dentaire"]).fiches, ["dentaire"]);
  assert.equal(c(["dentaire"]).tronc, false);
  assert.deepEqual(c(["laboratoires"]).fiches, ["cliniques"]);
  const multi = c(["pharmacie", "optique", "dentaire"]);
  assert.equal(multi.tronc, true);
  assert.deepEqual(multi.fiches, ["optique", "dentaire", "pharmacie"]);
  assert.equal(multi.optique, false);
  // sans verticales : optique seulement pour une entrée de l'héritage
  assert.deepEqual(c(undefined, "ancien").fiches, ["optique"]);
  assert.throws(() => c(undefined, "nouveau"), /verticales manquant/);
  assert.throws(() => c(["ehpad"]), /pas de fiche métier pour ehpad/);
});

test("file : verticales obligatoire pour toute entrée pending hors héritage, et toujours connue", () => {
  const sans = file.filter((a) => a.status === "pending" && !a.verticales?.length && !heritage.has(a.slug));
  assert.deepEqual(sans.map((a) => a.slug), [], "entrées pending sans verticales : ajouter le champ");
  for (const a of file) for (const v of a.verticales ?? []) assert.ok(FICHE_DE_VERTICALE[v], `${a.slug} : verticale inconnue ${v}`);
  for (const a of file) assert.doesNotThrow(() => choisirFiche(a, heritage), a.slug);
});

test("héritage optique : liste figée, seulement des entrées sans verticales", () => {
  const slugs = new Set(file.map((a) => a.slug));
  for (const s of heritage) {
    assert.ok(slugs.has(s), `héritage : ${s} n'est plus dans la file, le retirer`);
    assert.ok(!file.find((a) => a.slug === s).verticales?.length, `héritage : ${s} porte verticales, le retirer`);
  }
});

test("fiches : toutes les rubriques, encart et signature hors optique, offre validée hors tronc", () => {
  for (const nom of [...FICHES, "tronc"]) {
    const f = lireFiche(nom);
    for (const [k, titre] of Object.entries(RUBRIQUES)) assert.ok(f.rub[k], `${nom} : rubrique « ${titre} » vide`);
    assert.ok(f.rub.lecteur.includes("**Lecteur :**"), `${nom} : ligne **Lecteur :** manquante`);
    assert.ok(f.sources.length >= 3, `${nom} : moins de 3 sources`);
    if (nom === "optique") continue;
    assert.equal(f.encart.etapes.length, 3, nom);
    for (const k of ["titre", "fin", "texteFin", "rassure"]) assert.ok(f.encart[k], `${nom} : encart.${k}`);
    assert.ok(!/48 h/.test(JSON.stringify(f.encart)), `${nom} : pas de 48 h hors optique`);
    assert.ok(f.signature.auteur, nom);
    assert.equal(f.rub.granit.includes("À VALIDER PAR PAUL"), nom === "tronc", `${nom} : marqueur de validation`);
  }
  for (const nom of ["dentaire", "centres", "pharmacie", "cliniques"]) {
    assert.ok(!/opticien|optique/i.test(lireFiche(nom).md), `${nom} : mention de l'optique`);
  }
});

test("bloc métier : la fiche seule, ou le tronc et les métiers résumés", () => {
  const dentaire = blocMetier(choisirFiche({ slug: "x", verticales: ["dentaire"] }), { reader: "Comptoir" });
  assert.match(dentaire, /assistante dentaire/);
  assert.match(dentaire, /Comptoir/);
  assert.doesNotMatch(dentaire, /opticien/i);
  assert.doesNotMatch(dentaire, /"titre"/, "l'encart n'est pas envoyé au modèle");
  const tronc = blocMetier(choisirFiche({ slug: "x", verticales: ["optique", "pharmacie"] }));
  assert.match(tronc, /Tronc commun/);
  assert.match(tronc, /### Opticiens et audioprothésistes/);
  assert.match(tronc, /### Pharmacies/);
  assert.doesNotMatch(tronc, /### Centres dentaires/);
});

test("encart, signature et sources suivent la fiche", () => {
  const opt = choisirFiche({ slug: "x", verticales: ["optique"] });
  const den = choisirFiche({ slug: "x", verticales: ["dentaire"] });
  assert.equal(encartPour(opt), null);
  assert.equal(signaturePour(opt), null);
  assert.match(encartPour(den).fin, /Granit peut/);
  assert.equal(signaturePour(den).auteur, "laura");
  const sources = [
    { label: "ameli", url: "https://www.ameli.fr/chirurgien-dentiste/exercice-liberal/autre-page" },
    { label: "blog", url: "https://blog-prestataire.example/article" },
  ];
  assert.deepEqual(sourcesHorsFiche(sources, den), ["source hors fiche métier : https://blog-prestataire.example/article"]);
});

test("relecture paramétrée : lecteur du métier, règles portail seulement en page plateforme", () => {
  const den = choisirFiche({ slug: "x", verticales: ["dentaire"] });
  const r = regles({ lecteur: "une assistante dentaire", type: "standard", metier: reglesMetier(den) });
  assert.match(r, /Copy \(lecteur : une assistante dentaire\)/);
  assert.doesNotMatch(r, /adresse du portail/);
  assert.doesNotMatch(r, /opticien/i);
  assert.match(r, /Métier : Centres dentaires/);
  assert.match(regles({ type: "plateforme" }), /adresse du portail/);
  assert.match(regles(), /opticien/);
  const ctx = contexte({ meta: {}, faits: null, liens: [], relecture: { lecteur: "le bureau des entrées", type: "resolution" } });
  assert.match(ctx, /lecteur : le bureau des entrées/);
});

// Dry-run du message de rédaction, sans appel à l'API (publish-article --prompt --entree)
function prompt(entree) {
  const dir = mkdtempSync(join(tmpdir(), "metiers-"));
  const p = join(dir, "entree.json");
  writeFileSync(p, JSON.stringify(entree));
  return execFileSync(process.execPath, [join(MOTEUR, "publish-article.mjs"), "--prompt", "--entree", p], { encoding: "utf8" });
}
const entree = (x) => ({
  id: "Z0", slug: "essai-fiche", category: "rejets", title: "Titre d'essai", primaryKeyword: "rejet mutuelle",
  keywordCluster: [], faqQuestions: [], parentSlug: null, level: "Fille", reader: "Comptoir", granitData: "Relevé optique", status: "pending", ...x,
});

test("prompt dentaire : le bon lecteur, aucune mention d'opticien", () => {
  const p = prompt(entree({ verticales: ["dentaire"], title: "Rejet mutuelle sur une prothèse dentaire : que faire ?" }));
  assert.match(p, /Fiche métier : Centres dentaires/);
  assert.match(p, /assistante dentaire/);
  assert.match(p, /Granit peut prendre en charge vos rejets et vos demandes de prise en charge/);
  assert.doesNotMatch(p, /opticien/i);
  assert.doesNotMatch(p, /Relevé optique/, "granitData optique non envoyé hors optique");
});

test("prompt optique : lecteur optique et granitData", () => {
  const p = prompt(entree({ verticales: ["optique"] }));
  assert.match(p, /Fiche métier : Opticiens et audioprothésistes/);
  assert.match(p, /magasin d'optique/);
  assert.match(p, /Relevé optique/);
});
