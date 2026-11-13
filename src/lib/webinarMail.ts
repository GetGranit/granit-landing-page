import { lienGoogle, lienOutlook } from "@/lib/webinarAgenda";
import { MEET_TEL, MEET_URL } from "@/lib/webinarIa";

/**
 * Contenu du mail de confirmation du webinar (HTML et texte brut), séparé de
 * l'envoi (webinarConfirmation.ts) pour pouvoir le relire hors du serveur.
 *
 * Marque (DESIGN.md) : un mail n'a pas de police web (Helvetica/Arial pour le texte) et gère mal la
 * transparence, donc les jetons sont en hex pleins. Les deux valeurs calculées sont des jetons
 * aplatis sur le papier : #62716E = texte-secondaire (encre à 70 %), #E4E5E4 = filet (encre à 12 %).
 */
export const MAIL = {
  fond: "#FAF0F2", // rosé
  carte: "#FFFDFD", // papier
  encadre: "#FAEAEF", // blush (forme : fond de l'encadré date)
  texte: "#1F3530", // encre
  secondaire: "#62716E", // texte-secondaire sur papier
  filet: "#E4E5E4", // filet sur papier
  lien: "#2F7A64", // profond
};

export const OBJET = "C'est noté : webinar IA en magasin, vendredi 13 novembre à 13h15";

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const bonjour = (prenom: string) => (prenom ? `Bonjour ${prenom},` : "Bonjour,");

export function corpsTexte(prenom: string) {
  return [
    bonjour(prenom),
    "",
    "C'est noté, votre place est réservée pour le webinar « 5 usages concrets de l'IA pour gagner du temps en magasin ».",
    "",
    "Vendredi 13 novembre, 13h15 – 14h (45 min), en ligne.",
    "",
    "Au programme : analyser vos avis Google, créer vos modèles de mails, suivre vos impayés mutuelles à partir d'un export Excel… et deux surprises gardées pour la fin.",
    "",
    MEET_URL
      ? `Lien de connexion : ${MEET_URL}`
      : "Le lien de connexion vous sera envoyé par mail avant le webinar.",
    `Ou par téléphone : ${MEET_TEL}`,
    "",
    "Ajoutez-le à votre agenda :",
    `- Google Agenda : ${lienGoogle()}`,
    `- Outlook : ${lienOutlook()}`,
    "- Apple / iPhone : ouvrez l'invitation jointe à ce mail.",
    "",
    "Vous ne pourrez pas être là ? Pas de souci, le replay vous sera envoyé.",
    "",
    "À vendredi 13,",
    "Paul",
    "Granit",
  ].join("\n");
}

export function corpsHtml(prenom: string) {
  const lien = (href: string, texte: string) =>
    `<a href="${echapper(href)}" style="display:inline-block;padding:10px 16px;margin:0 6px 8px 0;border:1px solid ${MAIL.filet};border-radius:999px;color:${MAIL.texte};text-decoration:none;font-weight:600;font-size:14px">${texte}</a>`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:${MAIL.fond};font-family:Helvetica,Arial,sans-serif;color:${MAIL.texte}">
<div style="max-width:560px;margin:0 auto;padding:28px 20px">
<div style="background:${MAIL.carte};border-radius:14px;padding:28px 24px">
<p style="margin:0 0 16px;font-size:15px">${echapper(bonjour(prenom))}</p>
<p style="margin:0 0 18px;font-size:15px;line-height:1.55">C'est noté, votre place est réservée pour le webinar <strong>« 5 usages concrets de l'IA pour gagner du temps en magasin »</strong>.</p>
<p style="margin:0 0 18px;padding:14px 16px;background:${MAIL.encadre};border-radius:12px;font-size:15px;line-height:1.5"><strong>Vendredi 13 novembre, 13h15 – 14h</strong><br>45 min · en ligne · gratuit</p>
<p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:${MAIL.secondaire}">Au programme : analyser vos avis Google, créer vos modèles de mails, suivre vos impayés mutuelles à partir d'un export Excel… et deux surprises gardées pour la fin.</p>
<p style="margin:0 0 18px;font-size:14.5px;line-height:1.55">${
    MEET_URL
      ? `Lien de connexion : <a href="${echapper(MEET_URL)}" style="color:${MAIL.lien}">${echapper(MEET_URL)}</a>`
      : "Le lien de connexion vous sera envoyé par mail avant le webinar."
  }<br><span style="font-size:13px;color:${MAIL.secondaire}">Ou par téléphone : ${echapper(MEET_TEL)}</span></p>
<p style="margin:0 0 10px;font-size:14.5px;font-weight:600">Ajoutez-le à votre agenda :</p>
<div>${lien(lienGoogle(), "Google Agenda")}${lien(lienOutlook(), "Outlook")}</div>
<p style="margin:4px 0 18px;font-size:13px;color:${MAIL.secondaire}">Apple / iPhone : ouvrez l'invitation jointe à ce mail.</p>
<p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:${MAIL.secondaire}">Vous ne pourrez pas être là ? Pas de souci, le replay vous sera envoyé.</p>
<p style="margin:0;font-size:15px;line-height:1.5">À vendredi 13,<br>Paul<br><span style="color:${MAIL.secondaire}">Granit</span></p>
</div></div></body></html>`;
}
