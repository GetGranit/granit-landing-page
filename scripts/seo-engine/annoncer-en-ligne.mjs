#!/usr/bin/env node
// Après un déploiement en production : un message Slack pour les articles NOUVEAUX depuis ce commit, une fois leur page servie.
// Usage : node scripts/seo-engine/annoncer-en-ligne.mjs --depuis <sha>
// Variables : SLACK_BOT_TOKEN, SLACK_CANAL_SEO. Les refontes (fichiers modifiés) et les fiches hors ligne
// dans la file (waiting, review) ne sont pas annoncées.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CONTENU, lireFile } from "./lib/site.mjs";
import { messageEnLigne } from "./lib/slack.mjs";

const { site } = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));
const [option, depuis] = process.argv.slice(2);
if (option !== "--depuis" || !depuis) throw new Error("usage : annoncer-en-ligne.mjs --depuis <sha>");
const { SLACK_BOT_TOKEN: token, SLACK_CANAL_SEO: canal } = process.env;

const statut = new Map(lireFile().map((a) => [a.slug, a.status]));
const ajoutes = execFileSync("git", ["diff", "--diff-filter=A", "--name-only", `${depuis}..HEAD`, "--", "content/ressources"], {
  encoding: "utf8",
})
  .split("\n")
  .map((f) => f.match(/^content\/ressources\/([^/]+)\.json$/)?.[1])
  .filter((slug) => slug && (statut.get(slug) ?? "published") === "published");

if (!ajoutes.length) {
  console.log("Aucun nouvel article dans ce déploiement.");
  process.exit(0);
}

// Le déploiement est fini mais le cache peut servir l'ancienne version quelques instants : on attend la page (3 min au plus).
async function enLigne(url) {
  for (let i = 0; i < 18; i++) {
    const r = await fetch(url, { redirect: "manual" }).catch(() => null);
    if (r?.status === 200) return true;
    await new Promise((ok) => setTimeout(ok, 10_000));
  }
  return false;
}

const articles = await Promise.all(
  ajoutes.map(async (slug) => {
    const p = join(CONTENU, `${slug}.json`);
    const fiche = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
    const url = `${site}/ressources/${slug}`;
    return { titre: fiche?.title ?? slug, verdict: fiche?.moteur?.relecture?.verdict, url, ok: await enLigne(url) };
  }),
);
const absents = articles.filter((a) => !a.ok);
absents.forEach((a) => console.error(`${a.url} ne répond pas 200 après 3 min : pas d'annonce.`));
const servis = articles.filter((a) => a.ok);
if (!servis.length) process.exit(1);

if (!token || !canal) {
  console.log(`Slack non configuré. Message prévu :\n${messageEnLigne(servis)}`);
  process.exit(absents.length ? 1 : 0);
}
const r = await fetch("https://slack.com/api/chat.postMessage", {
  method: "POST",
  headers: { authorization: `Bearer ${token}`, "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ channel: canal, text: messageEnLigne(servis), unfurl_links: false }),
});
const d = await r.json();
if (!d.ok) {
  console.error(`Slack : ${d.error}`);
  process.exit(1);
}
console.log(`Annoncé : ${servis.map((a) => a.url).join(", ")}`);
process.exit(absents.length ? 1 : 0);
