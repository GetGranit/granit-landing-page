import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import {
  GLOSSAIRE_SLUG,
  ORDRE,
  aLaUne,
  fichesTransversales,
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
import { VotreMetier } from "./Metiers";
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
  // Les plateformes sont communes à tous les métiers : section dès 1 fiche en aperçu, 3 en ligne.
  const seuilPlateformes = plateformes.some((f) => f.preview) ? 1 : 3;
  const glossaire = glossaireEnLigne();

  return (
    <SiteLayout fond="var(--bg2)">
      <div className="ress bg-[var(--bg2)]">
        <section className={`${conteneur} pb-8 pt-12 text-center md:pt-14`}>
          <div className="eyebrow">Ressources · Pour les professionnels de santé</div>
          <h1 className="mx-auto mt-4 font-serif text-[clamp(40px,5.2vw,64px)] font-normal leading-[1.14] tracking-[-0.02em] [text-wrap:balance]">
            L'administratif de santé,
            <br className="hidden md:block" />{" "}
            <em className="accent-italic pouls-souligne whitespace-nowrap">sans le casse-tête</em>.
          </h1>
          <p className="body-lg mx-auto mt-10 max-w-[60ch]">
            Opticiens, dentistes, cliniques et EHPAD, centres de santé, laboratoires,
            audioprothésistes, pharmaciens : des réponses pratiques sur les mutuelles, les
            remboursements, les paiements et la réglementation. Partez de votre métier ou de votre
            question.
          </p>
          <ParProbleme />
        </section>

        <VotreMetier />

        {plateformes.length >= seuilPlateformes && (
          <section className={`${conteneur} pt-14`}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border)] pt-5">
              <div>
                <h2 className={titreSection}>Les plateformes de tiers payant</h2>
                <p className="mt-1.5 max-w-[60ch] text-[15px] text-[var(--text-soft)]">
                  Une fiche par portail : espace pro, prise en charge, statuts et paiement. Communes
                  à tous les métiers.
                </p>
              </div>
              <Link
                to="/ressources/categorie/$category"
                params={{ category: "plateformes" }}
                className={lienFleche}
                style={{ color: "#b94a2f" }}
              >
                {plateformes.length > 1
                  ? `Voir les ${plateformes.length} plateformes`
                  : "Voir la fiche"}{" "}
                <Fleche />
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

        <section className={`${conteneur} pb-8 pt-14 text-center`}>
          <h2 className="font-serif text-[24px] font-normal leading-tight md:text-[30px]">
            Par thème
          </h2>
          <p className="mt-2 text-[15px] text-[var(--text-soft)]">
            Valable pour tous les métiers, sauf mention.
          </p>
          <div className="mt-6 text-left">
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
                {une.slice(1).map((f, i) => (
                  // Damier décalé d'un cran par rapport à la grande carte (rang 0) : aucune voisine identique.
                  <CartePetite key={f.slug} fiche={f} rang={(Math.floor(i / 2) + i + 1) % 2} />
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

        <PourTous vus={vus} rangees={rangees.flatMap((r) => r.fiches.slice(0, 3))} aussi={aussi} />

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
      {fiches.map((f, i) => (
        <div
          key={f.slug}
          className="w-[78vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none"
        >
          <CarteArticle fiche={f} rang={i} />
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
      ? [
          {
            texte: "Je découvre le tiers payant",
            to: "/ressources/$slug",
            params: { slug: pilier.slug },
          },
        ]
      : cat("Je découvre le tiers payant", "guide-tiers-payant")),
  ];
  if (tuiles.length < 2) return null;
  return (
    <div className="mx-auto mt-8 max-w-[880px] text-left">
      <p className="text-center text-[13px] font-medium text-[var(--text-muted)]">Vous cherchez…</p>
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

/** Les articles valables pour tous les métiers, en liste compacte, sans ceux déjà montrés. */
function PourTous({ vus, rangees, aussi }: { vus: Set<string>; rangees: Fiche[]; aussi: Fiche[] }) {
  const montres = new Set([...vus, ...rangees.map((f) => f.slug), ...aussi.map((f) => f.slug)]);
  const liste = fichesTransversales.filter((f) => !montres.has(f.slug));
  if (!liste.length) return null;
  return (
    <section className={`${conteneur} pt-14`}>
      <div className="border-t border-[var(--border)] pt-5">
        <span className="eyebrow" style={{ color: "#6b6458" }}>
          Pour tous les métiers
        </span>
        <h2 className="mt-2 font-serif text-[22px] font-normal leading-tight">
          Rejets, rapprochement, réglementation et outils
        </h2>
      </div>
      <ul className="mt-5 grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
        {liste.map((f) => (
          <li key={f.slug} className="border-t border-[var(--border)]">
            <Link
              to="/ressources/$slug"
              params={{ slug: f.slug }}
              className="group block py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {f.etiquette}
              </span>
              <span className="mt-1 block text-[14.5px] font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
                {f.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
