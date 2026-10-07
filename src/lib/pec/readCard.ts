import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Lecture d'une carte de tiers payant pour le lead magnet /pec.
 *
 * La photo est la carte d'un patient : donnée de santé. Elle ne fait que
 * traverser cette fonction (mémoire → API Anthropic → oubli) : aucun stockage,
 * aucun log de son contenu, et on ne demande au modèle QUE l'organisme et les
 * champs tiers payant, jamais l'identité ni le NIR. Le prompt reprend la partie
 * « organisme + tp » de granit_shared/medical_file_ocr/mutuelle_card.py
 * (GetGranit/granit@d016145), plus la date de fin de droits.
 */

/** Sortie du modèle : chaînes vides quand rien n'est lu (comme le produit). */
const RawCardSchema = z.object({
  est_carte_tp: z.boolean(),
  lisible: z.boolean(),
  assureur: z.string(),
  gestionnaire: z.string(),
  reseau: z.string(),
  tp_optique: z.string(),
  amc: z.string(),
  amc_candidates: z.array(z.string()),
  fin_droits: z.string(),
});
type RawCard = z.infer<typeof RawCardSchema>;

export type CardRead = {
  est_carte_tp: boolean;
  lisible: boolean;
  assureur: string | null;
  gestionnaire: string | null;
  reseau: string | null;
  tp_optique: string | null;
  amc: string | null;
  amc_candidates?: string[] | null;
  fin_droits: string | null;
};

const orNull = (v: string) => (v.trim() ? v.trim() : null);
function normalize(r: RawCard): CardRead {
  return {
    est_carte_tp: r.est_carte_tp,
    lisible: r.lisible,
    assureur: orNull(r.assureur),
    gestionnaire: orNull(r.gestionnaire),
    reseau: orNull(r.reseau),
    tp_optique: orNull(r.tp_optique),
    amc: orNull(r.amc),
    amc_candidates: r.amc_candidates.map((x) => x.trim()).filter(Boolean),
    fin_droits: orNull(r.fin_droits),
  };
}

const MAX_BYTES = 5 * 1024 * 1024;
const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type MediaType = (typeof MEDIA_TYPES)[number];

const PROMPT = `Tu lis une CARTE DE MUTUELLE / attestation de tiers-payant à partir de l'image jointe.
Extrais EXACTEMENT ce qui est écrit, sans jamais rien inventer. Mets une chaîne vide ""
pour toute information absente, illisible ou non demandée. Attention : la carte peut
être prise de travers ou pivotée de 90°.

CONFIDENTIALITÉ : ne recopie JAMAIS le nom, le prénom, le numéro de sécurité sociale,
la date de naissance, ni aucun numéro d'adhérent, de contrat ou de bénéficiaire, même
s'ils sont lisibles. Ces informations ne font pas partie de la sortie.

Commence par dire ce qu'est l'image :
- est_carte_tp : true si c'est une carte de mutuelle / attestation de tiers payant
  (complémentaire santé), false sinon (carte Vitale, ordonnance, autre document, photo
  sans carte).
- lisible : true si les noms d'organismes de la carte se lisent ; false si l'image est
  floue, coupée ou trop sombre pour les lire.
Si est_carte_tp est false ou lisible est false, laisse tous les autres champs vides.

Champs à extraire :
- assureur : l'organisme assureur / la mutuelle — le nom PRÉCIS (ex GROUPAMA NORD EST,
  MATMUT, KORELIO, GAN…), pas la fédération.
- gestionnaire : le gestionnaire / délégataire s'il diffère de l'assureur (souvent
  "Géré par X", "Gestion assurée par X", ou le logo de la plateforme de
  télétransmission : iSanté, SP santé, Viamédis…).
- reseau : le réseau de soins s'il est mentionné (Santéclair, Carte Blanche, Kalixia,
  Itelis…).
- amc_candidates : TOUS les noms d'organismes lisibles sur la carte (mutuelle ET
  groupe/fédération/gestionnaire). Des NOMS seulement, jamais de numéro de personne.
- amc : le N° AMC / N° mutuelle (le code AMC à ~8 chiffres) — c'est le code de
  l'organisme, pas celui de l'assuré.
- tp_optique : la plateforme de prise en charge (PEC / tiers payant) pour l'OPTIQUE.
  Méthode, dans cet ordre :
  1. Repère dans le tableau des garanties la colonne OPTIQUE — souvent abrégée : "OPTI",
     "KA/OG", ou une colonne COMBINÉE "OPTI AUDI" / "OptiAudi" / "OPTI AUDI SE/GG".
  2. La cellule contient souvent "PEC" suivi d'un renvoi entre parenthèses, ex "PEC (1)"
     ou "PEC (3)" : lis alors la NOTE DE BAS DE PAGE (souvent en petits caractères,
     parfois verticale sur le bord) portant ce numéro, et reporte la plateforme qu'elle
     nomme. Ex : "(3) PEC Optique : Kalixia (oxantis.net)" → tp_optique =
     "Kalixia (oxantis.net)".
  3. Si la note ne nomme pas de plateforme, utilise les logos / tampons / mentions de
     plateforme sur la carte : SP santé, Sévéane, iSanté, Viamédis, Almerys, Kalixia,
     Santéclair, TP+… Un suffixe de colonne peut aussi coder la plateforme (ex "SE/GG"
     = Sévéane / Grand Guichet).
  4. Beaucoup de cartes n'ont PAS de tableau par domaine : la plateforme de tiers payant
     est alors globale ("Gestion assurée par X", "Géré par X", un logo Viamédis /
     Almerys / Santéclair-TP+…) → reporte-la.
  5. Ne reporte JAMAIS le renvoi lui-même ("PEC (1)", "(3)", "PEC") : toujours le NOM
     de la plateforme résolue.
  6. Chaîne vide si la carte ne donne vraiment aucune indication pour l'optique.

- fin_droits : date de fin de validité de la carte au format JJ/MM/AAAA, chaîne vide si absente.

Réponds UNIQUEMENT par l'objet JSON demandé.`;

function toMediaType(t: string): MediaType {
  return (MEDIA_TYPES as readonly string[]).includes(t) ? (t as MediaType) : "image/jpeg";
}

export const readCard = createServerFn({ method: "POST" })
  .inputValidator((data: { image: string; mediaType: string }) => {
    const image = String(data?.image ?? "").replace(/^data:[^,]+,/, "");
    if (!image) throw new Error("Photo manquante.");
    if ((image.length * 3) / 4 > MAX_BYTES) throw new Error("Photo trop lourde.");
    return { image, mediaType: toMediaType(String(data?.mediaType ?? "")) };
  })
  .handler(
    async ({ data }): Promise<{ ok: true; card: CardRead } | { ok: false; reason: string }> => {
      if (!process.env.ANTHROPIC_API_KEY) {
        return { ok: false, reason: "lecture_indisponible" };
      }
      // Import dynamique : le SDK reste hors du bundle client.
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const { betaZodOutputFormat } = await import("@anthropic-ai/sdk/helpers/beta/zod");
      const client = new Anthropic({ timeout: 45_000, maxRetries: 1 });
      try {
        const res = await client.beta.messages.parse({
          model: process.env.PEC_CARD_MODEL || "claude-opus-5",
          max_tokens: 2000,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low", format: betaZodOutputFormat(RawCardSchema) },
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: data.mediaType, data: data.image },
                },
                { type: "text", text: PROMPT },
              ],
            },
          ],
        });
        if (res.stop_reason === "refusal" || !res.parsed_output) {
          return { ok: false, reason: "illisible" };
        }
        return { ok: true, card: normalize(res.parsed_output) };
      } catch (err) {
        // On ne journalise que le type d'erreur : jamais la requête (elle contient la photo).
        const status = err instanceof Anthropic.APIError ? err.status : undefined;
        console.error("[pec] lecture de carte en échec", { status });
        return { ok: false, reason: "erreur_lecture" };
      }
    },
  );
