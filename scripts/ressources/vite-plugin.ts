/// <reference types="node" />
// Plugin Vite de la rubrique Ressources.
// - `virtual:ressources` : la liste des articles JSON en ligne (sans leur corps) et, pour chacun,
//   un import paresseux de `virtual:ressources/article/{slug}` (corps + fichier de faits).
// - Couvertures /covers/{slug}.svg : servies à la volée en dev, écrites dans public/covers au build.
// L'aperçu (content/apercu) n'est lu qu'en dev ou sur un déploiement Vercel de prévisualisation :
// il n'entre jamais dans un build de production.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { controler, lireContenu } from "./en-ligne.mjs";
import { articles as anciens } from "../../src/lib/articles";
import anciensMeta from "../../src/lib/ressources/anciens.json";
import { coverSvg } from "../../src/lib/cover";
import type { CategorySlug, Fiche, RessourceJson } from "../../src/lib/ressources/types";

const INDEX = "virtual:ressources";
const ARTICLE = "virtual:ressources/article/";

const estPilier = (level: string) => /^Pilier/.test(level ?? "");

function fiche(a: RessourceJson, plateformes: ReturnType<typeof lireContenu>["plateformes"]): Fiche {
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
    plateforme:
      a.type === "plateforme" && fp
        ? { nom: fp.nom, logo: fp.logo, checkedOn: a.checkedOn ?? fp.checkedOn }
        : undefined,
  };
}

/** Couvertures à produire : articles JSON affichés + anciens articles rattachés au cocon. */
function couvertures(contenu: ReturnType<typeof lireContenu>) {
  const out = new Map<string, string>();
  for (const a of contenu.articles) {
    out.set(
      a.slug,
      coverSvg({
        slug: a.slug,
        category: a.category,
        title: a.title,
        platform: a.type === "plateforme",
      }),
    );
  }
  const rattaches = anciensMeta.rattaches as Record<string, CategorySlug>;
  for (const a of anciens.fr) {
    const category = rattaches[a.slug];
    if (category && !out.has(a.slug)) {
      out.set(a.slug, coverSvg({ slug: a.slug, category, title: a.title }));
    }
  }
  return out;
}

export function ressources(): Plugin {
  const racine = process.cwd();
  let avecApercu = false;
  let build = false;
  let ecrit = false;
  const lire = () => lireContenu(racine, { avecApercu });

  return {
    name: "granit:ressources",
    config(_, { command }) {
      build = command === "build";
      avecApercu = !build || process.env.VERCEL_ENV === "preview";
    },
    resolveId(id) {
      if (id === INDEX || id.startsWith(ARTICLE)) return "\0" + id;
    },
    load(id) {
      if (!id.startsWith("\0" + INDEX)) return;
      const contenu = lire();
      contenu.lus.forEach((p) => this.addWatchFile(p));
      if (id === "\0" + INDEX) {
        controler(racine, contenu.articles);
        const fiches = contenu.articles.map((a) => fiche(a, contenu.plateformes));
        const charger = contenu.articles
          .map((a) => `${JSON.stringify(a.slug)}: () => import(${JSON.stringify(ARTICLE + a.slug)})`)
          .join(",\n");
        return `export const fiches = ${JSON.stringify(fiches)};\nexport const charger = {\n${charger}\n};\n`;
      }
      const slug = id.slice(("\0" + ARTICLE).length);
      const article = contenu.articles.find((a) => a.slug === slug);
      const plateforme = article?.plateforme ? (contenu.plateformes[article.plateforme] ?? null) : null;
      return `export default ${JSON.stringify({ article, plateforme })};\n`;
    },
    buildStart() {
      // Une seule fois par build (le build passe par plusieurs environnements).
      if (!build || ecrit) return;
      ecrit = true;
      const dossier = join(racine, "public/covers");
      rmSync(dossier, { recursive: true, force: true });
      mkdirSync(dossier, { recursive: true });
      for (const [slug, svg] of couvertures(lire())) writeFileSync(join(dossier, `${slug}.svg`), svg);
      console.log(`[ressources] ${readdirSync(dossier).length} couvertures écrites dans public/covers`);
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const m = req.url?.match(/^\/covers\/([a-z0-9-]+)\.svg$/);
        const svg = m && couvertures(lire()).get(m[1]);
        if (!svg) return next();
        res.setHeader("Content-Type", "image/svg+xml");
        res.end(svg);
      });
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
