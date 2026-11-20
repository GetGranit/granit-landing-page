// Bloc « Ce que vous n'avez plus à faire » des pages métier : chaque ligne a un nom d'étape, et son
// passage en gras (`cle`) figure mot pour mot dans la phrase « avec Granit », sinon rien n'est mis en gras.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";

const dossier = new URL("../../src/components/agents/pages/", import.meta.url);
const fichiers = readdirSync(dossier).filter((f) => f.endsWith(".ts"));

for (const f of fichiers) {
  test(`avant/après de ${f} : étapes uniques et passage clé présent`, async () => {
    const mod = (await import(new URL(f, dossier).href)) as Record<string, unknown>;
    const pages = Object.values(mod).filter(
      (v): v is { avantApres?: { lignes: { etape: string; cle: string; apres: string }[] } } =>
        typeof v === "object" && v !== null && "avantApres" in v,
    );
    assert.ok(pages.length > 0, `aucune page avec avantApres dans ${f}`);
    for (const p of pages) {
      const lignes = p.avantApres!.lignes;
      const etapes = lignes.map((l) => l.etape);
      assert.equal(new Set(etapes).size, etapes.length, `étapes en double : ${etapes.join(", ")}`);
      for (const l of lignes) {
        assert.ok(l.etape.trim(), "étape vide");
        assert.ok(l.apres.includes(l.cle), `« ${l.cle} » absent de « ${l.apres} »`);
      }
    }
  });
}
