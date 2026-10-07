#!/usr/bin/env node
// Une ligne dans le canal Slack SEO : node notify.mjs <ok|erreur>
// Variables : SLACK_BOT_TOKEN, SLACK_CANAL_SEO, TITLE, URL, PR, RUN_URL, AVERTISSEMENTS
const [etat] = process.argv.slice(2);
const { SLACK_BOT_TOKEN: token, SLACK_CANAL_SEO: canal, TITLE, URL, PR, RUN_URL, AVERTISSEMENTS } = process.env;

if (!token || !canal) {
  console.log("Slack non configuré (SLACK_BOT_TOKEN / SLACK_CANAL_SEO) : pas de notification.");
  process.exit(0);
}

const avert = Number(AVERTISSEMENTS || 0) ? ` · ${AVERTISSEMENTS} avertissement(s)` : "";
const text =
  etat === "erreur"
    ? `⚠️ Moteur SEO en erreur, rien n'est publié. <${RUN_URL}|Voir les logs>`
    : PR
      ? `👀 Article à relire : <${PR}|${TITLE}>${avert}. Fusionner la PR = publier.`
      : `📝 Article publié : <${URL}|${TITLE}>${avert}`;

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
