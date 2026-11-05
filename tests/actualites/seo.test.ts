// Balises et JSON-LD des pages d'actualités.
import { test } from "node:test";
import assert from "node:assert/strict";
import { NOM_RUBRIQUE } from "../../src/lib/actualites/marque.ts";
import {
  filEdition,
  headEdition,
  headRubrique,
  newsArticleLd,
} from "../../src/lib/actualites/seo.ts";
import { DESCRIPTION_RUBRIQUE } from "../../src/lib/actualites/textes.ts";
import type { Edition } from "../../src/lib/actualites/types.ts";

const edition: Edition = {
  slug: "exemple",
  numero: 1,
  format: "ce-qui-change",
  fait: "x",
  titre: "Le titre",
  seoTitle: "Le titre SEO",
  chapo: "x",
  metaDescription: "La description.",
  metiers: ["optique"],
  datePublished: "2026-11-05",
  dateModified: "2026-11-06",
  change: ["x"],
  qui: { texte: "x" },
  gestes: ["x"],
  inconnu: ["x"],
  sources: [{ libelle: "Loi", url: "https://example.fr/loi", primaire: true }],
  relecteur: { nom: "Une Personne", date: "2026-11-05" },
  statut: "publie",
};

const robots = (m: Record<string, string>[]) => m.find((x) => x.name === "robots");

test("NewsArticle porte le titre, les dates, le relecteur et les sources", () => {
  const ld = newsArticleLd(edition);
  assert.equal(ld["@type"], "NewsArticle");
  assert.equal(ld.headline, "Le titre");
  assert.equal(ld.dateModified, "2026-11-06");
  assert.equal(ld.mainEntityOfPage["@id"], "https://www.getgranit.ai/actualites/exemple");
  assert.equal(ld.mainEntityOfPage.reviewedBy?.name, "Une Personne");
  assert.deepEqual(ld.citation, ["https://example.fr/loi"]);
  assert.equal(ld.author.name, "Granit");
});

test("reviewedBy absent sans relecteur", () => {
  const ld = newsArticleLd({ ...edition, relecteur: null });
  assert.equal(ld.mainEntityOfPage.reviewedBy, undefined);
});

test("fil d'Ariane de l'édition", () => {
  assert.deepEqual(filEdition(edition), [
    ["Actualités", "/actualites"],
    ["Le titre", "/actualites/exemple"],
  ]);
});

test("headEdition : seoTitle, indexable une fois publiée, noindex en brouillon", () => {
  const publie = headEdition(edition).meta as Record<string, string>[];
  assert.equal(publie[0].title, "Le titre SEO");
  assert.equal(robots(publie), undefined);
  const brouillon = headEdition({ ...edition, statut: "brouillon" }).meta as Record<string, string>[];
  assert.equal(robots(brouillon)?.content, "noindex, nofollow");
});

test("headRubrique : titre issu de marque.ts, noindex sans édition publiée", () => {
  const avec = headRubrique([{ statut: "publie" }]).meta as Record<string, string>[];
  assert.ok(avec[0].title.startsWith(NOM_RUBRIQUE));
  assert.equal(robots(avec), undefined);
  const sans = headRubrique([{ statut: "brouillon" }]).meta as Record<string, string>[];
  assert.equal(robots(sans)?.content, "noindex, nofollow");
});

test("la description de la rubrique tient en 120 à 160 caractères", () => {
  assert.ok(DESCRIPTION_RUBRIQUE.length >= 120 && DESCRIPTION_RUBRIQUE.length <= 160);
});
