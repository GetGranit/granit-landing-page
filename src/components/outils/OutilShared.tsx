import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { usePostHog } from "posthog-js/react";

import { getAttribution } from "@/lib/attribution";
import { envoyerMailOutil, type CorpsMailOutil } from "@/lib/outils/envoyerMailOutil";
import { lienRdv } from "@/lib/outils/mailOutils";
import { nettoyerRequete } from "@/lib/outils/socle/recherche";
import { EVENEMENTS } from "@/lib/outils/socle/suivi";
import {
  logDemoRequestDelivered,
  logDemoRequestDeliveryFailed,
  type DemoFormLocation,
} from "@/lib/posthogLogs";
import { submitDemo } from "@/lib/submitDemo";

/**
 * Ce que partagent les deux outils gratuits de campagne (/outils/tri-des-marques et
 * /outils/heures-de-decembre) : le suivi PostHog, l'en-tête, le bloc de
 * résultat et le formulaire qui livre le lead (B11 puis mail de secours) et
 * envoie son mail à l'opticien. Les trois outils référentiels (codes-rejet,
 * remboursement, mutuelle-portail) prennent ici le suivi et l'en-tête ; le reste
 * de leurs composants est dans src/components/outils/socle/.
 *
 * Suivi PostHog, le même tunnel pour les deux outils de campagne (propriété `outil`) :
 *   lm_page_vue → lm_outil_commence → lm_resultat_vu → lm_formulaire_envoye
 * plus lm_pont_rempli (tri des marques), lm_mail_envoye et lm_rdv_clic.
 * Les outils référentiels ajoutent le catalogue de src/lib/outils/socle/suivi.ts.
 * Les utm_* du lien d'arrivée sont déjà attachées à chaque événement par
 * __root.tsx (posthog.register) : pas besoin de les repasser ici.
 */
export type Outil =
  "tri-des-marques" | "heures-de-decembre" | "codes-rejet" | "remboursement" | "mutuelle-portail";

/** Où l'on est dans un outil référentiel ; fusionné dans chaque événement. */
export type ContexteSuivi = {
  page?: "hub" | "entree" | "index" | "introuvable";
  entree?: string;
  groupe?: string;
};

/** Ce que mesure lm_recherche, en plus de la requête nettoyée. */
export type MesureRecherche = {
  visibles: number;
  exact: boolean;
  filtres: Record<string, string | null>;
};

/** lm_recherche part 800 ms après la dernière frappe (ou tout de suite pour un ?q= à l'arrivée). */
const DELAI_RECHERCHE = 800;

/**
 * Sans `contexte` (les deux outils de campagne) : les mêmes événements et les mêmes propriétés
 * qu'avant le socle. Avec `contexte`, ses valeurs sont ajoutées à chaque événement ; les effets
 * dépendent de ces valeurs, pas de l'objet : lm_page_vue ne repart que si la page change (navigation
 * d'une entrée à sa voisine).
 */
export function useSuiviOutil(outil: Outil, contexte: ContexteSuivi = {}) {
  const posthog = usePostHog();
  const dejaCommence = useRef(false);
  const dejaVu = useRef(false);
  const resultat = useRef<HTMLDivElement | null>(null);
  const derniereRecherche = useRef("");
  const minuterie = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { page, entree, groupe } = contexte;

  const suivre = useCallback(
    (evenement: string, proprietes: Record<string, unknown> = {}) =>
      posthog?.capture(evenement, {
        outil,
        ...(page !== undefined && { page }),
        ...(entree !== undefined && { entree }),
        ...(groupe !== undefined && { groupe }),
        ...proprietes,
      }),
    [posthog, outil, page, entree, groupe],
  );

  // Nouvelle page dans le même composant (entrée → entrée voisine) : le tunnel repart de zéro.
  // Déclaré avant lm_page_vue pour passer avant lui ; sans contexte, il ne fait jamais rien.
  const premiereFois = useRef(true);
  useEffect(() => {
    if (premiereFois.current) {
      premiereFois.current = false;
      return;
    }
    dejaCommence.current = false;
    dejaVu.current = false;
    derniereRecherche.current = "";
  }, [page, entree, groupe]);

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

  useEffect(() => () => clearTimeout(minuterie.current), []);

  /**
   * À appeler à chaque frappe dans la recherche d'un hub (et une fois avec origine « url » quand la
   * page arrive avec ?q=). La première frappe envoie lm_outil_commence ; lm_recherche part 800 ms
   * après la dernière, si la requête nettoyée a 2 caractères ou plus et diffère du dernier envoi.
   */
  const rechercher = useCallback(
    (q: string, r: MesureRecherche, origine: "saisie" | "url" = "saisie") => {
      if (origine === "saisie") commence();
      clearTimeout(minuterie.current);
      const envoyer = () => {
        const propre = nettoyerRequete(q);
        if (propre.length < 2 || propre === derniereRecherche.current) return;
        derniereRecherche.current = propre;
        suivre(EVENEMENTS.recherche, {
          q: propre,
          longueur: q.replace(/\s+/g, " ").trim().length,
          nb_resultats: r.visibles,
          exact: r.exact,
          metier: r.filtres.metier ?? null,
          origine,
        });
      };
      if (origine === "url") envoyer();
      else minuterie.current = setTimeout(envoyer, DELAI_RECHERCHE);
    },
    [commence, suivre],
  );

  return { suivre, commence, resultat, rechercher };
}

/** Ce que renvoie useSuiviOutil : à passer tel quel à useRechercheHub. */
export type SuiviOutil = ReturnType<typeof useSuiviOutil>;

/**
 * Bandeau d'ouverture : le dégradé de marque en grand fond (DESIGN.md), titre en deux temps.
 * Sans les props facultatives : le rendu des deux outils de campagne, à l'identique.
 * `compact` (hubs des outils référentiels) : H1 plus petit et moins d'air, pour qu'à 375 px le champ
 * de recherche, passé en `children` sous le chapeau, soit visible sans défiler.
 */
export function EnTeteOutil({
  titre,
  accent,
  chapeau,
  surTitre = "Outil gratuit pour les opticiens",
  compact = false,
  children,
}: {
  titre: string;
  accent: string;
  chapeau: string;
  surTitre?: string;
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <header style={{ background: "var(--degrade-marque)" }}>
      <div
        className={
          compact
            ? "mx-auto max-w-[1120px] px-4 py-10 md:px-8 md:py-14"
            : "mx-auto max-w-[1120px] px-4 py-12 md:px-8 md:py-20"
        }
      >
        <p className="eyebrow">{surTitre}</p>
        <h1
          className={`${compact ? "mt-3 max-w-[22ch]" : "mt-4 max-w-[18ch]"} font-serif text-balance`}
          style={{
            fontSize: compact ? "clamp(30px, 4.4vw, 52px)" : "clamp(36px, 5.4vw, 64px)",
            lineHeight: compact ? 1.06 : 1.04,
            letterSpacing: "-0.03em",
            fontWeight: 300,
          }}
        >
          {titre} <span className="accent-italic">{accent}</span>
        </h1>
        <p
          className={`${compact ? "mt-4" : "mt-5"} max-w-[56ch] text-[17px]`}
          style={{ lineHeight: 1.55 }}
        >
          {chapeau}
        </p>
        {children && <div className="mt-6 max-w-[720px]">{children}</div>}
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
