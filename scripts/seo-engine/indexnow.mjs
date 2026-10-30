#!/usr/bin/env node
// Envoie des URL à IndexNow (Bing…) : node indexnow.mjs --depuis <sha> | --sitemap | <url…>
//   --depuis <sha> : articles de content/ressources modifiés depuis ce commit (+ anciens redirigés)
//   --sitemap      : toutes les URL du sitemap en ligne (celui du dépôt n'est pas à jour : regénéré au build)
// À lancer une fois le site déployé : IndexNow fait venir le robot tout de suite.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CLE, corps, slugsTouches } from "./lib/indexnow.mjs";
import { CONTENU } from "./lib/site.mjs";

const { site } = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));
const args = process.argv.slice(2);

let urls;
if (args[0] === "--depuis") {
  const fichiers = execFileSync("git", ["diff", "--name-only", `${args[1]}..HEAD`, "--", "content/ressources"], {
    encoding: "utf8",
  }).split("\n").filter(Boolean);
  const lire = (slug) => {
    const p = join(CONTENU, `${slug}.json`);
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  };
  urls = slugsTouches(fichiers, lire).map((s) => `${site}/ressources/${s}`);
} else if (args[0] === "--sitemap") {
  const xml = await (await fetch(`${site}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} else {
  urls = args;
}

if (!urls.length) {
  console.log("IndexNow : aucune URL à envoyer.");
  process.exit(0);
}

const cle = await fetch(`${site}/${CLE}.txt`);
if (!cle.ok || (await cle.text()).trim() !== CLE) {
  console.error(`IndexNow : ${site}/${CLE}.txt ne sert pas la clé (pas encore déployé ?)`);
  process.exit(1);
}

const r = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(corps(site, urls)),
});
// 200 = reçu, 202 = reçu, clé en cours de vérification
if (r.status !== 200 && r.status !== 202) {
  console.error(`IndexNow : HTTP ${r.status} ${await r.text()}`);
  process.exit(1);
}
console.log(`IndexNow : ${urls.length} URL envoyées (HTTP ${r.status})\n${urls.join("\n")}`);
