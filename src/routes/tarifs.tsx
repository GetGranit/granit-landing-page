import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePostHog } from "posthog-js/react";
import { SiteLayout } from "@/components/SiteLayout";
import { JsonLd } from "@/components/JsonLd";
import { FormRappel, type EtatRappel } from "@/components/home/nouvelle/CarteContact";
import { useCtaVivant } from "@/components/home/nouvelle/CtaFin";
import { GaletsSymbol, calcomDemoUrl, useReveal } from "@/components/home/nouvelle/socle";
import { Faq } from "@/components/ressources/article/Fin";
import { useLanguage } from "@/lib/i18n";
import { SITE_URL, faqPageLd, organizationRef } from "@/lib/seo";
import "@/components/home/nouvelle/socle.css";
import "@/components/home/nouvelle/cta-fin.css";
import "@/components/tarifs/tarifs.css";

/**
 * /tarifs : Granit se facture à l'usage, la page ne donne pas de prix. Une seule action,
 * « Prendre rendez-vous » (Cal.com), avec le même libellé partout. Le rappel est un lien sous
 * le bouton. Les listes animées ont des clés par position : [data-reveal] pose .is-in hors de
 * React, une clé tirée du texte recréerait l'élément au changement de langue et le cacherait.
 */
export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs Granit : à l'usage, calculés sur vos volumes" },
      { name: "description", content: content.fr.lead },
      { property: "og:title", content: "Tarifs Granit : à l'usage, calculés sur vos volumes" },
      { property: "og:description", content: content.fr.lead },
    ],
  }),
  component: TarifsPage,
});

const content = {
  fr: {
    eyebrow: "Tarifs",
    titre: ["Un tarif à l’usage,", "calculé sur vos volumes."],
    lead: "Chaque structure est différente, alors on ne vous donne pas une moyenne. En 30 minutes, on regarde vos volumes et vous repartez avec votre tarif.",
    rdv: "Prendre rendez-vous",
    precision: "30 min, en visio ou par téléphone",
    rappel: "Je préfère être rappelé",
    comprisTitre: "Compris dans votre tarif",
    compris: [
      "Des agents configurés pour votre métier",
      "Un branchement sur vos portails en 48\u00a0h",
      "Un gestionnaire Granit pour les cas particuliers",
      "Un support dédié",
      "Une infrastructure certifiée HDS, données dans l’Union européenne",
      "La réversibilité de vos données",
    ],
    souple: "Sans durée minimale, résiliable à tout moment.",
    calculEyebrow: "Comment se calcule votre tarif",
    calculTitre: ["Trois choses,", "rien de plus."],
    calcul: [
      { titre: "Votre métier", texte: "Optique, audio, pharmacie ou centre de santé." },
      { titre: "Les agents activés", texte: "Droits, prise en charge, facturation, relances." },
      { titre: "Les dossiers traités", texte: "Vous payez selon votre volume, à l’usage." },
    ],
    faqTitre: "Questions fréquentes",
    finTitre: ["Votre tarif,", "en 30 minutes."],
    finTexte: "À partir de vos volumes, en visio ou par téléphone.",
    faq: [
      {
        question: "Pourquoi le prix n’est-il pas affiché ?",
        answer:
          "Parce que Granit se facture à l’usage : le tarif dépend de votre métier, des agents activés et du volume de dossiers traités. Une moyenne ne vous dirait rien sur votre cas.",
      },
      {
        question: "Que se passe-t-il pendant le rendez-vous ?",
        answer:
          "On regarde ensemble vos volumes et vos logiciels, en visio ou par téléphone. Vous repartez avec ce que Granit prendrait en charge chez vous et votre tarif.",
      },
      {
        question: "Y a-t-il un engagement de durée ?",
        answer:
          "Non. Nos conditions générales de vente ne prévoient pas de durée minimale : vous pouvez résilier à tout moment, par email, sans pénalité ni frais.",
      },
      {
        question: "Faut-il changer de logiciel ?",
        answer:
          "Non. Les agents travaillent dans les logiciels que vos équipes utilisent déjà. Granit est branché sur vos portails en 48\u00a0h.",
      },
    ],
  },
  en: {
    eyebrow: "Pricing",
    titre: ["Usage-based pricing,", "worked out on your volumes."],
    lead: "Every organization is different, so we won’t give you an average. In 30 minutes, we look at your volumes and you leave with your price.",
    rdv: "Book a meeting",
    precision: "30 min, by video or phone",
    rappel: "I’d rather get a call back",
    comprisTitre: "Included in your price",
    compris: [
      "Agents set up for your specialty",
      "Connected to your portals in 48\u00a0hours",
      "A Granit case manager for special cases",
      "Dedicated support",
      "HDS-certified infrastructure, with data in the European Union",
      "Your data stays portable",
    ],
    souple: "No minimum term, cancel at any time.",
    calculEyebrow: "How your price is worked out",
    calculTitre: ["Three things,", "nothing more."],
    calcul: [
      { titre: "Your specialty", texte: "Optical, hearing care, pharmacy or health center." },
      { titre: "The agents enabled", texte: "Eligibility, coverage, billing, follow-ups." },
      { titre: "The files processed", texte: "You pay on your volume, based on usage." },
    ],
    faqTitre: "Frequently asked questions",
    finTitre: ["Your price,", "in 30 minutes."],
    finTexte: "Based on your volumes, by video or phone.",
    faq: [
      {
        question: "Why isn’t the price shown?",
        answer:
          "Because Granit is usage-based: the price depends on your specialty, the agents enabled and the volume of files processed. An average would tell you nothing about your case.",
      },
      {
        question: "What happens during the meeting?",
        answer:
          "We look at your volumes and your software together, by video or phone. You leave with what Granit would take over for you and your price.",
      },
      {
        question: "Is there a minimum term?",
        answer:
          "No. Our terms of sale set no minimum term: you can cancel at any time, by email, with no penalty or fees.",
      },
      {
        question: "Do we need to change software?",
        answer:
          "No. Agents work in the software your teams already use. Granit is connected to your portals in 48\u00a0hours.",
      },
    ],
  },
};

const tarifsLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Granit",
    url: `${SITE_URL}/tarifs`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: content.fr.lead,
    publisher: organizationRef,
  },
  faqPageLd(content.fr.faq),
];

const i = (n: number) => ({ "--i": n }) as CSSProperties;

const FLECHE = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M5 11l6-6M6 4.6h5.4V10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function TarifsPage() {
  const { lang } = useLanguage();
  const t = content[lang];
  const posthog = usePostHog();
  const racine = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const actionHaut = useRef<HTMLDivElement>(null);
  const actionFin = useRef<HTMLDivElement>(null);
  const boiteRappel = useRef<HTMLDivElement>(null);
  const [barre, setBarre] = useState(false);
  const [rappel, setRappel] = useState(false);
  const [etat, setEtat] = useState<EtatRappel>("idle");

  useCtaVivant(hero);
  useReveal(racine);

  useEffect(() => {
    racine.current?.classList.add("nh-js");
    const cibles = [actionHaut.current, actionFin.current].filter(Boolean) as Element[];
    if (!("IntersectionObserver" in window)) return;
    const vues = new Set<Element>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? vues.add(e.target) : vues.delete(e.target)));
      setBarre(vues.size === 0);
    });
    cibles.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!rappel) return;
    boiteRappel.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
  }, [rappel]);

  const ouvrirRappel = (placement: string) => {
    posthog?.capture("demo_contact_choice", { choice: "rappel", placement });
    setRappel(true);
  };

  const lienRdv = (placement: string, classe: string) => (
    <a
      className={`lm-btn ${classe}`}
      href={calcomDemoUrl(placement)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => posthog?.capture("demo_booking_clicked", { placement })}
    >
      {t.rdv}
      {FLECHE}
    </a>
  );

  return (
    <SiteLayout>
      <JsonLd data={tarifsLd} />
      <div ref={racine} className="nh">
        <section ref={hero} className="ct3 ta-hero" aria-labelledby="ta-t">
          <div className="ct3-grad" aria-hidden="true" />
          <div className="ct3-veil" aria-hidden="true" />
          <div className="ct3-light" aria-hidden="true" />
          <GaletsSymbol className="ct3-motif" />
          <div className="lm-wrap ct3-body ct3-deux">
            <div className="ct3-txt">
              <p className="ta-eb ct3-fade" style={i(0)}>
                {t.eyebrow}
              </p>
              <h1 className="ct-h2" id="ta-t">
                <span>
                  <span className="ct-ln" style={i(0)}>
                    {t.titre[0]}
                  </span>
                </span>{" "}
                <span className="ct-acc">
                  <span className="ct-ln" style={i(1)}>
                    {t.titre[1]}
                  </span>
                </span>
              </h1>
              <p className="ct-lead ct3-fade" style={i(2)}>
                {t.lead}
              </p>
              <div ref={actionHaut} className="ta-action ct3-fade" style={i(3)}>
                {lienRdv("page_tarifs_haut", "ct-btn ta-rdv")}
                <p className="ta-precision">{t.precision}</p>
                {rappel ? (
                  <div ref={boiteRappel} className="ta-rappel">
                    <FormRappel
                      etat={etat}
                      setEtat={setEtat}
                      formLocation="tarifs_rappel"
                      demande="Demande de rappel (page Tarifs)"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="ta-lien"
                    onClick={() => ouvrirRappel("page_tarifs_haut")}
                  >
                    {t.rappel}
                  </button>
                )}
              </div>
            </div>
            <div className="ta-compris ct3-fade" style={i(4)}>
              <h2>{t.comprisTitre}</h2>
              <ul>
                {t.compris.map((c, k) => (
                  <li key={k}>
                    <svg viewBox="0 0 18 18" aria-hidden="true">
                      <path
                        d="M3.8 9.6l3.4 3.4 7-7.4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="ta-souple">{t.souple}</p>
            </div>
          </div>
        </section>

        <section className="ta-calcul">
          <div className="lm-wrap">
            <p className="ta-eb" data-reveal>
              {t.calculEyebrow}
            </p>
            <h2 className="ta-h2" data-reveal style={i(1)}>
              {t.calculTitre[0]} <span>{t.calculTitre[1]}</span>
            </h2>
            <ul className="ta-trois">
              {t.calcul.map((c, k) => (
                <li key={k} data-reveal style={i(k + 2)}>
                  <b>{c.titre}</b>
                  <p>{c.texte}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ta-faq">
          <div className="lm-wrap">
            <div className="ta-faq-int">
              <Faq items={t.faq} titre={t.faqTitre} />
            </div>
          </div>
        </section>

        <section className="ta-bande">
          <div className="lm-wrap">
            <div className="ta-bande-int" data-reveal>
              <div>
                <h2>
                  {t.finTitre[0]} <span>{t.finTitre[1]}</span>
                </h2>
                <p>{t.finTexte}</p>
              </div>
              <div ref={actionFin} className="ta-bande-cta">
                {lienRdv("page_tarifs_fin", "ta-rdv-clair")}
                {!rappel && (
                  <button
                    type="button"
                    className="ta-lien"
                    onClick={() => ouvrirRappel("page_tarifs_fin")}
                  >
                    {t.rappel}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className={"ta-barre" + (barre ? " is-on" : "")}>
          {lienRdv("page_tarifs_barre", "ct-btn")}
        </div>
      </div>
    </SiteLayout>
  );
}
