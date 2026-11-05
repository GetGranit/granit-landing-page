// Le plugin Vite, exécuté pour de vrai sur la fixture : en production, un brouillon n'entre dans
// aucun module virtuel. Une régression sur avecBrouillons casserait ces tests.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { actualites } from "../../scripts/actualites/vite-plugin.ts";

process.chdir(fileURLToPath(new URL("./fixture", import.meta.url)));

const contexte = { addWatchFile() {} };

function charger(command: "build" | "serve", vercelEnv?: string) {
  if (vercelEnv) process.env.VERCEL_ENV = vercelEnv;
  else delete process.env.VERCEL_ENV;
  const plugin = actualites() as unknown as {
    config(c: object, e: { command: string }): void;
    load(this: typeof contexte, id: string): string;
  };
  plugin.config({}, { command });
  return (id: string): string => plugin.load.call(contexte, `\0virtual:actualites${id}`);
}

test("build de production : le brouillon est absent, la publiée présente", () => {
  const lire = charger("build", "production");
  assert.doesNotMatch(lire(""), /exemple-brouillon/);
  assert.match(lire(""), /exemple-publie/);
  assert.equal(lire("/edition/exemple-brouillon"), "export default null;\n");
  assert.match(lire("/edition/exemple-publie"), /exemple-publie/);
});

test("build sans environnement : même règle que la production", () => {
  assert.doesNotMatch(charger("build")(""), /exemple-brouillon/);
});

test("prévisualisation Vercel et dev : le brouillon est visible", () => {
  assert.match(charger("build", "preview")(""), /exemple-brouillon/);
  assert.match(charger("serve")(""), /exemple-brouillon/);
});

test("presence : suit le contenu du build", () => {
  assert.equal(charger("build")("/presence"), "export const rubriqueOuverte = true;\n");
});
