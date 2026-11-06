import { Link } from "@tanstack/react-router";
import logoGranit from "@/assets/logo.svg";
import { useLanguage } from "@/lib/i18n";
import {
  categorie,
  couperTitre,
  dateLang,
  ficheLang,
  jourMois,
  tempsLecture,
  titreCourt,
} from "@/lib/ressources/contenu";
import {
  estSymbole,
  LIGNES_FENETRE,
  logoPlateforme,
  nomFenetre,
  PORTAILS_FENETRE,
  statutsCarte,
  type StatutsCarte,
} from "@/lib/ressources/logos";
import { estFichePlateforme, estFicheTousPortails } from "@/lib/ressources/couverture";
import type { Fiche } from "@/lib/ressources/types";
import { CouvertureDessinee } from "./CouvertureDessinee";

const copy = {
  fr: {
    logo: (nom: string) => `Logo ${nom}`,
    pec: "Prises en charge",
    tousPortails: "Tous portails",
    commencer: "Pour commencer",
    releve: (date: string) => `Relevé le ${date}`,
  },
  en: {
    logo: (nom: string) => `${nom} logo`,
    pec: "Coverage approvals",
    tousPortails: "All portals",
    commencer: "Start here",
    releve: (date: string) => `Checked ${date}`,
  },
};

/** Titre façon Function : ce qui suit « : » ou « ? » prend la couleur de la catégorie (droit, sans italique). */
export function TitreItalique({ titre, ink }: { titre: string; ink: string }) {
  const [tete, suite] = couperTitre(titre);
  if (!suite) return <>{titre}</>;
  // On garde la typographie du titre : « : » en français, « : » sans espace en anglais.
  return (
    <>
      {tete}
      {tete.endsWith("?") ? " " : titre.includes(" : ") ? " : " : ": "}
      <em className="not-italic" style={{ color: ink }}>
        {suite}
      </em>
    </>
  );
}

/** Marque d'une plateforme : son logo si le fichier de faits en donne un, sinon son initiale. */
export function MarquePlateforme({
  nom,
  logo,
  taille = "sm",
}: {
  nom: string;
  logo?: string;
  taille?: "sm" | "xl";
}) {
  const t = copy[useLanguage().lang];
  const box = taille === "xl" ? "size-16 rounded-[16px]" : "size-10 rounded-[10px]";
  if (logo) {
    return (
      <img
        src={logo}
        alt={taille === "xl" ? t.logo(nom) : ""}
        width={taille === "xl" ? 64 : 40}
        height={taille === "xl" ? 64 : 40}
        className={`${box} shrink-0 border border-[var(--border)] bg-papier object-contain ${taille === "xl" ? "p-2" : "p-1.5"}`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`${box} grid shrink-0 place-items-center bg-encre font-serif text-rose ${taille === "xl" ? "text-[30px]" : "text-[19px]"}`}
    >
      {nom.slice(0, 1).toUpperCase()}
    </span>
  );
}

type Format = "carte" | "petite" | "une" | "pilier";

/**
 * Fond d'une fiche de la catégorie plateformes : une fenêtre d'interface dessinée en CSS, à plat,
 * sur la teinte de la catégorie. Ce n'est pas une capture d'un portail : la fenêtre est la même
 * pour toutes. Mesures en unités de conteneur (ressources.css) : nette à toute taille de carte.
 * - Fiche d'une plateforme : son logo (ou son initiale) en tête, des demandes avec ses statuts.
 * - Sans plateforme (fiche d'introduction) : « Prises en charge » en tête, un portail par ligne.
 * `anime` : la demande que Granit vient de déposer passe de l'attente à l'accord, en boucle lente
 * (carte démo des articles, où seule la première ligne est sûre d'être visible).
 */
export function FenetrePlateforme({
  plateforme,
  anime,
}: {
  plateforme?: { nom: string; logo?: string; statuts: StatutsCarte };
  anime?: boolean;
}) {
  const t = copy[useLanguage().lang];
  const logo = plateforme?.logo;
  // Statuts : les mots du portail (français), dans les deux langues.
  const attente = plateforme?.statuts.attente ?? "En instance";
  const badge = (statut: "accord" | "attente", libelle: string, classe: string) =>
    anime && classe === "vient" ? (
      <span className="badge attente bascule">
        <span className="avant">{attente}</span>
        <span className="apres">{libelle}</span>
      </span>
    ) : (
      <span className={`badge ${statut}`}>{libelle}</span>
    );
  return (
    <div aria-hidden className="ress-fenetre-scene">
      <div className="ress-fenetre">
        <div className="ress-fenetre-barre">
          {plateforme ? (
            <>
              {logo ? (
                <img src={logo} alt="" className={estSymbole(logo) ? "symbole" : "logotype"} />
              ) : (
                <span className="initiale">{plateforme.nom.slice(0, 1).toUpperCase()}</span>
              )}
              {(!logo || estSymbole(logo)) && (
                <span className="nom">{nomFenetre(plateforme.nom)}</span>
              )}
              <span className="ref">{t.pec}</span>
            </>
          ) : (
            <>
              <span className="nom">{t.pec}</span>
              <span className="ref">{t.tousPortails}</span>
            </>
          )}
        </div>
        {plateforme
          ? LIGNES_FENETRE.map((l, i) => (
              <div key={i} className={`ress-fenetre-ligne ${l.classe}`}>
                <span className="textes">
                  <span className="l1" style={{ width: `${l.l1}%` }} />
                  <span className="l2" style={{ width: `${l.l2}%` }} />
                </span>
                <span className="montant" />
                {badge(l.statut, plateforme.statuts[l.statut], l.classe)}
              </div>
            ))
          : PORTAILS_FENETRE.map((l) => (
              <div key={l.nom} className={`ress-fenetre-ligne portail ${l.classe}`}>
                <img src={logoPlateforme(l.logo, "fenetre")} alt="" className="marque" />
                <span className="textes">
                  <span className="l1" style={{ width: "58%" }} />
                  <span className="l2" style={{ width: `${l.l2}%` }} />
                </span>
                {badge(l.statut, l.libelle, l.classe)}
              </div>
            ))}
      </div>
    </div>
  );
}

/**
 * Couverture d'une page comparative : le logo Granit face au logo du concurrent, tels quels.
 * Décor de carte : le titre qui suit dit déjà la comparaison.
 */
export function CouvertureVs({ vs }: { vs: NonNullable<Fiche["vs"]> }) {
  return (
    <div aria-hidden className="ress-vs">
      <div className="ress-vs-plaque">
        <span className="ress-vs-logo">
          <img src={logoGranit} alt="" />
        </span>
        <span className="ress-vs-mot">VS</span>
        <span className="ress-vs-logo">
          <img src={vs.logo} alt="" className={estSymbole(vs.logo) ? "symbole" : undefined} />
          {estSymbole(vs.logo) && <span className="nom">{vs.nom}</span>}
        </span>
      </div>
    </div>
  );
}

/**
 * Couverture d'une carte : pour une fiche plateforme la fenêtre de prise en charge, pour une page
 * comparative les deux logos, sinon la scène de l'article, et l'étiquette de catégorie en haut à gauche.
 */
function Couverture({
  fiche,
  etiquette,
  format = "carte",
}: {
  fiche: Fiche;
  etiquette: string;
  format?: Format;
}) {
  const c = categorie(fiche.category)!;
  const forme = {
    carte: "aspect-[4/3] rounded-[14px]",
    petite: "aspect-[4/3] rounded-[12px]",
    une: "aspect-[4/3] rounded-[16px] lg:aspect-[16/10]",
    pilier: "aspect-[16/10] rounded-[16px]",
  }[format];
  const nom = fiche.plateforme?.nom ?? titreCourt(fiche.title);
  return (
    <div className={`relative overflow-hidden ${forme}`} style={{ backgroundColor: c.tint }}>
      {estFichePlateforme(fiche) ? (
        <FenetrePlateforme
          plateforme={{
            nom,
            logo: logoPlateforme(fiche.plateforme?.logo, "fenetre"),
            statuts: fiche.plateforme?.statuts ?? statutsCarte([]),
          }}
        />
      ) : estFicheTousPortails(fiche) ? (
        <FenetrePlateforme />
      ) : fiche.vs ? (
        <CouvertureVs vs={fiche.vs} />
      ) : (
        <CouvertureDessinee fiche={fiche} />
      )}
      <span
        className="absolute left-3 top-3 rounded-[6px] bg-papier/90 px-2 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]"
        style={{ color: c.ink }}
      >
        {etiquette}
      </span>
    </div>
  );
}

/** « 7 min · 12 oct. 2026 » ; un ancien article n'a que sa durée (on n'invente pas de date). */
function Meta({ fiche }: { fiche: Fiche }) {
  const { lang } = useLanguage();
  const parts = fiche.ancien
    ? [tempsLecture(fiche.readTime)]
    : [tempsLecture(fiche.readTime), dateLang(fiche.date, lang)];
  return <>{parts.filter(Boolean).join(" · ")}</>;
}

const lienCarte =
  "group block rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--profond)]";
const survolTitre =
  "transition-colors group-hover:text-[var(--ink)] group-hover:underline decoration-1 underline-offset-[5px]";
const meta = "text-[13.5px] text-[var(--text-muted)]";

/** Carte article (Seed) : couverture, étiquette, titre, durée · date. Un seul lien. */
export function CarteArticle({ fiche, etiquette }: { fiche: Fiche; etiquette?: string }) {
  const { lang } = useLanguage();
  fiche = ficheLang(fiche, lang);
  const c = categorie(fiche.category, lang)!;
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: fiche.slug }}
      className={lienCarte}
      style={{ ["--ink" as string]: c.ink }}
    >
      <Couverture fiche={fiche} etiquette={etiquette ?? fiche.etiquette ?? c.court} />
      <h3 className="mt-4 line-clamp-3 font-serif text-[19px] font-normal leading-[1.25] tracking-[-0.01em] [text-wrap:balance] md:text-[20px]">
        <span className={survolTitre}>{fiche.title}</span>
      </h3>
      <p className={`mt-2 ${meta}`}>
        <Meta fiche={fiche} />
      </p>
    </Link>
  );
}

/** Grande carte (Function) : titre coupé au « : », chapô. */
export function CarteUne({ fiche, titre = "h2" }: { fiche: Fiche; titre?: "h2" | "h3" }) {
  const { lang } = useLanguage();
  fiche = ficheLang(fiche, lang);
  const c = categorie(fiche.category, lang)!;
  const H = titre;
  return (
    <Link to="/ressources/$slug" params={{ slug: fiche.slug }} className={lienCarte}>
      <Couverture fiche={fiche} etiquette={fiche.etiquette ?? c.court} format="une" />
      <H className="mt-5 max-w-[28ch] font-serif text-[clamp(26px,2.6vw,36px)] font-normal leading-[1.15] tracking-[-0.015em]">
        <TitreItalique titre={fiche.title} ink={c.ink} />
      </H>
      {fiche.metaDescription && (
        <p className="mt-3 line-clamp-2 max-w-[56ch] text-[16px] leading-[1.6] text-[var(--text-soft)]">
          {fiche.metaDescription}
        </p>
      )}
      <p className={`mt-3 ${meta}`}>
        <Meta fiche={fiche} />
      </p>
    </Link>
  );
}

/** Carte horizontale du pilier en tête d'une page catégorie. */
export function CartePilier({ fiche }: { fiche: Fiche }) {
  const { lang } = useLanguage();
  fiche = ficheLang(fiche, lang);
  const c = categorie(fiche.category, lang)!;
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: fiche.slug }}
      className={`${lienCarte} grid items-center gap-6 md:grid-cols-12 md:gap-8`}
    >
      <div className="md:col-span-7">
        <Couverture fiche={fiche} etiquette={c.court} format="pilier" />
      </div>
      <div className="md:col-span-5">
        <span className="eyebrow">{copy[lang].commencer}</span>
        <h2 className="mt-3 font-serif text-[clamp(26px,2.6vw,36px)] font-normal leading-[1.15] tracking-[-0.015em]">
          <TitreItalique titre={fiche.title} ink={c.ink} />
        </h2>
        {fiche.metaDescription && (
          <p className="mt-3 line-clamp-3 text-[16px] leading-[1.6] text-[var(--text-soft)]">
            {fiche.metaDescription}
          </p>
        )}
        <p className={`mt-3 ${meta}`}>
          <Meta fiche={fiche} />
        </p>
      </div>
    </Link>
  );
}

/** Petite carte de la grille 2×2 « À la une ». */
export function CartePetite({ fiche }: { fiche: Fiche }) {
  const { lang } = useLanguage();
  fiche = ficheLang(fiche, lang);
  const c = categorie(fiche.category, lang)!;
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: fiche.slug }}
      className={lienCarte}
      style={{ ["--ink" as string]: c.ink }}
    >
      <Couverture fiche={fiche} etiquette={fiche.etiquette ?? c.court} format="petite" />
      <h3 className="mt-3 line-clamp-3 font-serif text-[15px] font-normal leading-[1.3] md:text-[17px]">
        <span className={survolTitre}>{titreCourt(fiche.title)}</span>
      </h3>
      <p className="mt-1.5 text-[12.5px] text-[var(--text-muted)]">
        <span className="hidden md:inline">
          <Meta fiche={fiche} />
        </span>
        <span className="md:hidden">{tempsLecture(fiche.readTime)}</span>
      </p>
    </Link>
  );
}

/** Tuile d'une fiche plateforme : logo ou monogramme, nom, date de relevé. */
export function TuilePlateforme({ fiche }: { fiche: Fiche }) {
  const { lang } = useLanguage();
  fiche = ficheLang(fiche, lang);
  const nom = fiche.plateforme?.nom ?? titreCourt(fiche.title);
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: fiche.slug }}
      className="flex items-center gap-3 rounded-[12px] border border-[var(--border)] bg-papier p-3.5 transition hover:border-[var(--border2)] hover:shadow-[var(--ombre-douce)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--profond)]"
    >
      <MarquePlateforme nom={nom} logo={logoPlateforme(fiche.plateforme?.logo, "carre")} />
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold leading-tight">{nom}</span>
        {fiche.plateforme?.checkedOn && (
          <span className="mt-1 hidden font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] min-[360px]:block">
            {copy[lang].releve(jourMois(fiche.plateforme.checkedOn, lang))}
          </span>
        )}
      </span>
    </Link>
  );
}
