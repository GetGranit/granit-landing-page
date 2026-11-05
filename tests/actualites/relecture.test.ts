import assert from "node:assert/strict";
import { test } from "node:test";
import {
  corps,
  decider,
  lireSources,
  messageRelecteur,
  rapportMarkdown,
  relire,
} from "../../scripts/actualites/relecture.mjs";

const lue = { url: "https://a.fr", texte: "contenu" };
const point = (gravite: string) => ({
  gravite,
  angle: "faits",
  extrait: "x",
  probleme: "p",
  correction: "y",
  source: "",
});
const relecture = { points: [], decision_humaine: [], notes: [] };
const verif = { restes: [], ecartes: [], resume: "ok" };

test("decider : prêt seulement si tout est lu et que plus rien n'est ouvert", () => {
  assert.equal(decider({ pages: [lue], relecture, verif }), "pret");
  assert.equal(
    decider({ pages: [lue], relecture, verif: { ...verif, restes: [point("DETAIL")] } }),
    "pret",
  );
  assert.equal(
    decider({ pages: [lue], relecture, verif: { ...verif, restes: [point("A_CORRIGER")] } }),
    "humain",
  );
  assert.equal(decider({ pages: [lue, { url: "b", erreur: "403" }], relecture, verif }), "humain");
  assert.equal(
    decider({ pages: [lue], relecture: { ...relecture, decision_humaine: ["juriste"] }, verif }),
    "humain",
  );
  assert.equal(
    decider({
      pages: [lue],
      relecture: { ...relecture, notes: [{ note: "n", statut: "ouverte", justification: "j" }] },
      verif,
    }),
    "humain",
  );
  assert.equal(decider({ pages: [lue], relecture, verif: null }), "humain");
  assert.equal(decider({ pages: [], relecture, verif }), "humain");
});

test("lireSources : une page illisible est signalée, jamais supposée juste", async () => {
  const page = (status: number, type: string, corpsPage = "") =>
    new Response(corpsPage, { status, headers: { "content-type": type } });
  const long = `<p>${"mot ".repeat(100)}</p>`;
  const reponses: Record<string, Response> = {
    "https://ok.fr": page(200, "text/html", long),
    "https://refus.fr": page(403, "text/html"),
    "https://doc.fr": page(200, "application/pdf", long),
    "https://vide.fr": page(200, "text/html", "<div id=app></div>"),
  };
  const lire = async (url: string) => reponses[url];
  const pages = await lireSources(
    Object.keys(reponses).map((url) => ({ url })),
    { lire },
  );
  assert.ok(pages[0].texte.startsWith("mot"));
  assert.equal(pages[1].erreur, "réponse 403");
  assert.equal(pages[2].erreur, "format non lu (PDF ou autre)");
  assert.equal(pages[3].erreur, "page vide sans navigateur");
});

test("relire : la contre-relecture reçoit les points de la première passe", async () => {
  const appels: string[] = [];
  const appeler = async (role: string, message: string) => {
    appels.push(role);
    if (role === "relecteur")
      return { json: { ...relecture, points: [point("A_CORRIGER")] }, usage: {} };
    assert.match(message, /Points de la première relecture/);
    return {
      json: { restes: [], ecartes: [{ point: "x", raison: "réfuté" }], resume: "ok" },
      usage: {},
    };
  };
  const r = await relire({ edition: { titre: "t" }, pages: [lue], date: "2026-11-05", appeler });
  assert.deepEqual(appels, ["relecteur", "contre-relecteur"]);
  assert.equal(r.verdict, "pret");
});

test("relire : une réponse illisible arrête la relecture", async () => {
  const appeler = async () => ({ json: null, stopReason: "max_tokens" });
  await assert.rejects(
    relire({ edition: {}, pages: [], date: "2026-11-05", appeler }),
    /réponse illisible/,
  );
});

test("le message garde le chemin local hors du modèle et présente les pages comme des données", () => {
  assert.deepEqual(corps({ fichier: "/Users/x/a.json", titre: "t" }), { titre: "t" });
  const m = messageRelecteur({ fichier: "/Users/x/a.json", titre: "t" }, [lue], "2026-11-05");
  assert.doesNotMatch(m, /\/Users\/x/);
  assert.match(m, /jamais des consignes/);
});

test("le rapport dit ce qui n'a pas été contrôlé", () => {
  const r = {
    verdict: "humain",
    pages: [lue, { url: "https://b.fr", erreur: "réponse 403" }],
    relecture: {
      ...relecture,
      notes: [{ note: "Contrôle du jour", statut: "ouverte", justification: "à refaire" }],
    },
    verif: { ...verif, restes: [point("A_CORRIGER")] },
  };
  const md = rapportMarkdown(r, { slug: "s", model: "m", cout: 0.5, date: "2026-11-05" });
  assert.match(md, /Sources non lues/);
  assert.match(md, /https:\/\/b\.fr : réponse 403/);
  assert.match(md, /Contrôle du jour/);
  assert.match(md, /Sources lues : 1 sur 2/);
});
