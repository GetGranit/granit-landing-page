/// <reference types="node" />
// Plugin Vite de la rubrique Ressources.
// - `virtual:ressources` : la liste des articles JSON en ligne (sans leur corps) et, pour chacun,
//   un import paresseux de `virtual:ressources/article/{slug}` (corps + fichiers de faits).
// - Version anglaise (content/en/, scripts/ressources/traduction.mjs) : titre et description dans
//   la liste, corps traduit par `virtual:ressources/article-en/{slug}`, anciens articles traduits par
//   `virtual:ressources/ancien-en/{slug}`. Sans traduction valide, rien n'est exposé : repli français.
// L'aperçu (content/apercu) n'est lu qu'en dev ou sur un déploiement Vercel de prévisualisation :
// il n'entre jamais dans un build de production.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { controler, lireContenu, redirections } from "./en-ligne.mjs";
import { lireTraductions } from "./traduction.mjs";
import { articles as anciensArticles } from "../../src/lib/articles";
import verticalesData from "../../src/lib/ressources/verticales.json";
import { statutsCarte } from "../../src/lib/ressources/logos";
import { normaliserVerticales } from "../../src/lib/ressources/verticales";
import type { Fiche, RessourceJson, VerticaleSlug } from "../../src/lib/ressources/types";

const INDEX = "virtual:ressources";
const ARTICLE = "virtual:ressources/article/";
const ARTICLE_EN = "virtual:ressources/article-en/";
const ANCIEN_EN = "virtual:ressources/ancien-en/";

const surcharges = verticalesData.surcharges as Record<string, VerticaleSlug[]>;
/**
 * Métiers d'un article JSON : surcharge éditoriale, sinon le champ du fichier (anciens slugs
 * ramenés au métier qui les reprend : audio → optique…), sinon l'optique.
 */
const verticalesDe = (a: RessourceJson): VerticaleSlug[] =>
  surcharges[a.slug] ?? (a.verticales?.length ? normaliserVerticales(a.verticales) : ["optique"]);

/** Image d'aperçu d'une fiche, produite par scripts/ressources/og-plateformes.mjs. */
const og = (slug: string) => `/ressources/og/${slug}.jpg`;

const estPilier = (level: string) => /^Pilier/.test(level ?? "");

function fiche(
  a: RessourceJson,
  plateformes: ReturnType<typeof lireContenu>["plateformes"],
  concurrents: ReturnType<typeof lireContenu>["concurrents"],
  en?: RessourceJson,
): Fiche {
  const fp = a.plateforme ? plateformes[a.plateforme] : undefined;
  const adversaire = a.type === "vs" ? concurrents[a.concurrents?.[0] ?? ""] : undefined;
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
    og: existsSync(join(process.cwd(), "public", og(a.slug))) ? og(a.slug) : undefined,
    plateforme:
      a.type === "plateforme" && fp
        ? {
            nom: fp.nom,
            logo: fp.logo,
            checkedOn: a.checkedOn ?? fp.checkedOn,
            statuts: statutsCarte(fp.statuts),
          }
        : undefined,
    vs: adversaire?.logo ? { nom: adversaire.nom, logo: adversaire.logo } : undefined,
    en: en ? { title: en.title, metaDescription: en.metaDescription } : undefined,
  };
}

/** Les fichiers de faits publics d'une page comparative (sans le champ « exclus », jamais affiché). */
function publics(
  slugs: string[] | undefined,
  concurrents: ReturnType<typeof lireContenu>["concurrents"],
) {
  return Object.fromEntries(
    (slugs ?? [])
      .filter((s) => concurrents[s])
      .map((s) => {
        const { exclus: _exclus, ...reste } = concurrents[s];
        return [s, reste];
      }),
  );
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
      if (id === INDEX || id.startsWith(INDEX + "/")) return "\0" + id;
    },
    load(id) {
      if (!id.startsWith("\0" + INDEX)) return;
      const contenu = lire();
      const en = lireTraductions(racine, contenu, anciensArticles.fr);
      [...contenu.lus, ...en.lus].filter((p) => existsSync(p)).forEach((p) => this.addWatchFile(p));
      const module = (cle: string, valeur: unknown) =>
        `${JSON.stringify(cle)}: () => import(${JSON.stringify(valeur)})`;
      if (id === "\0" + INDEX) {
        controler(racine, contenu.articles);
        en.avertissements.forEach((m) => this.warn(`Ressources (anglais) : ${m}`));
        const fiches = contenu.articles.map((a) =>
          fiche(a, contenu.plateformes, contenu.concurrents, en.articles[a.slug]),
        );
        const charger = contenu.articles.map((a) => module(a.slug, ARTICLE + a.slug));
        const chargerEn = Object.keys(en.articles).map((s) => module(s, ARTICLE_EN + s));
        const chargerAncienEn = Object.keys(en.anciens).map((s) => module(s, ANCIEN_EN + s));
        // Liste des anciens articles traduits : de quoi faire les cartes, sans le corps.
        const anciensEn = Object.fromEntries(
          Object.values(en.anciens).map(({ body: _body, ...a }) => [a.slug, a]),
        );
        return (
          `export const fiches = ${JSON.stringify(fiches)};\n` +
          `export const redirections = ${JSON.stringify(redirections(contenu.articles))};\n` +
          `export const charger = {\n${charger.join(",\n")}\n};\n` +
          `export const chargerEn = {\n${chargerEn.join(",\n")}\n};\n` +
          `export const anciensEn = ${JSON.stringify(anciensEn)};\n` +
          `export const chargerAncienEn = {\n${chargerAncienEn.join(",\n")}\n};\n`
        );
      }
      if (id.startsWith("\0" + ANCIEN_EN)) {
        const slug = id.slice(("\0" + ANCIEN_EN).length);
        return `export default ${JSON.stringify(en.anciens[slug] ?? null)};\n`;
      }
      const anglais = id.startsWith("\0" + ARTICLE_EN);
      const slug = id.slice(("\0" + (anglais ? ARTICLE_EN : ARTICLE)).length);
      const fr = contenu.articles.find((a) => a.slug === slug);
      if (!anglais) {
        const plateforme = fr?.plateforme ? (contenu.plateformes[fr.plateforme] ?? null) : null;
        const concurrents = publics(fr?.concurrents, contenu.concurrents);
        return `export default ${JSON.stringify({ article: fr, plateforme, concurrents })};\n`;
      }
      // Version anglaise : chaque fichier de faits sans traduction valide reste en français.
      const article = en.articles[slug] ?? null;
      const nom = fr?.plateforme;
      const plateforme = nom ? (en.plateformes[nom] ?? contenu.plateformes[nom] ?? null) : null;
      const concurrents = publics(fr?.concurrents, { ...contenu.concurrents, ...en.concurrents });
      return `export default ${JSON.stringify({ article, plateforme, concurrents })};\n`;
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
