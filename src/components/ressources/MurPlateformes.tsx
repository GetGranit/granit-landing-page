// Section « Les plateformes de tiers payant » du hub : un mur de marques séparées par des filets
// fins, en niveaux de gris qui reprennent leur couleur au survol. Le mur garde la même taille
// quelle que soit la longueur de l'annuaire : au-delà de l'échantillon, on renvoie à la liste.
import { Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { dateFr } from "@/lib/ressources/contenu";
import { GENRES, annuaire, type Entree, type Genre } from "@/lib/ressources/annuaire";
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
/** Ordre des métiers dans le filtre : les métiers du comptoir d'abord. */
const ORDRE_METIERS = Object.keys(METIER_COURT) as VerticaleSlug[];
/** À partir de ce nombre de métiers, l'étiquette dit « Tous métiers ». */
const TOUS_METIERS = 6;

const mono = "font-mono text-[10.5px] uppercase tracking-[0.1em]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#b94a2f]";
const cadre = "relative flex h-[116px] flex-col items-center justify-center px-4 md:h-[136px]";

export function MurPlateformes({ fiches }: { fiches: Fiche[] }) {
  const [genre, setGenre] = useState<Genre | "tous">("tous");
  const [metier, setMetier] = useState<VerticaleSlug | "tous">("tous");
  const entrees = annuaire(fiches);
  const passe = (e: Entree, g = genre, m = metier) =>
    (g === "tous" || e.genre === g) && (m === "tous" || e.metiers.includes(m));
  const metiers = ORDRE_METIERS.filter((v) => entrees.some((e) => e.metiers.includes(v)));
  const enLigne = entrees.filter((e) => e.fiche).length;
  const annonces = entrees.length - enLigne;
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
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-[var(--border)] pt-5">
        <div className="max-w-[56ch]">
          <p className={`${mono} text-[var(--text-muted)]`}>Annuaire du tiers payant</p>
          <h2 className="mt-2 font-serif text-[26px] font-normal leading-tight md:text-[34px]">
            Les plateformes de tiers payant
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-soft)]">
            Une fiche par portail : espace pro, prise en charge, statuts et paiement. Relevées sur
            le portail lui-même, communes à tous les métiers.
          </p>
        </div>
        <dl className="flex items-end gap-6 md:gap-8">
          <Compteur
            valeur={enLigne}
            libelle={enLigne > 1 ? "portails relevés" : "portail relevé"}
          />
          {annonces > 0 && (
            <>
              <span aria-hidden className="mb-1 h-12 w-px bg-[var(--border)]" />
              <Compteur valeur={annonces} libelle="en préparation" pale />
            </>
          )}
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Filtrer par type"
          className="inline-flex max-w-full self-start overflow-x-auto rounded-full border border-[var(--border)] bg-white p-1"
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
                className={`${focus} shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors ${actif ? "bg-[var(--text)] font-semibold text-white" : "text-[var(--text-soft)] hover:text-[var(--text)]"}`}
              >
                {id === "tous" ? "Tout" : GENRES[id].filtre}
                <span
                  className={`${mono} ml-1.5 ${actif ? "text-white/70" : "text-[var(--text-muted)]"}`}
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
            aria-label="Filtrer par métier"
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
                  className={`${focus} shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[13px] transition-colors ${actif ? "border-[#b94a2f] bg-[#b94a2f]/10 text-[#b94a2f]" : "border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--text-muted)] hover:text-[var(--text)]"}`}
                >
                  {v === "tous" ? "Tous métiers" : METIER_COURT[v]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ul
        className={`mt-4 grid grid-cols-2 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] md:grid-cols-4 lg:grid-cols-5`}
      >
        {vedette && <Vedette e={vedette} />}
        {mur.map((e, i) => (
          <Case key={e.slug} e={e} metier={metier} cacheMobile={i >= surMobile} />
        ))}
        {enLigne > 1 ? (
          <CaseLien total={entrees.length} reste={reste} resteMobile={resteMobile} />
        ) : (
          <CaseAVenir reste={reste} resteMobile={resteMobile} />
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
        <span>Plateformes, réseaux de soins et mutuelles</span>
        {dernierReleve && <span>Dernier relevé le {dateFr(dernierReleve)}</span>}
      </p>
    </section>
  );
}

function Compteur({ valeur, libelle, pale }: { valeur: number; libelle: string; pale?: boolean }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className={`${mono} mt-1.5 text-[var(--text-muted)]`}>{libelle}</dt>
      <dd
        className={`font-serif text-[44px] leading-[0.85] tabular-nums md:text-[60px] ${pale ? "text-[var(--text-muted)]" : "text-[var(--text)]"}`}
      >
        {valeur}
      </dd>
    </div>
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
}: {
  metiers: VerticaleSlug[];
  actif: VerticaleSlug | "tous";
}) {
  if (metiers.length === 0) return null;
  const tous = metiers.length >= TOUS_METIERS;
  return (
    <span
      className={`${mono} absolute inset-x-3 top-2.5 truncate text-[9.5px] tracking-[0.08em] text-[var(--text-muted)]`}
    >
      {tous
        ? "Tous métiers"
        : metiers.map((m, i) => (
            <Fragment key={m}>
              {i > 0 && " · "}
              <span className={m === actif ? "text-[#b94a2f]" : undefined}>{METIER_COURT[m]}</span>
            </Fragment>
          ))}
    </span>
  );
}

function Case({
  e,
  metier,
  cacheMobile,
}: {
  e: Entree;
  metier: VerticaleSlug | "tous";
  cacheMobile?: boolean;
}) {
  const li = `bg-[var(--bg2)] ${cacheMobile ? "hidden md:block" : ""}`;
  const pied = (
    <span
      className={`${mono} absolute inset-x-3 bottom-2.5 flex items-center justify-between text-[var(--text-muted)]`}
    >
      <span>{GENRES[e.genre].court}</span>
      {e.fiche ? (
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5 group-hover:text-[#b94a2f]"
        >
          →
        </span>
      ) : (
        <span className="rounded-full border border-[var(--border)] px-1.5 py-px text-[9.5px] tracking-[0.08em]">
          Bientôt
        </span>
      )}
    </span>
  );
  if (!e.fiche) {
    return (
      <li className={li}>
        <div className={cadre}>
          <span className="sr-only">
            {e.nom}, {GENRES[e.genre].nom}
            {e.metiers.length > 0 && ` (${e.metiers.map((m) => METIER_COURT[m]).join(", ")})`} :
            fiche bientôt.
          </span>
          <span aria-hidden className="contents">
            <Etiquettes metiers={e.metiers} actif={metier} />
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
        aria-label={`${e.nom} : la fiche`}
        className={`group ${cadre} ${focus} transition-colors duration-300 hover:bg-white`}
      >
        <Etiquettes metiers={e.metiers} actif={metier} />
        <Marque e={e} />
        {pied}
      </Link>
    </li>
  );
}

const autres = (n: number, sinon: string) => (n > 0 ? `+ ${n} autres` : sinon);

function CaseLien({
  total,
  reste,
  resteMobile,
}: {
  total: number;
  reste: number;
  resteMobile: number;
}) {
  return (
    <li className="bg-[var(--bg2)]">
      <Link
        to="/ressources/categorie/$category"
        params={{ category: "plateformes" }}
        className={`group ${cadre} ${focus} items-start justify-between py-4 text-[#b94a2f] transition-colors hover:bg-[#b94a2f]/[0.06]`}
      >
        <span className={mono}>
          <span className="md:hidden">{autres(resteMobile, "Annuaire")}</span>
          <span className="hidden md:inline">{autres(reste, "Annuaire")}</span>
        </span>
        <span className="font-serif text-[20px] leading-tight md:text-[22px]">
          Tout{" "}
          <span className="whitespace-nowrap">
            l'annuaire{" "}
            <span
              aria-hidden
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </span>
        <span className={`${mono} text-[var(--text-muted)]`}>{total} entrées</span>
      </Link>
    </li>
  );
}

/** Tant qu'une seule fiche est en ligne, la dernière case dit ce qui arrive. */
function CaseAVenir({ reste, resteMobile }: { reste: number; resteMobile: number }) {
  return (
    <li className="bg-[var(--bg2)]">
      <div className={`${cadre} items-start justify-between py-4`}>
        <span className={`${mono} text-[var(--text-muted)]`}>
          <span className="md:hidden">{autres(resteMobile, "Et la suite")}</span>
          <span className="hidden md:inline">{autres(reste, "Et la suite")}</span>
        </span>
        <span className="font-serif text-[15px] leading-snug text-[var(--text-soft)] md:text-[18px]">
          Chaque portail est relevé sur son espace pro avant d'avoir sa fiche.
        </span>
      </div>
    </li>
  );
}

/** La fiche seule, sur 2×2 cases : logo en couleur, ce que le relevé contient, le lien. */
function Vedette({ e }: { e: Entree }) {
  const logo = logoPlateforme(e.fiche?.plateforme?.logo, "carre");
  return (
    <li className="col-span-2 bg-white md:row-span-2">
      <Link
        to="/ressources/$slug"
        params={{ slug: e.slug }}
        className={`group flex h-full flex-col justify-between gap-6 p-5 md:p-7 ${focus}`}
      >
        <div className="flex items-start justify-between gap-4">
          {logo ? (
            <img src={logo} alt={`Logo ${e.nom}`} className="size-16 object-contain md:size-20" />
          ) : (
            <Monogramme nom={e.nom} />
          )}
          <span className={`${mono} rounded-full bg-[#b94a2f]/10 px-2 py-0.5 text-[#b94a2f]`}>
            Fiche en ligne
          </span>
        </div>
        <div>
          <p className={`${mono} text-[var(--text-muted)]`}>
            {GENRES[e.genre].court}
            {e.checkedOn && ` · relevé le ${dateFr(e.checkedOn)}`}
          </p>
          <p className="mt-1 font-serif text-[28px] leading-tight md:text-[34px]">{e.nom}</p>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--border)] pt-4">
            {e.organismes > 0 && (
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-[13px] text-[var(--text-soft)]">
                  complémentaires dans son sélecteur
                </dt>
                <dd className="font-serif text-[26px] leading-none tabular-nums">{e.organismes}</dd>
              </div>
            )}
            {e.chiffre && (
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-[13px] text-[var(--text-soft)]">{e.chiffre.label}</dt>
                <dd className="font-serif text-[26px] leading-none tabular-nums">
                  {e.chiffre.valeur}
                </dd>
              </div>
            )}
          </dl>
          <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-[#b94a2f] group-hover:underline group-hover:underline-offset-4">
            Lire la fiche <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
