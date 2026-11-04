import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useLanguage } from "@/lib/i18n";
import { leveeVisible } from "@/lib/levee";
import "@/levee.css";

/* Le communiqué de la levée (versions finales du 4 novembre, montants en dollars partout, décision de Paul).
   La page n'existe pas avant l'annonce : 404 jusqu'au 5 novembre à 8 h 30, sauf avec ?levee=1 pour relire. */
const TITRE = "Granit lève 6 M$ - Communiqué de presse";
const DESCRIPTION =
  "Granit lève 6 M$ menés par Seedcamp pour libérer les professionnels de santé de l’administratif.";

export const Route = createFileRoute("/levee-de-fonds")({
  beforeLoad: ({ location }) => {
    if (!leveeVisible(location.searchStr)) throw notFound();
  },
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
  "https://cal.com/paul-pietra-granit/decouvrir-granit/?utm_source=getgranit.ai&utm_medium=site&utm_campaign=levee&utm_content=communique_bas";

const copy = {
  fr: {
    surtitre: "Levée de fonds · Pre-seed",
    h1: ["Granit lève 6 M$ pour libérer les professionnels de santé ", "de l’administratif."],
    date: "Communiqué de presse · Paris, le 5 novembre 2026",
    chapo:
      "Granit annonce une levée de fonds de 6 millions de dollars, avec pour mission de libérer les professionnels de santé de la charge administrative qui pèse sur leur quotidien et la vocation de déployer cette promesse dans toute l’Europe. Cette levée se compose de 4 millions de dollars en fonds propres, menés par le fonds britannique Seedcamp, ainsi que de 2 millions de dollars en financement non dilutif, avec notamment la participation de Bpifrance.",
    t1: "Un quotidien saturé par l’administratif",
    p1: "Les professionnels de santé se forment pendant des années pour soigner, mais une part croissante de leur temps part dans l’administratif. Dans une étude menée auprès de plus de 1 000 soignants dans cinq pays européens, dont la France, 82 % estiment que ces tâches réduisent le temps consacré aux patients, et 65 % y passent plus d’une heure par jour (étude Time to Care, Tandem Health).",
    t2: "La promesse de Granit : mettre les logiciels au service des professionnels de santé",
    p2: "Fondée au premier trimestre 2026 par Jenny Mansour et Corneille Maréchal, Granit développe des agents IA qui se connectent directement aux logiciels métier existants (DPI, logiciels spécifiques aux spécialités) et aux plateformes externes (mutuelles, sécurité sociale, comptabilité) et effectuent à la place des équipes le travail administratif qu’elles feraient elles-mêmes : facturation, relances, corrections de rejets, vérifications de prises en charge, etc.",
    p3: "Déjà déployée auprès de plus de 250 structures de santé, la solution Granit permet de réduire jusqu’à 90 % du temps consacré aux tâches administratives, avec une mise en place effective en quelques jours et sans intégration technique lourde.",
    p4: "Le temps libéré revient au soin et au suivi des patients, et les équipes administratives se concentrent sur l’accueil et l’orientation des patients.",
    c1: "« Nous ne voulons pas ajouter un logiciel de plus dans le quotidien déjà saturé des professionnels de santé. Nous voulons que les outils qu’ils utilisent déjà travaillent pour eux, et non l’inverse. »",
    a1: ["Jenny Mansour", ", cofondatrice de Granit"],
    p5: "Cette levée de fonds permettra à Granit d’accélérer le développement de nouvelles verticales de santé, de renforcer ses équipes techniques et commerciales, et d’amorcer son expansion dans plusieurs pays européens.",
    c2: "« Les tâches administratives répétitives et fragmentées prennent beaucoup trop de temps à des soignants déjà surchargés. Les agents de Granit prennent ce travail en charge directement dans les outils que les équipes utilisent déjà, et libèrent du temps pour le soin des patients. Jenny et l’équipe réunissent une expertise rare, à la croisée des politiques de santé et de la technologie, et nous sommes ravis de mener leur premier tour de financement. »",
    a2: ["Felix Martinez", ", Partner chez Seedcamp"],
    presse: "Contact presse",
    nom: "Ségolène Redon",
    mail: "segolene.redon@bonsensagence.fr",
    tel: "06 42 06 73 70",
    cta: ["Vos équipes soignent.", "Granit gère le reste."],
    lead: "Nous vous montrons nos agents au travail dans les logiciels que vos équipes utilisent déjà, sur vos portails et vos mutuelles.",
    bouton: "Demander une démo",
    garanties: ["Hébergeur certifié HDS", "Données dans l’UE", "Conforme RGPD"],
  },
  en: {
    surtitre: "Fundraising · Pre-seed",
    h1: ["Granit raises $6M to free healthcare professionals ", "from administrative work."],
    date: "Press release · Paris, 5 November 2026",
    chapo:
      "Granit announces a $6 million funding round, with the mission of freeing healthcare professionals from the administrative burden weighing on their daily work, and the ambition to deliver on this promise across Europe. The round comprises $4 million in equity, led by UK fund Seedcamp, as well as $2 million in non-dilutive financing, including participation from Bpifrance.",
    t1: "A daily routine overloaded with admin",
    p1: "Healthcare professionals train for years to care for patients, yet a growing share of their time goes into admin. In a survey of more than 1,000 clinicians across five European countries, including France, 82% said these tasks reduce the time they can give patients, and 65% spend more than an hour a day on them (Time to Care study, Tandem Health).",
    t2: "Granit’s promise: putting software at the service of healthcare professionals",
    p2: "Founded in the first quarter of 2026 by Jenny Mansour and Corneille Maréchal, Granit develops AI agents that connect directly to existing business software (electronic patient records, specialty-specific software) and to external platforms (complementary health insurers, national health insurance, accounting), and carry out on behalf of teams the administrative work they would otherwise do themselves: invoicing, follow-ups, correcting claim rejections, checking coverage, and more.",
    p3: "Already deployed with more than 250 healthcare organisations, Granit’s solution reduces the time spent on administrative tasks by up to 90%, with set-up taking just a few days, without the need for complex technical integration.",
    p4: "The time saved goes back to patient care, and admin teams focus on welcoming and guiding patients.",
    c1: "“We don’t want to add one more piece of software to healthcare professionals’ already saturated daily lives. We want the tools they already use to work for them, not the other way around.”",
    a1: ["Jenny Mansour", ", cofounder of Granit"],
    p5: "This funding will allow Granit to accelerate the development of new healthcare verticals, strengthen its technical and commercial teams, and kick-start its expansion into several European countries.",
    c2: "“Fragmented, routine admin work takes up far too much of already overstretched healthcare workers’ time. Granit’s agents take that work on inside the systems staff already use, freeing up more time for patient care. Jenny and the team bring deep, rare expertise across healthcare policy and technology, and we couldn’t be more excited to lead their first round of funding.”",
    a2: ["Felix Martinez", ", Partner at Seedcamp"],
    presse: "Press contact",
    nom: "Katherine Bassett",
    mail: "kat.bassett@seedcamp.com",
    tel: "+44 7907 226 329",
    cta: ["Your teams care.", "Granit handles the rest."],
    lead: "We’ll show you our agents at work in the software your teams already use, on your portals and with your insurers.",
    bouton: "Book a demo",
    garanties: ["HDS-certified host", "EU data", "GDPR compliant"],
  },
};

function PageLevee() {
  const { lang } = useLanguage();
  const t = copy[lang];
  return (
    <SiteLayout>
      <div className="lv">
        <section className="lv-hero" aria-labelledby="lv-h1">
          <div className="photo">
            <img src="/levee/fondateurs.jpg" alt="Jenny Mansour et Corneille Maréchal" width={1024} height={1536} />
          </div>
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
                <img className="seedcamp" src="/levee/seedcamp.png" width={200} height={80} alt="Seedcamp" />
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
          <div className="lv-presse">
            <b>{t.presse}</b>
            <span>{t.nom}</span>
            <a href={`mailto:${t.mail}`}>{t.mail}</a>
            <span>{t.tel}</span>
          </div>
        </article>

        <section className="lv-cta" aria-labelledby="lv-cta-h">
          <div className="wrap">
            <h2 id="lv-cta-h">
              {t.cta[0]}
              <span>{t.cta[1]}</span>
            </h2>
            <p className="lead">{t.lead}</p>
            <a className="btn-clair" href={DEMO}>
              {t.bouton}
            </a>
            <ul className="lv-garanties">
              {t.garanties.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
