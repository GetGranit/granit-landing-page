// Tests propres à l'outil C (mutuelle → portail de tiers payant), en plus des tests communs du socle
// (tests/outils/socle.test.ts) : fiches existantes, faits « à vérifier », lecture des listes publiques,
// opérateurs, restrictions de sous-domaine, recherche du hub. Liste : outils-nuit/C/cadre.md § 11.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { siteNode } from "./socle.ts";
import donnees from "../../src/lib/outils/mutuelle-portail/donnees.json" with { type: "json" };
import {
  ENTREES,
  audit,
  ficheDe,
  pages,
  redirections,
} from "../../src/lib/outils/mutuelle-portail/pages.mjs";
import { modeleEntree, modeleHub } from "../../src/lib/outils/mutuelle-portail/modele.mjs";
import {
  A_CONFIRMER_VISIBLE,
  ALIAS_FICHES,
  OPERATEURS_FILTRE,
  PRIORITE,
} from "../../src/lib/outils/mutuelle-portail/publication.mjs";
import { LISTES, lireSegments } from "../../src/lib/outils/mutuelle-portail/releve.mjs";
import {
  PHRASE_CARTE,
  descriptions,
  forme,
  titres,
} from "../../src/lib/outils/mutuelle-portail/redaction.mjs";
import { variantes } from "../../src/lib/outils/mutuelle-portail/recherche.ts";
import { filtrerLignes } from "../../src/lib/outils/socle/recherche.ts";
import { fauteTypo } from "../../src/lib/outils/socle/texte.mjs";

const site = siteNode();
const hub = modeleHub(site);
const publiees = pages({ site }).filter((p) => p.type === "entree");
const SOURCES = new Map(donnees.sources.map((s) => [s.id, s]));
const itemsDe = (e: (typeof donnees.entrees)[number]) =>
  Object.entries(e.par_metier).flatMap(([metier, v]) =>
    [v, ...((v as { alternatives?: unknown[] }).alternatives ?? [])].map((it) => ({
      metier,
      ...(it as {
        operateur_id: string;
        statut: string;
        restriction: string | null;
        source_ids: string[];
        note_verification: string;
        portail_url: string | null;
        role: string;
      }),
    })),
  );

describe("outil mutuelle-portail : une seule URL par mutuelle", () => {
  test("aucune page d'outil pour une mutuelle qui a une fiche /ressources (ALIAS_FICHES compris)", () => {
    const fautes = publiees
      .filter((p) => site.articles.has(`portail-${ALIAS_FICHES[p.slug!] ?? p.slug}`))
      .map((p) => p.chemin);
    assert.deepEqual(fautes, []);
  });

  test("toute mutuelle à fiche redirige en 301 vers sa fiche, et sa ligne du hub y mène", () => {
    const r = redirections({ site });
    const avecFiche = donnees.entrees.filter((e) => ficheDe(e.slug, site));
    assert.equal(avecFiche.length, 22, "22 fiches /ressources/portail-<x> le 18/11/2026");
    for (const e of avecFiche) {
      const cible = `/ressources/${ficheDe(e.slug, site)}`;
      assert.equal(r[e.slug], cible, e.slug);
      assert.equal(hub.lignes.find((l) => l.id === e.slug)?.chemin, cible, `ligne ${e.slug}`);
    }
    assert.equal(r["la-mutuelle-familiale"], "/ressources/portail-mutuelle-familiale");
    assert.equal(r["ma-mutuelle-mgen"], "/ressources/portail-mgen", "autre nom → fiche");
  });

  test("une entrée sans page mène à sa ligne du hub ; un slug inconnu n'a ni page ni redirection", () => {
    const r = redirections({ site });
    assert.equal(r.mnh, "/outils/mutuelle-portail#mnh");
    assert.equal(modeleEntree("mnh", site).type, "redirection");
    assert.equal(modeleEntree("mutuelle-inconnue", site).type, "introuvable");
    assert.equal(r["mutuelle-inconnue"], undefined);
  });

  test("PRIORITE ne cite que des complémentaires sûres sans fiche", () => {
    for (const s of PRIORITE) {
      const e = donnees.entrees.find((x) => x.slug === s);
      assert.ok(e, `${s} inconnu`);
      assert.equal(e.statut, "sur", s);
      assert.equal(ficheDe(s, site), null, `${s} a une fiche`);
    }
  });
});

describe("outil mutuelle-portail : faits sûrs et faits à confirmer", () => {
  test("une page n'affiche comme acquis que des faits sûrs", () => {
    for (const a of audit({ site, candidates: true }))
      for (const e of a.entrees) assert.equal(e.statut, "sur", `${a.chemin} : ${e.id}`);
  });

  test("un fait à vérifier n'apparaît qu'« à confirmer sur la carte », sans lien vers un portail", () => {
    const lignesTableau = [
      ...hub.lignes.flatMap((l) => l.details?.lignes ?? []),
      ...publiees.flatMap((p) => {
        const m = modeleEntree(p.slug!, site);
        return m.type === "page" ? m.releve.lignes : [];
      }),
    ];
    assert.ok(lignesTableau.length > 30, `${lignesTableau.length} lignes`);
    for (const l of lignesTableau) {
      if (l.statut === "sur") continue;
      assert.equal(l.etat, "à confirmer sur la carte", l.id);
      assert.equal(l.portail, null, `${l.id} : pas de lien vers un portail à confirmer`);
    }
    for (const l of hub.lignes)
      for (const p of Object.values(l.apercu.parMetier).flat())
        if (p && p.statut !== "sur")
          assert.equal(p.libelle, null, `${l.id} : libellé d'un fait à confirmer`);
    assert.equal(typeof A_CONFIRMER_VISIBLE, "boolean");
  });

  test("une entrée entièrement à vérifier n'affiche aucun opérateur comme relevé", () => {
    for (const e of donnees.entrees.filter((x) => x.statut === "a_verifier")) {
      const l = hub.lignes.find((x) => x.id === e.slug)!;
      assert.equal(l.apercu.surs.length, 0, e.slug);
      assert.equal(l.lien === "page", false, e.slug);
    }
  });

  test("MGEN : optique et audio chez Viamedis relevés, le reste à confirmer jusqu'à la bascule du 30/11/2026", () => {
    const l = hub.lignes.find((x) => x.id === "mgen")!;
    assert.deepEqual(l.apercu.surs, [{ metiers: "Optique, audio", operateur: "Viamedis" }]);
    assert.ok(
      l.apercu.aConfirmer.some(
        (g) => g.operateur === "Viamedis" && g.metiers.toLowerCase().includes("pharmacie"),
      ),
    );
  });

  test("chaque réponse rappelle que la carte fait foi, et donne la date du relevé", () => {
    for (const p of publiees) {
      const m = modeleEntree(p.slug!, site);
      assert.equal(m.type, "page");
      if (m.type !== "page") continue;
      assert.equal(m.reponse[1], PHRASE_CARTE);
      assert.match(m.reponse[0], /\d\d\/\d\d\/\d{4}/, `${p.slug} : date du relevé`);
      assert.match(m.avertissement, /carte de tiers payant du patient/);
    }
    for (const l of hub.lignes)
      if (l.details) assert.match(l.details.releveLe, /^\d\d\/\d\d\/\d{4}$/, l.id);
  });
});

describe("outil mutuelle-portail : listes publiques, opérateurs, restrictions", () => {
  test("100 % des notes des listes SP santé et iSanté sont lues (libellé, numéro AMC, segment, lignes)", () => {
    let n = 0;
    const fautes: string[] = [];
    for (const e of donnees.entrees)
      for (const it of itemsDe(e)) {
        const liste = it.source_ids.find((s) => Object.hasOwn(LISTES, s));
        if (!liste) continue;
        n++;
        const segs = lireSegments(it.note_verification);
        if (!segs) fautes.push(`${e.slug} ${it.metier}`);
        else if (segs.some((s) => s.operateur !== LISTES[liste] || !/^\d{10}$/.test(s.amc)))
          fautes.push(`${e.slug} ${it.metier} : opérateur ou numéro AMC`);
      }
    assert.ok(n > 200, `${n} notes de liste`);
    assert.deepEqual(fautes, []);
  });

  test("chaque opérateur d'un fait sûr existe dans `operateurs`, sauf la gestion directe d'une complémentaire", () => {
    const ids = new Set(donnees.operateurs.map((o) => o.id));
    const fautes = donnees.entrees.flatMap((e) =>
      itemsDe(e)
        .filter(
          (it) => it.statut === "sur" && it.role !== "gestion-directe" && !ids.has(it.operateur_id),
        )
        .map((it) => `${e.slug} ${it.metier} : ${it.operateur_id}`),
    );
    assert.deepEqual(fautes, []);
    for (const [id] of OPERATEURS_FILTRE) assert.ok(ids.has(id), `filtre : ${id}`);
  });

  test("Oxantis n'est jamais proposé comme portail actif", () => {
    assert.ok(!OPERATEURS_FILTRE.some(([id]) => id === "oxantis"));
    for (const e of donnees.entrees)
      assert.ok(!itemsDe(e).some((it) => it.operateur_id === "oxantis"), e.slug);
    for (const l of hub.lignes) assert.ok(!l.facettes.operateur.includes("oxantis"), l.id);
  });

  test("les liens vers les espaces pro sont en https", () => {
    const liens = hub.lignes.flatMap((l) =>
      (l.details?.lignes ?? []).map((x) => x.portail).filter(Boolean),
    );
    assert.ok(liens.length > 0);
    for (const u of liens) assert.match(u!, /^https:\/\//);
    for (const s of donnees.sources) assert.match(s.url, /^https:\/\//, s.id);
  });

  test("un segment réservé aux stomatologues n'est jamais sûr ni compté pour le dentaire, et sa restriction est écrite", () => {
    let vus = 0;
    for (const e of donnees.entrees)
      for (const it of itemsDe(e).filter((x) => x.restriction === "stomatologue uniquement")) {
        vus++;
        assert.equal(it.statut, "a_verifier", `${e.slug} ${it.metier}`);
      }
    assert.ok(vus > 0);
    // La facette « dentaire » d'une ligne vient toujours d'un segment ouvert à tous les dentistes.
    for (const l of hub.lignes.filter((x) => x.facettes.metier.includes("dentaire"))) {
      const e = donnees.entrees.find((x) => x.slug === l.id)!;
      assert.ok(
        itemsDe(e).some(
          (it) =>
            it.metier === "dentaire" &&
            !it.restriction &&
            (it.statut === "sur" || A_CONFIRMER_VISIBLE),
        ),
        `${l.id} : facette dentaire sans segment ouvert aux dentistes`,
      );
    }
    // Dans les tableaux, un fait restreint porte sa restriction en clair.
    for (const l of hub.lignes)
      for (const t of l.details?.lignes ?? []) {
        const e = donnees.entrees.find((x) => x.slug === l.id)!;
        const it = itemsDe(e).find(
          (x) => `${e.slug}:${x.metier}` === t.id.split(":").slice(0, 2).join(":") && x.restriction,
        );
        if (it && t.id.split(":").length === 2)
          assert.ok(t.restriction, `${t.id} : restriction non écrite`);
      }
    const maaf = hub.lignes.find((x) => x.id === "maaf")!;
    assert.ok(!maaf.facettes.metier.includes("dentaire"), "MAAF : stomatologues seulement");
    assert.ok(
      maaf.apercu.aConfirmer.some((g) => g.restriction === "réservé aux stomatologues"),
      "MAAF : la restriction est écrite à côté de l'opérateur",
    );
  });
});

describe("outil mutuelle-portail : hub et textes", () => {
  test("le hub porte les 54 complémentaires, groupées de A à Z", () => {
    assert.equal(hub.lignes.length, donnees.entrees.length);
    assert.equal(new Set(hub.lignes.map((l) => l.id)).size, 54);
    for (const l of hub.lignes)
      assert.ok(
        hub.groupes.some((g) => g.id === l.groupe),
        l.id,
      );
    const lettres = hub.groupes.map((g) => g.titre);
    assert.deepEqual(lettres, [...lettres].sort());
  });

  test("recherche : un numéro AMC, avec ou sans ses zéros, trouve une seule complémentaire", () => {
    for (const q of ["0045900442", "45900442", "0045 900 442"]) {
      const r = filtrerLignes(hub.lignes, q, {}, { variantes });
      assert.deepEqual(
        r.visibles.map((l) => l.id),
        ["mnh"],
        q,
      );
    }
    const harmo = filtrerLignes(hub.lignes, "harmo", {}, { variantes }).visibles.map((l) => l.id);
    assert.deepEqual(harmo.sort(), ["harmonie-fonction-publique", "harmonie-mutuelle"]);
    const optique = filtrerLignes(hub.lignes, "harmo", { metier: "optique" }, { variantes });
    assert.deepEqual(
      optique.visibles.map((l) => l.id),
      ["harmonie-mutuelle"],
    );
  });

  test("titres et descriptions des 26 complémentaires sûres sans fiche tiennent dans les bornes, sans faute", () => {
    const candidates = ENTREES.filter((x) => x.e.statut === "sur" && !ficheDe(x.e.slug, site));
    assert.equal(candidates.length, 26);
    for (const x of candidates) {
      const t = forme(titres(x.e, x.faits), 10, 60, x.e.slug);
      const d = forme(descriptions(x.e, x.faits, SOURCES), 140, 160, x.e.slug);
      assert.equal(fauteTypo(t), null, t);
      assert.equal(fauteTypo(d), null, d);
    }
  });

  test("les textes affichés du hub sont sans faute de typographie", () => {
    const textes = hub.lignes.flatMap((l) => [
      l.nom,
      ...l.apercu.surs.map((g) => `${g.metiers} ${g.operateur}`),
      ...Object.values(l.details?.phrases ?? {})
        .flat()
        .flatMap((p) => (typeof p === "string" ? [p] : [p.phrase, ...p.items])),
      ...(l.details?.lignes ?? []).flatMap((x) => [x.etat, x.sousDomaines ?? "", x.raison ?? ""]),
    ]);
    const fautes = textes.map((t) => fauteTypo(t)).filter(Boolean);
    assert.deepEqual(fautes, []);
  });
});
