// node --test scripts/seo-engine/tests/
import assert from "node:assert/strict";
import { test } from "node:test";
import { controler, typeDePage } from "../lib/checks.mjs";
import { horsListeBlanche } from "../lib/html.mjs";

const remplissage = (n) => Array.from({ length: n }, (_, i) => `mot${i}`).join(" ");

function articleValide({ marqueurs = false } = {}) {
  const h2 = (id, q, extra = "") => `<h2 id="${id}">${q}</h2><p>${remplissage(300)}</p>${extra}`;
  return {
    metaDescription: "Le tiers payant opticien expliqué pas à pas : qui paie quoi, quels portails utiliser et comment éviter les rejets. Le guide du comptoir.",
    contentHtml:
      `<p><strong>Le tiers payant opticien permet au client de ne pas avancer les frais.</strong> ${remplissage(40)}</p>` +
      `<div class="key-takeaways"><strong>L'essentiel</strong><ul><li>Un point</li></ul></div>` +
      h2("qui-paie", "Qui paie quoi ?", marqueurs ? '<div data-bloc="chiffres"></div><div data-bloc="organismes"></div>' : "") +
      h2("portails", "Quels portails utiliser ?", '<p>Voir <a href="/ressources/rapprochement-noemie">le rapprochement NOEMIE</a> et <a href="https://www.ameli.fr/opticien">ameli</a>.</p>') +
      h2("rejets", "Comment éviter les rejets ?", marqueurs ? '<div data-bloc="statuts"></div>' : "") +
      h2("paiement", "Quand est-on payé ?", marqueurs ? '<div data-bloc="contacts"></div>' : "") +
      h2("logiciel", "Quel logiciel choisir ?", '<ol class="steps"><li><strong>Vérifier.</strong> Puis agir.</li></ol>'),
    tocItems: ["qui-paie", "portails", "rejets", "paiement", "logiciel"].map((id) => ({ id, label: id })),
    faqItems: Array.from({ length: 4 }, (_, i) => ({ question: `Question ${i} ?`, answer: "Réponse courte. Deuxième phrase." })),
    sources: [
      { label: "ameli.fr · Opticien", url: "https://www.ameli.fr/opticien" },
      { label: "service-public.fr", url: "https://www.service-public.fr/" },
    ],
  };
}

const ctx = (extra = {}) => ({
  article: { slug: "tiers-payant-opticien", category: "guide-tiers-payant", primaryKeyword: "tiers payant opticien", title: "T", faqQuestions: [] },
  type: "standard",
  cibles: new Map([["/ressources/rapprochement-noemie", "x"]]),
  pagesProduit: ["/agents", "/demo"],
  ...extra,
});

test("un article conforme passe", () => {
  const r = controler(articleValide(), ctx());
  assert.deepEqual(r.erreurs, []);
});

test("liste rouge : tiret long et promesse 48 h", () => {
  const a = articleValide();
  a.contentHtml += "<p>Branché en 48 h — sans effort.</p>";
  const r = controler(a, ctx());
  assert.ok(r.erreurs.some((e) => e.includes("tiret long")));
  assert.ok(r.erreurs.some((e) => e.includes("48 h")));
});

test("balisage hors gabarit refusé", () => {
  assert.deepEqual(horsListeBlanche('<p style="x">a</p><img src="a">'), ["<p> : attribut style interdit", "balise <img> interdite"]);
  assert.deepEqual(horsListeBlanche('<div class="callout callout--tip"><p>a</p></div>'), []);
  assert.ok(horsListeBlanche('<div data-bloc="chiffres"></div>')[0].includes("hors page plateforme"));
});

test("lien interne vers une page non publiée refusé", () => {
  const a = articleValide();
  a.contentHtml += '<p><a href="/ressources/portail-almerys">Almerys</a></p>';
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("/ressources/portail-almerys")));
});

test("lien externe absent des sources refusé", () => {
  const a = articleValide();
  a.contentHtml += '<p><a href="https://example.com/x">x</a></p>';
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("hors de sources")));
});

test("sommaire désaligné avec les H2 refusé", () => {
  const a = articleValide();
  a.tocItems.pop();
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("tocItems")));
});

test("« L'essentiel » doit suivre l'ouverture", () => {
  const a = articleValide();
  a.contentHtml = a.contentHtml.replace("<div class=\"key-takeaways\">", '<h2 id="intro">Intro ?</h2><div class="key-takeaways">');
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("premier bloc")));
});

test("mot-clé principal dans les 100 premiers mots, ordre libre", () => {
  const c = ctx();
  c.article = { ...c.article, primaryKeyword: "opticien tiers payant" };
  assert.ok(!controler(articleValide(), c).erreurs.some((e) => e.includes("100 premiers mots")));
  c.article = { ...c.article, primaryKeyword: "almerys pec" };
  assert.ok(controler(articleValide(), c).erreurs.some((e) => e.includes("100 premiers mots")));
});

test("page plateforme : marqueurs et nombres du fichier de faits", () => {
  const faits = { chiffres: [{ valeur: "+280 000" }], faits: [{ fait: "fondé en 2000" }] };
  const c = ctx({ type: "plateforme", faits });
  const a = articleValide({ marqueurs: true });
  assert.deepEqual(controler(a, c).erreurs, []);
  a.contentHtml += "<p>Fondé en 2000, plus de 280 000 opticiens, et 37 % de rejets.</p>";
  const e = controler(a, c).erreurs;
  assert.ok(e.some((x) => x.includes("nombres absents") && x.includes("37") && !x.includes("280000")));
  const sans = articleValide();
  assert.ok(controler(sans, c).erreurs.some((x) => x.includes('data-bloc="chiffres"')));
});

test("page résolution sans étapes refusée", () => {
  const a = articleValide();
  a.contentHtml = a.contentHtml.replace(/<ol class="steps">.*?<\/ol>/, "");
  const r = controler(a, ctx({ type: "resolution" }));
  assert.ok(r.erreurs.some((e) => e.includes("steps")));
});

test("type de page", () => {
  assert.equal(typeDePage({ category: "plateformes", slug: "portail-viamedis" }), "plateforme");
  assert.equal(typeDePage({ category: "plateformes", slug: "almerys-prise-en-charge" }), "standard");
  assert.equal(typeDePage({ category: "rejets", slug: "rejet-x" }), "resolution");
});

const figure = (extra = {}) => ({
  id: "circuit", type: "flux", titre: "Qui paie quoi", legende: "Le statut engage la complémentaire.", colonnes: [],
  elements: [
    { label: "Opticien", detail: "devis", valeurs: [], focus: false },
    { label: "Plateforme", detail: "statut", valeurs: [], focus: true },
  ],
  ...extra,
});

test("schéma placé une fois : accepté", () => {
  const a = articleValide();
  a.contentHtml += '<div data-figure="circuit"></div>';
  a.figures = [figure()];
  assert.deepEqual(controler(a, ctx()).erreurs, []);
});

test("schéma non placé, marqueur orphelin, deux focus : refusés", () => {
  const a = articleValide();
  a.contentHtml += '<div data-figure="autre"></div>';
  a.figures = [figure({ elements: figure().elements.map((e) => ({ ...e, focus: true })) })];
  const e = controler(a, ctx()).erreurs;
  assert.ok(e.some((x) => x.includes("placé 0 fois")));
  assert.ok(e.some((x) => x.includes('data-figure="autre" sans schéma')));
  assert.ok(e.some((x) => x.includes("plusieurs éléments en focus")));
});

test("page plateforme : un nombre inventé dans un schéma est refusé", () => {
  const faits = { chiffres: [{ valeur: "+280 000" }], faits: [{ fait: "fondé en 2000" }] };
  const a = articleValide({ marqueurs: true });
  a.contentHtml += '<div data-figure="circuit"></div>';
  a.figures = [figure({ legende: "Payé sous 15 jours." })];
  assert.ok(controler(a, ctx({ type: "plateforme", faits })).erreurs.some((x) => x.includes("15")));
});

test("page plateforme : taille d'une liste et 100 % Santé admis", () => {
  const faits = { chiffres: [{ valeur: "+280 000" }], organismes: { liste: Array.from({ length: 12 }, (_, i) => `M${i}`) } };
  const a = articleValide({ marqueurs: true });
  a.contentHtml += "<p>Le sélecteur propose 12 complémentaires, y compris pour le 100 % Santé.</p>";
  assert.deepEqual(controler(a, ctx({ type: "plateforme", faits })).erreurs, []);
});
