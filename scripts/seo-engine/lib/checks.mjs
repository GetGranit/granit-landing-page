// Contrôles avant publication : guide (« Contrôles automatiques ») + gabarit (section 8).
// erreurs = l'article est refusé ; avertissements = publié, mais signalé au relecteur.
import { compteMarqueur, h2s, horsListeBlanche, liens, MARQUEURS_PAR_TYPE, mots, normalise, texte } from "./html.mjs";

const SITE = "https://www.getgranit.ai";

// Liste rouge et jargon interdit (BLOG_CMS_granit.md, « Faits » et « Ton et style »)
const INTERDITS = [
  [/—/, "tiret long « — »"],
  [/\b48\s?h\b|\b48\s?heures\b/i, "promesse « 48 h » (réservée à l'encart final)"],
  [/ISO\s?27001|SOC\s?2\b/i, "certification autre que HDS"],
  [/dans le paysage actuel/i, "jargon « dans le paysage actuel »"],
  [/il est essentiel de/i, "jargon « il est essentiel de »"],
  [/plongeons dans/i, "jargon « plongeons dans »"],
  [/en fin de compte/i, "jargon « en fin de compte »"],
  [/levier de croissance/i, "jargon « levier de croissance »"],
  [/synergie/i, "jargon « synergie »"],
  [/holistique/i, "jargon « holistique »"],
  [/r[ée]volutionnaire|incontournable/i, "superlatif interdit"],
];

const A_SURVEILLER = [
  [/\bprocess\b|\bworkflow\b|best practice|game.changer|\bleverage\b/i, "anglicisme"],
];

// Pages comparatives (gabarit §6 bis) : aucun prix, aucun dénigrement près du nom d'un concurrent.
const PRIX = /€|\beuros?\b|\bHT\b|\/\s?mois\b|par mois\b|\bprix\b|\btarifs?\b/i;
const DENIGREMENT = [
  "pire", "mauvais", "nul", "nuls", "depasse", "depasses", "arnaque", "lent", "lents", "lourd", "cher", "chers",
  "archaique", "obsolete", "incompetent", "incompetents", "decevant", "mediocre", "catastrophique", "inefficace",
];
/** Mots minimum par type (cible : fiche VS 1 000 à 1 500, grille 2 000 à 2 800, autres 1 800 à 2 500). */
export const MOTS_MIN = { vs: 900, grille: 1800 };

export function typeDePage(article) {
  if (article.concurrents?.length) return /^granit-(vs|ou)-/.test(article.slug) ? "vs" : "grille";
  if (article.category === "plateformes" && article.slug.startsWith("portail-")) return "plateforme";
  if (["rejets", "paiements"].includes(article.category)) return "resolution";
  return "standard";
}

function nombres(s) {
  // nombres isolés seulement (pas « mot12 », « B2B », « 3G »)
  const re = /(?<![\p{L}\d])(?:\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:,\d+)?|\d+(?:,\d+)?)(?![\p{L}\d])/gu;
  return (s.match(re) ?? []).map((n) => n.replace(/[ \u00a0\u202f]/g, ""));
}

function urlNormale(u) {
  return u.trim().replace(/#.*$/, "").replace(/\/+$/, "");
}

function motCleAuDebut(corps, motCle) {
  const debut = normalise(mots(corps).slice(0, 100).join(" "));
  const mc = normalise(motCle);
  if (` ${debut} `.includes(` ${mc} `)) return true;
  // « almerys pec » accepté sous la forme « PEC Almerys » : tous les mots présents
  const motsDebut = new Set(debut.split(" "));
  return mc.split(" ").every((m) => motsDebut.has(m));
}

/**
 * @param out     réponse de Claude (schéma article-output)
 * @param ctx     { article, type, faits, cibles: Map<chemin, titre>, pagesProduit: string[] }
 */
export function controler(out, ctx) {
  const erreurs = [];
  const avert = [];
  const { article, type } = ctx;
  const html = out.contentHtml ?? "";

  for (const champ of ["metaDescription", "contentHtml"]) {
    if (!out[champ]?.trim()) erreurs.push(`champ ${champ} vide`);
  }
  if (!html) return { erreurs, avertissements: avert };

  // Balisage
  const comparatif = type === "vs" || type === "grille";
  for (const f of horsListeBlanche(html, { marqueurs: MARQUEURS_PAR_TYPE[type] ?? [] })) erreurs.push(f);

  const corps = texte(html);
  const nbMots = mots(corps).length;
  const min = MOTS_MIN[type] ?? 1400;
  if (nbMots < min) erreurs.push(`contentHtml fait ${nbMots} mots (minimum ${min})`);

  // Meta description
  const md = out.metaDescription ?? "";
  if (md.length < 120 || md.length > 170) erreurs.push(`metaDescription fait ${md.length} caractères (140 à 160)`);
  else if (md.length < 140 || md.length > 160) avert.push(`metaDescription fait ${md.length} caractères (140 à 160)`);
  if (!normalise(md).includes(normalise(article.primaryKeyword))) avert.push("mot-clé principal absent de la metaDescription");

  // Ouverture et « L'essentiel »
  const iKt = html.indexOf('class="key-takeaways"');
  if (iKt < 0) erreurs.push("encadré « L'essentiel » (key-takeaways) absent");
  else {
    const avant = html.slice(0, html.lastIndexOf("<div", iKt));
    if (/<(h2|h3|ul|ol|table|blockquote|div)\b/.test(avant)) {
      erreurs.push("« L'essentiel » doit être le premier bloc après l'ouverture (seulement des <p> avant)");
    }
    if (!/<p\b/.test(avant)) erreurs.push("pas d'ouverture en <p> avant « L'essentiel »");
    if ((html.match(/class="key-takeaways"/g) ?? []).length > 1) erreurs.push("« L'essentiel » apparaît plusieurs fois");
  }
  if (!motCleAuDebut(corps, article.primaryKeyword)) erreurs.push(`mot-clé principal « ${article.primaryKeyword} » absent des 100 premiers mots`);

  // H2 et sommaire
  const titres = h2s(html);
  if (titres.length < 3) erreurs.push(`seulement ${titres.length} H2`);
  const questions = titres.filter((t) => t.texte.trim().endsWith("?")).length;
  if (titres.length && questions / titres.length < 0.7) erreurs.push(`${questions}/${titres.length} H2 en questions (70 % minimum)`);
  for (const t of titres) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.id)) erreurs.push(`H2 « ${t.texte} » : id « ${t.id} » invalide (minuscules, tirets, sans accent)`);
  }
  const idsH2 = titres.map((t) => t.id).join("|");
  const idsToc = (out.tocItems ?? []).map((t) => t.id).join("|");
  if (idsH2 !== idsToc) erreurs.push(`tocItems ne correspond pas aux H2 (H2 : ${idsH2} ; sommaire : ${idsToc})`);
  if (new Set(titres.map((t) => t.id)).size !== titres.length) erreurs.push("deux H2 ont le même id");
  for (const t of out.tocItems ?? []) if (t.label.length > 60) avert.push(`libellé de sommaire trop long : « ${t.label} »`);

  // FAQ
  const faq = out.faqItems ?? [];
  if (faq.length < 4 || faq.length > 7) erreurs.push(`${faq.length} questions dans la FAQ (4 à 7)`);
  for (const f of faq) {
    if (/<[a-z]/i.test(f.answer)) erreurs.push(`réponse FAQ avec du HTML : « ${f.question} »`);
    const phrases = f.answer.split(/[.!?](\s|$)/).filter((p) => p && p.trim().length > 2).length;
    if (phrases > 5) avert.push(`réponse FAQ longue (${phrases} phrases) : « ${f.question} »`);
  }

  // Liens
  const sources = (out.sources ?? []).map((s) => urlNormale(s.url));
  if (sources.length < 2) erreurs.push(`${sources.length} source(s), 2 minimum`);
  // une source = la page exacte qui porte le fait, jamais la page d'accueil d'un site
  for (const u of sources) {
    try {
      const { pathname, search } = new URL(u);
      if ((pathname === "/" || pathname === "") && !search) erreurs.push(`source = page d'accueil, citer la page exacte : ${u}`);
    } catch {
      erreurs.push(`source illisible : ${u}`);
    }
  }
  let internes = 0;
  let produit = 0;
  for (const l of liens(html)) {
    let href = l.href;
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || "/";
    if (/^https?:\/\//.test(href)) {
      if (!sources.includes(urlNormale(href))) erreurs.push(`lien externe hors de sources : ${href}`);
      continue;
    }
    if (!href.startsWith("/")) {
      erreurs.push(`lien invalide : ${l.href}`);
      continue;
    }
    const chemin = urlNormale(href.split("?")[0]) || "/";
    if (ctx.pagesProduit.includes(chemin)) produit++;
    else if (ctx.cibles.has(chemin)) internes++;
    else erreurs.push(`lien interne vers une page non publiée ou inconnue : ${chemin}`);
    if (/^(cliquez ici|en savoir plus|ici|lire la suite)$/i.test(l.ancre)) erreurs.push(`ancre vide de sens : « ${l.ancre} »`);
  }
  if (produit > 2) erreurs.push(`${produit} liens vers des pages produit (2 maximum)`);
  if (internes + produit < 3) avert.push(`${internes + produit} lien(s) interne(s) (3 à 8 visés)`);
  if (internes + produit > 8) avert.push(`${internes + produit} liens internes (3 à 8 visés)`);

  // Schémas types
  const figures = out.figures ?? [];
  const texteFigures = controlerFigures(figures, html, erreurs, avert);

  // Liste rouge, sur tout ce qui sera affiché
  const toutLeTexte = [corps, md, texteFigures, ...faq.map((f) => `${f.question} ${f.answer}`)].join("\n");
  for (const [re, quoi] of INTERDITS) if (re.test(toutLeTexte)) erreurs.push(`liste rouge : ${quoi}`);
  for (const [re, quoi] of A_SURVEILLER) {
    const m = toutLeTexte.match(re);
    if (m) avert.push(`${quoi} : « ${m[0]} »`);
  }
  if (/\bHDS\b/.test(toutLeTexte)) {
    if (type === "plateforme") erreurs.push("HDS cité dans une page plateforme");
    else if (!toutLeTexte.includes("certifié HDS (hébergeur de données de santé)")) avert.push("HDS cité sans la formulation validée");
  }
  const mentions = (corps.match(/\bGranit\b/g) ?? []).length;
  if (mentions > 2 && !comparatif) avert.push(`Granit cité ${mentions} fois dans le corps (une mention visée)`);
  // Citation facultative : Claude ne lit pas les pages sources, il ne doit citer que ce dont il est sûr.
  // Une citation présente est vérifiée mot pour mot (verifierSources) ; son absence est seulement signalée.
  if (/<blockquote>/.test(html) && !/<blockquote>[\s\S]*?<cite>[\s\S]*?<\/blockquote>/.test(html)) erreurs.push("citation <blockquote> sans <cite>");
  if (!/<blockquote>/.test(html)) avert.push("aucune citation (facultative)");

  // Par type de page
  if (type === "resolution" && !/<ol class="steps">/.test(html)) erreurs.push('page résolution sans <ol class="steps">');
  for (const m of MARQUEURS_PAR_TYPE[type] ?? []) {
    const n = compteMarqueur(html, m);
    if (n !== 1) erreurs.push(`marqueur data-bloc="${m}" présent ${n} fois (1 attendu)`);
  }
  if (comparatif) controlerComparatif({ html, toutLeTexte, faq, ctx, erreurs, avert });
  if (type === "plateforme") {
    // nombres admis : ceux du fichier de faits, la taille de ses listes (ex. 122 organismes), et 100 (100 % Santé)
    const tailles = [];
    (function compter(o) {
      if (Array.isArray(o)) tailles.push(String(o.length));
      if (o && typeof o === "object") Object.values(o).forEach(compter);
    })(ctx.faits ?? {});
    const connus = new Set([
      "100",
      ...tailles,
      ...nombres(JSON.stringify(ctx.faits ?? {})),
      ...nombres([article.title, ...(article.faqQuestions ?? []), article.primaryKeyword].join(" ")),
    ]);
    const inconnus = [...new Set(nombres([corps, texteFigures, ...faq.map((f) => f.answer)].join(" ")))].filter(
      (n) => n.replace(/\D/g, "").length >= 2 && !connus.has(n),
    );
    if (inconnus.length) erreurs.push(`nombres absents du fichier de faits : ${inconnus.join(", ")}`);
  }

  return { erreurs, avertissements: avert, nbMots };
}

/**
 * Pages comparatives (gabarit §6 bis) : fichiers de faits relus, aucun prix, aucun dénigrement
 * près du nom d'un concurrent, nombres et citations tirés des fichiers concurrents.
 * ctx.concurrents = { slug: contenu de content/concurrents/{slug}.json }
 */
function controlerComparatif({ html, toutLeTexte, faq, ctx, erreurs, avert }) {
  const fichiers = ctx.concurrents ?? {};
  for (const slug of ctx.article.concurrents ?? []) {
    const f = fichiers[slug];
    if (!f) erreurs.push(`fichier de faits manquant : content/concurrents/${slug}.json`);
    else if (f.aRelire) {
      // En essai, on laisse passer pour voir la page ; jamais en publication.
      (ctx.essai ? avert : erreurs).push(`fichier de faits non relu (aRelire = true) : content/concurrents/${slug}.json`);
    }
  }
  const prix = toutLeTexte.match(PRIX);
  if (prix) erreurs.push(`prix ou tarif cité (« ${prix[0]} ») : aucun prix sur une page comparative`);

  // Dénigrement : un mot de la liste à moins de 10 mots du nom d'un concurrent (Granit exclu)
  const motsTexte = normalise(toutLeTexte).split(" ");
  for (const f of Object.values(fichiers)) {
    if (f.slug === "granit") continue;
    const nom = normalise(f.nom).split(" ")[0];
    motsTexte.forEach((m, i) => {
      if (m !== nom) return;
      const voisins = motsTexte.slice(Math.max(0, i - 10), i + 11);
      const mauvais = voisins.find((v) => DENIGREMENT.includes(v));
      if (mauvais) erreurs.push(`mot « ${mauvais} » près de « ${f.nom} » : pas de dénigrement`);
    });
  }

  // Nombres : seulement ceux des fichiers de faits utilisés (hors « exclus », jamais affiché)
  const publics = Object.values(fichiers).map(({ exclus, ...reste }) => reste);
  const connus = new Set([
    "100",
    ...nombres(JSON.stringify(publics)),
    ...nombres([ctx.article.title, ...(ctx.article.faqQuestions ?? [])].join(" ")),
  ]);
  const corpsEtFaq = [texte(html), ...faq.map((x) => x.answer)].join(" ");
  const inconnus = [...new Set(nombres(corpsEtFaq))].filter((n) => n.replace(/\D/g, "").length >= 2 && !connus.has(n));
  if (inconnus.length) erreurs.push(`nombres absents des fichiers concurrents : ${inconnus.join(", ")}`);

  // Citations : recopiées d'un champ citations[].texte
  const admises = Object.values(fichiers).flatMap((f) => (f.citations ?? []).map((c) => normalise(c.texte)));
  for (const c of citations(html)) {
    if (!admises.includes(normalise(c.texte))) erreurs.push(`citation absente des fichiers concurrents : « ${c.texte.slice(0, 70)} »`);
  }
  if ([...new Set(erreurs)].length !== erreurs.length) erreurs.splice(0, erreurs.length, ...new Set(erreurs));
}

/** Schémas : 0 à 2, chacun placé une fois, libellés courts. Renvoie leur texte. */
function controlerFigures(figures, html, erreurs, avert) {
  if (figures.length > 2) erreurs.push(`${figures.length} schémas (2 maximum)`);
  const places = [...html.matchAll(/data-figure="([^"]*)"/g)].map((m) => m[1]);
  for (const id of places) if (!figures.some((f) => f.id === id)) erreurs.push(`marqueur data-figure="${id}" sans schéma`);
  const textes = [];
  for (const f of figures) {
    const n = places.filter((p) => p === f.id).length;
    if (n !== 1) erreurs.push(`schéma « ${f.id} » placé ${n} fois (1 attendu)`);
    const nb = f.elements.length;
    if (nb < 2 || nb > 6) erreurs.push(`schéma « ${f.id} » : ${nb} éléments (2 à 6)`);
    if (f.titre.length > 70) avert.push(`schéma « ${f.id} » : titre long`);
    if (!f.legende.trim()) erreurs.push(`schéma « ${f.id} » : légende vide`);
    if (f.elements.filter((e) => e.focus).length > 1) erreurs.push(`schéma « ${f.id} » : plusieurs éléments en focus (1 maximum)`);
    for (const e of f.elements) {
      if (e.label.split(/\s+/).length > 5) erreurs.push(`schéma « ${f.id} » : libellé trop long « ${e.label} » (1 à 4 mots)`);
      if (e.detail.length > 70) erreurs.push(`schéma « ${f.id} » : détail trop long « ${e.detail} » (60 caractères)`);
    }
    if (f.type === "comparaison") {
      const c = f.colonnes.length;
      if (c < 2 || c > 3) erreurs.push(`schéma « ${f.id} » : comparaison sur ${c} colonnes (2 ou 3)`);
      for (const e of f.elements) if (e.valeurs.length !== c) erreurs.push(`schéma « ${f.id} » : « ${e.label} » n'a pas une valeur par colonne`);
    }
    textes.push(f.titre, f.legende, ...f.colonnes, ...f.elements.flatMap((e) => [e.label, e.detail, ...e.valeurs]));
  }
  return textes.join(" ");
}

/** Citations du corps : [{ texte, cite }] */
export function citations(html) {
  return [...html.matchAll(/<blockquote>([\s\S]*?)<\/blockquote>/g)].map((m) => ({
    texte: texte(m[1].replace(/<cite>[\s\S]*?<\/cite>/, "")).replace(/^[«"\s]+|[»"\s]+$/g, ""),
    cite: texte(m[1].match(/<cite>([\s\S]*?)<\/cite>/)?.[1] ?? ""),
  }));
}

/**
 * Vérifie que chaque source répond (404/410 ou domaine introuvable = erreur), et que chaque
 * citation figure mot pour mot dans la page de sa source quand cette page est lisible.
 */
export async function verifierSources(sources, cits = [], { timeoutMs = 10000 } = {}) {
  const erreurs = [];
  const avert = [];
  const pages = new Map();
  await Promise.all(
    sources.map(async ({ url }) => {
      try {
        const r = await fetch(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(timeoutMs),
          headers: { "user-agent": "Mozilla/5.0 (compatible; GranitSEO/1.0; +https://www.getgranit.ai)" },
        });
        if (r.status === 404 || r.status === 410) erreurs.push(`source introuvable (${r.status}) : ${url}`);
        else if (!r.ok) avert.push(`source non vérifiable (${r.status}) : ${url}`);
        else {
          // Une page rendue en JavaScript (coquille vide sans navigateur) ne permet pas de vérifier
          // une citation : on la traite comme illisible (avertissement), pas comme une citation fausse.
          const brut = (await r.text()).replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->/gi, " ");
          const lu = texte(brut);
          if (mots(lu).length < 150) avert.push(`page rendue en JavaScript, citations non vérifiables : ${url}`);
          else pages.set(url, normalise(lu));
        }
      } catch (e) {
        const code = e.cause?.code ?? e.name;
        if (code === "ENOTFOUND") erreurs.push(`domaine introuvable : ${url}`);
        else avert.push(`source non vérifiable (${code}) : ${url}`);
      }
    }),
  );
  for (const c of cits) {
    const src = sources.find((s) => normalise(s.label) === normalise(c.cite));
    const page = src && pages.get(src.url);
    const nbMots = mots(c.texte).length;
    if (nbMots < 8) {
      erreurs.push(`citation trop courte (${nbMots} mots) : « ${c.texte} ». Recopie une vraie phrase de la source, pas un titre`);
    } else if (normalise(src?.label ?? c.cite).includes(normalise(c.texte))) {
      erreurs.push(`la citation reprend le titre de sa source : « ${c.texte.slice(0, 80)} »`);
    } else if (!page) {
      erreurs.push(
        `citation invérifiable (page de « ${c.cite} » illisible par le moteur ou absente des sources) : choisis une phrase d'une source que le moteur peut lire (ameli.fr, service-public.fr, site de la plateforme…)`,
      );
    } else if (!page.includes(normalise(c.texte))) {
      erreurs.push(`citation introuvable mot pour mot sur ${src.url} : « ${c.texte.slice(0, 80)} »`);
    }
  }
  return { erreurs, avertissements: avert };
}
