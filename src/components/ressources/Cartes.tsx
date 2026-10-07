import { Link } from "@tanstack/react-router";
import {
  categorie,
  couperTitre,
  dateFr,
  tempsLecture,
  titreCourt,
} from "@/lib/ressources/contenu";
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

function Couverture({
  fiche,
  etiquette,
  rayon,
  petite = false,
}: {
  fiche: Fiche;
  etiquette: string;
  rayon: string;
  petite?: boolean;
}) {
  const c = categorie(fiche.category)!;
  const p = fiche.plateforme;
  return (
    <div className={`relative aspect-[4/3] overflow-hidden ${rayon}`} style={{ background: c.tint }}>
      <img
        src={`/covers/${fiche.slug}.svg`}
        width={800}
        height={600}
        loading="lazy"
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
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
        className={`absolute left-3 top-3 rounded-[6px] bg-white/90 px-2 py-1 font-mono font-medium uppercase tracking-[0.12em] ${petite ? "text-[9.5px]" : "text-[10.5px]"}`}
        style={{ color: c.ink }}
      >
        {etiquette}
      </span>
    </div>
  );
}

function Meta({ fiche, sansAuteur = false }: { fiche: Fiche; sansAuteur?: boolean }) {
  const parts = fiche.ancien
    ? [tempsLecture(fiche.readTime)]
    : [sansAuteur ? "" : (fiche.author ?? ""), dateFr(fiche.date), tempsLecture(fiche.readTime)];
  return <>{parts.filter(Boolean).join(" · ")}</>;
}

const lienCarte =
  "group block rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--terra)]";

/** Carte article (Seed) : couverture, étiquette, titre, auteur · date · durée. Un seul lien. */
export function CarteArticle({ fiche, etiquette }: { fiche: Fiche; etiquette?: string }) {
  const c = categorie(fiche.category)!;
  return (
    <Link to="/ressources/$slug" params={{ slug: fiche.slug }} className={lienCarte}>
      <Couverture fiche={fiche} etiquette={etiquette ?? c.court} rayon="rounded-[14px]" />
      <h3 className="mt-4 line-clamp-3 font-serif text-[19px] font-normal leading-[1.25] tracking-[-0.01em] [text-wrap:balance] md:text-[20px]">
        <span className="transition-colors group-hover:text-[var(--ink)]" style={{ ["--ink" as string]: c.ink }}>
          {fiche.title}
        </span>
      </h3>
      <p className="mt-2 text-[13.5px] text-[var(--text-muted)]">
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
      <Couverture fiche={fiche} etiquette={c.court} rayon="rounded-[16px]" />
      <H className="mt-5 max-w-[22ch] font-serif text-[clamp(26px,2.6vw,36px)] font-normal leading-[1.15] tracking-[-0.015em]">
        <TitreItalique titre={fiche.title} ink={c.ink} />
      </H>
      {fiche.metaDescription && (
        <p className="mt-3 line-clamp-2 max-w-[56ch] text-[16px] leading-[1.6] text-[var(--text-soft)]">
          {fiche.metaDescription}
        </p>
      )}
      <p className="mt-3 text-[13.5px] text-[var(--text-muted)]">
        <Meta fiche={fiche} />
      </p>
    </Link>
  );
}

/** Petite carte de la grille 2×2 « À la une ». */
export function CartePetite({ fiche }: { fiche: Fiche }) {
  const c = categorie(fiche.category)!;
  return (
    <Link to="/ressources/$slug" params={{ slug: fiche.slug }} className={lienCarte}>
      <Couverture fiche={fiche} etiquette={c.court} rayon="rounded-[12px]" petite />
      <h3 className="mt-3 line-clamp-3 font-serif text-[15px] font-normal leading-[1.3] md:text-[17px]">
        {titreCourt(fiche.title)}
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
            Informations relevées le {dateFr(fiche.plateforme.checkedOn)}
          </span>
        )}
      </span>
    </Link>
  );
}
