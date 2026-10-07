/// <reference types="node" />
// Plugin Vite de la rubrique Ressources.
// - `virtual:ressources` : la liste des articles JSON en ligne (sans leur corps) et, pour chacun,
//   un import paresseux de `virtual:ressources/article/{slug}` (corps + fichier de faits).
// L'aperçu (content/apercu) n'est lu qu'en dev ou sur un déploiement Vercel de prévisualisation :
// il n'entre jamais dans un build de production.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { controler, lireContenu } from "./en-ligne.mjs";
import verticalesData from "../../src/lib/ressources/verticales.json";
import type { Fiche, RessourceJson, VerticaleSlug } from "../../src/lib/ressources/types";

const INDEX = "virtual:ressources";
const ARTICLE = "virtual:ressources/article/";

const surcharges = verticalesData.surcharges as Record<string, VerticaleSlug[]>;
/** Métiers d'un article JSON : surcharge éditoriale, sinon le champ du fichier, sinon l'optique. */
const verticalesDe = (a: RessourceJson): VerticaleSlug[] =>
  surcharges[a.slug] ?? (a.verticales?.length ? a.verticales : ["optique"]);

const estPilier = (level: string) => /^Pilier/.test(level ?? "");

function fiche(
  a: RessourceJson,
  plateformes: ReturnType<typeof lireContenu>["plateformes"],
): Fiche {
  const fp = a.plateforme ? plateformes[a.plateforme] : undefined;
  return {
    slug: a.slug,
    category: a.category,
    title: a.title,
    readTime: a.readTime,
    author: a.author?.name || undefined,
    date: a.type === "plateforme" && a.checkedOn ? a.checkedOn : a.dateModified,
    metaDescription: a.metaDescription,
    pillar: estPilier(a.level),
    wave: a.wave ?? 99,
    ancien: false,
    preview: Boolean(a.preview),
    verticales: verticalesDe(a),
    transversal: false,
    plateforme:
      a.type === "plateforme" && fp
        ? { nom: fp.nom, logo: fp.logo, checkedOn: a.checkedOn ?? fp.checkedOn }
        : undefined,
  };
}

export function ressources(): Plugin {
  const racine = process.cwd();
  let avecApercu = false;
  const lire = () => lireContenu(racine, { avecApercu });

  return {
    name: "granit:ressources",
    config(_, { command }) {
      avecApercu = command !== "build" || process.env.VERCEL_ENV === "preview";
    },
    resolveId(id) {
      if (id === INDEX || id.startsWith(ARTICLE)) return "\0" + id;
    },
    load(id) {
      if (!id.startsWith("\0" + INDEX)) return;
      const contenu = lire();
      contenu.lus.filter((p) => existsSync(p)).forEach((p) => this.addWatchFile(p));
      if (id === "\0" + INDEX) {
        controler(racine, contenu.articles);
        const fiches = contenu.articles.map((a) => fiche(a, contenu.plateformes));
        const charger = contenu.articles
          .map(
            (a) => `${JSON.stringify(a.slug)}: () => import(${JSON.stringify(ARTICLE + a.slug)})`,
          )
          .join(",\n");
        return `export const fiches = ${JSON.stringify(fiches)};\nexport const charger = {\n${charger}\n};\n`;
      }
      const slug = id.slice(("\0" + ARTICLE).length);
      const article = contenu.articles.find((a) => a.slug === slug);
      const plateforme = article?.plateforme
        ? (contenu.plateformes[article.plateforme] ?? null)
        : null;
      return `export default ${JSON.stringify({ article, plateforme })};\n`;
    },
    configureServer(server: ViteDevServer) {
      // Un fichier de contenu qui change : on recharge les modules virtuels et la page.
      server.watcher.add([join(racine, "content"), join(racine, "scripts/seo-engine")]);
      const recharger = (fichier: string) => {
        if (!/[/\\](content|seo-engine)[/\\].*\.json$/.test(fichier)) return;
        for (const env of Object.values(server.environments)) {
          for (const [id, mod] of env.moduleGraph.idToModuleMap) {
            if (id.startsWith("\0" + INDEX)) env.moduleGraph.invalidateModule(mod);
          }
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("change", recharger);
      server.watcher.on("add", recharger);
      server.watcher.on("unlink", recharger);
    },
  };
}
