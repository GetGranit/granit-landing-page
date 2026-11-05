// Le filet d'après build : il repère un brouillon sorti du build, et la rubrique dans le sitemap
// ou llms.txt alors que rien n'est publié.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { verifierBuild } from "../../scripts/actualites/verifier-build.mjs";

const BROUILLON = {
  statut: "brouillon",
  numero: 1,
  titre: "Un titre accentué",
  chapo: "Un chapô de brouillon.",
};

/** Un build factice : `bundle` dans .output, sitemap et llms donnés. */
function avecBuild(
  { bundle = "rien", sitemap = "<urlset/>", llms = "# Granit", sortie = true },
  f: (racine: string) => void,
) {
  const racine = mkdtempSync(join(tmpdir(), "actualites-build-"));
  try {
    mkdirSync(join(racine, "content/actualites"), { recursive: true });
    mkdirSync(join(racine, "public"));
    writeFileSync(join(racine, "content/actualites/mon-edition.json"), JSON.stringify(BROUILLON));
    writeFileSync(join(racine, "public/sitemap.xml"), sitemap);
    writeFileSync(join(racine, "public/llms.txt"), llms);
    if (sortie) {
      mkdirSync(join(racine, ".output/server"), { recursive: true });
      writeFileSync(join(racine, ".output/server/index.mjs"), bundle);
    }
    f(racine);
  } finally {
    rmSync(racine, { recursive: true, force: true });
  }
}

test("build propre : aucune erreur", () => {
  avecBuild({}, (racine) => assert.deepEqual(verifierBuild(racine), []));
});

test("sans build, le contrôle échoue au lieu de passer à vide", () => {
  avecBuild({ sortie: false }, (racine) => {
    assert.match(verifierBuild(racine)[0], /aucun build/);
  });
});

for (const [nom, bundle] of [
  ["le slug", 'const a = "mon-edition";'],
  ["le titre", "const a = 'Un titre accentué';"],
  ["le titre échappé", 'const a = "Un titre accentu\\u00e9";'],
  ["le chapô", "const a = 'Un chapô de brouillon.';"],
]) {
  test(`brouillon repéré par ${nom}`, () => {
    avecBuild({ bundle }, (racine) => {
      assert.match(verifierBuild(racine).join(), /brouillon mon-edition présent/);
    });
  });
}

test("rubrique dans le sitemap ou llms.txt sans édition publiée : refusé", () => {
  avecBuild({ sitemap: "<loc>https://www.getgranit.ai/actualites</loc>" }, (racine) => {
    assert.match(verifierBuild(racine).join(), /\/actualites dans public\/sitemap\.xml/);
  });
  avecBuild({ llms: "- [Actualités](https://www.getgranit.ai/actualites)" }, (racine) => {
    assert.match(verifierBuild(racine).join(), /\/actualites dans public\/llms\.txt/);
  });
});
