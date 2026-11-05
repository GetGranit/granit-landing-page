// Les nouvelles de Granit en bas de la rubrique : seulement ce qui est vrai et en ligne.
// Une entrée se retire ou s'ajoute ici, jamais dans le composant.
import type { Lang } from "@/lib/i18n";

export type Nouvelle = {
  /** Date ISO : seuls le mois et l'année sont affichés. */
  date: string;
  /** Chemin interne, ou adresse complète pour un lien externe. */
  lien: string;
  texte: Record<Lang, { lien: string; suite: string }>;
};

export const NOUVELLES: Nouvelle[] = [
  {
    date: "2026-11-05",
    lien: "/levee-de-fonds",
    texte: {
      fr: {
        lien: "Granit lève 5 millions d’euros",
        suite: ", menés par Seedcamp, avec la participation de Bpifrance",
      },
      en: {
        lien: "Granit raises $6 million",
        suite: ", led by Seedcamp, with participation from Bpifrance",
      },
    },
  },
  {
    date: "2026-11-01",
    lien: "https://www.lesechos.fr/start-up/deals/french-tech-ces-start-up-qui-sattaquent-aux-lourdeurs-administratives-des-soignants-2261180",
    texte: {
      fr: {
        lien: "Les Echos",
        suite: " : ces start-up qui s’attaquent aux lourdeurs administratives des soignants",
      },
      en: {
        lien: "Les Echos",
        suite: ": the start-ups tackling the administrative burden on caregivers",
      },
    },
  },
];
