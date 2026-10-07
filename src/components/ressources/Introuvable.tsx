import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

/** Page 404 des Ressources (article ou catégorie inconnus). */
export function NotFoundRessource() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[800px] px-6 py-32 text-center">
        <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4vw,56px)" }}>
          Article introuvable
        </h1>
        <Link to="/ressources" className="btn-primary mt-8 inline-flex">
          Retour aux ressources
        </Link>
      </section>
    </SiteLayout>
  );
}
