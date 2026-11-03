// Images d'aperçu (og:image, 1200×630) des fiches plateformes : la fenêtre de prise en charge
// des cartes (FenetrePlateforme), le nom en serif et le logo Granit (src/assets/logo.svg, tel quel).
// Une image par fichier de faits content/plateformes/*.json, plus la fiche « tous portails ».
// Rendu par le Chrome installé, en headless : aucune dépendance. À relancer quand une plateforme
// est ajoutée :   node scripts/ressources/og-plateformes.mjs
// Sortie : public/ressources/og/{slug}.jpg ; le plugin Vite les branche s'ils existent.
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  estSymbole,
  LIGNES_FENETRE,
  logoPlateforme,
  nomFenetre,
  PORTAILS_FENETRE,
  statutsCarte,
} from "../../src/lib/ressources/logos.ts";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const racine = process.cwd();
const sortie = join(racine, "public/ressources/og");
/** Slug de la fiche d'introduction, qui prend la fenêtre « tous portails ». */
const TOUS_PORTAILS = "portails-tiers-payant";

const lireJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const echapper = (t) =>
  String(t).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const fichier = (chemin) => pathToFileURL(join(racine, "public", chemin)).href;

/** Jetons de la marque, tels quels depuis styles.css (une seule source) : le bloc :root et les
 *  trois variables de police. La fenêtre de ressources.css les consomme (var(--papier)…). */
function cssJetons() {
  const css = readFileSync(join(racine, "src/styles.css"), "utf8");
  const debut = css.indexOf(":root {");
  const fin = css.indexOf("\n}", debut);
  if (debut < 0 || fin < 0) throw new Error("Bloc :root de styles.css introuvable");
  const polices = css.match(/--font-(sans|serif|mono):[^;]+;/g);
  if (!polices || polices.length < 3) throw new Error("Variables de police de styles.css introuvables");
  return `${css.slice(debut, fin)}\n  ${polices.join("\n  ")}\n}`;
}

/** Styles de la fenêtre, tels quels depuis ressources.css (une seule source). */
function cssFenetre() {
  const css = readFileSync(join(racine, "src/ressources.css"), "utf8");
  const debut = css.indexOf("/* ── Fenêtre des fiches plateformes");
  const fin = css.indexOf("@media (prefers-reduced-motion", debut);
  if (debut < 0 || fin < 0) throw new Error("Bloc « Fenêtre des fiches plateformes » introuvable");
  return css.slice(debut, fin);
}

/** Même balisage que FenetrePlateforme (Cartes.tsx). */
function fenetre(p) {
  const badge = (statut, libelle) => `<span class="badge ${statut}">${echapper(libelle)}</span>`;
  if (!p) {
    const lignes = PORTAILS_FENETRE.map(
      (l) => `<div class="ress-fenetre-ligne portail ${l.classe}">
        <img src="${fichier(logoPlateforme(l.logo, "fenetre"))}" alt="" class="marque">
        <span class="textes"><span class="l1" style="width:58%"></span><span class="l2" style="width:${l.l2}%"></span></span>
        ${badge(l.statut, l.libelle)}</div>`,
    ).join("");
    return `<div class="ress-fenetre-barre"><span class="nom">Prises en charge</span><span class="ref">Tous portails</span></div>${lignes}`;
  }
  const logo = logoPlateforme(p.logo, "fenetre");
  const marque = logo
    ? `<img src="${fichier(logo)}" alt="" class="${estSymbole(logo) ? "symbole" : "logotype"}">`
    : `<span class="initiale">${echapper(p.nom.slice(0, 1).toUpperCase())}</span>`;
  const nom =
    !logo || estSymbole(logo) ? `<span class="nom">${echapper(nomFenetre(p.nom))}</span>` : "";
  const statuts = statutsCarte(p.statuts);
  const lignes = LIGNES_FENETRE.map(
    (l) => `<div class="ress-fenetre-ligne ${l.classe}">
      <span class="textes"><span class="l1" style="width:${l.l1}%"></span><span class="l2" style="width:${l.l2}%"></span></span>
      <span class="montant"></span>${badge(l.statut, statuts[l.statut])}</div>`,
  ).join("");
  return `<div class="ress-fenetre-barre">${marque}${nom}<span class="ref">Prises en charge</span></div>${lignes}`;
}

function page({ titre, suite, p }) {
  const logoGranit = pathToFileURL(join(racine, "src/assets/logo.svg")).href;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@500;600&family=Source+Serif+4:opsz,wght@8..60,400&display=swap" rel="stylesheet">
<style>
  ${cssJetons()}
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  /* Grand fond de l'image de partage : le dégradé de la marque (DESIGN.md). */
  body { position: relative; background: var(--degrade-marque); font-family: var(--font-sans); color: var(--encre); }
  ${cssFenetre()}
  /* Aperçu : la scène occupe la moitié droite, la fenêtre y est plus grosse que sur une carte.
     Le dégradé du fond tient lieu de scène : ni aplat ni trame derrière la fenêtre. */
  .droite { position: absolute; top: 0; right: 0; width: 640px; height: 630px; }
  .droite .ress-fenetre-scene { background: transparent; }
  .droite .ress-fenetre-scene::before { display: none; }
  .droite .ress-fenetre { --s: 1.5cqw; width: 84%; top: 15%; }
  .texte { position: absolute; left: 72px; top: 0; bottom: 0; width: 470px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: var(--font-sans); font-size: 18px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--texte-discret); }
  h1 { margin-top: 22px; font-family: var(--font-serif); font-variation-settings: "opsz" 20; font-weight: 400; font-size: ${titre.length > 14 ? 60 : 80}px; line-height: 1.05; letter-spacing: -0.02em; }
  h1 em { display: block; margin-top: 14px; font-size: 38px; font-style: normal; line-height: 1.2; letter-spacing: -0.01em; color: var(--profond); }
  .granit { position: absolute; left: 72px; bottom: 52px; }
  .granit img { display: block; height: 34px; width: auto; }
</style></head><body>
  <div class="droite"><div class="ress-fenetre-scene"><div class="ress-fenetre">${fenetre(p)}</div></div></div>
  <div class="texte">
    <div class="eyebrow">Plateformes · Tiers payant</div>
    <h1>${echapper(titre)}<em>${echapper(suite)}</em></h1>
  </div>
  <div class="granit"><img src="${logoGranit}" alt="Granit"></div>
</body></html>`;
}

function capturer(html, slug, dossier) {
  const source = join(dossier, `${slug}.html`);
  const png = join(dossier, `${slug}.png`);
  writeFileSync(source, html);
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--allow-file-access-from-files",
      "--window-size=1200,630",
      "--virtual-time-budget=6000",
      `--screenshot=${png}`,
      pathToFileURL(source).href,
    ],
    { stdio: "ignore" },
  );
  const jpg = join(sortie, `${slug}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "85", png, "--out", jpg], {
    stdio: "ignore",
  });
  return jpg;
}

if (!existsSync(CHROME)) throw new Error(`Chrome introuvable : ${CHROME}`);
mkdirSync(sortie, { recursive: true });
const dossier = mkdtempSync(join(tmpdir(), "og-plateformes-"));
const fiches = readdirSync(join(racine, "content/plateformes"))
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => lireJson(join(racine, "content/plateformes", f)))
  .map((p) => ({ slug: p.slug, titre: p.nom, suite: "prise en charge, statuts et paiement", p }));
fiches.push({
  slug: TOUS_PORTAILS,
  titre: "Portails de tiers payant",
  suite: "connexion, prise en charge, rejet et paiement",
});
try {
  for (const f of fiches) console.log(capturer(page(f), f.slug, dossier).replace(racine + "/", ""));
} finally {
  rmSync(dossier, { recursive: true, force: true });
}
