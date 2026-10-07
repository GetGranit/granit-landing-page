import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { usePostHog } from "posthog-js/react";

import { StepCapture } from "@/components/pec/StepCapture";
import { StepContact, StepThanks } from "@/components/pec/StepContact";
import { StepReading } from "@/components/pec/StepReading";
import { ResultChoice, ResultPortal, ResultSimulable } from "@/components/pec/StepResult";
import { SimFlow } from "@/components/pec/SimFlow";
import type { SimResultat } from "@/components/pec/StepSimFin";
import { StepSearch } from "@/components/pec/StepSearch";
import { Muted, PecShell } from "@/components/pec/ui";
import { compressImage } from "@/lib/pec/image";
import { sendPecLead, type PecLeadKind } from "@/lib/pec/lead";
import { readCard, type CardRead } from "@/lib/pec/readCard";
import { simulationEnDirect, simulationProposee } from "@/lib/pec/simulation";
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
 * sans rien envoyer (Viamédis, Kalixia, Génération, EMOA), on simule la PEC en
 * direct sur le compte de l'opticien, puis l'e-mail ouvre l'espace d'essai ;
 * ailleurs on donne le lien du portail et on propose Paul.
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

const ESSAI_ON =
  import.meta.env.DEV || import.meta.env.VITE_PEC_ESSAI === "on" || simulationProposee();
/** Identité fictive de la carte d'exemple (NIR inventé, clé valide). */
const EXAMPLE_PATIENT = { nir: "285057800608441", dateNaissance: "12/05/1985" };
const CASE_KEY = "granit.pec.case";

type Step =
  | { s: "capture"; error?: string }
  | { s: "reading"; previewUrl?: string }
  | { s: "search"; reason?: string }
  | { s: "result"; res: Resolution }
  | { s: "sim"; platform: Platform }
  | { s: "contact"; kind: PecLeadKind; platform?: Platform; mutuelle?: string }
  | { s: "thanks"; kind: PecLeadKind | "essai-off" };

function PecPage() {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const read = useServerFn(readCard);
  const [step, setStep] = useState<Step>({ s: "capture" });
  const [card, setCard] = useState<CardRead | null>(null);
  const [source, setSource] = useState<"photo" | "exemple" | "saisie">("photo");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState<string>();
  const pending = useRef<Resolution | null>(null);
  const [readDone, setReadDone] = useState(false);
  const [simN, setSimN] = useState(4);
  const ref =
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("p");

  const track = useCallback(
    (e: string, p?: Record<string, unknown>) => posthog?.capture(e, { ...p, ref }),
    [posthog, ref],
  );
  useEffect(() => {
    track("pec_page_vue");
  }, [track]);

  const showResolution = useCallback(
    (res: Resolution) => {
      if (res.kind === "inconnu") {
        track("pec_inconnu", { source });
        return setStep({
          s: "search",
          reason:
            "On n'a pas reconnu la mutuelle sur la carte. Tapez son nom, on cherche dans nos 240 mutuelles.",
        });
      }
      if (res.kind === "plusieurs")
        track("pec_ambigu", { platforms: res.platforms.map((p) => p.id) });
      else
        track("pec_plateforme_trouvee", {
          platform: res.platform.id,
          simulable: res.platform.simulable,
          source,
        });
      setStep({ s: "result", res });
    },
    [source, track],
  );

  async function onFile(file: File) {
    setSource("photo");
    setReadDone(false);
    pending.current = null;
    let payload: Awaited<ReturnType<typeof compressImage>>;
    try {
      payload = await compressImage(file);
    } catch {
      return setStep({
        s: "capture",
        error: "Cette image ne s'ouvre pas. Reprenez la photo, ou importez-la en JPEG.",
      });
    }
    setStep({ s: "reading", previewUrl: payload.previewUrl });
    track("pec_photo_envoyee");
    const r = await read({ data: { image: payload.image, mediaType: payload.mediaType } }).catch(
      () => ({ ok: false as const, reason: "erreur_lecture" }),
    );
    if (!r.ok) {
      track("pec_lecture_echec", { reason: r.reason });
      return setStep({
        s: "search",
        reason:
          "La photo n'a pas pu être lue. Tapez le nom de la mutuelle, ou reprenez la photo bien à plat.",
      });
    }
    if (!r.card.est_carte_tp)
      return setStep({
        s: "capture",
        error:
          "Ce n'est pas une carte de tiers payant (carte Vitale ? ordonnance ?). Il nous faut la carte de la mutuelle.",
      });
    if (!r.card.lisible)
      return setStep({
        s: "capture",
        error:
          "On n'arrive pas à lire la carte. Posez-la à plat sur le comptoir, sans reflet, et reprenez la photo.",
      });
    setCard(r.card);
    pending.current = resolveCard(r.card);
    setReadDone(true);
  }

  function onExample() {
    setSource("exemple");
    setCard(EXAMPLE_CARD);
    track("pec_carte_exemple");
    pending.current = resolveCard(EXAMPLE_CARD);
    setReadDone(true);
    setStep({ s: "reading" });
  }

  async function lead(
    kind: PecLeadKind,
    v: { email: string; phone?: string; prenom?: string },
    platform?: Platform,
    mutuelle?: string,
  ) {
    setBusy(true);
    try {
      await sendPecLead({
        kind,
        ...v,
        platform: platform?.id ?? null,
        mutuelle: mutuelle ?? null,
        ref,
      });
      track("pec_contact", { kind, platform: platform?.id });
      return true;
    } catch {
      return false;
    } finally {
      setBusy(false);
    }
  }

  /** Fin de simulation : l'e-mail crée le compte en coulisse. Rien du patient ni du portail (identifiants) ne part. */
  async function onSimEmail(p: Platform, mail: string, r: SimResultat) {
    setEmail(mail);
    track("pec_vers_freemium", { platform: p.id, source });
    await lead("essai", { email: mail }, p);
    const portail = platformById(p.reseau_via ?? p.id) ?? p;
    try {
      sessionStorage.setItem(
        CASE_KEY,
        JSON.stringify({
          source,
          email: mail,
          mutuelle: card?.assureur ?? null,
          amc: card?.amc ?? null,
          reseau: card?.reseau ?? null,
          platform: {
            id: portail.id,
            label: portail.label,
            url: portail.url,
            simulable: portail.simulable,
            tfa: portail.tfa,
          },
          portailConnecte: true,
          simulation: {
            total: r.total,
            partSecu: r.partSecu,
            partMutuelle: r.partMutuelle,
            resteACharge: r.resteACharge,
            dureeSec: r.dureeSec,
            ...(r.captureUrl ? { captureUrl: r.captureUrl } : {}),
            ...(r.numero ? { numero: r.numero } : {}),
            apercu: !simulationEnDirect(),
          },
        }),
      );
    } catch {
      /* stockage bloqué : l'essai repartira sur un cas d'exemple */
    }
    if (ESSAI_ON) navigate({ to: "/essai" });
    else setStep({ s: "thanks", kind: "essai-off" });
  }

  const total = 8;
  const n =
    step.s === "sim"
      ? simN
      : { capture: 1, reading: 2, search: 2, result: 3, contact: 6, thanks: 8 }[step.s];

  return (
    <PecShell step={n} total={total}>
      {step.s === "capture" && (
        <StepCapture
          key="c"
          error={step.error}
          onFile={onFile}
          onExample={onExample}
          onType={() => {
            setSource("saisie");
            track("pec_saisie_mutuelle");
            setStep({ s: "search" });
          }}
        />
      )}
      {step.s === "reading" && (
        <StepReading
          key="r"
          previewUrl={step.previewUrl}
          done={readDone}
          onFinished={() => pending.current && showResolution(pending.current)}
        />
      )}
      {step.s === "search" && (
        <StepSearch
          key="s"
          reason={step.reason}
          onBack={() => setStep({ s: "capture" })}
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
          onNotFound={(q) => setStep({ s: "contact", kind: "mutuelle-inconnue", mutuelle: q })}
        />
      )}
      {step.s === "result" && step.res.kind === "plusieurs" && (
        <ResultChoice
          key="ch"
          platforms={step.res.platforms}
          onPick={(p) => showResolution({ kind: "unique", platform: p })}
          onType={() => setStep({ s: "search" })}
        />
      )}
      {step.s === "result" && step.res.kind === "unique" && step.res.platform.simulable && (
        <ResultSimulable
          key="rs"
          card={card}
          p={step.res.platform}
          example={source === "exemple"}
          proposee={simulationProposee()}
          onSimulate={() =>
            step.res.kind === "unique" && setStep({ s: "sim", platform: step.res.platform })
          }
          onPaul={() =>
            step.res.kind === "unique" &&
            setStep({ s: "contact", kind: "rappel", platform: step.res.platform })
          }
        />
      )}
      {step.s === "sim" && (
        <SimFlow
          key="sim"
          platformId={step.platform.reseau_via ?? step.platform.id}
          portail={
            platformById(step.platform.reseau_via ?? step.platform.id)?.label ?? step.platform.label
          }
          busy={busy}
          track={track}
          // Carte d'exemple : identité fictive imprimée sur la carte dessinée. Pour une vraie
          // photo, le pré-remplissage viendra de l'OCR d'identité côté infra Granit (TODO(CTO)).
          prefill={source === "exemple" ? EXAMPLE_PATIENT : undefined}
          onProgress={setSimN}
          onBack={() => setStep({ s: "result", res: { kind: "unique", platform: step.platform } })}
          onEmail={(m, r) => void onSimEmail(step.platform, m, r)}
        />
      )}
      {step.s === "result" && step.res.kind === "unique" && !step.res.platform.simulable && (
        <ResultPortal
          key="rp"
          card={card}
          p={step.res.platform}
          onContact={() =>
            step.res.kind === "unique" &&
            setStep({ s: "contact", kind: "rappel", platform: step.res.platform })
          }
        />
      )}
      {step.s === "contact" && (
        <StepContact
          key="ct"
          email={email}
          busy={busy}
          title={
            step.kind === "mutuelle-inconnue"
              ? "On vous trouve le bon portail."
              : `On fait vos PEC ${step.platform?.label ?? ""} pour vous.`
          }
          intro={
            step.kind === "mutuelle-inconnue"
              ? `Paul regarde « ${step.mutuelle} » et vous rappelle avec la réponse.`
              : "Paul vous rappelle et vous le montre sur un de vos dossiers, en 15 minutes."
          }
          onBack={() => setStep({ s: "capture" })}
          onSubmit={async (v) => {
            const ok = await lead(step.kind, v, step.platform, step.mutuelle);
            setStep(
              ok
                ? { s: "thanks", kind: step.kind }
                : {
                    s: "contact",
                    kind: step.kind,
                    platform: step.platform,
                    mutuelle: step.mutuelle,
                  },
            );
          }}
        />
      )}
      {step.s === "thanks" && (
        <StepThanks
          key="t"
          title={
            step.kind === "essai-off" ? "Votre PEC vous attend." : "Paul vous rappelle aujourd'hui."
          }
        >
          <Muted>
            {step.kind === "essai-off"
              ? "On ouvre votre espace d'essai et Paul vous appelle pour brancher votre portail avec vous, en 5 minutes."
              : "Entre 9h et 19h. Vous pouvez aussi réserver un créneau tout de suite."}
          </Muted>
        </StepThanks>
      )}
    </PecShell>
  );
}
