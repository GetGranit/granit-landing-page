import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité - Granit AI" },
      { name: "description", content: "Quelles données Granit AI collecte, comment elles sont utilisées, conservées et protégées, y compris les données des comptes Google." },
      { property: "og:title", content: "Politique de confidentialité - Granit AI" },
      { property: "og:description", content: "Politique de confidentialité Granit AI, données Google comprises." },
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
    version: "Version 1.0 — En vigueur au 7 octobre 2026",
    intro: [
      "Granit AI édite une plateforme d'agents d'intelligence artificielle destinée aux professionnels de santé (opticiens, audioprothésistes, établissements de soins). Cette politique explique quelles données nous collectons, pourquoi, comment nous les utilisons, les conservons, les partageons et les protégeons, et quels sont vos droits. Elle s'applique au site www.getgranit.ai et à l'application app.getgranit.ai.",
      "Pour toute question : contact@getgranit.ai.",
    ],
    sections: [
      { title: "1. Qui sommes-nous", body: [
        "Granit AI, Paris, France (contact@getgranit.ai).",
        "Pour les données que nos clients nous confient dans le cadre du service (données de leurs patients, de leurs magasins, de leurs comptes sur des plateformes tierces), Granit AI agit en qualité de sous-traitant au sens de l'article 28 du RGPD : le client professionnel est responsable de traitement. Pour les données des visiteurs du site et des utilisateurs de l'application (comptes, contacts commerciaux), Granit AI est responsable de traitement.",
      ] },
      { title: "2. Données que nous collectons", body: [
        "• Données de compte : nom, adresse e-mail professionnelle et rôle des utilisateurs de l'application.",
        "• Données de contact : informations transmises via le formulaire de demande de démo (nom, e-mail, téléphone, structure, message).",
        "• Identifiants de connexion : les accès que le client enregistre pour permettre aux agents de travailler pour lui (logiciel métier, plateformes de tiers payant, banque, messagerie). Ils sont chiffrés et stockés dans un coffre-fort de secrets.",
        "• Données traitées par les agents : informations nécessaires à la tâche confiée (par exemple bénéficiaire, numéro de sécurité sociale, organisme complémentaire, devis, factures, paiements), lues dans les outils du client.",
        "• Données techniques : journaux de connexion et d'exécution nécessaires à la sécurité et au bon fonctionnement du service.",
      ] },
      { title: "3. Données des comptes Google (Gmail)", body: [
        "Lorsqu'un client connecte une boîte Gmail à Granit via « Se connecter avec Google », nous demandons uniquement les autorisations suivantes :",
        "• https://www.googleapis.com/auth/gmail.readonly — lecture des e-mails ;",
        "• https://www.googleapis.com/auth/gmail.send — envoi d'e-mails au nom du client ;",
        "• openid et email — l'adresse e-mail du compte connecté, pour l'afficher au client et identifier la boîte.",
        "Utilisation : Granit lit uniquement les e-mails nécessaires à la tâche configurée par le client, en recherchant des expéditeurs précis. Il s'agit principalement des codes de vérification (double authentification) envoyés par les plateformes de tiers payant et les logiciels du client, qui permettent à nos agents de se connecter à ces plateformes pour son compte ; et, lorsque le client l'a demandé, des documents professionnels reçus par e-mail (factures fournisseurs, avis de paiement). Envoi : lorsque le client l'a configuré, Granit envoie depuis sa boîte les e-mails liés à cette tâche (par exemple une relance ou une demande adressée à un organisme, un patient ou un fournisseur), avec le contenu et les destinataires définis par le client ou validés par lui. Granit ne lit pas les autres e-mails, n'envoie aucun e-mail publicitaire ou étranger au service, ne modifie ni ne supprime aucun message.",
        "Stockage : nous conservons le jeton d'autorisation (refresh token) fourni par Google, chiffré dans Google Cloud Secret Manager, hébergé dans l'Union européenne. Nous ne conservons pas le contenu des e-mails reçus : un code de vérification est utilisé immédiatement puis écarté ; un document professionnel n'est conservé que s'il fait partie du résultat demandé par le client, avec les autres données du service.",
        "Partage : les données Google ne sont ni vendues, ni louées, ni partagées avec des tiers, ni utilisées à des fins publicitaires. Elles ne sont transmises qu'aux sous-traitants techniques nécessaires au fonctionnement du service (hébergement), dans l'Union européenne. Aucun humain ne lit ces e-mails, sauf accord explicite du client pour résoudre un incident, pour des raisons de sécurité ou pour respecter la loi.",
        "Intelligence artificielle : les données issues des API Google ne sont jamais utilisées pour développer, améliorer ou entraîner des modèles d'intelligence artificielle ou d'apprentissage automatique généralistes.",
        "Engagement « Limited Use » : l'utilisation et le transfert par Granit AI des informations reçues des API Google respectent la Google API Services User Data Policy, y compris les exigences de « Limited Use ».",
        LIMITED_USE,
        "Révocation : le client peut retirer l'accès à tout moment depuis la page Accès de l'application Granit, ou depuis https://myaccount.google.com/permissions. Le jeton est alors inutilisable, et nous le supprimons sur simple demande ou à la fin du contrat.",
      ] },
      { title: "4. Finalités et bases légales", body: [
        "• Exécuter le service souscrit par le client (exécution du contrat) : faire fonctionner les agents, se connecter aux outils du client, produire les résultats demandés.",
        "• Sécuriser le service et prévenir les abus (intérêt légitime).",
        "• Répondre aux demandes de démo et de contact (intérêt légitime, ou consentement lorsque la loi l'exige).",
        "• Respecter nos obligations légales (obligation légale).",
        "Les données de santé sont traitées pour le compte du client professionnel de santé, dans le cadre de l'article 9 du RGPD et du Code de la santé publique.",
      ] },
      { title: "5. Partage des données", body: [
        "Nous ne vendons aucune donnée. Les données ne sont partagées qu'avec :",
        "• nos sous-traitants techniques (hébergement cloud, fournisseurs de modèles d'IA hébergés en Europe), liés par contrat et soumis à des obligations de confidentialité et de sécurité ;",
        "• les plateformes et logiciels que le client nous demande d'utiliser pour son compte (par exemple une plateforme de tiers payant pour une demande de prise en charge) ;",
        "• les autorités, lorsque la loi l'impose.",
      ] },
      { title: "6. Hébergement et transferts", body: [
        "Les données sont hébergées dans l'Union européenne. Aucun transfert hors de l'Union européenne n'est effectué sans garanties appropriées au sens du RGPD.",
      ] },
      { title: "7. Durée de conservation", body: [
        "• Données du service : pendant la durée du contrat, puis restituées et supprimées dans les 30 jours suivant sa fin (voir l'article 10 des CGV).",
        "• Identifiants et jetons d'autorisation : jusqu'à leur révocation par le client ou la fin du contrat.",
        "• Contenu des e-mails : non conservé, sauf document faisant partie du résultat demandé (voir section 3).",
        "• Demandes de contact : 3 ans après le dernier échange.",
        "• Journaux techniques : 12 mois maximum.",
      ] },
      { title: "8. Sécurité", body: [
        "Chiffrement en transit (TLS) et au repos, secrets stockés dans un coffre-fort dédié, accès restreints selon le principe du moindre privilège, isolation des données par client, journalisation des accès. Plus de détails sur la page Sécurité : https://www.getgranit.ai/securite.",
      ] },
      { title: "9. Vos droits", body: [
        "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Pour les exercer, écrivez à contact@getgranit.ai. Lorsque Granit AI agit comme sous-traitant, nous transmettons la demande au client responsable de traitement et l'aidons à y répondre.",
        "Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).",
      ] },
      { title: "10. Cookies", body: [
        "Le site et l'application utilisent uniquement les cookies et le stockage local nécessaires à leur fonctionnement (session de connexion, préférence de langue). Aucun cookie publicitaire n'est utilisé.",
      ] },
      { title: "11. Modifications", body: [
        "Nous pouvons mettre à jour cette politique. La date de version en haut de page indique la dernière mise à jour. En cas de changement important, notamment sur l'utilisation des données Google, nous en informons les clients concernés.",
      ] },
    ],
    end: "Fin de la politique de confidentialité Granit AI — Version 1.0",
  },
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    version: "Version 1.0 — Effective October 7, 2026",
    intro: [
      "Granit AI provides an AI agent platform for healthcare professionals (opticians, hearing care professionals, care facilities). This policy explains what data we collect, why, how we use, store, share and protect it, and what your rights are. It applies to the website www.getgranit.ai and the application app.getgranit.ai.",
      "Questions: contact@getgranit.ai.",
    ],
    sections: [
      { title: "1. Who we are", body: [
        "Granit AI, Paris, France (contact@getgranit.ai).",
        "For data our clients entrust to us as part of the service (their patients' data, their stores' data, their accounts on third-party platforms), Granit AI acts as a processor under article 28 GDPR; the professional client is the controller. For data about website visitors and application users (accounts, business contacts), Granit AI is the controller.",
      ] },
      { title: "2. Data we collect", body: [
        "• Account data: name, professional email address and role of application users.",
        "• Contact data: information submitted through the demo request form (name, email, phone, organization, message).",
        "• Login credentials: the access the client registers so agents can work on its behalf (practice software, third-party payer platforms, bank, mailbox). They are encrypted and stored in a secrets vault.",
        "• Data processed by agents: information needed for the assigned task (for example beneficiary, social security number, complementary insurer, quotes, invoices, payments), read from the client's tools.",
        "• Technical data: connection and execution logs needed for security and proper operation of the service.",
      ] },
      { title: "3. Google account data (Gmail)", body: [
        "When a client connects a Gmail mailbox to Granit using \"Sign in with Google\", we request only the following permissions:",
        "• https://www.googleapis.com/auth/gmail.readonly — read access to emails;",
        "• https://www.googleapis.com/auth/gmail.send — send emails on the client's behalf;",
        "• openid and email — the email address of the connected account, to display it to the client and identify the mailbox.",
        "Use: Granit reads only the emails needed for the task configured by the client, by searching for specific senders. These are mainly verification codes (two-factor authentication) sent by third-party payer platforms and the client's software, which allow our agents to sign in to those platforms on the client's behalf; and, when the client requested it, business documents received by email (supplier invoices, payment notices). Sending: when the client has configured it, Granit sends emails related to that task from the client's mailbox (for example a follow-up or a request addressed to an insurer, a patient or a supplier), with content and recipients defined or approved by the client. Granit does not read other emails, never sends advertising or emails unrelated to the service, and does not modify or delete any message.",
        "Storage: we keep the authorization token (refresh token) issued by Google, encrypted in Google Cloud Secret Manager, hosted in the European Union. We do not keep the content of received emails: a verification code is used immediately and then discarded; a business document is kept only if it is part of the output requested by the client, alongside the other service data.",
        "Sharing: Google user data is not sold, rented, shared with third parties or used for advertising. It is only transmitted to the technical processors required to run the service (hosting), within the European Union. No human reads these emails, unless the client explicitly agrees in order to resolve an incident, for security purposes, or to comply with the law.",
        "Artificial intelligence: data obtained through Google APIs is never used to develop, improve or train generalized artificial intelligence or machine learning models.",
        LIMITED_USE,
        "Revocation: the client can remove access at any time from the Access page of the Granit application, or from https://myaccount.google.com/permissions. The token then becomes unusable, and we delete it upon request or at the end of the contract.",
      ] },
      { title: "4. Purposes and legal bases", body: [
        "• Deliver the service subscribed by the client (performance of contract): run the agents, connect to the client's tools, produce the requested outputs.",
        "• Secure the service and prevent abuse (legitimate interest).",
        "• Answer demo and contact requests (legitimate interest, or consent where required by law).",
        "• Comply with our legal obligations (legal obligation).",
        "Health data is processed on behalf of the healthcare professional client, under article 9 GDPR and the French Public Health Code.",
      ] },
      { title: "5. Data sharing", body: [
        "We do not sell any data. Data is shared only with:",
        "• our technical processors (cloud hosting, AI model providers hosted in Europe), bound by contract and subject to confidentiality and security obligations;",
        "• the platforms and software the client asks us to use on its behalf (for example a third-party payer platform for a coverage request);",
        "• authorities, when required by law.",
      ] },
      { title: "6. Hosting and transfers", body: [
        "Data is hosted in the European Union. No transfer outside the European Union takes place without appropriate safeguards under the GDPR.",
      ] },
      { title: "7. Retention", body: [
        "• Service data: for the duration of the contract, then returned and deleted within 30 days after its end (see article 10 of the Terms).",
        "• Credentials and authorization tokens: until revoked by the client or the end of the contract.",
        "• Email content: not retained, except documents that are part of the requested output (see section 3).",
        "• Contact requests: 3 years after the last exchange.",
        "• Technical logs: 12 months maximum.",
      ] },
      { title: "8. Security", body: [
        "Encryption in transit (TLS) and at rest, secrets stored in a dedicated vault, least-privilege access controls, per-client data isolation, access logging. More details on the Security page: https://www.getgranit.ai/securite.",
      ] },
      { title: "9. Your rights", body: [
        "Under the GDPR, you have the right to access, rectify, erase, restrict, object to and port your data. To exercise these rights, email contact@getgranit.ai. When Granit AI acts as a processor, we forward the request to the client acting as controller and help it respond.",
        "You may also lodge a complaint with the French data protection authority, the CNIL (www.cnil.fr).",
      ] },
      { title: "10. Cookies", body: [
        "The website and application only use the cookies and local storage needed for them to work (login session, language preference). No advertising cookies are used.",
      ] },
      { title: "11. Changes", body: [
        "We may update this policy. The version date at the top of the page shows the latest update. In case of a significant change, in particular regarding the use of Google data, we inform the affected clients.",
      ] },
    ],
    end: "End of the Granit AI Privacy Policy — Version 1.0",
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
