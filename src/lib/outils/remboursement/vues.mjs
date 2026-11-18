// Ce que serveur.ts renvoie au navigateur pour le hub et pour une page de groupe : tout est calculé
// ici, côté serveur, à la date du jour (Europe/Paris) passée en paramètre, puis rendu tel quel par
// les composants. Le navigateur reçoit la même date dans les données du loader : le HTML du serveur
// et celui de l'hydratation sont identiques (pas de new Date() dans un composant).
//
// Serveur et Node seulement (importe donnees.json via entrees.mjs) ; ne renvoie que ce qui est
// affiché : jamais `note_verification`, jamais une entrée `a_verifier`.
import { OUTIL } from "./outil.mjs";
import { DATE_BASCULE, METIERS, TAUX_2027 } from "./publication.mjs";
import { GROUPES, HORS_GROUPE, groupe as groupeDuSlug } from "./groupes.mjs";
import { montantsAffiches, plafondContratResponsable, regimeTaux } from "./calcul.mjs";
import {
  contenuGroupe,
  designation,
  euros,
  fourchette,
  ordonner,
  rendreModele,
  typo,
} from "./contenu.mjs";
import {
  ARTICLES_HUB,
  BANDEAU_2027,
  CODE_EXEMPLE,
  ETAT_VIDE,
  FAIT_FOI,
  FAQ,
  METHODE,
  OUTILS_LIES,
} from "./textesHub.mjs";
import {
  PAR_CODE,
  SOURCES,
  contexte,
  donnees,
  entreesDuGroupe,
  groupeDe,
  ouvert,
} from "./entrees.mjs";
import { ancreCode, audit, groupesPublies, pages, redirections, sourcesGroupe } from "./pages.mjs";
import { cleCode, formaterDate, normaliser } from "../socle/texte.mjs";

/** Champs cherchables d'une ligne : même règle que preparerRecherche (socle/recherche.ts). */
const cherchable = (cles, textes) => ({
  cles: [...new Set(cles.filter(Boolean).map(cleCode).filter(Boolean))],
  texte: normaliser(textes.filter(Boolean).join(" ")),
});

/** Aujourd'hui à Paris, AAAA-MM-JJ (la date qui décide de la bascule du 01/01/2027). */
export function aujourdhuiParis(maintenant = new Date()) {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(maintenant);
}

const LPP = SOURCES.get("lpp-cnam-v910");
const VERSION_LPP = LPP?.titre.match(/version (\d+)/)?.[1] ?? "";
const remplirLpp = (t) =>
  t.replace("{version}", VERSION_LPP).replace("{datelpp}", formaterDate(LPP?.date_source ?? ""));

/** Libellés des facettes du hub (textes.md § 1.2). */
const DOMAINES = {
  optique: "Optique",
  audio: "Audio",
  dentaire: "Dentaire",
  pharmacie: "Pharmacie",
};
const PANIERS = { "100-sante": "100 % Santé", libre: "Tarif libre", modere: "Tarif maîtrisé" };

/**
 * Les champs d'une entrée dont la page a besoin pour ses montants (rien d'autre ne part). Après le
 * 01/01/2027 sans taux publié, les montants Sécu de 2026 ne partent même pas dans les données de
 * la page : ni affichés, ni présents dans le HTML.
 */
export function codeAffiche(e, jour, regle = {}) {
  const r = regimeTaux(e, jour, regle.taux2027 ?? TAUX_2027, regle.bascule ?? DATE_BASCULE);
  const anciens = r.etat === "en-vigueur";
  return {
    code: e.code,
    ancre: ancreCode(e),
    libelle: e.libelle,
    designation: designation(e),
    categorie: e.categorie,
    metier: e.metier,
    type_code: e.type_code,
    base_remboursement: e.base_remboursement,
    taux_secu: e.taux_secu,
    rembourse_secu: anciens ? e.rembourse_secu : null,
    ticket_moderateur: anciens ? e.ticket_moderateur : null,
    prix_limite: e.prix_limite,
    panier_100_sante: e.panier_100_sante,
    part_complementaire_au_prix_limite: anciens ? e.part_complementaire_au_prix_limite : null,
    date_tarif: e.date_tarif,
    date_arrete: e.arrete_tarif?.date_arrete ?? null,
  };
}

/** Une source telle qu'elle est affichée : titre et éditeur en typographie française. */
const sourceAffichee = (s) => ({ ...s, titre: typo(s.titre), editeur: typo(s.editeur) });

/** Le mot du prix plafonné selon le métier : prix limite (LPP) ou honoraire limite (dentaire). */
const motPrix = (e) => (e.metier === "dentaire" ? "Honoraire limite" : "Prix limite");

/**
 * La phrase qui date les montants d'une entrée (« chaque montant affiche la date de sa source ») :
 * source de la base et du prix limite, date d'effet du tarif, source du taux.
 */
export function datation(e, jour, regle = {}, effetGroupe = null) {
  const r = regimeTaux(e, jour, regle.taux2027 ?? TAUX_2027, regle.bascule ?? DATE_BASCULE);
  const idBase = e.source_ids.find((id) =>
    ["lpp-cnam-v910", "ameli-dentiste-tarifs-hlf", "bdpm-cis-cip"].includes(id),
  );
  const base = SOURCES.get(idBase);
  const nomBase =
    idBase === "lpp-cnam-v910"
      ? `base LPP de l'Assurance Maladie du ${formaterDate(base.date_source)}`
      : idBase === "ameli-dentiste-tarifs-hlf"
        ? `tableau des honoraires limites de l'Assurance Maladie (ameli, ${formaterDate(base.date_source)})`
        : `base de données publique des médicaments du ${formaterDate(base?.date_source ?? "")}`;
  // Pour un groupe : les dates d'effet de tous ses codes (« L'essentiel », Tarif en vigueur depuis).
  // `effetGroupe === false` (hub) : pas de date d'effet, elle varie d'un code à l'autre.
  const effet =
    effetGroupe === false
      ? ""
      : effetGroupe
        ? `, tarif en vigueur depuis le ${effetGroupe}`
        : e.date_tarif
          ? `, en vigueur depuis le ${formaterDate(e.date_tarif)}`
          : "";
  const taux =
    r.etat === "non-publie"
      ? "part de la Sécurité sociale non affichée : taux 2027 non publié"
      : `taux de ${r.taux} % : ${SOURCES.get(r.sourceId)?.editeur ?? ""}, document du ${formaterDate(SOURCES.get(r.sourceId)?.date_source ?? "")}`;
  return typo(`Montants : ${nomBase}${effet} ; ${taux}.`);
}

/** Le résumé d'une ligne du hub (textes.md § 1.2). */
function resumeLigne(e, mt) {
  const secu =
    mt.regime.etat === "non-publie" ? "Sécu : taux 2027 non publié" : `Sécu ${euros(mt.secu)}`;
  // Un médicament n'a pas de prix limite : son prix public est fixé (base = prix ou TFR).
  if (e.metier === "pharmacie")
    return typo(
      `Base ${euros(mt.base)} · ${secu}${mt.regime.taux !== null ? ` (${mt.regime.taux} %)` : ""}`,
    );
  const prix = mt.prixLimite === null ? "Prix libre" : `${motPrix(e)} ${euros(mt.prixLimite)}`;
  return typo(`Base ${euros(mt.base)} · ${secu} · ${prix}`);
}

/** Le contenu d'une ligne sans page (<details> du hub) : montants, panier, conditions, date. */
function detailsLigne(e, mt, jour, regle) {
  const nonPublie = mt.regime.etat === "non-publie";
  const lignes = [
    ["Désignation", e.metier === "pharmacie" ? e.libelle.replace(" — ", " · ") : e.libelle],
    ["Base de remboursement", euros(mt.base)],
    [
      "Remboursé par la Sécurité sociale",
      nonPublie ? "taux 2027 non publié" : `${euros(mt.secu)} (${mt.regime.taux} %)`,
    ],
    ["Ticket modérateur", nonPublie ? "taux 2027 non publié" : euros(mt.ticketModerateur)],
  ];
  if (e.metier !== "pharmacie")
    lignes.push([motPrix(e), mt.prixLimite === null ? "prix libre" : euros(mt.prixLimite)]);
  if (e.metier === "pharmacie" && e.honoraire_dispensation_boite != null)
    lignes.push([
      "Honoraire de dispensation",
      `${euros(e.honoraire_dispensation_boite)} par boîte, affiché à part`,
    ]);
  if (mt.panier) lignes.push(["Panier", PANIERS[mt.panier] ?? mt.panier]);
  if (mt.complementaireAuPrixLimite !== null)
    lignes.push([
      e.metier === "dentaire"
        ? "Complémentaire à l'honoraire limite"
        : "Complémentaire au prix limite",
      `${euros(mt.complementaireAuPrixLimite)} en contrat responsable, reste à charge 0 €`,
    ]);
  const plafond = mt.panier === "libre" ? plafondContratResponsable(e) : null;
  if (plafond)
    lignes.push([
      "Plafond du contrat responsable",
      `${euros(plafond.montant)}, Sécurité sociale comprise`,
    ]);
  return {
    lignes: lignes.map(([libelle, valeur]) => ({
      libelle: typo(libelle),
      valeur: libelle === "Désignation" ? valeur : typo(valeur),
    })),
    conditions: e.conditions ? typo(e.conditions) : null,
    datation: datation(e, jour, regle),
  };
}

/** Une ligne du hub (LigneHub du socle + son contenu sans page). */
function ligneHub(e, g, publies, jour, regle) {
  const mt = montantsAffiches(e, jour, regle.taux2027, regle.bascule);
  const ancre = ancreCode(e);
  return {
    id: ancre,
    code: e.code,
    // Le libellé officiel ; seul le séparateur ajouté entre médicament et présentation change.
    titre: e.metier === "pharmacie" ? e.libelle.replace(" — ", " · ") : e.libelle,
    resume: resumeLigne(e, mt),
    groupe: g.slug ?? g.id,
    facettes: {
      domaine: [e.metier],
      panier: mt.panier && PANIERS[mt.panier] ? [mt.panier] : [],
    },
    chemin: g.slug && publies.has(g.slug) ? `${OUTIL.chemin}/${g.slug}#${ancre}` : undefined,
    ...cherchable([e.code], [e.libelle, e.categorie, g.nom]),
    details: g.slug && publies.has(g.slug) ? null : detailsLigne(e, mt, jour, regle),
  };
}

/** Le bandeau 2027 du jour (textes.md § 1.3), rendu pour le régime du taux LPP. */
export function bandeau2027(jour, regle = {}) {
  const ctx = { ...contexte(jour, regle) };
  const r = regimeTaux(PAR_CODE.get(CODE_EXEMPLE), jour, ctx.taux2027, ctx.bascule);
  const v =
    r.etat === "en-vigueur"
      ? BANDEAU_2027.avant
      : r.etat === "publie"
        ? BANDEAU_2027.publie
        : BANDEAU_2027.nonPublie;
  return {
    titre: typo(v.titre),
    texte: rendreModele(v.texte, ctx),
    source_ids: [...BANDEAU_2027.source_ids, ...(r.etat === "publie" ? [r.sourceId] : [])],
    etat: r.etat,
  };
}

/** Rend une liste de paragraphes { p, p2027?, source_ids } du jour. */
function paragraphes(liste, ctx) {
  return liste.map((t) => {
    const texte = rendreModele(t.p, ctx) ?? (t.p2027 ? rendreModele(t.p2027, ctx) : null);
    if (texte === null) throw new Error(`Texte sans variante 2027 : « ${t.p.slice(0, 50)}… »`);
    return { texte, source_ids: t.source_ids };
  });
}

/**
 * Le hub, un jour donné.
 * @param {{ site: import("../socle/types").ContexteSite, jour: string, metiers?: typeof METIERS,
 *           taux2027?: typeof TAUX_2027, bascule?: string }} o
 */
export function vueHub({
  site,
  jour,
  metiers = METIERS,
  taux2027 = TAUX_2027,
  bascule = DATE_BASCULE,
}) {
  const regle = { taux2027, bascule };
  const ctx = contexte(jour, regle);
  const publies = new Set(groupesPublies({ metiers }).map((g) => g.slug));
  const hub = pages({ site, metiers })[0];

  // Les lignes : chaque code `sur` d'un métier ouvert, groupe par groupe (ordre de groupes.mjs).
  const lignes = [];
  const groupes = [];
  for (const g of [...GROUPES, ...HORS_GROUPE]) {
    if (!ouvert(g.metier, "liste", metiers)) continue;
    const codes = entreesDuGroupe(g).filter((e) => e.statut === "sur");
    if (!codes.length) continue;
    const ordonnes = g.slug ? ordonner(g, codes) : codes;
    lignes.push(...ordonnes.map((e) => ligneHub(e, g, publies, jour, regle)));
    groupes.push({
      id: g.slug ?? g.id,
      titre: g.nom,
      chemin: g.slug && publies.has(g.slug) ? `${OUTIL.chemin}/${g.slug}` : undefined,
      resume: typo(`base ${fourchette(codes.map((e) => e.base_remboursement))}`),
    });
  }

  // Les sources : celles des lignes affichées et des textes du hub.
  const ids = new Set([
    ...lignes.flatMap((l) => PAR_CODE.get(l.code)?.source_ids ?? []),
    ...METHODE.flatMap((s) => s.p.flatMap((p) => p.source_ids)),
    ...FAQ.flatMap((f) => f.source_ids),
    ...BANDEAU_2027.source_ids,
  ]);
  const b = bandeau2027(jour, regle);
  b.source_ids.forEach((id) => ids.add(id));

  const regimeLpp = regimeTaux(PAR_CODE.get(CODE_EXEMPLE), jour, taux2027, bascule).etat;
  const faq = FAQ.map((f) => {
    const modele =
      f.apres && regimeLpp !== "en-vigueur"
        ? regimeLpp === "publie"
          ? f.apres.publie
          : f.apres.nonPublie
        : f.p;
    const reponse = rendreModele(modele, ctx) ?? (f.p2027 ? rendreModele(f.p2027, ctx) : null);
    if (reponse === null) throw new Error(`FAQ sans variante 2027 : ${f.question}`);
    return { question: typo(f.question), reponse };
  });

  const compte = (facette, valeur) =>
    lignes.filter((l) => l.facettes[facette].includes(valeur)).length;
  const options = (facette, libelles) =>
    Object.entries(libelles)
      .map(([valeur, libelle]) => ({
        valeur,
        libelle: typo(libelle),
        compte: compte(facette, valeur),
      }))
      .filter((o) => o.compte > 0);

  const lpp = LPP?.url ?? "";
  return {
    jour,
    hub,
    bandeau: b,
    datation: datation(PAR_CODE.get(CODE_EXEMPLE), jour, regle, false),
    lignes,
    groupes,
    facettes: { domaine: options("domaine", DOMAINES), panier: options("panier", PANIERS) },
    methode: METHODE.map((s) => ({
      id: s.id,
      titre: typo(s.titre),
      paragraphes: paragraphes(s.p, ctx),
    })),
    faitFoi: typo(remplirLpp(FAIT_FOI)),
    faq,
    sources: donnees.sources.filter((s) => ids.has(s.id)).map(sourceAffichee),
    articles: ARTICLES_HUB.filter((s) => site.articles.has(s)),
    outilsLies: Object.entries(OUTILS_LIES).map(([id, texte]) => ({ id, texte: typo(texte) })),
    etatVide: {
      messages: Object.fromEntries(
        Object.entries(ETAT_VIDE).map(([k, v]) => [k, typo(remplirLpp(v))]),
      ),
      lienLpp: lpp,
      lienBdpm: SOURCES.get("bdpm-cis-cip")?.url ?? "",
      articleDentaire: site.articles.has("dentaire-paniers-100-sante-tiers-payant")
        ? "dentaire-paniers-100-sante-tiers-payant"
        : null,
      dentaireOuvert: ouvert("dentaire", "liste", metiers),
      pharmacieOuverte: ouvert("pharmacie", "liste", metiers),
    },
  };
}

/**
 * Une page de groupe, un jour donné ; ou la redirection d'un code connu ; ou introuvable.
 * @param {string} slug
 * @param {{ site: import("../socle/types").ContexteSite, jour: string, metiers?: typeof METIERS,
 *           taux2027?: typeof TAUX_2027, bascule?: string }} o
 */
export function vueEntree(
  slug,
  { site, jour, metiers = METIERS, taux2027 = TAUX_2027, bascule = DATE_BASCULE },
) {
  const page = pages({ site, metiers }).find((p) => p.type === "entree" && p.slug === slug);
  if (!page) {
    const vers = redirections({ site, metiers })[slug];
    return vers ? { type: "redirection", vers } : { type: "introuvable" };
  }
  const regle = { taux2027, bascule };
  const ctx = contexte(jour, regle);
  const g = groupeDuSlug(slug);
  const bruts = entreesDuGroupe(g);
  const contenu = contenuGroupe(g, bruts, ctx);
  const publies = new Set(groupesPublies({ metiers }).map((x) => x.slug));
  const a = audit({ site, metiers }).find((x) => x.chemin === page.chemin);
  const b = bandeau2027(jour, regle);

  const voisins = a.voisins.map((chemin) => {
    const v = groupeDuSlug(chemin.split("/").at(-1));
    const cs = entreesDuGroupe(v);
    return {
      chemin,
      titre: v.nom,
      resume: typo(`${cs.length} codes · base ${fourchette(cs.map((e) => e.base_remboursement))}`),
    };
  });

  return {
    type: "page",
    jour,
    regle,
    page,
    groupe: { slug: g.slug, nom: g.nom, metier: g.metier, surTitre: typo(g.surTitre) },
    reponse: contenu.reponse,
    essentiel: contenu.essentiel,
    intertitres: contenu.intertitres,
    tranches: contenu.tranches,
    paragraphes: contenu.paragraphes,
    conditions: contenu.conditions,
    limites: contenu.limites,
    codes: contenu.codes.map((e) => ({
      ...codeAffiche(e, jour, regle),
      datation: datation(e, jour, regle),
    })),
    datation: datation(
      contenu.codes[0],
      jour,
      regle,
      contenu.essentiel.find((l) => l.libelle === "Tarif en vigueur depuis")?.valeur,
    ),
    faitFoi: typo(remplirLpp(FAIT_FOI)),
    bandeau: b,
    sources: sourcesGroupe(g, bruts, b.source_ids).map(sourceAffichee),
    voisins,
    articles: a.articles,
    outilsLies: (g.outilsLies ?? []).map((id) => ({ id, texte: typo(OUTILS_LIES[id]) })),
    publie: publies.has(slug),
  };
}
