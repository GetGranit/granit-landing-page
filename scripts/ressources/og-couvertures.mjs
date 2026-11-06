// Images de partage (og:image, 1200×630) des articles qui ont un bloc `couverture` : l'affiche, la phrase
// de l'article en serif, le motif de la marque et le logo. Les fiches plateformes et les pages « VS » ont
// les leurs (og-plateformes.mjs). Rendu par Chrome, sur le poste comme dans GitHub Actions.
//   node scripts/ressources/og-couvertures.mjs [slug…]     sans slug : tous les articles
// Sortie : public/ressources/og/{slug}.jpg ; le plugin Vite les branche s'ils existent.
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";

const racine = process.cwd();
const sortie = join(racine, "public/ressources/og");
const lireJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const echapper = (t) =>
  String(t).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
/** Logo embarqué : la page est écrite directement dans Chrome, sans accès aux fichiers. */
const marque = (f) =>
  `data:image/svg+xml;base64,${readFileSync(join(racine, "public/marque", f)).toString("base64")}`;

/** Jetons de la marque, tels quels depuis styles.css (une seule source). */
function jetons() {
  const css = readFileSync(join(racine, "src/styles.css"), "utf8");
  const debut = css.indexOf(":root {");
  return css.slice(debut, css.indexOf("\n}", debut) + 2);
}

/** Encre ou dégradé : les deux fonds de la marque, en alternance d'un article à l'autre. */
const surEncre = (slug) => [...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % 2 === 0;

function page(a) {
  const encre = surEncre(a.slug);
  const suffixe = encre ? "-rose" : "";
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300&display=swap" rel="stylesheet">
<style>
  ${jetons()}
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative;
    background: ${encre ? "var(--encre)" : "var(--degrade-marque)"};
    color: ${encre ? "var(--rose)" : "var(--encre)"};
  }
  /* Le motif reste dans son coin : jamais derrière un texte à lire (DESIGN.md). */
  .motif { position: absolute; right: -90px; bottom: -130px; width: 430px; opacity: .12; }
  h1 {
    position: absolute; top: 112px; left: 84px; width: 930px;
    font: 300 84px/1.05 "Source Serif 4", Georgia, serif;
    font-variation-settings: "opsz" 20; letter-spacing: -.03em; text-wrap: balance;
  }
  h1 em { font-style: normal; color: ${encre ? "var(--menthe)" : "var(--profond)"}; }
  .logo { position: absolute; bottom: 72px; left: 84px; height: 54px; }
</style></head><body>
  <img class="motif" src="${marque(`granit-symbole${suffixe}.svg`)}" alt="">
  <h1>${echapper(a.couverture.accroche.debut)} <em>${echapper(a.couverture.accroche.fin)}</em></h1>
  <img class="logo" src="${marque(`granit-logo${suffixe}.svg`)}" alt="">
</body></html>`;
}

const demandes = new Set(process.argv.slice(2));
const dossier = join(racine, "content/ressources");
const articles = readdirSync(dossier)
  .filter((f) => f.endsWith(".json"))
  .map((f) => lireJson(join(dossier, f)))
  .filter((a) => a.couverture?.accroche && (!demandes.size || demandes.has(a.slug)));

mkdirSync(sortie, { recursive: true });
const executable = ["/usr/bin/google-chrome"].find(existsSync);
const navigateur = await chromium.launch(
  executable ? { executablePath: executable } : { channel: "chrome" },
);
try {
  const onglet = await navigateur.newPage({ viewport: { width: 1200, height: 630 } });
  for (const a of articles) {
    const fichier = join(sortie, `${a.slug}.jpg`);
    await onglet.setContent(page(a), { waitUntil: "load" });
    await onglet.evaluate(() => document.fonts.ready);
    await onglet.screenshot({ path: fichier, type: "jpeg", quality: 85 });
    console.log(fichier.replace(`${racine}/`, ""));
  }
} finally {
  await navigateur.close();
}
