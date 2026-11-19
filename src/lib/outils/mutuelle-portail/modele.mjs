// Ce que les pages de l'outil C affichent, construit à partir de donnees.json (via pages.mjs) :
// les 54 lignes du hub, et le contenu d'une page d'entrée. ESM pur, sans dépendance de l'app :
// importé par serveur.ts (handlers createServerFn, hors du bundle client) et par les tests.
// Les décisions de publication restent celles de pages.mjs (les mêmes que le sitemap).
import { OUTIL } from "./outil.mjs";
import {
  ENTREES,
  HUB,
  SOURCES,
  acquisDe,
  articlesDe,
  audit,
  entree,
  ficheDe,
  lastmodDe,
  pages,
  redirections,
  slugsPublies,
  sourcesPage,
  voisinsDe,
} from "./pages.mjs";
import { A_CONFIRMER_VISIBLE, FICHES_OPERATEURS, OPERATEURS_FILTRE } from "./publication.mjs";
import {
  LISTES,
  METIERS_C,
  NOM_METIER,
  RESTRICTIONS,
  TABLE_METIERS,
  enumerer,
  fr,
  grouper,
  lettre,
  libellesDe,
  listeMetiers,
  metierFacette,
  metiersSite,
  metiersSurs,
  principauxSurs,
  texteCherchable,
} from "./releve.mjs";
import {
  avertissement,
  dateReleve,
  parOperateur,
  phrases,
  raisonAConfirmer,
  reponse,
} from "./redaction.mjs";
import { IDS_METIERS } from "../socle/metiers.mjs";
import { cleCode, formaterDate, normaliser } from "../socle/texte.mjs";

const visible = (f) => f.statut === "sur" || A_CONFIRMER_VISIBLE;
const courtRestriction = (r) => (r ? (RESTRICTIONS[r]?.court ?? r) : null);
const IDS_FILTRE = new Set(OPERATEURS_FILTRE.map(([id]) => id));

/** Comment une source a été lue (BlocSources du hub et des pages, cadre.md § 4). */
export function mentionAcces(s) {
  const a = s.acces ?? "";
  if (a.startsWith("extraits de la page")) return "extraits de la page seulement, date inconnue";
  if (a.startsWith("texte intégral")) return "texte intégral lu, le site refusant l’accès direct";
  if (a.startsWith("direct")) return "lu en direct";
  return undefined;
}

/** Une source telle que les composants du socle l'attendent (sans le champ `acces`). */
const source = (s) => ({
  id: s.id,
  titre: fr(s.titre),
  url: s.url,
  editeur: fr(s.editeur),
  date_source: fr(s.date_source),
  consulte_le: s.consulte_le,
});

export const MENTIONS = Object.fromEntries(
  [...SOURCES.values()].map((s) => [s.id, mentionAcces(s)]).filter(([, m]) => m),
);

/** État lisible d'un fait (colonne « État »). */
function etatDe(f) {
  if (f.statut !== "sur") return "à confirmer sur la carte";
  if (f.liste) return f.depuis ? `relevé, ouvert depuis le ${f.depuis}` : "relevé";
  const s = SOURCES.get(f.sourceIds[0]);
  const date = /^\d{4}-\d\d-\d\d/.test(s?.date_source ?? "")
    ? ` (${formaterDate(s.date_source)})`
    : "";
  return fr(`relevé d’après ${s?.editeur ?? "la source"}${date}`);
}

/** Les lignes de sous-domaine d'un fait, en clair. */
function sousDomainesDe(f) {
  if (!f.sousDomaines.length) return null;
  if (f.avecLigneLibre) {
    const tous = f.metier === "dentaire" ? "tous les dentistes" : "tout le métier";
    return fr(`${tous}, et une ligne ${enumerer(f.sousDomaines)}`);
  }
  return fr(`sous-domaines listés : ${enumerer(f.sousDomaines)}`);
}

/** Les lignes du tableau « Portail par métier » : chaque fait affichable, métier par métier. */
function lignesPortail(faits) {
  const lignes = new Map();
  for (const f of faits.filter(visible)) {
    const l = {
      id: f.id,
      metier: NOM_METIER[f.metier],
      cleMetier: f.metier,
      metierSite: metierFacette(f),
      operateur: fr(f.operateur),
      operateurId: f.operateurId,
      portail: f.statut === "sur" && /^https:\/\//.test(f.portail ?? "") ? f.portail : null,
      statut: f.statut,
      libelles: f.libelle ? [{ libelle: f.libelle, amc: f.amc }] : [],
      segments: f.nomsSegments,
      etat: etatDe(f),
      sousDomaines: sousDomainesDe(f),
      restriction: courtRestriction(f.restriction),
      raison: f.statut === "sur" ? null : raisonAConfirmer(f),
      sourceIds: f.sourceIds,
    };
    // Plusieurs libellés d'un même opérateur, au même état, pour un même métier : une seule ligne
    // (Mutualia : sept libellés iSanté en optique), les libellés listés dans la cellule.
    const cle = [
      l.cleMetier,
      l.operateur,
      l.statut,
      l.etat,
      l.restriction,
      l.sousDomaines,
      l.raison,
      l.sourceIds.join(","),
    ].join("|");
    const deja = lignes.get(cle);
    if (!deja) lignes.set(cle, l);
    else {
      for (const x of l.libelles)
        if (!deja.libelles.some((y) => y.libelle === x.libelle && y.amc === x.amc))
          deja.libelles.push(x);
      deja.segments = [...new Set([...deja.segments, ...l.segments])];
    }
  }
  return [...lignes.values()];
}

/** Les faits « à confirmer », regroupés par opérateur et raison (paragraphe sous le tableau). */
function aConfirmerDe(faits) {
  if (!A_CONFIRMER_VISIBLE) return [];
  return grouper(
    faits.filter((f) => f.statut !== "sur"),
    (f) => `${f.operateur}|${f.restriction ?? ""}|${raisonAConfirmer(f)}`,
  ).map((g) => ({
    metiers: listeMetiers(g.metiers),
    operateur: fr(g.faits[0].operateur),
    restriction: courtRestriction(g.faits[0].restriction),
    raison: raisonAConfirmer(g.faits[0]),
  }));
}

/**
 * Les lignes du tableau fusionnées pour la ligne dépliée du hub : un même opérateur, un même libellé,
 * un même état sur plusieurs métiers tiennent en une ligne (« Optique, audio, dentaire »). Sept lignes
 * identiques sont illisibles à 375 px, et pèsent dans le HTML du hub.
 */
function lignesFusionnees(lignes) {
  const cle = (l) =>
    [
      l.operateur,
      l.libelles.map((x) => `${x.libelle}/${x.amc}`).join(","),
      l.statut,
      l.etat,
      l.restriction,
      l.sousDomaines,
      l.raison,
      l.sourceIds.join(","),
    ].join("|");
  const groupes = new Map();
  for (const l of lignes) {
    if (!groupes.has(cle(l))) groupes.set(cle(l), []);
    groupes.get(cle(l)).push(l);
  }
  return [...groupes.values()].map((ls) => ({
    ...ls[0],
    id: ls[0].id,
    metier: listeMetiers([...new Set(ls.map((l) => l.cleMetier))]),
    segments: [...new Set(ls.flatMap((l) => l.segments))],
  }));
}

/**
 * Le relevé complet d'une mutuelle : sur la page d'entrée, une ligne de tableau par métier et les
 * phrases du relevé (comptées pour le seuil) ; dans la ligne dépliée du hub (`hub: true`), les lignes
 * fusionnées, qui disent la même chose sans les phrases.
 */
export function releveDe(x, { hub = false } = {}) {
  const { e, faits } = x;
  const presents = new Set(faits.filter(visible).map((f) => f.metier));
  const p = phrases(e, faits);
  const lignes = lignesPortail(faits);
  return {
    slug: e.slug,
    nom: fr(e.mutuelle),
    phrases: hub ? { ...p, releve: [], restrictions: [] } : p,
    aConfirmer: aConfirmerDe(faits),
    lignes: hub ? lignesFusionnees(lignes) : lignes,
    sansSource: METIERS_C.filter((m) => !presents.has(m)).map((m) => NOM_METIER[m]),
    // Date du relevé : la consultation des sources des métiers sûrs, sinon la vérification de l'entrée.
    releveLe: dateReleve(faits, SOURCES) ?? formaterDate(lastmodDe(e)),
    sourceIds: sourcesPage(x).map((s) => s.id),
  };
}

/** Les opérateurs relevés d'un ensemble de faits d'un même métier : « SP santé ou iSanté ». */
const operateursDe = (fs) => [...new Set(fs.map((f) => fr(f.operateur)))].join(" ou ");

/** Le résumé d'une ligne du hub (textes.md § 1.2). */
export function apercuDe(faits) {
  const surs = faits.filter((f) => f.statut === "sur");
  const parMetierSur = METIERS_C.map((m) => ({ m, fs: surs.filter((f) => f.metier === m) })).filter(
    (x) => x.fs.length,
  );
  const groupesSurs = grouper(
    parMetierSur.map((x) => ({ metier: x.m, cle: operateursDe(x.fs) })),
    (x) => x.cle,
  ).map((g) => ({ metiers: listeMetiers(g.metiers), operateur: g.cle }));
  const aVerifier = A_CONFIRMER_VISIBLE
    ? faits.filter((f) => f.rang === 0 && f.statut !== "sur")
    : [];
  const groupesAV = grouper(aVerifier, (f) => `${f.operateur}|${f.restriction ?? ""}`).map((g) => ({
    metiers: listeMetiers(g.metiers),
    operateur: fr(g.faits[0].operateur),
    restriction: courtRestriction(g.faits[0].restriction),
  }));
  // Filtre métier posé : seulement les métiers de C de ce métier du site.
  const parMetier = {};
  for (const ms of IDS_METIERS) {
    const cles = METIERS_C.filter((m) => (TABLE_METIERS[m] ?? m) === ms);
    const morceaux = [];
    for (const m of cles) {
      const fsSurs = surs.filter((f) => f.metier === m);
      const principal = faits.find((f) => f.metier === m && f.rang === 0);
      if (fsSurs.length) {
        const libs = libellesDe(fsSurs);
        morceaux.push({
          metier: m,
          operateur: operateursDe(fsSurs),
          libelle:
            libs.length === 1
              ? libs[0].libelle
              : libs.length > 1
                ? `${libs.length} libellés`
                : null,
          statut: "sur",
          restriction: null,
        });
      } else if (principal && visible(principal) && metierFacette(principal)) {
        morceaux.push({
          metier: m,
          operateur: fr(principal.operateur),
          libelle: null,
          statut: "a_verifier",
          restriction: courtRestriction(principal.restriction),
        });
      }
    }
    const fusion = grouper(
      morceaux,
      (x) => `${x.operateur}|${x.libelle ?? ""}|${x.statut}|${x.restriction ?? ""}`,
    ).map((g) => ({
      metiers: listeMetiers(g.metiers),
      operateur: g.faits[0].operateur,
      libelle: g.faits[0].libelle,
      statut: g.faits[0].statut,
      restriction: g.faits[0].restriction,
    }));
    if (fusion.length) parMetier[ms] = fusion;
  }
  return { surs: groupesSurs, aConfirmer: groupesAV, parMetier };
}

/** Le résumé en une chaîne (voisins d'une page). */
export function apercuTexte(faits) {
  const a = apercuDe(faits);
  if (!a.surs.length) return "Pas de source publique datée pour l’instant";
  return a.surs.map((g) => fr(`${g.metiers} : ${g.operateur}`)).join(" · ");
}

/** Une ligne du hub. */
function ligneDe(x, site, publies) {
  const { e, faits } = x;
  const fiche = ficheDe(e.slug, site);
  const lien = publies.has(e.slug) ? "page" : fiche ? "fiche" : null;
  const affiches = faits.filter(visible);
  const amcs = libellesDe(faits).map((l) => l.amc);
  // Colonne « code » de la ligne : le numéro AMC relevé (sûr), ou leur nombre s'il y en a plusieurs.
  const amcsSurs = [
    ...new Set(libellesDe(faits.filter((f) => f.statut === "sur")).map((l) => l.amc)),
  ];
  return {
    id: e.slug,
    code:
      amcsSurs.length === 1
        ? amcsSurs[0]
        : amcsSurs.length > 1
          ? `${amcsSurs.length} numéros AMC`
          : undefined,
    titre: fr(e.mutuelle),
    nom: fr(e.mutuelle),
    groupe: `lettre-${lettre(e.mutuelle).toLowerCase()}`,
    facettes: {
      metier: [...new Set(affiches.map(metierFacette).filter(Boolean))],
      operateur: [
        ...new Set(affiches.map((f) => f.operateurId).filter((id) => IDS_FILTRE.has(id))),
      ],
      // Métier et opérateur posés ensemble (recherche.ts, filtresListe) : seulement les couples sûrs.
      couple: [
        ...new Set(
          faits
            .filter((f) => f.statut === "sur" && metierFacette(f) && IDS_FILTRE.has(f.operateurId))
            .map((f) => `${metierFacette(f)}@${f.operateurId}`),
        ),
      ],
    },
    chemin:
      lien === "page"
        ? `${OUTIL.chemin}/${e.slug}`
        : lien === "fiche"
          ? `/ressources/${fiche}`
          : undefined,
    cles: [...new Set(amcs.map(cleCode).filter(Boolean))],
    texte: normaliser(texteCherchable(e, faits)),
    lien,
    apercu: apercuDe(faits),
    details: lien ? null : releveDe(x, { hub: true }),
  };
}

/** Tout ce que le hub affiche. @param {import("../socle/types").ContexteSite} site */
export function modeleHub(site) {
  const hub = pages({ site })[0];
  const publies = slugsPublies({ site });
  const lignes = ENTREES.map((x) => ligneDe(x, site, publies)).sort((a, b) =>
    normaliser(a.nom).localeCompare(normaliser(b.nom), "fr"),
  );
  const lettres = [...new Set(lignes.map((l) => l.groupe))];
  const groupes = lettres.map((id) => ({ id, titre: id.slice("lettre-".length).toUpperCase() }));
  const listes = Object.keys(LISTES).map((id) => source(SOURCES.get(id)));
  const autres = [...SOURCES.values()]
    .filter((s) => !Object.hasOwn(LISTES, s.id))
    .map(source)
    .sort(
      (a, b) => a.editeur.localeCompare(b.editeur, "fr") || a.titre.localeCompare(b.titre, "fr"),
    );
  const operateurs = OPERATEURS_FILTRE.map(([valeur, libelle]) => ({
    valeur,
    libelle,
    compte: lignes.filter((l) => l.facettes.operateur.includes(valeur)).length,
  })).filter((o) => o.compte > 0);
  const nomsOperateurs = Object.fromEntries(OPERATEURS_FILTRE);
  const fichesOperateurs = Object.entries(FICHES_OPERATEURS)
    .filter(([, fiche]) => site.articles.has(fiche))
    .map(([id, fiche]) => ({ nom: nomsOperateurs[id] ?? id, chemin: `/ressources/${fiche}` }));
  return {
    hub,
    lignes,
    groupes,
    groupesSources: [
      { titre: "Les deux listes publiques par domaine", sources: listes },
      {
        titre: "Pages des complémentaires, des opérateurs et presse professionnelle",
        sources: autres,
      },
    ],
    mentions: MENTIONS,
    operateurs,
    fichesOperateurs,
    releveListes: formaterDate(SOURCES.get("isante-liste-amc").consulte_le),
  };
}

/** Phrases « Vérifier sur la carte {opérateur} » (textes.md § 3.4), avec leur source. */
export const VERIFICATIONS = {
  "sp-sante": {
    texte:
      "Seules les dépenses qui portent la mention « SP » sur l’attestation sont prises en charge par SP santé.",
    sourceId: "sp-presentation",
  },
  isante: {
    texte: "Pour la télétransmission, iSanté indique un numéro unique : 00733931.",
    sourceId: "isante-faq",
  },
  viamedis: {
    texte: "Prises en charge et factures sur viamedis.net ; conventionnement sur viamedispro.com.",
    sourceId: "hm-contacts",
  },
  "carte-blanche": {
    texte: "Prises en charge sur pec.carteblanchepartenaires.fr.",
    sourceId: "sl-tp",
  },
};

/** Le contenu d'une page d'entrée, ou la redirection, ou rien. */
export function modeleEntree(slug, site) {
  const page = pages({ site }).find((p) => p.type === "entree" && p.slug === slug);
  if (!page) {
    const vers = redirections({ site })[slug];
    return vers ? { type: "redirection", vers } : { type: "introuvable" };
  }
  const x = entree(slug);
  const { e, faits } = x;
  const publies = slugsPublies({ site });
  const ops = [...new Set(principauxSurs(faits).map((f) => f.operateurId))];
  const verifications = ops
    .filter((id) => VERIFICATIONS[id])
    .map((id) => ({
      operateur: fr(principauxSurs(faits).find((f) => f.operateurId === id).operateur),
      texte: fr(VERIFICATIONS[id].texte),
      sourceId: VERIFICATIONS[id].sourceId,
    }));
  const sources = sourcesPage(
    x,
    verifications.map((v) => v.sourceId),
  ).map(source);
  const a = audit({ site }).find((l) => l.chemin === page.chemin);
  const surs = faits.filter((f) => f.statut === "sur");
  const libs = libellesDe(surs);
  const reseaux = (e.reseau_soins ?? []).filter((r) => r.statut === "sur");
  const essentiel = [
    {
      libelle: "Portail ou opérateur",
      valeurs: [...parOperateur(faits)].map(([op, ms]) =>
        fr(`${op} (${ms.map((m) => NOM_METIER[m].toLowerCase()).join(", ")})`),
      ),
    },
    // Un libellé : « Libellé relevé » puis « Numéro AMC » ; plusieurs : chaque libellé avec son numéro.
    libs.length > 1
      ? {
          libelle: `Libellés relevés et numéros AMC : ${libs.length}`,
          valeurs: libs.map((l) => `${l.libelle} · ${l.amc}`),
        }
      : libs.length === 1
        ? { libelle: "Libellé relevé", valeurs: [fr(`« ${libs[0].libelle} »`)] }
        : null,
    libs.length === 1 ? { libelle: "Numéro AMC", valeurs: [libs[0].amc] } : null,
    reseaux.length
      ? {
          libelle: "Réseau de soins",
          valeurs: reseaux.map((r) =>
            fr(`${r.nom} (${r.metiers.map((m) => NOM_METIER[m].toLowerCase()).join(", ")})`),
          ),
        }
      : null,
    { libelle: "Relevé le", valeurs: [dateReleve(faits, SOURCES)] },
  ]
    .filter(Boolean)
    .map((l) => ({ libelle: fr(l.libelle), valeurs: l.valeurs }));
  const voisins = voisinsDe(x, publies, site);
  const unSeulOp = ops.length === 1 && voisins.every((v) => v.memeOperateur);
  const nomOp = unSeulOp ? fr(principauxSurs(faits)[0].operateur) : null;
  return {
    type: "page",
    page,
    audit: { ...a, sources },
    surTitre:
      e.type === "gestionnaire"
        ? "Gestionnaire de tiers payant"
        : `Complémentaire santé${e.groupe ? ` · ${e.groupe}` : ""}`,
    reponse: reponse(e, faits, SOURCES),
    metiers: metiersSite(metiersSurs(faits)),
    essentiel,
    avertissement: avertissement(e),
    releve: releveDe(x),
    verifications,
    voisins: {
      titre: nomOp ? fr(`Autres complémentaires chez ${nomOp}`) : "Complémentaires voisines",
      entrees: voisins.map((v) => {
        const y = entree(v.slug);
        return { chemin: v.chemin, titre: fr(y.e.mutuelle), resume: apercuTexte(y.faits) };
      }),
    },
    mentions: MENTIONS,
  };
}

/** Pour les tests : les faits affichés comme acquis sur une page (audit). */
export { acquisDe, articlesDe };
