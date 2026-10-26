import { lienGoogle, lienOutlook } from "@/lib/webinarAgenda";
import { MEET_URL } from "@/lib/webinarIa";

/**
 * Contenu du mail de confirmation du webinar (HTML et texte brut), séparé de
 * l'envoi (webinarConfirmation.ts) pour pouvoir le relire hors du serveur.
 */

export const OBJET = "C'est noté : webinar IA en magasin, jeudi 26 novembre à 13h15";

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const bonjour = (prenom: string) => (prenom ? `Bonjour ${prenom},` : "Bonjour,");

export function corpsTexte(prenom: string) {
  return [
    bonjour(prenom),
    "",
    "C'est noté, votre place est réservée pour le webinar « 5 usages concrets de l'IA pour gagner du temps en magasin ».",
    "",
    "Jeudi 26 novembre, 13h15 – 14h (45 min), en ligne.",
    "",
    "Au programme : analyser vos avis Google, créer vos modèles de mails, suivre vos impayés mutuelles à partir d'un export Excel… et deux surprises gardées pour la fin.",
    "",
    MEET_URL
      ? `Lien de connexion : ${MEET_URL}`
      : "Le lien de connexion vous sera envoyé par mail avant le webinar.",
    "",
    "Ajoutez-le à votre agenda :",
    `- Google Agenda : ${lienGoogle()}`,
    `- Outlook : ${lienOutlook()}`,
    "- Apple / iPhone : ouvrez l'invitation jointe à ce mail.",
    "",
    "Vous ne pourrez pas être là ? Pas de souci, le replay vous sera envoyé.",
    "",
    "À jeudi 26,",
    "Paul",
    "Granit",
  ].join("\n");
}

export function corpsHtml(prenom: string) {
  const lien = (href: string, texte: string) =>
    `<a href="${echapper(href)}" style="display:inline-block;padding:10px 16px;margin:0 6px 8px 0;border:1px solid #e3d9cf;border-radius:999px;color:#1a1612;text-decoration:none;font-weight:600;font-size:14px">${texte}</a>`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f6f1ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1a1612">
<div style="max-width:560px;margin:0 auto;padding:28px 20px">
<div style="background:#ffffff;border-radius:16px;padding:28px 24px">
<p style="margin:0 0 16px;font-size:15px">${echapper(bonjour(prenom))}</p>
<p style="margin:0 0 18px;font-size:15px;line-height:1.55">C'est noté, votre place est réservée pour le webinar <strong>« 5 usages concrets de l'IA pour gagner du temps en magasin »</strong>.</p>
<p style="margin:0 0 18px;padding:14px 16px;background:#fdf0e8;border-radius:12px;font-size:15px;line-height:1.5">📅 <strong>Jeudi 26 novembre, 13h15 – 14h</strong><br>45 min · en ligne · gratuit</p>
<p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:#4a423b">Au programme : analyser vos avis Google, créer vos modèles de mails, suivre vos impayés mutuelles à partir d'un export Excel… et deux surprises gardées pour la fin.</p>
<p style="margin:0 0 18px;font-size:14.5px;line-height:1.55">${
    MEET_URL
      ? `Lien de connexion : <a href="${echapper(MEET_URL)}" style="color:#d9583f">${echapper(MEET_URL)}</a>`
      : "Le lien de connexion vous sera envoyé par mail avant le webinar."
  }</p>
<p style="margin:0 0 10px;font-size:14.5px;font-weight:600">Ajoutez-le à votre agenda :</p>
<div>${lien(lienGoogle(), "📅 Google Agenda")}${lien(lienOutlook(), "Outlook")}</div>
<p style="margin:4px 0 18px;font-size:13px;color:#7a7067">Apple / iPhone : ouvrez l'invitation jointe à ce mail.</p>
<p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:#4a423b">Vous ne pourrez pas être là ? Pas de souci, le replay vous sera envoyé.</p>
<p style="margin:0;font-size:15px;line-height:1.5">À jeudi 26,<br>Paul<br><span style="color:#7a7067">Granit</span></p>
</div></div></body></html>`;
}
