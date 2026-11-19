// Le contenu des pages de l'outil B · Remboursement, fabriqué à partir de donnees.json et des textes
// de groupes.mjs : réponse, « L'essentiel », paragraphe des tranches, textes sourcés, conditions.
// Fonctions pures (aucun import de donnees.json) : la page, pages.mjs (seuil de contenu) et les
// tests appellent les mêmes, donc le texte compté est le texte rendu.
//
// Les montants passent tous par montantsAffiches (calcul.mjs) : à partir du 01/01/2027, sans taux
// publié, aucun montant Sécu n'est écrit (réponse, essentiel, paragraphes : variantes « 2027 »).
import { montantsAffiches, plafondContratResponsable } from "./calcul.mjs";
import { LIMITES_CALCUL, PHRASE_2027 } from "./groupes.mjs";
import { formaterDate } from "../socle/texte.mjs";
import { capitale, euros, typo } from "./format.mjs";

export { capitale, euros, typo };

/** Valeurs distinctes, triées. @param {number[]} vs */
const distinctes = (vs) =>
  [...new Set(vs.map((v) => Math.round(v * 100)))].sort((a, b) => a - b).map((c) => c / 100);

/**
 * « 9,75 € », « 400 € ou 1 400 € », « 9,75 € à 35,25 € » selon le nombre de valeurs distinctes.
 * @param {number[]} vs
 */
export function fourchette(vs) {
  const d = distinctes(vs);
  if (!d.length) return "";
  if (d.length === 1) return euros(d[0]);
  if (d.length === 2) return `${euros(d[0])} ou ${euros(d[1])}`;
  return `${euros(d[0])} à ${euros(d.at(-1))}`;
}

/** « de 9,75 € à 35,25 € » (phrases) ; une seule valeur : « de 9,75 € ». */
export function deA(vs) {
  const d = distinctes(vs);
  return d.length === 1 ? `de ${euros(d[0])}` : `de ${euros(d[0])} à ${euros(d.at(-1))}`;
}

/**
 * Désignation d'un verre sans son préfixe (« OPTIQUE, VERRE UNIFOCAL CLASSE A, SPHERE] 0 A -2,00] »
 * → « SPHERE] 0 A -2,00] ») ; pour les autres codes, le libellé sans « OPTIQUE, » ni point final.
 * Le texte officiel n'est pas réécrit (textes.md § 3.5).
 * @param {{ libelle: string }} e
 */
export function designation(e) {
  const l = e.libelle.trim();
  const verre = l.match(
    /^OPTIQUE,\s*VERRE (?:UNIFOCAL|MULTIFOCAL|PROGRESSIF) CLASSE [AB],\s*(.+)$/,
  );
  if (verre) return verre[1].trim();
  return l
    .replace(/^OPTIQUE,\s*/, "")
    .replace(/\.$/, "")
    .trim();
}

/** Âge maximal inscrit dans la base LPP, lu dans `conditions` (« … : 15 ans. »). */
function ageMax(e) {
  const m = (e.conditions ?? "").match(/Âge maximal inscrit dans la base LPP : (\d+) ans/);
  return m ? `${m[1]} ans` : null;
}

// ── Repères des textes (groupes.mjs) ─────────────────────────────────────────

/** Repères qui donnent un montant Sécu : absents des variantes « 2027 ». */
export const REPERES_SECU = ["secu", "tm", "compl", "taux", "datetaux", "secumin", "secumax"];
const REPERE = /\{(\w+)(?::([\w+]+))?\}/g;

/** Les repères d'un modèle : [{ nom, arg }]. @param {string} modele */
export const reperes = (modele) =>
  [...modele.matchAll(REPERE)].map((m) => ({ nom: m[1], arg: m[2] }));

/** Le modèle a-t-il un montant Sécu ? @param {string} modele */
export const aMontantSecu = (modele) => reperes(modele).some((r) => REPERES_SECU.includes(r.nom));

/**
 * Remplace les repères d'un modèle par les valeurs de donnees.json, un jour donné. Renvoie null si
 * un montant Sécu est demandé alors que le taux n'est pas publié (l'appelant prend la variante
 * « 2027 »). Lève une erreur sur un repère ou un code inconnu (le build et les tests s'arrêtent).
 * @param {string} modele
 * @param {{ codes: Map<string, any>, groupe?: any[], jour: string, taux2027: any, bascule: string, n?: number, verifieLe?: string }} ctx
 */
export function rendreModele(modele, ctx) {
  const m = (code) => {
    const e = ctx.codes.get(code);
    if (!e) throw new Error(`Repère vers un code inconnu : ${code} (« ${modele.slice(0, 60)}… »)`);
    return { e, mt: montantsAffiches(e, ctx.jour, ctx.taux2027, ctx.bascule) };
  };
  const montantsGroupe = () =>
    (ctx.groupe ?? []).map((e) => montantsAffiches(e, ctx.jour, ctx.taux2027, ctx.bascule));
  let manque = false;
  // Les textes sont mis en typographie avant d'insérer les valeurs (désignations officielles intactes).
  const texte = typo(modele).replace(REPERE, (_, nom, arg) => {
    const val = (v) => {
      if (v === null || v === undefined) {
        if (REPERES_SECU.includes(nom)) manque = true;
        else throw new Error(`Repère {${nom}:${arg}} sans valeur dans les données`);
        return "";
      }
      return v;
    };
    switch (nom) {
      case "base":
        return euros(m(arg).mt.base);
      case "plv":
        return val(m(arg).mt.prixLimite === null ? null : euros(m(arg).mt.prixLimite));
      case "secu":
        return val(m(arg).mt.secu === null ? null : euros(m(arg).mt.secu));
      case "tm":
        return val(m(arg).mt.ticketModerateur === null ? null : euros(m(arg).mt.ticketModerateur));
      case "compl":
        return val(
          m(arg).mt.complementaireAuPrixLimite === null
            ? null
            : euros(m(arg).mt.complementaireAuPrixLimite),
        );
      case "plafond": {
        const p = plafondContratResponsable(m(arg).e);
        return val(p ? euros(p.montant) : null);
      }
      case "date":
        return val(m(arg).e.date_tarif ? formaterDate(m(arg).e.date_tarif) : null);
      case "age":
        return val(ageMax(m(arg).e));
      case "desig":
        return designation(m(arg).e);
      case "total": {
        const plvs = arg.split("+").map((c) => m(c).mt.prixLimite);
        return val(
          plvs.some((v) => v === null)
            ? null
            : euros(plvs.reduce((a, b) => a + Math.round(b * 100), 0) / 100),
        );
      }
      case "taux": {
        if (arg) return val(m(arg).mt.regime.taux);
        const t = [...new Set(montantsGroupe().map((x) => x.regime.taux))];
        if (t.length > 1) throw new Error("{taux} : plusieurs taux dans le groupe");
        return val(t[0] ?? null);
      }
      case "datetaux": {
        // « au 18/11/2026 » (taux en vigueur, date de vérification) ou « depuis le 01/01/2027 ».
        const r = m(arg).mt.regime;
        if (r.etat === "non-publie") return val(null);
        return r.etat === "publie"
          ? `depuis le ${formaterDate(r.depuis)}`
          : `au ${formaterDate(ctx.verifieLe)}`;
      }
      case "verifie":
        return val(ctx.verifieLe ? formaterDate(ctx.verifieLe) : null);
      case "secumin":
      case "secumax": {
        const s = montantsGroupe().map((x) => x.secu);
        if (s.some((v) => v === null)) return val(null);
        const d = distinctes(s);
        return euros(nom === "secumin" ? d[0] : d.at(-1));
      }
      case "n":
        return String(ctx.n ?? ctx.groupe?.length ?? "");
      default:
        throw new Error(`Repère inconnu : {${nom}}`);
    }
  });
  return manque ? null : texte;
}

// ── Contenu d'un groupe ──────────────────────────────────────────────────────

/** Les codes d'un groupe, dans l'ordre du tableau : verres par base puis code, sinon par catégorie. */
export function ordonner(g, codes) {
  const rang = (e) => g.categories.indexOf(e.categorie);
  return [...codes].sort((a, b) =>
    g.forme === "verres"
      ? a.base_remboursement - b.base_remboursement || a.code.localeCompare(b.code)
      : rang(a) - rang(b) || a.code.localeCompare(b.code),
  );
}

const panierUnique = (codes) => {
  const p = [...new Set(codes.map((e) => e.panier_100_sante ?? null))];
  return p.length === 1 ? p[0] : "mixte";
};

/** Ce que doit au moins un contrat responsable, pour un ensemble de codes du même panier. */
function resteACharge(codes, mts, { avecTicket = false } = {}) {
  const p = panierUnique(codes);
  if (p === "100-sante") return "0 € jusqu'au prix limite";
  if (p === "libre" || p === "modere") {
    const plafonds = [...new Set(codes.map((e) => plafondContratResponsable(e)?.montant ?? null))];
    const plafond =
      plafonds.length === 1 && plafonds[0] !== null
        ? `, plafond ${euros(plafonds[0])} Sécurité sociale comprise`
        : "";
    const tms = [...new Set(mts.map((m) => m.ticketModerateur))];
    const ticket =
      avecTicket && tms.length === 1 && tms[0] !== null
        ? `, au moins le ticket modérateur (${euros(tms[0])}) couvert`
        : "";
    return `selon le contrat${ticket}${plafond}`;
  }
  if (p === null) return "panier non précisé dans la base LPP";
  throw new Error(
    `reste à charge : paniers mêlés (${codes.map((e) => e.code).join(", ")}), découpez en parties`,
  );
}

/** « 07/07/2023 (arrêté du 03/07/2023) » ; d'autres dates éventuelles : « ; {catégorie} : … ». */
function dateTarif(codes) {
  const parDate = new Map();
  for (const e of codes) {
    const cle = `${e.date_tarif}|${e.arrete_tarif?.date_arrete ?? ""}`;
    if (!parDate.has(cle)) parDate.set(cle, []);
    parDate.get(cle).push(e);
  }
  const lignes = [...parDate.entries()].sort((a, b) => b[1].length - a[1].length);
  const texte = ([cle]) => {
    const [d, a] = cle.split("|");
    return `${formaterDate(d)}${a ? ` (arrêté du ${formaterDate(a)})` : ""}`;
  };
  return [
    texte(lignes[0]),
    ...lignes
      .slice(1)
      .map((l) => `${[...new Set(l[1].map((e) => e.categorie))].join(", ")} : ${texte(l)}`),
  ].join(" ; ");
}

/** Valeur d'une ligne de « L'essentiel », par parties si le groupe en déclare. */
function parParties(parties, codes, rendu) {
  if (!parties) return rendu(codes);
  return parties
    .map((p) => {
      const sous = codes.filter((e) => p.categories.includes(e.categorie));
      if (!sous.length) throw new Error(`partie « ${p.libelle} » sans code`);
      return `${p.libelle} : ${rendu(sous)}`;
    })
    .join(" · ");
}

/**
 * Le contenu propre d'une page de groupe, un jour donné : la réponse (2 phrases), « L'essentiel »
 * (5 lignes), le paragraphe des tranches, les textes sourcés, les conditions.
 * @param {any} g groupe de groupes.mjs
 * @param {any[]} codesBruts entrées de donnees.json du groupe
 * @param {{ codes: Map<string, any>, jour: string, taux2027: any, bascule: string }} ctx
 */
export function contenuGroupe(g, codesBruts, ctx) {
  const codes = ordonner(g, codesBruts);
  const c = { ...ctx, groupe: codes, n: codes.length };
  const mts = codes.map((e) => montantsAffiches(e, ctx.jour, ctx.taux2027, ctx.bascule));
  const regimes = [...new Set(mts.map((m) => m.regime.etat))];
  if (regimes.length !== 1) throw new Error(`${g.slug} : régimes de taux mêlés`);
  const regime = mts[0].regime;
  const nonPublie = regime.etat === "non-publie";
  const panier = panierUnique(codes);
  const n = codes.length;

  // Réponse (textes.md § 3.2).
  let reponse;
  if (g.forme === "verres" && panier === "100-sante") {
    reponse = nonPublie
      ? [
          typo(PHRASE_2027),
          typo(
            `La base reste ${deA(codes.map((e) => e.base_remboursement))} et le prix limite ${deA(codes.map((e) => e.prix_limite))} ; en contrat responsable, le patient ne paie rien jusqu'à ce prix.`,
          ),
        ]
      : [
          typo(
            `La Sécurité sociale rembourse ${regime.taux} % de la base, soit ${deA(mts.map((m) => m.secu))} par verre selon la correction.`,
          ),
          typo(
            `En contrat responsable, la complémentaire paie le reste jusqu'au prix limite (${fourchetteA(codes.map((e) => e.prix_limite))}) : le patient ne paie rien.`,
          ),
        ];
  } else if (g.forme === "verres" && panier === "libre") {
    const base = fourchette(codes.map((e) => e.base_remboursement));
    reponse = nonPublie
      ? [
          typo(PHRASE_2027),
          typo(
            `La base reste de ${base} par verre ; au-delà, la prise en charge dépend du contrat.`,
          ),
        ]
      : [
          typo(
            `La base est de ${base} par verre, quelle que soit la correction : la Sécurité sociale rembourse ${fourchette(mts.map((m) => m.secu))}.`,
          ),
          typo(
            `Au-delà, la prise en charge dépend du contrat ; un contrat responsable couvre au moins le ticket modérateur (${fourchette(mts.map((m) => m.ticketModerateur))}).`,
          ),
        ];
  } else if (g.reponse) {
    reponse = nonPublie
      ? [typo(PHRASE_2027), ...g.reponse.nonPublie.map((t) => rendreModele(t, c))]
      : g.reponse.connu.map((t) => rendreModele(t, c));
    if (reponse.some((t) => t === null))
      throw new Error(`${g.slug} : réponse avec un montant Sécu manquant`);
  } else throw new Error(`${g.slug} : pas de réponse (forme « ${g.forme} », panier « ${panier} »)`);

  // L'essentiel (textes.md § 3.3).
  const valeurBase = (sous) => {
    const v = fourchette(sous.map((e) => e.base_remboursement));
    return !g.parties?.base &&
      distinctes(sous.map((e) => e.base_remboursement)).length === 1 &&
      sous.length > 1
      ? `${v} (les ${sous.length} codes)`
      : v;
  };
  const valeurPrix = (sous) => {
    const avec = sous.filter((e) => e.prix_limite !== null);
    if (!avec.length) return "prix libre";
    const v = fourchette(avec.map((e) => e.prix_limite));
    return avec.length === sous.length ? v : `${v} ; prix libre pour les autres codes`;
  };
  const tauxTexte = nonPublie
    ? "taux 2027 non publié"
    : regime.jusquau
      ? `${regime.taux} % (jusqu'au ${formaterDate(regime.jusquau)})`
      : regime.depuis
        ? `${regime.taux} % (depuis le ${formaterDate(regime.depuis)})`
        : `${regime.taux} %`;
  const essentiel = [
    { libelle: "Base de remboursement", valeur: parParties(g.parties?.base, codes, valeurBase) },
    { libelle: "Taux Sécu", valeur: tauxTexte },
    {
      libelle: "Prix limite de vente",
      valeur: parParties(g.parties?.prixLimite ?? g.parties?.base, codes, valeurPrix),
    },
    {
      libelle: "Reste à charge en contrat responsable",
      valeur: parParties(g.parties?.reste, codes, (sous) =>
        resteACharge(
          sous,
          sous.map((e) => mts[codes.indexOf(e)]),
          { avecTicket: !g.parties?.reste },
        ),
      ),
    },
    { libelle: "Tarif en vigueur depuis", valeur: dateTarif(codes) },
  ].map((l) => ({ libelle: l.libelle, valeur: typo(l.valeur) }));

  // Le paragraphe généré (textes.md § 3.5).
  let tranches;
  const bases = distinctes(codes.map((e) => e.base_remboursement));
  if (g.forme === "verres") {
    if (bases.length === 1 && distinctes(codes.map((e) => e.prix_limite ?? 0)).length === 1)
      tranches = `Les ${n} codes ont la même base, ${euros(bases[0])}, quelle que soit la correction ; seule la désignation change.`;
    else {
      const cite = (b) =>
        codes
          .filter((e) => Math.round(e.base_remboursement * 100) === Math.round(b * 100))
          .sort((x, y) => x.code.localeCompare(y.code))
          .map((e) => `${e.code} «\u00a0${designation(e)}\u00a0»`)
          .join(", ");
      tranches = `Les ${n} codes se répartissent en ${bases.length} montants. La base va de ${euros(bases[0])} (${cite(bases[0])}) à ${euros(bases.at(-1))} (${cite(bases.at(-1))}), et le prix limite ${deA(codes.map((e) => e.prix_limite))}.`;
    }
  } else {
    // Une phrase par catégorie (ou par code quand une catégorie a plusieurs montants).
    const phrases = [];
    for (const cat of g.categories) {
      const sous = codes.filter((e) => e.categorie === cat);
      if (!sous.length) continue;
      const seaux = new Map();
      for (const e of sous) {
        const cle = `${e.base_remboursement}|${e.prix_limite}`;
        if (!seaux.has(cle)) seaux.set(cle, []);
        seaux.get(cle).push(e);
      }
      for (const es of seaux.values()) {
        const nom =
          seaux.size > 1 ? `${capitale(cat)}, «\u00a0${designation(es[0])}\u00a0»` : capitale(cat);
        const prix =
          es[0].prix_limite === null ? "prix libre" : `prix limite ${euros(es[0].prix_limite)}`;
        phrases.push(
          `${nom} (${es.map((e) => e.code).join(", ")}) : base ${euros(es[0].base_remboursement)}, ${prix}.`,
        );
      }
    }
    tranches = phrases.join(" ");
  }

  // Les textes sourcés du groupe.
  const paragraphes = (g.texte ?? []).map((t) => {
    const rendu = rendreModele(t.p, c);
    const texte = rendu ?? (t.p2027 ? rendreModele(t.p2027, c) : null);
    if (texte === null)
      throw new Error(`${g.slug} : paragraphe sans variante 2027 (« ${t.p.slice(0, 50)}… »)`);
    return { texte, source_ids: t.source_ids };
  });

  return {
    codes,
    regime,
    reponse,
    essentiel,
    tranches: typo(tranches),
    paragraphes,
    conditions: conditionsGroupe(codes),
    limites: typo(LIMITES_CALCUL),
    intertitres: Object.fromEntries(
      Object.entries(g.intertitres ?? {}).map(([k, v]) => [k, typo(v.replace("{n}", String(n)))]),
    ),
  };
}

/** « 32,50 € à 117,50 € » (sans « de »), pour une parenthèse. */
const fourchetteA = (vs) => {
  const d = distinctes(vs);
  return d.length === 1 ? euros(d[0]) : `${euros(d[0])} à ${euros(d.at(-1))}`;
};

/**
 * Les conditions de prise en charge d'un groupe (champ `conditions` de donnees.json), sans répétition :
 * les phrases communes à tous les codes, puis les phrases propres à certains codes, avec leurs
 * catégories. Aucun texte ajouté : seulement découpé, dédupliqué et mis en typographie.
 * @param {any[]} codes
 */
export function conditionsGroupe(codes) {
  const phrases = (e) =>
    (e.conditions ?? "")
      .split(/(?<=\.)\s+(?=[A-ZÀÂÉÈÊÎÔÛ«])/)
      .map((p) => p.trim())
      .filter(Boolean);
  const parCode = codes.map(phrases);
  const toutes = [...new Set(parCode.flat())];
  const communes = toutes.filter((p) => parCode.every((ps) => ps.includes(p)));
  // Les phrases propres à certains codes, regroupées par ensemble de catégories concernées.
  const groupes = new Map();
  for (const p of toutes.filter((x) => !communes.includes(x))) {
    const categories = [
      ...new Set(codes.filter((_, i) => parCode[i].includes(p)).map((e) => e.categorie)),
    ];
    const cle = categories.join("|");
    if (!groupes.has(cle)) groupes.set(cle, { categories, textes: [] });
    groupes.get(cle).textes.push(typo(p));
  }
  return { communes: communes.map(typo), particulieres: [...groupes.values()] };
}

/**
 * Le texte propre d'un groupe, tel qu'il est rendu (cadre.md § 4) : la réponse, les valeurs de
 * « L'essentiel », le paragraphe des tranches et les textes de groupes.mjs. Pas le tableau, ni les
 * conditions, ni le bandeau 2027, ni les limites du calcul (communs à plusieurs groupes).
 * @param {ReturnType<typeof contenuGroupe>} c
 */
export function textePropre(c) {
  return [
    ...c.reponse,
    ...c.essentiel.map((l) => `${l.valeur.replace(/[.\s]+$/, "")}.`),
    c.tranches,
    ...c.paragraphes.map((p) => p.texte),
  ].join(" ");
}
