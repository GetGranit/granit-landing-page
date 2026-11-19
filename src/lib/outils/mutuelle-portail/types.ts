// Ce que serveur.ts envoie au navigateur pour l'outil C : seulement ce que les pages affichent.
// Aucune note de vérification brute : les raisons « à confirmer » sont déjà rédigées (redaction.mjs).
import type {
  AuditPage,
  GroupeHub,
  LigneHub,
  MetierOutil,
  PageOutil,
  SourceDonnee,
} from "../socle/types";

/** Une ligne du tableau « Portail par métier » (un opérateur cité pour un métier de C). */
export type LignePortail = {
  id: string;
  /** « Optique », « Audio », « Dentaire », « Pharmacie », « Centre de santé », « Laboratoire », « Clinique ». */
  metier: string;
  /** Clé du métier de C (optique, audio…), pour le suivi lm_portail_clic. */
  cleMetier: string;
  /** Métier du site (filtre du hub). */
  metierSite: MetierOutil | null;
  operateur: string;
  operateurId: string;
  /** Espace pro de l'opérateur (https), seulement pour un fait sûr. */
  portail: string | null;
  statut: "sur" | "a_verifier";
  /** Libellés et numéros AMC des listes publiques (plusieurs pour un même opérateur et un même état). */
  libelles: { libelle: string; amc: string }[];
  /** Segments de la liste (« Centre dentaire », « ESPIC »…). */
  segments: string[];
  /** État lisible : « relevé, ouvert depuis le 01/01/2020 », « à confirmer sur la carte »… */
  etat: string;
  /** Lignes de sous-domaine listées (« tous les dentistes, et une ligne stomatologues »). */
  sousDomaines: string | null;
  /** Restriction de sous-domaine, en clair (« réservé aux stomatologues »). */
  restriction: string | null;
  /** Pourquoi le fait est à confirmer (rédigé). */
  raison: string | null;
  sourceIds: string[];
};

/** Le relevé d'une mutuelle tel qu'il est rendu (ligne dépliée du hub, ou page d'entrée). */
export type ReleveMutuelle = {
  slug: string;
  nom: string;
  /** Les phrases du relevé sûr : comptées pour le seuil, rendues telles quelles. */
  phrases: {
    releve: { phrase: string; items: string[] }[];
    restrictions: string[];
    fermes: string[];
    reseaux: string[];
    notes: string[];
    sources: string[];
  };
  /** Les faits « à confirmer sur la carte » (avec leur raison), si Paul les montre. */
  aConfirmer: { metiers: string; operateur: string; restriction: string | null; raison: string }[];
  lignes: LignePortail[];
  /** Métiers de C sans aucune source publique (« Audio, clinique »). */
  sansSource: string[];
  /** Date du relevé (JJ/MM/AAAA). */
  releveLe: string;
  sourceIds: string[];
};

/** Résumé d'une ligne du hub : les opérateurs relevés, fusionnés par métier. */
export type ApercuLigne = {
  surs: { metiers: string; operateur: string }[];
  aConfirmer: { metiers: string; operateur: string; restriction: string | null }[];
  /** Le relevé, métier du site par métier du site (filtre posé). */
  parMetier: Partial<
    Record<
      MetierOutil,
      {
        metiers: string;
        operateur: string;
        libelle: string | null;
        statut: "sur" | "a_verifier";
        restriction: string | null;
      }[]
    >
  >;
};

export type LigneMutuelle = LigneHub & {
  nom: string;
  /** La ligne mène à la fiche /ressources, à la page d'outil, ou s'ouvre sur place. */
  lien: "fiche" | "page" | null;
  apercu: ApercuLigne;
  /** Le relevé complet, pour une ligne sans page ni fiche. */
  details: ReleveMutuelle | null;
};

export type DonneesHub = {
  hub: PageOutil;
  lignes: LigneMutuelle[];
  groupes: GroupeHub[];
  /** Sources de l'outil, en deux groupes (listes publiques, autres). */
  groupesSources: { titre: string; sources: SourceDonnee[] }[];
  /** Comment chaque source a été lue (« lu en direct »…), par identifiant. */
  mentions: Record<string, string>;
  /** Options du filtre « opérateur », dans l'ordre de textes.md. */
  operateurs: { valeur: string; libelle: string; compte: number }[];
  /** Fiches /ressources des opérateurs en ligne (état vide). */
  fichesOperateurs: { nom: string; chemin: string }[];
  /** Date de relevé des listes publiques (JJ/MM/AAAA), pour l'état vide. */
  releveListes: string;
};

export type DonneesEntree = {
  type: "page";
  page: PageOutil;
  audit: AuditPage;
  surTitre: string;
  reponse: string[];
  metiers: MetierOutil[];
  essentiel: { libelle: string; valeurs: string[] }[];
  avertissement: string;
  releve: ReleveMutuelle;
  /** « Vérifier sur la carte {opérateur} » : une phrase par opérateur, avec sa source. */
  verifications: { operateur: string; texte: string; sourceId: string }[];
  voisins: { titre: string; entrees: { chemin: string; titre: string; resume?: string }[] };
  mentions: Record<string, string>;
};

export type ReponseEntree =
  DonneesEntree | { type: "redirection"; vers: string } | { type: "introuvable" };
