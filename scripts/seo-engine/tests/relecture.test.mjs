// node --test scripts/seo-engine/tests/
import assert from "node:assert/strict";
import { test } from "node:test";
import { coutDollars } from "../lib/claude.mjs";
import { appliquer, boucle, cumulCout, decider, schemaCorrection, verdictMarkdown } from "../lib/relecture.mjs";

const point = (gravite, extrait = "x") => ({ gravite, angle: "faits", extrait, correction: "y" });
const fiche = { slug: "portail-test", contentHtml: "<p>un deux trois</p>", metaDescription: "m", tocItems: [], faqItems: [], sources: [], figures: [], moteur: {} };
const schemaArticle = { type: "object", required: ["contentHtml"], properties: { contentHtml: { type: "string" } } };
const corrige = (extra = {}) => ({ ...fiche, contentHtml: "<p>un deux</p>", decision_humaine: [], non_appliques: [], ...extra });
const usage = { input_tokens: 1000, output_tokens: 100 };

/** Faux modèle : rejoue les réponses prévues pour chaque rôle, dans l'ordre. */
function faux(reponses) {
  const appels = [];
  const appeler = async (role) => {
    appels.push(role);
    return { json: reponses[role].shift(), usage, stopReason: "end_turn" };
  };
  return { appels, appeler };
}
const ok = async () => ({ erreurs: [], avertissements: [] });

test("decider : prêt seulement sans reste à corriger, sans erreur ni décision humaine", () => {
  const verif = { verdict: "pret", resume: "", restes: [point("DETAIL")] };
  assert.equal(decider({ verif }), "pret");
  assert.equal(decider({ verif: { ...verif, restes: [point("A_CORRIGER")] } }), "humain");
  assert.equal(decider({ verif, decisions: ["changer un fait"] }), "humain");
  assert.equal(decider({ verif, erreurs: ["lien cassé"] }), "humain");
  assert.equal(decider({ verif: null }), "humain");
});

test("decider : des restes de style seuls (phrases longues) ne suffisent pas à donner « humain »", () => {
  const style = { ...point("A_CORRIGER"), angle: "copy" };
  assert.equal(decider({ verif: { verdict: "humain", resume: "", restes: [style, point("DETAIL")] } }), "pret");
  assert.equal(decider({ verif: { verdict: "pret", resume: "", restes: [style, point("BLOQUANT")] } }), "humain");
});

test("cumul du coût sur tous les appels", () => {
  const c = cumulCout([usage, usage, {}], coutDollars, "claude-opus-5-5");
  assert.equal(c.toFixed(4), (2 * (1000 * 4 + 100 * 20) / 1e6).toFixed(4));
});

test("appliquer : ne reprend que les champs de l'article et recompte les mots", () => {
  const f = appliquer({ ...fiche, title: "T" }, { contentHtml: "<p>a b</p>", title: "autre", decision_humaine: ["z"] });
  assert.equal(f.title, "T");
  assert.equal(f.wordCount, 2);
  assert.equal(f.decision_humaine, undefined);
});

test("schéma du correcteur : celui de l'article + decision_humaine et non_appliques", () => {
  const s = schemaCorrection(schemaArticle);
  assert.deepEqual(s.required, ["contentHtml", "decision_humaine", "non_appliques"]);
  assert.deepEqual(schemaArticle.required, ["contentHtml"]);
});

test("boucle : aucun point, pas de correction", async () => {
  const m = faux({ relecteur: [{ points: [] }] });
  const r = await boucle({ fiche, ctx: "", schemaArticle, appeler: m.appeler, controle: ok });
  assert.equal(r.verdict, "pret");
  assert.deepEqual(m.appels, ["relecteur"]);
  assert.equal(r.fiche, fiche);
});

test("boucle : un tour suffit quand le vérificateur ne laisse que des détails", async () => {
  const m = faux({
    relecteur: [{ points: [point("BLOQUANT")] }],
    correcteur: [corrige()],
    verificateur: [{ verdict: "pret", resume: "ok", restes: [point("DETAIL")] }],
  });
  const r = await boucle({ fiche, ctx: "", schemaArticle, appeler: m.appeler, controle: ok });
  assert.deepEqual(m.appels, ["relecteur", "correcteur", "verificateur"]);
  assert.equal(r.verdict, "pret");
  assert.equal(r.tours, 1);
  assert.equal(r.fiche.contentHtml, "<p>un deux</p>");
  assert.equal(r.usages.length, 3);
});

test("boucle : 2 tours au plus, puis décision humaine", async () => {
  const reste = { verdict: "humain", resume: "", restes: [point("A_CORRIGER")] };
  const m = faux({
    relecteur: [{ points: [point("A_CORRIGER")] }],
    correcteur: [corrige(), corrige()],
    verificateur: [reste, { ...reste }],
  });
  const r = await boucle({ fiche, ctx: "", schemaArticle, appeler: m.appeler, controle: ok });
  assert.equal(r.tours, 2);
  assert.equal(m.appels.filter((a) => a === "correcteur").length, 2);
  assert.equal(r.verdict, "humain");
});

test("boucle : un fait à changer part en décision humaine", async () => {
  const m = faux({
    relecteur: [{ points: [point("A_CORRIGER")] }],
    correcteur: [corrige({ decision_humaine: ["le téléphone du fichier de faits a changé"] })],
    verificateur: [{ verdict: "pret", resume: "", restes: [] }],
  });
  const r = await boucle({ fiche, ctx: "", schemaArticle, appeler: m.appeler, controle: ok });
  assert.equal(r.verdict, "humain");
  assert.match(verdictMarkdown(r, { model: "m", cout: 0.5 }), /À trancher par un humain :\*\*\n- le téléphone/);
});

test("boucle : une correction qui casse un contrôle est écartée", async () => {
  const m = faux({
    relecteur: [{ points: [point("A_CORRIGER")] }],
    correcteur: [corrige(), corrige()],
    verificateur: [],
  });
  const ko = async () => ({ erreurs: ["lien interne inconnu"], avertissements: [] });
  const r = await boucle({ fiche, ctx: "", schemaArticle, appeler: m.appeler, controle: ko });
  assert.equal(r.fiche, fiche);
  assert.equal(r.verdict, "humain");
  assert.deepEqual(m.appels, ["relecteur", "correcteur", "correcteur"]);
  assert.match(verdictMarkdown(r, { model: "m", cout: 0 }), /Contrôles du moteur en échec/);
});

test("boucle : une réponse illisible arrête la boucle, le coût reste compté", async () => {
  const usages = [];
  const appeler = async () => ({ json: null, usage, stopReason: "max_tokens" });
  await assert.rejects(boucle({ fiche, ctx: "", schemaArticle, appeler, controle: ok, usages }), /illisible/);
  assert.equal(usages.length, 1);
});

test("verdict markdown : en-tête, coût au format du moteur", () => {
  const r = { verdict: "pret", tours: 1, verif: { resume: "Tout est réglé.", restes: [] }, erreurs: [], decisions: [], nonAppliques: [], points: [], avertissements: [] };
  const md = verdictMarkdown(r, { model: "claude-opus-5-5", cout: 0.734 });
  assert.match(md, /^## Boucle relecture → correction → verdict : ✅ Prête/);
  assert.match(md, /Coût estimé de la boucle : 0\.73 \$/);
});
