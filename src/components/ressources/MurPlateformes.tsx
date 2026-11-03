// Section « Les plateformes de tiers payant » du hub : un mur de marques séparées par des filets
// fins, en niveaux de gris qui reprennent leur couleur au survol. Le mur garde la même taille
// quelle que soit la longueur de l'annuaire : au-delà de l'échantillon, on renvoie à la liste.
import { Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";
import { dateLang } from "@/lib/ressources/contenu";
import { GENRES, GENRES_EN, annuaire, type Entree, type Genre } from "@/lib/ressources/annuaire";
import { logoPlateforme } from "@/lib/ressources/logos";
import type { Fiche, VerticaleSlug } from "@/lib/ressources/types";

/** Cases du mur, case de fin comprise : 4 rangées de 5 (ou 5 de 4). La vedette compte pour 4. */
const CASES = 20;
/** Sur mobile (2 colonnes), 6 rangées. La vedette y compte pour 2. */
const CASES_MOBILE = 12;

const FILTRES: (Genre | "tous")[] = ["tous", "plateforme", "reseau", "mutuelle"];

/** Nom court d'un métier sur les étiquettes des cases. */
const METIER_COURT: Record<VerticaleSlug, string> = {
  optique: "Optique",
  audio: "Audio",
  dentaire: "Dentaire",
  pharmacie: "Pharmacie",
  laboratoires: "Labos",
  cliniques: "Cliniques",
  centres: "Centres",
  ehpad: "EHPAD",
};
const METIER_COURT_EN: typeof METIER_COURT = {
  optique: "Optical",
  audio: "Hearing",
  dentaire: "Dental",
  pharmacie: "Pharmacy",
  laboratoires: "Labs",
  cliniques: "Clinics",
  centres: "Centers",
  ehpad: "Nursing homes",
};
/** Ordre des métiers dans le filtre : les métiers du comptoir d'abord. */
const ORDRE_METIERS = Object.keys(METIER_COURT) as VerticaleSlug[];

const copy = {
  fr: {
    genres: GENRES,
    metiers: METIER_COURT,
    surtitre: "Annuaire du tiers payant",
    titre: "Les plateformes de tiers payant",
    chapo:
      "Une fiche par portail : espace pro, prise en charge, statuts et paiement. Relevées sur le portail lui-même, communes à tous les métiers.",
    parType: "Filtrer par type",
    tout: "Tout",
    parMetier: "Filtrer par métier",
    tousMetiers: "Tous métiers",
    pied: "Plateformes, réseaux de soins et mutuelles",
    dernier: (d: string) => `Dernier relevé le ${d}`,
    bientot: "Bientôt",
    ficheBientot: " : fiche bientôt.",
    laFiche: (nom: string) => `${nom} : la fiche`,
    autres: (n: number) => `+ ${n} autres`,
    annuaire: "Annuaire",
    tout1: "Tout",
    tout2: "l'annuaire",
    entrees: (n: number) => `${n} entrées`,
    suite: "Et la suite",
    aVenir: "Chaque portail est relevé sur son espace pro avant d'avoir sa fiche.",
    logo: (nom: string) => `Logo ${nom}`,
    enLigne: "Fiche en ligne",
    releve: (d: string) => ` · relevé le ${d}`,
    selecteur: "complémentaires dans son sélecteur",
    lire: "Lire la fiche",
  },
  en: {
    genres: GENRES_EN,
    metiers: METIER_COURT_EN,
    surtitre: "Third-party payment directory",
    titre: "Third-party payment platforms",
    chapo:
      "One fact sheet per portal: professional portal, coverage approval, statuses and payment. Checked on the portal itself, shared by every profession.",
    parType: "Filter by type",
    tout: "All",
    parMetier: "Filter by profession",
    tousMetiers: "All professions",
    pied: "Platforms, care networks and insurers",
    dernier: (d: string) => `Last checked ${d}`,
    bientot: "Soon",
    ficheBientot: ": fact sheet coming soon.",
    laFiche: (nom: string) => `${nom}: fact sheet`,
    autres: (n: number) => `+ ${n} more`,
    annuaire: "Directory",
    tout1: "Full",
    tout2: "directory",
    entrees: (n: number) => `${n} entries`,
    suite: "More to come",
    aVenir: "Each portal is checked on its professional portal before it gets a fact sheet.",
    logo: (nom: string) => `${nom} logo`,
    enLigne: "Fact sheet online",
    releve: (d: string) => ` · checked ${d}`,
    selecteur: "insurers in its selector",
    lire: "Read the fact sheet",
  },
};
type Copy = (typeof copy)["fr"];
/** À partir de ce nombre de métiers, l'étiquette dit « Tous métiers ». */
const TOUS_METIERS = 6;

const mono = "font-mono text-[10.5px] uppercase tracking-[0.1em]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--profond)]";
const cadre = "relative flex h-[116px] flex-col items-center justify-center px-4 md:h-[136px]";

export function MurPlateformes({ fiches }: { fiches: Fiche[] }) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [genre, setGenre] = useState<Genre | "tous">("tous");
  const [metier, setMetier] = useState<VerticaleSlug | "tous">("tous");
  const entrees = annuaire(fiches);
  const passe = (e: Entree, g = genre, m = metier) =>
    (g === "tous" || e.genre === g) && (m === "tous" || e.metiers.includes(m));
  const metiers = ORDRE_METIERS.filter((v) => entrees.some((e) => e.metiers.includes(v)));
  const enLigne = entrees.filter((e) => e.fiche).length;
  const dernierReleve = entrees
    .map((e) => e.checkedOn ?? "")
    .sort()
    .at(-1);

  // Une seule fiche : elle passe en vedette sur 2×2 cases, les autres attendent en filigrane.
  const vedette = enLigne === 1 && passe(entrees[0]) ? entrees[0] : undefined;
  const filtrees = entrees.filter((e) => e !== vedette && passe(e));
  const place = (cases: number, poidsVedette: number) => cases - 1 - (vedette ? poidsVedette : 0);
  const mur = filtrees.slice(0, place(CASES, 4));
  const surMobile = place(CASES_MOBILE, 2);
  const reste = filtrees.length - mur.length;
  const resteMobile = filtrees.length - Math.min(mur.length, surMobile);

  // Cases vides qui ferment la dernière rangée, à 2, 4 et 5 colonnes.
  const aire = (vedette ? 4 : 0) + mur.length + 1;
  const aireMobile = (vedette ? 2 : 0) + Math.min(mur.length, surMobile) + 1;
  const vides = [(2 - (aireMobile % 2)) % 2, (4 - (aire % 4)) % 4, (5 - (aire % 5)) % 5];

  return (
    <section className="mx-auto max-w-[1280px] px-4 pt-14 md:px-6">
      <div className="border-t border-[var(--border)] pt-5">
        <div className="max-w-[56ch]">
          <p className={`${mono} text-[var(--text-muted)]`}>{t.surtitre}</p>
          <h2 className="mt-2 font-serif text-[26px] font-normal leading-tight md:text-[34px]">
            {t.titre}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-soft)]">{t.chapo}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label={t.parType}
          className="inline-flex max-w-full self-start overflow-x-auto rounded-full border border-[var(--border)] bg-papier p-1"
        >
          {FILTRES.map((id) => {
            const n = entrees.filter((e) => passe(e, id)).length;
            const actif = genre === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={actif}
                onClick={() => setGenre(id)}
                className={`${focus} shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors ${actif ? "bg-encre font-semibold text-menthe" : "text-[var(--text-soft)] hover:text-[var(--text)]"}`}
              >
                {id === "tous" ? t.tout : t.genres[id].filtre}
                <span
                  className={`${mono} ml-1.5 ${actif ? "text-menthe/70" : "text-[var(--text-muted)]"}`}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>
        {metiers.length > 1 && (
          <div
            role="group"
            aria-label={t.parMetier}
            className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:justify-end md:overflow-visible md:px-0 md:pb-0"
          >
            {(["tous", ...metiers] as const).map((v) => {
              const actif = metier === v;
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => setMetier(v)}
                  className={`${focus} shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[13px] transition-colors ${actif ? "border-transparent bg-succes-fond text-succes-texte" : "border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--text-muted)] hover:text-[var(--text)]"}`}
                >
                  {v === "tous" ? t.tousMetiers : t.metiers[v]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ul
        className={`mt-4 grid grid-cols-2 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] md:grid-cols-4 lg:grid-cols-5`}
      >
        {vedette && <Vedette e={vedette} t={t} lang={lang} />}
        {mur.map((e, i) => (
          <Case key={e.slug} e={e} metier={metier} cacheMobile={i >= surMobile} t={t} />
        ))}
        {enLigne > 1 ? (
          <CaseLien total={entrees.length} reste={reste} resteMobile={resteMobile} t={t} />
        ) : (
          <CaseAVenir reste={reste} resteMobile={resteMobile} t={t} />
        )}
        {Array.from({ length: Math.max(...vides) }, (_, i) => (
          <li
            key={`vide-${i}`}
            aria-hidden
            className={`bg-[var(--bg2)] ${i < vides[0] ? "block" : "hidden"} ${i < vides[1] ? "md:block" : "md:hidden"} ${i < vides[2] ? "lg:block" : "lg:hidden"}`}
          />
        ))}
      </ul>

      <p
        className={`${mono} mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-[var(--text-muted)]`}
      >
        <span>{t.pied}</span>
        {dernierReleve && <span>{t.dernier(dateLang(dernierReleve, lang))}</span>}
      </p>
    </section>
  );
}

/** Le nom composé en serif quand l'acteur n'a pas de logo. */
function Monogramme({ nom, pale }: { nom: string; pale?: boolean }) {
  return (
    <span
      className={`line-clamp-2 max-w-[15ch] text-center font-serif text-[17px] leading-[1.15] md:text-[19px] ${pale ? "text-[var(--text-muted)] opacity-80" : "text-[var(--text-soft)] transition-colors duration-300 group-hover:text-[var(--text)]"}`}
    >
      {nom}
    </span>
  );
}

function Marque({ e }: { e: Entree }) {
  if (!e.logo) return <Monogramme nom={e.nom} pale={!e.fiche} />;
  const teinte = `transition duration-300 ${e.fiche ? "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0" : "opacity-50 grayscale"}`;
  if (e.symbole) {
    return (
      <span className="flex items-center gap-2.5">
        <img
          src={e.logo}
          alt=""
          loading="lazy"
          className={`size-9 object-contain mix-blend-multiply ${teinte}`}
        />
        <span
          className={`font-serif text-[18px] leading-none md:text-[20px] ${e.fiche ? "text-[var(--text-soft)] transition-colors duration-300 group-hover:text-[var(--text)]" : "text-[var(--text-muted)]"}`}
        >
          {e.nom}
        </span>
      </span>
    );
  }
  return (
    <img
      src={e.logo}
      alt=""
      loading="lazy"
      className={`h-auto w-auto object-contain mix-blend-multiply ${e.vertical ? "max-h-14 max-w-[min(96px,60%)]" : "max-h-9 max-w-[min(136px,78%)]"} ${teinte}`}
    />
  );
}

/** Les métiers de l'acteur, en haut de la case ; le métier filtré ressort en couleur. */
function Etiquettes({
  metiers,
  actif,
  t,
}: {
  metiers: VerticaleSlug[];
  actif: VerticaleSlug | "tous";
  t: Copy;
}) {
  if (metiers.length === 0) return null;
  const tous = metiers.length >= TOUS_METIERS;
  return (
    <span
      className={`${mono} absolute inset-x-3 top-2.5 truncate text-[9.5px] tracking-[0.08em] text-[var(--text-muted)]`}
    >
      {tous
        ? t.tousMetiers
        : metiers.map((m, i) => (
            <Fragment key={m}>
              {i > 0 && " · "}
              <span className={m === actif ? "text-profond" : undefined}>{t.metiers[m]}</span>
            </Fragment>
          ))}
    </span>
  );
}

function Case({
  e,
  metier,
  cacheMobile,
  t,
}: {
  e: Entree;
  metier: VerticaleSlug | "tous";
  cacheMobile?: boolean;
  t: Copy;
}) {
  const li = `bg-[var(--bg2)] ${cacheMobile ? "hidden md:block" : ""}`;
  const pied = (
    <span
      className={`${mono} absolute inset-x-3 bottom-2.5 flex items-center justify-between text-[var(--text-muted)]`}
    >
      <span>{t.genres[e.genre].court}</span>
      {e.fiche ? (
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5 group-hover:text-profond"
        >
          →
        </span>
      ) : (
        <span className="rounded-full border border-[var(--border)] px-1.5 py-px text-[9.5px] tracking-[0.08em]">
          {t.bientot}
        </span>
      )}
    </span>
  );
  if (!e.fiche) {
    return (
      <li className={li}>
        <div className={cadre}>
          <span className="sr-only">
            {e.nom}, {t.genres[e.genre].nom}
            {e.metiers.length > 0 && ` (${e.metiers.map((m) => t.metiers[m]).join(", ")})`}
            {t.ficheBientot}
          </span>
          <span aria-hidden className="contents">
            <Etiquettes metiers={e.metiers} actif={metier} t={t} />
            <Marque e={e} />
            {pied}
          </span>
        </div>
      </li>
    );
  }
  return (
    <li className={li}>
      <Link
        to="/ressources/$slug"
        params={{ slug: e.slug }}
        aria-label={t.laFiche(e.nom)}
        className={`group ${cadre} ${focus} transition-colors duration-300 hover:bg-papier`}
      >
        <Etiquettes metiers={e.metiers} actif={metier} t={t} />
        <Marque e={e} />
        {pied}
      </Link>
    </li>
  );
}

const autres = (t: Copy, n: number, sinon: string) => (n > 0 ? t.autres(n) : sinon);

function CaseLien({
  total,
  reste,
  resteMobile,
  t,
}: {
  total: number;
  reste: number;
  resteMobile: number;
  t: Copy;
}) {
  return (
    <li className="bg-[var(--bg2)]">
      <Link
        to="/ressources/categorie/$category"
        params={{ category: "plateformes" }}
        className={`group ${cadre} ${focus} items-start justify-between py-4 text-profond transition-colors hover:bg-profond/[0.06]`}
      >
        <span className={mono}>
          <span className="md:hidden">{autres(t, resteMobile, t.annuaire)}</span>
          <span className="hidden md:inline">{autres(t, reste, t.annuaire)}</span>
        </span>
        <span className="font-serif text-[20px] leading-tight md:text-[22px]">
          {t.tout1}{" "}
          <span className="whitespace-nowrap">
            {t.tout2}{" "}
            <span
              aria-hidden
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </span>
        <span className={`${mono} text-[var(--text-muted)]`}>{t.entrees(total)}</span>
      </Link>
    </li>
  );
}

/** Tant qu'une seule fiche est en ligne, la dernière case dit ce qui arrive. */
function CaseAVenir({
  reste,
  resteMobile,
  t,
}: {
  reste: number;
  resteMobile: number;
  t: Copy;
}) {
  return (
    <li className="bg-[var(--bg2)]">
      <div className={`${cadre} items-start justify-between py-4`}>
        <span className={`${mono} text-[var(--text-muted)]`}>
          <span className="md:hidden">{autres(t, resteMobile, t.suite)}</span>
          <span className="hidden md:inline">{autres(t, reste, t.suite)}</span>
        </span>
        <span className="font-serif text-[15px] leading-snug text-[var(--text-soft)] md:text-[18px]">
          {t.aVenir}
        </span>
      </div>
    </li>
  );
}

/** La fiche seule, sur 2×2 cases : logo en couleur, ce que le relevé contient, le lien. */
function Vedette({ e, t, lang }: { e: Entree; t: Copy; lang: Lang }) {
  const logo = logoPlateforme(e.fiche?.plateforme?.logo, "carre");
  const chiffre = lang === "en" ? (e.chiffreEn ?? e.chiffre) : e.chiffre;
  return (
    <li className="col-span-2 bg-papier md:row-span-2">
      <Link
        to="/ressources/$slug"
        params={{ slug: e.slug }}
        className={`group flex h-full flex-col justify-between gap-6 p-5 md:p-7 ${focus}`}
      >
        <div className="flex items-start justify-between gap-4">
          {logo ? (
            <img src={logo} alt={t.logo(e.nom)} className="size-16 object-contain md:size-20" />
          ) : (
            <Monogramme nom={e.nom} />
          )}
          <span className={`${mono} rounded-full bg-succes-fond px-2 py-0.5 text-succes-texte`}>
            {t.enLigne}
          </span>
        </div>
        <div>
          <p className={`${mono} text-[var(--text-muted)]`}>
            {t.genres[e.genre].court}
            {e.checkedOn && t.releve(dateLang(e.checkedOn, lang))}
          </p>
          <p className="mt-1 font-serif text-[28px] leading-tight md:text-[34px]">{e.nom}</p>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--border)] pt-4">
            {e.organismes > 0 && (
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-[13px] text-[var(--text-soft)]">
                  {t.selecteur}
                </dt>
                <dd className="font-serif text-[26px] leading-none tabular-nums">{e.organismes}</dd>
              </div>
            )}
            {chiffre && (
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-[13px] text-[var(--text-soft)]">{chiffre.label}</dt>
                <dd className="font-serif text-[26px] leading-none tabular-nums">
                  {chiffre.valeur}
                </dd>
              </div>
            )}
          </dl>
          <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-profond group-hover:underline group-hover:underline-offset-4">
            {t.lire} <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
