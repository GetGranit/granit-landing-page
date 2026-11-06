// Page /ressources/metier/{verticale} : les articles d'un métier, sans changer leurs URL.
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useLanguage } from "@/lib/i18n";
import {
  ORDRE_HUB,
  categorie,
  fichesTransversales,
  fichesVerticale,
} from "@/lib/ressources/contenu";
import type { Fiche } from "@/lib/ressources/types";
import { verticale, type Verticale } from "@/lib/ressources/verticales";
import { BandeDemo } from "./BandeDemo";
import { CarteArticle } from "./Cartes";
import { Fil, useItemRessources } from "./Fil";
import { Fleche } from "./Hub";
import { PhotoMetier } from "./Metiers";
import { SousNav } from "./Onglets";

const conteneur = "mx-auto max-w-[1280px] px-4 md:px-6";
const titreSection =
  "mb-6 border-t border-[var(--border)] pt-5 font-serif text-[24px] font-normal leading-tight md:text-[30px]";

function Grille({ fiches }: { fiches: Fiche[] }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {fiches.map((f, i) => (
        <CarteArticle key={f.slug} fiche={f} />
      ))}
    </div>
  );
}

const copy = {
  fr: {
    titre: "tiers payant et gestion administrative",
    toutTheme: "Tout le thème",
    aussiOptique: "Aussi pour l'optique",
    articles: "Les articles",
    valable: "Valable aussi pour votre métier",
  },
  en: {
    titre: "third-party payment and admin",
    toutTheme: "All articles",
    aussiOptique: "Also for opticians",
    articles: "Articles",
    valable: "Also relevant to your profession",
  },
};

const estPlateforme = (f: Fiche) => f.category === "plateformes" && f.slug.startsWith("portail-");

export function PageMetier({ v: vFr }: { v: Verticale }) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const v = verticale(vFr.slug, lang)!;
  const ressources = useItemRessources();
  const propres = fichesVerticale(v.slug);
  const optique = v.slug === "optique";
  // Hors optique, les fiches plateformes multi-métiers vont avec les transversaux.
  const grille = optique ? [] : propres.filter((f) => !estPlateforme(f));
  const aussi = optique
    ? []
    : [
        ...propres.filter(estPlateforme),
        ...fichesTransversales.filter((f) => !propres.includes(f)),
      ];
  const parTheme = optique
    ? ORDRE_HUB.map((c) => ({
        cat: categorie(c, lang)!,
        fiches: propres.filter((f) => f.category === c && (!f.ancien || f.rattache)),
      })).filter((r) => r.fiches.length > 0)
    : [];
  const horsTheme = optique
    ? propres.filter((f) => !parTheme.some((r) => r.fiches.includes(f)))
    : [];

  return (
    <SiteLayout fond="var(--bg)">
      <div className="ress bg-[var(--bg)] pb-1">
        <SousNav actif={v.slug} />
        <section
          className={`${conteneur} grid items-center gap-8 pb-10 pt-8 md:pt-12 lg:grid-cols-12`}
        >
          <div className="lg:col-span-5">
            <Fil items={[ressources, { nom: v.nom }]} />
            <h1 className="mt-4 font-serif text-[clamp(32px,4.4vw,52px)] font-normal leading-[1.08] tracking-[-0.015em] [text-wrap:balance]">
              {v.nom}
              {lang === "en" ? ": " : " : "}
              <em className="accent-italic">{t.titre}</em>
            </h1>
            <p className="body-lg mt-4 max-w-[52ch]">{v.description}</p>
          </div>
          <div className="lg:col-span-7">
            <PhotoMetier
              v={v}
              forme="aspect-[16/9] rounded-[18px]"
              tailles="(min-width: 1024px) 760px, 100vw"
              chargement="haute"
            />
          </div>
        </section>

        {parTheme.map((r) => (
          <section key={r.cat.slug} className={`${conteneur} monte pt-12`}>
            <div className="mb-6 flex items-end justify-between gap-4 border-t border-[var(--border)] pt-5">
              <h2
                className="font-serif text-[24px] font-normal leading-tight md:text-[30px]"
                style={{ color: r.cat.ink }}
              >
                {r.cat.nom}
              </h2>
              <Link
                to="/ressources/categorie/$category"
                params={{ category: r.cat.slug }}
                className="group/l inline-flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold hover:underline hover:underline-offset-4"
                style={{ color: r.cat.ink }}
              >
                {t.toutTheme} <Fleche />
              </Link>
            </div>
            <Grille fiches={r.fiches.slice(0, 6)} />
          </section>
        ))}

        {[...grille, ...horsTheme].length > 0 && (
          <section className={`${conteneur} pt-12`}>
            <h2 className={titreSection}>{optique ? t.aussiOptique : t.articles}</h2>
            <Grille fiches={[...grille, ...horsTheme]} />
          </section>
        )}

        {aussi.length > 0 && (
          <section className={`${conteneur} pt-14`}>
            <h2 className={titreSection}>{t.valable}</h2>
            <Grille fiches={aussi} />
          </section>
        )}

        <BandeDemo />
      </div>
    </SiteLayout>
  );
}
