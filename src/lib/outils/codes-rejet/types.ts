// Types de l'outil A (codes rejet) : ce que serveur.ts renvoie aux routes. Aucune donnée ici.
import type { LigneEssentiel } from "@/components/outils/socle/BlocEssentiel";
import type { EntreeVoisine } from "@/components/outils/socle/EntreesVoisines";
import type { GroupeHub, LigneHub, MetierOutil, OutilId, SourceDonnee } from "../socle/types";

/** Le corps d'une ligne sans page (<details> du hub). */
export type DetailsCode = {
  explication: string;
  causes: string[];
  etapes: string[];
  metiers: string;
  source: { id: string; editeur: string; titre: string; url: string; date: string };
};

/** Une ligne du hub : celle du socle, plus le corps d'une ligne sans page. */
export type LigneCode = LigneHub & { details?: DetailsCode };

export type InfosHub = {
  /** Années du plus ancien et du plus récent mémo de caisse qui donnent un libellé listé. */
  anneesMemos: [string | undefined, string | undefined];
  /** Les familles du GIE SESAM-Vitale sont-elles listées (décision de Paul n° 1) ? */
  gieListe: boolean;
  /** Date du cahier des charges SESAM-Vitale cité (annexe 1-B). */
  dateGie: string;
};

export type GroupeSources = { titre: string; sources: SourceDonnee[] };

export type DonneesHub = {
  hub: { titre: string; description: string; lastmod: string };
  lignes: LigneCode[];
  groupes: GroupeHub[];
  sources: GroupeSources[];
  infos: InfosHub;
};

/** Une ligne du tableau « Le libellé, caisse par caisse ». */
export type LigneLibelle = { sourceId: string; editeur: string; date: string; texte: string };

/** Tout ce qu'une page d'entrée affiche, déjà mis en mots par modele.mjs. */
export type ModeleEntree = {
  slug: string;
  code: string;
  famille: string;
  surTitre: string;
  reponse: string[];
  metiers: MetierOutil[];
  essentiel: (LigneEssentiel & { valeur: string })[];
  avertissement: { texte: string; sourceIds: string[] };
  libelles: { titre: string; lignes: LigneLibelle[]; phrase?: string };
  ecritures: { titre: string; valeurs: string[] } | null;
  causes: { titre: string; items: string[]; deduit?: string };
  correction: { titre: string; etapes: string[]; deduit?: string };
  question: { titre: string; texte: string; lien?: string } | null;
  note: { titre: string; texte?: string; professions?: string } | null;
  sources: SourceDonnee[];
  voisins: { titre: string; entrees: EntreeVoisine[] };
  articles: string[];
  outilsLies: { id: OutilId; texte: string }[];
};
