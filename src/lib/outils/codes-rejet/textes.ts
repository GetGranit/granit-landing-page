// Outil A, codes rejet : les textes fixes du hub et des pages (outils-nuit/A/textes.md), et la
// forme d'une requête pour l'état vide. Aucune donnée ici : ce fichier part dans le bundle client.
// Tout ce qui est affirmé vient de outils-nuit/A/sources.md (identifiant de la source en commentaire).
import { cleCode } from "../socle/texte.mjs";
import type { QuestionOutil } from "@/components/outils/socle/FaqOutil";

/** En-tête du hub (textes.md § 1.1). */
export const ENTETE_HUB = {
  titre: "Codes rejets NOEMIE et télétransmission\u00a0:",
  accent: "la liste, code par code",
  chapeau:
    "Tapez le code ou le libellé de votre retour NOEMIE, où la caisse dit ce qu’elle a payé ou rejeté\u00a0: vous lisez ce qu’elle reproche, la cause probable et quoi corriger. Chaque code renvoie au mémo de la caisse qui l’a publié, avec sa date. Le libellé de votre propre retour fait foi.",
};

/** Champ de recherche (textes.md § 1.2, repris de cadre.md). */
export const RECHERCHE = {
  libelle: "Code ou libellé du rejet",
  placeholder: "0450054, bénéficiaire inconnu…",
  aide: "Avec ou sans espaces, avec ou sans le 0 du début.",
  unite: ["code", "codes"] as [string, string],
};

/** La phrase de la carte Granit, hub et entrées (textes.md § 1.7 ; formulation permise par TON.md). */
export const TEXTE_PONT =
  "Les rejets repérés avant l’envoi, puis traités\u00a0: c’est le travail des agents Granit, dans les logiciels que vos équipes utilisent déjà.";

/** Lien vers l'outil C (rendu seulement une fois cet outil fusionné). */
export const LIEN_MUTUELLE =
  "Rejet de la part mutuelle\u00a0: trouver le portail de la complémentaire";

/** Articles liés du hub (textes.md § 4.2). */
export const ARTICLES_HUB = [
  "codes-rejets-noemie",
  "rejet-beneficiaire-inconnu",
  "quand-relancer-mutuelle",
];

/**
 * FAQ du hub (textes.md § 2), avec FAQPage. Sources : sources.md « Pièges relevés » ;
 * cpam33-laboratoires-2018, cpam38-pharmaciens-2023 ; ameli-medecin-rejets-2026,
 * ameli-pharmacien-retour-noemie-2022, ameli-pharmacien-fse-mode-emploi-2021,
 * gie-cdc-annexe1b-2025 ; entrées noemie-2900005 et noemie-0180051.
 */
export const FAQ_HUB: QuestionOutil[] = [
  {
    question: "Que veut dire un code rejet comme 153\u00a0?",
    reponse:
      "Aucun code de ce format ne figure dans les documents officiels lus\u00a0: un code rejet NOEMIE du régime général s’écrit sur 7\u00a0chiffres, comme 0450054. Un numéro court est souvent un code tronqué ou propre à votre logiciel. Cherchez plutôt un mot du libellé affiché sur votre retour.",
  },
  {
    question: "Pourquoi un même code a-t-il deux libellés\u00a0?",
    reponse:
      "Parce que chaque caisse publie ses propres mémos, et qu’ils changent avec le temps. Le code 0450072 s’écrit «\u00a0DIVERGENCE VITALE/EXO BDO ABSENTE\u00a0» chez la CPAM de la Gironde en 2018, et «\u00a0Situation d’exonération inconnue pour ce bénéficiaire\u00a0» chez la CPAM de l’Isère en 2023\u00a0: le sens est le même. Le libellé de votre propre retour fait foi.",
  },
  {
    question: "«\u00a0Traitement caisse\u00a0»\u00a0: faut-il renvoyer la facture\u00a0?",
    reponse:
      "Non. Ce n’est pas un rejet\u00a0: la caisse étudie la facture, et un second retour NOEMIE dira si elle est payée ou rejetée. Un nouvel envoi serait un doublon. Si le résultat tarde, contactez votre caisse, par exemple avec le téléservice «\u00a0Réclamation paiements\u00a0» d’amelipro.",
  },
  {
    question: "ARL négatif ou rejet\u00a0: quelle différence\u00a0?",
    reponse:
      "L’ARL (accusé de réception logique) répond au lot télétransmis\u00a0: négatif, le lot n’a pas été pris en charge et il faut le renvoyer\u00a0; ameli.fr conseille un nouvel essai, puis de contacter la caisse. Le rejet arrive plus tard, dans le retour NOEMIE\u00a0: la caisse a reçu la facture, mais ne peut pas la payer en l’état.",
  },
  {
    question: "Une facture rejetée sera-t-elle payée\u00a0?",
    reponse:
      "Pas en l’état\u00a0: la caisse attend une correction. Chaque page de code dit quoi corriger avant de retransmettre, d’après les mémos des caisses. Pour un doublon (facture déjà payée ou déjà en traitement), ne renvoyez rien\u00a0: vérifiez vos paiements et, au besoin, faites une réclamation à la caisse.",
  },
];

/** Forme d'une requête sans résultat, dans l'ordre de textes.md § 1.4. */
export type FormeRequete = "court" | "quatre" | "numerique" | "lettre" | "texte";

export function formeRequete(q: string, gieListe: boolean): FormeRequete {
  const k = cleCode(q);
  if (/^\d{1,3}$/.test(k)) return "court";
  if (/^\d{4}$/.test(k) && !gieListe) return "quatre";
  if (/^\d+$/.test(k)) return "numerique";
  if (/^[a-z]{1,3}\d{2,}$/.test(k)) return "lettre";
  return "texte";
}

/** Le message de l'état vide (textes.md § 1.4) ; `q` tel que tapé. */
export function messageVide(q: string, forme: FormeRequete): string {
  const requete = q.trim();
  switch (forme) {
    case "court":
      return `Dans les mémos des caisses, un code rejet NOEMIE s’écrit sur 7\u00a0chiffres, comme 0450054. Un numéro court comme ${requete} n’y figure pas\u00a0: c’est souvent un code tronqué ou propre à votre logiciel. Cherchez plutôt un mot du libellé.`;
    case "quatre":
      return "Un code à 4\u00a0chiffres peut être un accusé de réception logique (ARL) négatif ou un message de service SESAM-Vitale. Ils ne sont pas encore dans cette liste\u00a0: votre logiciel en donne le libellé.";
    case "numerique":
      return "Ce code n’est pas dans les mémos des caisses que nous avons pu vérifier. Le libellé de votre retour fait foi\u00a0: lisez-le en entier, il dit ce qui manque.";
    case "lettre":
      return "Ce code ne suit pas l’écriture des rejets NOEMIE de l’Assurance Maladie. Les codes qui commencent par une lettre viennent d’autres nomenclatures, par exemple celle d’un organisme concentrateur\u00a0: c’est elle qui fait foi.";
    default:
      return `Aucun libellé ne contient «\u00a0${requete}\u00a0». Essayez un seul mot du libellé («\u00a0exonération\u00a0», «\u00a0bénéficiaire\u00a0») ou le code.`;
  }
}

/** Autres formes d'une requête : « 450054 » (zéro de tête omis) → « 0450054 ». */
export function variantesCode(q: string): string[] {
  const k = cleCode(q);
  return /^\d{6}$/.test(k) ? [`0${k}`] : [];
}

/** Le code tiré d'une adresse introuvable : « noemie-0999999 » → « 0999999 ». */
export function codeDuSlug(slug: string): string {
  return String(slug ?? "")
    .replace(/^(noemie|arl|sv-[a-z]+)-/, "")
    .slice(0, 40);
}
