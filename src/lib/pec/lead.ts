import { submitDemo } from "@/lib/submitDemo";

/**
 * Les contacts du lead magnet passent par le même webhook que les demandes de
 * démo (B11 → Attio), triés par `source`. On n'y met jamais rien du patient :
 * seulement le portail trouvé et, s'il y en a un, l'identifiant du lien
 * LinkedIn personnalisé (?p=).
 */
export type PecLeadKind = "essai" | "rappel" | "creneau" | "mutuelle-inconnue";

export async function sendPecLead(input: {
  kind: PecLeadKind;
  email: string;
  phone?: string;
  prenom?: string;
  platform?: string | null;
  mutuelle?: string | null;
  ref?: string | null;
}) {
  const details = [
    `Lead magnet PEC (${input.kind})`,
    input.platform && `portail : ${input.platform}`,
    input.mutuelle && `mutuelle cherchée : ${input.mutuelle}`,
    input.ref && `lien : ${input.ref}`,
  ]
    .filter(Boolean)
    .join(" · ");
  return submitDemo({
    data: {
      name: input.prenom?.trim() || "Opticien (lead magnet PEC)",
      email: input.email.trim(),
      phone: input.phone,
      orgType: "optique",
      challenge: details,
      source: `pec-${input.kind}`,
    },
  });
}
