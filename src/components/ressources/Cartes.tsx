import { Link } from "@tanstack/react-router";
import { categorie, couperTitre, dateFr, tempsLecture, titreCourt } from "@/lib/ressources/contenu";
import { traceCouverture } from "@/lib/cover";
import { useVu } from "@/lib/motion";
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

/** Pouls : calque posé sur la couverture, un battement court le long du trait déjà dessiné. */
function Pouls({ slug, grand }: { slug: string; grand: boolean }) {
  const t = traceCouverture({ slug, variant: grand ? "une" : "card", trait: grand ? 0.4 : 1 });
  return (
    <svg
      viewBox={`0 0 ${t.W} ${t.H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path className="pouls-trait" pathLength={1} strokeWidth={t.largeur * 1.5} d={t.d} />
      <circle className="pouls-point" cx={t.cx} cy={t.cy} r={t.r} strokeWidth={t.r * 0.4} />
    </svg>
  );
}

/**
 * Couverture tramée d'une carte. Les grandes cartes prennent la variante {slug}--une (800×500).
 * En attendant l'image, une trame claire au pas du dither, pas un aplat qui a l'air cassé.
 */
function Couverture({
  fiche,
  etiquette,
  format = "carte",
  prioritaire,
}: {
  fiche: Fiche;
  etiquette: string;
  format?: Format;
  /** "haute" : image principale de la page ; "oui" : visible au chargement. */
  prioritaire?: "haute" | "oui";
}) {
  const c = categorie(fiche.category)!;
  const p = fiche.plateforme;
  const grand = format === "une" || format === "pilier";
  const ref = useVu<HTMLDivElement>();
  const forme = {
    carte: "aspect-[4/3] rounded-[14px]",
    petite: "aspect-[4/3] rounded-[12px]",
    une: "aspect-[4/3] rounded-[16px] lg:aspect-[16/10]",
    pilier: "aspect-[16/10] rounded-[16px]",
  }[format];
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${forme}`}
      style={{
        backgroundColor: c.tint,
        backgroundImage: `radial-gradient(circle, color-mix(in oklab, ${c.ink} 22%, transparent) 1.3px, transparent 1.5px)`,
        backgroundSize: "14px 14px",
      }}
    >
      <div className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <img
          src={`/covers/${fiche.slug}${grand ? "--une" : ""}.svg`}
          width={800}
          height={grand ? 500 : 600}
          loading={prioritaire ? "eager" : "lazy"}
          fetchPriority={prioritaire === "haute" ? "high" : undefined}
          decoding="async"
          alt=""
          className="h-full w-full object-cover"
        />
        {!p && <Pouls slug={fiche.slug} grand={grand} />}
      </div>
      {p && (
        <span className="absolute left-1/2 top-1/2 grid w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center">
          {p.logo ? (
            <img src={p.logo} alt="" className="w-full object-contain" />
          ) : (
            <span className="font-serif text-[clamp(40px,6vw,64px)] leading-none text-[#b94a2f]">
              {p.nom.slice(0, 1).toUpperCase()}
            </span>
          )}
        </span>
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
}: {
  fiche: Fiche;
  etiquette?: string;
  prioritaire?: "oui";
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
export function CartePetite({ fiche }: { fiche: Fiche }) {
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
      <MarquePlateforme nom={nom} logo={fiche.plateforme?.logo} />
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
