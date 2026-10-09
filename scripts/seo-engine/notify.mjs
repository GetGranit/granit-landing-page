#!/usr/bin/env node
// Message dans le canal Slack SEO : node notify.mjs <ok|erreur>
// Variables : SLACK_BOT_TOKEN, SLACK_CANAL_SEO, SLUG, TITLE, URL, PR, COUT, RUN_URL
// La fiche de l'article (content/ressources/{SLUG}.json) donne les mots-clés, la taille et les avertissements.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CONTENU } from "./lib/site.mjs";
import { message } from "./lib/slack.mjs";

const [etat] = process.argv.slice(2);
const {
  SLACK_BOT_TOKEN: token,
  SLACK_CANAL_SEO: canal,
  SLUG,
  TITLE,
  URL,
  PR,
  COUT,
  RUN_URL,
} = process.env;

if (!token || !canal) {
  console.log("Slack non configuré (SLACK_BOT_TOKEN / SLACK_CANAL_SEO) : pas de notification.");
  process.exit(0);
}

const chemin = SLUG ? join(CONTENU, `${SLUG}.json`) : null;
const fiche = chemin && existsSync(chemin) ? JSON.parse(readFileSync(chemin, "utf8")) : null;

const text = message({ etat, fiche, titre: TITLE, url: URL, pr: PR, cout: COUT, runUrl: RUN_URL });

const r = await fetch("https://slack.com/api/chat.postMessage", {
  method: "POST",
  headers: { authorization: `Bearer ${token}`, "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ channel: canal, text, unfurl_links: false }),
});
const d = await r.json();
if (!d.ok) {
  console.error(`Slack : ${d.error}`);
  process.exit(1);
}
console.log("Notification Slack envoyée.");
