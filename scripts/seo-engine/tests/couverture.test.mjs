import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { SCENES, consigneCouverture, controlerCouverture, retenirCouverture } from "../lib/couverture.mjs";

const texte = "Le virement reçu de la mutuelle est inférieur à la facture : comparez facturé, viré et écart. Rapprochement Almerys, 90 jours.";
const bloc = {
  scene: "ecart",
  titre: "Rapprochement",
  repere: "Écart",
  elements: [
    { label: "Facturé", etat: "fait" },
    { label: "Viré", etat: "fait" },
    { label: "Écart", etat: "alerte" },
  ],
  badge: null,
  marque: null,
  accroche: { debut: "Le virement", fin: "ne fait pas le compte." },
  en: { titre: "Reconciliation", repere: "Gap", labels: ["Billed", "Paid", "Gap"], badge: null },
};

test("un bloc conforme passe", () => {
  assert.deepEqual(controlerCouverture(bloc, { texte }), []);
});

test("les scènes du moteur sont celles du site", () => {
  const site = readFileSync(new URL("../../../src/lib/ressources/couverture.ts", import.meta.url), "utf8");
  const liste = site.match(/SCENES = \[([\s\S]*?)\]/)[1].match(/"[a-z]+"/g).map((s) => s.slice(1, -1));
  assert.deepEqual(liste, Object.keys(SCENES));
  const schema = JSON.parse(readFileSync(new URL("../article-output.schema.json", import.meta.url), "utf8"));
  assert.deepEqual(schema.properties.couverture.properties.scene.enum, liste);
});

test("un libellé absent de l'article est refusé", () => {
  const c = { ...bloc, titre: "Trésorerie" };
  assert.match(controlerCouverture(c, { texte }).join(), /Trésorerie/);
});

test("un chiffre d'accroche absent de l'article est refusé, présent il passe", () => {
  const ko = { ...bloc, accroche: { debut: "Perdu", fin: "depuis 45 jours." } };
  const ok = { ...bloc, accroche: { debut: "Perdu", fin: "depuis 90 jours." } };
  assert.match(controlerCouverture(ko, { texte }).join(), /45/);
  assert.deepEqual(controlerCouverture(ok, { texte }), []);
});

test("le logo : il faut le fichier, et que l'article parle de la marque", () => {
  const plateformes = { almerys: { nom: "Almerys", logo: "/logos/almerys.png" }, april: { nom: "April", logo: "/logos/april.png" } };
  assert.deepEqual(controlerCouverture({ ...bloc, marque: "almerys" }, { texte, plateformes }), []);
  assert.match(controlerCouverture({ ...bloc, marque: "april" }, { texte, plateformes }).join(), /absente/);
  assert.match(controlerCouverture({ ...bloc, marque: "inconnue" }, { texte, plateformes }).join(), /sans logo/);
});

test("le nombre d'éléments suit la scène, l'anglais doit être complet", () => {
  const c = { ...bloc, elements: bloc.elements.slice(0, 2) };
  const erreurs = controlerCouverture(c, { texte }).join();
  assert.match(erreurs, /2 éléments/);
  assert.match(erreurs, /anglais/);
});

test("un bloc refusé est retiré sans bloquer, avec un avertissement", () => {
  const avert = [];
  assert.equal(retenirCouverture({ ...bloc, scene: "photo" }, { texte }, (m) => avert.push(m)), null);
  assert.match(avert[0], /scène générique/);
  assert.equal(retenirCouverture(undefined, { texte }), null);
});

test("un bloc retenu prend l'apostrophe française", () => {
  const texteOk = `${texte} Facture d'achat`;
  const c = { ...bloc, titre: "Facture d'achat" };
  assert.equal(retenirCouverture(c, { texte: texteOk }).titre, "Facture d’achat");
});

test("en colonnes, un mot trop long est refusé", () => {
  const long = "Rapprochement bancaire";
  const c = { ...bloc, scene: "frise", elements: [long, "Facture", "Paiement"].map((label) => ({ label, etat: "fait" })) };
  assert.match(controlerCouverture(c, { texte: `${texte} bancaire paiement` }).join(), /mot trop long/);
});

test("la consigne liste les logos et les scènes à éviter", () => {
  const m = consigneCouverture({ plateformes: { april: { nom: "April", logo: "x" } }, recentes: ["frise"] });
  assert.match(m, /april \(April\)/);
  assert.match(m, /dernières scènes de ce thème : frise/);
});
