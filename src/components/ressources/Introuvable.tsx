import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useLanguage } from "@/lib/i18n";

const copy = {
  fr: { titre: "Article introuvable", retour: "Retour aux ressources" },
  en: { titre: "Article not found", retour: "Back to resources" },
};

/** Page 404 des Ressources (article ou catégorie inconnus). */
export function NotFoundRessource() {
  const t = copy[useLanguage().lang];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[800px] px-6 py-32 text-center">
        <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4vw,56px)" }}>
          {t.titre}
        </h1>
        <Link to="/ressources" className="btn-primary mt-8 inline-flex">
          {t.retour}
        </Link>
      </section>
    </SiteLayout>
  );
}
