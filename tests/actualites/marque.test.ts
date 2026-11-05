// Les noms ne vivent que dans marque.ts, et la newsletter reste fermée.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  decouperNom,
  NEWSLETTER_OUVERTE,
  NOM_NEWSLETTER,
  NOM_RUBRIQUE,
} from "../../src/lib/actualites/marque.ts";

const RACINE = fileURLToPath(new URL("../..", import.meta.url));

function fichiersDe(dossier: string): string[] {
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier, { withFileTypes: true }).flatMap((f) =>
    f.isDirectory() ? fichiersDe(join(dossier, f.name)) : [join(dossier, f.name)],
  );
}

test("la newsletter est fermée", () => {
  assert.equal(NEWSLETTER_OUVERTE, false);
});

test("la newsletter a sa propre constante", () => {
  assert.ok(NOM_NEWSLETTER.length > 0);
});

test("aucun nom codé en dur hors de marque.ts", () => {
  const routes = fichiersDe(join(RACINE, "src/routes")).filter((f) =>
    /[/\\]actualites[^/\\]*$/.test(f),
  );
  const lib = fichiersDe(join(RACINE, "src/lib/actualites")).filter(
    (f) => !f.endsWith("marque.ts"),
  );
  const interfaceActualites = fichiersDe(join(RACINE, "src/components/actualites"));
  for (const f of [...routes, ...lib, ...interfaceActualites])
    assert.equal(readFileSync(f, "utf8").includes(NOM_RUBRIQUE), false, f);
});

test("decouperNom isole le dernier mot", () => {
  assert.deepEqual(decouperNom("Le Reste"), { debut: "Le", accent: "Reste" });
  assert.deepEqual(decouperNom("Reste"), { debut: "", accent: "Reste" });
});
