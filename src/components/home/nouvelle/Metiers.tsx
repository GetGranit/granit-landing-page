/* Nouvelle home : section « Métiers » (maquette Last mile, sections.js § 2 et lm.css « 2. MÉTIERS »).
   La page finale (data-final) affiche la version 4 « Tableau » : cinq lignes fermées (le métier et sa promesse),
   chacune s'ouvre au survol, au focus clavier ou au toucher sur les tâches de l'agent et les outils.
   Les trois autres affichages de la maquette (outil de revue) ne sont pas portés. */
import { useState } from "react";
import { useLanguage } from "./socle";
import "./metiers.css";

type Metier = { n: string; img: string; p: string; t: string[]; s: string[] };

const CHECK = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3.4 8.5l2.9 2.9 6.3-6.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const copy: Record<
  "fr" | "en",
  {
    eb: string;
    l1: string;
    l2: string;
    chapo: string;
    liste: string;
    k1: string;
    k2: string;
    m: Metier[];
  }
> = {
  fr: {
    eb: "Métiers",
    l1: "Votre métier, vos portails, vos règles.",
    l2: "Granit les connaît déjà.",
    chapo:
      "Chaque métier a ses logiciels, ses organismes et ses règles. Les agents les apprennent site par site, puis s’en chargent au quotidien.",
    liste: "Ce que fait Granit, métier par métier",
    k1: "Ce que fait l’agent",
    k2: "Dans vos outils",
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
    eb: "Specialties",
    l1: "Your specialty, your portals, your rules.",
    l2: "Granit already speaks them.",
    chapo:
      "Every specialty has its own software, payers and rules. The agents learn them site by site, then handle them day to day.",
    liste: "What Granit does, specialty by specialty",
    k1: "What the agent does",
    k2: "In your tools",
    m: [
      {
        n: "Opticians and hearing care professionals",
        img: "optician.jpg",
        p: "Insurer approval in under a minute, glasses or hearing aids. No back-and-forth.",
        t: [
          "Files the coverage request as soon as the quote is ready, glasses or hearing aids",
          "Attaches the prescription, the audiogram and the standard quote",
          "Bills the insurer’s share at delivery and reconciles payments",
        ],
        s: ["Your store software", "Every third-party payment platform"],
      },
      {
        n: "Dental centers",
        img: "nurse.jpg",
        p: "Quotes approved by the insurer, every treatment billed, every payment tracked.",
        t: [
          "Checks coverage and sends quotes to insurers",
          "Bills treatments and prostheses, both the national health insurance and the insurer shares",
          "Tracks every payment until it lands, rejections included",
        ],
        s: ["Dental software", "AmeliPro", "Insurers"],
      },
      {
        n: "Health centers and ophthalmology",
        img: "care-team.jpg",
        p: "No missed claim. No lost payment.",
        t: [
          "Checks national health insurance and insurer coverage before appointments",
          "Codes procedures and prepares claims",
          "Tracks every payment until it lands, rejections included",
        ],
        s: ["Medical software", "AmeliPro", "Insurers"],
      },
      {
        n: "Pharmacies",
        img: "pharmacist.jpg",
        p: "Rejections fixed, without losing your evening.",
        t: [
          "Tracks Noémie returns from the national health insurance and insurers",
          "Fixes rejections and resubmits invoices",
          "Reconciles payments and chases unpaid claims",
        ],
        s: ["Pharmacy software (LGO)", "AmeliPro", "Insurers"],
      },
      {
        n: "Clinics and laboratories",
        img: "lab-pipette.jpg",
        p: "Every batch paid, every rejection fixed. No backlog.",
        t: [
          "Checks each patient’s coverage, at admission or at sample collection",
          "Transmits claim batches and fixes rejections",
          "Tracks expected payments, payer by payer",
        ],
        s: ["Clinic software", "Laboratory software (LIS)", "AmeliPro"],
      },
    ],
  },
};

export function MetiersNouvelle() {
  const { lang } = useLanguage();
  const t = copy[lang];
  /* lignes ouvertes au toucher (au survol et au clavier, c'est le CSS qui ouvre) */
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const toggle = (i: number) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <section className="lm-sec lm-light lm-me" id="metiers" aria-labelledby="lm-me-t">
      <div className="lm-wrap">
        <div className="lm-me4">
          <div className="lm-me-top">
            <div className="lm-me-head">
              <span className="lm-eb">{t.eb}</span>
              <h2 className="lm-h2" id="lm-me-t">
                <span className="lm-nw">{t.l1}</span>
                <br /> {t.l2}
              </h2>
              <p className="lm-lead">{t.chapo}</p>
            </div>
          </div>
          <ul className="lm-me4-rows" aria-label={t.liste}>
            {t.m.map((m, i) => (
              /* la ligne est focalisable (tabIndex) : elle s'ouvre au clavier, comme dans la maquette */
              <li
                key={m.img}
                className={`lm-me4-row${open.has(i) ? " open" : ""}`}
                tabIndex={0}
                onClick={() => toggle(i)}
              >
                <div className="lm-me4-sum">
                  <i style={{ backgroundImage: `url(/home/${m.img})` }} aria-hidden="true" />
                  <h3>{m.n}</h3>
                  <p>{m.p}</p>
                  <span className="lm-me4-plus" aria-hidden="true" />
                </div>
                <div className="lm-me4-x">
                  <div>
                    <div className="lm-me4-in">
                      <div>
                        <span className="k">{t.k1}</span>
                        <ul className="lm-tasks">
                          {m.t.map((x) => (
                            <li key={x}>
                              {CHECK}
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="k">{t.k2}</span>
                        <div className="lm-tools">
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
