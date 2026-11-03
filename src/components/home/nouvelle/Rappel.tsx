/* Nouvelle home : la voie de secours du CTA de fin. Le bouton principal reste la prise de créneau (Cal.com) ;
   juste dessous, « Pas le temps de choisir ? On vous rappelle » déplie sur place un formulaire de trois champs
   (nom, téléphone, établissement). Le lead part par submitDemo, comme l'ancien formulaire de l'accueil. */
import { useId, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { usePostHog } from "posthog-js/react";

import { getAttribution } from "@/lib/attribution";
import { logDemoRequestDelivered, logDemoRequestDeliveryFailed } from "@/lib/posthogLogs";
import { submitDemo } from "@/lib/submitDemo";
import { useLanguage } from "./socle";

const copy = {
  fr: {
    ouvrir: "Pas le temps de choisir ? On vous rappelle",
    nom: "Prénom et nom",
    tel: "Téléphone",
    etab: "Établissement",
    etabPh: "Facultatif",
    envoyer: "Être rappelé",
    envoi: "Envoi…",
    note: "On vous rappelle sous 24 h ouvrées.",
    merci: "C’est noté : on vous rappelle sous 24 h ouvrées.",
    erreur: "L’envoi n’a pas marché. Réessayez, ou écrivez-nous à contact@getgranit.ai.",
  },
  en: {
    ouvrir: "No time to pick a slot? We’ll call you back",
    nom: "Full name",
    tel: "Phone",
    etab: "Organization",
    etabPh: "Optional",
    envoyer: "Call me back",
    envoi: "Sending…",
    note: "We’ll call you back within one business day.",
    merci: "Got it: we’ll call you back within one business day.",
    erreur: "Something went wrong. Try again, or email us at contact@getgranit.ai.",
  },
};

export function Rappel() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const posthog = usePostHog();
  const submit = useServerFn(submitDemo);
  const id = useId();
  const [ouvert, setOuvert] = useState(false);
  const [etat, setEtat] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");

  if (etat === "ok") {
    return (
      <p className="ct-rp-merci" role="status">
        <span className="ct-rp-coche" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path
              d="M3.4 8.5l2.9 2.9 6.3-6.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {t.merci}
      </p>
    );
  }

  return (
    <div className={"ct-rp" + (ouvert ? " is-open" : "")}>
      <button
        type="button"
        className="ct-rp-toggle"
        aria-expanded={ouvert}
        aria-controls={`${id}-form`}
        onClick={() => {
          if (!ouvert) posthog?.capture("demo_callback_opened", { placement: "bandeau_bas" });
          setOuvert(!ouvert);
        }}
      >
        {t.ouvrir}
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <form
        id={`${id}-form`}
        className="ct-rp-form"
        hidden={!ouvert}
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setEtat("envoi");
          try {
            await submit({
              data: {
                name: String(fd.get("name") || ""),
                email: "",
                phone: String(fd.get("phone") || ""),
                company: String(fd.get("company") || ""),
                challenge: "Demande de rappel (CTA de fin de l’accueil)",
                utm: getAttribution(),
              },
            });
            posthog?.capture("demo_request_submitted", { form_location: "homepage_rappel" });
            if (posthog) logDemoRequestDelivered(posthog, "homepage_rappel", undefined);
            setEtat("ok");
          } catch {
            if (posthog) logDemoRequestDeliveryFailed(posthog, "homepage_rappel");
            setEtat("erreur");
          }
        }}
      >
        <div className="ct-rp-champs">
          <label>
            <span>{t.nom}</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            <span>{t.tel}</span>
            <input name="phone" type="tel" required autoComplete="tel" pattern="[0-9 +().-]{9,}" />
          </label>
          <label>
            <span>{t.etab}</span>
            <input name="company" autoComplete="organization" placeholder={t.etabPh} />
          </label>
          <button type="submit" className="lm-btn ct-rp-envoyer" disabled={etat === "envoi"}>
            {etat === "envoi" ? t.envoi : t.envoyer}
          </button>
        </div>
        <p className="ct-rp-note" role={etat === "erreur" ? "alert" : undefined}>
          {etat === "erreur" ? t.erreur : t.note}
        </p>
      </form>
    </div>
  );
}
