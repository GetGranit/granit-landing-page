// Types partagés par le socle des outils référentiels (/outils/<id>) et par chaque outil.
// Le contrat complet est dans `scripts/outils/decouvrir.mjs` (découverte) et dans le mode d'emploi
// du socle. Un outil ne redéfinit aucun de ces types : il les importe.

/** Les trois outils référentiels. Un identifiant = un dossier `src/lib/outils/<id>/` = une URL `/outils/<id>`. */
export type OutilId = "codes-rejet" | "remboursement" | "mutuelle-portail";

/** Les 5 métiers du site (src/lib/ressources/verticales.json), dans l'ordre de `METIERS_OUTILS`. */
export type MetierOutil = "optique" | "dentaire" | "centres" | "pharmacie" | "cliniques";

/** Ce que `outil.mjs` exporte sous le nom `OUTIL` : le descripteur, sans aucune donnée. */
export type OutilDescripteur = {
  id: OutilId;
  /** `/outils/${id}`, sans barre finale. */
  chemin: string;
  /** Fil d'Ariane, cartes de /outils, llms.txt. */
  nom: string;
  /** Titre de la carte de /outils (typographie française : espace insécable avant « ? »). */
  titreCarte: string;
  /** Une phrase, 160 caractères au plus (carte de /outils, llms.txt). */
  description: string;
  metiers: MetierOutil[];
  /** Ordre de /outils : codes-rejet 1, mutuelle-portail 2, remboursement 3. */
  ordre: number;
};

/** Une page publiée par l'outil : le hub en premier, puis les entrées. Ce que lit le sitemap. */
export type PageOutil = {
  type: "hub" | "entree";
  /** Sans barre finale ; entrée : `${OUTIL.chemin}/${slug}`. */
  chemin: string;
  /** Entrées seulement. */
  slug?: string;
  /** <title>, 10 à 60 caractères, unique dans l'outil. */
  titre: string;
  /** Meta description, 140 à 160 caractères, unique dans l'outil. */
  description: string;
  h1: string;
  /** AAAA-MM-JJ : date de vérification de l'entrée (hub : la plus récente de ses entrées). */
  lastmod: string;
  /** Défaut "0.8" pour le hub, "0.6" pour une entrée. */
  priorite?: string;
  /** Défaut "weekly" pour le hub, "monthly" pour une entrée. */
  frequence?: "weekly" | "monthly";
};

/** Une source de `donnees.json` (format commun des livrables de données). */
export type SourceDonnee = {
  id: string;
  titre: string;
  url: string;
  editeur: string;
  /** ISO, ou texte (« non datée », « état au 2026-11-18 »). */
  date_source: string;
  /** ISO. */
  consulte_le: string;
};

/** Ce qu'une page d'entrée affiche, vu par les tests communs (une ligne par page publiée). */
export type AuditPage = {
  chemin: string;
  /** Ce que la page affiche comme acquis. */
  entrees: { id: string; statut: "sur" | "a_verifier"; source_ids: string[] }[];
  /** Les sources résolues de ces entrées. */
  sources: SourceDonnee[];
  /** Le texte propre à l'entrée, tel qu'il est rendu (seuil de contenu, `mots.mjs`). */
  textePropre: string;
  /** Chemins du bloc « voisins » : pages d'entrée de l'outil ou `/ressources/<slug>` en ligne. */
  voisins: string[];
  /** Slugs /ressources du bloc « articles liés ». */
  articles: string[];
};

/** Ce que l'outil sait du reste du site, sans lire le disque (même code dans Node et dans le worker). */
export type ContexteSite = {
  /** Slugs des pages /ressources en ligne : articles JSON publiés et anciens articles non remplacés. */
  articles: ReadonlySet<string>;
};

export type OptionsPages = {
  site: ContexteSite;
  /**
   * true : toutes les entrées qui pourraient avoir une page (statut `sur`, seuil passé), en ignorant
   * la vague (PRIORITE, PAGES_MAX), les familles et les métiers fermés de publication.mjs.
   */
  candidates?: boolean;
};

/** Les trois fonctions que `pages.mjs` exporte. */
export type ModulePages = {
  pages: (options: OptionsPages) => PageOutil[];
  audit: (options: OptionsPages) => AuditPage[];
  /** `{ slugReçu: cheminCible }` : redirections permanentes (301). */
  redirections: (options: OptionsPages) => Record<string, string>;
};

/** Valeur d'une facette de filtre (`?metier=dentaire`) ; null = « Tous ». */
export type Filtres = Record<string, string | null>;

/** Une ligne du hub, dans le HTML serveur ; la recherche ne fait que la masquer (`hidden`). */
export type LigneHub = {
  /** Slug ; ancre `#id` sur la ligne. */
  id: string;
  /** Affiché en chiffres tabulaires (« 0450054 »). */
  code?: string;
  titre: string;
  resume?: string;
  /** Id d'un GroupeHub. */
  groupe: string;
  /** { metier: ["optique", …], classe: ["a"] … } */
  facettes: Record<string, string[]>;
  /** Page publiée (ou fiche /ressources) : la ligne est un lien. Sans chemin : `<details>`. */
  chemin?: string;
  /** Formes exactes cherchables, déjà passées par `cleCode` (codes, autres écritures, n° AMC). */
  cles: string[];
  /** Texte cherchable, déjà passé par `normaliser` (libellé, autres noms…). */
  texte: string;
};

export type GroupeHub = {
  id: string;
  titre: string;
  intro?: string;
  /** Page du groupe (B). */
  chemin?: string;
  /** Résumé du groupe replié (B : « base 9,75 à 35,25 € »). */
  resume?: string;
};
