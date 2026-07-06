import { createServerFn } from "@tanstack/react-start";

export type DemoLead = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  orgType?: string;
  challenge?: string;
};

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Receives a demo request and forwards it to the configured CRM/Sheet webhook.
 * The destination is a single webhook URL (Zapier/Make catch hook, an Airtable
 * or Google Sheet automation, etc.) set via the DEMO_WEBHOOK_URL env var, so it
 * is never exposed client-side and the tool can be swapped without code changes.
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
    };
  })
  .handler(async ({ data }) => {
    const webhook = process.env.DEMO_WEBHOOK_URL;
    const payload = {
      ...data,
      source: "getgranit.ai",
      submittedAt: new Date().toISOString(),
    };

    if (!webhook) {
      // No destination configured yet — log so leads aren't silently lost in dev.
      console.log("[demo-lead] DEMO_WEBHOOK_URL not set — lead captured but not delivered:", payload);
      return { ok: true as const, delivered: false as const };
    }

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Webhook responded ${res.status}`);
    }
    return { ok: true as const, delivered: true as const };
  });
