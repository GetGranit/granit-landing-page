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
import { useLanguage } from "@/lib/i18n";
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
export const Route = createFileRoute("/pec")({
  head: () => ({
    meta: [
      { title: "Votre prochaine PEC, sans la taper - Granit" },
      {
        name: "description",
        content:
          "Prenez en photo la carte de tiers payant : on trouve le bon portail et on prépare la demande de prise en charge.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PecPage,
});

const ESSAI_ON = espaceEssaiActif();
/** « apercu » | « paul » | « direct » : propriété `mode` de chaque événement. */
const MODE = modeSimulation();

type CaptureErreur = "image_illisible" | "pas_carte_tp" | "illisible";
type SearchRaison = "inconnu" | "lecture";
/** Le dernier envoi n'est pas parti : contact / « Me prévenir », ou création du compte. */
type EnvoiErreur = "envoi" | "compte";

const copy = {
  fr: {
    envoi: {
      envoi: "Ça n'est pas parti : la connexion a coupé. Réessayez dans un instant.",
      compte: "Votre compte n'a pas pu être créé : la connexion a coupé. Réessayez.",
    } satisfies Record<EnvoiErreur, string>,
    capture: {
      image_illisible:
        "Ce fichier ne s'ouvre pas. Reprenez la photo, ou importez une image (JPEG/PNG) ou un PDF.",
      pas_carte_tp:
        "Ce n'est pas une carte de tiers payant (carte Vitale ? ordonnance ?). Il nous faut la carte de la mutuelle.",
      illisible:
        "On n'arrive pas à lire la carte. Posez-la à plat sur le comptoir, sans reflet, et reprenez la photo.",
    } satisfies Record<CaptureErreur, string>,
    search: {
      inconnu:
        "On n'a pas reconnu la mutuelle sur la carte. Tapez son nom, on cherche parmi plus de 200 mutuelles.",
      lecture:
        "La photo n'a pas pu être lue. Tapez le nom de la mutuelle, ou reprenez la photo bien à plat.",
    } satisfies Record<SearchRaison, string>,
    inconnueTitre: "On vous trouve le bon portail.",
    inconnueIntro: (m?: string) => `Paul regarde « ${m} » et vous rappelle avec la réponse.`,
    demoTitre: (p: string) => `Paul vous la montre sur votre compte ${p}.`,
    demoIntro:
      "Il vous rappelle et fait la simulation avec vous, sur un de vos dossiers, en 15 minutes. Rien n'est envoyé à la mutuelle.",
    pourVous: (label: string) =>
      label ? `On fait vos PEC ${label} pour vous.` : "On fait vos PEC pour vous.",
    pourVousIntro: "Paul vous rappelle et vous le montre sur un de vos dossiers, en 15 minutes.",
    merciEssaiOff: "Votre espace arrive.",
    merciOxantis: "On vous prévient.",
    merciRappel: "Paul vous rappelle sous 24 h ouvrées.",
    texteEssaiOff:
      "Paul vous appelle sous 24 h ouvrées pour ouvrir votre espace et brancher votre portail avec vous.",
    texteOxantis: "Dès qu'on sait où passent les PEC Oxantis après le 26 octobre, on vous écrit.",
    texteRappel: "Vous pouvez aussi réserver un créneau tout de suite.",
  },
  en: {
    envoi: {
      envoi: "It did not go through: the connection dropped. Try again in a moment.",
      compte: "Your account could not be created: the connection dropped. Try again.",
    } satisfies Record<EnvoiErreur, string>,
    capture: {
      image_illisible:
        "This file does not open. Take the photo again, or upload an image (JPEG/PNG) or a PDF.",
      pas_carte_tp:
        "This is not a third-party payment card (Carte Vitale? prescription?). We need the insurer’s card.",
      illisible:
        "We cannot read the card. Lay it flat on the counter, without glare, and take the photo again.",
    } satisfies Record<CaptureErreur, string>,
    search: {
      inconnu:
        "We did not recognize the insurer on the card. Type its name, we search among more than 200 insurers.",
      lecture:
        "The photo could not be read. Type the insurer’s name, or take the photo again, nice and flat.",
    } satisfies Record<SearchRaison, string>,
    inconnueTitre: "We’ll find you the right portal.",
    inconnueIntro: (m?: string) => `Paul looks into “${m}” and calls you back with the answer.`,
    demoTitre: (p: string) => `Paul shows it to you on your ${p} account.`,
    demoIntro:
      "He calls you back and runs the simulation with you, on one of your cases, in 15 minutes. Nothing is sent to the insurer.",
    pourVous: (label: string) =>
      label
        ? `We submit your ${label} coverage requests for you.`
        : "We submit your coverage requests for you.",
    pourVousIntro: "Paul calls you back and shows you on one of your cases, in 15 minutes.",
    merciEssaiOff: "Your workspace is on its way.",
    merciOxantis: "We’ll let you know.",
    merciRappel: "Paul calls you back within 24 business hours.",
    texteEssaiOff:
      "Paul calls you within 24 business hours to open your workspace and connect your portal with you.",
    texteOxantis:
      "As soon as we know where Oxantis coverage requests go after Oct 26, we will write to you.",
    texteRappel: "You can also book a slot right away.",
  },
};
type Copy = (typeof copy)["fr"];
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
  | { s: "capture"; error?: CaptureErreur }
  | { s: "reading"; previewUrl?: string }
  | { s: "search"; reason?: SearchRaison }
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

function contactTexte(
  step: Extract<Step, { s: "contact" }>,
  t: Copy,
): { title: string; intro: string } {
  const label = step.platform?.label ?? "";
  if (step.kind === "mutuelle-inconnue")
    return { title: t.inconnueTitre, intro: t.inconnueIntro(step.mutuelle) };
  if (step.demo && step.platform)
    return { title: t.demoTitre(cible(step.platform).label), intro: t.demoIntro };
  return { title: t.pourVous(label), intro: t.pourVousIntro };
}

function PecPage() {
  const posthog = usePostHog();
  const t = copy[useLanguage().lang];
  const navigate = useNavigate();
  const router = useRouter();
  const read = useServerFn(readCard);
  const [step, setStep] = useState<Step>({ s: "capture" });
  const [card, setCard] = useState<CardRead | null>(null);
  const [source, setSource] = useState<"photo" | "exemple" | "saisie">("photo");
  const [busy, setBusy] = useState(false);
  /** Le dernier envoi (contact, compte, « Me prévenir ») n'est pas parti. */
  const [erreur, setErreur] = useState<EnvoiErreur>();
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
        return go({ s: "search", reason: "inconnu" }, { replace });
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

  function refuser(raison: CaptureErreur) {
    track("pec_carte_refusee", { raison });
    go({ s: "capture", error: raison }, { replace: true });
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
      return refuser("image_illisible");
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
      return go({ s: "search", reason: "lecture" }, { replace: true });
    }
    if (!r.card.est_carte_tp) return refuser("pas_carte_tp");
    if (!r.card.lisible) return refuser("illisible");
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
      setErreur("envoi");
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
      setErreur("compte");
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
          error={step.error && t.capture[step.error]}
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
          reason={step.reason && t.search[step.reason]}
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
          compteError={erreur && t.envoi[erreur]}
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
            error={erreur && t.envoi[erreur]}
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
          error={erreur && t.envoi[erreur]}
          {...contactTexte(step, t)}
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
              ? t.merciEssaiOff
              : step.kind === "oxantis"
                ? t.merciOxantis
                : t.merciRappel
          }
          creneau={step.kind !== "oxantis"}
          onCal={() => track("pec_cal_clic", { ecran: "merci", kind: step.kind })}
          onRestart={() => go({ s: "capture" })}
        >
          <Muted>
            {step.kind === "essai-off"
              ? t.texteEssaiOff
              : step.kind === "oxantis"
                ? t.texteOxantis
                : t.texteRappel}
          </Muted>
        </StepThanks>
      )}
    </PecShell>
  );
}
