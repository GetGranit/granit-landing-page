// L'annuaire du tiers payant affiché sur le hub : plateformes, réseaux de soins et mutuelles.
// Un acteur a une fiche quand content/ressources/{slug}.json est en ligne ; sinon il est
// annoncé (« Bientôt »). Ajouter un acteur = une ligne ici et son logo dans public/logos/annuaire/.
import type { Fiche, Plateforme } from "./types";

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
};

const ACTEURS: Acteur[] = [
  // Plateformes de tiers payant
  { slug: "portail-viamedis", nom: "Viamedis", genre: "plateforme", logo: "viamedis.svg" },
  { slug: "portail-almerys", nom: "Almerys", genre: "plateforme", logo: "almerys.png" },
  { slug: "portail-isante", nom: "iSanté", genre: "plateforme", logo: "isante.png" },
  { slug: "portail-sp-sante", nom: "SP Santé", genre: "plateforme", logo: "sp-sante.png" },
  { slug: "portail-oxantis", nom: "Oxantis", genre: "plateforme", logo: "oxantis.png" },
  { slug: "portail-actil", nom: "Actil", genre: "plateforme", logo: "actil.png" },
  // Réseaux de soins
  { slug: "portail-santeclair", nom: "Santéclair", genre: "reseau", logo: "santeclair.svg" },
  { slug: "portail-itelis", nom: "Itelis", genre: "reseau", logo: "itelis.svg" },
  { slug: "portail-seveane", nom: "Sévéane", genre: "reseau", logo: "seveane.png", symbole: true },
  { slug: "portail-kalixia", nom: "Kalixia", genre: "reseau", logo: "kalixia.png", vertical: true },
  {
    slug: "portail-carte-blanche",
    nom: "Carte Blanche Partenaires",
    genre: "reseau",
    logo: "carte-blanche.svg",
  },
  // Mutuelles et assureurs santé
  {
    slug: "portail-harmonie-mutuelle",
    nom: "Harmonie Mutuelle",
    genre: "mutuelle",
    logo: "harmonie-mutuelle.svg",
  },
  { slug: "portail-mgen", nom: "MGEN", genre: "mutuelle", logo: "mgen.png", vertical: true },
  {
    slug: "portail-malakoff-humanis",
    nom: "Malakoff Humanis",
    genre: "mutuelle",
    logo: "malakoff-humanis.png",
  },
  {
    slug: "portail-ag2r-la-mondiale",
    nom: "AG2R La Mondiale",
    genre: "mutuelle",
    logo: "ag2r-la-mondiale.svg",
  },
  { slug: "portail-alan", nom: "Alan", genre: "mutuelle", logo: "alan.svg" },
  { slug: "portail-swiss-life", nom: "Swiss Life", genre: "mutuelle", logo: "swiss-life.svg" },
  { slug: "portail-axa", nom: "AXA", genre: "mutuelle", logo: "axa.svg" },
  { slug: "portail-allianz", nom: "Allianz", genre: "mutuelle", logo: "allianz.svg" },
  { slug: "portail-groupama", nom: "Groupama", genre: "mutuelle", logo: "groupama.svg" },
  { slug: "portail-apicil", nom: "Apicil", genre: "mutuelle", logo: "apicil.png" },
  { slug: "portail-klesia", nom: "Klesia", genre: "mutuelle", logo: "klesia.svg" },
  { slug: "portail-pro-btp", nom: "Pro BTP", genre: "mutuelle", logo: "pro-btp.svg" },
  {
    slug: "portail-la-mutuelle-generale",
    nom: "La Mutuelle Générale",
    genre: "mutuelle",
    logo: "la-mutuelle-generale.svg",
  },
  { slug: "portail-aesio", nom: "Aésio", genre: "mutuelle", logo: "aesio.svg" },
  { slug: "portail-maaf", nom: "MAAF", genre: "mutuelle", logo: "maaf.svg" },
  { slug: "portail-macif", nom: "Macif", genre: "mutuelle", logo: "macif.svg" },
  { slug: "portail-matmut", nom: "Matmut", genre: "mutuelle", logo: "matmut.svg" },
  { slug: "portail-viasante", nom: "Viasanté", genre: "mutuelle", logo: "viasante.svg" },
  { slug: "portail-generali", nom: "Generali", genre: "mutuelle", logo: "generali.svg" },
  { slug: "portail-april", nom: "April", genre: "mutuelle", logo: "april.svg" },
  { slug: "portail-solimut", nom: "Solimut", genre: "mutuelle", logo: "solimut.png" },
  { slug: "portail-interiale", nom: "Intériale", genre: "mutuelle", logo: "interiale.svg" },
  { slug: "portail-mnt", nom: "MNT", genre: "mutuelle", logo: "mnt.svg", vertical: true },
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
  { slug: "portail-previfrance", nom: "Prévifrance", genre: "mutuelle", logo: "previfrance.svg" },
  { slug: "portail-mma", nom: "MMA", genre: "mutuelle", logo: "mma.svg" },
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

export type Entree = Acteur & {
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
