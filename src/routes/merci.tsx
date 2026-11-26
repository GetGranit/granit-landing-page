import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";

import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

/**
 * Page de retour après une réservation sur l'agenda cal.com « Découvrir Granit ».
 *
 * Le bouton « Réserver une démo » ouvre cal.com, un autre site : PostHog voyait le clic,
 * jamais la réservation. cal.com renvoie ici une fois le créneau pris (réglage
 * « Rediriger après réservation » de l'événement), et la page envoie `demo_booked`.
 * Le visiteur revient dans le même navigateur : l'événement s'accroche à la même personne
 * PostHog, donc au canal de sa visite et au bouton qu'il avait cliqué.
 *
 * cal.com ne doit PAS transmettre ses paramètres (« Transmettre les paramètres » coupé) :
 * ils contiennent nom et e-mail, qui finiraient dans l'URL enregistrée par PostHog.
 *
 * Hors navigation, hors sitemap, noindex.
 */
export const Route = createFileRoute("/merci")({
  head: () => ({
    meta: [
      { title: "Rendez-vous confirmé - Granit" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Votre rendez-vous avec Granit est confirmé." },
    ],
  }),
  component: MerciPage,
});

// Un rechargement de la page ne compte pas une deuxième réservation.
const DEJA_COMPTE = "granit_demo_booked";

const copy = {
  fr: {
    eyebrow: "Rendez-vous confirmé",
    title: "C'est noté, à bientôt.",
    lignes: [
      "Vous allez recevoir l'invitation par e-mail, avec le lien de la visio ou le numéro auquel nous vous appelons.",
      "Pour changer de créneau ou annuler, passez par les liens de cet e-mail.",
    ],
    retour: "Revenir au site",
  },
  en: {
    eyebrow: "Meeting confirmed",
    title: "All set, talk soon.",
    lignes: [
      "You will receive the invitation by email, with the video link or the number we will call.",
      "To reschedule or cancel, use the links in that email.",
    ],
    retour: "Back to the website",
  },
};

function MerciPage() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;
    try {
      if (window.sessionStorage.getItem(DEJA_COMPTE)) return;
      window.sessionStorage.setItem(DEJA_COMPTE, "1");
    } catch {
      // Stockage bloqué : on compte quand même, au pire deux fois sur un rechargement.
    }
    posthog.capture("demo_booked", { outil: "calcom", evenement: "decouvrir-granit" });
  }, [posthog]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[720px] px-6 pt-28 pb-28">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4.4vw,60px)" }}>
            {t.title}
          </h1>
          <div className="mt-8 space-y-4">
            {t.lignes.map((p) => (
              <p
                key={p}
                className="text-[17px] leading-[1.7]"
                style={{ color: "var(--text-soft)" }}
              >
                {p}
              </p>
            ))}
          </div>
          <Link to="/" className="btn-primary mt-10 inline-flex">
            {t.retour}
          </Link>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
