#!/usr/bin/env node
// check-marque : le filet de la bascule de marque. Node seul, aucune dépendance.
//
// Cherche dans src/, public/*.html, public/*.svg et scripts/ ce qui n'appartient pas à la marque Granit
// telle que DESIGN.md (racine, copie de internal/marque) la définit :
//   ancienne-variable     --terra*, --sage*, --font-hand et les utilitaires qui en dérivent (bg-terra…)
//   couleur-hors-palette  hex, rgb(a), hsl, oklch… dont la teinte n'est pas un jeton de DESIGN.md
//   police-hors-marque    toute famille hors Source Serif 4, Geist, polices de mail et piles système
//   ombre-brune           rgba(28, 17, 8, …), les ombres de l'ancienne marque
//
// Mode cliquet (par défaut) : scripts/check-marque.baseline.json garde le compte par fichier et par
// règle ; on échoue seulement si un fichier dépasse son compte. Les exceptions légitimes vont dans
// scripts/check-marque.exceptions.json, avec leur raison.
//
//   node scripts/check-marque.mjs                    cliquet contre la baseline du dépôt
//   node scripts/check-marque.mjs --base origin/main cliquet contre la baseline de cette réf git (CI)
//   node scripts/check-marque.mjs --update-baseline  réécrit la baseline sur l'état actuel
//   node scripts/check-marque.mjs --strict           zéro violation tolérée (fin de bascule)
//   node scripts/check-marque.mjs --report[=chemin]  écrit un récap par règle et par fichier (Markdown)
//   node scripts/check-marque.mjs --list             affiche toutes les violations, pas seulement les ajouts
import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(fileURLToPath(import.meta.url), "../..");
const BASELINE = "scripts/check-marque.baseline.json";
const EXCEPTIONS = "scripts/check-marque.exceptions.json";
const REGLES = ["ancienne-variable", "couleur-hors-palette", "police-hors-marque", "ombre-brune"];
const EXTENSIONS = /\.(tsx?|jsx?|mjs|cjs|css|html|svg|md|mdx)$/;
const IGNORES = [/(^|\/)node_modules\//, /^scripts\/check-marque\./, /^src\/routeTree\.gen\.ts$/];

// ── Arguments ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const opt = (nom) => args.includes(nom);
const valeur = (nom) => {
  const i = args.findIndex((a) => a === nom || a.startsWith(nom + "="));
  if (i < 0) return undefined;
  if (args[i].includes("=")) return args[i].split("=").slice(1).join("=");
  const suivant = args[i + 1];
  return suivant && !suivant.startsWith("--") ? suivant : true;
};
const CI = !!process.env.GITHUB_ACTIONS;

// ── La palette, lue dans le bloc YAML de DESIGN.md ───────────────────────────
function lirePalette() {
  const chemin = join(RACINE, "DESIGN.md");
  if (!existsSync(chemin))
    sortir(2, "DESIGN.md introuvable à la racine : copiez-le depuis internal/marque.");
  const bloc = readFileSync(chemin, "utf8").match(/^---\n([\s\S]*?)\n---/m);
  if (!bloc) sortir(2, "DESIGN.md : bloc de jetons (--- … ---) introuvable.");
  const hex = new Set();
  const rgb = new Set();
  for (const [, h] of bloc[1].matchAll(/#([0-9a-fA-F]{6})\b/g)) {
    hex.add(h.toUpperCase());
    rgb.add(hexVersRgb(h));
  }
  for (const [, r, g, b] of bloc[1].matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g))
    rgb.add(`${r},${g},${b}`);
  if (hex.size < 5)
    sortir(2, `DESIGN.md : palette trop courte (${hex.size} couleurs), le bloc a-t-il changé ?`);
  return { hex, rgb };
}
function hexVersRgb(h) {
  const n = parseInt(h.slice(0, 6), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

// ── Les polices permises : la marque, les polices de mail, les piles système ─
const POLICES_OK = new Set(
  [
    "Source Serif 4",
    "Geist",
    "Georgia",
    "Times New Roman",
    "Times",
    "Helvetica",
    "Helvetica Neue",
    "Arial",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Noto Sans",
    "Liberation Sans",
    "ui-sans-serif",
    "ui-serif",
    "ui-monospace",
    "ui-rounded",
    "SFMono-Regular",
    "SF Mono",
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "Courier",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji",
    "serif",
    "sans-serif",
    "monospace",
    "emoji",
    "math",
    "inherit",
    "initial",
    "unset",
    "revert",
  ].map((p) => p.toLowerCase()),
);
const POLICES_ANCIENNES =
  /Inter Tight|Libre Caslon(?: Text| Display)?|JetBrains Mono|Just Me Again Down Here|STK Bureau|Bureau Serif|Roboto Serif/g;

function famillesInterdites(valeurPile) {
  return valeurPile
    .replace(/!important/g, "")
    .split(",")
    .map((f) =>
      f
        .trim()
        .replace(/^['"`]|['"`]$/g, "")
        .trim(),
    )
    .filter((f) => f && !/^var\(|\$\{|[{}()]/.test(f) && !POLICES_OK.has(f.toLowerCase()));
}

const TAILWIND_DEFAUT = new RegExp(
  "(?<![\\w-])(?:[a-z-]+:)*!?(?:bg|text|border(?:-[trblxy])?|ring|ring-offset|outline|divide|from|via|to|fill|stroke|shadow|decoration|accent|caret|placeholder)-" +
    "(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3})" +
    "(?:\\/\\d+)?(?![\\w-])",
  "g",
);

// ── Détecteurs : une ligne → liste de { regle, extrait } ─────────────────────
function analyserLigne(ligne, palette) {
  const trouve = [];
  // anciennes variables et utilitaires Tailwind dérivés
  for (const m of ligne.matchAll(
    /--[a-z0-9-]*\b(?:terra|sage)\b[a-z0-9-]*|(?<!\w)(?:--)?font-hand\b|(?<![\w-])(?:[a-z]+:)*[a-z]+(?:-[a-z]+)*-(?:terra|sage)(?:-[a-z0-9]+)*(?:\/\d+)?(?![\w-])/g,
  )) {
    trouve.push({ regle: "ancienne-variable", extrait: m[0] });
  }
  // couleurs hex
  for (const m of ligne.matchAll(
    /(?<![&\w/])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g,
  )) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join("");
    if (!palette.hex.has(h.slice(0, 6).toUpperCase()))
      trouve.push({ regle: "couleur-hors-palette", extrait: m[0] });
  }
  // rgb() / rgba(), virgules ou syntaxe moderne
  for (const m of ligne.matchAll(
    /\brgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})\s*(?:[,/]\s*[\d.]+%?\s*)?\)/g,
  )) {
    const t = `${+m[1]},${+m[2]},${+m[3]}`;
    if (t === "28,17,8") trouve.push({ regle: "ombre-brune", extrait: m[0] });
    else if (!palette.rgb.has(t)) trouve.push({ regle: "couleur-hors-palette", extrait: m[0] });
  }
  // notations qu'on ne peut pas rapprocher de la palette
  for (const m of ligne.matchAll(/\b(?:hsla?|hwb|lab|lch|oklab|oklch)\([^)]*\)/g)) {
    trouve.push({ regle: "couleur-hors-palette", extrait: m[0] });
  }
  // couleurs par défaut de Tailwind (bg-white, text-black, bg-rose-500…) : #FFFFFF n'est pas papier
  // (#FFFDFD), et bg-rose-500 est le rose de Tailwind, pas le jeton rose de la marque
  for (const m of ligne.matchAll(TAILWIND_DEFAUT))
    trouve.push({ regle: "couleur-hors-palette", extrait: m[0] });
  // mots-clés CSS white / black dans une propriété de couleur ou un attribut SVG
  for (const m of ligne.matchAll(
    /(?<![\w-])(?:color|background(?:-color)?|fill|stroke|border(?:-color)?)\s*[:=]\s*["']?(?:white|black)\b/gi,
  )) {
    trouve.push({ regle: "couleur-hors-palette", extrait: m[0] });
  }
  // polices : déclarations CSS / JS / canvas / Tailwind / Google Fonts, plus les anciens noms partout
  const polices = new Set();
  const piles = [
    ...[...ligne.matchAll(/font-family\s*:\s*([^;{}]+)/gi)].map((m) =>
      m[1].replace(/["'`]\s*[,}]?\s*$/, ""),
    ),
    ...[...ligne.matchAll(/fontFamily\s*:\s*(["'`])(.*?)\1/g)].map((m) => m[2]),
    ...[
      ...ligne.matchAll(/--font-(?!weight|size|feature|variation)[a-z0-9-]*\s*:\s*([^;{}]+)/gi),
    ].map((m) => m[1]),
    ...[...ligne.matchAll(/\bfont-\[([^\]]+)\]/g)].map((m) => m[1].replace(/_/g, " ")),
    ...[...ligne.matchAll(/\.font\s*=\s*(["'`])(.*?)\1/g)].map((m) =>
      m[2].replace(/^.*?\d+(?:\.\d+)?px(?:\/\S+)?\s+/, ""),
    ),
  ];
  for (const pile of piles) for (const f of famillesInterdites(pile)) polices.add(f);
  for (const m of ligne.matchAll(/fonts\.googleapis\.com\/css2?\?[^"'\s)>]*/g)) {
    for (const [, fam] of m[0].matchAll(/family=([^:&;]+)/g)) {
      const nom = decodeURIComponent(fam.replace(/\+/g, " "));
      if (!POLICES_OK.has(nom.toLowerCase())) polices.add(nom);
    }
  }
  for (const m of ligne.matchAll(POLICES_ANCIENNES)) polices.add(m[0]);
  for (const p of polices) trouve.push({ regle: "police-hors-marque", extrait: p });
  return trouve;
}

// ── Fichiers à scanner ───────────────────────────────────────────────────────
function lister(dossier, recursif = true) {
  const abs = join(RACINE, dossier);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const nom of readdirSync(abs)) {
    const chemin = join(abs, nom);
    const rel = relative(RACINE, chemin).split(sep).join("/");
    if (IGNORES.some((re) => re.test(rel + (statSync(chemin).isDirectory() ? "/" : "")))) continue;
    if (statSync(chemin).isDirectory()) {
      if (recursif) out.push(...lister(rel));
    } else if (EXTENSIONS.test(nom)) out.push(rel);
  }
  return out;
}
function fichiersCibles() {
  // public/ : les pages HTML et les SVG de la racine (favicon.svg, logos Granit) ; pas public/logos/,
  // qui garde les logos des tiers (mutuelles, logiciels) dans leurs propres couleurs.
  const html = lister("public", false).filter((f) => /\.(html|svg)$/.test(f));
  return [...new Set([...lister("src"), ...html, ...lister("scripts")])].sort();
}

// ── Exceptions ───────────────────────────────────────────────────────────────
function lireExceptions() {
  const chemin = join(RACINE, EXCEPTIONS);
  if (!existsSync(chemin)) return [];
  const brut = JSON.parse(readFileSync(chemin, "utf8"));
  return (brut.exceptions || []).map((e, i) => {
    if (!e.fichier || !e.regle || !e.raison)
      sortir(2, `${EXCEPTIONS} : l'exception n°${i + 1} doit avoir fichier, regle et raison.`);
    const glob = new RegExp(
      "^" +
        e.fichier
          .replace(/[.+^${}()|[\]\\]/g, "\\$&")
          .replace(/\*\*/g, "§")
          .replace(/\*/g, "[^/]*")
          .replace(/§/g, ".*") +
        "$",
    );
    const motif = !e.motif
      ? null
      : e.motif.startsWith("/")
        ? new RegExp(
            e.motif.slice(1, e.motif.lastIndexOf("/")),
            e.motif.slice(e.motif.lastIndexOf("/") + 1),
          )
        : e.motif;
    return { ...e, glob, motifTest: motif, utilisee: 0 };
  });
}
function excepte(exceptions, fichier, v, ligne) {
  for (const e of exceptions) {
    if (!e.glob.test(fichier) || (e.regle !== "*" && e.regle !== v.regle)) continue;
    if (
      e.motifTest &&
      !(typeof e.motifTest === "string"
        ? ligne.includes(e.motifTest) || v.extrait.includes(e.motifTest)
        : e.motifTest.test(ligne))
    )
      continue;
    e.utilisee++;
    return true;
  }
  return false;
}

// ── Scan ─────────────────────────────────────────────────────────────────────
function scanner() {
  const palette = lirePalette();
  const exceptions = lireExceptions();
  const violations = [];
  for (const fichier of fichiersCibles()) {
    const lignes = readFileSync(join(RACINE, fichier), "utf8").split("\n");
    lignes.forEach((ligne, i) => {
      if (ligne.includes("check-marque: ignorer")) return;
      for (const v of analyserLigne(ligne, palette)) {
        if (!excepte(exceptions, fichier, v, ligne))
          violations.push({ fichier, ligne: i + 1, ...v });
      }
    });
  }
  return { violations, exceptions };
}
function compter(violations) {
  const parFichier = {};
  for (const v of violations) {
    parFichier[v.fichier] ??= {};
    parFichier[v.fichier][v.regle] = (parFichier[v.fichier][v.regle] || 0) + 1;
  }
  const totaux = Object.fromEntries(
    REGLES.map((r) => [r, violations.filter((v) => v.regle === r).length]),
  );
  return { parFichier, totaux };
}

// ── Baseline ─────────────────────────────────────────────────────────────────
function lireBaseline(ref) {
  if (ref && ref !== true) {
    try {
      return JSON.parse(
        execFileSync("git", ["show", `${ref}:${BASELINE}`], {
          cwd: RACINE,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }),
      );
    } catch {
      console.log(`! Pas de baseline sur ${ref} : on prend celle de la copie de travail.`);
    }
  }
  const chemin = join(RACINE, BASELINE);
  if (!existsSync(chemin))
    sortir(2, `${BASELINE} absent : lancez --update-baseline une première fois.`);
  return JSON.parse(readFileSync(chemin, "utf8"));
}
function ecrireBaseline({ parFichier, totaux }) {
  const trie = Object.fromEntries(
    Object.keys(parFichier)
      .sort()
      .map((f) => [f, Object.fromEntries(Object.entries(parFichier[f]).sort())]),
  );
  const contenu = {
    _lisez_moi:
      "Généré par `node scripts/check-marque.mjs --update-baseline`. Ne pas éditer à la main. Une PR ne doit faire que baisser ces nombres.",
    totaux,
    fichiers: trie,
  };
  writeFileSync(join(RACINE, BASELINE), JSON.stringify(contenu, null, 2) + "\n");
}

// ── Rapport ──────────────────────────────────────────────────────────────────
function rapport({ parFichier, totaux }, baseline, chemin) {
  const t = baseline?.totaux || {};
  const lignes = [
    "# check-marque · récap",
    "",
    `${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`,
    "",
    "| Règle | Actuel | Baseline |",
    "|---|---:|---:|",
  ];
  for (const r of REGLES) lignes.push(`| ${r} | ${totaux[r]} | ${t[r] ?? "–"} |`);
  lignes.push(
    `| **Total** | **${Object.values(totaux).reduce((a, b) => a + b, 0)}** | ${baseline ? Object.values(t).reduce((a, b) => a + b, 0) : "–"} |`,
    "",
    "## Par fichier",
    "",
    `| Fichier | ${REGLES.join(" | ")} | Total |`,
    `|---|${REGLES.map(() => "---:").join("|")}|---:|`,
  );
  const tri = Object.entries(parFichier)
    .map(([f, c]) => [f, c, Object.values(c).reduce((a, b) => a + b, 0)])
    .sort((a, b) => b[2] - a[2]);
  for (const [f, c, n] of tri)
    lignes.push(`| \`${f}\` | ${REGLES.map((r) => c[r] || "").join(" | ")} | ${n} |`);
  writeFileSync(chemin, lignes.join("\n") + "\n");
  if (CI && process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, lignes.join("\n") + "\n");
  console.log(`Récap écrit : ${relative(process.cwd(), chemin) || chemin}`);
}

// Lignes ajoutées depuis une réf git (copie de travail comprise, fichiers non suivis entiers).
function lignesAjoutees(ref) {
  const out = new Map();
  const git = (a) =>
    execFileSync("git", a, {
      cwd: RACINE,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 << 20,
    });
  try {
    let fichier = null;
    for (const l of git([
      "diff",
      "-U0",
      "--no-color",
      "--no-ext-diff",
      ref,
      "--",
      "src",
      "public",
      "scripts",
    ]).split("\n")) {
      if (l.startsWith("+++ ")) fichier = l.startsWith("+++ b/") ? l.slice(6) : null;
      const m = fichier && l.match(/^@@ [^+]*\+(\d+)(?:,(\d+))? @@/);
      if (!m) continue;
      const set = out.get(fichier) ?? new Set();
      for (let i = 0; i < (m[2] === undefined ? 1 : +m[2]); i++) set.add(+m[1] + i);
      out.set(fichier, set);
    }
    for (const f of git(["ls-files", "--others", "--exclude-standard", "src", "public", "scripts"])
      .split("\n")
      .filter(Boolean)) {
      out.set(f, { has: () => true });
    }
  } catch {
    /* pas de git : on montrera toutes les violations */
  }
  return out;
}

function sortir(code, message) {
  console.error(message);
  process.exit(code);
}
const fmt = (v) => `${v.fichier}:${v.ligne}  ${v.regle}  ${v.extrait}`;

// ── Principal ────────────────────────────────────────────────────────────────
const { violations, exceptions } = scanner();
const comptes = compter(violations);
const resume = REGLES.map((r) => `${r} ${comptes.totaux[r]}`).join(" · ");

if (opt("--update-baseline")) {
  ecrireBaseline(comptes);
  console.log(`Baseline réécrite (${BASELINE}) : ${resume}`);
  process.exit(0);
}

const strict = opt("--strict");
const baseline = strict ? null : lireBaseline(valeur("--base"));
if (valeur("--report"))
  rapport(
    comptes,
    baseline,
    resolve(
      valeur("--report") === true ? join(RACINE, "check-marque-rapport.md") : valeur("--report"),
    ),
  );
if (opt("--list")) violations.forEach((v) => console.log(fmt(v)));
for (const e of exceptions)
  if (!e.utilisee)
    console.log(
      `! Exception jamais utilisée (à retirer ?) : ${e.fichier} · ${e.regle} · ${e.motif ?? "*"}`,
    );

let fautes = [];
const refDiff = typeof valeur("--base") === "string" ? valeur("--base") : "HEAD";
const ajoutees = strict ? new Map() : lignesAjoutees(refDiff);
if (strict) {
  fautes = violations;
} else {
  const base = baseline.fichiers || {};
  const baisses = [];
  for (const [fichier, c] of Object.entries(comptes.parFichier)) {
    for (const [regle, n] of Object.entries(c)) {
      const avant = base[fichier]?.[regle] || 0;
      if (n > avant) {
        console.log(`\n✗ ${fichier} · ${regle} : ${n} (baseline ${avant}, +${n - avant})`);
        const vs = violations.filter((v) => v.fichier === fichier && v.regle === regle);
        // On montre d'abord les violations sur des lignes ajoutées (git diff) ; à défaut, toutes.
        const neuves = vs.filter((v) => ajoutees.get(fichier)?.has(v.ligne));
        const montrees = neuves.length ? neuves : vs;
        if (neuves.length) console.log(`    sur des lignes ajoutées depuis ${refDiff} :`);
        montrees.forEach((v) => console.log("    " + fmt(v)));
        if (neuves.length && vs.length > neuves.length)
          console.log(
            `    (+ ${vs.length - neuves.length} déjà présente(s) dans le fichier, voir --list)`,
          );
        fautes.push(...montrees);
      }
    }
  }
  for (const [fichier, c] of Object.entries(base)) {
    for (const [regle, avant] of Object.entries(c)) {
      const n = comptes.parFichier[fichier]?.[regle] || 0;
      if (n < avant) baisses.push(`${fichier} · ${regle} : ${avant} → ${n}`);
    }
  }
  if (baisses.length) {
    console.log(
      `\n✓ ${baisses.length} compte(s) en baisse : lancez \`node scripts/check-marque.mjs --update-baseline\` et commitez la baseline pour verrouiller le gain.`,
    );
    baisses.slice(0, 20).forEach((b) => console.log("    " + b));
  }
}

if (CI) {
  for (const v of fautes.slice(0, 50))
    console.log(
      `::error file=${v.fichier},line=${v.ligne},title=check-marque ${v.regle}::${v.extrait} (voir DESIGN.md)`,
    );
}
console.log(`\ncheck-marque ${strict ? "strict" : "cliquet"} : ${resume}`);
if (fautes.length) {
  sortir(
    1,
    strict
      ? `✗ ${fautes.length} violation(s) : en mode strict, aucune n'est tolérée.`
      : `✗ ${fautes.length} violation(s) dans des fichiers qui dépassent leur baseline. Utilisez les jetons de DESIGN.md (ou, si c'est légitime, ${EXCEPTIONS}).`,
  );
}
console.log("✓ Aucune violation ajoutée.");
