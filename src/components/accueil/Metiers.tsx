/* Accueil : les métiers, en tableau (l'affichage 4 « Tableau » de la maquette, celui de la version finale).
   Une ligne fermée : le métier et sa promesse ; elle s'ouvre au survol, au clavier ou au toucher
   sur ce que fait l'agent et les outils où il travaille. */
import { useLanguage } from "@/lib/i18n";
import { IconCheck } from "./commun";

type Metier = { n: string; img: string; p: string; t: string[]; s: string[] };

const copy: Record<
  "fr" | "en",
  {
    eb: string;
    h: [string, string];
    lead: string;
    rows: string;
    does: string;
    tools: string;
    m: Metier[];
  }
> = {
  fr: {
    eb: "Métiers",
    h: ["Votre métier, vos portails, vos règles.", "Granit les connaît déjà."],
    lead: "Chaque métier a ses logiciels, ses organismes et ses règles. Les agents les apprennent site par site, puis s’en chargent au quotidien.",
    rows: "Ce que fait Granit, métier par métier",
    does: "Ce que fait l’agent",
    tools: "Dans vos outils",
    m: [
      {
        n: "Opticiens et audioprothésistes",
        img: "optician.jpg",
        p: "L’accord mutuelle en moins d’une minute, lunettes ou appareils auditifs. Zéro aller-retour.",
        t: [
          "Saisit la demande de prise en charge dès le devis, lunettes ou appareils auditifs",
          "Joint l’ordonnance, l’audiogramme et le devis normalisé",
          "Facture la part mutuelle à la livraison et pointe les virements",
        ],
        s: ["Logiciel du magasin", "Toutes les plateformes de tiers payant"],
      },
      {
        n: "Centres dentaires",
        img: "nurse.jpg",
        p: "Les devis acceptés par la mutuelle, chaque soin facturé, chaque paiement suivi.",
        t: [
          "Vérifie les droits et envoie les devis aux mutuelles",
          "Facture les soins et les prothèses, part Sécurité sociale et part mutuelle",
          "Suit chaque paiement jusqu’au virement, rejets compris",
        ],
        s: ["Logiciel dentaire", "AmeliPro", "Mutuelles"],
      },
      {
        n: "Centres de santé et ophtalmologie",
        img: "care-team.jpg",
        p: "Plus un acte oublié. Plus un paiement perdu.",
        t: [
          "Vérifie les droits Assurance Maladie et mutuelle avant les rendez-vous",
          "Cote les actes et prépare les feuilles de soins",
          "Suit chaque paiement jusqu’au virement, rejets compris",
        ],
        s: ["Logiciel médical", "AmeliPro", "Mutuelles"],
      },
      {
        n: "Pharmacies",
        img: "pharmacist.jpg",
        p: "Les rejets traités sans y passer la soirée.",
        t: [
          "Suit les retours Noémie de l’Assurance Maladie et des mutuelles",
          "Corrige les rejets et renvoie les factures",
          "Pointe les virements et relance les impayés",
        ],
        s: ["Logiciel d’officine (LGO)", "AmeliPro", "Mutuelles"],
      },
      {
        n: "Cliniques et laboratoires",
        img: "lab-pipette.jpg",
        p: "Chaque lot payé, chaque rejet repris. Plus de pile qui s’accumule.",
        t: [
          "Vérifie les droits de chaque patient, à l’admission ou au prélèvement",
          "Télétransmet les lots et corrige les rejets",
          "Suit les paiements attendus, organisme par organisme",
        ],
        s: ["Logiciel de la clinique", "Logiciel du laboratoire (SIL)", "AmeliPro"],
      },
    ],
  },
  en: {
    eb: "Professions",
    h: ["Your profession, your portals, your rules.", "Granit already knows them."],
    lead: "Every profession has its own software, payers and rules. The agents learn them site by site, then handle them day to day.",
    rows: "What Granit does, profession by profession",
    does: "What the agent does",
    tools: "In your tools",
    m: [
      {
        n: "Opticians and hearing care professionals",
        img: "optician.jpg",
        p: "Mutuelle approval in under a minute, for glasses or hearing aids. No back-and-forth.",
        t: [
          "Submits the coverage request as soon as the quote is ready, for glasses or hearing aids",
          "Attaches the prescription, the audiogram and the standard quote",
          "Bills the mutuelle share on delivery and reconciles the transfers",
        ],
        s: ["Store software", "All third-party payment platforms"],
      },
      {
        n: "Dental centers",
        img: "nurse.jpg",
        p: "Quotes approved by the mutuelle, every treatment billed, every payment tracked.",
        t: [
          "Checks eligibility and sends quotes to the mutuelles",
          "Bills treatments and prosthetics, both the national health insurance share and the mutuelle share",
          "Tracks every payment through to the bank transfer, rejections included",
        ],
        s: ["Dental software", "AmeliPro", "Mutuelles"],
      },
      {
        n: "Health centers and ophthalmology",
        img: "care-team.jpg",
        p: "No more forgotten procedures. No more lost payments.",
        t: [
          "Checks national health insurance and mutuelle eligibility before appointments",
          "Codes procedures and prepares claim forms",
          "Tracks every payment through to the bank transfer, rejections included",
        ],
        s: ["Medical software", "AmeliPro", "Mutuelles"],
      },
      {
        n: "Pharmacies",
        img: "pharmacist.jpg",
        p: "Rejections handled without spending your evening on them.",
        t: [
          "Follows NOEMIE remittance files from national health insurance and the mutuelles",
          "Corrects rejections and resubmits invoices",
          "Reconciles transfers and follows up on unpaid claims",
        ],
        s: ["Pharmacy software (LGO)", "AmeliPro", "Mutuelles"],
      },
      {
        n: "Clinics and clinical labs",
        img: "lab-pipette.jpg",
        p: "Every batch paid, every rejection handled. No more growing backlog.",
        t: [
          "Checks each patient’s eligibility at admission or at sample collection",
          "E-transmits batches and corrects rejections",
          "Tracks expected payments, payer by payer",
        ],
        s: ["Clinic software", "Lab software (LIS)", "AmeliPro"],
      },
    ],
  },
};

export function Metiers() {
  const { lang } = useLanguage();
  const t = copy[lang];
  return (
    <section className="acc-sec acc-light acc-me" id="metiers" aria-labelledby="acc-me-t">
      <div className="acc-wrap">
        <div className="acc-me4">
          <div className="acc-me-top">
            <div className="acc-me-head">
              <span className="acc-eb">{t.eb}</span>
              <h2 className="acc-h2" id="acc-me-t">
                <span className="acc-nw">{t.h[0]}</span>
                <br /> {t.h[1]}
              </h2>
              <p className="acc-lead">{t.lead}</p>
            </div>
          </div>
          <ul className="acc-me4-rows" aria-label={t.rows}>
            {t.m.map((m) => (
              <li
                key={m.img}
                className="acc-me4-row"
                tabIndex={0}
                onClick={(e) => e.currentTarget.classList.toggle("open")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.currentTarget.classList.toggle("open");
                  }
                }}
              >
                <div className="acc-me4-sum">
                  <i style={{ backgroundImage: `url(/accueil/${m.img})` }} aria-hidden="true" />
                  <h3>{m.n}</h3>
                  <p>{m.p}</p>
                  <span className="acc-me4-plus" aria-hidden="true" />
                </div>
                <div className="acc-me4-x">
                  <div>
                    <div className="acc-me4-in">
                      <div>
                        <span className="k">{t.does}</span>
                        <ul className="acc-tasks">
                          {m.t.map((x) => (
                            <li key={x}>
                              <IconCheck />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="k">{t.tools}</span>
                        <div className="acc-tools">
                          {m.s.map((x) => (
                            <span key={x}>{x}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
