// L'annuaire du tiers payant affiché sur le hub : plateformes, réseaux de soins et mutuelles.
// Un acteur a une fiche quand content/ressources/{slug}.json est en ligne ; sinon il est
// annoncé (« Bientôt »). Ajouter un acteur = une ligne ici et son logo dans public/logos/annuaire/.
import type { Fiche, Plateforme, VerticaleSlug } from "./types";

export type Genre = "plateforme" | "reseau" | "mutuelle";

type Acteur = {
  /** Slug de la fiche (portail-*), même si elle n'est pas encore écrite. */
  slug: string;
  nom: string;
  genre: Genre;
  /** Fichier dans public/logos/annuaire/ : logotype horizontal, fond transparent. */
  logo?: string;
  /** Logo carré (un symbole sans le nom) : le nom est composé à côté. */
  symbole?: boolean;
  /** Logo plus haut que large : on lui laisse plus de hauteur. */
  vertical?: boolean;
  /** Métiers où l'acteur fait du tiers payant. */
  metiers?: VerticaleSlug[];
};

// Métiers relevés le 08/10/2026 sur les sites des acteurs (sources dans la PR). Sans source
// assez sûre, on n'affiche pas de métier plutôt que d'en deviner un.
const ACTEURS: Acteur[] = [
  // Plateformes de tiers payant
  {
    slug: "portail-viamedis",
    nom: "Viamedis",
    genre: "plateforme",
    logo: "viamedis.svg",
    metiers: ["optique", "dentaire", "audio", "pharmacie", "laboratoires", "cliniques"],
  },
  {
    slug: "portail-almerys",
    nom: "Almerys",
    genre: "plateforme",
    logo: "almerys.png",
    metiers: ["optique", "dentaire", "audio", "pharmacie", "laboratoires", "cliniques"],
  },
  {
    slug: "portail-isante",
    nom: "iSanté",
    genre: "plateforme",
    logo: "isante.png",
    metiers: ["optique", "dentaire", "audio", "pharmacie", "cliniques", "centres"],
  },
  {
    slug: "portail-sp-sante",
    nom: "SP Santé",
    genre: "plateforme",
    logo: "sp-sante.png",
    metiers: ["optique", "dentaire", "audio", "pharmacie", "laboratoires", "cliniques", "centres"],
  },
  {
    slug: "portail-oxantis",
    nom: "Oxantis",
    genre: "plateforme",
    logo: "oxantis.png",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-actil",
    nom: "Actil",
    genre: "plateforme",
    logo: "actil.png",
    metiers: ["optique", "dentaire", "audio", "pharmacie", "cliniques", "centres"],
  },
  // Réseaux de soins
  {
    slug: "portail-santeclair",
    nom: "Santéclair",
    genre: "reseau",
    logo: "santeclair.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-itelis",
    nom: "Itelis",
    genre: "reseau",
    logo: "itelis.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-seveane",
    nom: "Sévéane",
    genre: "reseau",
    logo: "seveane.png",
    symbole: true,
    metiers: [
      "optique",
      "dentaire",
      "audio",
      "pharmacie",
      "laboratoires",
      "cliniques",
      "centres",
      "ehpad",
    ],
  },
  {
    slug: "portail-kalixia",
    nom: "Kalixia",
    genre: "reseau",
    logo: "kalixia.png",
    vertical: true,
    metiers: ["optique", "dentaire", "audio", "cliniques"],
  },
  {
    slug: "portail-carte-blanche",
    nom: "Carte Blanche Partenaires",
    genre: "reseau",
    logo: "carte-blanche.svg",
    metiers: ["optique", "dentaire", "audio", "cliniques"],
  },
  // Mutuelles et assureurs santé
  {
    slug: "portail-harmonie-mutuelle",
    nom: "Harmonie Mutuelle",
    genre: "mutuelle",
    logo: "harmonie-mutuelle.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-mgen",
    nom: "MGEN",
    genre: "mutuelle",
    logo: "mgen.png",
    vertical: true,
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-malakoff-humanis",
    nom: "Malakoff Humanis",
    genre: "mutuelle",
    logo: "malakoff-humanis.png",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-ag2r-la-mondiale",
    nom: "AG2R La Mondiale",
    genre: "mutuelle",
    logo: "ag2r-la-mondiale.svg",
    metiers: ["optique", "dentaire", "audio", "pharmacie", "laboratoires", "cliniques"],
  },
  { slug: "portail-alan", nom: "Alan", genre: "mutuelle", logo: "alan.svg" },
  {
    slug: "portail-swiss-life",
    nom: "Swiss Life",
    genre: "mutuelle",
    logo: "swiss-life.svg",
    metiers: ["optique", "dentaire", "audio", "cliniques"],
  },
  {
    slug: "portail-axa",
    nom: "AXA",
    genre: "mutuelle",
    logo: "axa.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-allianz",
    nom: "Allianz",
    genre: "mutuelle",
    logo: "allianz.svg",
    metiers: ["optique", "dentaire", "audio", "pharmacie", "laboratoires"],
  },
  {
    slug: "portail-groupama",
    nom: "Groupama",
    genre: "mutuelle",
    logo: "groupama.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-apicil",
    nom: "Apicil",
    genre: "mutuelle",
    logo: "apicil.png",
    metiers: ["optique", "dentaire", "audio", "pharmacie", "cliniques", "centres"],
  },
  {
    slug: "portail-klesia",
    nom: "Klesia",
    genre: "mutuelle",
    logo: "klesia.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-pro-btp",
    nom: "Pro BTP",
    genre: "mutuelle",
    logo: "pro-btp.svg",
    metiers: [
      "optique",
      "dentaire",
      "audio",
      "pharmacie",
      "laboratoires",
      "cliniques",
      "centres",
      "ehpad",
    ],
  },
  {
    slug: "portail-la-mutuelle-generale",
    nom: "La Mutuelle Générale",
    genre: "mutuelle",
    logo: "la-mutuelle-generale.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-aesio",
    nom: "Aésio",
    genre: "mutuelle",
    logo: "aesio.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-maaf",
    nom: "MAAF",
    genre: "mutuelle",
    logo: "maaf.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-macif",
    nom: "Macif",
    genre: "mutuelle",
    logo: "macif.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  { slug: "portail-matmut", nom: "Matmut", genre: "mutuelle", logo: "matmut.svg" },
  {
    slug: "portail-viasante",
    nom: "Viasanté",
    genre: "mutuelle",
    logo: "viasante.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-generali",
    nom: "Generali",
    genre: "mutuelle",
    logo: "generali.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-april",
    nom: "April",
    genre: "mutuelle",
    logo: "april.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
  { slug: "portail-solimut", nom: "Solimut", genre: "mutuelle", logo: "solimut.png" },
  {
    slug: "portail-interiale",
    nom: "Intériale",
    genre: "mutuelle",
    logo: "interiale.svg",
    metiers: ["optique", "dentaire"],
  },
  {
    slug: "portail-mnt",
    nom: "MNT",
    genre: "mutuelle",
    logo: "mnt.svg",
    vertical: true,
    metiers: ["optique", "dentaire", "audio"],
  },
  {
    slug: "portail-mutuelle-des-motards",
    nom: "Mutuelle des Motards",
    genre: "mutuelle",
    logo: "mutuelle-des-motards.svg",
  },
  {
    slug: "portail-uniprevoyance",
    nom: "Uniprévoyance",
    genre: "mutuelle",
    logo: "uniprevoyance.png",
  },
  {
    slug: "portail-mutuelle-familiale",
    nom: "Mutuelle Familiale",
    genre: "mutuelle",
    logo: "mutuelle-familiale.svg",
  },
  {
    slug: "portail-previfrance",
    nom: "Prévifrance",
    genre: "mutuelle",
    logo: "previfrance.svg",
    metiers: ["optique"],
  },
  {
    slug: "portail-mma",
    nom: "MMA",
    genre: "mutuelle",
    logo: "mma.svg",
    metiers: ["optique", "dentaire", "audio"],
  },
];

export const GENRES: Record<Genre, { court: string; nom: string; filtre: string }> = {
  plateforme: { court: "Plateforme", nom: "plateforme de tiers payant", filtre: "Plateformes" },
  reseau: { court: "Réseau", nom: "réseau de soins", filtre: "Réseaux" },
  mutuelle: { court: "Mutuelle", nom: "complémentaire santé", filtre: "Mutuelles" },
};

// Faits relevés, pour la vedette : nombre de complémentaires gérées et un chiffre parlant.
const faits = import.meta.glob<Plateforme>("/content/plateformes/*.json", {
  eager: true,
  import: "default",
});
const faitsParSlug = new Map(Object.values(faits).map((p) => [p.slug, p]));

/** Le chiffre le plus parlant : une taille de réseau plutôt qu'une date de création. */
const PARLANT = /complémentaire|professionnel|opticien|assuré|bénéficiaire|adhérent/i;

export type Entree = Omit<Acteur, "metiers"> & {
  metiers: VerticaleSlug[];
  /** La fiche, si elle est en ligne. */
  fiche?: Fiche;
  checkedOn?: string;
  organismes: number;
  chiffre?: { valeur: string; label: string };
};

const ORDRE_GENRES: Genre[] = ["plateforme", "reseau", "mutuelle"];

/** L'annuaire : fiches en ligne d'abord, puis plateformes, réseaux et mutuelles, par nom. */
export function annuaire(fiches: Fiche[]): Entree[] {
  const parSlug = new Map(fiches.map((f) => [f.slug, f]));
  // Une fiche publiée avant que son acteur soit listé ici apparaît quand même, sans logo dédié.
  const connus = new Set(ACTEURS.map((a) => a.slug));
  const nouveaux: Acteur[] = fiches
    .filter((f) => !connus.has(f.slug))
    .map((f) => ({ slug: f.slug, nom: f.plateforme?.nom ?? f.title, genre: "plateforme" }));
  return [...ACTEURS, ...nouveaux]
    .map((a) => {
      const fiche = parSlug.get(a.slug);
      const f = faitsParSlug.get(a.slug);
      const chiffre = f?.chiffres.find((c) => PARLANT.test(c.label)) ?? f?.chiffres[0];
      return {
        ...a,
        metiers: a.metiers ?? [],
        logo: a.logo ? `/logos/annuaire/${a.logo}` : undefined,
        fiche,
        checkedOn: fiche?.plateforme?.checkedOn,
        organismes: f?.organismes?.liste.length ?? 0,
        chiffre: chiffre && { valeur: chiffre.valeur, label: chiffre.label },
      };
    })
    .sort(
      (a, b) =>
        Number(!!b.fiche) - Number(!!a.fiche) ||
        ORDRE_GENRES.indexOf(a.genre) - ORDRE_GENRES.indexOf(b.genre) ||
        a.nom.localeCompare(b.nom, "fr"),
    );
}
