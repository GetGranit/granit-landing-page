// Les métiers : première porte du hub (grille façon Function) et photo des pages métier.
import { Link } from "@tanstack/react-router";
import { categorie, verticalesActives } from "@/lib/ressources/contenu";
import { photoVerticale, type Verticale } from "@/lib/ressources/verticales";

/** Photo d'un métier : srcset 800/1600, recadrée par object-cover, zoom léger au survol. */
export function PhotoMetier({
  v,
  forme,
  tailles,
  chargement = "lazy",
}: {
  v: Verticale;
  forme: string;
  tailles: string;
  /** "haute" : image principale de la page ; "eager" : visible au chargement. */
  chargement?: "haute" | "eager" | "lazy";
}) {
  return (
    <div className={`relative overflow-hidden bg-[var(--bg3)] ${forme}`}>
      <img
        src={photoVerticale(v.slug, 800)}
        srcSet={`${photoVerticale(v.slug, 800)} 800w, ${photoVerticale(v.slug, 1600)} 1600w`}
        sizes={tailles}
        width={1600}
        height={900}
        alt={v.alt}
        loading={chargement === "lazy" ? "lazy" : "eager"}
        fetchPriority={chargement === "haute" ? "high" : undefined}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

function CarteMetier({ v, n }: { v: Verticale; n: number }) {
  const ink = categorie(v.teinte)!.ink;
  return (
    <Link
      to="/ressources/metier/$verticale"
      params={{ verticale: v.slug }}
      className="group block rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--terra)]"
    >
      <PhotoMetier
        v={v}
        forme="aspect-[3/4] rounded-[14px] lg:aspect-[4/3]"
        tailles="(min-width: 1024px) 300px, (min-width: 768px) 30vw, 62vw"
        chargement="eager"
      />
      <h3 className="mt-3 font-serif text-[19px] font-normal leading-[1.2] md:text-[21px]">
        <span className="decoration-1 underline-offset-[5px] group-hover:underline">{v.nom}</span>
      </h3>
      <p className="mt-1.5 text-[13.5px] font-semibold" style={{ color: ink }}>
        {n > 0 ? `${n} article${n > 1 ? "s" : ""}` : "Les bases communes"}{" "}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </p>
    </Link>
  );
}

/** « Votre métier » : une rangée de cartes égales ; sur mobile, elle défile avec un fondu à droite. */
export function VotreMetier() {
  const actives = verticalesActives();
  if (!actives.length) return null;
  return (
    <section className="mx-auto max-w-[1280px] px-4 pt-10 md:px-6" aria-labelledby="votre-metier">
      <h2
        id="votre-metier"
        className="mb-6 border-t border-[var(--border)] pt-5 font-serif text-[24px] font-normal leading-tight md:text-[30px]"
      >
        Votre métier
      </h2>
      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] max-lg:[mask-image:linear-gradient(to_right,black_82%,transparent)] lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8 lg:overflow-visible lg:px-0">
        {actives.map((x) => (
          <li
            key={x.v.slug}
            className="w-[62vw] max-w-[260px] shrink-0 snap-start lg:w-auto lg:max-w-none"
          >
            <CarteMetier v={x.v} n={x.n} />
          </li>
        ))}
      </ul>
    </section>
  );
}
