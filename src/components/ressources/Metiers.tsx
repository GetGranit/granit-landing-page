// Les métiers : première porte du hub (grille façon Function) et photo des pages métier.
import { Link } from "@tanstack/react-router";
import { categorie, verticalesActives } from "@/lib/ressources/contenu";
import { photoVerticale, type Verticale } from "@/lib/ressources/verticales";

/** Photo d'un métier : srcset 800/1600, recadrée par object-cover, zoom léger au survol. */
export function PhotoMetier({
  v,
  forme,
  tailles,
  prioritaire = false,
}: {
  v: Verticale;
  forme: string;
  tailles: string;
  prioritaire?: boolean;
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
        loading={prioritaire ? "eager" : "lazy"}
        fetchPriority={prioritaire ? "high" : undefined}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

function CarteMetier({ v, n, grande }: { v: Verticale; n: number; grande: boolean }) {
  const ink = categorie(v.teinte)!.ink;
  return (
    <Link
      to="/ressources/metier/$verticale"
      params={{ verticale: v.slug }}
      className="group block rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--terra)]"
    >
      <PhotoMetier
        v={v}
        forme={
          grande ? "aspect-[4/3] rounded-[16px] lg:aspect-[16/10]" : "aspect-[4/3] rounded-[12px]"
        }
        tailles={grande ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 1024px) 260px, 50vw"}
        prioritaire={grande}
      />
      <h3
        className={`font-serif font-normal leading-[1.2] ${grande ? "mt-5 text-[clamp(26px,2.6vw,34px)]" : "mt-3 text-[17px] md:text-[19px]"}`}
      >
        <span className="decoration-1 underline-offset-[5px] group-hover:underline">{v.nom}</span>
      </h3>
      <p
        className={`text-[var(--text-soft)] ${grande ? "mt-2 max-w-[56ch] text-[16px] leading-[1.6]" : "mt-1 hidden text-[14px] leading-snug md:line-clamp-2"}`}
      >
        {v.description}
      </p>
      <p className="mt-2 text-[13.5px] font-semibold" style={{ color: ink }}>
        {n} article{n > 1 ? "s" : ""}{" "}
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

/** « Votre métier » : l'optique en grande carte, les autres en 2×2. */
export function VotreMetier() {
  const actives = verticalesActives();
  if (!actives.length) return null;
  const [premier, ...autres] = actives;
  return (
    <section className="mx-auto max-w-[1280px] px-4 pt-10 md:px-6" aria-labelledby="votre-metier">
      <h2
        id="votre-metier"
        className="mb-6 border-t border-[var(--border)] pt-5 font-serif text-[24px] font-normal leading-tight md:text-[30px]"
      >
        Votre métier
      </h2>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <CarteMetier v={premier.v} n={premier.n} grande />
        </div>
        <div className="grid grid-cols-2 content-start gap-x-3 gap-y-6 md:gap-x-5 md:gap-y-8 lg:col-span-5">
          {autres.map((x) => (
            <CarteMetier key={x.v.slug} v={x.v} n={x.n} grande={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
