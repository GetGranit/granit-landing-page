import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import {
  anciensDeCategorie,
  fichesCategorie,
  fichesPlateformes,
  titreCourt,
  type Categorie,
} from "@/lib/ressources/contenu";
import type { Fiche } from "@/lib/ressources/types";
import { Annuaire } from "./Annuaire";
import { BandeDemo } from "./BandeDemo";
import { CarteArticle, CartePilier } from "./Cartes";
import { Fil } from "./Fil";
import { SousNav } from "./Onglets";

const conteneur = "mx-auto max-w-[1280px] px-4 md:px-6";

function Grille({ fiches }: { fiches: Fiche[] }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {fiches.map((f, i) => (
        <CarteArticle key={f.slug} fiche={f} rang={i} />
      ))}
    </div>
  );
}

function Titre({ children }: { children: string }) {
  return (
    <h2 className="mb-6 border-t border-[var(--border)] pt-5 font-serif text-[24px] font-normal leading-tight md:text-[30px]">
      {children}
    </h2>
  );
}

/** Page /ressources/categorie/{category} ; pour « plateformes », c'est l'annuaire. */
export function PageCategorie({ cat }: { cat: Categorie }) {
  const cocon = fichesCategorie(cat.slug);
  const anciens = anciensDeCategorie(cat.slug);
  const pilier = cocon.find((f) => f.pillar);
  // L'annuaire n'a de sens qu'à partir de 3 fiches ; avant, elles rejoignent la grille.
  const annuaire = cat.slug === "plateformes" && fichesPlateformes().length >= 3;
  const autres = cocon.filter((f) => f !== pilier && !(annuaire && f.slug.startsWith("portail-")));

  return (
    <SiteLayout fond="var(--bg2)">
      <div className="ress">
        <SousNav actif={cat.slug} />
        <section className="border-b border-[var(--border)]" style={{ background: cat.tint }}>
          <div className={`${conteneur} pb-8 pt-8 md:pb-10 md:pt-10`}>
            <Fil items={[{ nom: "Ressources", to: "/ressources" }, { nom: cat.nom }]} />
            <h1 className="mt-4 max-w-[22ch] font-serif text-[clamp(32px,4.4vw,54px)] font-normal leading-[1.08] tracking-[-0.015em]">
              {cat.nom}
            </h1>
            <p className="mt-4 max-w-[62ch] text-[18px] text-[var(--text-soft)]">
              {cat.description}{" "}
              {pilier && (
                <>
                  Commencez par{" "}
                  <Link
                    to="/ressources/$slug"
                    params={{ slug: pilier.slug }}
                    className="font-semibold underline underline-offset-4"
                    style={{ color: cat.ink }}
                  >
                    {titreCourt(pilier.title)}
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </section>

        <div className="bg-[var(--bg2)] pb-1">
          {annuaire && (
            <section className={`${conteneur} pt-10`}>
              <Annuaire />
            </section>
          )}

          {pilier && (
            <section className={`${conteneur} pt-12`}>
              <CartePilier fiche={pilier} />
            </section>
          )}

          {autres.length > 0 && (
            <section className={`${conteneur} pt-14`}>
              {(pilier || annuaire) && (
                <Titre>{annuaire ? "Les guides" : "Tous les articles"}</Titre>
              )}
              <Grille fiches={autres} />
            </section>
          )}

          {anciens.length > 0 && (
            <section className={`${conteneur} pt-14`}>
              <Titre>À lire aussi</Titre>
              <Grille fiches={anciens} />
            </section>
          )}

          <BandeDemo />
        </div>
      </div>
    </SiteLayout>
  );
}
