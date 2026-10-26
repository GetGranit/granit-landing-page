import { createServerFn } from "@tanstack/react-start";

import { fichierIcs } from "@/lib/webinarAgenda";
import { OBJET, corpsHtml, corpsTexte } from "@/lib/webinarMail";

/**
 * Mail de confirmation d'inscription au webinar, envoyé par Resend depuis le
 * serveur du site, sans passer par n8n. Le domaine getgranit.ai est déjà
 * vérifié chez Resend (l'appli l'utilise). Sans RESEND_API_KEY, rien ne part :
 * l'inscription n'en dépend pas.
 *
 * Le contenu (webinarMail.ts) est fixe ; seuls le prénom et l'adresse viennent
 * du formulaire.
 */

const EXPEDITEUR = "Paul de Granit <paul@getgranit.ai>";
const REPONDRE_A = "paul@getgranit.ai";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const envoyerConfirmationWebinar = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; email: string }) => {
    const email = (data.email ?? "").trim().slice(0, 200);
    if (!emailRe.test(email)) throw new Error("Email invalide.");
    const prenom = (data.name ?? "").trim().split(/\s+/)[0]?.slice(0, 60) || "";
    return { email, prenom };
  })
  .handler(async ({ data }) => {
    const cle = process.env.RESEND_API_KEY;
    if (!cle) {
      console.log("[webinar-confirmation] RESEND_API_KEY absente : pas de mail envoyé.");
      return { envoye: false as const };
    }
    const prenom = data.prenom;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${cle}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: EXPEDITEUR,
        to: [data.email],
        reply_to: REPONDRE_A,
        subject: OBJET,
        html: corpsHtml(prenom),
        text: corpsTexte(prenom),
        attachments: [
          {
            filename: "webinar-granit-26-novembre.ics",
            content: Buffer.from(fichierIcs(), "utf8").toString("base64"),
            content_type: "text/calendar; charset=utf-8; method=PUBLISH",
          },
        ],
      }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      console.error("[webinar-confirmation] Resend a refusé l'envoi :", res.status, detail);
      throw new Error(`Resend responded ${res.status}`);
    }
    return { envoye: true as const };
  });
