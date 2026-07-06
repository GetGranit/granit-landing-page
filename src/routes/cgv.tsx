import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions Générales de Vente - Granit AI" },
      { name: "description", content: "Conditions générales de vente Granit AI applicables à tous les agents et services." },
      { property: "og:title", content: "Conditions Générales de Vente - Granit AI" },
      { property: "og:description", content: "CGV Granit AI - Version 1.1." },
    ],
  }),
  component: CgvPage,
});

type Section = { title: string; body: string[] };
type Content = {
  eyebrow: string;
  title: string;
  version: string;
  intro: string[];
  sections: Section[];
  end: string;
};

const content: Record<"fr" | "en", Content> = {
  fr: {
    eyebrow: "Mentions légales",
    title: "Conditions Générales de Vente",
    version: "Version 1.1 — Applicables à tous les agents et services Granit AI",
    intro: [
      "Les présentes CGV s'appliquent à toutes les prestations de Granit AI à destination de ses clients professionnels, quel que soit l'agent ou le service souscrit, sauf dérogation expresse et écrite. Toute commande ou signature de devis vaut acceptation pleine et entière des présentes CGV.",
      "Les présentes CGV s'appliquent indépendamment du nombre d'agents souscrits par le Client. Un client souscrivant plusieurs agents Granit AI n'est pas tenu de signer les CGV plusieurs fois.",
    ],
    sections: [
      { title: "1. Offres et commandes", body: ["Les devis sont valables 30 jours. Toute commande est ferme à réception du devis signé. Toute modification ultérieure nécessite un avenant écrit, sauf pour les extensions de périmètre prévues contractuellement."] },
      { title: "2. Accès au service", body: ["Les accès sont ouverts dans un délai de 5 jours ouvrés suivant réception du devis signé et du règlement des frais de setup. Le Client reçoit ses identifiants par email sécurisé. Le Prestataire s'engage à respecter ce délai de mise en service."] },
      { title: "3. Tarifs", body: ["Les tarifs sont exprimés en euros HT, TVA en sus au taux en vigueur (20% à ce jour). Ils sont ceux figurant dans le devis accepté. Le Prestataire peut réviser ses tarifs avec un préavis de 60 jours. Le Client peut résilier sans pénalité si la hausse dépasse 10%, en notifiant sa décision dans ce délai."] },
      { title: "4. Facturation et paiement", body: [
        "Les frais de setup sont facturés à la signature. La redevance mensuelle est facturée en début de mois (terme à échoir). Paiement par virement bancaire à 30 jours date de facture.",
        "Tout retard de paiement entraîne de plein droit :",
        "• Des pénalités au taux BCE + 10 points, applicables dès le premier jour de retard (art. L.441-10 C. com.)",
        "• Une indemnité forfaitaire de recouvrement de 40 EUR (art. D.441-5 C. com.)",
        "• La suspension possible du Service après mise en demeure restée sans effet 7 jours ouvrés. Durant la période de suspension, la redevance mensuelle reste due.",
      ] },
      { title: "5. Sous-traitance technique et liberté de choix des prestataires", body: [
        "Le Prestataire est autorisé à recourir librement à des prestataires techniques tiers pour assurer tout ou partie du Service : fournisseurs d'infrastructure cloud, fournisseurs de modèles d'intelligence artificielle (LLM), et tout autre composant technique nécessaire. Le Prestataire peut changer de fournisseur à tout moment sans notification préalable ni accord du Client, sous réserve de maintenir :",
        "• Les niveaux de service (SLA) définis au contrat",
        "• L'hébergement des données au sein de l'Union Européenne",
        "• Le niveau de sécurité et de conformité réglementaire",
        "Le Prestataire demeure seul responsable vis-à-vis du Client des obligations contractuelles, quelle que soit la défaillance d'un prestataire technique tiers.",
      ] },
      { title: "6. Obligations du Client", body: [
        "• Fournir des informations exactes pour la configuration du Service",
        "• Ne pas partager ses identifiants avec des tiers extérieurs à son organisation",
        "• Ne pas tenter de contourner ou d'accéder directement aux composants techniques sous-jacents du Service",
        "• Signaler tout incident ou anomalie dans un délai de 48h",
        "• Désigner un interlocuteur référent pour la relation avec Granit AI",
        "• Utiliser le Service conformément à sa destination et à la réglementation en vigueur dans son secteur",
      ] },
      { title: "7. Obligations du Prestataire", body: [
        "• Fournir le Service selon les niveaux définis au contrat (SLA)",
        "• Corriger tous les bugs mineurs dans le délai contractuel (48h ouvrées)",
        "• Maintenir la sécurité et la confidentialité des données traitées",
        "• Notifier le Client de toute maintenance planifiée avec 48h de préavis",
        "• Mettre à disposition un rapport de disponibilité mensuel sur demande",
        "• Informer le Client de toute évolution significative affectant les fonctionnalités principales du Service, avec un préavis de 30 jours",
      ] },
      { title: "8. Confidentialité", body: ["Chacune des parties s'engage à garder strictement confidentielles toutes les informations de nature confidentielle communiquées par l'autre partie dans le cadre de la relation commerciale et de l'exécution du Service. Cette obligation s'applique dès le premier échange précontractuel et survit à la fin du contrat pour une durée de 3 ans."] },
      { title: "9. Données personnelles et RGPD", body: ["Le Prestataire traite les données pour le compte du Client (Responsable de traitement) en qualité de Sous-traitant (art. 28 RGPD). Les modalités détaillées du traitement sont définies dans le contrat de service, lequel intègre l'accord de traitement des données requis par l'art. 28 RGPD. Les données sont hébergées au sein de l'Union européenne, dans des conditions de sécurité adaptées à la nature des données traitées. Le Prestataire ne cède, ne revend ni n'exploite les données du Client à des fins propres."] },
      { title: "10. Portabilité et restitution des données", body: ["A tout moment sur demande, et au plus tard dans les 30 jours suivant la fin du contrat, le Prestataire met à disposition du Client l'ensemble de ses données dans un format standard exploitable (CSV ou JSON). Cette opération est incluse dans le forfait pour un export standard. Passé ce délai, les données sont supprimées définitivement et irréversiblement."] },
      { title: "11. Propriété intellectuelle", body: ["Le Client bénéficie d'une licence d'usage limitée à la durée du contrat, non-exclusive et non-transférable. Toute reproduction, adaptation ou revente du Service est interdite. Les données générées par le Client restent sa propriété exclusive."] },
      { title: "12. Responsabilité", body: ["Le Service est fourni avec une obligation de moyens. La responsabilité du Prestataire est plafonnée aux sommes versées au cours des 3 derniers mois précédant le fait générateur. Sont exclus les dommages indirects et pertes d'exploitation."] },
      { title: "13. Force majeure", body: ["Aucune partie n'est responsable d'un manquement dû à un événement de force majeure (art. 1218 C. civ.). La partie concernée notifie l'autre dans les 48h. Si l'événement dure plus de 30 jours consécutifs, chaque partie peut résilier le contrat sans pénalité."] },
      { title: "14. Résiliation", body: [
        "Par le Client : à tout moment, par email avec un préavis de 30 jours, sans pénalité ni frais.",
        "Par le Prestataire : en cas de non-paiement persistant après mise en demeure, violation grave des CGV ou usage frauduleux du Service, avec un préavis de 15 jours.",
        "Effet : les accès sont coupés à la date d'effet. Les données sont exportables pendant 30 jours, dans les conditions de l'article 10.",
      ] },
      { title: "15. Modifications des CGV", body: ["Le Prestataire peut modifier les présentes CGV avec un préavis de 30 jours par notification écrite. La poursuite du Service après ce délai vaut acceptation. En cas de refus, le Client peut résilier sans pénalité dans ce délai."] },
      { title: "16. Droit applicable et litiges", body: ["Les présentes CGV sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable dans un délai de 30 jours avant toute saisine judiciaire. A défaut, tout litige relève de la compétence exclusive du Tribunal de Commerce de Paris."] },
    ],
    end: "Fin des Conditions Générales de Vente Granit AI — Version 1.1",
  },
  en: {
    eyebrow: "Legal",
    title: "General Terms and Conditions of Sale",
    version: "Version 1.1 — Applicable to all Granit AI agents and services",
    intro: [
      "These GTC apply to all services provided by Granit AI to its professional clients, regardless of the agent or service subscribed, unless expressly waived in writing. Any order or signed quote constitutes full and unreserved acceptance of these GTC.",
      "These GTC apply regardless of the number of agents subscribed by the Client. A client subscribing to several Granit AI agents is not required to sign the GTC multiple times.",
    ],
    sections: [
      { title: "1. Offers and orders", body: ["Quotes are valid for 30 days. Any order is firm upon receipt of the signed quote. Any subsequent modification requires a written amendment, except for scope extensions provided for contractually."] },
      { title: "2. Service access", body: ["Access is provided within 5 business days following receipt of the signed quote and payment of setup fees. The Client receives credentials by secure email. The Provider commits to respecting this lead time."] },
      { title: "3. Pricing", body: ["Prices are expressed in euros excluding VAT, applicable VAT in addition (currently 20%). Prices are those stated in the accepted quote. The Provider may revise its prices with 60 days' notice. The Client may terminate without penalty if the increase exceeds 10%, by notifying its decision within this period."] },
      { title: "4. Invoicing and payment", body: [
        "Setup fees are invoiced upon signature. The monthly fee is invoiced at the beginning of the month (in advance). Payment by bank transfer within 30 days from invoice date.",
        "Any late payment automatically results in:",
        "• Penalties at the ECB rate + 10 points, applicable from the first day of delay (art. L.441-10 French Commercial Code)",
        "• A flat-rate recovery indemnity of EUR 40 (art. D.441-5 French Commercial Code)",
        "• Possible suspension of the Service after formal notice has remained without effect for 7 business days. During the suspension period, the monthly fee remains due.",
      ] },
      { title: "5. Technical subcontracting and freedom to choose providers", body: [
        "The Provider is authorized to freely use third-party technical providers to deliver all or part of the Service: cloud infrastructure providers, AI model (LLM) providers, and any other necessary technical component. The Provider may change provider at any time without prior notice or consent of the Client, provided it maintains:",
        "• The service levels (SLA) defined in the contract",
        "• Data hosting within the European Union",
        "• The level of security and regulatory compliance",
        "The Provider remains solely responsible to the Client for contractual obligations, regardless of any failure by a third-party technical provider.",
      ] },
      { title: "6. Client obligations", body: [
        "• Provide accurate information for Service configuration",
        "• Not share credentials with third parties outside its organization",
        "• Not attempt to bypass or directly access the underlying technical components of the Service",
        "• Report any incident or anomaly within 48h",
        "• Designate a point of contact for the relationship with Granit AI",
        "• Use the Service in accordance with its purpose and applicable regulations in its sector",
      ] },
      { title: "7. Provider obligations", body: [
        "• Provide the Service according to the levels defined in the contract (SLA)",
        "• Fix all minor bugs within the contractual timeframe (48 business hours)",
        "• Maintain the security and confidentiality of processed data",
        "• Notify the Client of any planned maintenance with 48h notice",
        "• Provide a monthly availability report upon request",
        "• Inform the Client of any significant evolution affecting the main features of the Service, with 30 days' notice",
      ] },
      { title: "8. Confidentiality", body: ["Each party undertakes to keep strictly confidential all confidential information communicated by the other party in the context of the commercial relationship and the execution of the Service. This obligation applies from the first pre-contractual exchange and survives the end of the contract for 3 years."] },
      { title: "9. Personal data and GDPR", body: ["The Provider processes data on behalf of the Client (Data Controller) as a Processor (art. 28 GDPR). Detailed processing terms are defined in the service contract, which incorporates the data processing agreement required by art. 28 GDPR. Data is hosted within the European Union, under security conditions adapted to the nature of the data processed. The Provider does not transfer, resell or exploit Client data for its own purposes."] },
      { title: "10. Data portability and return", body: ["At any time upon request, and no later than 30 days following the end of the contract, the Provider makes available to the Client all of its data in a standard exploitable format (CSV or JSON). This operation is included in the package for a standard export. After this period, data is permanently and irreversibly deleted."] },
      { title: "11. Intellectual property", body: ["The Client benefits from a usage license limited to the duration of the contract, non-exclusive and non-transferable. Any reproduction, adaptation or resale of the Service is prohibited. Data generated by the Client remains its exclusive property."] },
      { title: "12. Liability", body: ["The Service is provided with a best-efforts obligation. The Provider's liability is capped at the amounts paid during the 3 months preceding the triggering event. Indirect damages and loss of business are excluded."] },
      { title: "13. Force majeure", body: ["No party shall be liable for a breach due to a force majeure event (art. 1218 French Civil Code). The affected party notifies the other within 48h. If the event lasts more than 30 consecutive days, each party may terminate the contract without penalty."] },
      { title: "14. Termination", body: [
        "By the Client: at any time, by email with 30 days' notice, without penalty or fees.",
        "By the Provider: in case of persistent non-payment after formal notice, serious breach of the GTC or fraudulent use of the Service, with 15 days' notice.",
        "Effect: access is cut off on the effective date. Data is exportable for 30 days, under the conditions of article 10.",
      ] },
      { title: "15. GTC modifications", body: ["The Provider may modify these GTC with 30 days' notice by written notification. Continued use of the Service after this period constitutes acceptance. In case of refusal, the Client may terminate without penalty within this period."] },
      { title: "16. Applicable law and disputes", body: ["These GTC are governed by French law. In the event of a dispute, the parties undertake to seek an amicable solution within 30 days before any judicial action. Failing this, any dispute falls under the exclusive jurisdiction of the Paris Commercial Court."] },
    ],
    end: "End of Granit AI General Terms and Conditions of Sale — Version 1.1",
  },
};

function CgvPage() {
  const { lang } = useLanguage();
  const t = content[lang];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[820px] px-6 pt-24 pb-12">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero" style={{ fontSize: "clamp(36px,4.4vw,64px)" }}>
            {t.title}
          </h1>
          <p className="mt-6 text-[13px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {t.version}
          </p>
          <div className="mt-10 space-y-5">
            {t.intro.map((p, i) => (
              <p key={i} className="text-[16px] leading-[1.75]" style={{ color: "var(--text-soft)" }}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[820px] px-6 pb-28">
        <div className="space-y-12">
          {t.sections.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 0.02, 0.1)}>
              <div>
                <h2 className="font-serif text-[22px]" style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {s.body.map((p, j) => (
                    <p key={j} className="text-[15px] leading-[1.75]" style={{ color: "var(--text-soft)" }}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 border-t pt-8 text-[13px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {t.end}
        </div>
      </section>
    </SiteLayout>
  );
}
