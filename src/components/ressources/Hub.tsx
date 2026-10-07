import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import {
  GLOSSAIRE_SLUG,
  aLaUne,
  autresMetiers,
  categoriesActives,
  fichesPlateformes,
  glossaireEnLigne,
  toutCategorie,
  type Categorie,
} from "@/lib/ressources/contenu";
import { BandeDemo } from "./BandeDemo";
import { CarteArticle, CartePetite, CarteUne, TuilePlateforme } from "./Cartes";
import { Onglets } from "./Onglets";

const conteneur = "mx-auto max-w-[1280px] px-4 md:px-6";
const lienFleche =
  "group/l inline-flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold hover:underline hover:underline-offset-4";

/** Le hub /ressources en français : une entrée par thème, pas un fil daté. */
export function Hub() {
  const une = aLaUne();
  const cats = categoriesActives();
  const plateformes = fichesPlateformes();
  const glossaire = glossaireEnLigne();

  return (
    <SiteLayout>
      <div className="bg-[var(--bg2)]">
        <section className={`${conteneur} pb-8 pt-12 text-center md:pb-10 md:pt-20`}>
          <div className="eyebrow">Ressources · Le guide du tiers payant</div>
          <h1 className="mx-auto mt-4 max-w-[16ch] font-serif text-[clamp(40px,5.6vw,72px)] font-normal leading-[1.04] tracking-[-0.02em] [text-wrap:balance]">
            Le tiers payant optique, <em className="accent-italic">sans les rejets</em>.
          </h1>
          <p className="body-lg mx-auto mt-5 max-w-[60ch]">
            Portails, prises en charge, rejets, paiements : des réponses pratiques pour le comptoir,
            écrites par l'équipe qui automatise le tiers payant de magasins d'optique.
          </p>
          <div className="mt-10 text-left">
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

        {cats.map((c) => (
          <Rangee key={c.slug} cat={c} />
        ))}

        {plateformes.length > 0 && (
          <section className={`${conteneur} pt-14`}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border)] pt-5">
              <div>
                <div className="eyebrow">Trouver sa plateforme</div>
                <h2 className="mt-2 font-serif text-[24px] font-normal leading-tight md:text-[30px]">
                  Chaque portail a sa fiche
                </h2>
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

        {glossaire && (
          <section className="mt-14 border-y border-[var(--border)] bg-white py-14">
            <div className={conteneur}>
              <Link
                to="/ressources/$slug"
                params={{ slug: GLOSSAIRE_SLUG }}
                className="group flex flex-wrap items-end justify-between gap-4 rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--terra)]"
              >
                <span>
                  <span className="eyebrow block" style={{ color: "#5e574b" }}>
                    Glossaire
                  </span>
                  <span className="mt-2 block font-serif text-[30px] leading-tight text-[#5e574b]">
                    AMC, DRE, NOEMIE… en une phrase
                  </span>
                </span>
                <span className={lienFleche} style={{ color: "#5e574b" }}>
                  Tout le glossaire <Fleche />
                </span>
              </Link>
            </div>
          </section>
        )}

        <section className={`${conteneur} pt-16`}>
          <div className="border-t border-[var(--border)] pt-5">
            <h2 className="font-serif text-[24px] font-normal leading-tight md:text-[30px]">
              Autres métiers de santé
            </h2>
            <p className="mt-2 max-w-[60ch] text-[15px] text-[var(--text-soft)]">
              Nos articles sur l'audioprothèse, l'officine, le dentaire, les laboratoires et les
              établissements de soins.
            </p>
          </div>
          <ul className="mt-6 grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
            {autresMetiers.map((a) => (
              <li key={a.slug} className="border-t border-[var(--border)]">
                <Link
                  to="/ressources/$slug"
                  params={{ slug: a.slug }}
                  className="group block py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]"
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    {a.category}
                  </span>
                  <span className="mt-1 block text-[15.5px] font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
                    {a.title}
                  </span>
                  <span className="mt-1 block text-[13px] text-[var(--text-muted)]">{a.time}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

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
      className="inline-block transition-transform group-hover/l:translate-x-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
    >
      →
    </span>
  );
}

/** Une rangée par catégorie (Seed) : titre coloré, description, 3 cartes, lien vers le thème. */
function Rangee({ cat }: { cat: Categorie }) {
  const tout = toutCategorie(cat.slug);
  return (
    <section className={`${conteneur} pt-10 md:pt-14`}>
      <div className="mb-6 flex items-end justify-between gap-4 border-t border-[var(--border)] pt-5">
        <div>
          <h2
            className="font-serif text-[24px] font-normal leading-tight md:text-[30px]"
            style={{ color: cat.ink }}
          >
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
          Tout le thème ({tout.length}) <Fleche />
        </Link>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
        {tout.slice(0, 3).map((f) => (
          <div
            key={f.slug}
            className="w-[78vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none"
          >
            <CarteArticle fiche={f} />
          </div>
        ))}
      </div>
    </section>
  );
}
