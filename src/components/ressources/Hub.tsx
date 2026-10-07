import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import {
  GLOSSAIRE_SLUG,
  ORDRE,
  aLaUne,
  autresMetiers,
  categoriesActives,
  ficheJson,
  fichesPlateformes,
  glossaireEnLigne,
  toutCategorie,
  type Categorie,
} from "@/lib/ressources/contenu";
import type { Fiche } from "@/lib/ressources/types";
import { BandeDemo } from "./BandeDemo";
import { CarteArticle, CartePetite, CarteUne, TuilePlateforme } from "./Cartes";
import { Onglets } from "./Onglets";

const conteneur = "mx-auto max-w-[1280px] px-4 md:px-6";
const lienFleche =
  "group/l inline-flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold hover:underline hover:underline-offset-4";
const titreSection = "font-serif text-[24px] font-normal leading-tight md:text-[30px]";
const SIGLES = ["AMC", "AMO", "DRE", "NOEMIE", "PEC", "LPP"];

/** Le hub /ressources en français : une entrée par thème, pas un fil daté. */
export function Hub() {
  const une = aLaUne();
  // Un article n'apparaît qu'une fois sur le hub : « À la une » d'abord.
  const vus = new Set(une.length >= 3 ? une.map((f) => f.slug) : []);
  const cats = categoriesActives().map((c) => ({
    cat: c,
    fiches: toutCategorie(c.slug).filter((f) => !vus.has(f.slug)),
  }));
  // Une rangée seulement à partir de 3 articles ; les autres vont dans « Aussi dans le guide ».
  const rangees = cats.filter((r) => r.fiches.length >= 3);
  const reste = cats
    .filter((r) => r.fiches.length > 0 && r.fiches.length < 3)
    .sort((a, b) => ORDRE.indexOf(a.cat.slug) - ORDRE.indexOf(b.cat.slug))
    .flatMap((r) => r.fiches);
  const aussi = reste.length >= 3 ? reste.slice(0, reste.length - (reste.length % 3)) : reste;
  const plateformes = fichesPlateformes();
  const glossaire = glossaireEnLigne();

  return (
    <SiteLayout fond="var(--bg2)">
      <div className="ress bg-[var(--bg2)]">
        <section className={`${conteneur} pb-8 pt-12 text-center md:pt-14`}>
          <div className="eyebrow">Ressources · Le guide du tiers payant</div>
          <h1 className="mx-auto mt-4 font-serif text-[clamp(40px,5.2vw,64px)] font-normal leading-[1.04] tracking-[-0.02em] [text-wrap:balance]">
            Le tiers payant optique,
            <br className="hidden md:block" />{" "}
            <em className="accent-italic pouls-souligne whitespace-nowrap">sans les rejets</em>.
          </h1>
          <p className="body-lg mx-auto mt-5 max-w-[60ch]">
            Portails, prises en charge, rejets, paiements : des réponses pratiques pour le comptoir,
            écrites par l'équipe qui automatise le tiers payant de magasins d'optique.
          </p>
          <ParProbleme />
          <div className="mt-8 text-left">
            <Onglets actif="tout" centre />
          </div>
        </section>

        {une.length >= 3 && (
          <section className={conteneur} aria-labelledby="a-la-une">
            <h2 id="a-la-une" className="sr-only">
              À la une
            </h2>
            <div className="grid gap-8 pt-4 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <CarteUne fiche={une[0]} titre="h3" />
              </div>
              <div className="grid grid-cols-2 content-start gap-x-3 gap-y-6 md:gap-x-5 md:gap-y-8 lg:col-span-5">
                {une.slice(1).map((f) => (
                  <CartePetite key={f.slug} fiche={f} />
                ))}
              </div>
            </div>
          </section>
        )}

        {rangees.map((r) => (
          <Rangee key={r.cat.slug} cat={r.cat} fiches={r.fiches} />
        ))}

        {aussi.length > 0 && (
          <section className={`${conteneur} monte pt-14`}>
            <div className="mb-6 border-t border-[var(--border)] pt-5">
              <h2 className={titreSection}>Aussi dans le guide</h2>
            </div>
            <Grille fiches={aussi} />
          </section>
        )}

        {plateformes.length >= 3 && (
          <section className={`${conteneur} monte pt-14`}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border)] pt-5">
              <div>
                <div className="eyebrow">Trouver sa plateforme</div>
                <h2 className={`mt-2 ${titreSection}`}>Chaque portail a sa fiche</h2>
              </div>
              <Link
                to="/ressources/categorie/$category"
                params={{ category: "plateformes" }}
                className={lienFleche}
                style={{ color: "#b94a2f" }}
              >
                Voir les {plateformes.length} plateformes <Fleche />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {plateformes.map((f) => (
                <li key={f.slug}>
                  <TuilePlateforme fiche={f} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {glossaire && (
          <section className={`${conteneur} pt-14`}>
            <div className="grid gap-6 rounded-[18px] border border-[var(--border)] bg-[#f1ede5] p-7 md:grid-cols-[1fr_auto] md:items-end md:p-10">
              <div>
                <span className="eyebrow" style={{ color: "#5e574b" }}>
                  Glossaire
                </span>
                <h2 className={`mt-2 ${titreSection}`}>AMC, DRE, NOEMIE… en une phrase</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {SIGLES.map((s) => (
                    <li key={s}>
                      <Link
                        to="/ressources/$slug"
                        params={{ slug: GLOSSAIRE_SLUG }}
                        className="block rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 font-mono text-[15px] font-medium hover:border-[var(--terra)]"
                      >
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/ressources/$slug"
                params={{ slug: GLOSSAIRE_SLUG }}
                className={lienFleche}
                style={{ color: "#5e574b" }}
              >
                Tout le glossaire <Fleche />
              </Link>
            </div>
          </section>
        )}

        <AutresMetiers />

        <div className="pb-1">
          <BandeDemo />
        </div>
      </div>
    </SiteLayout>
  );
}

export function Fleche() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform group-hover:translate-x-0.5 group-hover/l:translate-x-0.5 motion-reduce:transition-none"
    >
      →
    </span>
  );
}

function Grille({ fiches }: { fiches: Fiche[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
      {fiches.map((f) => (
        <div
          key={f.slug}
          className="w-[78vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none"
        >
          <CarteArticle fiche={f} />
        </div>
      ))}
    </div>
  );
}

/** Une rangée par catégorie (Seed) : titre coloré, description, 3 cartes, lien vers le thème. */
function Rangee({ cat, fiches }: { cat: Categorie; fiches: Fiche[] }) {
  const total = toutCategorie(cat.slug).length;
  return (
    <section className={`${conteneur} monte pt-14`}>
      <div className="mb-6 flex items-end justify-between gap-4 border-t border-[var(--border)] pt-5">
        <div>
          <h2 className={titreSection} style={{ color: cat.ink }}>
            {cat.nom}
          </h2>
          <p className="mt-1.5 max-w-[60ch] text-[15px] text-[var(--text-soft)]">
            {cat.description}
          </p>
        </div>
        <Link
          to="/ressources/categorie/$category"
          params={{ category: cat.slug }}
          className={lienFleche}
          style={{ color: cat.ink }}
        >
          Tout le thème ({total}) <Fleche />
        </Link>
      </div>
      <Grille fiches={fiches.slice(0, 3)} />
    </section>
  );
}

/** Entrée par problème : on part de la question du lecteur, jamais de notre offre. */
function ParProbleme() {
  const actives = new Set(categoriesActives().map((c) => c.slug));
  const pilier = ficheJson("tiers-payant-opticien");
  type Tuile = { texte: string; to: string; params: Record<string, string> };
  const cat = (texte: string, category: string): Tuile[] =>
    actives.has(category as never)
      ? [{ texte, to: "/ressources/categorie/$category", params: { category } }]
      : [];
  const tuiles: Tuile[] = [
    ...cat("Je dois corriger un rejet", "rejets"),
    ...cat("Je cherche le portail d'une mutuelle", "plateformes"),
    ...cat("Un paiement n'est pas arrivé", "paiements"),
    ...(pilier
      ? [{ texte: "Je découvre le tiers payant", to: "/ressources/$slug", params: { slug: pilier.slug } }]
      : cat("Je découvre le tiers payant", "guide-tiers-payant")),
  ];
  if (tuiles.length < 2) return null;
  return (
    <div className="mx-auto mt-8 max-w-[880px] text-left">
      <p className="text-center text-[13px] font-medium text-[var(--text-muted)]">
        Vous cherchez…
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {tuiles.map((t) => (
          <li key={t.texte}>
            <Link
              to={t.to}
              params={t.params as never}
              className="group/l flex h-full items-center justify-between gap-2 rounded-[12px] border border-[var(--border)] bg-white px-3.5 py-3 text-[14.5px] font-medium leading-snug transition hover:border-[var(--border2)] hover:shadow-[var(--shadow-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]"
            >
              {t.texte}
              <Fleche />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Les anciens articles hors optique : une sortie, pas une rubrique. */
function AutresMetiers() {
  const lien = (a: (typeof autresMetiers)[number]) => (
    <li key={a.slug} className="border-t border-[var(--border)]">
      <Link
        to="/ressources/$slug"
        params={{ slug: a.slug }}
        className="group block py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {a.category}
        </span>
        <span className="mt-1 block text-[14.5px] font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
          {a.title}
        </span>
      </Link>
    </li>
  );
  const grille = "grid gap-x-8 md:grid-cols-2 lg:grid-cols-3";
  return (
    <section className={`${conteneur} pt-14`}>
      <span className="eyebrow" style={{ color: "#6b6458" }}>
        Hors optique
      </span>
      <h2 className="mt-2 font-serif text-[22px] font-normal leading-tight">
        Autres métiers de santé
      </h2>
      <p className="mt-2 max-w-[60ch] text-[15px] text-[var(--text-soft)]">
        Nos articles sur l'audioprothèse, l'officine, le dentaire, les laboratoires et les
        établissements de soins.
      </p>
      <ul className={`mt-5 ${grille}`}>{autresMetiers.slice(0, 6).map(lien)}</ul>
      {autresMetiers.length > 6 && (
        <details className="mt-2">
          <summary className="cursor-pointer py-2 text-[14px] font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[var(--terra)]">
            Voir les {autresMetiers.length - 6} autres articles
          </summary>
          <ul className={grille}>{autresMetiers.slice(6).map(lien)}</ul>
        </details>
      )}
    </section>
  );
}
