// Le contenu propre à chaque page métier publiée (/metiers/<slug>), en plus de metiers.ts.
// Le contenu de chaque métier vit dans pages/<slug>.ts.
// Garanties : seulement les affirmations de TON.md permises pour ce métier.

import type { SlugMetier } from "./metiers";
import { opticiensEn, opticiensFr } from "./pages/opticiens";
import { dentaireEn, dentaireFr } from "./pages/dentaire";
import { centresSanteEn, centresSanteFr } from "./pages/centres-sante";
import { pharmacieEn, pharmacieFr } from "./pages/pharmacie";
import { cliniquesLaboratoiresEn, cliniquesLaboratoiresFr } from "./pages/cliniques-laboratoires";

export type PageMetier = {
  titreSeo: string;
  descriptionSeo: string;
  /** Pastilles du hero, dans l'ordre. */
  etapesHero: { enCours: string; fait: string; detail: string }[];
  garanties: { titre: string; texte: string }[];
  dossierTitre: [string, string];
  dossier: { etape: string; texte: string }[];
  logiciels: string[];
  plateformes: string[];
  plateformesNote: string;
  /** Témoignage d'un client du métier, avec son accord écrit (TON.md). Sans lui, le bloc disparaît. */
  temoignage?: { citation: string; auteur: string; role: string };
  /**
   * « Ce que vous n'avez plus à faire » : une ligne par étape du dossier, la tâche d'aujourd'hui, puis
   * ce que fait Granit. `cle` est le passage de `apres` mis en gras ; il doit y figurer mot pour mot.
   */
  avantApres?: {
    titre: [string, string];
    avant: string;
    apres: string;
    lignes: { etape: string; cle: string; avant: string; apres: string }[];
  };
  /** « Comment on démarre » : les étapes de la mise en route, avec la personne qui accompagne. */
  demarrage?: { titre: [string, string]; etapes: { titre: string; texte: string }[] };
  faq: { question: string; answer: string; rdv?: string }[];
  /** Slug de /ressources/metier/<slug>. */
  ressources: string;
};

/** Les vrais logos des logiciels et plateformes nommés sur les pages métier. Sans logo : le nom, en texte. */
export const LOGOS: Record<string, string> = {
  Cosium: "/home/connecteurs/cosium.png",
  Optimum: "/logos/optimum.png",
  Almerys: "/home/connecteurs/almerys.png",
  Viamédis: "/logos/annuaire/viamedis.svg",
  Santéclair: "/logos/santeclair.svg",
  Kalixia: "/logos/annuaire/kalixia.png",
  "Carte Blanche": "/logos/annuaire/carte-blanche.svg",
  // Pages des autres métiers (fichiers officiels des éditeurs, récupérés le 18/11/2026).
  // Hexalis, KaliSil et 4AXES n'ont pas de logo produit public : ils restent en texte.
  Logos_w: "/logos/metiers/logos-w.png",
  Julie: "/logos/metiers/julie.png",
  Veasy: "/logos/metiers/veasy.svg",
  Desmos: "/logos/metiers/desmos.png",
  Doctolib: "/home/connecteurs/doctolib.svg",
  amelipro: "/logos/metiers/amelipro.svg",
  NETSoins: "/logos/metiers/netsoins.png",
  TitanLink: "/logos/metiers/titanlink.png",
  "Hopital Manager": "/logos/metiers/hopital-manager.png",
  Orisha: "/logos/metiers/orisha.png",
  "Xtrem Santé": "/logos/metiers/xtrem-sante.png",
  "Weclever Dental": "/logos/metiers/weclever.png",
  Visiodent: "/logos/metiers/visiodent.svg",
  Effigie: "/logos/metiers/effigie.svg",
};

/** Logos réduits à un symbole : le nom s'affiche à côté. */
export const LOGOS_AVEC_NOM = ["Optimum", "Xtrem Santé"];

export const PAGES: Partial<Record<SlugMetier, { fr: PageMetier; en: PageMetier }>> = {
  "optique-audio": { fr: opticiensFr, en: opticiensEn },
  dentaire: { fr: dentaireFr, en: dentaireEn },
  "centres-sante": { fr: centresSanteFr, en: centresSanteEn },
  pharmacie: { fr: pharmacieFr, en: pharmacieEn },
  "cliniques-laboratoires": { fr: cliniquesLaboratoiresFr, en: cliniquesLaboratoiresEn },
};
