// Tests propres à l'outil A, codes rejet (cadre.md § 10, textes.md § 6). Les 12 tests communs du
// socle tournent déjà sur cet outil (tests/outils/socle.test.ts) ; ici, ce que le socle ne peut
// pas savoir : écritures et redirections, familles du GIE fermées, libellés courts, dates des
// sources, phrase « fait foi », règles de mots de textes.md, recherche du hub.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { fauteTypo, siteNode } from "./socle.ts";
import donnees from "../../src/lib/outils/codes-rejet/donnees.json" with { type: "json" };
import {
  audit,
  infosHub,
  lignesHub,
  modeleEntree,
  motsPropresEntree,
  pages,
  redirections,
  resoudre,
  sourcesHub,
} from "../../src/lib/outils/codes-rejet/pages.mjs";
import {
  FAMILLES,
  GIE_HORS_DEPOT,
  GIE_SESAM_VITALE,
  LIBELLES_COURTS,
  PRIORITE,
  RESUMES,
} from "../../src/lib/outils/codes-rejet/publication.mjs";
import { cleCode } from "../../src/lib/outils/socle/texte.mjs";
import { filtrerLignes, suggestions } from "../../src/lib/outils/socle/recherche.ts";
import {
  codeDuSlug,
  formeRequete,
  variantesCode,
} from "../../src/lib/outils/codes-rejet/textes.ts";

const site = siteNode();
const HUB = "/outils/codes-rejet";
const OUVERT = { liste: true, pages: true };
const FERME = { liste: false, pages: false };
const GIE_OUVERT = { ...FAMILLES, arl: OUVERT, "sesam-vitale": OUVERT };
// Réglage fermé explicite : les comptes d'ouverture restent justes quel que soit GIE_SESAM_VITALE.
const GIE_FERME = { ...FAMILLES, arl: FERME, "sesam-vitale": FERME };
const GIE = new Set(["arl", "sesam-vitale"]);

// Entrées tirées des tables du GIE (ARL, messages de service) : tenues hors du dépôt en attendant
// l'accord du GIE (0 ici), ou remises dans donnees.json quand la décision n° 1 les ouvre (83).
const nbGie = donnees.entrees.filter(
  (e) => GIE.has(e.famille) && e.source_ids.some((s) => s.startsWith("gie-")),
).length;

const publiees = () => pages({ site }).filter((p) => p.type === "entree");
const entree = (slug: string) => donnees.entrees.find((e) => e.slug === slug)!;
const source = (id: string) => donnees.sources.find((s) => s.id === id)!;

describe("outil codes-rejet : réglages de publication", () => {
  test("par défaut, les familles du GIE SESAM-Vitale sont fermées (décision de Paul n° 1)", () => {
    assert.deepEqual(GIE_SESAM_VITALE, { liste: false, pages: false });
    assert.equal(FAMILLES.arl, GIE_SESAM_VITALE);
    assert.equal(FAMILLES["sesam-vitale"], GIE_SESAM_VITALE);
  });

  test("vague 1 : 20 pages NOEMIE au seuil de 100 mots, 3 à 150, et 27 codes dans le hub", () => {
    assert.equal(publiees().length, 20);
    assert.ok(publiees().every((p) => p.slug!.startsWith("noemie-")));
    const a150 = pages({ site, seuil: 150 }).filter((p) => p.type === "entree");
    assert.deepEqual(a150.map((p) => p.slug).sort(), [
      "noemie-0180051",
      "noemie-0450054",
      "noemie-0450072",
    ]);
    assert.equal(lignesHub({ site }).length, 27);
  });

  test("les tables du GIE ne sont dans le dépôt que si la décision n° 1 les ouvre, et alors toutes", () => {
    assert.equal(GIE_HORS_DEPOT, 83);
    const ouvert = GIE_SESAM_VITALE.liste || GIE_SESAM_VITALE.pages;
    assert.equal(nbGie, ouvert ? GIE_HORS_DEPOT : 0, `${nbGie} entrées du GIE dans donnees.json`);
  });

  test("ouvrir les familles du GIE : + 83 lignes et + 1 page une fois leurs entrées remises, rien sans elles", () => {
    const ajout =
      lignesHub({ site, familles: GIE_OUVERT }).length -
      lignesHub({ site, familles: GIE_FERME }).length;
    const entrees = (familles: typeof GIE_OUVERT) =>
      pages({ site, familles }).filter((p) => p.type === "entree");
    const avant = new Set(entrees(GIE_FERME).map((p) => p.slug));
    const nouvelles = entrees(GIE_OUVERT)
      .map((p) => p.slug)
      .filter((s) => !avant.has(s!));
    if (nbGie === 0) {
      assert.equal(ajout, 0);
      assert.deepEqual(nouvelles, []);
    } else {
      assert.equal(ajout, GIE_HORS_DEPOT);
      assert.deepEqual(nouvelles, ["arl-2004-certificat-vitale"]);
    }
  });
});

describe("outil codes-rejet : familles fermées et entrées à vérifier", () => {
  test("une famille fermée n'a ni ligne, ni page, ni redirection vers une page", () => {
    const lignes = lignesHub({ site });
    const ids = new Set(lignes.map((l) => l.id));
    const r = redirections({ site });
    for (const e of donnees.entrees.filter((x) => GIE.has(x.famille))) {
      assert.ok(!ids.has(e.slug), `${e.slug} est listé`);
      assert.ok(!publiees().some((p) => p.slug === e.slug), `${e.slug} a une page`);
      assert.equal(r[e.slug], HUB, `${e.slug} doit renvoyer vers le hub, sans ancre`);
    }
    for (const cible of Object.values(r))
      assert.ok(!GIE.has(cible.split("/").pop()!.split("-")[0]), `cible ${cible}`);
    assert.ok(!lignes.some((l) => l.groupe !== "famille-noemie"), "un groupe GIE est affiché");
    assert.equal(infosHub({ site }).gieListe, false);
    const groupes = sourcesHub({ site }).map((g) => g.titre);
    assert.ok(!groupes.includes("Éditeurs et organismes concentrateurs"), groupes.join(", "));
  });

  test("aucune entrée « à vérifier » dans les lignes du hub ni dans les pages", () => {
    const aVerifier = new Set(donnees.entrees.filter((e) => e.statut !== "sur").map((e) => e.slug));
    for (const l of lignesHub({ site })) assert.ok(!aVerifier.has(l.id), l.id);
    for (const p of pages({ site, familles: GIE_OUVERT }))
      assert.ok(!aVerifier.has(p.slug ?? ""), p.chemin);
  });

  test("2600650 et 0710060 (établissements publics seulement) sont « à vérifier » : hors liste, vers le hub", () => {
    const r = redirections({ site });
    for (const slug of ["noemie-2600650", "noemie-0710060"]) {
      assert.equal(entree(slug).statut, "a_verifier");
      assert.match(entree(slug).note_verification, /établissements publics/);
      assert.equal(r[slug], HUB);
      assert.ok(!lignesHub({ site }).some((l) => l.id === slug));
    }
  });
});

describe("outil codes-rejet : écritures et redirections", () => {
  const r = redirections({ site });

  test("chaque écriture d'une entrée publiée mène à sa page", () => {
    for (const p of publiees()) {
      const e = entree(p.slug!);
      for (const w of [e.code, ...e.autres_ecritures]) {
        const res = resoudre(w, { site });
        assert.deepEqual(res, { type: "redirection", vers: p.chemin }, `« ${w} » → ${p.chemin}`);
      }
    }
  });

  test("la forme à 6 chiffres et la forme 0450-054 redirigent vers le code à 7 chiffres", () => {
    assert.equal(r["450054"], `${HUB}/noemie-0450054`);
    assert.equal(r["0450-054"], `${HUB}/noemie-0450054`);
    assert.equal(r["0450054"], `${HUB}/noemie-0450054`);
    assert.deepEqual(resoudre("0450 054", { site }), {
      type: "redirection",
      vers: `${HUB}/noemie-0450054`,
    });
    assert.deepEqual(resoudre("NOEMIE-0450054", { site }), {
      type: "redirection",
      vers: `${HUB}/noemie-0450054`,
    });
  });

  test("un code listé sans page renvoie vers sa ligne du hub", () => {
    assert.equal(r["noemie-0480054"], `${HUB}#noemie-0480054`);
    assert.equal(r["0480054"], `${HUB}#noemie-0480054`);
  });

  test("aucune écriture ne redirige vers deux entrées ; une écriture partagée part en 302 vers la recherche", () => {
    // Familles du GIE ouvertes (entrées remises) : « 2004 » est l'écriture de deux ARL.
    if (nbGie > 0) {
      const ro = redirections({ site, familles: GIE_OUVERT });
      assert.ok(!Object.hasOwn(ro, "2004"));
      assert.deepEqual(resoudre("2004", { site, familles: GIE_OUVERT }), {
        type: "recherche",
        vers: `${HUB}?q=2004`,
      });
    }
    // Familles fermées : une adresse inconnue est introuvable (404).
    assert.deepEqual(resoudre("noemie-0999999", { site }), { type: "introuvable" });
    assert.deepEqual(resoudre("2004", { site, familles: GIE_FERME }), { type: "introuvable" });
  });
});

describe("outil codes-rejet : textes des pages publiées", () => {
  test("LIBELLES_COURTS (30 caractères au plus) et RESUMES présents pour chaque page NOEMIE publiée", () => {
    for (const p of publiees()) {
      if (p.slug === "noemie-traitement-caisse") continue;
      const court = LIBELLES_COURTS[p.slug!];
      assert.ok(court, `${p.slug} : libellé court manquant`);
      assert.ok(court.length <= 30, `${p.slug} : libellé court de ${court.length} caractères`);
      assert.ok(RESUMES[p.slug!], `${p.slug} : résumé manquant`);
    }
  });

  test("source_ids[0] d'un code NOEMIE publié est daté de 2016 ou après", () => {
    for (const p of publiees()) {
      const s = source(entree(p.slug!).source_ids[0]);
      assert.match(s.date_source, /^\d{4}-\d{2}-\d{2}$/, `${p.slug} : ${s.date_source}`);
      assert.ok(s.date_source >= "2016-01-01", `${p.slug} : ${s.date_source}`);
    }
  });

  test("chaque page dit « Le libellé de votre retour fait foi », avec la caisse et la date de la source", () => {
    for (const p of publiees()) {
      const m = modeleEntree(p.slug!, { site })!;
      assert.match(m.avertissement.texte, /^Le libellé de votre retour fait foi\./, p.slug);
      const s = source(entree(p.slug!).source_ids[0]);
      const [a, mo, j] = s.date_source.split("-");
      assert.ok(m.avertissement.texte.includes(`${j}/${mo}/${a}`), `${p.slug} : date absente`);
      if (p.slug !== "noemie-traitement-caisse") {
        const caisse = s.editeur.split(" (")[0].replace(/'/g, "’");
        assert.ok(m.avertissement.texte.includes(caisse), `${p.slug} : caisse absente`);
      }
    }
  });

  test("titres et descriptions suivent textes.md § 3.8", () => {
    const attendus: Record<string, [string, string]> = {
      "noemie-0450054": [
        "Code rejet 0450054\u00a0: ETM non trouvée en BDO, que corriger",
        "Code rejet 0450054\u00a0: la caisse ne retrouve pas l’exonération demandée. La cause probable et ce qu’il faut corriger, selon la CPAM de la Gironde (2019).",
      ],
      "noemie-0270051": [
        "Code rejet 0270051\u00a0: bénéficiaire inconnu en BDO",
        "Code rejet 0270051\u00a0: l’assuré est connu, pas le bénéficiaire tel qu’il est saisi. La cause probable et quoi corriger, selon la CPAM de la Gironde (2018).",
      ],
      "noemie-2900005": [
        "Code rejet 2900005\u00a0: facture déjà payée, que faire",
        "Code rejet 2900005\u00a0: une facture au même numéro a déjà été payée. Pourquoi ne pas la renvoyer et que faire à la place, selon la CPAM de la Gironde (2019).",
      ],
      "noemie-0450097": [
        "Code rejet 0450097\u00a0: date d’examen non valide, que corriger",
        "Code rejet 0450097\u00a0: soins de suite M’T dents hors période ou avant l’examen. La cause probable et quoi corriger, selon la CPAM de la Gironde (2019).",
      ],
      "noemie-traitement-caisse": [
        "Traitement caisse NOEMIE\u00a0: ce n’est pas un rejet",
        "«\u00a0Traitement caisse\u00a0» dans un retour NOEMIE\u00a0: la caisse étudie la facture, ce n’est pas un rejet. Que faire en attendant, et pourquoi ne pas la renvoyer.",
      ],
    };
    for (const [slug, [titre, description]] of Object.entries(attendus)) {
      const p = publiees().find((x) => x.slug === slug)!;
      assert.equal(p.titre, titre);
      assert.equal(p.description, description);
    }
  });

  test("aucune faute de typographie dans ce que les pages affichent", () => {
    const fautes: string[] = [];
    for (const p of publiees()) {
      const m = modeleEntree(p.slug!, { site })!;
      const textes = [
        m.surTitre,
        ...m.reponse,
        ...m.essentiel.map((l) => l.valeur),
        m.avertissement.texte,
        m.libelles.titre,
        m.libelles.phrase ?? "",
        ...m.libelles.lignes.map((l) => l.texte),
        m.causes.titre,
        ...m.causes.items,
        m.correction.titre,
        ...m.correction.etapes,
        m.question?.texte ?? "",
        m.note?.texte ?? "",
        m.note?.professions ?? "",
        m.voisins.titre,
        ...m.voisins.entrees.flatMap((v) => [v.titre, v.resume ?? ""]),
      ];
      for (const t of textes) {
        const f = fauteTypo(t);
        if (f) fautes.push(`${p.slug} : ${f}`);
      }
    }
    assert.deepEqual(fautes, []);
  });

  test("réponse en deux phrases (R1 ou R2) et voisins de textes.md § 3.7", () => {
    for (const p of publiees())
      assert.equal(modeleEntree(p.slug!, { site })!.reponse.length, 2, p.slug);
    const codes = (slug: string) =>
      modeleEntree(slug, { site })!.voisins.entrees.map((v) => v.code);
    assert.deepEqual(codes("noemie-0270051"), [
      "0250050",
      "0450056",
      "0450054",
      "0450072",
      "0450082",
      "0450097",
    ]);
    assert.deepEqual(codes("noemie-2900005"), ["0180051", "2900230", "Traitement caisse"]);
    assert.equal(
      modeleEntree("noemie-2900005", { site })!.voisins.titre,
      "Autres retours à ne pas renvoyer tels quels",
    );
    assert.equal(
      modeleEntree("noemie-0450097", { site })!.voisins.titre,
      "Autres codes rejets en dentaire",
    );
  });

  test("le texte propre de l'audit est celui que modeleEntree rend (seuil compté sur la page)", () => {
    for (const a of audit({ site })) {
      const slug = a.chemin.split("/").pop()!;
      assert.ok((motsPropresEntree(slug) ?? 0) >= 100, slug);
      const m = modeleEntree(slug, { site })!;
      for (const p of m.reponse) assert.ok(a.textePropre.includes(p.replace(/\.$/, "")), slug);
    }
  });

  test("PRIORITE ne cite que des entrées des données", () => {
    for (const s of PRIORITE)
      assert.ok(
        donnees.entrees.some((e) => e.slug === s),
        s,
      );
  });
});

describe("outil codes-rejet : recherche du hub", () => {
  const lignes = lignesHub({ site });

  test("« 450054 » (zéro omis) et « 0450 054 » trouvent le code 0450054, exactement", () => {
    for (const q of ["450054", "0450 054", "0450-054"]) {
      const r = filtrerLignes(lignes, q, {}, { variantes: variantesCode });
      assert.deepEqual(
        r.visibles.map((l) => l.id),
        ["noemie-0450054"],
        q,
      );
      assert.equal(r.exact, true, q);
    }
  });

  test("un mot du libellé, sans accent ni majuscule, trouve la ligne ; le filtre métier aussi", () => {
    const r = filtrerLignes(lignes, "beneficiaire inconnu", {});
    assert.ok(r.visibles.some((l) => l.id === "noemie-0270051"));
    const dentaire = filtrerLignes(lignes, "", { metier: "dentaire" }).visibles;
    assert.ok(dentaire.every((l) => l.facettes.metier.includes("dentaire")));
    assert.ok(dentaire.length > 0 && dentaire.length < lignes.length);
  });

  test("état vide : la forme de la requête choisit le message (textes.md § 1.4)", () => {
    assert.equal(formeRequete("153", false), "court");
    assert.equal(formeRequete("4005", false), "quatre");
    assert.equal(formeRequete("4005", true), "numerique");
    assert.equal(formeRequete("0999999", false), "numerique");
    assert.equal(formeRequete("R5003", false), "lettre");
    assert.equal(formeRequete("tiers payant refusé", false), "texte");
    assert.equal(codeDuSlug("noemie-0999999"), "0999999");
    assert.equal(codeDuSlug("sv-smtp-1070"), "1070");
    assert.ok(suggestions(lignes, "0450059", { variantes: variantesCode }).length > 0);
  });

  test("une ligne sans page porte son détail ; une ligne avec page, son lien", () => {
    for (const l of lignes) {
      if (l.chemin) assert.equal(l.details, undefined, l.id);
      else {
        assert.ok(l.details?.explication && l.details.source.date, l.id);
        assert.ok(l.cles.includes(cleCode(entree(l.id).code)), l.id);
      }
    }
  });
});
