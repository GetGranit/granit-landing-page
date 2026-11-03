import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import {
  markPaulSheetShown,
  paulSheetAlreadyShown,
  type ContactRequest,
} from "@/lib/pec/essaiState";
import { inputClass } from "./ui";

const CALCOM =
  import.meta.env.VITE_PEC_CALCOM_URL || "https://cal.com/paul-pietra-granit/decouvrir-granit";

/**
 * Bandeau « en parler avec Paul » : bottom sheet NON bloquante (pas de fond
 * opaque, la page reste utilisable), réutilisable sur /pec.
 *
 * - mode "rappel"  → champ téléphone (1 tap si le numéro est déjà connu)
 * - mode "creneau" → bouton « Choisir un créneau »
 * Les deux appellent `onContact({ type, phone?, email? })` : c'est l'appelant
 * qui envoie le lead (ou ouvre l'agenda). `askEmail` : on ne connaît pas encore
 * l'e-mail, la fiche le demande avant d'envoyer quoi que ce soit.
 */

export type PaulSheetMode = ContactRequest["type"];

export type PaulSheetProps = {
  open: boolean;
  mode: PaulSheetMode;
  onClose: () => void;
  onContact: (req: ContactRequest) => void | Promise<void>;
  /** Numéro déjà connu : le rappel se fait en un tap. */
  knownPhone?: string | null;
  /** Phrase de contexte, selon le moment du parcours. */
  message?: string;
  /** E-mail inconnu : champ e-mail obligatoire dans la fiche. */
  askEmail?: boolean;
};

const copy = {
  fr: {
    dialog: "En parler avec Paul",
    qui: "Paul, de l'équipe Granit",
    noteRappel: "C'est noté. Paul vous rappelle sous 24 h ouvrées.",
    noteCreneau: "Choisissez votre créneau dans l'onglet qui vient de s'ouvrir.",
    defaut: "Une question ? On peut le faire ensemble, au téléphone.",
    fermer: "Fermer",
    emailPlaceholder: "contact@votre-magasin.fr",
    email: "Votre e-mail",
    emailInvalide: "Indiquez votre e-mail : c'est là que Paul vous répond.",
    telPlaceholder: "06 12 34 56 78",
    tel: "Votre numéro de téléphone",
    au: (n: string) => `Au ${n} · `,
    autre: "autre numéro",
    incomplet: "Ce numéro ne semble pas complet.",
    envoi: "Envoi…",
    rappelez: "Rappelez-moi",
    creneau: "Choisir un créneau",
    echec: "Ça n'est pas parti. Réessayez dans un instant.",
  },
  en: {
    dialog: "Talk to Paul",
    qui: "Paul, from the Granit team",
    noteRappel: "Got it. Paul calls you back within 24 business hours.",
    noteCreneau: "Pick your slot in the tab that just opened.",
    defaut: "A question? We can do it together, over the phone.",
    fermer: "Close",
    emailPlaceholder: "contact@your-store.com",
    email: "Your email",
    emailInvalide: "Enter your email: that is where Paul replies.",
    telPlaceholder: "+33 6 12 34 56 78",
    tel: "Your phone number",
    au: (n: string) => `At ${n} · `,
    autre: "another number",
    incomplet: "This number does not look complete.",
    envoi: "Sending…",
    rappelez: "Call me back",
    creneau: "Pick a slot",
    echec: "It did not go through. Try again in a moment.",
  },
};

const PHONE_RE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function PaulSheet({
  open,
  mode,
  onClose,
  onContact,
  knownPhone,
  message,
  askEmail,
}: PaulSheetProps) {
  const reduce = useReducedMotion();
  const t = copy[useLanguage().lang];
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-modal="false"
          aria-label={t.dialog}
          initial={reduce ? { opacity: 0 } : { y: "110%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "110%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[520px] px-3 pb-3"
        >
          <div
            className="rounded-[22px] border bg-white p-5"
            style={{
              borderColor: "var(--border)",
              boxShadow: "0 -10px 40px -12px rgba(28,17,8,0.25)",
            }}
          >
            {/* key : remet le formulaire à zéro à chaque ouverture */}
            <SheetBody
              key={`${mode}-${message ?? ""}`}
              mode={mode}
              onClose={onClose}
              onContact={onContact}
              knownPhone={knownPhone}
              message={message}
              askEmail={askEmail}
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function SheetBody({
  mode,
  onClose,
  onContact,
  knownPhone,
  message,
  askEmail,
}: Omit<PaulSheetProps, "open">) {
  const t = copy[useLanguage().lang];
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editPhone, setEditPhone] = useState(!knownPhone);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [invalid, setInvalid] = useState(false);
  const [emailInvalide, setEmailInvalide] = useState(false);

  /** E-mail à joindre à la demande ; `null` s'il manque (le message d'erreur s'affiche). */
  function emailSaisi(): string | undefined | null {
    if (!askEmail) return undefined;
    if (EMAIL_RE.test(email.trim())) return email.trim();
    setEmailInvalide(true);
    return null;
  }

  async function send(req: ContactRequest) {
    setStatus("sending");
    try {
      await onContact(req);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function submitRappel() {
    const value = editPhone ? phone.trim() : (knownPhone ?? "");
    const mail = emailSaisi();
    if (!PHONE_RE.test(value)) {
      setInvalid(true);
      return;
    }
    if (mail === null) return;
    void send({ type: "rappel", phone: value, email: mail });
  }

  return (
    <>
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-[20px] text-white"
          style={{ background: "var(--gradient-terra)" }}
        >
          P
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            {t.qui}
          </p>
          <p className="mt-0.5 text-[14px] leading-[1.45]" style={{ color: "var(--text-soft)" }}>
            {status === "done"
              ? mode === "rappel"
                ? t.noteRappel
                : t.noteCreneau
              : (message ?? t.defaut)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.fermer}
          className="-mr-1 -mt-1 rounded-full p-2 text-[18px] leading-none"
          style={{ color: "var(--text-muted)" }}
        >
          ×
        </button>
      </div>

      {status !== "done" && askEmail && (
        <div className="mt-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t.emailPlaceholder}
            aria-label={t.email}
            aria-invalid={emailInvalide || undefined}
            aria-describedby={emailInvalide ? "paul-email-erreur" : undefined}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailInvalide(false);
            }}
            className={inputClass}
            style={{ borderColor: emailInvalide ? "var(--terra)" : "var(--border)" }}
          />
          {emailInvalide && (
            <p
              id="paul-email-erreur"
              role="alert"
              className="mt-1.5 text-[12px]"
              style={{ color: "var(--terra-hover)" }}
            >
              {t.emailInvalide}
            </p>
          )}
        </div>
      )}

      {status !== "done" && mode === "rappel" && (
        <div className="mt-4">
          {editPhone ? (
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t.telPlaceholder}
              aria-label={t.tel}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? "paul-tel-erreur" : undefined}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setInvalid(false);
              }}
              className={inputClass}
              style={{ borderColor: invalid ? "var(--terra)" : "var(--border)" }}
            />
          ) : (
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              {t.au(knownPhone ?? "")}
              <button type="button" className="underline" onClick={() => setEditPhone(true)}>
                {t.autre}
              </button>
            </p>
          )}
          {invalid && (
            <p
              id="paul-tel-erreur"
              role="alert"
              className="mt-1.5 text-[12px]"
              style={{ color: "var(--terra-hover)" }}
            >
              {t.incomplet}
            </p>
          )}
          <button
            type="button"
            onClick={submitRappel}
            disabled={status === "sending"}
            className="btn-primary mt-3 w-full justify-center py-3 text-[15px]"
          >
            {status === "sending" ? t.envoi : t.rappelez}
          </button>
        </div>
      )}

      {status !== "done" && mode === "creneau" && (
        <button
          type="button"
          onClick={() => {
            const mail = emailSaisi();
            if (mail === null) return;
            // Le calendrier s'ouvre dans le geste du clic (sinon le navigateur le bloque).
            window.open(CALCOM, "_blank", "noopener,noreferrer");
            void send({ type: "creneau", phone: knownPhone ?? undefined, email: mail });
          }}
          disabled={status === "sending"}
          className="btn-primary mt-4 w-full justify-center py-3 text-[15px]"
        >
          {status === "sending" ? t.envoi : t.creneau}
        </button>
      )}

      {status === "error" && (
        <p
          role="alert"
          className="mt-2 text-center text-[12px]"
          style={{ color: "var(--terra-hover)" }}
        >
          {t.echec}
        </p>
      )}
    </>
  );
}

/**
 * Pilotage du bandeau. `show()` sans `force` (déclencheur automatique) ne
 * l'ouvre qu'une fois par session ; `force: true` pour un clic explicite.
 */
export function usePaulSheet() {
  const [state, setState] = useState<{ open: boolean; mode: PaulSheetMode; message?: string }>({
    open: false,
    mode: "creneau",
  });

  const show = useCallback((mode: PaulSheetMode, message?: string, opts?: { force?: boolean }) => {
    if (!opts?.force && paulSheetAlreadyShown()) return;
    markPaulSheetShown();
    setState({ open: true, mode, message });
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return { ...state, show, close };
}
