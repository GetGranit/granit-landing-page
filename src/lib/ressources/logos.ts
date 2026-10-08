// Ce que la couverture d'une fiche plateforme affiche : le logo et deux statuts de prise en charge.
// Le fichier de faits donne `logo` et `statuts` ; on les adapte ici à l'usage, sans toucher aux
// fichiers du moteur.

/**
 * Logos trop petits pour être affichés proprement : on montre l'initiale à la place.
 * isante.png fait 32 px et itelis.png 53 px (fichiers absents de public/logos).
 */
const TROP_PETITS = new Set(["/logos/isante.png", "/logos/itelis.png"]);

/**
 * Dans la barre de la fenêtre, un logotype large et sans fond se lit mieux. Fichiers nettoyés :
 * Viamedis sans son fond bleuté, Oxantis rogné autour du mot, SP Santé sans sa signature.
 * Les originaux restent pour les tuiles, l'en-tête mobile et l'accueil du site.
 */
const LOGOTYPES: Record<string, string> = {
  "/logos/viamedis.png": "/logos/viamedis-logotype-net.png",
  "/logos/oxantis.png": "/logos/oxantis-logotype.png",
  "/logos/sp-sante.png": "/logos/sp-sante-symbole.png",
};

/** Logos carrés (un symbole, pas un mot) : la fenêtre écrit le nom à côté. */
const SYMBOLES = new Set(["/logos/seveane.png"]);

export function logoPlateforme(
  logo: string | undefined,
  usage: "fenetre" | "carre",
): string | undefined {
  if (!logo || TROP_PETITS.has(logo)) return undefined;
  return usage === "fenetre" ? (LOGOTYPES[logo] ?? logo) : logo;
}

export const estSymbole = (logo: string) => SYMBOLES.has(logo);

/** Nom dans la barre de la fenêtre, sans précision entre parenthèses : « Sévéane (Korelio) » → « Sévéane ». */
export const nomFenetre = (nom: string) => nom.replace(/\s*\(.*\)$/, "");

export type StatutsCarte = { accord: string; attente: string };

/** Premier libellé court d'un statut : « Accordée / validée » → « Accordée ». */
function libelleCourt(libelle: string): string {
  const termes = libelle.split(" / ").map((t) => t.trim());
  const t = termes.find((x) => x.length <= 18) ?? termes[0];
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Les deux statuts de la fenêtre, tirés des statuts du fichier de faits : l'accord et l'attente,
 * dans les mots du portail. Sans statuts relevés : « Accordée » et « En instance ».
 */
export function statutsCarte(statuts: { libelle: string }[] | undefined): StatutsCarte {
  const libelles = (statuts ?? []).map((s) => s.libelle);
  const accord = libelles.find(
    (l) => /^(accord|accept|valid)/i.test(l) && !/réserve|inconnu|factur/i.test(l),
  );
  const attente = libelles.find((l) => /^en (attente|instance|cours)/i.test(l));
  return {
    accord: accord ? libelleCourt(accord) : "Accordée",
    attente: attente ? libelleCourt(attente) : "En instance",
  };
}

/** Lignes de la fenêtre : la demande que Granit vient de déposer, une en attente, deux anciennes. */
export const LIGNES_FENETRE = [
  { statut: "accord", classe: "vient", l1: 64, l2: 40 },
  { statut: "attente", classe: "", l1: 52, l2: 30 },
  { statut: "accord", classe: "passee", l1: 58, l2: 34 },
  { statut: "accord", classe: "passee", l1: 48, l2: 28 },
] as const;

/**
 * Lignes de la variante « tous portails » : un portail par ligne, avec un statut tel que son
 * fichier de faits le libelle (content/plateformes/*.json).
 * Partagées avec scripts/ressources/og-plateformes.mjs (images d'aperçu).
 */
export const PORTAILS_FENETRE = [
  {
    nom: "Viamedis",
    logo: "/logos/viamedis.png",
    statut: "accord",
    libelle: "Accordée",
    classe: "vient",
    l2: 40,
  },
  {
    nom: "Almerys",
    logo: "/logos/almerys.webp",
    statut: "attente",
    libelle: "En instance",
    classe: "",
    l2: 30,
  },
  {
    nom: "Santéclair",
    logo: "/logos/santeclair.svg",
    statut: "accord",
    libelle: "Accordé",
    classe: "",
    l2: 34,
  },
  {
    nom: "SP Santé",
    logo: "/logos/sp-sante.png",
    statut: "accord",
    libelle: "Accordé",
    classe: "passee",
    l2: 28,
  },
] as const;
