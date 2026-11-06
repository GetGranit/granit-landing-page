// Écrit le bloc `couverture` des articles déjà en ligne, avec la consigne et les contrôles de la rédaction.
// À relancer sans danger : un article qui a un bloc conforme est ignoré, sauf --tous.
//   node --experimental-strip-types scripts/seo-engine/couvrir-articles.mjs [--slug s] [--tous] [--dry]
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { articles } from "../../src/lib/articles.ts";
import { motsInterditsTon } from "./lib/checks.mjs";
import { apiKey, coutDollars, rediger } from "./lib/claude.mjs";
import { consigneCouverture, controlerCouverture, retenirCouverture, texteArticle } from "./lib/couverture.mjs";
import { CONTENU, MOTEUR, RACINE, ecrireJson, lireJson, logosPlateformes } from "./lib/site.mjs";

const { values: opt } = parseArgs({
  options: { slug: { type: "string" }, tous: { type: "boolean" }, dry: { type: "boolean" } },
});
const config = lireJson(join(MOTEUR, "config.json"));
const schema = lireJson(join(MOTEUR, "article-output.schema.json")).properties.couverture;
const plateformes = logosPlateformes();
const ANCIENS = join(RACINE, "content/couvertures-anciens.json");
const blocsAnciens = existsSync(ANCIENS) ? lireJson(ANCIENS) : {};
/** La couverture de l'introduction aux portails montre tous les portails. */
const EXCLUS = new Set(["portails-tiers-payant"]);

const json = readdirSync(CONTENU)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ chemin: join(CONTENU, f), article: lireJson(join(CONTENU, f)) }))
  .filter(({ article: a }) => a.type !== "plateforme" && a.type !== "vs" && !EXCLUS.has(a.slug))
  .map(({ chemin, article: a }) => ({
    slug: a.slug,
    category: a.category,
    titre: a.title,
    texte: texteArticle(a),
    bloc: a.couverture,
    ecrire: (c) => ecrireJson(chemin, { ...lireJson(chemin), couverture: c }),
  }));
const remplaces = new Set(json.map((a) => a.slug));
for (const { article: a } of readdirSync(CONTENU)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ article: lireJson(join(CONTENU, f)) })))
  (a.remplace ?? []).forEach((s) => remplaces.add(s));
const anciens = articles.fr
  .filter((a) => !remplaces.has(a.slug))
  .map((a) => ({
    slug: a.slug,
    category: "ancien",
    titre: a.title,
    texte: [a.title, a.desc, ...a.body].join(" "),
    bloc: blocsAnciens[a.slug],
    ecrire: (c) => {
      blocsAnciens[a.slug] = c;
      ecrireJson(ANCIENS, blocsAnciens);
    },
  }));

const conforme = (a) =>
  a.bloc && !controlerCouverture(a.bloc, { texte: a.texte, plateformes, interdits: motsInterditsTon }).length;
const cibles = [...json, ...anciens].filter(
  (a) => (opt.slug ? a.slug === opt.slug : true) && (opt.tous || opt.slug || !conforme(a)),
);
const system =
  "Tu prépares la couverture dessinée d'un article de Granit, le back-office des professionnels de santé. " +
  "Tu réponds uniquement avec le bloc demandé.";
const key = apiKey();
let cout = 0;
const generiques = [];
const dernieres = {};
for (const a of cibles) {
  const recentes = dernieres[a.category] ?? [];
  let retour = [];
  let bloc = null;
  for (let essai = 1; essai <= 3 && !bloc; essai++) {
    const message =
      `${consigneCouverture({ plateformes, recentes })}\n\n## Article\nTitre : ${a.titre}\n\n${a.texte.slice(0, 14000)}` +
      (retour.length ? `\n\n## Essai précédent refusé\n${retour.join("\n")}` : "");
    const r = await rediger({ apiKey: key, model: config.model, maxTokens: 3000, system, message, schema });
    cout += coutDollars(r.usage, config.model);
    const contexte = { texte: a.texte, plateformes, interdits: motsInterditsTon };
    retour = r.json ? controlerCouverture(r.json, contexte) : ["réponse illisible"];
    if (!retour.length) bloc = retenirCouverture(r.json, contexte);
  }
  if (!bloc) {
    generiques.push(`${a.slug} : ${retour.join(" ; ")}`);
    console.log(`✗ ${a.slug} : scène générique`);
    continue;
  }
  dernieres[a.category] = [bloc.scene, ...recentes].slice(0, 3);
  if (!opt.dry) a.ecrire(bloc);
  console.log(`✓ ${a.slug} : ${bloc.scene} · ${bloc.titre}${bloc.marque ? ` · logo ${bloc.marque}` : ""}`);
}
console.log(`\n${cibles.length - generiques.length}/${cibles.length} couvertures · ${cout.toFixed(2)} $`);
generiques.forEach((g) => console.log(`  ${g}`));
