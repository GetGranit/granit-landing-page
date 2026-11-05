/// <reference types="node" />
// Plugin Vite de la rubrique d'actualités, calqué sur scripts/ressources/vite-plugin.ts.
// - `virtual:actualites` : les fiches (sans le corps) et, pour chacune, un import paresseux.
// - `virtual:actualites/edition/{slug}` : une édition complète, sans ses notes de travail.
// - `virtual:actualites/presence` : `rubriqueOuverte`, seul module lu par le menu et le pied de page,
//   pour ne pas embarquer la liste dans toutes les pages.
// Les brouillons ne sont lus qu'en dev ou sur un déploiement Vercel de prévisualisation : dans un
// build de production, ils sont exclus ici, donc absents du bundle.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { apercuAutorise } from "../ressources/en-ligne.mjs";
import { lireContenu, pourAffichage } from "./en-ligne.mjs";
import { tempsLecture } from "../../src/lib/actualites/rangement";
import type { Edition, FicheEdition } from "../../src/lib/actualites/types";

const INDEX = "virtual:actualites";
const EDITION = "virtual:actualites/edition/";
const PRESENCE = "virtual:actualites/presence";

function fiche(e: Edition): FicheEdition {
  return {
    slug: e.slug,
    numero: e.numero,
    format: e.format,
    fait: e.fait,
    titre: e.titre,
    chapo: e.chapo,
    metiers: e.metiers,
    datePublished: e.datePublished,
    dateModified: e.dateModified,
    lecture: tempsLecture(e),
    statut: e.statut,
    chiffres: e.chiffres,
  };
}

export function actualites(): Plugin {
  const racine = process.cwd();
  let avecBrouillons = false;

  return {
    name: "granit:actualites",
    config(_, { command }) {
      avecBrouillons = apercuAutorise(command);
    },
    resolveId(id) {
      if (id === INDEX || id.startsWith(INDEX + "/")) return "\0" + id;
    },
    load(id) {
      if (!id.startsWith("\0" + INDEX)) return;
      const { editions, lus } = lireContenu(racine, { avecBrouillons });
      lus.filter((p) => existsSync(p)).forEach((p) => this.addWatchFile(p));
      if (id === "\0" + PRESENCE)
        return `export const rubriqueOuverte = ${editions.length > 0};\n`;
      if (id === "\0" + INDEX) {
        const affichees = editions.map(pourAffichage);
        const charger = affichees.map(
          (e) =>
            `${JSON.stringify(e.slug)}: () => import(${JSON.stringify(EDITION + e.slug)})`,
        );
        return (
          `export const fiches = ${JSON.stringify(affichees.map(fiche))};\n` +
          `export const charger = {\n${charger.join(",\n")}\n};\n`
        );
      }
      const slug = id.slice(("\0" + EDITION).length);
      const edition = editions.find((e) => e.slug === slug);
      return `export default ${JSON.stringify(edition ? pourAffichage(edition) : null)};\n`;
    },
    configureServer(server: ViteDevServer) {
      // Une édition qui change : on recharge les modules virtuels et la page.
      server.watcher.add(join(racine, "content/actualites"));
      const recharger = (fichier: string) => {
        if (!/[/\\]content[/\\]actualites[/\\].*\.json$/.test(fichier)) return;
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
