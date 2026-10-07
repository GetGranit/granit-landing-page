import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité - Granit AI" },
      { name: "description", content: "Données personnelles traitées par Granit AI : finalités, conservation, sécurité et droits des personnes." },
      { property: "og:title", content: "Politique de confidentialité - Granit AI" },
      { property: "og:description", content: "Politique de confidentialité Granit AI - Version 1.1." },
    ],
  }),
  component: PrivacyPage,
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

const LIMITED_USE =
  "Granit AI's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.";

const content: Record<"fr" | "en", Content> = {
  fr: {
    eyebrow: "Mentions légales",
    title: "Politique de confidentialité",
    version: "Version 1.1 — Applicable au site getgranit.ai et à l'application app.getgranit.ai",
    intro: [
      "La présente politique décrit les données personnelles traitées par Granit AI (le « Prestataire »), leurs finalités, leur durée de conservation et les droits des personnes concernées. Elle complète les Conditions Générales de Vente (CGV) et la page Sécurité, auxquelles elle renvoie.",
    ],
    sections: [
      { title: "1. Rôles", body: [
        "Pour les données que le Client confie au Service (données de ses patients, de ses magasins, de ses comptes sur des plateformes tierces), le Prestataire agit en qualité de Sous-traitant (art. 28 RGPD) et le Client est Responsable de traitement, conformément à l'article 9 des CGV.",
        "Pour les données de ses propres contacts (utilisateurs de l'application, demandes de démo), le Prestataire est Responsable de traitement.",
      ] },
      { title: "2. Données traitées", body: [
        "• Comptes : nom, e-mail professionnel et rôle des utilisateurs de l'application.",
        "• Contacts commerciaux : informations transmises via le formulaire de demande de démo.",
        "• Accès du Client : identifiants et autorisations des outils que les agents utilisent pour son compte (voir section 3).",
        "• Données métier : informations nécessaires à la tâche confiée (bénéficiaire, organisme complémentaire, devis, factures, paiements…), lues dans les outils du Client.",
        "• Journaux : traces horodatées de chaque action d'agent et des connexions, pour la sécurité et l'auditabilité du Service.",
      ] },
      { title: "3. Outils connectés", body: [
        "Pour réaliser les tâches confiées, les agents se connectent, pour le compte du Client, aux outils qu'il a autorisés : logiciel métier, plateformes de tiers payant, banque, messagerie (Gmail, Outlook, IMAP)… Ils n'accèdent qu'aux informations nécessaires à la tâche configurée par le Client et n'y réalisent que les actions qu'il a configurées ou validées. Les accès (identifiants ou autorisations OAuth) sont conservés chiffrés et révocables à tout moment depuis la page Accès de l'application ou auprès de l'éditeur de l'outil.",
        "Pour une messagerie, les agents lisent les e-mails utiles à la tâche (par exemple les codes de double authentification des plateformes ou les factures reçues) et envoient ceux que le Client a configurés ; le contenu des e-mails reçus n'est conservé que s'il fait partie du résultat demandé. Pour Gmail, le Service demande les autorisations gmail.readonly, gmail.send, openid et email.",
        LIMITED_USE,
      ] },
      { title: "4. Finalités et bases légales", body: [
        "• Fournir le Service souscrit (exécution du contrat).",
        "• Sécuriser le Service et tracer les actions des agents (intérêt légitime).",
        "• Répondre aux demandes de démo et de contact (intérêt légitime).",
        "• Respecter les obligations légales du Prestataire (obligation légale).",
        "Les données de santé sont traitées pour le compte du Client dans le cadre de l'article 9 du RGPD et du Code de la santé publique.",
      ] },
      { title: "5. Sous-traitants et partage", body: [
        "Le Prestataire ne cède, ne revend ni n'exploite les données à des fins propres. Il recourt à des prestataires techniques (hébergement, modèles d'intelligence artificielle) dans les conditions de l'article 5 des CGV : hébergement au sein de l'Union européenne, niveau de sécurité et de conformité maintenu. Les données sont également transmises aux plateformes que le Client demande d'utiliser pour son compte, et aux autorités lorsque la loi l'impose.",
      ] },
      { title: "6. Hébergement et sécurité", body: [
        "Les données sont hébergées au sein de l'Union européenne, chez un hébergeur certifié HDS, sans transfert hors UE. Elles sont chiffrées en transit et au repos, les accès sont restreints selon le principe du moindre privilège et chaque action d'agent est journalisée. Le détail des garanties figure sur la page Sécurité (getgranit.ai/securite).",
        "Aucune donnée patient n'est utilisée pour entraîner des modèles tiers ; les modèles utilisés sont hébergés en Europe.",
      ] },
      { title: "7. Durées de conservation", body: [
        "• Données du Service : pendant la durée du contrat, puis restituées et supprimées dans les 30 jours suivant sa fin (article 10 des CGV).",
        "• Accès et jetons d'autorisation : jusqu'à leur révocation par le Client ou la fin du contrat.",
        "• Contacts commerciaux : 3 ans après le dernier échange.",
      ] },
      { title: "8. Droits des personnes", body: [
        "Toute personne dispose d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité, à exercer auprès de contact@getgranit.ai. Lorsque le Prestataire agit comme Sous-traitant, il transmet la demande au Client et l'aide à y répondre. Une réclamation peut être introduite auprès de la CNIL (cnil.fr).",
        "En cas de violation de données, le Prestataire notifie la CNIL sous 72 heures et informe les Clients concernés.",
      ] },
      { title: "9. Cookies", body: [
        "Seuls les cookies et le stockage local nécessaires au fonctionnement du site et de l'application sont utilisés (session, préférence de langue). Aucun cookie publicitaire."] },
      { title: "10. Modifications", body: [
        "Le Prestataire peut modifier la présente politique. La version en vigueur est celle publiée sur cette page ; toute évolution significative est notifiée aux Clients concernés."] },
    ],
    end: "Fin de la politique de confidentialité Granit AI — Version 1.1",
  },
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    version: "Version 1.1 — Applicable to the getgranit.ai website and the app.getgranit.ai application",
    intro: [
      "This policy describes the personal data processed by Granit AI (the \"Provider\"), its purposes, retention periods and the rights of data subjects. It supplements the General Terms and Conditions (GTC) and the Security page, to which it refers.",
    ],
    sections: [
      { title: "1. Roles", body: [
        "For data the Client entrusts to the Service (its patients', stores' and third-party platform accounts' data), the Provider acts as Processor (art. 28 GDPR) and the Client is the Controller, in accordance with article 9 of the GTC.",
        "For data about its own contacts (application users, demo requests), the Provider is the Controller.",
      ] },
      { title: "2. Data processed", body: [
        "• Accounts: name, professional email and role of application users.",
        "• Business contacts: information submitted through the demo request form.",
        "• Client access: credentials and authorizations for the tools agents use on the Client's behalf (see section 3).",
        "• Business data: information needed for the assigned task (beneficiary, complementary insurer, quotes, invoices, payments…), read from the Client's tools.",
        "• Logs: timestamped records of every agent action and connection, for the security and auditability of the Service.",
      ] },
      { title: "3. Connected tools", body: [
        "To perform the assigned tasks, agents connect, on the Client's behalf, to the tools the Client has authorized: practice software, third-party payer platforms, bank, mailbox (Gmail, Outlook, IMAP)… They access only the information needed for the task configured by the Client and only perform the actions the Client has configured or approved. Access (credentials or OAuth authorizations) is stored encrypted and can be revoked at any time from the Access page of the application or with the tool's provider.",
        "For a mailbox, agents read the emails relevant to the task (for example two-factor authentication codes from platforms or received invoices) and send those configured by the Client; the content of received emails is kept only if it is part of the requested output. For Gmail, the Service requests the gmail.readonly, gmail.send, openid and email permissions.",
        LIMITED_USE,
      ] },
      { title: "4. Purposes and legal bases", body: [
        "• Deliver the subscribed Service (performance of contract).",
        "• Secure the Service and trace agent actions (legitimate interest).",
        "• Answer demo and contact requests (legitimate interest).",
        "• Comply with the Provider's legal obligations (legal obligation).",
        "Health data is processed on behalf of the Client under article 9 GDPR and the French Public Health Code.",
      ] },
      { title: "5. Processors and sharing", body: [
        "The Provider does not transfer, resell or exploit data for its own purposes. It uses technical providers (hosting, artificial intelligence models) under the conditions of article 5 of the GTC: hosting within the European Union, security and compliance levels maintained. Data is also sent to the platforms the Client asks the Service to use on its behalf, and to authorities when required by law.",
      ] },
      { title: "6. Hosting and security", body: [
        "Data is hosted within the European Union with an HDS-certified provider, with no transfer outside the EU. It is encrypted in transit and at rest, access follows the least-privilege principle and every agent action is logged. Full details are on the Security page (getgranit.ai/securite).",
        "No patient data is used to train third-party models; the models used are hosted in Europe.",
      ] },
      { title: "7. Retention periods", body: [
        "• Service data: for the duration of the contract, then returned and deleted within 30 days after its end (article 10 of the GTC).",
        "• Access credentials and authorization tokens: until revoked by the Client or the end of the contract.",
        "• Business contacts: 3 years after the last exchange.",
      ] },
      { title: "8. Data subject rights", body: [
        "Everyone has the right to access, rectify, erase, restrict, object to and port their data, by writing to contact@getgranit.ai. When the Provider acts as Processor, it forwards the request to the Client and helps it respond. A complaint may be lodged with the CNIL (cnil.fr).",
        "In the event of a data breach, the Provider notifies the CNIL within 72 hours and informs the affected Clients.",
      ] },
      { title: "9. Cookies", body: [
        "Only the cookies and local storage needed for the website and application to work are used (session, language preference). No advertising cookies."] },
      { title: "10. Changes", body: [
        "The Provider may modify this policy. The version in force is the one published on this page; any significant change is notified to the affected Clients."] },
    ],
    end: "End of the Granit AI Privacy Policy — Version 1.1",
  },
};

function PrivacyPage() {
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
