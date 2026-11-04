import { createFileRoute } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import logoClair from "@/assets/logo-light.svg";
import { GaletsSymbol } from "@/components/home/nouvelle/socle";
import { useLanguage, type Lang } from "@/lib/i18n";
import "@/levee.css";

/* Le communiqué de la levée, mot pour mot : les PDF finaux du 5 novembre (5 M€ en français, 6 M$ en anglais).
   Page à part, sans le menu du site : la mise en page de landing-pages/annonce-levee. */
const TITRE = "Granit lève 5 millions d’euros - Communiqué de presse";
const DESCRIPTION =
  "Granit lève 5 millions d’euros, menés par Seedcamp, pour libérer les professionnels de santé de l’administratif.";

export const Route = createFileRoute("/levee-de-fonds")({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITRE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://www.getgranit.ai/levee-de-fonds" }],
  }),
  component: PageLevee,
});

const DEMO =
  "https://cal.com/paul-pietra-granit/decouvrir-granit/?utm_source=getgranit.ai&utm_medium=site&utm_campaign=levee&utm_content=";
const ADRESSE = "Granit · 46 rue Notre-Dame-des-Victoires, 75002 Paris";

const copy = {
  fr: {
    surtitre: "Levée de fonds · Pre-seed",
    h1: [
      "Granit lève 5\u00a0millions d’euros pour libérer les professionnels de santé ",
      "de l’administratif.",
    ],
    date: "Communiqué de presse · Paris, le 5\u00a0novembre 2026",
    chapo:
      "Granit annonce son premier tour de financement, de 5\u00a0millions d’euros, avec pour mission de libérer les professionnels de santé de la charge administrative qui pèse sur leur quotidien et l’ambition de la porter dans toute l’Europe. Il se compose de 3,5\u00a0millions d’euros en fonds propres, menés par le fonds britannique Seedcamp, ainsi que 1,5\u00a0million d’euros en financement non dilutif, avec notamment la participation de Bpifrance.",
    t1: "Un quotidien saturé par l’administratif",
    p1: "Les professionnels de santé se forment pendant des années pour soigner, mais une part croissante de leur temps part dans l’administratif. Dans une étude menée auprès de plus de 1\u00a0000 soignants dans cinq pays européens, dont la France, 82\u00a0% estiment que ces tâches réduisent le temps consacré aux patients, et 65\u00a0% y passent plus d’une heure par jour (étude Time to Care, Tandem Health).",
    t2: "La promesse de Granit : mettre les logiciels au service des professionnels de santé",
    p2: "Fondée en mars 2026 par Jenny Mansour et Corneille Maréchal, Granit développe des agents IA qui se connectent directement aux logiciels métier existants (dossier patient informatisé, logiciels de spécialité) et aux plateformes externes (mutuelles, Assurance Maladie, comptabilité), et exécutent, à la place des équipes, le travail administratif qu’elles font aujourd’hui à la main : facturation, relances, correction des rejets, vérification des prises en charge.",
    p3: "Déjà déployée auprès de plus de 250\u00a0structures de santé en France, la solution Granit permet de réduire jusqu’à 90\u00a0% le temps consacré aux tâches administratives, avec une mise en place en quelques jours et sans intégration technique lourde.",
    p4: "Le temps libéré revient au soin et au suivi des patients, et les équipes administratives se concentrent sur l’accueil et l’orientation des patients.",
    c1: "« Nous ne voulons pas ajouter un logiciel de plus dans le quotidien déjà saturé des professionnels de santé. Nous voulons que les outils qu’ils utilisent déjà travaillent pour eux, et non l’inverse. »",
    a1: ["Jenny Mansour", ", CEO de Granit"],
    p5: "Cette levée de fonds permettra à Granit d’accélérer le développement de nouvelles verticales de santé, de renforcer ses équipes techniques et commerciales, et d’amorcer son expansion dans plusieurs pays européens.",
    c2: "« Les tâches administratives répétitives et fragmentées prennent beaucoup trop de temps à des soignants déjà surchargés. Les agents de Granit prennent ce travail en charge directement dans les outils que les équipes utilisent déjà, et libèrent du temps pour le soin des patients. Jenny et l’équipe réunissent une expertise rare, à la croisée des politiques de santé et de la technologie, et nous sommes ravis de mener leur premier tour de financement. »",
    a2: ["Felix Martinez", ", Partner chez Seedcamp"],
    apropos: "À propos de Granit",
    apropos1:
      "Fondée en mars 2026 par Jenny Mansour et Corneille Maréchal, Granit développe des agents IA qui automatisent les tâches administratives des professionnels de santé. Déployée auprès de plus de 250\u00a0structures de santé en France, la start-up ambitionne de devenir la référence européenne de l’automatisation administrative en santé.",
    presse: "Contact presse",
    nom: "Ségolène Redon",
    mail: "segolene.redon@bonsensagence.fr",
    tel: "06\u00a042\u00a006\u00a073\u00a070",
    telLien: "+33642067370",
    cta: ["Vos équipes soignent.", "Granit gère le reste."],
    lead: "Nous vous montrons nos agents au travail dans les logiciels que vos équipes utilisent déjà, sur vos portails et vos mutuelles.",
    bouton: "Demander une démo",
    suivi: "communique_bas",
    garanties: ["Hébergeur certifié HDS", "Données dans l’UE", "Conforme RGPD"],
  },
  en: {
    surtitre: "Fundraising · Pre-seed",
    h1: ["Granit raises $6 million to free healthcare professionals ", "from administrative work."],
    date: "Press release · Paris, 5\u00a0November 2026",
    chapo:
      "Granit announces its first funding round, of $6 million, with the mission of freeing healthcare professionals from the administrative burden weighing on their daily work, and the ambition to deliver on this promise across Europe. The round comprises $4 million in equity, led by UK fund Seedcamp, as well as $2 million in non-dilutive financing, including participation from Bpifrance.",
    t1: "Too much admin, not enough care",
    p1: "Healthcare professionals train for years to care for patients, yet a growing share of their time goes into admin. In a survey of more than 1,000 clinicians across five European countries, including France, 82% said these tasks reduce the time they can give patients, and 65% spend more than an hour a day on them (Time to Care study, Tandem Health).",
    t2: "Granit’s promise: putting software at the service of healthcare professionals",
    p2: "Founded in March 2026 by Jenny Mansour and Corneille Maréchal, Granit develops AI agents that connect directly to existing business software (electronic patient records, specialty software) and to external platforms (complementary health insurers, national health insurance, accounting), and take on the administrative work teams do by hand today: invoicing, follow-ups, correcting claim rejections, checking coverage.",
    p3: "Already deployed with more than 250 healthcare organisations in France, Granit’s solution reduces the time spent on administrative tasks by up to 90%, with set-up taking just a few days, without the need for complex technical integration.",
    p4: "The time saved goes back to patient care, and admin teams focus on welcoming and guiding patients.",
    c1: "“We don’t want to add one more piece of software to healthcare professionals’ already saturated daily lives. We want the tools they already use to work for them, not the other way around.”",
    a1: ["Jenny Mansour", ", CEO of Granit"],
    p5: "This funding will allow Granit to accelerate the development of new healthcare verticals, strengthen its technical and commercial teams, and kick-start its expansion into several European countries.",
    c2: "“Fragmented, routine admin work takes up far too much of already overstretched healthcare workers’ time. Granit’s agents take that work on inside the systems staff already use, freeing up more time for patient care. Jenny and the team bring deep, rare expertise across healthcare policy and technology, and we couldn’t be more excited to lead their first round of funding.”",
    a2: ["Felix Martinez", ", Partner at Seedcamp"],
    apropos: "About Granit",
    apropos1:
      "Founded in March 2026 by Jenny Mansour and Corneille Maréchal, Granit develops AI agents that automate administrative tasks for healthcare professionals. Deployed with more than 250 healthcare organisations in France, the startup aims to become the European leader in administrative automation for healthcare.",
    presse: "Press contact",
    nom: "Katherine Bassett",
    mail: "kat.bassett@seedcamp.com",
    tel: "+44\u00a07907\u00a0226\u00a0329",
    telLien: "+447907226329",
    cta: ["Your teams care.", "Granit handles the rest."],
    lead: "We’ll show you our agents at work in the software your teams already use, on your portals and with your insurers.",
    bouton: "Book a demo",
    suivi: "communique_bas_en",
    garanties: ["HDS-certified host", "EU data", "GDPR compliant"],
  },
};

/* mêmes pictos que landing-pages/annonce-levee, dans l'ordre des garanties */
const PICTOS = [
  <path key="hds" d="M8 1.5 2.8 3.6v4.1c0 3.1 2.2 5.8 5.2 6.8 3-1 5.2-3.7 5.2-6.8V3.6Z" />,
  <g key="ue">
    <circle cx="8" cy="8" r="6.2" />
    <path d="M1.8 8h12.4M8 1.8c1.8 1.7 2.6 3.8 2.6 6.2S9.8 12.5 8 14.2C6.2 12.5 5.4 10.4 5.4 8S6.2 3.5 8 1.8Z" />
  </g>,
  <g key="rgpd">
    <rect x="3" y="7" width="10" height="7" rx="1.6" />
    <path d="M5.3 7V5a2.7 2.7 0 0 1 5.4 0v2" />
  </g>,
];

function PageLevee() {
  const { lang, setLang } = useLanguage();
  const posthog = usePostHog();
  const t = copy[lang];
  const choisir = (choix: Lang) => {
    if (choix === lang) return;
    posthog?.capture("language_switched", { language_to: choix });
    setLang(choix);
  };
  return (
    <div className="lv">
      <main>
        <section className="lv-hero" aria-labelledby="lv-h1">
          <div className="wrap barre">
            <a className="logo" href="/" aria-label="Granit">
              <img src={logoClair} alt="" />
            </a>
            <div className="langues" role="group" aria-label="Langue / Language">
              {(["fr", "en"] as const).map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => choisir(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <figure className="photo">
            <img
              src="/levee/fondateurs.jpg"
              alt="Jenny Mansour et Corneille Maréchal"
              width={1024}
              height={1536}
            />
          </figure>
          <div className="wrap corps-hero">
            <div className="texte">
              <p className="sur">{t.surtitre}</p>
              <h1 id="lv-h1">
                {t.h1[0]}
                <span>{t.h1[1]}</span>
              </h1>
            </div>
            <div className="lv-tour">
              <div>
                <p className="sur">Led by</p>
                <img
                  className="seedcamp"
                  src="/levee/seedcamp.png"
                  width={200}
                  height={80}
                  alt="Seedcamp"
                />
              </div>
              <div>
                <p className="sur">Backed by</p>
                <img
                  className="backers"
                  src="/levee/investisseurs.png"
                  width={680}
                  height={125}
                  alt="Drysdale Ventures, Re:rail, Purple, Cleo, Kima"
                />
              </div>
            </div>
          </div>
        </section>

        <article className="lv-article">
          <header>
            <p className="sur">{t.date}</p>
            <p className="chapo">{t.chapo}</p>
          </header>
          <div className="lv-corps">
            <h2>{t.t1}</h2>
            <p>{t.p1}</p>
            <h2>{t.t2}</h2>
            <p>{t.p2}</p>
            <p>{t.p3}</p>
            <p>{t.p4}</p>
            <blockquote className="lv-citation">
              <p>{t.c1}</p>
              <footer>
                <b>{t.a1[0]}</b>
                {t.a1[1]}
              </footer>
            </blockquote>
            <p>{t.p5}</p>
            <blockquote className="lv-citation">
              <p>{t.c2}</p>
              <footer>
                <b>{t.a2[0]}</b>
                {t.a2[1]}
              </footer>
            </blockquote>
          </div>
          <div className="lv-apropos">
            <h2>{t.apropos}</h2>
            <p>{t.apropos1}</p>
            <p>
              <a href="https://www.getgranit.ai/">www.getgranit.ai</a>
            </p>
            <p>
              <b>{t.presse}</b>
              {lang === "fr" ? "\u00a0: " : ": "}
              {t.nom}, <a href={`mailto:${t.mail}`}>{t.mail}</a>,{" "}
              <a href={`tel:${t.telLien}`}>{t.tel}</a>
            </p>
          </div>
        </article>

        <section className="lv-cta" aria-labelledby="lv-cta-h">
          <GaletsSymbol className="filigrane" />
          <div className="wrap">
            <h2 id="lv-cta-h">
              {t.cta[0]}
              <span>{t.cta[1]}</span>
            </h2>
            <p className="lead">{t.lead}</p>
            <a className="lv-bouton" href={DEMO + t.suivi}>
              {t.bouton}
              <svg viewBox="0 0 13 13" aria-hidden="true">
                <path
                  d="M2 11 11 2M4 2h7v7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <ul className="lv-garanties">
              {t.garanties.map((g, i) => (
                <li key={g}>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    {PICTOS[i]}
                  </svg>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="wrap lv-pied">
        <span>{ADRESSE}</span>
        <a href="https://www.getgranit.ai/">getgranit.ai</a>
      </footer>
    </div>
  );
}
