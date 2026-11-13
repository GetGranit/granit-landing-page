import {
  dimanchesEnMots,
  euros,
  mois,
  type ResultatHeures,
  type ResultatTri,
  type SaisieHeures,
} from "./calculs.ts";

/**
 * Contenu des mails envoyés après le formulaire des deux outils (HTML, texte
 * brut et, pour le tri des marques, la grille en CSV). Séparé de l'envoi
 * (envoyerMailOutil.ts) pour être relu et testé hors du serveur.
 *
 * Marque (DESIGN.md) : pas de police web dans un mail, jetons en hex pleins.
 * Les couleurs sont passées par l'appelant (celles de webinarMail.ts) pour
 * n'avoir qu'une palette de mail dans le dépôt.
 */
export type CouleursMail = {
  fond: string;
  carte: string;
  encadre: string;
  texte: string;
  secondaire: string;
  filet: string;
  lien: string;
};

const SITE = "https://www.getgranit.ai";
const RDV = "https://cal.com/paul-pietra-granit/decouvrir-granit/";

/** Lien de rendez-vous du mail, avec ses UTM (le clic se lit dans Cal.com). */
export function lienRdv(outil: string) {
  const q = new URLSearchParams({
    utm_source: "lead-magnet",
    utm_medium: "email",
    utm_campaign: outil,
  });
  return `${RDV}?${q.toString()}`;
}

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const bonjour = (prenom: string) => (prenom ? `Bonjour ${prenom},` : "Bonjour,");

const VERDICT = { garder: "Garder", reduire: "Réduire", sortir: "Sortir" } as const;

function gabarit(c: CouleursMail, blocs: string[]) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:${c.fond};font-family:Helvetica,Arial,sans-serif;color:${c.texte}">
<div style="max-width:600px;margin:0 auto;padding:28px 20px">
<div style="background:${c.carte};border-radius:14px;padding:28px 24px">
${blocs.join("\n")}
</div></div></body></html>`;
}

const p = (html: string, style = "") =>
  `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;${style}">${html}</p>`;

/* ------------------------------------------------------------------ */
/* Tri des marques                                                     */
/* ------------------------------------------------------------------ */

export const OBJET_MARQUES = "Votre grille de tri des marques";

/** La phrase qui résume le résultat, commune au texte et au HTML. */
function resumeMarques(r: ResultatTri) {
  if (r.argentQuiDort <= 0)
    return "D'après vos chiffres, aucune marque n'a plus d'un an de stock devant elle.";
  const surtout = r.pire ? `, surtout sur ${r.pire.nom}` : "";
  return `D'après vos chiffres, ${euros(r.argentQuiDort)} dorment dans le stock${surtout}.`;
}

const PONT =
  "Côté mutuelles, c'est notre métier chez Granit : nos agents font le tiers payant et tout l'administratif autour, dans les logiciels que vous utilisez déjà.";

export function texteMarques(prenom: string, r: ResultatTri, enAttente: number) {
  return [
    bonjour(prenom),
    "",
    `Voici votre grille de tri, avec vos ${r.lignes.length} marques. Le tableur est en pièce jointe : vous pouvez le refaire avant chaque salon.`,
    "",
    resumeMarques(r),
    "",
    ...r.lignes.map(
      (l) =>
        `- ${l.nom} : ${mois(l.moisDeStock)}${Number.isFinite(l.moisDeStock) ? " mois de stock" : ""}, ${VERDICT[l.verdict].toLowerCase()}` +
        (l.margeARegarder ? " (marge au-dessus de votre moyenne, à regarder avant de trancher)" : ""),
    ),
    "",
    ...(enAttente > 0
      ? [
          `Avec les ${euros(enAttente)} de mutuelles pas encore encaissés, cela fait ${euros(r.argentQuiDort + enAttente)} qui ne sont pas sur votre compte.`,
          "",
        ]
      : []),
    PONT,
    `Si vous voulez voir ce que ça donne chez vous, prenez 15 minutes avec moi : ${lienRdv("tri-des-marques")}`,
    "",
    `Refaire la grille : ${SITE}/outils/tri-des-marques`,
    "",
    "Paul",
    "Granit",
  ].join("\n");
}

export function htmlMarques(c: CouleursMail, prenom: string, r: ResultatTri, enAttente: number) {
  const cellule = `padding:8px 10px 8px 0;border-top:1px solid ${c.filet};font-size:14px`;
  const lignes = r.lignes
    .map(
      (l) =>
        `<tr><td style="${cellule}">${echapper(l.nom)}</td><td style="${cellule};text-align:right">${mois(l.moisDeStock)}</td><td style="${cellule};text-align:right">${euros(l.argentQuiDort)}</td><td style="${cellule}"><strong>${VERDICT[l.verdict]}</strong>${l.margeARegarder ? `<br><span style="font-size:12px;color:${c.secondaire}">marge au-dessus de votre moyenne</span>` : ""}</td></tr>`,
    )
    .join("");
  const entete = `padding:0 10px 8px 0;font-size:12px;text-align:left;color:${c.secondaire};font-weight:normal`;
  return gabarit(c, [
    p(echapper(bonjour(prenom))),
    p(
      `Voici votre grille de tri, avec vos ${r.lignes.length} marques. Le tableur est en pièce jointe : vous pouvez le refaire avant chaque salon.`,
    ),
    p(echapper(resumeMarques(r)), `padding:14px 16px;background:${c.encadre};border-radius:12px`),
    `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0 0 18px"><tr><th style="${entete}">Marque</th><th style="${entete};text-align:right">Mois de stock</th><th style="${entete};text-align:right">Argent qui dort</th><th style="${entete}">Verdict</th></tr>${lignes}</table>`,
    ...(enAttente > 0
      ? [
          p(
            `Avec les ${euros(enAttente)} de mutuelles pas encore encaissés, cela fait <strong>${euros(r.argentQuiDort + enAttente)}</strong> qui ne sont pas sur votre compte.`,
          ),
        ]
      : []),
    p(
      `${echapper(PONT)} Si vous voulez voir ce que ça donne chez vous, <a href="${echapper(lienRdv("tri-des-marques"))}" style="color:${c.lien}">prenez 15 minutes avec moi</a>.`,
    ),
    p(
      `<a href="${SITE}/outils/tri-des-marques" style="color:${c.lien}">Refaire la grille</a>`,
      `font-size:14px;color:${c.secondaire}`,
    ),
    p(`Paul<br><span style="color:${c.secondaire}">Granit</span>`, "margin-bottom:0"),
  ]);
}

/**
 * La grille en CSV, lisible par Excel en français : point-virgule, virgule
 * décimale, BOM UTF-8 (sans lui, Excel lit les accents de travers).
 */
export function csvMarques(r: ResultatTri) {
  const champ = (v: string | number) => {
    // Une cellule qui commence par = + - @ serait lue comme une formule par Excel.
    const s = String(v).replace(/^([=+\-@])/, "'$1");
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const nombre = (n: number, d = 0) => (Number.isFinite(n) ? n.toFixed(d).replace(".", ",") : "");
  const lignes = [
    [
      "Marque",
      "Pièces en stock",
      "Vendues sur 12 mois",
      "Prix d'achat moyen (€)",
      "Marge (%)",
      "Mois de stock",
      "Part des ventes (%)",
      "Argent qui dort (€)",
      "Verdict",
    ],
    ...r.lignes.map((l) => [
      l.nom,
      l.stock,
      l.ventes,
      nombre(l.prixAchat, 2),
      l.marge == null ? "" : nombre(l.marge),
      nombre(l.moisDeStock, 1),
      nombre(l.partDesVentes * 100),
      nombre(l.argentQuiDort),
      VERDICT[l.verdict],
    ]),
  ];
  return "﻿" + lignes.map((l) => l.map(champ).join(";")).join("\r\n") + "\r\n";
}

/* ------------------------------------------------------------------ */
/* Heures de décembre                                                  */
/* ------------------------------------------------------------------ */

export const OBJET_HEURES = "Vos heures de tiers payant d'ici Noël";

/**
 * Ce qui peut sortir du comptoir : uniquement des tâches que TON.md attribue
 * aux agents (saisir la PEC, relancer, pointer les virements, facturer).
 */
export const TACHES_DECEMBRE = [
  "saisir les demandes de prise en charge sur les portails ;",
  "relancer les mutuelles qui n'ont pas répondu ;",
  "pointer les virements reçus ;",
  "reprendre les dossiers rejetés.",
];

function resumeHeures(s: SaisieHeures, r: ResultatHeures) {
  return `Votre calcul : ${Math.round(r.heures).toLocaleString("fr-FR")} heures d'ici Noël, l'équivalent de ${dimanchesEnMots(r.dimanches)} de travail d'une personne (${Math.round(r.dossiers).toLocaleString("fr-FR")} dossiers en tiers payant sur ${s.semaines} semaines, à ${s.minutesParDossier} minutes chacun).`;
}

const SUITE_HEURES =
  "C'est ce que font nos agents chez Granit, dans les logiciels que vous utilisez déjà.";

export function texteHeures(prenom: string, s: SaisieHeures, r: ResultatHeures) {
  return [
    bonjour(prenom),
    "",
    resumeHeures(s, r),
    "",
    "Ce qui peut sortir du comptoir en décembre :",
    ...TACHES_DECEMBRE.map((t) => `- ${t}`),
    "",
    SUITE_HEURES,
    `Si vous voulez voir ce qu'ils peuvent reprendre avant Noël, prenez 15 minutes avec moi : ${lienRdv("heures-de-decembre")}`,
    "",
    "Paul",
    "Granit",
  ].join("\n");
}

export function htmlHeures(c: CouleursMail, prenom: string, s: SaisieHeures, r: ResultatHeures) {
  return gabarit(c, [
    p(echapper(bonjour(prenom))),
    p(echapper(resumeHeures(s, r)), `padding:14px 16px;background:${c.encadre};border-radius:12px`),
    p("Ce qui peut sortir du comptoir en décembre :", "margin-bottom:8px"),
    `<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.6">${TACHES_DECEMBRE.map((t) => `<li>${echapper(t)}</li>`).join("")}</ul>`,
    p(
      `${echapper(SUITE_HEURES)} Si vous voulez voir ce qu'ils peuvent reprendre avant Noël, <a href="${echapper(lienRdv("heures-de-decembre"))}" style="color:${c.lien}">prenez 15 minutes avec moi</a>.`,
    ),
    p(`Paul<br><span style="color:${c.secondaire}">Granit</span>`, "margin-bottom:0"),
  ]);
}
