// `node --experimental-strip-types --test tests/outils/socle.test.ts`
// Socle des outils référentiels : fonctions communes, découverte, garde-fous, puis les tests communs
// (tests/outils/socle.ts) de chaque outil du dépôt et de l'outil factice (fixture).
import { after, test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { decouvrirOutils, dossiersOutils, pagesSitemap } from "../../scripts/outils/decouvrir.mjs";
import { IDS_METIERS, METIERS_OUTILS, versMetiers } from "../../src/lib/outils/socle/metiers.mjs";
import {
  SEUIL_DEFAUT,
  compterMots,
  compterMotsPropres,
  decouperPhrases,
  motsPropres,
  phrasesGabarit,
} from "../../src/lib/outils/socle/mots.mjs";
import {
  distanceEdition,
  filtrerLignes,
  hrefHub,
  nettoyerRequete,
  preparerRecherche,
  suggestions,
} from "../../src/lib/outils/socle/recherche.ts";
import {
  cleCode,
  fauteTypo,
  formaterDate,
  normaliser,
  slugifier,
} from "../../src/lib/outils/socle/texte.mjs";
import { calcomDemoUrl } from "../../src/lib/calcom.ts";
import { cibleMetier, lienDemoOutil } from "../../src/lib/outils/socle/pont.ts";
import type { LigneHub } from "../../src/lib/outils/socle/types.ts";
import { RACINE, chargerOutils, siteNode, testsCommunsOutil } from "./socle.ts";

const FIXTURE = fileURLToPath(new URL("./fixture", import.meta.url));

// ── Fonctions communes ───────────────────────────────────────────────────────

test("compterMots : élisions, traits d'union, espaces insécables, chiffres", () => {
  assert.equal(compterMots("d’exonération"), 1);
  assert.equal(compterMots("l'exonération du ticket modérateur"), 4);
  assert.equal(compterMots("Code\u00a0rejet\u202f0450054"), 3);
  assert.equal(compterMots("sous-domaine — 100 %"), 2);
  assert.equal(compterMots(""), 0);
});

test("decouperPhrases : après . ! ? …, phrases vides retirées", () => {
  assert.deepEqual(decouperPhrases("Un. Deux\u00a0! Trois\u00a0? Quatre… Cinq"), [
    "Un.",
    "Deux\u00a0!",
    "Trois\u00a0?",
    "Quatre…",
    "Cinq",
  ]);
  assert.deepEqual(decouperPhrases("  "), []);
});

test("phrasesGabarit et motsPropres : une phrase répétée dans 3 textes ne compte pas, chaque phrase une fois", () => {
  const gab = "Si le nouvel essai échoue, contactez la caisse.";
  const textes = [
    `Premier texte propre. ${gab}`,
    `Deuxième texte. ${gab}`,
    `Troisième. ${gab}`,
    `Quatrième. Autre.`,
  ];
  const gabarit = phrasesGabarit(textes);
  assert.equal(gabarit.size, 1);
  assert.equal(motsPropres(textes[0], gabarit), 3);
  assert.equal(motsPropres(textes[0]), 3 + compterMots(gab));
  assert.equal(
    motsPropres("Une phrase. Une phrase. une PHRASE."),
    2,
    "dédupliquée (forme normalisée)",
  );
  assert.equal(phrasesGabarit(textes.slice(0, 2)).size, 0, "2 textes ne font pas un gabarit");
  assert.deepEqual(compterMotsPropres(textes), [3, 2, 1, 2]);
  assert.equal(SEUIL_DEFAUT, 100);
});

test("normaliser, cleCode, slugifier", () => {
  assert.equal(normaliser("Exonération"), "exoneration");
  assert.equal(normaliser("  ETM  NON trouvée, en BDO ! "), "etm non trouvee en bdo");
  assert.equal(cleCode("0450 054"), "0450054");
  assert.equal(cleCode("0450-054"), "0450054");
  assert.equal(cleCode("0450.054"), cleCode("0450054"));
  assert.equal(slugifier("La Mutuelle Générale"), "la-mutuelle-generale");
  assert.equal(slugifier("  Crédit Agricole (Pacifica) "), "credit-agricole-pacifica");
});

test("formaterDate : ISO en JJ/MM/AAAA, le reste tel quel", () => {
  assert.equal(formaterDate("2019-11-22"), "22/11/2019");
  assert.equal(formaterDate("2026-11-18T10:00:00Z"), "18/11/2026");
  assert.equal(formaterDate("non datée"), "non datée");
  assert.equal(formaterDate("état au 2026-11-18"), "état au 2026-11-18");
});

test("fauteTypo : espace simple avant : ; ? !, guillemets droits, tiret long, tiers-payant, certifié HDS", () => {
  assert.equal(fauteTypo("Code rejet 0450054\u00a0: que corriger\u00a0?"), null);
  assert.equal(fauteTypo("Le «\u00a0libellé\u00a0» fait foi"), null);
  assert.match(fauteTypo("Code rejet : que corriger") ?? "", /espace simple avant « : »/);
  assert.match(fauteTypo("Quel portail ?") ?? "", /« \? »/);
  assert.match(fauteTypo("Le « libellé\u00a0»") ?? "", /dans « »/);
  assert.match(fauteTypo('Le "libellé"') ?? "", /guillemets droits/);
  assert.match(fauteTypo("Un rejet — et après") ?? "", /tiret long/);
  assert.match(fauteTypo("Le tiers-payant") ?? "", /tiers payant/);
  assert.match(fauteTypo("Granit est certifié HDS") ?? "", /HDS/);
  assert.equal(fauteTypo("une infrastructure certifiée HDS"), null);
});

test("nettoyerRequete : espaces, 40 caractères, e-mail retiré, NIR remplacé, numéro AMC gardé", () => {
  assert.equal(nettoyerRequete("  0450   054 "), "0450 054");
  assert.equal(nettoyerRequete("jean.dupont@exemple.fr"), "[retiree]");
  assert.equal(nettoyerRequete("1850575123456 78"), "#");
  assert.equal(nettoyerRequete("nir 1 85 05 75 123 456 78 rejet"), "nir # rejet");
  assert.equal(nettoyerRequete("0045900442"), "0045900442");
  assert.equal(nettoyerRequete("a".repeat(60)).length, 40);
});

const ligne = (
  id: string,
  code: string,
  titre: string,
  metiers: string[],
  autres: string[] = [],
): LigneHub => ({
  id,
  code,
  titre,
  groupe: "g",
  facettes: { metier: metiers },
  ...preparerRecherche([code, ...autres], [titre]),
});
const LIGNES = [
  ligne("noemie-0450054", "0450054", "ETM NON TROUVEE EN BDO", ["optique", "dentaire"], ["450054"]),
  ligne("noemie-0450056", "0450056", "Exonération du ticket modérateur", ["optique"]),
  ligne("noemie-0250050", "0250050", "Bénéficiaire inconnu", ["dentaire"]),
];

test("filtrerLignes : code exact, préfixe, mots, facettes, variantes", () => {
  const ids = (q: string, f = {}, opts = {}) =>
    filtrerLignes(LIGNES, q, f, opts).visibles.map((l) => l.id);
  assert.equal(ids("").length, 3);
  assert.deepEqual(ids("0450 054"), ["noemie-0450054"]);
  assert.equal(filtrerLignes(LIGNES, "0450-054", {}).exact, true);
  assert.deepEqual(ids("0450"), ["noemie-0450054", "noemie-0450056"]);
  assert.equal(filtrerLignes(LIGNES, "0450", {}).exact, false);
  assert.deepEqual(ids("exoneration ticket"), ["noemie-0450056"]);
  assert.deepEqual(ids("Bénéficiaire"), ["noemie-0250050"]);
  assert.deepEqual(ids("", { metier: "dentaire" }), ["noemie-0450054", "noemie-0250050"]);
  assert.deepEqual(ids("0450", { metier: "dentaire" }), ["noemie-0450054"]);
  assert.deepEqual(ids("", { metier: null }).length, 3);
  assert.deepEqual(ids("50056"), [], "sans variante, pas de correspondance au milieu d'un code");
  assert.deepEqual(ids("450056", {}, { variantes: (q: string) => [`0${q}`] }), ["noemie-0450056"]);
  assert.deepEqual(ids("rien du tout"), []);
});

test("suggestions : même préfixe de code d'abord, puis distance d'édition ≤ 2", () => {
  assert.deepEqual(
    suggestions(LIGNES, "0450099").map((l) => l.id),
    ["noemie-0450054", "noemie-0450056"],
  );
  assert.equal(
    suggestions(LIGNES, "0250051")[0]?.id,
    "noemie-0250050",
    "le plus long préfixe d'abord",
  );
  assert.equal(suggestions(LIGNES, "0250051", { max: 1 }).length, 1);
  assert.deepEqual(suggestions(LIGNES, "9999999"), []);
  assert.equal(distanceEdition("0450054", "0450045"), 2);
  assert.ok(distanceEdition("abc", "xyzuvw", 2) > 2);
});

test("hrefHub : lien de repli sans JavaScript, sans paramètre vide", () => {
  assert.equal(hrefHub("/outils/codes-rejet", "", {}), "/outils/codes-rejet");
  assert.equal(
    hrefHub("/outils/codes-rejet", " 0450 ", { metier: "dentaire", x: null }),
    "/outils/codes-rejet?q=0450&metier=dentaire",
  );
});

test("métiers : les 5 du site, dans l'ordre et avec les noms de verticales.json", () => {
  const v = JSON.parse(readFileSync(join(RACINE, "src/lib/ressources/verticales.json"), "utf8"));
  assert.deepEqual([...IDS_METIERS], v.ordre);
  for (const m of METIERS_OUTILS) assert.equal(m.nom, v.verticales[m.id].nom, m.id);
  assert.deepEqual(
    versMetiers(["optique-audio", "dentaire", "optique-audio"], { "optique-audio": "optique" }),
    ["optique", "dentaire"],
  );
  assert.deepEqual(
    versMetiers(["laboratoire", "hospitalisation", "ehpad"], {
      laboratoire: "cliniques",
      hospitalisation: "cliniques",
      ehpad: null,
    }),
    ["cliniques"],
  );
  assert.throws(() => versMetiers(["veterinaire"]), /Métier inconnu : « veterinaire »/);
});

test("pont : calcomDemoUrl inchangée sans 3e paramètre ; lien de démo d'outil ; cible métier", () => {
  assert.equal(
    calcomDemoUrl("fin-article", "codes-rejets-noemie"),
    "https://cal.com/paul-pietra-granit/decouvrir-granit/?utm_source=getgranit.ai&utm_medium=site&utm_campaign=blog&utm_content=fin-article&utm_term=codes-rejets-noemie",
  );
  assert.equal(
    calcomDemoUrl("bande-demo"),
    "https://cal.com/paul-pietra-granit/decouvrir-granit/?utm_source=getgranit.ai&utm_medium=site&utm_campaign=blog&utm_content=bande-demo",
  );
  assert.equal(
    lienDemoOutil("codes-rejet", "entree", "noemie-0450054"),
    "https://cal.com/paul-pietra-granit/decouvrir-granit/?utm_source=getgranit.ai&utm_medium=lead-magnet&utm_campaign=outil-codes-rejet&utm_content=outil-entree&utm_term=noemie-0450054",
  );
  assert.equal(cibleMetier(["dentaire"]), "/metiers/dentaire");
  assert.equal(cibleMetier(["optique", "optique"]), "/metiers/opticiens");
  assert.equal(cibleMetier(["optique", "dentaire"]), "/metiers");
  assert.equal(cibleMetier(), "/metiers");
});

// ── Garde-fou : donnees.json et pages.mjs ne vont jamais dans le navigateur ──

function fichiers(dossier: string): string[] {
  return readdirSync(dossier).flatMap((n) => {
    const p = join(dossier, n);
    return statSync(p).isDirectory() ? fichiers(p) : /\.(tsx?|mjs|jsx?)$/.test(n) ? [p] : [];
  });
}

/** Les modules qu'un fichier importe (import … from, import "…", import("…"), export … from). */
const importsDe = (source: string) =>
  [...source.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g)].map((m) => m[1]);
const INTERDIT =
  /(?:^|\/)donnees\.json$|(?:^|\/)pages\.mjs$|lib\/outils\/[^/]+\/(?:pages|donnees)$/;

test("aucune route ni aucun composant n'importe donnees.json ou pages.mjs (seulement serveur.ts et Node)", () => {
  assert.ok(INTERDIT.test("@/lib/outils/codes-rejet/pages.mjs"));
  assert.ok(INTERDIT.test("../../lib/outils/codes-rejet/donnees.json"));
  assert.ok(INTERDIT.test("@/lib/outils/codes-rejet/pages"));
  assert.ok(!INTERDIT.test("@/components/agents/pages"));
  const fautes = ["src/routes", "src/components"]
    .flatMap((d) => fichiers(join(RACINE, d)))
    .flatMap((f) =>
      importsDe(readFileSync(f, "utf8"))
        .filter((i) => INTERDIT.test(i))
        .map((i) => `${f.slice(RACINE.length)} importe ${i}`),
    );
  assert.deepEqual(fautes, []);
});

// ── Découverte ───────────────────────────────────────────────────────────────

test("découverte : seuls les dossiers avec outil.mjs ET pages.mjs sont des outils", () => {
  assert.deepEqual(dossiersOutils(FIXTURE), ["factice"]);
  assert.deepEqual(dossiersOutils(join(FIXTURE, "absent")), []);
});

test("découverte : sans dossier d'outil, rien (ni /outils, ni URL dans le sitemap)", async () => {
  const vide = mkdtempSync(join(tmpdir(), "socle-vide-"));
  try {
    mkdirSync(join(vide, "src/lib/outils/socle"), { recursive: true });
    writeFileSync(join(vide, "src/lib/outils/calculs.ts"), "export {};\n");
    assert.deepEqual(await decouvrirOutils(vide), []);
    assert.deepEqual(pagesSitemap([]), []);
  } finally {
    rmSync(vide, { recursive: true, force: true });
  }
});

test("découverte de la fixture : contexte du site, pages publiées, /outils daté du hub le plus récent", async () => {
  const [o, ...reste] = await chargerOutils(FIXTURE);
  assert.equal(reste.length, 0);
  assert.equal(o.id, "factice");
  assert.deepEqual([...siteNode(FIXTURE).articles].sort(), ["ancien-factice", "guide-factice"]);
  assert.deepEqual(
    o.pages.map((p) => p.chemin),
    ["/outils/factice", "/outils/factice/alpha", "/outils/factice/beta", "/outils/factice/gamma"],
  );
  assert.deepEqual(
    o.module
      .pages({ site: o.site, candidates: true })
      .map((p) => p.slug)
      .filter(Boolean),
    ["alpha", "beta", "gamma", "zeta"],
    "la famille fermée a une page candidate, pas une page publiée",
  );
  assert.equal(o.redirections.delta, "/outils/factice#delta");
  const sitemap = pagesSitemap([o]);
  assert.deepEqual(sitemap[0], {
    chemin: "/outils",
    lastmod: "2026-11-18",
    frequence: "weekly",
    priorite: "0.8",
  });
  assert.deepEqual(sitemap[1], {
    chemin: "/outils/factice",
    lastmod: "2026-11-18",
    frequence: "weekly",
    priorite: "0.8",
  });
  assert.deepEqual(sitemap[2], {
    chemin: "/outils/factice/alpha",
    lastmod: "2026-11-10",
    frequence: "monthly",
    priorite: "0.6",
  });
});

// Un faux outil dans un dossier temporaire, pour chaque contrôle qui doit arrêter le build.
const temporaires: string[] = [];
after(() => temporaires.forEach((d) => rmSync(d, { recursive: true, force: true })));

async function erreurDe(id: string, outil: Record<string, unknown>, pages: string) {
  const racine = mkdtempSync(join(tmpdir(), "socle-erreur-"));
  temporaires.push(racine);
  const ecrire = (dossier: string, o: Record<string, unknown>, p: string) => {
    const base = join(racine, "src/lib/outils", dossier);
    mkdirSync(base, { recursive: true });
    writeFileSync(join(base, "outil.mjs"), `export const OUTIL = ${JSON.stringify(o)};\n`);
    writeFileSync(
      join(base, "pages.mjs"),
      `export const pages = () => ${p};\nexport const audit = () => [];\nexport const redirections = () => ({});\n`,
    );
  };
  ecrire(id, outil, pages);
  try {
    await decouvrirOutils(racine, { site: { articles: new Set() } });
  } catch (e) {
    return (e as Error).message;
  }
  return "";
}

const hub = (chemin: string, extra = "") =>
  `{ type: "hub", chemin: "${chemin}", titre: "t", description: "d", h1: "h", lastmod: "2026-11-18"${extra} }`;
const page = (chemin: string, lastmod = "2026-11-18") =>
  `{ type: "entree", chemin: "${chemin}", slug: "x", titre: "t", description: "d", h1: "h", lastmod: "${lastmod}" }`;

test("découverte : le build s'arrête, en français, si un outil sort du contrat", async () => {
  const ok = { id: "essai", chemin: "/outils/essai", ordre: 1 };
  assert.match(
    await erreurDe("essai", { ...ok, id: "autre-nom" }, `[${hub("/outils/essai")}]`),
    /OUTIL\.id vaut « autre-nom »/,
  );
  assert.match(
    await erreurDe("essai", { ...ok, chemin: "/essai" }, `[${hub("/outils/essai")}]`),
    /OUTIL\.chemin vaut « \/essai »/,
  );
  assert.match(
    await erreurDe("essai", ok, `[${page("/outils/essai/a")}]`),
    /pages\(\)\[0\] doit être le hub/,
  );
  assert.match(await erreurDe("essai", ok, `[]`), /au moins le hub/);
  assert.match(
    await erreurDe("essai", ok, `[${hub("/outils/essai")}, ${hub("/outils/essai")}]`),
    /un seul hub/,
  );
  assert.match(
    await erreurDe("essai", ok, `[${hub("/outils/essai")}, ${page("/outils/autre/a")}]`),
    /sort de \/outils\/essai/,
  );
  assert.match(
    await erreurDe("essai", ok, `[${hub("/outils/essai")}, ${page("/outils/essai/a/")}]`),
    /finit par \//,
  );
  assert.match(
    await erreurDe(
      "essai",
      ok,
      `[${hub("/outils/essai")}, ${page("/outils/essai/a")}, ${page("/outils/essai/a")}]`,
    ),
    /chemin en double : \/outils\/essai\/a/,
  );
  assert.match(
    await erreurDe(
      "essai",
      ok,
      `[${hub("/outils/essai")}, ${page("/outils/essai/a", "18/11/2026")}]`,
    ),
    /lastmod « 18\/11\/2026 »/,
  );
  assert.match(
    await erreurDe("essai", ok, `(() => { throw new Error("clé métier inconnue"); })()`),
    /pages\.mjs a levé une erreur : clé métier inconnue/,
  );
  assert.equal(
    await erreurDe("essai", ok, `[${hub("/outils/essai")}, ${page("/outils/essai/a")}]`),
    "",
  );
});

// ── Tests communs : chaque outil du dépôt, puis l'outil factice ──────────────

const outils = await chargerOutils();
for (const o of outils) testsCommunsOutil(o, { tous: outils });

for (const o of await chargerOutils(FIXTURE)) testsCommunsOutil(o, { aujourdhui: "2026-11-18" });
