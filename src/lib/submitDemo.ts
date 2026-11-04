import { createServerFn } from "@tanstack/react-start";

import { livrerLead } from "@/lib/livrerLead";

export type DemoLead = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  orgType?: string;
  challenge?: string;
  /** Where the lead came from. Defaults to the site itself; landing pages
   *  (salons, campagnes) passent leur propre valeur pour être filtrables. */
  source?: string;
  /** Paramètres utm_* du lien d'arrivée (voir attribution.ts), ex. le post d'un apporteur. */
  utm?: string;
};

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Receives a demo request and forwards it to the configured CRM/Sheet webhook.
 * The destination is a single webhook URL (Zapier/Make catch hook, an Airtable
 * or Google Sheet automation, etc.) set via the DEMO_WEBHOOK_URL env var, so it
 * is never exposed client-side and the tool can be swapped without code changes.
 * Si le webhook échoue, le lead part par mail de secours (voir livrerLead.ts).
 */
export const submitDemo = createServerFn({ method: "POST" })
  .inputValidator((data: DemoLead) => {
    const name = (data.name ?? "").trim();
    const email = (data.email ?? "").trim();
    if (name.length < 1) throw new Error("Le nom est requis.");
    if (!emailRe.test(email)) throw new Error("Email invalide.");
    return {
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      phone: (data.phone ?? "").trim().slice(0, 50),
      company: (data.company ?? "").trim().slice(0, 200),
      orgType: (data.orgType ?? "").trim().slice(0, 100),
      challenge: (data.challenge ?? "").trim().slice(0, 2000),
      source: (data.source ?? "").trim().slice(0, 100),
      utm: (data.utm ?? "").trim().slice(0, 400),
    };
  })
  .handler(async ({ data }) =>
    livrerLead(
      { ...data, source: data.source || "getgranit.ai", submittedAt: new Date().toISOString() },
      { webhook: process.env.DEMO_WEBHOOK_URL, resendKey: process.env.RESEND_API_KEY },
    ),
  );
