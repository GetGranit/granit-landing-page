import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { usePostHog } from "posthog-js/react";

import { getAttribution } from "@/lib/attribution";
import { envoyerMailOutil, type CorpsMailOutil } from "@/lib/outils/envoyerMailOutil";
import { lienRdv } from "@/lib/outils/mailOutils";
import {
  logDemoRequestDelivered,
  logDemoRequestDeliveryFailed,
  type DemoFormLocation,
} from "@/lib/posthogLogs";
import { submitDemo } from "@/lib/submitDemo";

/**
 * Ce que partagent les deux outils gratuits (/outils/tri-des-marques et
 * /outils/heures-de-decembre) : le suivi PostHog, l'en-tête, le bloc de
 * résultat et le formulaire qui livre le lead (B11 puis mail de secours) et
 * envoie son mail à l'opticien.
 *
 * Suivi PostHog, le même tunnel pour les deux outils (propriété `outil`) :
 *   lm_page_vue → lm_outil_commence → lm_resultat_vu → lm_formulaire_envoye
 * plus lm_pont_rempli (tri des marques), lm_mail_envoye et lm_rdv_clic.
 * Les utm_* du lien d'arrivée sont déjà attachées à chaque événement par
 * __root.tsx (posthog.register) : pas besoin de les repasser ici.
 */
export type Outil = "tri-des-marques" | "heures-de-decembre";

export function useSuiviOutil(outil: Outil) {
  const posthog = usePostHog();
  const dejaCommence = useRef(false);
  const dejaVu = useRef(false);
  const resultat = useRef<HTMLDivElement | null>(null);

  const suivre = useCallback(
    (evenement: string, proprietes: Record<string, unknown> = {}) =>
      posthog?.capture(evenement, { outil, ...proprietes }),
    [posthog, outil],
  );

  useEffect(() => {
    suivre("lm_page_vue");
  }, [suivre]);

  /** À appeler à chaque saisie : l'événement ne part qu'à la première. */
  const commence = useCallback(() => {
    if (dejaCommence.current) return;
    dejaCommence.current = true;
    suivre("lm_outil_commence");
  }, [suivre]);

  // Le résultat est « vu » quand son bloc entre à moitié dans l'écran.
  useEffect(() => {
    const cible = resultat.current;
    if (!cible || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entree]) => {
        if (!entree?.isIntersecting || dejaVu.current) return;
        dejaVu.current = true;
        suivre("lm_resultat_vu", { apres_saisie: dejaCommence.current });
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(cible);
    return () => io.disconnect();
  }, [suivre]);

  return { suivre, commence, resultat };
}

/** Bandeau d'ouverture : le dégradé de marque en grand fond (DESIGN.md), titre en deux temps. */
export function EnTeteOutil({
  titre,
  accent,
  chapeau,
}: {
  titre: string;
  accent: string;
  chapeau: string;
}) {
  return (
    <header style={{ background: "var(--degrade-marque)" }}>
      <div className="mx-auto max-w-[1120px] px-4 py-12 md:px-8 md:py-20">
        <p className="eyebrow">Outil gratuit pour les opticiens</p>
        <h1
          className="mt-4 max-w-[18ch] font-serif text-balance"
          style={{
            fontSize: "clamp(36px, 5.4vw, 64px)",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            fontWeight: 300,
          }}
        >
          {titre} <span className="accent-italic">{accent}</span>
        </h1>
        <p className="mt-5 max-w-[56ch] text-[17px]" style={{ lineHeight: 1.55 }}>
          {chapeau}
        </p>
      </div>
    </header>
  );
}

/** Section forte : encre, texte rosé, accent menthe. Porte le chiffre du résultat. */
export function BlocSombre({ children }: { children: ReactNode }) {
  return (
    <div
      className="section-sombre rounded-[14px] p-6 md:p-9"
      style={{ boxShadow: "var(--ombre-carte)" }}
    >
      {children}
    </div>
  );
}

export function GrandChiffre({ children }: { children: ReactNode }) {
  return (
    <p
      className="num-tabular mt-3 font-serif"
      style={{
        fontSize: "clamp(46px, 8vw, 80px)",
        lineHeight: 1,
        letterSpacing: "-0.035em",
        fontWeight: 300,
      }}
      aria-live="polite"
    >
      {children}
    </p>
  );
}

export function Carte({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[14px] bg-papier p-5 md:p-8 ${className}`}
      style={{ border: "1px solid var(--filet)" }}
    >
      {children}
    </div>
  );
}

export const champClass =
  "num-tabular w-full min-w-0 rounded-[8px] bg-papier px-3 py-2.5 text-[16px] outline-none transition-colors focus:border-[color:var(--profond)]";
export const champStyle = { border: "1px solid var(--filet-champ)", color: "var(--encre)" };

export function Champ({
  libelle,
  aide,
  children,
}: {
  libelle: string;
  aide?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-[14px]" style={{ fontWeight: 500 }}>
      {libelle}
      {children}
      {aide && (
        <span className="text-[13px]" style={{ fontWeight: 400, color: "var(--texte-secondaire)" }}>
          {aide}
        </span>
      )}
    </label>
  );
}

type FormProps = {
  outil: Outil;
  /** Valeur du champ `source` du lead : elle arrive telle quelle dans B11 et Attio. */
  source: string;
  formLocation: DemoFormLocation;
  titre: string;
  bouton: string;
  /** Les réponses de l'outil en une phrase : elle part dans le champ « message » de la fiche. */
  resume: string;
  /** Chiffres de l'outil joints à lm_formulaire_envoye (jamais l'e-mail). */
  proprietes: Record<string, unknown>;
  /** Ce qu'il faut pour écrire le mail, sans le prénom ni l'adresse (lus dans le formulaire). */
  mail: () => CorpsMailOutil;
  merci: string;
  suivre: (evenement: string, proprietes?: Record<string, unknown>) => void;
};

/**
 * Trois champs : prénom, e-mail, nombre de magasins. Le résultat est déjà
 * affiché au-dessus ; le formulaire sert à le recevoir, pas à le voir.
 */
export function FormulaireOutil(props: FormProps) {
  const { outil, source, formLocation, titre, bouton, resume, proprietes, mail, merci, suivre } =
    props;
  const submit = useServerFn(submitDemo);
  const envoyerMail = useServerFn(envoyerMailOutil);
  const posthog = usePostHog();
  const [etat, setEtat] = useState<"saisie" | "envoi" | "merci" | "erreur">("saisie");
  const [adresse, setAdresse] = useState("");

  if (etat === "merci") {
    return (
      <BlocSombre>
        <h2
          className="font-serif text-balance"
          style={{ fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.1, fontWeight: 300 }}
        >
          C’est envoyé. <span className="accent-italic">Regardez votre boîte mail.</span>
        </h2>
        <p className="mt-3 max-w-[56ch] text-[15px]" style={{ color: "var(--sur-encre-secondaire)" }}>
          {merci.replace("{adresse}", adresse)}
        </p>
        <a
          href={lienRdv(outil).replace("utm_medium=email", "utm_medium=site")}
          target="_blank"
          rel="noopener"
          className="btn-clair mt-6"
          onClick={() => suivre("lm_rdv_clic", { emplacement: "merci" })}
        >
          Prendre 15 minutes avec Paul
        </a>
      </BlocSombre>
    );
  }

  return (
    <Carte>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get("name") || "").trim();
          const email = String(fd.get("email") || "").trim();
          const magasins = String(fd.get("orgType") || "").trim();
          const lead = {
            name,
            email,
            orgType: magasins ? `${magasins} magasin(s)` : "",
            challenge: resume,
            source,
            utm: getAttribution(),
          };
          setAdresse(email);
          setEtat("envoi");

          // Copie de secours dans PostHog avant l'envoi, comme pour le webinar :
          // si B11 et le mail de secours tombent ensemble, le lead reste lisible.
          const secours = Boolean(posthog?.__loaded);
          posthog?.capture(
            "lm_formulaire_secours",
            { outil, ...lead },
            { send_instantly: true, transport: "sendBeacon" },
          );

          // Le mail à l'opticien part en parallèle : son échec ne bloque pas le lead.
          void envoyerMail({ data: { ...mail(), name, email } })
            .then((r) => suivre("lm_mail_envoye", { envoye: r.envoye }))
            .catch((err: unknown) =>
              suivre("lm_mail_envoye", {
                envoye: false,
                erreur: String((err as Error)?.message ?? err).slice(0, 250),
              }),
            );

          try {
            await submit({ data: lead });
            suivre("lm_formulaire_envoye", { magasins: Number(magasins) || undefined, ...proprietes });
            if (posthog) logDemoRequestDelivered(posthog, formLocation, lead.orgType || undefined);
            setEtat("merci");
          } catch {
            if (posthog) logDemoRequestDeliveryFailed(posthog, formLocation);
            setEtat(secours ? "merci" : "erreur");
          }
        }}
      >
        <h2
          className="max-w-[26ch] font-serif text-balance"
          style={{ fontSize: "clamp(22px, 2.6vw, 30px)", lineHeight: 1.12, fontWeight: 400 }}
        >
          {titre}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Champ libelle="Votre prénom">
            <input
              name="name"
              required
              autoComplete="given-name"
              className={champClass}
              style={champStyle}
            />
          </Champ>
          <Champ libelle="Votre e-mail">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              className={champClass}
              style={champStyle}
            />
          </Champ>
          <Champ libelle="Nombre de magasins">
            <input
              name="orgType"
              type="number"
              min={1}
              max={999}
              required
              inputMode="numeric"
              className={champClass}
              style={champStyle}
            />
          </Champ>
        </div>
        <button
          type="submit"
          disabled={etat === "envoi"}
          className="btn-primary mt-6"
          style={{
            minHeight: 52,
            padding: "0 26px",
            fontSize: 15,
            opacity: etat === "envoi" ? 0.7 : 1,
            cursor: etat === "envoi" ? "wait" : "pointer",
          }}
        >
          {etat === "envoi" ? "Envoi en cours" : bouton}
        </button>
        {etat === "erreur" && (
          <p className="mt-3 text-[14px]" style={{ color: "var(--alerte-texte)" }}>
            L’envoi n’a pas abouti. Réessayez, ou écrivez à contact@getgranit.ai.
          </p>
        )}
        <p className="mt-4 text-[13px]" style={{ color: "var(--texte-secondaire)" }}>
          Vos coordonnées servent à vous envoyer ce mail et à vous recontacter au sujet de Granit.
          Rien d’autre.
        </p>
      </form>
    </Carte>
  );
}
