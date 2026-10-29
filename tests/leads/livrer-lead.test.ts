// `node --experimental-strip-types --test tests/leads/*.test.ts`
// Livraison des leads du site : webhook B11 d'abord, mail de secours sinon.
import { test } from "node:test";
import assert from "node:assert/strict";
import { livrerLead, type LeadPayload } from "../../src/lib/livrerLead.ts";

const lead: LeadPayload = {
  name: "Camille Test",
  email: "camille@example.com",
  phone: "",
  company: "Optique Test",
  orgType: "3",
  challenge: "Les rejets",
  source: "getgranit.ai",
  utm: "",
  submittedAt: "2026-10-29T18:00:00.000Z",
};

type Appel = { url: string; body: Record<string, unknown> };

function faux(reponses: Record<string, Response>) {
  const appels: Appel[] = [];
  const f = (async (url: string, init?: RequestInit) => {
    appels.push({ url, body: JSON.parse(String(init?.body ?? "{}")) });
    const r = reponses[url];
    if (!r) throw new Error(`réseau injoignable : ${url}`);
    return r;
  }) as typeof fetch;
  return { f, appels };
}

const WEBHOOK = "https://n8n.test/webhook/leads";
const RESEND = "https://api.resend.com/emails";

test("webhook OK : pas de mail de secours", async () => {
  const { f, appels } = faux({ [WEBHOOK]: new Response('{"ok":true}') });
  const r = await livrerLead(lead, { webhook: WEBHOOK, resendKey: "re_x", fetch: f });
  assert.equal(r.via, "webhook");
  assert.equal(appels.length, 1);
});

test("webhook en 500 (n8n en panne) : le lead part par mail à paul@", async () => {
  const { f, appels } = faux({
    [WEBHOOK]: new Response('{"code":0}', { status: 500 }),
    [RESEND]: new Response('{"id":"1"}'),
  });
  const r = await livrerLead(lead, { webhook: WEBHOOK, resendKey: "re_x", fetch: f });
  assert.equal(r.via, "secours");
  const mail = appels[1].body;
  assert.deepEqual(mail.to, ["paul@getgranit.ai"]);
  assert.equal(mail.reply_to, "camille@example.com");
  assert.match(String(mail.subject), /Camille Test \(Optique Test\)/);
  assert.match(String(mail.text), /Webhook responded 500/);
  assert.match(String(mail.text), /Les rejets/);
});

test("webhook qui refuse le lead (ok:false) : mail de secours", async () => {
  const { f } = faux({
    [WEBHOOK]: new Response('{"ok":false,"error":"refus"}'),
    [RESEND]: new Response("{}"),
  });
  const r = await livrerLead(lead, { webhook: WEBHOOK, resendKey: "re_x", fetch: f });
  assert.equal(r.via, "secours");
});

test("webhook injoignable : mail de secours", async () => {
  const { f } = faux({ [RESEND]: new Response("{}") });
  const r = await livrerLead(lead, { webhook: WEBHOOK, resendKey: "re_x", fetch: f });
  assert.equal(r.via, "secours");
});

test("webhook et mail en échec : erreur montrée au visiteur", async () => {
  const { f } = faux({
    [WEBHOOK]: new Response("", { status: 500 }),
    [RESEND]: new Response('{"message":"domaine"}', { status: 403 }),
  });
  await assert.rejects(
    livrerLead(lead, { webhook: WEBHOOK, resendKey: "re_x", fetch: f }),
    /Webhook responded 500 ; secours : Resend responded 403/,
  );
});

test("webhook en échec sans clé Resend : erreur", async () => {
  const { f } = faux({ [WEBHOOK]: new Response("", { status: 500 }) });
  await assert.rejects(livrerLead(lead, { webhook: WEBHOOK, fetch: f }), /Webhook responded 500/);
});

test("rien de configuré (local) : pas d'erreur, rien envoyé", async () => {
  const { f, appels } = faux({});
  const r = await livrerLead(lead, { fetch: f });
  assert.equal(r.delivered, false);
  assert.equal(appels.length, 0);
});
