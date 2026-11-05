#!/usr/bin/env node
// planche : photographie tout le site, page par page, en 375 et 1280 px.
// Pour chaque page : statut HTTP, erreurs console, liens internes cassés, capture pleine page.
// Écrit planche/index.html (planche contact) et planche/rapport.md. Sert de « avant / après » à la
// bascule de marque : on garde la planche de main, puis on compare.
//
//   npm run build && npm run planche                     serveur local lancé au besoin (wrangler dev, port 4173)
//   node scripts/planche.mjs https://www.getgranit.ai    une autre base (préprod, prod)
//   node scripts/planche.mjs --compare ../planche-avant  met la planche « avant » à côté de chaque capture
//   node scripts/planche.mjs --pages /,/tarifs           seulement ces pages
//   options : --out <dossier> (défaut planche/), --concurrence <n> (défaut 4)
//
// Pages : public/sitemap.xml (régénéré par le build) + les routes statiques de src/routes qui n'y sont
// pas (cgv, privacy, en, essai…) + les pages HTML de public/.
import { spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(fileURLToPath(import.meta.url), "../..");
const DEFAUT = "http://localhost:4173";
const LARGEURS = [375, 1280];

const args = process.argv.slice(2);
const valeur = (nom, defaut) => {
  const i = args.indexOf(nom);
  return i >= 0 && args[i + 1] ? args[i + 1] : defaut;
};
const positionnels = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const BASE = (positionnels[0] || DEFAUT).replace(/\/$/, "");
const SORTIE = resolve(valeur("--out", join(RACINE, "planche")));
const COMPARE = valeur("--compare") ? resolve(valeur("--compare")) : null;
const CONCURRENCE = Number(valeur("--concurrence", 4));
const FILTRE = valeur("--pages")
  ?.split(",")
  .map((p) => p.trim());

// ── Liste des pages ──────────────────────────────────────────────────────────
function listerPages() {
  const pages = new Set();
  const sitemap = join(RACINE, "public/sitemap.xml");
  if (existsSync(sitemap)) {
    for (const [, loc] of readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g))
      pages.add(normaliser(new URL(loc).pathname));
  } else
    console.log(
      "! public/sitemap.xml absent : lancez npm run build (ou node scripts/gen-sitemap.mjs).",
    );
  const nbSitemap = pages.size;
  for (const f of readdirSync(join(RACINE, "src/routes"))) {
    const m = readFileSync(join(RACINE, "src/routes", f), "utf8").match(
      /createFileRoute\(\s*["'`]([^"'`]+)["'`]/,
    );
    if (m && !m[1].includes("$")) pages.add(normaliser(m[1]));
  }
  for (const f of readdirSync(join(RACINE, "public"))) if (f.endsWith(".html")) pages.add("/" + f);
  console.log(
    `${pages.size} pages : ${nbSitemap} du sitemap, ${pages.size - nbSitemap} des routes et de public/.`,
  );
  const liste = [...pages].sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
  return FILTRE ? liste.filter((p) => FILTRE.includes(p)) : liste;
}
function normaliser(chemin) {
  return chemin === "/" ? "/" : chemin.replace(/\/+$/, "");
}
const slug = (chemin) =>
  chemin === "/" ? "accueil" : chemin.slice(1).replace(/[^a-z0-9.-]+/gi, "_");

// ── Serveur local ────────────────────────────────────────────────────────────
async function joignable(url) {
  try {
    await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(3000) });
    return true;
  } catch {
    return false;
  }
}
async function assurerServeur() {
  if (await joignable(BASE)) return null;
  if (BASE !== DEFAUT) throw new Error(`${BASE} ne répond pas.`);
  if (!existsSync(join(RACINE, ".output/server")))
    throw new Error("Pas de build : lancez npm run build d'abord.");
  // `vite preview` ne sait pas servir le build Cloudflare (nitro) : on sert .output avec wrangler.
  console.log("Serveur local absent : lancement de wrangler dev sur le port 4173…");
  const proc = spawn("npx", ["wrangler", "dev", "--port", "4173", "--ip", "127.0.0.1"], {
    cwd: RACINE,
    stdio: "ignore",
    detached: false,
  });
  for (let i = 0; i < 90; i++) {
    if (await joignable(BASE)) return proc;
    await new Promise((r) => setTimeout(r, 1000));
  }
  proc.kill();
  throw new Error("wrangler dev n'a pas démarré en 90 s.");
}

// ── Une page, une largeur ────────────────────────────────────────────────────
async function photographier(navigateur, chemin, largeur) {
  const contexte = await navigateur.newContext({
    viewport: { width: largeur, height: largeur < 600 ? 812 : 800 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await contexte.newPage();
  const erreurs = [];
  const origine = new URL(BASE).origin;
  page.on("console", (m) => m.type() === "error" && erreurs.push(m.text().slice(0, 300)));
  page.on("pageerror", (e) => erreurs.push("Exception : " + String(e.message || e).slice(0, 300)));
  page.on("response", (r) => {
    if (
      r.status() >= 400 &&
      r.url().startsWith(origine) &&
      r.request().resourceType() !== "document"
    )
      erreurs.push(`${r.status()} ${r.url().slice(origine.length)}`);
  });
  page.on("requestfailed", (r) => {
    const raison = r.failure()?.errorText || "";
    if (!/ERR_ABORTED|NS_BINDING_ABORTED/.test(raison))
      erreurs.push(`Requête échouée (${raison}) : ${r.url().slice(0, 200)}`);
  });
  const resultat = {
    chemin,
    largeur,
    statut: 0,
    final: chemin,
    redirections: [],
    erreurs,
    liens: [],
    capture: null,
    duree: 0,
  };
  const debut = Date.now();
  try {
    let reponse;
    try {
      reponse = await page.goto(BASE + chemin, { waitUntil: "networkidle", timeout: 30000 });
    } catch {
      reponse = await page.goto(BASE + chemin, { waitUntil: "load", timeout: 30000 });
    }
    resultat.statut = reponse?.status() ?? 0;
    resultat.final = page.url().replace(origine, "") || "/";
    for (let r = reponse?.request().redirectedFrom(); r; r = r.redirectedFrom()) {
      const rep = await r.response();
      resultat.redirections.unshift(`${rep?.status() ?? "?"} ${r.url().replace(origine, "")}`);
    }
    // Descend la page pour déclencher les apparitions au défilement, puis revient en haut.
    await page.evaluate(async () => {
      const pas = window.innerHeight * 0.8;
      for (let y = 0; y < document.documentElement.scrollHeight; y += pas) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    resultat.liens = await page.$$eval("a[href]", (as) => as.map((a) => a.href));
    resultat.liens = [
      ...new Set(resultat.liens.filter((h) => h.startsWith(origine)).map((h) => h.split("#")[0])),
    ];
    const fichier = `captures/${slug(chemin)}-${largeur}.jpg`;
    await page.screenshot({
      path: join(SORTIE, fichier),
      fullPage: true,
      type: "jpeg",
      quality: 75,
    });
    resultat.capture = fichier;
  } catch (e) {
    erreurs.push("Planche : " + String(e.message || e).split("\n")[0]);
  }
  resultat.duree = Date.now() - debut;
  await contexte.close();
  return resultat;
}

// ── Liens internes ───────────────────────────────────────────────────────────
async function verifierLiens(resultats) {
  const vus = new Map(
    resultats
      .filter((r) => r.largeur === LARGEURS[1])
      .map((r) => [new URL(BASE + r.chemin).href, r.statut]),
  );
  const references = new Map();
  for (const r of resultats)
    for (const l of r.liens) {
      if (!references.has(l)) references.set(l, new Set());
      references.get(l).add(r.chemin);
    }
  const casses = [];
  const aVerifier = [...references.keys()];
  await pool(aVerifier, 8, async (lien) => {
    let statut = vus.get(lien);
    if (statut === undefined) {
      try {
        statut = (await fetch(lien, { redirect: "follow", signal: AbortSignal.timeout(15000) }))
          .status;
      } catch {
        statut = 0;
      }
    }
    if (statut === 0 || statut >= 400)
      casses.push({
        lien: lien.replace(new URL(BASE).origin, ""),
        statut,
        depuis: [...references.get(lien)].sort(),
      });
  });
  return { total: aVerifier.length, casses: casses.sort((a, b) => a.lien.localeCompare(b.lien)) };
}

async function pool(items, n, fn) {
  const file = [...items];
  await Promise.all(
    Array.from({ length: Math.min(n, file.length) }, async () => {
      while (file.length) await fn(file.shift());
    }),
  );
}

// ── Sorties ──────────────────────────────────────────────────────────────────
const echap = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

function ecrireHtml(pages, parPage, liens, avant) {
  const casseParPage = new Map();
  for (const c of liens.casses)
    for (const p of c.depuis) casseParPage.set(p, (casseParPage.get(p) || 0) + 1);
  const blocs = pages.map((chemin) => {
    const rs = LARGEURS.map((l) => parPage.get(chemin + "|" + l));
    const statut = rs[1]?.statut || rs[0]?.statut;
    const nbErr = rs.reduce((n, r) => n + (r?.erreurs.length || 0), 0);
    const nbCasses = casseParPage.get(chemin) || 0;
    const ko = !statut || statut >= 400;
    const vignettes = LARGEURS.map((l, i) => {
      const r = rs[i];
      const apres = r?.capture
        ? `<a href="${r.capture}"><img loading="lazy" src="${r.capture}" alt="${echap(chemin)} en ${l} px"></a>`
        : `<div class="vide">pas de capture</div>`;
      const av = avant?.get(chemin + "|" + l);
      if (!avant) return `<figure class="l${l}"><figcaption>${l} px</figcaption>${apres}</figure>`;
      const imgAvant = av
        ? `<a href="avant/${av}"><img loading="lazy" src="avant/${av}" alt="avant"></a>`
        : `<div class="vide">absente avant</div>`;
      return `<figure class="l${l} duo"><figcaption>${l} px · avant / après</figcaption><div class="cote">${imgAvant}${apres}</div></figure>`;
    }).join("");
    const details = rs
      .flatMap((r) => (r?.erreurs || []).map((e) => `<li>${r.largeur} px · ${echap(e)}</li>`))
      .slice(0, 12)
      .join("");
    return `<section id="${slug(chemin)}" class="${ko ? "ko" : ""}">
  <header><h2><a href="${echap(BASE + chemin)}">${echap(chemin)}</a></h2>
  <span class="badge ${ko ? "rouge" : ""}">${statut || "injoignable"}</span>
  ${rs[1]?.redirections.length ? `<span class="badge">${echap(rs[1].redirections.join(" → "))} → ${echap(rs[1].final)}</span>` : ""}
  ${nbErr ? `<span class="badge rouge">${nbErr} erreur(s) console</span>` : ""}
  ${nbCasses ? `<span class="badge rouge">${nbCasses} lien(s) cassé(s)</span>` : ""}</header>
  ${details ? `<ul class="err">${details}</ul>` : ""}
  <div class="grille">${vignettes}</div>
</section>`;
  });
  const nbKo = pages.filter((p) => {
    const r = parPage.get(p + "|1280");
    return !r?.statut || r.statut >= 400;
  }).length;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Planche du site</title><style>
body{margin:0;padding:24px 16px;background:#FAF0F2;color:#1F3530;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{font-size:22px;margin:0 0 4px}.meta{color:rgba(31,53,48,.7);margin:0 0 24px}
nav{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px}nav a{color:#2F7A64;font-size:12px}
section{background:#FFFDFD;border:1px solid rgba(31,53,48,.12);border-radius:12px;padding:16px;margin-bottom:20px}
section.ko{border-color:#C8504A}header{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
h2{font-size:16px;margin:0}h2 a{color:inherit}.badge{font-size:12px;padding:2px 8px;border-radius:999px;background:rgba(168,220,203,.6);color:#1D5646}
.badge.rouge{background:#FAEAEF;color:#A9433D}.err{color:#A9433D;font-size:12px;margin:8px 0}
.grille{display:flex;gap:16px;align-items:flex-start;margin-top:12px;overflow-x:auto}
figure{margin:0}figcaption{font-size:12px;color:rgba(31,53,48,.7);margin-bottom:4px}
.l375 img{width:188px}.l1280 img{width:480px}.duo .cote{display:flex;gap:6px}
img{display:block;border:1px solid rgba(31,53,48,.12);border-radius:6px;max-height:1400px;object-fit:cover;object-position:top}
.vide{width:188px;height:120px;display:grid;place-items:center;border:1px dashed rgba(31,53,48,.12);color:rgba(31,53,48,.7)}
</style></head><body>
<h1>Planche du site</h1>
<p class="meta">${echap(BASE)} · ${new Date().toLocaleString("fr-FR")} · ${pages.length} pages · ${nbKo} en erreur · ${liens.casses.length} lien(s) interne(s) cassé(s) sur ${liens.total}${avant ? ` · comparée à ${echap(basename(COMPARE))}` : ""}</p>
<nav>${pages.map((p) => `<a href="#${slug(p)}">${echap(p)}</a>`).join("")}</nav>
${blocs.join("\n")}
</body></html>`;
  writeFileSync(join(SORTIE, "index.html"), html);
}

function ecrireRapport(pages, parPage, liens) {
  const l = [
    "# Planche du site",
    "",
    `- Base : ${BASE}`,
    `- Date : ${new Date().toISOString()}`,
    `- Pages : ${pages.length} × ${LARGEURS.join(" et ")} px`,
    "",
  ];
  const ko = pages.filter((p) => {
    const r = parPage.get(p + "|1280");
    return !r?.statut || r.statut >= 400;
  });
  const avecErreurs = pages.filter((p) =>
    LARGEURS.some((w) => parPage.get(p + "|" + w)?.erreurs.length),
  );
  l.push(
    `- Pages en erreur HTTP : ${ko.length}`,
    `- Pages avec erreurs console : ${avecErreurs.length}`,
    `- Liens internes cassés : ${liens.casses.length} sur ${liens.total}`,
    "",
  );
  l.push("| Page | Statut | Redirection | Erreurs console (375 / 1280) |", "|---|---|---|---|");
  for (const p of pages) {
    const [a, b] = LARGEURS.map((w) => parPage.get(p + "|" + w));
    l.push(
      `| \`${p}\` | ${b?.statut || a?.statut || "injoignable"} | ${b?.redirections.length ? `${b.redirections.join(" → ")} → ${b.final}` : ""} | ${a?.erreurs.length ?? "–"} / ${b?.erreurs.length ?? "–"} |`,
    );
  }
  if (liens.casses.length) {
    l.push("", "## Liens internes cassés", "");
    for (const c of liens.casses)
      l.push(
        `- \`${c.lien}\` (${c.statut || "injoignable"}) depuis ${c.depuis.map((d) => `\`${d}\``).join(", ")}`,
      );
  }
  if (avecErreurs.length) {
    l.push("", "## Erreurs console", "");
    for (const p of avecErreurs) {
      const toutes = new Map();
      for (const w of LARGEURS)
        for (const e of parPage.get(p + "|" + w)?.erreurs || [])
          toutes.set(e, [...(toutes.get(e) || []), w]);
      l.push(
        `### \`${p}\``,
        "",
        ...[...toutes].map(([e, ws]) => `- (${ws.join(", ")} px) ${e.replace(/\s+/g, " ")}`),
        "",
      );
    }
  }
  writeFileSync(join(SORTIE, "rapport.md"), l.join("\n") + "\n");
}

function chargerAvant() {
  if (!COMPARE) return null;
  const manifeste = join(COMPARE, "manifest.json");
  if (!existsSync(manifeste))
    throw new Error(`--compare : ${manifeste} introuvable (dossier produit par planche ?)`);
  cpSync(join(COMPARE, "captures"), join(SORTIE, "avant"), { recursive: true });
  const avant = new Map();
  for (const r of JSON.parse(readFileSync(manifeste, "utf8")).resultats)
    if (r.capture) avant.set(r.chemin + "|" + r.largeur, relative("captures", r.capture));
  return avant;
}

// ── Principal ────────────────────────────────────────────────────────────────
const { chromium } = await import("playwright").catch(() => {
  console.error("Playwright absent : npm ci, puis npx playwright install chromium.");
  process.exit(2);
});
if (COMPARE && resolve(COMPARE) === SORTIE)
  throw new Error("--compare doit viser un autre dossier que la sortie.");
rmSync(SORTIE, { recursive: true, force: true });
mkdirSync(join(SORTIE, "captures"), { recursive: true });
const pages = listerPages();
const serveur = await assurerServeur();
const navigateur = await chromium.launch();
const resultats = [];
try {
  const travaux = pages.flatMap((p) => LARGEURS.map((l) => [p, l]));
  let fait = 0;
  await pool(travaux, CONCURRENCE, async ([p, l]) => {
    const r = await photographier(navigateur, p, l);
    resultats.push(r);
    fait++;
    process.stdout.write(`\r${fait}/${travaux.length} ${p} (${l})`.padEnd(80));
  });
  process.stdout.write("\n");
  const liens = await verifierLiens(resultats);
  const parPage = new Map(resultats.map((r) => [r.chemin + "|" + r.largeur, r]));
  const avant = chargerAvant();
  ecrireHtml(pages, parPage, liens, avant);
  ecrireRapport(pages, parPage, liens);
  writeFileSync(
    join(SORTIE, "manifest.json"),
    JSON.stringify(
      {
        base: BASE,
        date: new Date().toISOString(),
        resultats: resultats.map(({ liens: _, ...r }) => r),
        liens,
      },
      null,
      2,
    ),
  );
  const ko = resultats.filter((r) => !r.statut || r.statut >= 400).length;
  const err = resultats.filter((r) => r.erreurs.length).length;
  console.log(
    `Planche : ${relative(process.cwd(), join(SORTIE, "index.html"))} · ${ko} capture(s) en erreur HTTP · ${err} avec erreurs console · ${liens.casses.length} lien(s) cassé(s).`,
  );
} finally {
  await navigateur.close();
  serveur?.kill();
}
