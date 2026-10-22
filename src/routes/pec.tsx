import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { usePostHog } from "posthog-js/react";

import { StepCapture } from "@/components/pec/StepCapture";
import { StepContact, StepThanks } from "@/components/pec/StepContact";
import { StepReading } from "@/components/pec/StepReading";
import { ResultChoice, ResultEstimation, ResultSimulable } from "@/components/pec/StepResult";
import { ecrireCas } from "@/components/pec/cas";
import { SimFlow } from "@/components/pec/SimFlow";
import type { SimResultat } from "@/components/pec/StepSimFin";
import type { PatientPrefill } from "@/components/pec/StepPatient";
import { StepSearch } from "@/components/pec/StepSearch";
import { Muted, PecShell } from "@/components/pec/ui";
import { prepareCardFile } from "@/lib/pec/image";
import { sendPecLead, type PecLeadKind } from "@/lib/pec/lead";
import { readCard, type CardRead } from "@/lib/pec/readCard";
import {
  espaceEssaiActif,
  modeSimulation,
  simulationEnDirect,
  simulationProposee,
} from "@/lib/pec/simulation";
import {
  EXAMPLE_CARD,
  platformById,
  resolveCard,
  resolveIds,
  type Platform,
  type Resolution,
} from "@/lib/pec/resolve";

/**
 * Lead magnet « votre prochaine PEC, sans la taper » : photo de la carte de
 * tiers payant → portail trouvé. Sur les 4 portails où Granit sait simuler
 * sans rien envoyer (Viamédis, Kalixia, Génération, EMOA), tant que la vraie
 * simulation n'existe pas, un visiteur est orienté vers Paul (« Paul vous la
 * montre sur votre compte ») ; la simulation factice puis le compte et l'espace
 * ne s'ouvrent qu'en DEV ou en aperçu (VITE_PEC_APERCU=on, démos de Paul).
 * Ailleurs on donne le lien du portail et on propose Paul.
 *
 * Chaque écran est une entrée d'historique : le bouton Retour du téléphone
 * remonte d'une étape au lieu de quitter /pec.
 */
/** Même <head> pour /pec et /lead-magnet-pec (deux URLs, une seule page). */
export const pecHead = () => ({
  meta: [
    { title: "Votre prochaine PEC, sans la taper - Granit" },
    {
      name: "description",
      content:
        "Prenez en photo la carte de tiers payant : on trouve le bon portail et on prépare la demande de prise en charge.",
    },
    { name: "robots", content: "noindex" },
  ],
});

export const Route = createFileRoute("/pec")({
  head: pecHead,
  component: PecPage,
});

const ESSAI_ON = espaceEssaiActif();
/** « apercu » | « paul » | « direct » : propriété `mode` de chaque événement. */
const MODE = modeSimulation();
const ECHEC_ENVOI = "Ça n'est pas parti : la connexion a coupé. Réessayez dans un instant.";
/** Identité fictive de la carte d'exemple (NIR inventé, clé valide). */
const EXAMPLE_PATIENT = { nir: "285057800608441", dateNaissance: "12/05/1985" };

/** Identité lue sur la carte (champs facultatifs, absents des anciennes lectures). */
type CardIdentite = CardRead & { nir?: string | null; date_naissance?: string | null };

function prefillOcr(card: CardIdentite | null): PatientPrefill | undefined {
  const nir = card?.nir?.trim() || undefined;
  const dateNaissance = card?.date_naissance?.trim() || undefined;
  return nir || dateNaissance ? { nir, dateNaissance } : undefined;
}

type Step =
  | { s: "capture"; error?: string }
  | { s: "reading"; previewUrl?: string }
  | { s: "search"; reason?: string }
  | { s: "result"; res: Resolution }
  | { s: "sim"; platform: Platform }
  | {
      s: "contact";
      kind: PecLeadKind;
      platform?: Platform;
      mutuelle?: string;
      /** Portail simulable sans simulation proposée : Paul la montre sur le compte. */
      demo?: boolean;
    }
  | { s: "thanks"; kind: PecLeadKind | "essai-off" };

const cible = (p: Platform) => platformById(p.reseau_via ?? p.id) ?? p;

function contactTexte(step: Extract<Step, { s: "contact" }>): { title: string; intro: string } {
  const label = step.platform?.label ?? "";
  if (step.kind === "mutuelle-inconnue")
    return {
      title: "On vous trouve le bon portail.",
      intro: `Paul regarde « ${step.mutuelle} » et vous rappelle avec la réponse.`,
    };
  if (step.demo && step.platform)
    return {
      title: `Paul vous la montre sur votre compte ${cible(step.platform).label}.`,
      intro:
        "Il vous rappelle et fait la simulation avec vous, sur un de vos dossiers, en 15 minutes. Rien n'est envoyé à la mutuelle.",
    };
  return {
    title: label ? `On fait vos PEC ${label} pour vous.` : "On fait vos PEC pour vous.",
    intro: "Paul vous rappelle et vous le montre sur un de vos dossiers, en 15 minutes.",
  };
}

export function PecPage() {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const router = useRouter();
  const read = useServerFn(readCard);
  const [step, setStep] = useState<Step>({ s: "capture" });
  const [card, setCard] = useState<CardRead | null>(null);
  const [source, setSource] = useState<"photo" | "exemple" | "saisie">("photo");
  const [busy, setBusy] = useState(false);
  /** Le dernier envoi (contact, compte, « Me prévenir ») n'est pas parti. */
  const [erreur, setErreur] = useState<string>();
  const [email, setEmail] = useState<string>();
  const pending = useRef<Resolution | null>(null);
  /** Numéro de la lecture de photo en cours : une lecture dépassée (exemple, retour) est ignorée. */
  const lecture = useRef(0);
  const [readDone, setReadDone] = useState(false);
  const [simN, setSimN] = useState(4);
  const ref =
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("p");

  const track = useCallback(
    (e: string, p?: Record<string, unknown>) => posthog?.capture(e, { ...p, ref, mode: MODE }),
    [posthog, ref],
  );
  useEffect(() => {
    if (ref) posthog?.register({ ref });
    track("pec_page_vue");
  }, [posthog, ref, track]);

  /* ── Historique : une entrée par écran ── */
  const pile = useRef<Step[]>([{ s: "capture" }]);
  const pos = useRef(0);
  const ici = () => `${window.location.pathname}${window.location.search}`;

  const go = useCallback(
    (next: Step, opts?: { replace?: boolean }) => {
      setErreur(undefined);
      if (opts?.replace) pile.current[pos.current] = next;
      else {
        pile.current = pile.current.slice(0, pos.current + 1);
        pile.current.push(next);
        pos.current += 1;
        router.history.push(ici(), { pecEtape: pos.current });
      }
      setStep(next);
    },
    [router],
  );

  useEffect(() => {
    router.history.replace(ici(), { pecEtape: 0 });
    return router.history.subscribe(({ location }) => {
      const i = (location.state as { pecEtape?: unknown }).pecEtape;
      if (typeof i !== "number" || i === pos.current) return;
      lecture.current += 1;
      pos.current = i;
      pile.current[i] ??= { s: "capture" };
      setErreur(undefined);
      setBusy(false);
      setStep(pile.current[i]);
    });
  }, [router]);

  const back = useCallback(() => {
    if (pos.current > 0) router.history.back();
    else go({ s: "capture" }, { replace: true });
  }, [go, router]);

  useEffect(() => {
    if (step.s === "contact") track("pec_contact_vu", { kind: step.kind });
  }, [step, track]);

  const showResolution = useCallback(
    (res: Resolution, replace?: boolean) => {
      if (res.kind === "inconnu") {
        track("pec_inconnu", { source });
        return go(
          {
            s: "search",
            reason:
              "On n'a pas reconnu la mutuelle sur la carte. Tapez son nom, on cherche parmi plus de 200 mutuelles.",
          },
          { replace },
        );
      }
      if (res.kind === "plusieurs")
        track("pec_ambigu", { platforms: res.platforms.map((p) => p.id) });
      else
        track("pec_plateforme_trouvee", {
          platform: res.platform.id,
          simulable: res.platform.simulable,
          source,
        });
      go({ s: "result", res }, { replace });
    },
    [go, source, track],
  );

  const onLectureFinie = useCallback(() => {
    if (pending.current) showResolution(pending.current, true);
  }, [showResolution]);

  const onRecherche = useCallback(
    (requete: string, n: number) => track("pec_recherche", { requete, n_resultats: n }),
    [track],
  );

  function refuser(raison: string, error: string) {
    track("pec_carte_refusee", { raison });
    go({ s: "capture", error }, { replace: true });
  }

  async function onFile(file: File) {
    const id = ++lecture.current;
    setSource("photo");
    setReadDone(false);
    pending.current = null;
    let payload: Awaited<ReturnType<typeof prepareCardFile>>;
    try {
      payload = await prepareCardFile(file);
    } catch {
      if (id !== lecture.current) return;
      return refuser(
        "image_illisible",
        "Ce fichier ne s'ouvre pas. Reprenez la photo, ou importez une image (JPEG/PNG) ou un PDF.",
      );
    }
    if (id !== lecture.current) return;
    go({ s: "reading", previewUrl: payload.previewUrl });
    track("pec_photo_envoyee");
    const r = await read({ data: { image: payload.image, mediaType: payload.mediaType } }).catch(
      () => ({ ok: false as const, reason: "erreur_lecture" }),
    );
    // Entre-temps : carte d'exemple, saisie ou retour arrière → cette lecture ne compte plus.
    if (id !== lecture.current) return;
    if (!r.ok) {
      track("pec_lecture_echec", { reason: r.reason });
      return go(
        {
          s: "search",
          reason:
            "La photo n'a pas pu être lue. Tapez le nom de la mutuelle, ou reprenez la photo bien à plat.",
        },
        { replace: true },
      );
    }
    if (!r.card.est_carte_tp)
      return refuser(
        "pas_carte_tp",
        "Ce n'est pas une carte de tiers payant (carte Vitale ? ordonnance ?). Il nous faut la carte de la mutuelle.",
      );
    if (!r.card.lisible)
      return refuser(
        "illisible",
        "On n'arrive pas à lire la carte. Posez-la à plat sur le comptoir, sans reflet, et reprenez la photo.",
      );
    setCard(r.card);
    pending.current = resolveCard(r.card);
    setReadDone(true);
  }

  function onExample() {
    lecture.current += 1;
    setSource("exemple");
    setCard(EXAMPLE_CARD);
    track("pec_carte_exemple");
    pending.current = resolveCard(EXAMPLE_CARD);
    setReadDone(true);
    go({ s: "reading" });
  }

  async function lead(
    kind: PecLeadKind,
    v: { email: string; phone?: string; prenom?: string },
    platform?: Platform,
    mutuelle?: string,
  ) {
    setBusy(true);
    setErreur(undefined);
    try {
      await sendPecLead({
        kind,
        ...v,
        platform: platform?.id ?? null,
        mutuelle: mutuelle ?? null,
        ref,
      });
      posthog?.identify(v.email.trim());
      track("pec_contact", { kind, platform: platform?.id });
      return true;
    } catch {
      track("pec_contact_echec", { kind, platform: platform?.id });
      setErreur(ECHEC_ENVOI);
      return false;
    } finally {
      setBusy(false);
    }
  }

  /**
   * Compte créé à la fin de la simulation : seul l'e-mail part (lead B11), le
   * mot de passe n'a pas quitté l'écran. Rien du patient ni du portail
   * (identifiants) n'est envoyé ni stocké. Si l'envoi échoue, on reste sur
   * l'écran du compte avec l'erreur. TODO(CTO) : création de compte réelle.
   */
  async function onSimCompte(p: Platform, mail: string, r: SimResultat) {
    setEmail(mail);
    setBusy(true);
    setErreur(undefined);
    // « Votre espace se prépare… » au moins 0,9 s, le temps que le lead parte vraiment.
    const attente = new Promise((ok) => setTimeout(ok, 900));
    const parti = await sendPecLead({ kind: "essai", email: mail, platform: p.id, ref }).then(
      () => true,
      () => false,
    );
    await attente;
    if (!parti) {
      track("pec_contact_echec", { kind: "essai", platform: p.id });
      setBusy(false);
      setErreur("Votre compte n'a pas pu être créé : la connexion a coupé. Réessayez.");
      return;
    }
    posthog?.identify(mail);
    track("pec_contact", { kind: "essai", platform: p.id });
    const portail = cible(p);
    ecrireCas({ source, email: mail, card, portail, r, apercu: !simulationEnDirect() });
    // Test de bout en bout avec le prototype de l'app : on y part avec le seul portail
    // (jamais l'e-mail ni le n° de sécu dans l'adresse).
    const app = import.meta.env.VITE_PEC_APP_URL;
    if (app) {
      window.location.assign(
        `${String(app).replace(/\/$/, "")}/parcours-plg/accueil?depuis=lead-magnet&portail=${encodeURIComponent(portail.id)}`,
      );
      return;
    }
    if (ESSAI_ON) return navigate({ href: "/essai?etape=acces" });
    setBusy(false);
    go({ s: "thanks", kind: "essai-off" }, { replace: true });
  }

  const total = 8;
  const n =
    step.s === "sim"
      ? simN
      : { capture: 1, reading: 2, search: 2, result: 3, contact: 6, thanks: 8 }[step.s];
  const photo = source === "photo";

  return (
    <PecShell step={n} total={total}>
      {step.s === "capture" && (
        <StepCapture
          key="c"
          error={step.error}
          onFile={onFile}
          onExample={onExample}
          onType={() => {
            lecture.current += 1;
            setSource("saisie");
            track("pec_saisie_mutuelle");
            go({ s: "search" });
          }}
        />
      )}
      {step.s === "reading" && (
        <StepReading
          key="r"
          previewUrl={step.previewUrl}
          done={readDone}
          onFinished={onLectureFinie}
        />
      )}
      {step.s === "search" && (
        <StepSearch
          key="s"
          reason={step.reason}
          onBack={back}
          onRecherche={onRecherche}
          onPick={(nom, ids) => {
            setCard({
              est_carte_tp: true,
              lisible: true,
              assureur: nom,
              gestionnaire: null,
              reseau: null,
              tp_optique: null,
              amc: null,
              fin_droits: null,
            });
            showResolution(resolveIds(ids));
          }}
          onNotFound={(q) => go({ s: "contact", kind: "mutuelle-inconnue", mutuelle: q })}
        />
      )}
      {step.s === "result" && step.res.kind === "plusieurs" && (
        <ResultChoice
          key="ch"
          platforms={step.res.platforms}
          onPick={(p) => showResolution({ kind: "unique", platform: p })}
          onType={() => go({ s: "search" })}
          onBack={back}
        />
      )}
      {step.s === "result" &&
        step.res.kind === "unique" &&
        step.res.platform.simulable &&
        simulationProposee() && (
        <ResultSimulable
          key="rs"
          card={card}
          p={step.res.platform}
          example={source === "exemple"}
          photo={photo}
          proposee={simulationProposee()}
          onBack={back}
          onSimulate={() => {
            if (step.res.kind !== "unique") return;
            track("pec_simuler_clic", { platform: step.res.platform.id });
            go({ s: "sim", platform: step.res.platform });
          }}
          onPaul={() => {
            if (step.res.kind !== "unique") return;
            track("pec_paul_montre_clic", { platform: step.res.platform.id });
            go({ s: "contact", kind: "rappel", platform: step.res.platform, demo: true });
          }}
        />
      )}
      {step.s === "sim" && (
        <SimFlow
          key="sim"
          platformId={cible(step.platform).id}
          portail={cible(step.platform).label}
          busy={busy}
          compteError={erreur}
          track={track}
          // Carte d'exemple : identité fictive imprimée sur la carte dessinée. Vraie photo :
          // n° de sécu et date de naissance lus par l'OCR, s'ils y sont.
          prefill={source === "exemple" ? EXAMPLE_PATIENT : prefillOcr(card)}
          onProgress={setSimN}
          onBack={back}
          onCompte={(m, r) => void onSimCompte(step.platform, m, r)}
        />
      )}
      {step.s === "result" &&
        step.res.kind === "unique" &&
        !(step.res.platform.simulable && simulationProposee()) && (
        <ResultEstimation
          key="rp"
          card={card}
          p={step.res.platform}
          photo={photo}
          busy={busy}
          error={erreur}
          onBack={back}
          onRdv={() =>
            step.res.kind === "unique" &&
            track("pec_rdv_clic", { platform: step.res.platform.id })
          }
          onPrevenir={async (mail) => {
            if (step.res.kind !== "unique") return;
            if (await lead("oxantis", { email: mail }, step.res.platform))
              go({ s: "thanks", kind: "oxantis" });
          }}
        />
      )}
      {step.s === "contact" && (
        <StepContact
          key="ct"
          email={email}
          busy={busy}
          error={erreur}
          {...contactTexte(step)}
          onBack={back}
          onCal={() => track("pec_cal_clic", { ecran: "contact", kind: step.kind })}
          onSubmit={async (v) => {
            if (await lead(step.kind, v, step.platform, step.mutuelle))
              go({ s: "thanks", kind: step.kind }, { replace: true });
          }}
        />
      )}
      {step.s === "thanks" && (
        <StepThanks
          key="t"
          title={
            step.kind === "essai-off"
              ? "Votre espace arrive."
              : step.kind === "oxantis"
                ? "On vous prévient."
                : "Paul vous rappelle sous 24 h ouvrées."
          }
          creneau={step.kind !== "oxantis"}
          onCal={() => track("pec_cal_clic", { ecran: "merci", kind: step.kind })}
          onRestart={() => go({ s: "capture" })}
        >
          <Muted>
            {step.kind === "essai-off"
              ? "Paul vous appelle sous 24 h ouvrées pour ouvrir votre espace et brancher votre portail avec vous."
              : step.kind === "oxantis"
                ? "Dès qu'on sait où passent les PEC Oxantis après le 26 octobre, on vous écrit."
                : "Vous pouvez aussi réserver un créneau tout de suite."}
          </Muted>
        </StepThanks>
      )}
    </PecShell>
  );
}
