// node --test scripts/seo-engine/tests/
import assert from "node:assert/strict";
import { test } from "node:test";
import { TITRE_MAX, contientMotCle } from "../lib/checks.mjs";
import { controler, controlerAcces, typeDePage } from "../lib/checks.mjs";
import { horsListeBlanche, typographier } from "../lib/html.mjs";

const remplissage = (n) => Array.from({ length: n }, (_, i) => `mot${i}`).join(" ");

function articleValide({ marqueurs = false } = {}) {
  const h2 = (id, q, extra = "") => `<h2 id="${id}">${q}</h2><p>${remplissage(300)}</p>${extra}`;
  return {
    metaDescription: "Le tiers payant opticien expliqué pas à pas : qui paie quoi, quels portails utiliser et comment éviter les rejets. Le guide du comptoir.",
    contentHtml:
      `<p><strong>Le tiers payant opticien permet au client de ne pas avancer les frais.</strong> ${remplissage(40)}</p>` +
      `<div class="key-takeaways"><strong>L'essentiel</strong><ul><li>Un point</li></ul></div>` +
      `<blockquote><p>« Le tiers payant dispense l'assuré de l'avance des frais. »</p><cite>ameli.fr · Tiers payant</cite></blockquote>` +
      h2("qui-paie", "Qui paie quoi ?", marqueurs ? '<div data-bloc="chiffres"></div><div data-bloc="organismes"></div>' : "") +
      h2("portails", "Quels portails utiliser ?", '<p>Voir <a href="/ressources/rapprochement-noemie">le rapprochement NOEMIE</a> et <a href="https://www.ameli.fr/opticien">ameli</a>.</p>') +
      h2("rejets", "Comment éviter les rejets ?", marqueurs ? '<div data-bloc="statuts"></div>' : "") +
      h2("paiement", "Quand est-on payé ?", marqueurs ? '<div data-bloc="contacts"></div>' : "") +
      h2("logiciel", "Quel logiciel choisir ?", '<ol class="steps"><li><strong>Vérifier.</strong> Puis agir.</li></ol>'),
    tocItems: ["qui-paie", "portails", "rejets", "paiement", "logiciel"].map((id) => ({ id, label: id })),
    faqItems: Array.from({ length: 4 }, (_, i) => ({ question: `Question ${i} ?`, answer: "Réponse courte. Deuxième phrase." })),
    sources: [
      { label: "ameli.fr · Opticien", url: "https://www.ameli.fr/opticien" },
      { label: "service-public.fr · Tiers payant", url: "https://www.service-public.fr/particuliers/vosdroits/F167" },
    ],
  };
}

const ctx = (extra = {}) => ({
  article: { slug: "tiers-payant-opticien", category: "guide-tiers-payant", primaryKeyword: "tiers payant opticien", title: "T", faqQuestions: [] },
  type: "standard",
  cibles: new Map([["/ressources/rapprochement-noemie", "x"]]),
  pagesProduit: ["/agents", "/demo"],
  ...extra,
});

test("un article conforme passe", () => {
  const r = controler(articleValide(), ctx());
  assert.deepEqual(r.erreurs, []);
});

test("liste rouge : tiret long et promesse 48 h", () => {
  const a = articleValide();
  a.contentHtml += "<p>Branché en 48 h — sans effort.</p>";
  const r = controler(a, ctx());
  assert.ok(r.erreurs.some((e) => e.includes("tiret long")));
  assert.ok(r.erreurs.some((e) => e.includes("48 h")));
});

test("balisage hors gabarit refusé", () => {
  assert.deepEqual(horsListeBlanche('<p style="x">a</p><img src="a">'), ["<p> : attribut style interdit", "balise <img> interdite"]);
  assert.deepEqual(horsListeBlanche('<div class="callout callout--tip"><p>a</p></div>'), []);
  assert.ok(horsListeBlanche('<div data-bloc="chiffres"></div>')[0].includes("hors page plateforme"));
});

test("lien interne vers une page non publiée refusé", () => {
  const a = articleValide();
  a.contentHtml += '<p><a href="/ressources/portail-almerys">Almerys</a></p>';
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("/ressources/portail-almerys")));
});

test("lien externe absent des sources refusé", () => {
  const a = articleValide();
  a.contentHtml += '<p><a href="https://example.com/x">x</a></p>';
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("hors de sources")));
});

test("sommaire désaligné avec les H2 refusé", () => {
  const a = articleValide();
  a.tocItems.pop();
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("tocItems")));
});

test("« L'essentiel » doit suivre l'ouverture", () => {
  const a = articleValide();
  a.contentHtml = a.contentHtml.replace("<div class=\"key-takeaways\">", '<h2 id="intro">Intro ?</h2><div class="key-takeaways">');
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("premier bloc")));
});

test("mot-clé principal dans les 100 premiers mots, ordre libre", () => {
  const c = ctx();
  c.article = { ...c.article, primaryKeyword: "opticien tiers payant" };
  assert.ok(!controler(articleValide(), c).erreurs.some((e) => e.includes("100 premiers mots")));
  c.article = { ...c.article, primaryKeyword: "almerys pec" };
  assert.ok(controler(articleValide(), c).erreurs.some((e) => e.includes("100 premiers mots")));
});

const ACCES = {
  verifieLe: "2026-10-30",
  liens: [{ label: "Se connecter sur viamedis.net", url: "https://www.viamedis.net/ViamedisNet/page/accueil/index" }],
};
const AUJOURDHUI = new Date("2026-11-02");

test("page plateforme : marqueurs et nombres du fichier de faits", () => {
  const faits = { chiffres: [{ valeur: "+280 000" }], faits: [{ fait: "fondé en 2000" }], acces: ACCES, sources: { site: { url: "https://www.viamedis.net/aide" } } };
  const c = ctx({ type: "plateforme", faits, aujourdhui: AUJOURDHUI });
  const a = articleValide({ marqueurs: true });
  assert.deepEqual(controler(a, c).erreurs, []);
  a.contentHtml += "<p>Fondé en 2000, plus de 280 000 opticiens, et 37 % de rejets.</p>";
  const e = controler(a, c).erreurs;
  assert.ok(e.some((x) => x.includes("nombres absents") && x.includes("37") && !x.includes("280000")));
  const sans = articleValide();
  assert.ok(controler(sans, c).erreurs.some((x) => x.includes('data-bloc="chiffres"')));
});

test("page résolution sans étapes refusée", () => {
  const a = articleValide();
  a.contentHtml = a.contentHtml.replace(/<ol class="steps">.*?<\/ol>/, "");
  const r = controler(a, ctx({ type: "resolution" }));
  assert.ok(r.erreurs.some((e) => e.includes("steps")));
});

test("type de page", () => {
  assert.equal(typeDePage({ category: "plateformes", slug: "portail-viamedis" }), "plateforme");
  assert.equal(typeDePage({ category: "plateformes", slug: "almerys-prise-en-charge" }), "standard");
  assert.equal(typeDePage({ category: "rejets", slug: "rejet-x" }), "resolution");
});

const figure = (extra = {}) => ({
  id: "circuit", type: "flux", titre: "Qui paie quoi", legende: "Le statut engage la complémentaire.", colonnes: [],
  elements: [
    { label: "Opticien", detail: "devis", valeurs: [], focus: false },
    { label: "Plateforme", detail: "statut", valeurs: [], focus: true },
  ],
  ...extra,
});

test("schéma placé une fois : accepté", () => {
  const a = articleValide();
  a.contentHtml += '<div data-figure="circuit"></div>';
  a.figures = [figure()];
  assert.deepEqual(controler(a, ctx()).erreurs, []);
});

test("schéma non placé, marqueur orphelin, deux focus : refusés", () => {
  const a = articleValide();
  a.contentHtml += '<div data-figure="autre"></div>';
  a.figures = [figure({ elements: figure().elements.map((e) => ({ ...e, focus: true })) })];
  const e = controler(a, ctx()).erreurs;
  assert.ok(e.some((x) => x.includes("placé 0 fois")));
  assert.ok(e.some((x) => x.includes('data-figure="autre" sans schéma')));
  assert.ok(e.some((x) => x.includes("plusieurs éléments en focus")));
});

test("page plateforme : un nombre inventé dans un schéma est refusé", () => {
  const faits = { chiffres: [{ valeur: "+280 000" }], faits: [{ fait: "fondé en 2000" }], acces: ACCES, sources: { site: { url: "https://www.viamedis.net/aide" } } };
  const a = articleValide({ marqueurs: true });
  a.contentHtml += '<div data-figure="circuit"></div>';
  a.figures = [figure({ legende: "Payé sous 15 jours." })];
  assert.ok(controler(a, ctx({ type: "plateforme", faits, aujourdhui: AUJOURDHUI })).erreurs.some((x) => x.includes("15")));
});

test("page plateforme : taille d'une liste et 100 % Santé admis", () => {
  const faits = { chiffres: [{ valeur: "+280 000" }], organismes: { liste: Array.from({ length: 12 }, (_, i) => `M${i}`) }, acces: ACCES, sources: { site: { url: "https://www.viamedis.net/aide" } } };
  const a = articleValide({ marqueurs: true });
  a.contentHtml += "<p>Le sélecteur propose 12 complémentaires, y compris pour le 100 % Santé.</p>";
  assert.deepEqual(controler(a, ctx({ type: "plateforme", faits, aujourdhui: AUJOURDHUI })).erreurs, []);
});

test("source = page d'accueil refusée", () => {
  const a = articleValide();
  a.sources[1].url = "https://www.service-public.fr/";
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("page d'accueil")));
});

test("citation facultative : absente = avertissement, sans <cite> = refus", () => {
  const a = articleValide();
  a.contentHtml = a.contentHtml.replace(/<blockquote>.*?<\/blockquote>/, "");
  const r = controler(a, ctx());
  assert.deepEqual(r.erreurs, []);
  assert.ok(r.avertissements.some((e) => e.includes("aucune citation")));
  a.contentHtml += "<blockquote><p>« Une phrase. »</p></blockquote>";
  assert.ok(controler(a, ctx()).erreurs.some((e) => e.includes("sans <cite>")));
});

test("citation : trop courte ou reprenant le titre de la source, refusée sans réseau", async () => {
  const { verifierSources } = await import("../lib/checks.mjs");
  const src = [{ label: "ameli.fr · Le tiers payant", url: "https://exemple.invalid/x" }];
  const courte = await verifierSources(src, [{ texte: "Le tiers payant", cite: "ameli.fr · Le tiers payant" }], { timeoutMs: 1 });
  assert.ok(courte.erreurs.some((e) => e.includes("trop courte")));
});

// seoTitle et meta description
const titre = (seoTitle) => ({ ...articleValide(), seoTitle });

test("seoTitle conforme : aucune erreur, aucun avertissement sur le titre", () => {
  const r = controler(titre("Tiers payant opticien : qui paie quoi ?"), ctx({ nouvelArticle: true }));
  assert.deepEqual(r.erreurs, []);
  assert.ok(!r.avertissements.some((a) => a.includes("seoTitle")));
});

test("seoTitle absent : avertissement sur un article existant, erreur à la rédaction", () => {
  const existant = controler(articleValide(), ctx());
  assert.deepEqual(existant.erreurs, []);
  assert.ok(existant.avertissements.includes("seoTitle absent"));
  assert.ok(controler(articleValide(), ctx({ nouvelArticle: true })).erreurs.includes("seoTitle absent"));
  assert.ok(controler({ ...articleValide(), seoTitle: null }, ctx({ nouvelArticle: true })).erreurs.includes("seoTitle absent"));
});

test("seoTitle présent et hors règle : erreur même sur un article existant", () => {
  const long = "Tiers payant opticien : tout comprendre pour le comptoir en dix points";
  assert.ok(long.length > TITRE_MAX);
  assert.ok(controler(titre(long), ctx()).erreurs.some((e) => e.includes(`${long.length} caractères`)));
  assert.ok(controler(titre("   "), ctx()).erreurs.includes("seoTitle vide"));
  assert.ok(controler(titre("Qui paie quoi au comptoir ?"), ctx()).erreurs.some((e) => e.includes("sans le mot-clé principal")));
});

test("seoTitle : 60 caractères passent, 61 non", () => {
  const base = "Tiers payant opticien ";
  const juste = base + "x".repeat(TITRE_MAX - base.length);
  assert.deepEqual(controler(titre(juste), ctx()).erreurs, []);
  assert.ok(controler(titre(juste + "x"), ctx()).erreurs.some((e) => e.includes("61 caractères")));
});

test("seoTitle : mots du mot-clé retrouvés sans accent, sans casse, au pluriel, dans le désordre et entre des mots-outils", () => {
  const c = ctx();
  c.article = { ...c.article, primaryKeyword: "rejet bénéficiaire inconnu mutuelle" };
  assert.ok(!controler(titre("Rejets mutuelle : BENEFICIAIRE inconnu, que faire ?"), c).erreurs.some((e) => e.includes("seoTitle")));
  c.article = { ...c.article, primaryKeyword: "demande de prise en charge" };
  assert.ok(!controler(titre("Prises en charge : la demande pas à pas"), c).erreurs.some((e) => e.includes("seoTitle")));
  assert.ok(!contientMotCle("Prise en charge optique", "almerys pec"));
  assert.ok(contientMotCle("Tiers payant sans carte Vitale en pharmacie", "tiers payant sans carte vitale pharmacie"));
});

test("seoTitle identique au titre d'un autre article : erreur, accents et casse ignorés", () => {
  const titresPris = new Map([["autre-article", "Tiers payant opticien : qui paie quoi ?"]]);
  const r = controler(titre("TIERS PAYANT OPTICIEN, qui paie quoi"), ctx({ titresPris }));
  assert.ok(r.erreurs.some((e) => e.includes("identique au titre de autre-article")));
  assert.deepEqual(controler(titre("Tiers payant opticien : le guide"), ctx({ titresPris })).erreurs, []);
});

test("seoTitle : la liste rouge s'applique", () => {
  assert.ok(controler(titre("Tiers payant opticien — le guide"), ctx()).erreurs.some((e) => e.includes("tiret long")));
});

test("metaDescription : les mots du mot-clé suffisent, pas besoin qu'ils soient collés", () => {
  const c = ctx();
  c.article = { ...c.article, primaryKeyword: "virement mutuelle inférieur facture" };
  const a = articleValide();
  a.metaDescription = "Le virement de la mutuelle est inférieur à la facture ? Retrouvez d'où vient l'écart et ce qu'il faut réclamer, dossier par dossier, avant de relancer.";
  const r = controler(a, c).avertissements;
  assert.ok(!r.some((x) => x.includes("metaDescription")));
  a.metaDescription = "Trois gestes pour comprendre un écart de paiement et réclamer ce qui manque, dossier par dossier, avant de relancer votre interlocuteur au bon moment.";
  assert.ok(controler(a, c).avertissements.some((x) => x.includes("mot-clé principal absents")));
});

test("metaDescription ouverte sur le mot-clé brut : signalée, sans bloquer", () => {
  const c = ctx();
  c.article = { ...c.article, primaryKeyword: "liste codes rejets noemie" };
  const a = articleValide();
  a.metaDescription = "Liste codes rejets NOEMIE : où trouver le libellé fiable, comment classer chaque code et quoi corriger avant de renvoyer la facture à la caisse.";
  const r = controler(a, c);
  assert.ok(!r.erreurs.some((e) => e.includes("metaDescription")));
  assert.ok(r.avertissements.some((x) => x.includes("mot-clé brut")));
  c.article = { ...c.article, primaryKeyword: "almerys tp" };
  a.metaDescription = "Almerys TP : l'accès à l'espace pro, la prise en charge optique et les statuts à connaître, pour traiter un dossier sans appeler la plateforme.";
  assert.ok(!controler(a, c).avertissements.some((x) => x.includes("mot-clé brut")));
});

// Pages comparatives (gabarit §6 bis)
const iremia = {
  slug: "iremia", nom: "Iremia Santé", checkedOn: "2026-10-07", aRelire: false,
  axes: { pec: { valeur: "oui" } },
  citations: [{ texte: "Nos experts s'en occupent pour vous.", source: "iremia-optique" }],
  exclus: { chiffresDeclares: "Taux de recouvrement 99.8%" },
};
const granit = { slug: "granit", nom: "Granit", checkedOn: "2026-10-07", aRelire: false, axes: {}, citations: [] };

function ficheVs() {
  const a = articleValide();
  a.contentHtml = a.contentHtml
    .replace(/<blockquote>[\s\S]*?<\/blockquote>/, "<blockquote><p>« Nos experts s'en occupent pour vous. »</p><cite>iremia-sante.fr · Opticiens</cite></blockquote>")
    .replace('<h2 id="portails">', '<div data-bloc="coup-doeil"></div><div data-bloc="frise"></div><div data-bloc="choisir"></div><h2 id="portails">');
  return a;
}
const ctxVs = (extra = {}) =>
  ctx({
    article: { slug: "granit-vs-iremia", category: "gerer-son-tiers-payant", primaryKeyword: "tiers payant opticien", title: "T", faqQuestions: [], concurrents: ["iremia", "granit"] },
    type: "vs",
    concurrents: { iremia, granit },
    ...extra,
  });

test("type de page : fiche VS et grille", () => {
  assert.equal(typeDePage({ slug: "granit-vs-iremia", category: "gerer-son-tiers-payant", concurrents: ["iremia"] }), "vs");
  assert.equal(typeDePage({ slug: "solutions-tiers-payant-optique", category: "gerer-son-tiers-payant", concurrents: ["iremia"] }), "grille");
});

test("une fiche VS conforme passe", () => {
  assert.deepEqual(controler(ficheVs(), ctxVs()).erreurs, []);
});

test("fiche VS : marqueur manquant, prix, dénigrement, citation et chiffre hors fichiers refusés", () => {
  const a = ficheVs();
  a.contentHtml = a.contentHtml.replace('<div data-bloc="choisir"></div>', "");
  a.contentHtml += "<p>Iremia Santé est lent et coûte 90 € par mois, avec 99,8 % de recouvrement.</p>";
  a.contentHtml += "<blockquote><p>« Une phrase inventée. »</p><cite>iremia-sante.fr</cite></blockquote>";
  const e = controler(a, ctxVs()).erreurs.join("\n");
  assert.match(e, /data-bloc="choisir" présent 0 fois/);
  assert.match(e, /prix ou tarif/);
  assert.match(e, /« lent » près de « Iremia Santé »/);
  assert.match(e, /citation absente des fichiers concurrents/);
  assert.match(e, /nombres absents des fichiers concurrents : 90, 99,8/);
});

test("fiche VS : fichier de faits non relu refusé", () => {
  const e = controler(ficheVs(), ctxVs({ concurrents: { iremia: { ...iremia, aRelire: true }, granit } })).erreurs;
  assert.ok(e.some((x) => x.includes("non relu")));
});

test("marqueur de comparatif refusé sur une page standard", () => {
  assert.ok(horsListeBlanche('<div data-bloc="coup-doeil"></div>')[0].includes("hors page"));
  assert.deepEqual(horsListeBlanche('<div data-bloc="grille"></div>', { marqueurs: ["grille"] }), []);
});

test("accès espace pro : conforme", () => {
  const faits = { acces: ACCES, sources: { site: { url: "https://www.viamedis.net/aide" } } };
  assert.deepEqual(controlerAcces(faits, { aujourdhui: AUJOURDHUI }), { erreurs: [], avertissements: [] });
});

test("accès espace pro : absent, mal formé ou vide sans note refusé", () => {
  assert.ok(controlerAcces({}).erreurs[0].includes("sans `acces`"));
  const r = controlerAcces({ acces: { verifieLe: "30/10/2026", liens: [] } });
  assert.ok(r.erreurs.some((e) => e.includes("verifieLe")));
  assert.ok(r.erreurs.some((e) => e.includes("ni note")));
  const http = controlerAcces({ acces: { verifieLe: "2026-10-30", liens: [{ label: "x", url: "http://www.viamedis.net/" }] } });
  assert.ok(http.erreurs.some((e) => e.includes("non https")));
});

test("accès espace pro : note sans lien, domaine inconnu et lien ancien signalés", () => {
  const note = controlerAcces({ acces: { verifieLe: "2026-10-30", liens: [], note: "Pas de lien public." } }, { aujourdhui: AUJOURDHUI });
  assert.deepEqual(note.erreurs, []);
  assert.ok(note.avertissements.some((e) => e.includes("aucun lien")));
  // services.santeclair.fr accepté grâce à une source sur santeclair.fr ; un autre domaine est signalé
  const faits = {
    acces: {
      verifieLe: "2026-01-02",
      liens: [
        { label: "a", url: "https://services.santeclair.fr/professionnel-sante/connexion" },
        { label: "b", url: "https://portail-tiers-payant.example.com/login" },
      ],
    },
    sources: { sc: { url: "https://www.santeclair.fr/fr/professionnel-sante" } },
  };
  const r = controlerAcces(faits, { aujourdhui: AUJOURDHUI });
  assert.deepEqual(r.erreurs, []);
  assert.equal(r.avertissements.filter((e) => e.includes("domaine absent")).length, 1);
  assert.ok(r.avertissements.some((e) => e.includes("à revérifier")));
});

test("page plateforme sans acces dans le fichier de faits refusée", () => {
  const faits = { chiffres: [{ valeur: "+280 000" }] };
  const e = controler(articleValide({ marqueurs: true }), ctx({ type: "plateforme", faits })).erreurs;
  assert.ok(e.some((x) => x.includes("sans `acces`")));
});

test("page plateforme : lien d'accès repris tel quel dans le texte signalé, pas une autre page du portail", () => {
  const faits = { chiffres: [{ valeur: "+280 000" }], acces: ACCES, sources: { site: { url: "https://www.viamedis.net/aide" } } };
  const c = ctx({ type: "plateforme", faits, aujourdhui: AUJOURDHUI });
  const a = articleValide({ marqueurs: true });
  a.sources.push({ label: "viamedis.net · Connexion", url: ACCES.liens[0].url });
  a.contentHtml += `<p>Voir <a href="${ACCES.liens[0].url}#/faq/">la FAQ</a>.</p>`;
  assert.ok(!controler(a, c).avertissements.some((e) => e.includes("repris dans le texte")));
  a.contentHtml += `<p>Puis <a href="${ACCES.liens[0].url}">la connexion</a>.</p>`;
  assert.ok(controler(a, c).avertissements.some((e) => e.includes("repris dans le texte")));
});

test("TON.md : un mot de « On ne dit pas » fait refuser l'article", () => {
  for (const [mot, regle] of [
    ["Granit automatise vos prises en charge.", "Granit automatise"],
    ["Un robot saisit la PEC.", "robot"],
    ["Le tiers-payant optique.", "tiers-payant"],
    ["Une intégration avec votre logiciel.", "intégration"],
    ["Optimiser vos remboursements.", "optimiser"],
    ["L'IA lit la carte.", "l'IA"],
    ["Bien joué 👍.", "emoji"],
  ]) {
    const a = articleValide();
    a.contentHtml = a.contentHtml.replace("</p>", ` ${mot}</p>`);
    const r = controler(a, ctx());
    assert.ok(r.erreurs.some((e) => e.startsWith("TON.md") && e.includes(regle)), `${mot} → ${r.erreurs.join(" | ")}`);
  }
});

test("TON.md : formes permises et citations recopiées non refusées", () => {
  const a = articleValide();
  a.contentHtml = a.contentHtml
    .replace("</p>", " Nos agents IA travaillent sans intégration, et le 100 % Santé reste à part. Convention Tiers-payant TP+, robot de dispensation, Partenariat & tiers-payant.</p>")
    .replace("</cite>", " · tiers-payant</cite>")
    .replace("« Le tiers payant", "« Le tiers-payant");
  const r = controler(a, ctx());
  assert.deepEqual(r.erreurs.filter((e) => e.startsWith("TON.md")), []);
});

test("TON.md : la FAQ et la metaDescription sont contrôlées aussi", () => {
  const a = articleValide();
  a.faqItems[0].answer = "N'hésitez pas à appeler la plateforme.";
  const r = controler(a, ctx());
  assert.ok(r.erreurs.some((e) => e.includes("n'hésitez pas à")));
});

test("typographie : insécables posées hors balises et hors citations", () => {
  const h = `<p>Pourquoi ? Voici : le «test» ; <a href="/x?a=1:2">lien</a></p><blockquote>« cité » ?</blockquote>`;
  assert.equal(
    typographier(h),
    `<p>Pourquoi ? Voici : le « test » ; <a href="/x?a=1:2">lien</a></p><blockquote>« cité » ?</blockquote>`,
  );
});
