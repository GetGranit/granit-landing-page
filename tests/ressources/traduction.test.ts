// Versions anglaises des Ressources : seuls les textes viennent de content/en/, le reste du français ;
// un fichier absent, illisible ou incomplet laisse la page en français.
// Fixture : tests/ressources/fixture/content/en/. `node --experimental-strip-types --test tests/ressources/*.test.ts`
import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { fusionner, lireTraductions, SCHEMAS } from "../../scripts/ressources/traduction.mjs";

const RACINE = fileURLToPath(new URL("./fixture", import.meta.url));

const articleFr = (slug: string, extra: Record<string, unknown> = {}) => ({
  slug,
  id: "id-fr",
  category: "rejets",
  categoryName: "Rejets et corrections",
  type: "standard",
  plateforme: null,
  title: "Rejets : les corriger",
  primaryKeyword: "rejet",
  metaDescription: "Lire un motif de rejet et corriger le dossier.",
  contentHtml: '<h2 id="lire">Lire le motif</h2><div data-figure="flux"></div><p>Texte.</p>',
  author: { name: "Paul", jobTitle: "Cofondateur" },
  reviewer: null,
  datePublished: "2026-10-01",
  verticales: ["optique"],
  tocItems: [{ id: "lire", label: "Lire le motif" }],
  faqItems: [{ question: "Pourquoi ?", answer: "Parce que." }],
  sources: [{ label: "ameli.fr · Rejets", url: "https://exemple.fr/rejets" }],
  figures: [
    {
      id: "flux",
      type: "flux",
      titre: "Le flux",
      legende: "Du devis au paiement",
      colonnes: [],
      elements: [{ label: "Devis", detail: "le départ", valeurs: [], focus: true }],
    },
  ],
  ...extra,
});

const plateformeFr = {
  slug: "portail-viamedis",
  nom: "Viamedis",
  checkedOn: "2026-10-06",
  identite: [{ label: "Type", valeur: "Opérateur de tiers payant", source: "x" }],
  chiffres: [{ valeur: "+305 000", label: "professionnels de santé", source: "x" }],
  statuts: [
    { libelle: "Accordée", sens: "La complémentaire s'engage", action: "Délivrer, puis facturer" },
  ],
  contacts: [
    { label: "Téléphone", valeur: "0 825 076 076", detail: "Numéro surtaxé", source: "x" },
  ],
  sources: { x: { label: "viamedis.fr · Professionnels", url: "https://www.viamedis.fr/" } },
};

const iremiaFr = {
  slug: "iremia",
  nom: "Iremia Santé",
  modele: "prestataire",
  checkedOn: "2026-10-07",
  axes: {
    pec: { valeur: "oui", detail: "Saisie des PEC par leurs experts", source: "a" },
    quiFait: { valeur: "Un expert tiers payant attitré", source: "a" },
  },
  meilleurSi: ["le sujet principal est la trésorerie"],
  sources: { a: { label: "iremia-sante.fr · Accueil", url: "https://iremia-sante.fr/" } },
  exclus: { prix: "jamais affiché" },
};

const ancienFr = {
  slug: "vieux",
  category: "Pharmacie",
  title: "Officine : solder les créances",
  desc: "Trier et solder les créances anciennes.",
  time: "9 min",
  body: ["Premier paragraphe.", "Deuxième paragraphe."],
};

const lire = () =>
  lireTraductions(
    RACINE,
    {
      articles: [
        articleFr("guide"),
        articleFr("incomplet"),
        articleFr("illisible"),
        articleFr("ancre"),
        articleFr("absent"),
      ],
      plateformes: { viamedis: plateformeFr },
      concurrents: { iremia: iremiaFr },
    },
    [ancienFr],
  );

test("article traduit : les textes viennent de l'anglais, la structure du français", () => {
  const a = lire().articles.guide as ReturnType<typeof articleFr>;
  assert.equal(a.title, "Rejections: how to fix them");
  assert.equal(a.metaDescription, "Read a rejection reason and fix the claim.");
  assert.match(a.contentHtml, /Read the reason/);
  assert.equal(a.author.jobTitle, "Co-founder");
  assert.deepEqual(a.tocItems, [{ id: "lire", label: "Read the reason" }]);
  assert.deepEqual(a.faqItems, [{ question: "Why?", answer: "Because." }]);
  assert.equal(a.figures[0].titre, "The flow");
  assert.equal(a.figures[0].elements[0].label, "Quote");
  // Champs structurels : toujours le français, même si le fichier anglais les change.
  assert.equal(a.id, "id-fr");
  assert.equal(a.datePublished, "2026-10-01");
  assert.deepEqual(a.verticales, ["optique"]);
  assert.equal(a.primaryKeyword, "rejet");
  assert.equal(a.sources[0].url, "https://exemple.fr/rejets");
  assert.equal(a.sources[0].label, "ameli.fr · Rejections");
  assert.equal(a.figures[0].elements[0].focus, true);
});

test("fichier anglais absent : pas de version anglaise, pas d'avertissement", () => {
  const r = lire();
  assert.equal(r.articles.absent, undefined);
  assert.ok(!r.avertissements.some((m) => m.includes("absent.json")));
});

test("fichier illisible, incomplet ou aux ancres changées : repli français et avertissement", () => {
  const r = lire();
  for (const slug of ["incomplet", "illisible", "ancre"]) {
    assert.equal(r.articles[slug], undefined, slug);
    assert.ok(
      r.avertissements.some((m) => m.includes(`${slug}.json`)),
      `avertissement attendu pour ${slug}`,
    );
  }
  const incomplet = r.avertissements.find((m) => m.includes("incomplet.json"))!;
  assert.match(incomplet, /faqItems\[0\]\.answer/);
  assert.match(incomplet, /figures/);
  assert.match(r.avertissements.find((m) => m.includes("ancre.json"))!, /id="lire"/);
});

test("fiche plateforme : le libellé du portail, les URL et le nom restent ceux du français", () => {
  const p = lire().plateformes.viamedis as typeof plateformeFr;
  assert.equal(p.nom, "Viamedis");
  assert.equal(p.statuts[0].libelle, "Accordée");
  assert.equal(p.statuts[0].sens, "The insurer commits to the amount");
  assert.equal(p.chiffres[0].valeur, "+305,000");
  assert.equal(p.contacts[0].detail, "Premium-rate number");
  assert.equal("url" in p.contacts[0], false);
  assert.equal(p.sources.x.url, "https://www.viamedis.fr/");
  assert.equal(p.sources.x.label, "viamedis.fr · Healthcare professionals");
});

test("acteur comparé : « oui », « non », « non publié » et le modèle ne se traduisent pas", () => {
  const c = lire().concurrents.iremia as typeof iremiaFr;
  assert.equal(c.axes.pec.valeur, "oui");
  assert.equal(c.axes.pec.detail, "Coverage requests entered by their experts");
  assert.equal(c.axes.quiFait.valeur, "A dedicated third-party payment expert");
  assert.equal(c.modele, "prestataire");
  assert.deepEqual(c.meilleurSi, ["cash flow is the main issue"]);
  assert.equal(c.sources.a.url, "https://iremia-sante.fr/");
});

test("ancien article : textes et corps anglais (longueur libre), slug du français", () => {
  const a = lire().anciens.vieux;
  assert.equal(a.slug, "vieux");
  assert.equal(a.title, "Pharmacy: clearing old receivables");
  assert.equal(a.category, "Pharmacy");
  assert.equal(a.body.length, 3);
});

test("fusionner : liste de longueur différente ou texte vide = problème, champ vide en français ignoré", () => {
  const fr = { title: "Titre", tocItems: [{ id: "a", label: "A" }], author: { jobTitle: "" } };
  const r = fusionner(fr, { title: " ", tocItems: [], author: {} }, SCHEMAS.article);
  assert.deepEqual(r.problemes, ["title : texte manquant", "tocItems : 0 éléments au lieu de 1"]);
  assert.deepEqual(r.valeur, fr);
});
