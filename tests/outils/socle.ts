// Helper de tests du socle des outils référentiels. Pas un fichier .test.ts : `npm test` ne le lance
// pas seul ; tests/outils/socle.test.ts l'appelle pour chaque outil découvert, et un test propre à un
// outil (tests/outils/<id>.test.ts) peut s'en servir :
//
//   import { chargerOutils, siteNode } from "./socle.ts";
//   const [o] = (await chargerOutils()).filter((x) => x.id === "codes-rejet");
//   const pages = o.module.pages({ site: siteNode() });
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import {
  contexteSiteNode,
  decouvrirOutils,
  type OutilDecouvert,
} from "../../scripts/outils/decouvrir.mjs";
import { IDS_METIERS } from "../../src/lib/outils/socle/metiers.mjs";
import { MIN_VOISINS, motsPropres, phrasesGabarit } from "../../src/lib/outils/socle/mots.mjs";
import { estDateIso, fauteTypo } from "../../src/lib/outils/socle/texte.mjs";
import type { AuditPage, ContexteSite, PageOutil } from "../../src/lib/outils/socle/types.ts";

export { compterMots, motsPropres, phrasesGabarit } from "../../src/lib/outils/socle/mots.mjs";
export { fauteTypo, normaliser, cleCode } from "../../src/lib/outils/socle/texte.mjs";
export type { OutilDecouvert };

/** Racine du dépôt. */
export const RACINE = fileURLToPath(new URL("../..", import.meta.url));

/** Les outils de `racine` (le dépôt par défaut), via scripts/outils/decouvrir.mjs. */
export async function chargerOutils(
  racine: string = RACINE,
  options: { site?: ContexteSite } = {},
): Promise<OutilDecouvert[]> {
  return decouvrirOutils(racine, options);
}

/** Les slugs /ressources en ligne (articlesEnLigne + anciensSlugsFr non remplacés), lus sur le disque. */
export function siteNode(racine: string = RACINE): ContexteSite {
  return contexteSiteNode(racine);
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_HTTP = /^https?:\/\/\S+$/;
const DEBUT = "2026-01-01";

/** Aujourd'hui à Paris, AAAA-MM-JJ. */
const aujourdHui = () =>
  new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());

/** Liste lisible des fautes, une par ligne, pour les messages d'échec. */
const liste = (fautes: string[]) => `\n  - ${fautes.join("\n  - ")}`;
const aucune = (fautes: string[], quoi: string) =>
  assert.equal(fautes.length, 0, `${quoi} :${liste(fautes)}`);

/** Une source est datée si son date_source porte une année (ISO ou « état au 2026-11-18 »). */
const estDatee = (date: string) => /\b(19|20)\d{2}\b/.test(date ?? "");

/**
 * Déclare les tests communs d'un outil (socle.md § 10.2), avec pages({ site }) puis
 * pages({ site, candidates: true }). `tous` : les autres outils, pour l'unicité des chemins.
 */
export function testsCommunsOutil(
  o: OutilDecouvert,
  { tous = [], aujourdhui = aujourdHui() }: { tous?: OutilDecouvert[]; aujourdhui?: string } = {},
): void {
  const { outil, site, module, publication } = o;
  const pages = (candidates = false): PageOutil[] => module.pages({ site, candidates });
  const audit = (candidates = false): AuditPage[] => module.audit({ site, candidates });
  const entrees = (ps: PageOutil[]) => ps.filter((p) => p.type === "entree");

  describe(`outil ${o.id} : tests communs du socle`, () => {
    test("1. descripteur : id = dossier, chemin, description de 160 caractères au plus, métiers connus", () => {
      assert.equal(outil.id, o.id, "OUTIL.id doit valoir le nom du dossier");
      assert.equal(outil.chemin, `/outils/${o.id}`);
      for (const champ of ["nom", "titreCarte", "description"] as const) {
        assert.ok(outil[champ]?.trim(), `OUTIL.${champ} est vide`);
        assert.equal(fauteTypo(outil[champ]), null, `OUTIL.${champ}`);
      }
      assert.ok(
        outil.description.length <= 160,
        `description : ${outil.description.length} caractères`,
      );
      assert.ok(Number.isFinite(outil.ordre), "OUTIL.ordre doit être un nombre");
      assert.ok(outil.metiers.length > 0, "OUTIL.metiers est vide");
      const inconnus = outil.metiers.filter((m) => !(IDS_METIERS as readonly string[]).includes(m));
      aucune(inconnus, "métiers inconnus");
    });

    for (const candidates of [false, true]) {
      const nom = candidates ? " (candidates)" : "";

      test(`2. un seul hub, en premier ; entrées sous le chemin de l'outil ; slugs propres et uniques${nom}`, () => {
        const ps = pages(candidates);
        assert.equal(ps[0]?.type, "hub", "pages()[0] doit être le hub");
        assert.equal(ps[0].chemin, outil.chemin);
        assert.equal(ps.filter((p) => p.type === "hub").length, 1, "un seul hub");
        const fautes: string[] = [];
        for (const p of entrees(ps)) {
          if (!p.slug || !SLUG.test(p.slug) || p.slug.length > 80)
            fautes.push(`slug « ${p.slug} »`);
          if (p.chemin !== `${outil.chemin}/${p.slug}`)
            fautes.push(`chemin « ${p.chemin} » ≠ ${outil.chemin}/${p.slug}`);
        }
        const chemins = ps.map((p) => p.chemin);
        chemins
          .filter((c, i) => chemins.indexOf(c) !== i)
          .forEach((c) => fautes.push(`chemin en double ${c}`));
        for (const autre of tous.filter((x) => x.id !== o.id))
          for (const p of autre.pages)
            if (chemins.includes(p.chemin))
              fautes.push(`chemin partagé avec ${autre.id} : ${p.chemin}`);
        aucune(fautes, "pages");
      });

      test(`3. titres (10 à 60), descriptions (140 à 160) et h1 : présents, uniques, sans faute de typographie${nom}`, () => {
        const ps = pages(candidates);
        const fautes: string[] = [];
        for (const p of ps) {
          if (p.titre.length < 10 || p.titre.length > 60)
            fautes.push(`${p.chemin} : titre de ${p.titre.length} caractères`);
          if (p.description.length < 140 || p.description.length > 160)
            fautes.push(`${p.chemin} : description de ${p.description.length} caractères`);
          if (!p.h1?.trim()) fautes.push(`${p.chemin} : h1 vide`);
          for (const champ of ["titre", "description", "h1"] as const) {
            const f = fauteTypo(p[champ] ?? "");
            if (f) fautes.push(`${p.chemin} (${champ}) : ${f}`);
          }
        }
        for (const champ of ["titre", "description"] as const) {
          const vus = ps.map((p) => p[champ]);
          vus
            .filter((v, i) => vus.indexOf(v) !== i)
            .forEach((v) => fautes.push(`${champ} en double : « ${v} »`));
        }
        aucune(fautes, "titres et descriptions");
      });

      test(`4. lastmod au format AAAA-MM-JJ, entre ${DEBUT} et aujourd'hui${nom}`, () => {
        const fautes = pages(candidates)
          .filter(
            (p) =>
              !/^\d{4}-\d{2}-\d{2}$/.test(p.lastmod) || p.lastmod < DEBUT || p.lastmod > aujourdhui,
          )
          .map((p) => `${p.chemin} : ${p.lastmod}`);
        aucune(fautes, "lastmod");
      });

      test(`5. audit() couvre exactement les entrées de pages()${nom}`, () => {
        const attendus = entrees(pages(candidates))
          .map((p) => p.chemin)
          .sort();
        const audites = audit(candidates).map((a) => a.chemin);
        assert.deepEqual([...audites].sort(), attendus);
        assert.equal(new Set(audites).size, audites.length, "une ligne d'audit en double");
      });

      test(`6. aucune page à partir d'une entrée à vérifier${nom}`, () => {
        const fautes: string[] = [];
        for (const a of audit(candidates)) {
          if (!a.entrees.length) fautes.push(`${a.chemin} : aucune entrée affichée comme acquise`);
          for (const e of a.entrees)
            if (e.statut !== "sur") fautes.push(`${a.chemin} : ${e.id} est « ${e.statut} »`);
        }
        aucune(fautes, "entrées à vérifier");
      });

      test(`7. chaque entrée a une source résolue, complète et datée${nom}`, () => {
        const fautes: string[] = [];
        for (const a of audit(candidates)) {
          const sources = new Map(a.sources.map((s) => [s.id, s]));
          for (const e of a.entrees) {
            if (!e.source_ids?.length) fautes.push(`${a.chemin} : ${e.id} sans source_id`);
            for (const id of e.source_ids ?? []) {
              const s = sources.get(id);
              if (!s) {
                fautes.push(`${a.chemin} : source « ${id} » non résolue`);
                continue;
              }
              if (!URL_HTTP.test(s.url ?? ""))
                fautes.push(`${a.chemin} : source ${id}, url « ${s.url} »`);
              for (const champ of ["titre", "editeur", "date_source"] as const)
                if (!s[champ]?.trim()) fautes.push(`${a.chemin} : source ${id}, ${champ} vide`);
              if (!estDateIso(s.consulte_le))
                fautes.push(`${a.chemin} : source ${id}, consulte_le « ${s.consulte_le} »`);
            }
          }
          if (!a.sources.some((s) => estDatee(s.date_source)))
            fautes.push(`${a.chemin} : aucune source datée`);
        }
        aucune(fautes, "sources");
      });

      test(`8. texte propre au-dessus du seuil de l'outil${nom}`, () => {
        const seuil = publication.SEUIL_MOTS_PROPRES;
        assert.equal(typeof seuil, "number", "publication.mjs doit exporter SEUIL_MOTS_PROPRES");
        // Gabarit calculé sur les candidates : une population plus petite que celle de l'outil
        // (toutes ses entrées sûres), donc un compte au moins égal au sien.
        const lignes = audit(candidates);
        const gabarit = phrasesGabarit(audit(true).map((a) => a.textePropre));
        const fautes = lignes
          .map((a) => [a.chemin, motsPropres(a.textePropre, gabarit)] as const)
          .filter(([, n]) => n < (seuil as number))
          .map(([c, n]) => `${c} : ${n} mots propres (seuil ${seuil})`);
        aucune(fautes, "seuil de contenu");
      });

      test(`9. au moins ${MIN_VOISINS} voisins publiés, sans doublon ni la page elle-même${nom}`, () => {
        const publiees = new Set(entrees(pages(candidates)).map((p) => p.chemin));
        const fautes: string[] = [];
        for (const a of audit(candidates)) {
          if (a.voisins.length < MIN_VOISINS)
            fautes.push(`${a.chemin} : ${a.voisins.length} voisin(s)`);
          if (new Set(a.voisins).size !== a.voisins.length)
            fautes.push(`${a.chemin} : voisin en double`);
          for (const v of a.voisins) {
            if (v === a.chemin) fautes.push(`${a.chemin} : se cite comme voisin`);
            else if (v.startsWith("/ressources/")) {
              if (!site.articles.has(v.slice("/ressources/".length)))
                fautes.push(`${a.chemin} : ${v} n'est pas en ligne`);
            } else if (!publiees.has(v))
              fautes.push(`${a.chemin} : ${v} n'est pas une page publiée de l'outil`);
          }
        }
        aucune(fautes, "voisins");
      });

      test(`10. articles liés : 1 à 3, tous en ligne${nom}`, () => {
        const fautes: string[] = [];
        for (const a of audit(candidates)) {
          if (a.articles.length < 1 || a.articles.length > 3)
            fautes.push(`${a.chemin} : ${a.articles.length} article(s)`);
          for (const s of a.articles)
            if (!site.articles.has(s))
              fautes.push(`${a.chemin} : /ressources/${s} n'est pas en ligne`);
        }
        aucune(fautes, "articles liés");
      });
    }

    test("11. redirections : ni slug publié, ni chaîne ; chaque cible est une page publiée (ancre permise) ou une fiche en ligne", () => {
      const ps = pages();
      const r = module.redirections({ site });
      const publiees = new Set(ps.map((p) => p.chemin));
      const slugsPublies = new Set(entrees(ps).map((p) => p.slug));
      const fautes: string[] = [];
      for (const [cle, cible] of Object.entries(r)) {
        if (!cle || cle.includes("/")) fautes.push(`clé « ${cle} »`);
        if (slugsPublies.has(cle))
          fautes.push(`« ${cle} » est une page publiée, pas une redirection`);
        const [chemin] = cible.split("#");
        if (cible.includes("?")) fautes.push(`${cle} → ${cible} : jamais de ?q= dans une 301`);
        else if (chemin.startsWith("/ressources/")) {
          if (!site.articles.has(chemin.slice("/ressources/".length)))
            fautes.push(`${cle} → ${cible} : fiche hors ligne`);
        } else if (!publiees.has(chemin)) fautes.push(`${cle} → ${cible} : cible non publiée`);
        const dernier = chemin.startsWith(`${outil.chemin}/`)
          ? chemin.slice(outil.chemin.length + 1)
          : undefined;
        if (dernier && Object.hasOwn(r, dernier))
          fautes.push(`${cle} → ${cible} : chaîne (${dernier} est aussi une clé)`);
      }
      aucune(fautes, "redirections");
    });

    test("12. pages() ⊆ pages({ candidates: true }) ; PRIORITE sans doublon ni slug inconnu ; vague ≤ PAGES_MAX", () => {
      const vague = entrees(pages()).map((p) => p.chemin);
      const candidates = new Set(entrees(pages(true)).map((p) => p.chemin));
      aucune(
        vague.filter((c) => !candidates.has(c)),
        "pages publiées hors des candidates",
      );
      const priorite = publication.PRIORITE;
      assert.ok(
        Array.isArray(priorite),
        "publication.mjs doit exporter PRIORITE (tableau de slugs)",
      );
      const slugs = priorite as string[];
      aucune(
        slugs.filter((s, i) => slugs.indexOf(s) !== i),
        "PRIORITE : slugs en double",
      );
      // Un slug connu a une page (publiée ou candidate) ou une redirection (entrée sans page → hub).
      const connus = new Set([
        ...entrees(pages()).map((p) => p.slug),
        ...entrees(pages(true)).map((p) => p.slug),
        ...Object.keys(module.redirections({ site })),
        ...Object.keys(module.redirections({ site, candidates: true })),
      ]);
      aucune(
        slugs.filter((s) => !connus.has(s)),
        "PRIORITE : slugs inconnus (ni page, ni redirection)",
      );
      const max = publication.PAGES_MAX;
      if (typeof max === "number")
        assert.ok(vague.length <= max, `${vague.length} pages pour PAGES_MAX = ${max}`);
    });
  });
}
