import { Link } from "@tanstack/react-router";
import { categorie, couperTitre, dateFr, tempsLecture, titreCourt } from "@/lib/ressources/contenu";
import {
  estSymbole,
  LIGNES_FENETRE,
  logoPlateforme,
  nomFenetre,
  PORTAILS_FENETRE,
  statutsCarte,
  type StatutsCarte,
} from "@/lib/ressources/logos";
import {
  photoFiche,
  src,
  srcSet,
  estFichePlateforme,
  estFicheTousPortails,
  type Photo,
} from "@/lib/ressources/photos";
import type { Fiche } from "@/lib/ressources/types";

/** Titre façon Function : ce qui suit « : » ou « ? » passe en italique, couleur de la catégorie. */
export function TitreItalique({ titre, ink }: { titre: string; ink: string }) {
  const [tete, suite] = couperTitre(titre);
  if (!suite) return <>{titre}</>;
  return (
    <>
      {tete}
      {tete.endsWith("?") ? " " : " : "}
      <em className="italic" style={{ color: ink }}>
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
  const box = taille === "xl" ? "size-16 rounded-[16px]" : "size-10 rounded-[10px]";
  if (logo) {
    return (
      <img
        src={logo}
        alt={taille === "xl" ? `Logo ${nom}` : ""}
        width={taille === "xl" ? 64 : 40}
        height={taille === "xl" ? 64 : 40}
        className={`${box} shrink-0 border border-[var(--border)] bg-white object-contain ${taille === "xl" ? "p-2" : "p-1.5"}`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`${box} grid shrink-0 place-items-center bg-[#b94a2f] font-serif text-white ${taille === "xl" ? "text-[30px]" : "text-[19px]"}`}
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
  const logo = plateforme?.logo;
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
              <span className="ref">Prises en charge</span>
            </>
          ) : (
            <>
              <span className="nom">Prises en charge</span>
              <span className="ref">Tous portails</span>
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

/** Photo de carte : srcset 800/1600, recadrée par object-cover, zoom léger au survol. */
export function PhotoCarte({
  photo,
  tailles,
  chargement = "lazy",
}: {
  photo: Photo;
  tailles: string;
  /** "haute" : image principale de la page ; "eager" : visible au chargement. */
  chargement?: "haute" | "eager" | "lazy";
}) {
  return (
    <img
      src={src(photo, 800)}
      srcSet={srcSet(photo)}
      sizes={tailles}
      width={1600}
      height={900}
      loading={chargement === "lazy" ? "lazy" : "eager"}
      fetchPriority={chargement === "haute" ? "high" : undefined}
      decoding="async"
      alt={photo.alt}
      className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );
}

/**
 * Couverture d'une carte : la photo du thème (ou du métier), ou pour une fiche plateforme la
 * fenêtre de prise en charge, et l'étiquette de catégorie en haut à gauche.
 */
function Couverture({
  fiche,
  etiquette,
  format = "carte",
  prioritaire,
  rang,
}: {
  fiche: Fiche;
  etiquette: string;
  format?: Format;
  /** Position dans la liste : fait alterner les photos a/b entre cartes voisines. */
  rang?: number;
  /** "haute" : image principale de la page ; "oui" : visible au chargement. */
  prioritaire?: "haute" | "oui";
}) {
  const c = categorie(fiche.category)!;
  const forme = {
    carte: "aspect-[4/3] rounded-[14px]",
    petite: "aspect-[4/3] rounded-[12px]",
    une: "aspect-[4/3] rounded-[16px] lg:aspect-[16/10]",
    pilier: "aspect-[16/10] rounded-[16px]",
  }[format];
  const tailles = {
    carte: "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 78vw",
    petite: "(min-width: 1024px) 260px, 50vw",
    une: "(min-width: 1024px) 720px, 100vw",
    pilier: "(min-width: 768px) 720px, 100vw",
  }[format];
  const nom = fiche.plateforme?.nom ?? titreCourt(fiche.title);
  const chargement = prioritaire === "haute" ? "haute" : prioritaire ? "eager" : "lazy";
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
      ) : (
        <PhotoCarte photo={photoFiche(fiche, rang)} tailles={tailles} chargement={chargement} />
      )}
      <span
        className="absolute left-3 top-3 rounded-[6px] bg-white/90 px-2 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]"
        style={{ color: c.ink }}
      >
        {etiquette}
      </span>
    </div>
  );
}

/** « 7 min · 12 oct. 2026 » ; un ancien article n'a que sa durée (on n'invente pas de date). */
function Meta({ fiche }: { fiche: Fiche }) {
  const parts = fiche.ancien
    ? [tempsLecture(fiche.readTime)]
    : [tempsLecture(fiche.readTime), dateFr(fiche.date)];
  return <>{parts.filter(Boolean).join(" · ")}</>;
}

const lienCarte =
  "group block rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--terra)]";
const survolTitre =
  "transition-colors group-hover:text-[var(--ink)] group-hover:underline decoration-1 underline-offset-[5px]";
const meta = "text-[13.5px] text-[var(--text-muted)]";

/** Carte article (Seed) : couverture, étiquette, titre, durée · date. Un seul lien. */
export function CarteArticle({
  fiche,
  etiquette,
  prioritaire,
  rang,
}: {
  fiche: Fiche;
  etiquette?: string;
  prioritaire?: "oui";
  rang?: number;
}) {
  const c = categorie(fiche.category)!;
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: fiche.slug }}
      className={lienCarte}
      style={{ ["--ink" as string]: c.ink }}
    >
      <Couverture
        fiche={fiche}
        etiquette={etiquette ?? fiche.etiquette ?? c.court}
        prioritaire={prioritaire}
        rang={rang}
      />
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
  const c = categorie(fiche.category)!;
  const H = titre;
  return (
    <Link to="/ressources/$slug" params={{ slug: fiche.slug }} className={lienCarte}>
      <Couverture
        fiche={fiche}
        etiquette={fiche.etiquette ?? c.court}
        format="une"
        prioritaire="haute"
        rang={0}
      />
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
  const c = categorie(fiche.category)!;
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: fiche.slug }}
      className={`${lienCarte} grid items-center gap-6 md:grid-cols-12 md:gap-8`}
    >
      <div className="md:col-span-7">
        <Couverture fiche={fiche} etiquette={c.court} format="pilier" prioritaire="haute" />
      </div>
      <div className="md:col-span-5">
        <span className="eyebrow" style={{ color: c.ink }}>
          Pour commencer
        </span>
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
export function CartePetite({ fiche, rang }: { fiche: Fiche; rang?: number }) {
  const c = categorie(fiche.category)!;
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: fiche.slug }}
      className={lienCarte}
      style={{ ["--ink" as string]: c.ink }}
    >
      <Couverture
        fiche={fiche}
        etiquette={fiche.etiquette ?? c.court}
        format="petite"
        prioritaire="oui"
        rang={rang}
      />
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
  const nom = fiche.plateforme?.nom ?? titreCourt(fiche.title);
  return (
    <Link
      to="/ressources/$slug"
      params={{ slug: fiche.slug }}
      className="flex items-center gap-3 rounded-[12px] border border-[var(--border)] bg-white p-3.5 transition hover:border-[var(--border2)] hover:shadow-[var(--shadow-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--terra)]"
    >
      <MarquePlateforme nom={nom} logo={logoPlateforme(fiche.plateforme?.logo, "carre")} />
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold leading-tight">{nom}</span>
        {fiche.plateforme?.checkedOn && (
          <span className="mt-1 hidden font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] min-[360px]:block">
            Relevé le {dateFr(fiche.plateforme.checkedOn).replace(/ \d{4}$/, "")}
          </span>
        )}
      </span>
    </Link>
  );
}
