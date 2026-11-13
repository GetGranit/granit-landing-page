import { createServerFn } from "@tanstack/react-start";

import { MAIL } from "@/lib/webinarMail";
import {
  MAX_MARQUES,
  compterHeures,
  trierMarques,
  type LigneMarque,
  type SaisieHeures,
} from "./calculs.ts";
import {
  OBJET_HEURES,
  OBJET_MARQUES,
  csvMarques,
  htmlHeures,
  htmlMarques,
  texteHeures,
  texteMarques,
} from "./mailOutils.ts";

/**
 * Mail envoyé à l'opticien après le formulaire d'un outil : sa grille de tri
 * (avec le tableur en pièce jointe) ou son calcul d'heures. Envoyé par Resend
 * depuis le serveur du site, comme la confirmation du webinar : même
 * sous-domaine d'envoi, réponses vers paul@. Sans RESEND_API_KEY, rien ne
 * part ; le lead, lui, est déjà livré par submitDemo.
 *
 * Le texte du mail est fixe. Seuls le prénom, les noms de marques (nettoyés,
 * 40 caractères au plus) et les chiffres viennent du navigateur, et tous les
 * totaux sont recalculés ici : on ne peut pas faire dire autre chose au mail.
 */

const EXPEDITEUR = "Paul de Granit <outils@notifications.getgranit.ai>";
const REPONDRE_A = "paul@getgranit.ai";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Ce que l'outil envoie pour écrire le mail ; le prénom et l'adresse viennent du formulaire. */
export type CorpsMailOutil =
  | { outil: "tri-des-marques"; marques: LigneMarque[]; enAttente?: number }
  | { outil: "heures-de-decembre"; saisie: SaisieHeures };
export type DemandeMailOutil = CorpsMailOutil & { name: string; email: string };

const nombre = (n: unknown, max: number) => {
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? Math.min(max, v) : 0;
};

export const envoyerMailOutil = createServerFn({ method: "POST" })
  .inputValidator((data: DemandeMailOutil) => {
    const email = String(data.email ?? "").trim().slice(0, 200);
    if (!emailRe.test(email)) throw new Error("Email invalide.");
    const prenom =
      String(data.name ?? "")
        .replace(/[^\p{L}' -]/gu, "")
        .trim()
        .split(/\s+/)[0]
        ?.slice(0, 40) || "";

    if (data.outil === "tri-des-marques") {
      const marques = (Array.isArray(data.marques) ? data.marques : [])
        .slice(0, MAX_MARQUES)
        .map((m) => ({
          nom: String(m?.nom ?? ""),
          stock: nombre(m?.stock, 100_000),
          ventes: nombre(m?.ventes, 1_000_000),
          prixAchat: nombre(m?.prixAchat, 10_000),
          marge: m?.marge == null ? null : nombre(m.marge, 100),
        }));
      return {
        outil: data.outil,
        email,
        prenom,
        marques,
        enAttente: nombre(data.enAttente, 100_000_000),
      };
    }
    if (data.outil === "heures-de-decembre") {
      const s = data.saisie ?? ({} as SaisieHeures);
      return {
        outil: data.outil,
        email,
        prenom,
        saisie: {
          ventesParSemaine: nombre(s.ventesParSemaine, 100_000),
          partTiersPayant: nombre(s.partTiersPayant, 100),
          minutesParDossier: nombre(s.minutesParDossier, 240),
          semaines: Math.round(nombre(s.semaines, 52)),
        },
      };
    }
    throw new Error("Outil inconnu.");
  })
  .handler(async ({ data }) => {
    const cle = process.env.RESEND_API_KEY;
    if (!cle) {
      console.log("[mail-outil] RESEND_API_KEY absente : pas de mail envoyé.");
      return { envoye: false as const };
    }

    let message: { subject: string; html: string; text: string; attachments?: unknown[] };
    if (data.outil === "tri-des-marques") {
      const r = trierMarques(data.marques);
      if (!r.lignes.length) throw new Error("Aucune marque à envoyer.");
      message = {
        subject: OBJET_MARQUES,
        html: htmlMarques(MAIL, data.prenom, r, data.enAttente),
        text: texteMarques(data.prenom, r, data.enAttente),
        attachments: [
          {
            filename: "tri-des-marques.csv",
            content: Buffer.from(csvMarques(r), "utf8").toString("base64"),
            content_type: "text/csv; charset=utf-8",
          },
        ],
      };
    } else {
      const r = compterHeures(data.saisie);
      message = {
        subject: OBJET_HEURES,
        html: htmlHeures(MAIL, data.prenom, data.saisie, r),
        text: texteHeures(data.prenom, data.saisie, r),
      };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${cle}`,
        "content-type": "application/json",
        // Le pare-feu devant l'API Resend rejette (403, sans message) les appels anonymes.
        "user-agent": "granit-landing-page/1.0 (+https://www.getgranit.ai)",
      },
      body: JSON.stringify({
        from: EXPEDITEUR,
        to: [data.email],
        reply_to: REPONDRE_A,
        ...message,
      }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300).replace(/\s+/g, " ").trim();
      console.error("[mail-outil] Resend a refusé l'envoi :", res.status, detail);
      // La raison remonte jusqu'à PostHog (événement lm_mail_envoye) : c'est là qu'on la lit.
      throw new Error(`Resend responded ${res.status} : ${detail.slice(0, 200) || "corps vide"}`);
    }
    return { envoye: true as const };
  });
