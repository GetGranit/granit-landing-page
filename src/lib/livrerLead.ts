/**
 * Livraison d'un lead du site (démo, SILMO, affiliation, webinar, /pec).
 *
 * Chemin normal : le webhook B11 (n8n), qui crée la fiche Attio et prévient #gtm.
 * Chemin de secours : si le webhook est absent, en erreur ou refuse le lead, le
 * lead part par mail (Resend) à paul@, avec tous les champs. Du 15 au 29/10, n8n
 * a refusé toutes les exécutions et les leads ont été perdus : le visiteur voyait
 * une erreur et rien n'arrivait nulle part.
 *
 * Le visiteur ne voit une erreur que si les deux chemins échouent.
 *
 * Pas d'import TanStack ici : le module est testé tel quel par node --test.
 */

export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  orgType: string;
  challenge: string;
  source: string;
  utm: string;
  submittedAt: string;
};

export type Livraison =
  | { ok: true; delivered: true; via: "webhook" | "secours" }
  | { ok: true; delivered: false; via: "aucun" };

type Options = {
  webhook?: string;
  resendKey?: string;
  fetch?: typeof fetch;
};

const EXPEDITEUR = "Site Granit <leads@notifications.getgranit.ai>";
const DESTINATAIRE = "paul@getgranit.ai";

async function envoyerAuWebhook(webhook: string, payload: LeadPayload, f: typeof fetch) {
  const res = await f(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);

  // Un webhook peut répondre 200 en refusant le lead : le verdict est dans le
  // corps. Seul un `ok: false` explicite vaut échec, pas l'absence de verdict.
  let corps: { ok?: boolean; error?: string } | null = null;
  try {
    corps = JSON.parse(await res.text());
  } catch {
    // Réponse vide ou illisible : tous les webhooks ne renvoient pas du JSON.
  }
  if (corps?.ok === false) throw new Error(corps.error || "Webhook rejected the lead");
}

export function corpsMailSecours(payload: LeadPayload, raison: string) {
  const lignes = [
    `Nouveau lead du site, arrivé par le chemin de secours : il n'est PAS dans Attio.`,
    `Raison : ${raison}`,
    ``,
    `Source : ${payload.source}`,
    `Nom : ${payload.name}`,
    `Email : ${payload.email}`,
    `Téléphone : ${payload.phone || "-"}`,
    `Société : ${payload.company || "-"}`,
    `Profil / magasins : ${payload.orgType || "-"}`,
    `Message : ${payload.challenge || "-"}`,
    `UTM : ${payload.utm || "-"}`,
    `Reçu le : ${payload.submittedAt}`,
    ``,
    `À faire : créer la fiche dans Attio (liste Leads entrants) et recontacter.`,
  ];
  return lignes.join("\n");
}

async function envoyerParMail(
  payload: LeadPayload,
  raison: string,
  cle: string,
  f: typeof fetch,
) {
  const qui = payload.company ? `${payload.name} (${payload.company})` : payload.name;
  const res = await f("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${cle}`,
      "content-type": "application/json",
      // Le pare-feu devant l'API Resend rejette (403, sans message) les appels anonymes.
      "user-agent": "granit-landing-page/1.0 (+https://www.getgranit.ai)",
    },
    body: JSON.stringify({
      from: EXPEDITEUR,
      to: [DESTINATAIRE],
      reply_to: payload.email,
      subject: `[Site · secours] ${payload.source} : ${qui}`,
      text: corpsMailSecours(payload, raison),
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200).replace(/\s+/g, " ");
    throw new Error(`Resend responded ${res.status} : ${detail}`);
  }
}

export async function livrerLead(payload: LeadPayload, opts: Options): Promise<Livraison> {
  const f = opts.fetch ?? fetch;

  // En local, aucune destination n'est configurée : on garde le lead dans la
  // console pour ne pas casser les formulaires pendant le développement.
  if (!opts.webhook && !opts.resendKey) {
    console.log("[lead] ni DEMO_WEBHOOK_URL ni RESEND_API_KEY : lead non livré.", payload);
    return { ok: true, delivered: false, via: "aucun" };
  }
  let raison = "webhook non configuré (DEMO_WEBHOOK_URL absente)";

  if (opts.webhook) {
    try {
      await envoyerAuWebhook(opts.webhook, payload, f);
      return { ok: true, delivered: true, via: "webhook" };
    } catch (e) {
      raison = String((e as Error)?.message ?? e);
      console.error("[lead] webhook en échec, passage au mail de secours :", raison);
    }
  }

  if (!opts.resendKey) {
    console.error("[lead] RESEND_API_KEY absente : lead non livré.", raison);
    throw new Error(raison);
  }
  try {
    await envoyerParMail(payload, raison, opts.resendKey, f);
  } catch (e) {
    const echecMail = String((e as Error)?.message ?? e);
    console.error("[lead] mail de secours en échec aussi :", echecMail);
    throw new Error(`${raison} ; secours : ${echecMail}`);
  }
  return { ok: true, delivered: true, via: "secours" };
}
