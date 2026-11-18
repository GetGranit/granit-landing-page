// Tests propres à l'outil B · Remboursement (cadre.md § 11). Les tests communs du socle (pages,
// sources, seuil, voisins, redirections) tournent déjà dans tests/outils/socle.test.ts.
// Toutes les entrées testées sont les vraies entrées de donnees.json ; les dates sont injectées.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { fauteTypo, siteNode } from "./socle.ts";
import donnees from "../../src/lib/outils/remboursement/donnees.json" with { type: "json" };
import {
  calculer,
  lirePrix,
  montantsAffiches,
  partSecu,
  plafondContratResponsable,
  poste2027,
  regimeTaux,
} from "../../src/lib/outils/remboursement/calcul.mjs";
import {
  contenuGroupe,
  euros,
  reperes,
  REPERES_SECU,
  aMontantSecu,
} from "../../src/lib/outils/remboursement/contenu.mjs";
import { GROUPES, HORS_GROUPE, groupeRedige } from "../../src/lib/outils/remboursement/groupes.mjs";
import {
  DATE_BASCULE,
  METIERS,
  PRIORITE,
  SEUIL_MOTS_PROPRES,
  TAUX_2027,
} from "../../src/lib/outils/remboursement/publication.mjs";
import {
  PAR_CODE,
  contexte,
  entreesDuGroupe,
} from "../../src/lib/outils/remboursement/entrees.mjs";
import {
  comptesMots,
  groupesPublies,
  pages,
  redirections,
} from "../../src/lib/outils/remboursement/pages.mjs";
import {
  BANDEAU_2027,
  FAQ,
  METHODE,
  formeRequete,
  lireRequeteUrl,
  requeteDuSlug,
} from "../../src/lib/outils/remboursement/textesHub.mjs";
import { aujourdhuiParis, vueEntree, vueHub } from "../../src/lib/outils/remboursement/vues.mjs";

type Entree = (typeof donnees.entrees)[number];
const site = siteNode();
const code = (c: string) => {
  const e = PAR_CODE.get(c);
  assert.ok(e, `code ${c} absent de donnees.json`);
  return e as Entree;
};
const centimes = (v: number) => Math.round(v * 100);
const AVANT = "2026-11-18";
const VEILLE = "2026-12-31";
const APRES = "2027-01-02";
const SANS_TAUX = { lpp: null, dentaire: null, medicament_30: null, medicament_15: null };
/** Un taux 2027 fictif, pour tester le recalcul (jamais publié par l'outil). */
const TAUX_ESSAI = { ...SANS_TAUX, lpp: { taux: 45, source_id: "decret-2026-810" } };
const avecMontants = donnees.entrees.filter(
  (e) => e.base_remboursement != null && e.taux_secu != null,
);
const sures = donnees.entrees.filter((e) => e.statut === "sur");

describe("remboursement : les montants de donnees.json suivent formules.md", () => {
  test("Sécu = base × taux arrondi au centime ; Sécu + ticket modérateur = base, au centime", () => {
    const fautes: string[] = [];
    for (const e of avecMontants) {
      if (centimes(partSecu(e.base_remboursement!, e.taux_secu!)) !== centimes(e.rembourse_secu!))
        fautes.push(
          `${e.slug} : Sécu ${e.rembourse_secu} ≠ ${e.base_remboursement} × ${e.taux_secu} %`,
        );
      if (
        centimes(e.rembourse_secu!) + centimes(e.ticket_moderateur!) !==
        centimes(e.base_remboursement!)
      )
        fautes.push(`${e.slug} : Sécu + TM ≠ base`);
    }
    assert.deepEqual(fautes, []);
  });

  test("100 % Santé : part de la complémentaire au prix limite = prix limite − Sécu", () => {
    const fautes = avecMontants
      .filter((e) => e.panier_100_sante === "100-sante")
      .filter(
        (e) =>
          centimes(e.part_complementaire_au_prix_limite!) !==
          centimes(e.prix_limite!) - centimes(e.rembourse_secu!),
      )
      .map((e) => e.slug);
    assert.deepEqual(fautes, []);
  });

  test("exemples lus de formules.md et textes.md : 2263287, monture classe A", () => {
    const m = montantsAffiches(code("2263287"), AVANT, TAUX_2027, DATE_BASCULE);
    assert.deepEqual(
      [m.base, m.secu, m.ticketModerateur, m.prixLimite, m.complementaireAuPrixLimite],
      [9.75, 5.85, 3.9, 32.5, 26.65],
    );
    const mo = montantsAffiches(code("2222124"), AVANT, TAUX_2027, DATE_BASCULE);
    assert.deepEqual(
      [mo.base, mo.secu, mo.prixLimite, mo.complementaireAuPrixLimite],
      [9, 5.4, 30, 24.6],
    );
    // Arrondi au plus proche, en centimes entiers (pas d'erreur de virgule flottante).
    assert.equal(partSecu(28.92, 60), 17.35);
    assert.equal(partSecu(30.74, 60), 18.44);
    assert.equal(partSecu(0.05, 60), 0.03);
  });
});

describe("remboursement : groupes", () => {
  test("chaque code sûr est dans un groupe ou dans HORS_GROUPE, et dans un seul", () => {
    const fautes: string[] = [];
    for (const e of sures) {
      const n = [...GROUPES, ...HORS_GROUPE].filter((g) =>
        g.categories.includes(e.categorie),
      ).length;
      if (n !== 1) fautes.push(`${e.slug} (${e.categorie}) : ${n} groupe(s)`);
    }
    assert.deepEqual(fautes, []);
  });

  test("V0 : 7 pages de groupe, optique et audio ; dentaire et pharmacie fermés", () => {
    assert.equal(METIERS.dentaire.liste, false);
    assert.equal(METIERS.pharmacie.liste, false);
    assert.deepEqual(
      pages({ site })
        .filter((p) => p.type === "entree")
        .map((p) => p.slug)
        .sort(),
      [...PRIORITE].sort(),
    );
    assert.equal(vueHub({ site, jour: AVANT }).lignes.length, 209);
  });

  test("chaque paragraphe de groupe (et du hub) a au moins une source connue", () => {
    const ids = new Set(donnees.sources.map((s) => s.id));
    const textes = [
      ...GROUPES.flatMap((g) => (g.texte ?? []).map((t) => [g.slug, t] as const)),
      ...METHODE.flatMap((s) => s.p.map((t) => [s.id, t] as const)),
      ...FAQ.map((f) => [f.question, f] as const),
      ["bandeau", BANDEAU_2027] as const,
    ];
    const fautes = textes
      .filter(([, t]) => !t.source_ids?.length || t.source_ids.some((id: string) => !ids.has(id)))
      .map(([nom]) => nom);
    assert.deepEqual(fautes, []);
  });

  test("tout texte qui donne un montant Sécu a sa variante sans montant Sécu (2027)", () => {
    const fautes: string[] = [];
    for (const g of GROUPES.filter(groupeRedige)) {
      for (const t of g.texte)
        if (aMontantSecu(t.p) && (!t.p2027 || aMontantSecu(t.p2027)))
          fautes.push(`${g.slug} : ${t.p.slice(0, 40)}`);
      if (g.reponse && g.reponse.nonPublie.some(aMontantSecu))
        fautes.push(`${g.slug} : réponse 2027`);
    }
    for (const s of METHODE)
      for (const t of s.p)
        if (aMontantSecu(t.p) && (!t.p2027 || aMontantSecu(t.p2027))) fautes.push(s.id);
    for (const f of FAQ) {
      if (aMontantSecu(f.p) && !f.apres && (!f.p2027 || aMontantSecu(f.p2027)))
        fautes.push(f.question);
      if (f.apres && aMontantSecu(f.apres.nonPublie)) fautes.push(`${f.question} (2027)`);
    }
    if (aMontantSecu(BANDEAU_2027.nonPublie.texte)) fautes.push("bandeau 2027");
    assert.deepEqual(fautes, []);
    assert.ok(REPERES_SECU.includes("secu"));
    assert.deepEqual(reperes("{base:2263287} et {total:1+2}"), [
      { nom: "base", arg: "2263287" },
      { nom: "total", arg: "1+2" },
    ]);
  });

  test("les affirmations des textes tiennent dans les données", () => {
    const m = (c: string) => montantsAffiches(code(c), AVANT, TAUX_2027, DATE_BASCULE);
    // 2263287 et 2229362 : mêmes montants pour des sphères de signe opposé.
    assert.deepEqual(
      [m("2263287").base, m("2263287").prixLimite],
      [m("2229362").base, m("2229362").prixLimite],
    );
    // Monture enfant = monture adulte, en classe A et B.
    assert.deepEqual(
      [m("2254242").base, m("2254242").prixLimite],
      [m("2222124").base, m("2222124").prixLimite],
    );
    assert.deepEqual(
      [m("2276870").base, m("2276870").prixLimite],
      [m("2264861").base, m("2264861").prixLimite],
    );
    // Le prix limite le plus élevé des progressifs : 2234334 et 2299196, et eux seuls.
    const prog = entreesDuGroupe(GROUPES.find((g) => g.slug === "verre-progressif-classe-a")!);
    const max = Math.max(...prog.map((e) => e.prix_limite!));
    assert.deepEqual(
      prog
        .filter((e) => e.prix_limite === max)
        .map((e) => e.code)
        .sort(),
      ["2234334", "2299196"],
    );
    // Adaptation classe A : base = prix limite ; classe B : même prix limite.
    assert.equal(m("2226435").base, m("2226435").prixLimite);
    assert.equal(m("2209738").prixLimite, m("2226435").prixLimite);
    // Équipements recoupés par le ministère (95 €, 180 €) : la somme des prix limites.
    assert.equal(30 + 2 * 32.5, m("2222124").prixLimite! + 2 * m("2263287").prixLimite!);
    assert.equal(180, m("2222124").prixLimite! + 2 * m("2249229").prixLimite!);
    // Même désignation pour le multifocal 2245190 et le progressif 2249229.
    assert.equal(
      code("2245190").libelle.split("CLASSE A,")[1].trim(),
      code("2249229").libelle.split("CLASSE A,")[1].trim(),
    );
  });

  test("le texte rendu reprend textes.md mot pour mot (exemples du § 3.5 et du § 3.8)", () => {
    const c = (slug: string, jour = AVANT) => {
      const g = GROUPES.find((x) => x.slug === slug)!;
      return contenuGroupe(g, entreesDuGroupe(g), contexte(jour));
    };
    const nb = (t: string) => t.replace(/[\u00a0\u202f]/g, " ").replace(/’/g, "'");
    const u = c("verre-unifocal-classe-a");
    assert.equal(
      nb(u.tranches),
      "Les 30 codes se répartissent en 10 montants. La base va de 9,75 € (2229362 « SPHERE] 0 A +2,00] », 2263287 « SPHERE] 0 A -2,00] ») à 35,25 € (2236586 « SPHERE < -12,00 ET CYLINDRE (+) >4 », 2293390 « SPHERE] -8,00 A -12,00] ET CYLINDRE (+) >4 »), et le prix limite de 32,50 € à 117,50 €.",
    );
    assert.equal(
      nb(u.reponse.join(" ")),
      "La Sécurité sociale rembourse 60 % de la base, soit de 5,85 € à 21,15 € par verre selon la correction. En contrat responsable, la complémentaire paie le reste jusqu'au prix limite (32,50 € à 117,50 €) : le patient ne paie rien.",
    );
    assert.equal(
      nb(c("verre-unifocal-classe-a", APRES).reponse.join(" ")),
      "Depuis le 1er janvier 2027, le nouveau taux de la Sécurité sociale n'est pas encore publié : nous n'affichons pas sa part. La base reste de 9,75 € à 35,25 € et le prix limite de 32,50 € à 117,50 € ; en contrat responsable, le patient ne paie rien jusqu'à ce prix.",
    );
    assert.equal(
      nb(c("verres-classe-b").reponse.join(" ")),
      "La base est de 0,05 € par verre, quelle que soit la correction : la Sécurité sociale rembourse 0,03 €. Au-delà, la prise en charge dépend du contrat ; un contrat responsable couvre au moins le ticket modérateur (0,02 €).",
    );
    assert.equal(
      nb(c("aides-auditives").reponse.join(" ")),
      "En classe I (100 % Santé), la base est de 400 € pour les plus de 20 ans et de 1 400 € pour les 20 ans et moins : la Sécurité sociale en rembourse 60 %, et un contrat responsable paie le reste jusqu'au prix limite (950 € ou 1 400 €). En classe II, la base est la même et le prix libre ; la prise en charge d'un contrat responsable est plafonnée à 1 700 € par aide auditive, Sécurité sociale comprise.",
    );
    assert.equal(
      nb(c("aides-auditives", APRES).reponse.join(" ")),
      "Depuis le 1er janvier 2027, le nouveau taux de la Sécurité sociale n'est pas encore publié : nous n'affichons pas sa part. La base (400 € ou 1 400 €) et le prix limite de la classe I ne changent pas ; en classe I et en contrat responsable, le patient ne paie rien jusqu'à ce prix.",
    );
    assert.equal(nb(u.paragraphes[0].texte).includes("revient au plus à 95 €"), true);
  });

  test("aucune faute de typographie dans les textes rendus (avant et après le 01/01/2027)", () => {
    const fautes: string[] = [];
    for (const jour of [AVANT, APRES]) {
      const h = vueHub({ site, jour });
      const textes = [
        h.bandeau.texte,
        h.datation,
        h.faitFoi,
        ...h.methode.flatMap((s) => [s.titre, ...s.paragraphes.map((p) => p.texte)]),
        ...h.faq.flatMap((f) => [f.question, f.reponse]),
        ...h.lignes.map((l) => l.resume ?? ""),
      ];
      for (const p of pages({ site }).filter((x) => x.type === "entree")) {
        const v = vueEntree(p.slug!, { site, jour });
        assert.equal(v.type, "page");
        if (v.type !== "page") continue;
        textes.push(
          ...v.reponse,
          ...v.essentiel.map((l) => l.valeur),
          v.tranches,
          v.datation,
          v.limites,
        );
        textes.push(
          ...v.paragraphes.map((x) => x.texte),
          ...Object.values(v.intertitres),
          ...v.conditions.communes,
        );
      }
      for (const t of textes) {
        const f = fauteTypo(t);
        if (f) fautes.push(`${jour} : ${f}`);
      }
    }
    assert.deepEqual(fautes, []);
  });
});

describe("remboursement : bascule du 01/01/2027 (date injectée)", () => {
  test("le poste 2027 de chaque métier", () => {
    assert.equal(poste2027(code("2263287")), "lpp");
    assert.equal(poste2027(code("2351057")), "lpp");
    assert.equal(poste2027(code("HBLD634")), "dentaire");
    const med65 = sures.find((e) => e.metier === "pharmacie" && e.taux_secu === 65)!;
    assert.equal(poste2027(med65), null);
  });

  test("jusqu'au 31/12/2026 : les montants des données, taux 60 % jusqu'au 31/12/2026", () => {
    const m = montantsAffiches(code("2263287"), VEILLE, SANS_TAUX, DATE_BASCULE);
    assert.equal(m.regime.etat, "en-vigueur");
    assert.equal(m.regime.jusquau, "2026-12-31");
    assert.equal(m.secu, 5.85);
  });

  test("dès le 01/01/2027, taux non publié : aucun montant Sécu, ticket modérateur ni complémentaire", () => {
    for (const jour of [DATE_BASCULE, APRES]) {
      for (const e of sures.filter(
        (x) => x.metier === "optique" || x.metier === "audio" || x.metier === "dentaire",
      )) {
        const m = montantsAffiches(e, jour, SANS_TAUX, DATE_BASCULE);
        assert.equal(m.regime.etat, "non-publie", e.slug);
        assert.equal(m.secu, null, e.slug);
        assert.equal(m.ticketModerateur, null, e.slug);
        assert.equal(m.complementaireAuPrixLimite, null, e.slug);
        assert.equal(m.base, e.base_remboursement, "la base reste affichée");
      }
    }
    // Les médicaments à 65 % ne changent pas (le décret n° 2026-811 vise 30 % et 15 %).
    const med65 = sures.find((e) => e.metier === "pharmacie" && e.taux_secu === 65)!;
    assert.equal(
      montantsAffiches(med65, APRES, SANS_TAUX, DATE_BASCULE).secu,
      med65.rembourse_secu,
    );
  });

  test("taux 2027 renseigné : montants recalculés (base × taux) et datés par sa source", () => {
    const m = montantsAffiches(code("2263287"), APRES, TAUX_ESSAI, DATE_BASCULE);
    assert.equal(m.regime.etat, "publie");
    assert.equal(m.regime.sourceId, "decret-2026-810");
    assert.equal(m.secu, 4.39); // 9,75 × 45 % = 4,3875 → 4,39
    assert.equal(m.ticketModerateur, 5.36);
    assert.equal(m.complementaireAuPrixLimite, 28.11);
    // Le taux renseigné ne vaut qu'à partir de la bascule.
    assert.equal(montantsAffiches(code("2263287"), VEILLE, TAUX_ESSAI, DATE_BASCULE).secu, 5.85);
  });

  test("les pages servies le 02/01/2027 n'ont aucun montant Sécu, ni à l'écran ni dans leurs données", () => {
    const v = vueEntree("verre-unifocal-classe-a", { site, jour: APRES, taux2027: SANS_TAUX });
    assert.equal(v.type, "page");
    const json = JSON.stringify(v);
    for (const secu of ["5,85", "21,15", "26,65", '"rembourse_secu":5.85'])
      assert.ok(!json.includes(secu), secu);
    assert.match(json, /taux 2027 non publié/);
    const h = vueHub({ site, jour: APRES, taux2027: SANS_TAUX });
    assert.ok(h.lignes.every((l) => l.resume?.includes("taux 2027 non publié")));
    assert.equal(h.bandeau.titre, "Depuis le 1er janvier 2027");
    assert.ok(!JSON.stringify(h.faq).includes("5,40"));
    // Avant : le bandeau annonce la baisse.
    assert.equal(vueHub({ site, jour: VEILLE }).bandeau.titre, "Au 1er janvier 2027");
  });

  test("la bascule ne fait tomber aucune page : les 7 groupes passent encore le seuil", () => {
    const apres = comptesMots(APRES);
    for (const slug of PRIORITE)
      assert.ok(apres.get(slug)! >= SEUIL_MOTS_PROPRES, `${slug} : ${apres.get(slug)} mots`);
  });

  test("la date du jour se lit à Paris (le 31/12 à 23 h 30 UTC, c'est déjà le 01/01/2027)", () => {
    assert.equal(aujourdhuiParis(new Date("2026-12-31T23:30:00Z")), "2027-01-01");
    assert.equal(aujourdhuiParis(new Date("2026-12-31T22:59:00Z")), "2026-12-31");
    assert.equal(
      regimeTaux(
        code("2263287"),
        aujourdhuiParis(new Date("2026-12-31T23:30:00Z")),
        SANS_TAUX,
        DATE_BASCULE,
      ).etat,
      "non-publie",
    );
  });
});

describe("remboursement : le calcul d'une page", () => {
  const calc = (c: string, prix: number | null, jour = AVANT, taux2027 = TAUX_2027) =>
    calculer({ entree: code(c), prix, jour, taux2027, bascule: DATE_BASCULE });

  test("100 % Santé au prix limite : la complémentaire prend prix − Sécu, reste à charge 0 €", () => {
    const r = calc("2263287", 32.5);
    assert.equal(r.resteApresSecu, 26.65);
    assert.deepEqual(r.responsable, { type: "100-sante", complementaire: 26.65, resteACharge: 0 });
    assert.equal(r.alerte, null);
    assert.equal(r.plafond, null);
  });

  test("au-delà du prix limite : l'alerte, et plus de reste à charge nul", () => {
    const r = calc("2263287", 40);
    assert.equal(r.alerte, "au-dela-prix-limite");
    assert.equal(r.responsable.type === "100-sante" && r.responsable.resteACharge, null);
  });

  test("jamais de plafond pour un verre ; plafond pour la monture de classe B et l'aide auditive de classe II", () => {
    const verres = sures.filter((e) => e.categorie.startsWith("verre"));
    assert.ok(verres.length > 180);
    for (const e of verres) {
      assert.equal(plafondContratResponsable(e), null, e.slug);
      assert.equal(
        calculer({ entree: e, prix: 500, jour: AVANT, taux2027: TAUX_2027, bascule: DATE_BASCULE })
          .plafond,
        null,
      );
    }
    assert.equal(calc("2264861", 150).plafond?.montant, 100);
    assert.equal(calc("2341840", 1500).plafond?.montant, 1700);
    assert.equal(calc("2222124", 30).plafond, null, "classe A : pas de plafond affiché");
  });

  test("tarif libre : au moins le ticket modérateur ; panier inconnu : aucune part de la complémentaire", () => {
    assert.deepEqual(calc("2205321", 120).responsable, { type: "libre", minimum: 0.02 });
    assert.deepEqual(calc("2232252", 5).responsable, { type: "inconnu" });
    assert.deepEqual(calc("2267641", 5).responsable, { type: "inconnu" });
  });

  test("prix vide ou sous la base : pas de reste calculé", () => {
    assert.equal(calc("2263287", null).resteApresSecu, null);
    const sous = calc("2222124", 2);
    assert.equal(sous.sousLaBase, true);
    assert.equal(sous.resteApresSecu, null);
  });

  test("après le 01/01/2027 sans taux : le calcul ne donne aucun montant Sécu", () => {
    const r = calc("2263287", 32.5, APRES, SANS_TAUX);
    assert.equal(r.montants.secu, null);
    assert.equal(r.resteApresSecu, null);
    assert.deepEqual(r.responsable, { type: "100-sante", complementaire: null, resteACharge: 0 });
  });

  test("lecture du prix saisi", () => {
    assert.equal(lirePrix("32,50"), 32.5);
    assert.equal(lirePrix("32.5 €"), 32.5);
    assert.equal(lirePrix("1\u00a0400"), 1400);
    assert.equal(lirePrix(""), null);
    assert.equal(lirePrix("abc"), null);
    assert.equal(euros(1400), "1\u00a0400\u00a0€");
    assert.equal(euros(9.75), "9,75\u00a0€");
  });
});

describe("remboursement : adresses", () => {
  test("lpp-<code>, <code> et le slug de donnees.json mènent à la ligne du code dans son groupe", () => {
    const r = redirections({ site });
    const cible = "/outils/remboursement/verre-unifocal-classe-a#lpp-2263287";
    assert.equal(r["lpp-2263287"], cible);
    assert.equal(r["2263287"], cible);
    assert.equal(r[code("2263287").slug], cible);
    assert.equal(r["lpp-2351057"], "/outils/remboursement/aides-auditives#lpp-2351057");
    // Un code d'un groupe sans page : sa ligne dans le hub.
    assert.equal(r["lpp-2298972"], "/outils/remboursement#lpp-2298972");
    // Dentaire fermé : pas de redirection (404 « le dentaire n'est pas encore dans l'outil »).
    assert.equal(r["ccam-hbld634"], undefined);
    // Pas d'URL par CIP.
    assert.ok(!Object.keys(r).some((k) => k.startsWith("cip-")));
  });

  test("?q=2263287 arrive en nombre (le routeur lit du JSON) : gardé, pas de redirection vers le hub nu", () => {
    assert.equal(lireRequeteUrl(2263287), 2263287);
    assert.equal(lireRequeteUrl("verre progressif"), "verre progressif");
    assert.equal(lireRequeteUrl(""), undefined);
    assert.equal(lireRequeteUrl(Number.NaN), undefined);
    assert.equal(lireRequeteUrl({}), undefined);
  });

  test("forme d'une requête et requête tirée d'un slug inconnu", () => {
    assert.equal(formeRequete("7227824"), "fabricant");
    assert.equal(formeRequete("LPP 2999999"), "inconnu");
    assert.equal(formeRequete("hbld634"), "ccam");
    assert.equal(formeRequete("3400935955838"), "cip");
    assert.equal(formeRequete("verre progressif"), "texte");
    assert.equal(requeteDuSlug("lpp-7227824-verre-x"), "7227824");
    assert.equal(requeteDuSlug("ccam-hbld634"), "HBLD634");
    assert.equal(requeteDuSlug("lunettes-de-soleil"), "lunettes de soleil");
  });

  test("aucune donnée non affichée ne part vers le navigateur", () => {
    const h = JSON.stringify(vueHub({ site, jour: AVANT }));
    const e = JSON.stringify(vueEntree("montures", { site, jour: AVANT }));
    for (const j of [h, e]) {
      assert.ok(!j.includes("note_verification"));
      assert.ok(!j.includes("change_au_2027_01_01"));
    }
  });
});

describe("remboursement : ouvrir le dentaire et la pharmacie (décision n° 2)", () => {
  const OUVERT = {
    optique: { liste: true, pages: true },
    audio: { liste: true, pages: true },
    dentaire: { liste: true, pages: true },
    pharmacie: { liste: true, pages: false },
  };

  test("une constante ajoute les lignes sûres, jamais une entrée à vérifier, sans créer de page", () => {
    const h = vueHub({ site, jour: AVANT, metiers: OUVERT });
    const sursOuverts = sures.filter((e) =>
      ["optique", "audio", "dentaire", "pharmacie"].includes(e.metier),
    );
    assert.equal(h.lignes.length, sursOuverts.length);
    const aVerifier = new Set(
      donnees.entrees
        .filter((e) => e.statut !== "sur")
        .map((e) => e.code)
        .filter(Boolean),
    );
    assert.ok(h.lignes.every((l) => !aVerifier.has(l.code!)));
    assert.deepEqual(
      groupesPublies({ metiers: OUVERT })
        .map((g) => g.slug)
        .sort(),
      [...PRIORITE].sort(),
    );
    assert.equal(
      redirections({ site, metiers: OUVERT })["ccam-hbld634"],
      "/outils/remboursement#ccam-hbld634",
    );
    assert.ok(h.facettes.domaine.some((o) => o.valeur === "dentaire"));
  });
});
