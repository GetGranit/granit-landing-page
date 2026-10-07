import type { CardRead } from "@/lib/pec/readCard";
import type { Platform } from "@/lib/pec/resolve";
import type { SimResultat } from "./StepSimFin";

const CASE_KEY = "granit.pec.case";

/**
 * Laisse à /essai le cas fait sur /pec (contrat `PecCase` de essaiState.ts,
 * plus `compte`). Jamais de NIR, d'identité patient, d'identifiants de
 * portail ni de mot de passe : seulement la carte, le portail et les montants.
 */
export function ecrireCas(input: {
  source: "photo" | "exemple" | "saisie";
  email: string;
  card: CardRead | null;
  portail: Platform;
  r: SimResultat;
  apercu: boolean;
}) {
  const { source, email, card, portail, r, apercu } = input;
  try {
    sessionStorage.setItem(
      CASE_KEY,
      JSON.stringify({
        source,
        email,
        mutuelle: card?.assureur ?? null,
        amc: card?.amc ?? null,
        reseau: card?.reseau ?? null,
        platform: {
          id: portail.id,
          label: portail.label,
          url: portail.url,
          simulable: portail.simulable,
          tfa: portail.tfa,
        },
        portailConnecte: true,
        simulation: {
          total: r.total,
          partSecu: r.partSecu,
          partMutuelle: r.partMutuelle,
          resteACharge: r.resteACharge,
          dureeSec: r.dureeSec,
          ...(r.captureUrl ? { captureUrl: r.captureUrl } : {}),
          ...(r.numero ? { numero: r.numero } : {}),
          apercu,
        },
        compte: { email, creeLe: new Date().toISOString() },
      }),
    );
  } catch {
    /* stockage bloqué : l'essai repartira sur un cas d'exemple */
  }
}
