import { createServerFn } from "@tanstack/react-start";

import { livrerLead } from "@/lib/livrerLead";
import { NEWSLETTER_OUVERTE } from "./marque";

export type Abonnement = {
  email: string;
  /** Doit valoir vrai : la personne a vu le texte de consentement. */
  consentement: boolean;
  utm?: string;
};

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Inscription à la newsletter, livrée comme un lead (voir livrerLead.ts), sans nouveau secret.
 * Une fonction serveur reste un POST vivant même quand le composant est masqué : d'où le refus
 * tant que la newsletter est fermée. Aucun lien avec un outil d'envoi.
 */
export const sAbonner = createServerFn({ method: "POST" })
  .inputValidator((data: Abonnement) => {
    const email = (data.email ?? "").trim();
    if (!emailRe.test(email)) throw new Error("Email invalide.");
    if (data.consentement !== true) throw new Error("Consentement requis.");
    return { email: email.slice(0, 200), utm: (data.utm ?? "").trim().slice(0, 400) };
  })
  .handler(async ({ data }) => {
    if (!NEWSLETTER_OUVERTE) throw new Error("Newsletter fermée.");
    return livrerLead(
      {
        name: data.email,
        email: data.email,
        phone: "",
        company: "",
        orgType: "",
        challenge: "",
        source: "actualites-newsletter",
        utm: data.utm,
        submittedAt: new Date().toISOString(),
      },
      { webhook: process.env.DEMO_WEBHOOK_URL, resendKey: process.env.RESEND_API_KEY },
    );
  });
