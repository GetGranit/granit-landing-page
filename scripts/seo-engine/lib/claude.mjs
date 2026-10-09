// Appel à l'API Anthropic en streaming (évite les coupures sur les longs articles),
// sortie imposée par un schéma JSON. fetch natif, aucune dépendance.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const API = "https://api.anthropic.com/v1/messages";

/** Clé lue dans ANTHROPIC_API_KEY, sinon dans ~/.config/granit/anthropic.key (en local). */
export function apiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  const local = join(process.env.HOME ?? "", ".config/granit/anthropic.key");
  if (existsSync(local)) return readFileSync(local, "utf8").trim();
  throw new Error("ANTHROPIC_API_KEY manquante");
}

/**
 * @returns {{ json: object, stopReason: string, usage: object }}
 */
export async function rediger({ apiKey, model, maxTokens, system, message, schema }) {
  const r = await fetch(API, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream: true,
      // le guide ne change pas d'un article à l'autre : mis en cache
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: message }],
      output_config: { format: { type: "json_schema", schema } },
    }),
  });
  if (!r.ok) {
    const corps = await r.text();
    // jamais la clé dans les logs : on ne renvoie que le message d'erreur de l'API
    let msg = corps;
    try {
      msg = JSON.parse(corps).error?.message ?? corps;
    } catch {}
    throw new Error(`API Anthropic ${r.status} : ${msg.slice(0, 500)}`);
  }

  // Lecture des événements SSE. On ne garde que les blocs de type text
  // (le premier bloc peut être un bloc de raisonnement).
  const blocs = [];
  let stopReason = null;
  const usage = {};
  let tampon = "";
  const decodeur = new TextDecoder();

  for await (const morceau of r.body) {
    tampon += decodeur.decode(morceau, { stream: true });
    let fin;
    while ((fin = tampon.indexOf("\n\n")) >= 0) {
      const evt = tampon.slice(0, fin);
      tampon = tampon.slice(fin + 2);
      const ligne = evt.split("\n").find((l) => l.startsWith("data: "));
      if (!ligne) continue;
      const d = JSON.parse(ligne.slice(6));
      switch (d.type) {
        case "message_start":
          Object.assign(usage, d.message.usage);
          break;
        case "content_block_start":
          blocs[d.index] = { type: d.content_block.type, text: d.content_block.text ?? "" };
          break;
        case "content_block_delta":
          if (d.delta.type === "text_delta") blocs[d.index].text += d.delta.text;
          break;
        case "message_delta":
          stopReason = d.delta.stop_reason ?? stopReason;
          Object.assign(usage, d.usage);
          break;
        case "error":
          throw new Error(`API Anthropic (flux) : ${d.error?.message ?? JSON.stringify(d.error)}`);
      }
    }
  }

  const texte = blocs.filter((b) => b?.type === "text").map((b) => b.text).join("");
  if (stopReason !== "end_turn") {
    return { json: null, stopReason, usage, brut: texte };
  }
  let json;
  try {
    json = JSON.parse(texte);
  } catch (e) {
    return { json: null, stopReason: `json_invalide (${e.message})`, usage, brut: texte };
  }
  return { json, stopReason, usage };
}

// $ par million de tokens (platform.claude.com/docs/en/about-claude/pricing, relevé le 07/10/2026)
const TARIFS = {
  "claude-sonnet-5": { entree: 2, ecritureCache: 2.5, lectureCache: 0.2, sortie: 10 },
  "claude-opus-5-5": { entree: 4, ecritureCache: 5, lectureCache: 0.2, sortie: 20 },
};

export function coutDollars(u, model) {
  const t = TARIFS[model];
  if (!t) return NaN;
  return (
    ((u.input_tokens ?? 0) * t.entree +
      (u.cache_creation_input_tokens ?? 0) * t.ecritureCache +
      (u.cache_read_input_tokens ?? 0) * t.lectureCache +
      (u.output_tokens ?? 0) * t.sortie) /
    1e6
  );
}
