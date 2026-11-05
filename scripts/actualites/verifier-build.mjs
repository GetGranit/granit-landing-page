#!/usr/bin/env node
// Filet de la mise en ligne, lancé en CI après `npm run build` : il regarde ce qui est réellement
// sorti du build, pas le code. Une édition en brouillon ne doit laisser aucune trace dans .output
// ou dist, et tant que rien n'est publié, /actualites reste hors du sitemap et de llms.txt.
// Ne pas lancer sur un build de prévisualisation Vercel : les brouillons y sont attendus.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { lireEditions } from "./en-ligne.mjs";

const SORTIES = [".output", "dist"];
const EXTENSIONS = /\.(m?js|cjs|html|json|css|txt|xml)$/;

function fichiersTexte(dossier) {
  return readdirSync(dossier, { withFileTypes: true }).flatMap((f) => {
    const p = join(dossier, f.name);
    if (f.isDirectory()) return f.name === "node_modules" ? [] : fichiersTexte(p);
    return EXTENSIONS.test(f.name) ? [p] : [];
  });
}

/** Le texte tel quel, et sa forme échappée en \uXXXX si le bundler a sorti de l'ASCII. */
function formes(texte) {
  const echappe = texte.replace(
    /[^\x20-\x7e]/g,
    (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
  return [texte, echappe, echappe.toUpperCase()];
}

/** Ce qui trahit une édition : son slug, son titre, son chapô. */
function traces(edition) {
  return [edition.slug, ...formes(edition.titre), ...formes(edition.chapo)];
}

/** Renvoie la liste des erreurs : vide si le build est propre. */
export function verifierBuild(racine) {
  const sorties = SORTIES.map((s) => join(racine, s)).filter((p) => existsSync(p));
  if (!sorties.length) return [`aucun build à contrôler (${SORTIES.join(", ")} absents)`];

  const editions = lireEditions(racine);
  const brouillons = editions.filter((e) => e.statut === "brouillon");
  const rienDePublie = editions.every((e) => e.statut !== "publie");
  const erreurs = [];

  for (const fichier of sorties.flatMap(fichiersTexte)) {
    const texte = readFileSync(fichier, "utf8");
    for (const e of brouillons)
      if (traces(e).some((t) => texte.includes(t)))
        erreurs.push(`brouillon ${e.slug} présent dans ${fichier}`);
  }

  for (const nom of ["sitemap.xml", "llms.txt"]) {
    const p = join(racine, "public", nom);
    if (!existsSync(p)) {
      erreurs.push(`public/${nom} absent`);
      continue;
    }
    const texte = readFileSync(p, "utf8");
    if (rienDePublie && texte.includes("/actualites"))
      erreurs.push(`/actualites dans public/${nom} alors que rien n'est publié`);
    for (const e of brouillons)
      if (texte.includes(e.slug)) erreurs.push(`brouillon ${e.slug} dans public/${nom}`);
  }
  return erreurs;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const erreurs = verifierBuild(process.cwd());
  if (erreurs.length) {
    console.error(`Actualités, build refusé :\n- ${erreurs.join("\n- ")}`);
    process.exit(1);
  }
  console.log("Actualités : aucun brouillon dans le build.");
}
