/* Nouvelle home : la carte du CTA de fin, « Comment préférez-vous échanger ? ». Deux tuiles, un seul choix :
   « Je choisis un créneau » (par défaut) montre le bouton Cal.com ; « On me rappelle » montre le formulaire (nom, téléphone, email, métier).
   Une seule action visible à la fois, pour que les deux voies ne se disputent pas l'attention.
   Le rappel part par submitDemo, comme l'ancien formulaire de l'accueil. */
import { useEffect, useId, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { usePostHog } from "posthog-js/react";

import { getAttribution } from "@/lib/attribution";
import { logDemoRequestDelivered, logDemoRequestDeliveryFailed } from "@/lib/posthogLogs";
import { submitDemo } from "@/lib/submitDemo";
import { calcomDemoUrl, useLanguage } from "./socle";

const copy = {
  fr: {
    question: "Comment préférez-vous échanger ?",
    creneauT: "Je choisis un créneau",
    creneauS: "30 min, en visio ou par téléphone",
    rappelT: "On me rappelle",
    rappelS: "Sous 24 h ouvrées",
    creneauTexte: "Choisissez l’heure qui vous arrange : on regarde ensemble vos propres dossiers.",
    voir: "Voir les créneaux",
    nom: "Prénom et nom",
    tel: "Téléphone",
    email: "Email professionnel",
    metier: "Votre métier",
    choisir: "Choisir…",
    metiers: [
      "Opticien ou audioprothésiste",
      "Centre dentaire",
      "Centre de santé ou ophtalmologie",
      "Pharmacie",
      "Clinique ou laboratoire",
      "Autre",
    ],
    envoyer: "Être rappelé",
    envoi: "Envoi…",
    merci: "C’est noté : on vous rappelle sous 24 h ouvrées.",
    erreur: "L’envoi n’a pas marché. Réessayez, ou écrivez-nous à contact@getgranit.ai.",
  },
  en: {
    question: "How would you like to talk?",
    creneauT: "I’ll pick a time",
    creneauS: "30 min, by video or phone",
    rappelT: "Call me back",
    rappelS: "Within one business day",
    creneauTexte: "Pick the time that suits you: we’ll look at your own files together.",
    voir: "See available times",
    nom: "Full name",
    tel: "Phone",
    email: "Work email",
    metier: "Your specialty",
    choisir: "Choose…",
    metiers: [
      "Optician or hearing care",
      "Dental center",
      "Health center or ophthalmology",
      "Pharmacy",
      "Clinic or laboratory",
      "Other",
    ],
    envoyer: "Call me back",
    envoi: "Sending…",
    merci: "Got it: we’ll call you back within one business day.",
    erreur: "Something went wrong. Try again, or email us at contact@getgranit.ai.",
  },
};

type Voie = "creneau" | "rappel";

const FLECHE = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M5 11l6-6M6 4.6h5.4V10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function CarteContact() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const posthog = usePostHog();
  const submit = useServerFn(submitDemo);
  const id = useId();
  const [voie, setVoie] = useState<Voie>("creneau");
  /* le second bouton du hero (#rappel) ouvre directement le formulaire de rappel */
  useEffect(() => {
    const auHash = () => {
      if (window.location.hash === "#rappel") setVoie("rappel");
    };
    auHash();
    window.addEventListener("hashchange", auHash);
    return () => window.removeEventListener("hashchange", auHash);
  }, []);
  const [etat, setEtat] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");

  const choisir = (v: Voie) => {
    if (v !== voie)
      posthog?.capture("demo_contact_choice", { choice: v, placement: "bandeau_bas" });
    setVoie(v);
  };

  const tuile = (v: Voie, titre: string, sous: string) => (
    <label className={"ct-cc-tuile" + (voie === v ? " is-on" : "")}>
      <input
        type="radio"
        name={`${id}-voie`}
        value={v}
        checked={voie === v}
        onChange={() => choisir(v)}
      />
      <span className="ct-cc-rond" aria-hidden="true" />
      <span className="ct-cc-tt">
        <b>{titre}</b>
        <small>{sous}</small>
      </span>
    </label>
  );

  return (
    <div className="ct-cc">
      <fieldset className="ct-cc-choix">
        <legend className="ct-cc-q">{t.question}</legend>
        <div className="ct-cc-tuiles">
          {tuile("creneau", t.creneauT, t.creneauS)}
          {tuile("rappel", t.rappelT, t.rappelS)}
        </div>
      </fieldset>

      {voie === "creneau" ? (
        <div className="ct-cc-action" key="creneau">
          <p className="ct-cc-texte">{t.creneauTexte}</p>
          <a
            className="lm-btn ct-btn ct-cc-btn"
            href={calcomDemoUrl("bandeau_bas")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => posthog?.capture("demo_booking_clicked", { placement: "bandeau_bas" })}
          >
            {t.voir}
            {FLECHE}
          </a>
        </div>
      ) : etat === "ok" ? (
        <p className="ct-cc-action ct-cc-merci" role="status" key="merci">
          <span className="ct-cc-coche" aria-hidden="true">
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
      ) : (
        <form
          className="ct-cc-action ct-cc-form"
          key="rappel"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const orgType = String(fd.get("orgType") || "");
            setEtat("envoi");
            try {
              await submit({
                data: {
                  name: String(fd.get("name") || ""),
                  email: String(fd.get("email") || ""),
                  phone: String(fd.get("phone") || ""),
                  orgType,
                  challenge: "Demande de rappel (CTA de fin de l’accueil)",
                  utm: getAttribution(),
                },
              });
              posthog?.capture("demo_request_submitted", {
                form_location: "homepage_rappel",
                organization_type: orgType,
              });
              if (posthog) logDemoRequestDelivered(posthog, "homepage_rappel", orgType);
              setEtat("ok");
            } catch {
              if (posthog) logDemoRequestDeliveryFailed(posthog, "homepage_rappel");
              setEtat("erreur");
            }
          }}
        >
          <div className="ct-cc-champs">
            <label>
              <span>{t.nom}</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span>{t.tel}</span>
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                pattern="[0-9 +\(\)\.\-]{9,}"
              />
            </label>
            <label>
              <span>{t.email}</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>{t.metier}</span>
              <select name="orgType" required defaultValue="">
                <option value="" disabled>
                  {t.choisir}
                </option>
                {t.metiers.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="lm-btn ct-btn ct-cc-btn" disabled={etat === "envoi"}>
            {etat === "envoi" ? t.envoi : t.envoyer}
          </button>
          {etat === "erreur" && (
            <p className="ct-cc-erreur" role="alert">
              {t.erreur}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
