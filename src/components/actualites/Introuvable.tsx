import { Link } from "@tanstack/react-router";
import { NotFoundRessource } from "@/components/ressources/Introuvable";
import { SiteLayout } from "@/components/SiteLayout";
import { useLanguage } from "@/lib/i18n";
import { rubriqueOuverte } from "@/lib/actualites/ouverture";
import { LIBELLES } from "@/lib/actualites/textes";

/** Rubrique ouverte : retour aux éditions. Fermée : la 404 ordinaire, qui ne révèle rien. */
export function Introuvable() {
  const { lang } = useLanguage();
  if (!rubriqueOuverte) return <NotFoundRessource />;
  const t = LIBELLES[lang];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[800px] px-6 py-32 text-center">
        <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4vw,56px)" }}>
          {t.introuvable}
        </h1>
        <Link to="/actualites" className="btn-primary mt-8 inline-flex">
          {t.retour}
        </Link>
      </section>
    </SiteLayout>
  );
}
